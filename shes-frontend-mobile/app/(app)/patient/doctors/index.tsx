import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useTheme, makeDoctorStyles } from '../../../styles/themes';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Doctor = {
  doctorId: number;
  fullName: string;
  specialization: string;
  gender: string;
  email: string;
};

export default function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [bookingDoctorId, setBookingDoctorId] = useState<number | null>(null);
  const [appointmentData, setAppointmentData] = useState({ date: '', time: '' });
  const { theme } = useTheme();
  const styles = makeDoctorStyles(theme);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const { token } = JSON.parse(userData || '{}');
        const res = await axios.get(`${API_BASE_URL}/Patient/Doctors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(res.data);
      } catch (err) {
        Alert.alert("Error", "Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (doctorId: number) => {
  try {
    const userData = await AsyncStorage.getItem('user');
    const { token } = JSON.parse(userData || '{}');
    
    // Add patient ID fetching logic (matches web version)
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = parseInt(decoded.userId || decoded.sub);
    const patientRes = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await axios.post(`${API_BASE_URL}/Appointment/Book`, {
      doctorId,
      patientId: patientRes.data.patientId,
      dateTime: new Date(`${appointmentData.date}T${appointmentData.time}`),
      status: "Pending",
      notes: "Booked from mobile app"
    }, { headers: { Authorization: `Bearer ${token}` } });

    Alert.alert("Success", "Appointment booked!");
  } catch (error) {
    Alert.alert("Error", "Booking failed");
  }
};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Available Doctors</Text>

        <View style={{ gap: theme.spacing.lg }}>
          {doctors.map((doc, index) => (
            <View key={doc.doctorId} style={styles.doctorCard}>
            <Image
              source={{ uri: `https://i.pravatar.cc/150?img=${index + 10}` }}
              style={styles.avatar}
            />
              <Text style={styles.doctorName}>{doc.fullName}</Text>
              {/* Specialization with label */}
  <Text style={{ textAlign: 'center', marginTop: 8 }}>
    <Text style={{ fontWeight: '600', color: theme.colors.text }}>
      Specialization:{' '}
    </Text>
    <Text style={{ color: theme.colors.primary }}>
      {doc.specialization || "General Practitioner"}
    </Text>
  </Text>
  
  {/* Gender with label */}
  <Text style={{ textAlign: 'center', marginVertical: 4 }}>
    <Text style={{ fontWeight: '600', color: theme.colors.text }}>
      Gender:{' '}
    </Text>
    <Text style={{ fontStyle: 'italic', color: theme.colors.textSecondary }}>
      {doc.gender || "Not specified"}
    </Text>
  </Text>
  
  {/* Email with label */}
  <Text style={{ textAlign: 'center', marginBottom: 8 }}>
    <Text style={{ fontWeight: '600', color: theme.colors.text }}>
      Email:{' '}
    </Text>
    <Text style={{ 
      color: '#1e88e5', 
      textDecorationLine: 'underline' 
    }}>
      {doc.email}
    </Text>
  </Text>

    <Pressable // CHANGE from *
          onPress={() => setBookingDoctorId(doc.doctorId === bookingDoctorId ? null : doc.doctorId)}
          style={({ pressed }) => [
            {
              backgroundColor: bookingDoctorId === doc.doctorId ? theme.colors.error : theme.colors.primary,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 8,
              marginTop: 12,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }]
            },
            pressed && { opacity: 0.9 }
          ]}
        >
          <Text style={{ 
            backgroundColor: theme.colors.primary,
            color: 'white',
            textAlign: 'center',
            padding: 6,
            borderRadius: 12,
            fontWeight: '600',
            fontSize: 16,
            letterSpacing: 0.5
          }}>
            {bookingDoctorId === doc.doctorId ? '✕ Cancel Booking' : '＋ Book Appointment'}
          </Text>
        </Pressable>

        {bookingDoctorId === doc.doctorId && (
          <View style={{ 
            width: '100%', 
            marginTop: theme.spacing.md,
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderRadius: 12,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: 12
            }}>
              Schedule Your Appointment
            </Text>
            
            <TextInput
              placeholder="Date (YYYY-MM-DD)"
              placeholderTextColor={theme.colors.textSecondary}
              value={appointmentData.date}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, date: text })}
              style={{
                backgroundColor: 'white',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                marginBottom: 12,
                fontSize: 15
              }}
            />
            
            <TextInput
              placeholder="Time (HH:MM)"
              placeholderTextColor={theme.colors.textSecondary}
              value={appointmentData.time}
              onChangeText={(text) => setAppointmentData({ ...appointmentData, time: text })}
              style={{
                backgroundColor: 'white',
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.border,
                marginBottom: 16,
                fontSize: 15
              }}
            />
            
            <Pressable
              onPress={() => handleSubmit(doc.doctorId)}
              style={({ pressed }) => [
                {
                  backgroundColor: theme.colors.success,
                  padding: 14,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }]
                },
                pressed && { opacity: 0.9 }
              ]}
            >
              <Text style={{ 
                color: 'white',
                backgroundColor: theme.colors.success,
                textAlign: 'center',
                padding: 6,
                borderRadius: 12,
                fontWeight: 'bold',
                fontSize: 16
              }}>
                ✓ Confirm Appointment
              </Text>
            </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}