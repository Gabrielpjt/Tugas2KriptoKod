import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput, StyleSheet } from 'react-native'; // Tambahkan Alert dari react-native
import * as DocumentPicker from 'expo-document-picker'; // Perbaiki import dari expo-document-picker
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

const FilePickerExample = () => {
	const [fileContent, setFileContent] = useState(null);
	const [fileName, setFileName] = useState('');
	const [fileMime, setFileMime] = useState('');
	const [keyword, setKeyword] = useState('');

	// Function to encode a string to base64
	const base64Encode = (str) => {
		return Buffer.from(str, 'binary').toString('base64');
	};

	// Function to decode a base64 string to a string
	const base64Decode = (str) => {
		return Buffer.from(str, 'base64').toString('binary');
	};

	const generateRC4Key = (key) => {
		const keyArray = [];
		for (let i = 0; i < 256; i++) {
			keyArray[i] = key.charCodeAt(i % key.length);
		}
		return keyArray;
	};

	const decryptRC4 = (text, key) => {
		let keyArray = generateRC4Key(key);
		let result = '';
		let j = 0;

		let sbox = [];
		for (let i = 0; i < 256; i++) {
			sbox[i] = i;
		}

		for (let i = 0; i < 256; i++) {
			j = (j + sbox[i] + keyArray[i % keyArray.length]) % 256;
			let temp = sbox[i];
			sbox[i] = sbox[j];
			sbox[j] = temp;
		}

		let i = 0;
		j = 0;
		for (let idx = 0; idx < text.length; idx++) {
			i = (i + 1) % 256;
			j = (j + sbox[i]) % 256;
			let temp = sbox[i];
			sbox[i] = sbox[j];
			sbox[j] = temp;
			let k = sbox[(sbox[i] + sbox[j]) % 256];
			result += String.fromCharCode(text.charCodeAt(idx) ^ k);
		}
		return result;
	};

	const decryptVigenere = (text, keyword) => {
		let decryptedText = '';
		for (let i = 0; i < text.length; i++) {
			const keyIndex = i % keyword.length;
			const keyChar = keyword.charCodeAt(keyIndex) - 32;
			const textChar = text.charCodeAt(i) - keyChar;
			decryptedText += String.fromCharCode(textChar);
		}
		return decryptedText;
	};

	const handleDecrypt = async () => {
		if (!fileContent || !keyword) {
			Alert.alert('Error', 'File and keyword are required');
			return;
		}

		const rc4Decrypted = decryptVigenere(fileContent, keyword);
		const finalDecrypted = base64Encode(decryptRC4(rc4Decrypted, keyword));

		const permissions =
			await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

		if (permissions.granted) {
			const directoryUri = permissions.directoryUri;

			const encryptedFileUri =
				await FileSystem.StorageAccessFramework.createFileAsync(
					directoryUri,
					'decrypted',
					fileMime
				);

			await FileSystem.writeAsStringAsync(encryptedFileUri, finalDecrypted, {
				encoding: 'base64',
			});
		}
	};

	const pickFile = async () => {
		try {
			const res = await DocumentPicker.getDocumentAsync();
			if (!res.canceled) {
				// Jika pemilihan file berhasil
				const fileData = await readFileContent(res.assets[0].uri);
				setFileContent(fileData);
				setFileName(res.assets[0].name);
				setFileMime(res.assets[0].mimeType);
			} else {
				// Jika pengguna membatalkan pemilihan file
				console.log('Pemilihan file dibatalkan');
			}
		} catch (err) {
			// Tangani kesalahan jika terjadi
			console.error('Error picking file:', err);
			Alert.alert('Error', 'Gagal memilih file');
		}
	};

	const readFileContent = async (uri) => {
		try {
			const data = await FileSystem.readAsStringAsync(uri, {
				encoding: 'base64',
			});
			return base64Decode(data);
		} catch (error) {
			console.error('Error reading file:', error);
			Alert.alert('Error', 'Gagal membaca file');
			return null;
		}
	};

	return (
		<View style={styles.container}>
			<Button title='Pilih File' onPress={pickFile} />
			{fileName && (
				<View style={{ marginTop: 5, marginBottom: 5 }}>
					<Text>File {fileName} terpilih</Text>
				</View>
			)}
			<TextInput
				placeholder='Enter decryption key'
				value={keyword}
				onChangeText={setKeyword}
				style={styles.input}
			/>
			<Button title='Decrypt' onPress={handleDecrypt} />
		</View>
	);
};

export default FilePickerExample;

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginTop: 10,
		marginBottom: 15,
		width: '100%',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
});
