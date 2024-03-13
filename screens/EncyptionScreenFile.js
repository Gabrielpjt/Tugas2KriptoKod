import React, { useState } from 'react';
import { View, Text, Button, Alert, TextInput } from 'react-native'; // Tambahkan Alert dari react-native
import * as DocumentPicker from 'expo-document-picker'; // Perbaiki import dari expo-document-picker
import * as FileSystem from 'expo-file-system';

const FilePickerExample = () => {
	const [fileContent, setFileContent] = useState(null);
	const [fileUri, setFileUri] = useState('');
	const [fileMime, setFileMime] = useState('');
	const [keyword, setKeyword] = useState('');

	const generateRC4Key = (key) => {
		const keyArray = [];
		for (let i = 0; i < 256; i++) {
			keyArray[i] = key.charCodeAt(i % key.length);
		}
		return keyArray;
	};

	const encryptRC4 = (text, key) => {
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

	const encryptVigenere = (text, keyword) => {
		let encryptedText = '';
		for (let i = 0; i < text.length; i++) {
			const keyIndex = i % keyword.length;
			const keyChar = keyword.charCodeAt(keyIndex) - 32;
			const textChar = text.charCodeAt(i) + keyChar;
			encryptedText += String.fromCharCode(textChar);
		}
		return encryptedText;
	};

	const handleEncrypt = async () => {
		if (!fileContent || !keyword) {
			Alert.alert('Error', 'File and keyword are required');
			return;
		}

		// const rc4Encrypted = encryptRC4(inputText, keyword);
		// const finalEncrypted = encryptVigenere(rc4Encrypted, keyword);
		// setEncryptedText(finalEncrypted);

		const permissions =
			await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

		if (permissions.granted) {
			const directoryUri = permissions.directoryUri;

			const encryptedFileUri =
				await FileSystem.StorageAccessFramework.createFileAsync(
					directoryUri,
					'encrypted',
					fileMime
				);

			await FileSystem.writeAsStringAsync(encryptedFileUri, fileContent, {
				encoding: 'utf8',
			});
		}
	};

	const pickFile = async () => {
		try {
			const res = await DocumentPicker.getDocumentAsync();
			if (res.assets[0].name) {
				// Jika pemilihan file berhasil
				const fileData = await readFileContent(res.assets[0].uri);
				setFileContent(fileData);
				setFileUri(res.assets[0].uri);
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
				encoding: 'utf8',
			});
			return data;
		} catch (error) {
			console.error('Error reading file:', error);
			Alert.alert('Error', 'Gagal membaca file');
			return null;
		}
	};

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Button title='Pilih File' onPress={pickFile} />
			{fileContent && (
				<View style={{ marginTop: 20 }}>
					<Text>File terpilih</Text>
				</View>
			)}

			<TextInput
				placeholder='Enter encryption key'
				value={keyword}
				onChangeText={setKeyword}
			/>
			<Button title='Encrypt' onPress={handleEncrypt} />
		</View>
	);
};

export default FilePickerExample;
