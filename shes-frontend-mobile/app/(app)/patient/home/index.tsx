import { View, Text, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { useTheme, makePatientHomeStyles } from '../../../styles/themes';
import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Appointment {
  appointmentDate: string; // using string for ISO date responses
  // other properties can be added as needed
}

interface Report {
  // Define report fields for better type safety
}

interface MedicalHistory {
  diagnosis: string;
  // additional fields here
}

export default function PatientHome() {
  const { theme } = useTheme();
  const styles = makePatientHomeStyles(theme);
  const [fullName, setFullName] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [history, setHistory] = useState<MedicalHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (!userString) throw new Error('User not found');
        
        const user = JSON.parse(userString);
        const token = user.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        // Get profile
        const profileRes = await axios.get(`${API_BASE_URL}/Patient/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(profileRes.data.fullName);

        // Get patientId
        const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientId = res1.data.patientId;

        // Fetch all data in parallel
        const [appointmentsRes, reportsRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Appointment/Patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/ReportFile/Patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/Patient/MedicalHistory/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setAppointments(appointmentsRes.data);
        setReports(reportsRes.data);
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  // const nextAppointment = appointments.length > 0
  //   ? appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0]
  //   : null;
  const nextAppointment =
  appointments.length > 0
    ? appointments.sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      )[0]
    : null;

  return (
    <View style={styles.container}>
      
      <ScrollView style={styles.scrollContainer}>
        {/* Header */}
        {/* <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome, {fullName}</Text>
          <View style={styles.headerIcons}>
            <Pressable>
              <FontAwesome5 name="bell" size={24} color={theme.colors.text} />
            </Pressable>
            <Pressable>
              <FontAwesome5 name="comment" size={24} color={theme.colors.text} />
            </Pressable>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/40' }} 
              style={styles.avatar}
            />
          </View>
        </View> */}

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { icon: 'user-md', label: 'Doctors', count: '520', color: theme.colors.primary },
            { icon: 'user-nurse', label: 'Nurses', count: '6969', color: theme.colors.error },
            { icon: 'wheelchair', label: 'Patients', count: '7509', color: theme.colors.warning },
            { icon: 'medkit', label: 'Pharmacists', count: '2110', color: theme.colors.info }
          ].map((item, index) => (
            <View key={index} style={styles.statCard}>
              <FontAwesome5 
              name={item.icon} 
              size={28} 
              color={item.color} />
              <View>
                <Text style={styles.statCount}>{item.count}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Info Cards */}
        <Text style={styles.dateText}>Today is {new Date().toLocaleDateString()}</Text>
        
        <View style={styles.infoCards}>
          {/* Next Appointment */}
          <View style={[styles.welcomeCard, { borderLeftColor: theme.colors.primary }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.primary }]}>Next Appointment</Text>
            {nextAppointment ? (
              <Text style={styles.cardText}>
                {new Date(nextAppointment.appointmentDate).toLocaleString()}
              </Text>
            ) : (
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            )}
          </View>

          {/* Reports */}
          <View style={[styles.welcomeCard, { borderLeftColor: theme.colors.success }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.success }]}>Medical Reports</Text>
            <Text style={styles.cardText}>{reports.length} report(s) available</Text>
          </View>

          {/* Diagnosis */}
          <View style={[styles.welcomeCard, { borderLeftColor: theme.colors.info }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.info }]}>Recent Diagnosis</Text>
            {history[0]?.diagnosis ? (
              <Text style={styles.cardText}>{history[0].diagnosis}</Text>
            ) : (
              <Text style={styles.emptyText}>No history available</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}