// app/components/chat/DoctorList.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme, makeDoctorListStyles } from '../styles/themes';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Doctor {
  doctorID: number;
  userId: number;
  fullName: string;
  specialty?: string;
  // Add other doctor properties as needed
}

interface DoctorListProps {
  onSelectDoctor: (id: number, name: string) => void;
  selectedDoctorId?: number | null;
}

export default function DoctorList({ onSelectDoctor, selectedDoctorId }: DoctorListProps) {
  const { theme } = useTheme();
  const styles = makeDoctorListStyles(theme);
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
    {doctors.map(doctor => (
      <TouchableOpacity
        key={doctor.doctorID}
        style={[
          styles.doctorItem,
          selectedDoctorId === doctor.userId && {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primaryDark
          }
        ]}
        onPress={() => onSelectDoctor(doctor.userId, doctor.fullName)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.doctorName,
            selectedDoctorId === doctor.userId && styles.selectedDoctorName
          ]}
        >
          {doctor.fullName}
        </Text>
        {doctor.specialty && (
          <Text
            style={[
              styles.doctorSpecialty,
              selectedDoctorId === doctor.userId && styles.selectedDoctorText
            ]}
          >
            {doctor.specialty}
          </Text>
        )}
      </TouchableOpacity>
    ))}
  </View>
);
}