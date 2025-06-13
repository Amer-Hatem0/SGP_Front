import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { useTheme, makeDoctorStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
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
      <PatientSidebar />
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
              <Text>Specialization: {doc.specialization || "N/A"}</Text>
              <Text>Gender: {doc.gender || "Not specified"}</Text>
              <Text>Email: {doc.email}</Text>

              <Pressable
                onPress={() => setBookingDoctorId(doc.doctorId === bookingDoctorId ? null : doc.doctorId)}
                style={({ pressed }) => [styles.bookButton, pressed && { opacity: 0.8 }]}
            >
                <Text style={{ color: 'white' }}>
                  {bookingDoctorId === doc.doctorId ? 'Cancel' : 'Book Appointment'}
                </Text>
              </Pressable>

              {bookingDoctorId === doc.doctorId && (
                <View style={{ width: '100%', marginTop: theme.spacing.md }}>
                  <TextInput
                  placeholder="Date (YYYY-MM-DD)"
                  value={appointmentData.date}
                  onChangeText={(text) => setAppointmentData({ ...appointmentData, date: text })}
                  style={styles.formInput}
                />
                  <TextInput
                  placeholder="Time (HH:MM)"
                  value={appointmentData.time}
                  onChangeText={(text) => setAppointmentData({ ...appointmentData, time: text })}
                  style={styles.formInput}
                />
                  <Pressable
                  onPress={() => handleSubmit(doc.doctorId)}
                  style={({ pressed }) => [
                    styles.bookButton, 
                    pressed && { opacity: 0.8 },
                    { borderRadius: theme.radii.sm }
                  ]}
                >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Confirm</Text>
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