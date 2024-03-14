import React, { useState } from 'react';
import {
	View,
	TextInput,
	Button,
	Text,
	StyleSheet,
	Alert,
	TouchableOpacity,
	Clipboard,
} from 'react-native'; // Menggunakan Clipboard dari 'react-native'
import * as FileSystem from 'expo-file-system';

const EncryptionScreenText = () => {
	const [inputText, setInputText] = useState('');
	const [keyword, setKeyword] = useState('');
	const [encryptedText, setEncryptedText] = useState('');
	const [copiedText, setCopiedText] = useState(false);

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

	const handleEncrypt = () => {
		if (!inputText || !keyword) {
			Alert.alert('Error', 'Input text and keyword are required');
			return;
		}

		const rc4Encrypted = encryptRC4(inputText, keyword);
		const finalEncrypted = encryptVigenere(rc4Encrypted, keyword);
		setEncryptedText(finalEncrypted);
	};

	const copyToClipboard = () => {
		Clipboard.setString(encryptedText);
		setCopiedText(true);
	};

	const downloadFile = async () => {
		const permissions =
			await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

		if (permissions.granted) {
			const directoryUri = permissions.directoryUri;

			const encryptedFileUri =
				await FileSystem.StorageAccessFramework.createFileAsync(
					directoryUri,
					'encrypted',
					'text/plain'
				);

			await FileSystem.writeAsStringAsync(encryptedFileUri, encryptedText, {
				encoding: 'utf8',
			});
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='Enter text to encrypt'
				value={inputText}
				onChangeText={setInputText}
			/>
			<TextInput
				style={styles.input}
				placeholder='Enter encryption key'
				value={keyword}
				onChangeText={setKeyword}
			/>
			<Button
				title='Encrypt'
				onPress={handleEncrypt}
				disabled={encryptedText.length !== 0}
			/>
			{encryptedText ? (
				<View style={styles.outputContainer}>
					<Text style={styles.label}>Encrypted Text:</Text>
					<Text style={styles.info}>(Click to Copy)</Text>
					<TouchableOpacity onPress={copyToClipboard}>
						<Text style={styles.output}>{encryptedText}</Text>
					</TouchableOpacity>
					{copiedText && (
						<Text style={styles.copiedText}>Copied to Clipboard!</Text>
					)}
					<Button title='Download as txt file' onPress={downloadFile} />
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		width: '100%',
	},
	outputContainer: {
		alignItems: 'center',
	},
	label: {
		marginTop: 20,
		fontSize: 16,
		fontWeight: 'bold',
	},
	info: {
		marginTop: 7,
		fontSize: 14,
	},
	output: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginVertical: 10,
		width: '100%',
		textAlign: 'center',
	},
	copiedText: {
		marginBottom: 15,
		color: 'green',
	},
});

export default EncryptionScreenText;
