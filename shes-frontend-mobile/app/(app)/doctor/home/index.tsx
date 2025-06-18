import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme, makeStyles} from '../../../styles/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DoctorHome() {
  const [dailyTasks, setDailyTasks] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
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
    if(token){
    fetchDailyTasks();
    fetchPerformanceReport();
    fetchNotifications();
    checkNewMessages();
    }
  }, [token]);

  const fetchDailyTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/DailyTasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDailyTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPerformanceReport = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/PerformanceReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPerformance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const decoded = JSON.parse(atob(token!.split('.')[1]));
      const userId = parseInt(decoded.userId || decoded.sub);  

      const res = await axios.get(`${API_BASE_URL}/Notification/ByUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const all = res.data;
      setNotifications(all);
      setUnreadCount(all.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error(err);
    }
  };

  const checkNewMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Doctor/DoctorHasNewMessages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasNewMessage(res.data === true);
    } catch (err) {
      console.error('Error checking messages');
    }
  };

  const goToChat = () => {
    router.push('../doctor/chat');
  };

  const goToNotf = () => {
    router.push('../doctor/notifications');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search here..."
          style={styles.searchInput}
          placeholderTextColor={theme.colors.textSecondary}
        />
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={goToNotf} style={styles.iconWrapper}>
            <FontAwesome5 name="bell" size={24} color={theme.colors.text} />
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <View style={styles.badgeGreen} />
                <View style={styles.unreadCount}>
                  <Text style={styles.unreadCountText}>{unreadCount}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goToChat} style={styles.iconWrapper}>
            <FontAwesome5 name="comments" size={24} color={theme.colors.text} />
            {hasNewMessage && <View style={styles.messageBadge} />}
          </TouchableOpacity>

          <Image
            source={{ uri: 'https://i.pravatar.cc/40' }}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.card}>
          <FontAwesome5 name="user-md" size={28} color="#25a6e9" />
          <View style={styles.cardContent}>
            <Text style={styles.statNumber}>{dailyTasks?.appointmentsToday ?? '...'}</Text>
            <Text style={styles.statLabel}>Today's Appointments</Text>
          </View>
        </View>

        <View style={styles.card}>
          <FontAwesome5 name="line-chart" size={28} color="#f39c12" />
          <View style={styles.cardContent}>
            <Text style={styles.ratingText}>
              ⭐ Rating: {performance?.rating ?? 'N/A'} / 5
            </Text>
            <Text style={[styles.statLabel, { paddingTop: 8 }]}>Performance Score</Text>
          </View>
        </View>

        <View style={styles.card}>
          <FontAwesome5 name="bell" size={28} color="#e74c3c" />
          <View style={styles.cardContent}>
            <Text style={styles.statNumber}>{unreadCount}</Text>
            <Text style={styles.statLabel}>New Notifications</Text>
          </View>
        </View>

        <View style={styles.card}>
          <FontAwesome5 name="procedures" size={28} color="#26c6da" />
          <View style={styles.cardContent}>
            <Text style={styles.statNumber}>{dailyTasks?.patientsNeedingFollowUp ?? '...'}</Text>
            <Text style={styles.statLabel}>Patients to Follow Up</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  marginBottom: 20,
  flexWrap: 'wrap', // allow wrapping on smaller screens
},
  searchInput: {
  flexGrow: 1,
  flexShrink: 1,
  minWidth: 120,
  padding: 12,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  fontSize: 16,
},
  iconsContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  flexShrink: 0, // don’t shrink this
},
  iconWrapper: {
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  badgeGreen: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: 'green',
    borderRadius: 4,
  },
  unreadCount: {
    position: 'absolute',
    top: -5,
    right: -12,
    backgroundColor: 'red',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 20,
  },
  card: {
    flex: 1,
    minWidth: 150,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#f4f7fc',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7b8a97',
  },
  ratingText: {
    fontSize: 14,
    color: '#888',
  },
});