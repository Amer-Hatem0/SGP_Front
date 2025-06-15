import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import { useTheme } from '../../../styles/themes';

interface Notification {
  notificationID: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const decoded = JSON.parse(atob(token!.split('.')[1]));
      const userId = parseInt(decoded.sub);
      const res = await axios.get(`${API_BASE_URL}/Notification/ByUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/Notification/MarkAsRead/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.notificationID === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification,
        { backgroundColor: theme.colors.backgroundSecondary }
      ]}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
          {item.message}
        </Text>
        <Text style={[styles.notificationTime, { color: theme.colors.textSecondary }]}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      {!item.isRead && (
        <TouchableOpacity
          style={styles.markAsReadButton}
          onPress={() => markAsRead(item.notificationID)}
        >
          <Text style={styles.markAsReadText}>Mark as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentContainer}>
        <Text style={[styles.header, { color: theme.colors.text }]}>🔔 Notifications</Text>
        
        {notifications.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No notifications available.
          </Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.notificationID}
            scrollEnabled={false}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unreadNotification: {
    borderLeftWidth: 5,
    borderLeftColor: 'orange',
    backgroundColor: '#fff4e5',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  markAsReadButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  markAsReadText: {
    color: 'white',
    fontSize: 14,
  },
});