import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useTheme } from '../../../styles/themes';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Appointment {
  appointmentId: string;
  patientName: string;
  appointmentDate: string;
  statusName: string;
}

interface RescheduleData {
  [key: string]: {
    newDate?: Date;
    reason?: string;
  };
}

export default function RescheduleAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [rescheduleData, setRescheduleData] = useState<RescheduleData>({});
  const [token, setToken] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<string | null>(null);
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
      fetchAppointments();
    }
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/MyAppointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch appointments');
    }
  };

  const handleChange = (id: string, field: string, value: string | Date) => {
    setRescheduleData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const submitReschedule = async (id: string) => {
    const data = rescheduleData[id];
    if (!data?.newDate || !data?.reason) {
      Alert.alert('Error', 'Please provide both date and reason');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/Doctor/RequestReschedule`, {
        appointmentId: id,
        newDate: data.newDate.toISOString(),
        reason: data.reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Success', 'Reschedule request submitted');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to submit request');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Request Appointment Reschedule</Text>

      {appointments.length === 0 && (
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No appointments found.
        </Text>
      )}

      {appointments.map(app => (
        <View key={app.appointmentId} style={[styles.item, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            <Text style={styles.bold}>Patient:</Text> {app.patientName}
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            <Text style={styles.bold}>Date:</Text> {formatDate(app.appointmentDate)}
          </Text>
          <Text style={[styles.text, { color: theme.colors.text }]}>
            <Text style={styles.bold}>Status:</Text> {app.statusName}
          </Text>

          <View style={styles.form}>
            <TouchableOpacity
              style={[styles.dateInput, { backgroundColor: theme.colors.background }]}
              onPress={() => setShowDatePicker(app.appointmentId)}
            >
              <Text style={{ color: theme.colors.text }}>
                {rescheduleData[app.appointmentId]?.newDate
                  ? rescheduleData[app.appointmentId].newDate?.toLocaleString()
                  : 'Select new date'}
              </Text>
            </TouchableOpacity>

            {showDatePicker === app.appointmentId && (
              <DateTimePicker
                value={rescheduleData[app.appointmentId]?.newDate || new Date()}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(null);
                  if (selectedDate) {
                    handleChange(app.appointmentId, 'newDate', selectedDate);
                  }
                }}
              />
            )}

            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.background,
                color: theme.colors.text 
              }]}
              placeholder="Reason for reschedule"
              placeholderTextColor={theme.colors.textSecondary}
              value={rescheduleData[app.appointmentId]?.reason || ''}
              onChangeText={(text) => handleChange(app.appointmentId, 'reason', text)}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => submitReschedule(app.appointmentId)}
            >
              <Text style={styles.buttonText}>Submit Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  form: {
    marginTop: 12,
  paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});