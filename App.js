import React from 'react';
// import { AppRegistry } from 'react-native';
// import { name as appName } from './app.json'; // Make sure this matches your app name in app.json
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EncryptionScreenText from './screens/EncryptionScreenText.js';
import EncryptionScreenFile from './screens/EncyptionScreenFile.js';
import OptionEnDe from './screens/OptionEnDe.js';
import DecryptionScreenText from './screens/DecryptionScreenText.js';

// AppRegistry.registerComponent(appName, () => EncryptionScreenText);

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen
					name='OptionEnDe'
					component={OptionEnDe}
					options={{ title: 'Modified RC4 Encryption & Decryption' }}
				/>
				<Stack.Screen
					name='EncryptionText'
					component={EncryptionScreenText}
					options={{ title: 'Encryption with Text' }}
				/>
				<Stack.Screen
					name='EncryptionFile'
					component={EncryptionScreenFile}
					options={{ title: 'Encryption with File' }}
				/>
				<Stack.Screen
					name='DecryptionText'
					component={DecryptionScreenText}
					options={{ title: 'Decryption with Text' }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
