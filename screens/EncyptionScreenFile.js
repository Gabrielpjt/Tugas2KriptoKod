import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native'; // Tambahkan Alert dari react-native
import * as DocumentPicker from 'expo-document-picker'; // Perbaiki import dari expo-document-picker

const FilePickerExample = () => {
  const [fileContent, setFileContent] = useState(null);

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'text/plain', // Tipe file yang diizinkan, misalnya 'text/plain' untuk file teks
      });

      if (res.type === 'success') {
        // Jika pemilihan file berhasil
        const fileData = await readFileContent(res.uri);
        setFileContent(fileData);
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
      const response = await fetch(uri);
      const fileContent = await response.text();
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error);
      Alert.alert('Error', 'Gagal membaca file');
      return null;
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pilih File" onPress={pickFile} />
      {fileContent && (
        <View style={{ marginTop: 20 }}>
          <Text>Isi File:</Text>
          <Text>{fileContent}</Text>
        </View>
      )}
    </View>
  );
};

export default FilePickerExample;
