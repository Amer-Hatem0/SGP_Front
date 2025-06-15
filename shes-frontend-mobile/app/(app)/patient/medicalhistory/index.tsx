// app/(app)/patient/reports/index.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useTheme, makeStyles, makeMedicalStyles } from '../../../styles/themes';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MedicalEntry {
  diagnosis: string;
  treatment: string;
  visitDate: string;
  doctorName: string;
  note?: string;
}

export default function MedicalHistory() {
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const medicalStyles = makeMedicalStyles(theme);
  const [history, setHistory] = useState<MedicalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          setError('Authentication required');
          return;
        }

        const token = JSON.parse(userData).token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        const [patientRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/Patient/MedicalHistory/${userId}`, { // Assuming endpoint can take userId directly
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setHistory(historyRes.data);
      } catch (error) {
        console.error("Failed to fetch medical history:", error);
        setError('Failed to load medical history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View style={medicalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={medicalStyles.errorContainer}>
        <Text style={[medicalStyles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.patientContainer}>
      <ScrollView 
        contentContainerStyle={medicalStyles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={medicalStyles.title}>Medical History</Text>

        {history.length === 0 ? (
          <Text style={medicalStyles.emptyText}>No medical history found.</Text>
        ) : (
          history.map((entry, index) => (
            <View 
              key={`entry-${index}`} 
              style={medicalStyles.card}
            >
              <Text style={medicalStyles.cardTitle}>
                Diagnosis: <Text style={medicalStyles.cardValue}>{entry.diagnosis}</Text>
              </Text>
              <Text style={medicalStyles.entry}>
                <Text style={medicalStyles.label}>Treatment:</Text> {entry.treatment}
              </Text>
              <Text style={medicalStyles.entry}>
                <Text style={medicalStyles.label}>Visit Date:</Text> {new Date(entry.visitDate).toLocaleDateString()}
              </Text>
              <Text style={medicalStyles.entry}>
                <Text style={medicalStyles.label}>Doctor:</Text> {entry.doctorName}
              </Text>
              {entry.note && (
                <Text style={medicalStyles.entry}>
                  <Text style={medicalStyles.label}>Note:</Text> {entry.note}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Medical History specific styles
