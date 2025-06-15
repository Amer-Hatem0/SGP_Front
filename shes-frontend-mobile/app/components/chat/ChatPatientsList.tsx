import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../config/apiConfig';
import { useTheme } from '../../styles/themes';

interface Patient {
  userID: string;
  fullName: string;
}

interface UnreadCounts {
  [key: string]: number;
}

interface ChatPatientsListProps {
  onSelectPatient: (id: string, name: string) => void;
  selectedPatientId: string | null;
}

export default function ChatPatientsList({ onSelectPatient, selectedPatientId }: ChatPatientsListProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});
  const {theme} = useTheme();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setToken(parsedUser.token);
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchPatients();
      fetchUnreadCounts();
    }
  }, [token]);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/GetMyChatPatients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Chat/UnreadCountPerSender`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCounts(res.data);
    } catch (error) {
      console.error('Failed to fetch unread message counts:', error);
    }
  };

  const renderPatientItem = ({ item }: { item: Patient }) => {
    const unread = unreadCounts[item.userID] || 0;
    const isSelected = selectedPatientId === item.userID;

    return (
      <TouchableOpacity
        style={[
          styles.patientItem,
          isSelected && styles.selectedItem,
          { 
            backgroundColor: unread > 0 
              ? theme.colors.background 
              : theme.colors.background
          }
        ]}
        onPress={() => onSelectPatient(item.userID, item.fullName)}
      >
        <Text style={[styles.patientName, { color: theme.colors.text }]}>
          {item.fullName}
        </Text>
        {unread > 0 && (
          <View style={styles.unreadCount}>
            <Text style={styles.unreadCountText}>{unread}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={patients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.userID}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  patientItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItem: {
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  patientName: {
    fontSize: 16,
  },
  unreadCount: {
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});