import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, makeStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
import API_BASE_URL from '../../../../config/apiConfig';

type Appointment = {
  appointmentId: number;
  doctorName: string;
  appointmentDate: string;
  statusName: string;
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
const { theme } = useTheme();
const styles = makeStyles(theme);

  // ... (fetch logic same as web)

  const handleCancel = async (appointmentId: number) => {
    Alert.alert(
      "Confirm Cancellation",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No" },
        { text: "Yes", onPress: async () => {
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            await axios.delete(`${API_BASE_URL}/Appointment/Cancel/${appointmentId}`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            setAppointments(prev => prev.filter(a => a.appointmentId !== appointmentId));
            Alert.alert("Success", "Appointment cancelled");
          } catch (err) {
            Alert.alert("Error", "Failed to cancel appointment");
          }
        }}
      ]
    );
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.lg }}>
          My Appointments
        </Text>

        {appointments.length === 0 ? (
          <Text>No appointments found.</Text>
        ) : (
          <View style={{ gap: theme.spacing.sm }}>
            {appointments.map(appt => (
              <View key={appt.appointmentId} style={{
                backgroundColor: theme.colors.card,
                padding: theme.spacing.md,
                borderRadius: theme.spacing.sm
              }}>
                <Text style={{ fontWeight: 'bold' }}>{appt.doctorName || "Unknown"}</Text>
                <Text>Date: {appt.appointmentDate?.split('T')[0]}</Text>
                <Text>Status: {appt.statusName}</Text>
                <Pressable
                  onPress={() => handleCancel(appt.appointmentId)}
                  style={{
                    backgroundColor: theme.colors.error,
                    padding: theme.spacing.sm,
                    borderRadius: 5,
                    marginTop: theme.spacing.sm,
                    alignSelf: 'flex-start'
                  }}
                >
                  <Text style={{ color: 'white' }}>Cancel</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}