// components/patient/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../styles/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function PatientSidebar() {
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState({ name: 'Patient' });

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  // Sidebar navigation items info
  
type PatientRoute =
  | "/patient/home"
  | "/patient/profile"
  | "/patient/doctors"
  | "/patient/appointments"
  | "/patient/reports"
  | "/patient/chat/chatscreen";

const navItems: { name: string; icon: keyof typeof Ionicons.glyphMap; route: PatientRoute }[] = [
  { name: 'Home', icon: 'home', route: '/patient/home' },
  { name: 'Profile', icon: 'person', route: '/patient/profile' },
  { name: 'Doctors', icon: 'medkit', route: '/patient/doctors' },
  { name: 'Appointments', icon: 'calendar', route: '/patient/appointments' },
  { name: 'Reports', icon: 'folder', route: '/patient/reports' },
  { name: 'Chat', icon: 'chatbubbles', route: '/patient/chat/chatscreen' },
];

  // Optional: You could get current path and highlight selected item if you want.

  return (
    <View style={[styles.sidebarContainer, { backgroundColor: theme.colors.card }]}>
      <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
        Hello, {String(user?.name || 'Patient')}
      </Text>
      <ScrollView>
        {navItems.map(({ name, icon, route }) => (
          <TouchableOpacity
            key={name}
            style={styles.navItem}
            onPress={() => router.push(route)}
          >
            <Ionicons name={icon} size={24} color={theme.colors.text} style={styles.navIcon} />
            <Text style={[styles.navLabel, { color: theme.colors.text }]}>{name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 220,
    paddingTop: 40,
    paddingHorizontal: 16,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#ccc',
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: 'transparent'
  },
  navIcon: {
    marginRight: 12,
  },
  navLabel: {
    fontSize: 16,
  },
});
