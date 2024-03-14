import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const MenuScreen = ({ navigation }) => {
	return (
		<>
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('EncryptionText')}
				>
					<Text style={styles.buttonText}>Text Encryption</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('DecryptionText')}
				>
					<Text style={styles.buttonText}>Text Decryption</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('EncryptionFile')}
				>
					<Text style={styles.buttonText}>File Encryption</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.button}
					onPress={() => navigation.navigate('FileDecryption')}
				>
					<Text style={styles.buttonText}>File Decryption</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.footer}>
				<Text style={styles.footerText}>II4031 Kriptografi dan Koding</Text>
				<Text style={styles.footerText}>18221133 & 18221159</Text>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footerText: {
		fontSize: 16,
		fontWeight: '300',
		marginVertical: 3,
	},
	button: {
		backgroundColor: '#007bff',
		paddingVertical: 15,
		paddingHorizontal: 30,
		marginVertical: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
	},
});

export default MenuScreen;
