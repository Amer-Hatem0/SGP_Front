import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useTheme } from '../../../styles/themes';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LeaveRequest {
  leaveRequestId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  submittedAt: string;
}

export default function LeaveRequestPage() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
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
      fetchLeaveRequests();
    }
  }, [token]);

  const fetchLeaveRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/MyLeaveRequests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load leave requests.");
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/Doctor/RequestLeave`, {
        doctorId: 0, // Will be ignored and replaced on server
        reason,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        submittedAt: new Date().toISOString(),
        status: "Pending"
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 200) {
        Alert.alert("Success", "Leave request submitted successfully");
        setStartDate(null);
        setEndDate(null);
        setReason('');
        fetchLeaveRequests();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to submit leave request.");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this request?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/Doctor/DeleteLeaveRequest/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              });
              Alert.alert("Success", "Leave request deleted.");
              fetchLeaveRequests();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to delete leave request.");
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: theme.colors.warning };
      case 'approved':
        return { color: theme.colors.success };
      case 'rejected':
        return { color: theme.colors.error };
      default:
        return { color: theme.colors.text };
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Request Leave</Text>

      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Start Date:</Text>
        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => setShowStartPicker(true)}
        >
          <Text>{startDate ? startDate.toLocaleDateString() : 'Select start date'}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={[styles.label, { color: theme.colors.text }]}>End Date:</Text>
        <TouchableOpacity 
          style={styles.dateInput} 
          onPress={() => setShowEndPicker(true)}
        >
          <Text>{endDate ? endDate.toLocaleDateString() : 'Select end date'}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={[styles.label, { color: theme.colors.text }]}>Reason:</Text>
        <TextInput
          style={[styles.textarea, { 
            backgroundColor: theme.colors.backgroundSecondary,
            color: theme.colors.text 
          }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Write your reason..."
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Leave Request</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: theme.colors.text }]}>Your Leave Requests</Text>
      
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Start Date</Text>
          <Text style={styles.headerText}>End Date</Text>
          <Text style={styles.headerText}>Reason</Text>
          <Text style={styles.headerText}>Status</Text>
          <Text style={styles.headerText}>Submitted</Text>
          <Text style={styles.headerText}>Action</Text>
        </View>
        
        {leaveRequests.map((req, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={styles.cellText}>{formatDate(req.startDate)}</Text>
            <Text style={styles.cellText}>{formatDate(req.endDate)}</Text>
            <Text style={styles.cellText}>{req.reason}</Text>
            <Text style={[styles.cellText, getStatusStyle(req.status)]}>{req.status}</Text>
            <Text style={styles.cellText}>{formatDate(req.submittedAt)}</Text>
            <TouchableOpacity 
              style={styles.deleteButton} 
              onPress={() => handleDelete(req.leaveRequestId)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  table: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0ea5e9',
    padding: 12,
  },
  headerText: {
    flex: 1,
    color: 'white',
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  cellText: {
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});