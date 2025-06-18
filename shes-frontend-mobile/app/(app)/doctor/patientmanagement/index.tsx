import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useTheme } from '../../../styles/themes';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

interface Patient {
  patientId: string;
  fullName: string;
  gender: string;
}

export default function PatientManagement() {
  const [note, setNote] = useState('');
  const [treatment, setTreatment] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [reportFile, setReportFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [reportDescription, setReportDescription] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const {theme} = useTheme();

  useEffect(() => {
    const getToken = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setToken(parsedUser.token);
        }
      } catch (err) {
        console.error('Error retrieving token:', err);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchPatients();
    }
  }, [token]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyPatients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch patients');
    }
  };

  const handleAddNote = async () => {
    try {
      await axios.post(`${API_BASE_URL}/Doctor/AddPatientNote`, {
        patientId: parseInt(patientId),
        note,
        treatment,
        diagnosis
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Note added successfully');
      setNote('');
      setTreatment('');
      setDiagnosis('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to add note');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (!result.canceled) {
        setReportFile(result);
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const handleUploadReport = async () => {
    if (!reportFile || !patientId) {
      Alert.alert('Error', 'Please select a patient and file');
      return;
    }

    try {
      const fileUri = reportFile.assets?.[0]?.uri;
      const fileInfo = await FileSystem.getInfoAsync(fileUri ?? "");
      
      if (!fileInfo.exists) {
        throw new Error('File does not exist');
      }

      const formData = new FormData();
      formData.append('PatientId', patientId);
      formData.append('Description', reportDescription);
      
      // @ts-ignore - React Native's FormData typing doesn't match axios expectations
      formData.append('ReportFile', {
        uri: fileUri,
        name: reportFile.assets?.[0].name,
        type: reportFile.assets?.[0].mimeType || 'application/octet-stream',
      });

      await axios.post(`${API_BASE_URL}/Doctor/UploadPatientReport`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Report uploaded successfully');
      setReportFile(null);
      setReportDescription('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to upload report');
    }
  };

  const noteOptions = [
    { label: '-- Choose Note --', value: '' },
    { label: 'Follow-up Required', value: 'Follow-up Required' },
    { label: 'Patient is Stable', value: 'Patient is Stable' },
    { label: 'Needs Imaging', value: 'Needs Imaging' },
    { label: 'Medication Adjustment', value: 'Medication Adjustment' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Patient Management</Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Select Patient</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Picker
            selectedValue={patientId}
            onValueChange={(value) => setPatientId(value)}
            style={[styles.picker, { color: theme.colors.text }]}
            
          >
            <Picker.Item label="-- Choose Patient --" value="" />
            {patients.map(p => (
              <Picker.Item 
                key={p.patientId} 
                label={`${p.fullName} (${p.gender})`} 
                value={p.patientId} 
              />
            ))}
          </Picker>
        </View>

        <Text style={[styles.label, { color: theme.colors.text }]}>Select Note:</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Picker
            selectedValue={note}
            onValueChange={(value) => setNote(value)}
            style={[styles.picker, { color: theme.colors.text }]}
          >
            {noteOptions.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>

        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.text 
          }]}
          placeholder="Diagnosis"
          placeholderTextColor={theme.colors.textSecondary}
          value={diagnosis}
          onChangeText={setDiagnosis}
        />

        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.text 
          }]}
          placeholder="Treatment"
          placeholderTextColor={theme.colors.textSecondary}
          value={treatment}
          onChangeText={setTreatment}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddNote}
          disabled={!patientId}
        >
          <Text style={styles.buttonText}>Add Note</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { color: theme.colors.text }]}>Upload Report (PDF/Image)</Text>
        <TouchableOpacity
          style={[styles.fileButton, { backgroundColor: theme.colors.backgroundSecondary }]}
          onPress={pickDocument}
        >
          <Text style={{ color: theme.colors.text }}>
            {reportFile ? reportFile.assets?.[0].name : 'Select File'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.text 
          }]}
          placeholder="Report Description"
          placeholderTextColor={theme.colors.textSecondary}
          value={reportDescription}
          onChangeText={setReportDescription}
        />

        <TouchableOpacity
          style={[styles.button, { 
            backgroundColor: !patientId || !reportFile ? theme.colors.disabled : theme.colors.primary 
          }]}
          onPress={handleUploadReport}
          disabled={!patientId || !reportFile}
        >
          <Text style={styles.buttonText}>Upload Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: 'white'
  },
  picker: {
    height: 50,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fileButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
});