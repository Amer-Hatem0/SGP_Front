import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useTheme } from '../../../styles/themes';
import { Picker } from '@react-native-picker/picker';

interface Patient {
  patientId: string;
  fullName: string;
  gender: string;
}

interface Visit {
  appointmentDate: string;
  doctorName: string;
  status: string;
}

interface MedicalHistory {
  disease: string;
  treatment: string;
  notes: string;
  recordedAt: string;
}

interface Report {
  fileUrl: string;
  fileName: string;
}

interface PatientHistory {
  fullName: string;
  age: number;
  gender: string;
  visits: Visit[];
  medicalHistories: MedicalHistory[];
}

export default function PatientDetails() {
  const [patientId, setPatientId] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [history, setHistory] = useState<PatientHistory | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
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
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PatientFullHistory/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      alert('Patient not found or error fetching data.');
    }
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PatientReports/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePatientChange = (value: string) => {
    setPatientId(value);
    setHistory(null);
    setReports([]);
  };

  const showReport = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const handleShowHistory = () => {
    if (patientId) {
      fetchHistory();
      fetchReports();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Patient Full Details</Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Select Patient</Text>
        <View style={[styles.pickerContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Picker
            selectedValue={patientId}
            onValueChange={handlePatientChange}
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

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleShowHistory}
          disabled={!patientId}
        >
          <Text style={styles.buttonText}>Show History</Text>
        </TouchableOpacity>
      </View>

      {history && (
        <View style={styles.content}>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>🧑‍⚕️ {history.fullName}</Text>
            <Text style={[styles.text, { color: theme.colors.text }]}><Text style={styles.bold}>Age:</Text> {history.age}</Text>
            <Text style={[styles.text, { color: theme.colors.text }]}><Text style={styles.bold}>Gender:</Text> {history.gender}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>📅 Appointments</Text>
            <View style={styles.list}>
              {history.visits?.map((visit, idx) => (
                <View key={idx} style={[styles.item, { backgroundColor: theme.colors.backgroundSecondary }]}>
                  <Text style={[styles.text, { color: theme.colors.text }]}>
                    🗓️ <Text style={styles.bold}>{formatDate(visit.appointmentDate)}</Text>
                  </Text>
                  <Text style={[styles.text, { color: theme.colors.text }]}>Doctor: {visit.doctorName}</Text>
                  <Text style={[styles.text, { color: theme.colors.text }]}>
                    Status: <Text style={styles.bold}>{visit.status}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>📄 Medical History</Text>
            <View style={styles.list}>
              {history.medicalHistories?.map((record, idx) => (
                <View key={idx} style={[styles.item, { backgroundColor: theme.colors.backgroundSecondary }]}>
                  <Text style={[styles.text, { color: theme.colors.text }]}>
                    <Text style={styles.bold}>Diagnosis:</Text> {record.disease}
                  </Text>
                  <Text style={[styles.text, { color: theme.colors.text }]}>
                    <Text style={styles.bold}>Treatment:</Text> {record.treatment}
                  </Text>
                  <Text style={[styles.text, { color: theme.colors.text }]}>
                    <Text style={styles.bold}>Note:</Text> {record.notes}
                  </Text>
                  <Text style={[styles.smallText, { color: theme.colors.textSecondary }]}>
                    {formatDate(record.recordedAt)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.subtitle, { color: theme.colors.text }]}>📁 Uploaded Reports</Text>
            {reports.length === 0 ? (
              <Text style={[styles.text, { color: theme.colors.text }]}>No reports found.</Text>
            ) : (
              <View style={styles.list}>
                {reports.map((rpt, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.reportItem, { backgroundColor: theme.colors.backgroundSecondary }]}
                    onPress={() => showReport(rpt.fileUrl)}
                  >
                    <Text style={[styles.text, { color: theme.colors.primary }]}>📎 {rpt.fileName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
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
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#3182ce',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    marginTop: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  list: {
    marginTop: 8,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  reportItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
  },
  smallText: {
    fontSize: 12,
    marginTop: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
});