// app/components/patient/PatientNavbar.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../styles/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Using Expo's icon library

interface UserData {
  name?: string;
  // Add other user properties as needed
}

export default function PatientNavbar() {
  const { theme } = useTheme();
  const [user, setUser] = React.useState<UserData>({});
  const today = new Date().toLocaleDateString();

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUser();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.header }]}>
      <View style={styles.leftContainer}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>
          👋 Welcome, {user?.name || 'Patient'}
        </Text>
        <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
          {today}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => console.log('Notification pressed')}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=11' }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  leftContainer: {
    flexDirection: 'column',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  iconButton: {
    padding: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});