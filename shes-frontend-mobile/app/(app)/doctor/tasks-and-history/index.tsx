import React, { useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useTheme } from '../../../styles/themes';

interface DailyTasks {
  appointmentsToday: number;
  pendingReschedules: number;
  patientsNeedingFollowUp: number;
  todayAppointmentsDetails: Appointment[];
  pendingReschedulesDetails: Reschedule[];
  patientsNeedingFollowUpDetails: FollowUp[];
}

interface Appointment {
  patientName: string;
  appointmentDate: string;
}

interface Reschedule {
  patientName: string;
  requestedNewDate: string;
  reason: string;
}

interface FollowUp {
  patientName: string;
  diagnosisSummary: string;
}

interface WorkHistoryItem {
  patientName: string;
  appointmentDate: string;
  statusName: string;
}

export default function TasksAndHistory() {
  const [workHistory, setWorkHistory] = useState<WorkHistoryItem[]>([]);
  const [dailyTasks, setDailyTasks] = useState<DailyTasks | null>(null);
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
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      const [historyRes, tasksRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/Doctor/WorkHistory`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/Doctor/DailyTasks`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setWorkHistory(historyRes.data);
      setDailyTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderWorkHistoryItem = ({ item }: { item: WorkHistoryItem }) => (
    <View style={[styles.historyItem, { backgroundColor: theme.colors.backgroundSecondary }]}>
      <Text style={[styles.historyText, { color: theme.colors.text }]}>
        <Text style={styles.bold}>{item.patientName}</Text>
      </Text>
      <Text style={[styles.historyText, { color: theme.colors.text }]}>
        {formatDate(item.appointmentDate)}
      </Text>
      <Text style={[styles.historyText, { color: theme.colors.text }]}>
        {item.statusName}
      </Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Daily Overview</Text>

      {dailyTasks && (
        <View style={[styles.section, { backgroundColor: theme.colors.backgroundSecondary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📋 Today's Summary</Text>
          
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                Appointments Today: <Text style={styles.cardValue}>{dailyTasks.appointmentsToday}</Text>
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                Pending Reschedules: <Text style={styles.cardValue}>{dailyTasks.pendingReschedules}</Text>
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.cardText, { color: theme.colors.text }]}>
                Follow-ups Needed: <Text style={styles.cardValue}>{dailyTasks.patientsNeedingFollowUp}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.subsection}>
            <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Today's Appointments</Text>
            {dailyTasks.todayAppointmentsDetails.map((a, idx) => (
              <Text key={idx} style={[styles.listItem, { color: theme.colors.text }]}>
                🩺 {a.patientName} at {formatTime(a.appointmentDate)}
              </Text>
            ))}
          </View>

          <View style={styles.subsection}>
            <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Pending Reschedule Requests</Text>
            {dailyTasks.pendingReschedulesDetails.map((r, idx) => (
              <Text key={idx} style={[styles.listItem, { color: theme.colors.text }]}>
                📅 {r.patientName} - New Date: {formatDate(r.requestedNewDate)} – {r.reason}
              </Text>
            ))}
          </View>

          <View style={styles.subsection}>
            <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>Follow-Up Patients</Text>
            {dailyTasks.patientsNeedingFollowUpDetails.map((f, idx) => (
              <Text key={idx} style={[styles.listItem, { color: theme.colors.text }]}>
                🔁 {f.patientName} – Diagnosis: {f.diagnosisSummary}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.section, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🕓 Work History</Text>
        
        <View style={styles.historyHeader}>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>Patient</Text>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>Date</Text>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>Status</Text>
        </View>
        
        <FlatList
          data={workHistory}
          renderItem={renderWorkHistoryItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </View>
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
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flexBasis: '30%',
    minWidth: 120,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e0f2fe',
    borderLeftWidth: 4,
    borderLeftColor: '#0ea5e9',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
  },
  cardValue: {
    fontWeight: 'bold',
  },
  subsection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  historyText: {
    flex: 1,
    fontSize: 14,
  },
  bold: {
    fontWeight: 'bold',
  },
});