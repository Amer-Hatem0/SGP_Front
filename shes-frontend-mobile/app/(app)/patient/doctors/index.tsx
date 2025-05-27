import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Pressable, TextInput } from 'react-native';
import axios from 'axios';
import { useTheme, makeStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
import API_BASE_URL from '../../../../config/apiConfig';

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
  const styles = makeStyles(theme);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const res = await axios.get(`${API_BASE_URL}/Patient/Doctors`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setDoctors(res.data);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (doctorId: number) => {
    // ... (same logic as web version)
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.lg }}>
          Available Doctors
        </Text>

        <View style={{ gap: theme.spacing.lg }}>
          {doctors.map((doc, index) => (
            <View key={doc.doctorId} style={{
              backgroundColor: theme.colors.card,
              borderRadius: theme.spacing.md,
              padding: theme.spacing.lg,
              alignItems: 'center'
            }}>
              <Image
                source={{ uri: `https://i.pravatar.cc/150?img=${index + 10}` }}
                style={{ width: 80, height: 80, borderRadius: 40, marginBottom: theme.spacing.md }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{doc.fullName}</Text>
              <Text>Specialization: {doc.specialization || "N/A"}</Text>
              <Text>Gender: {doc.gender || "Not specified"}</Text>
              <Text>Email: {doc.email}</Text>

              <Pressable
                onPress={() => setBookingDoctorId(doc.doctorId === bookingDoctorId ? null : doc.doctorId)}
                style={{
                  backgroundColor: theme.colors.primary,
                  padding: theme.spacing.md,
                  borderRadius: 20,
                  marginTop: theme.spacing.md
                }}
              >
                <Text style={{ color: 'white' }}>
                  {bookingDoctorId === doc.doctorId ? 'Cancel' : 'Book Appointment'}
                </Text>
              </Pressable>

              {bookingDoctorId === doc.doctorId && (
                <View style={{ width: '100%', marginTop: theme.spacing.md }}>
                  <TextInput
                    placeholder="Date"
                    value={appointmentData.date}
                    onChangeText={(text) => setAppointmentData({ ...appointmentData, date: text })}
                    style={{ borderWidth: 1, padding: theme.spacing.sm, marginBottom: theme.spacing.sm }}
                  />
                  <TextInput
                    placeholder="Time"
                    value={appointmentData.time}
                    onChangeText={(text) => setAppointmentData({ ...appointmentData, time: text })}
                    style={{ borderWidth: 1, padding: theme.spacing.sm, marginBottom: theme.spacing.sm }}
                  />
                  <Pressable
                    onPress={() => handleSubmit(doc.doctorId)}
                    style={{ backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: 5 }}
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