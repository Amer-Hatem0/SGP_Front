import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../styles/themes';
import ChatPatientsList from '../../../components/chat/ChatPatientsList';
import ChatBox from '../../../components/chat/ChatBox';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DoctorChatPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState('');
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
  
   const handleSelect = (id: string, name: string) => {
    setSelectedPatientId(id);
    setSelectedPatientName(name);
    if (token) {
      markAllAsReadFromPatient(id);
    }
  };

  const markAllAsReadFromPatient = async (patientId: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/Chat/MarkAllFromSenderAsRead/${patientId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error('Failed to mark all messages as read from this patient', err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageWrapper}>
        <View style={styles.listPanel}>
          <Text style={[styles.sidebarTitle, { color: theme.colors.text }]}>
            Connected Patients
          </Text>
          <ChatPatientsList
            onSelectPatient={handleSelect}
            selectedPatientId={selectedPatientId}
          />
        </View>
        <View style={styles.mainPanel}>
          {selectedPatientId ? (
            <ChatBox
              receiverId={selectedPatientId}
              receiverName={selectedPatientName}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={{ color: theme.colors.textSecondary }}>
                Select a patient to start chatting
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  listPanel: {
    width: 250,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    padding: 16,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mainPanel: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});