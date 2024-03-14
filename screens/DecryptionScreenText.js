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

const DecryptionScreenText = () => {
	const [encryptedText, setEncryptedText] = useState('');
	const [keyword, setKeyword] = useState('');
	const [decryptedText, setDecryptedText] = useState('');

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

	const handleDecrypt = () => {
		if (!encryptedText || !keyword) {
			Alert.alert('Error', 'Encrypted text and keyword are required');
			return;
		}

		const rc4Decrypted = decryptVigenere(encryptedText, keyword);
		const finalDecrypted = decryptRC4(rc4Decrypted, keyword);
		setDecryptedText(finalDecrypted);
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder='Enter encrypted text'
				value={encryptedText}
				onChangeText={setEncryptedText}
			/>
			<TextInput
				style={styles.input}
				placeholder='Enter decryption key'
				value={keyword}
				onChangeText={setKeyword}
			/>
			<Button title='Decrypt' onPress={handleDecrypt} />
			{decryptedText ? (
				<View style={styles.outputContainer}>
					<Text style={styles.label}>Decrypted Text:</Text>
					<Text style={styles.info}>(Click to Copy)</Text>
					<Text style={styles.output}>{decryptedText}</Text>
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
		marginBottom: 10,
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
		marginTop: 10,
		width: '100%',
		textAlign: 'center',
	},
});

export default DecryptionScreenText;
