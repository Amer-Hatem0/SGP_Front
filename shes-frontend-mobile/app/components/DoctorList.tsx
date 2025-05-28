// app/components/chat/DoctorList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../styles/themes';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Doctor {
  doctorID: number;
  userId: number;
  fullName: string;
  // Add other doctor properties as needed
}

interface DoctorListProps {
  onSelectDoctor: (id: number, name: string) => void;
  selectedDoctorId?: number | null;
}

export default function DoctorList({ onSelectDoctor, selectedDoctorId }: DoctorListProps) {
  const { theme } = useTheme();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) {
          setError('User not authenticated');
          return;
        }

        const token = JSON.parse(userData).token;
        const res = await axios.get(`${API_BASE_URL}/Patient/GetAllDoctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {doctors.map(doc => (
        <TouchableOpacity
          key={doc.doctorID}
          style={[
            styles.doctorItem,
            selectedDoctorId === doc.userId && { 
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary
            }
          ]}
          onPress={() => onSelectDoctor(doc.userId, doc.fullName)}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.doctorName,
              selectedDoctorId === doc.userId && { color: 'white' }
            ]}
          >
            {doc.fullName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  doctorItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  doctorName: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
});