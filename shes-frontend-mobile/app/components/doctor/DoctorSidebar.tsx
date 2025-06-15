// app/components/doctor/DoctorSidebar.tsx

import React from 'react';
import { View, Text, Pressable, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../../styles/themes';
import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname } from 'expo-router';

// Define the style types
type DoctorSidebarStyles = {
  container: ViewStyle;
  title: TextStyle;
  nav: ViewStyle;
  link: ViewStyle & { fontSize?: number; color?: string };
  activeLink: ViewStyle & { color?: string; fontWeight?: TextStyle['fontWeight'] };
};

// Create the style generator function
const makeDoctorSidebarStyles = (theme: any): DoctorSidebarStyles => StyleSheet.create({
  container: {
    width: 240,
    height: '100%',
    backgroundColor: '#1e293b',
    paddingVertical: 32,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#38bdf8',
    marginBottom: 32,
  },
  nav: {
    flexDirection: 'column',
    gap: 12,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    fontSize: 16,
    color: '#cbd5e1',
  },
  activeLink: {
    backgroundColor: '#38bdf8',
    color: '#1e293b',
    fontWeight: '600',
  },
});

export default function DoctorSidebar() {
  const { theme } = useTheme();
  const styles = makeDoctorSidebarStyles(theme);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: 'home', route: '/doctor/home' },
    { name: 'Tasks & History', icon: 'list', route: '/doctor/tasks-and-history' },
    { name: 'Patient Management', icon: 'people', route: '/doctor/patientmanagement' },
    { name: 'Patient Details', icon: 'person', route: '/doctor/patientdetails' },
    { name: 'Leave & Schedule', icon: 'calendar', route: '/doctor/leave-and-schedule' },
    { name: 'My Appointments', icon: 'time', route: '/doctor/rescheduleappointments' },
    { name: 'Chat', icon: 'chatbubbles', route: '/doctor/chat' },
    { name: 'Notifications', icon: 'notifications', route: '/doctor/notifications' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SHES</Text>
      <View style={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.route;

          return (
            <Link href={item.route as any} key={item.route} asChild>
              <Pressable
                style={({ pressed }) => [
                  styles.link,
                  isActive && styles.activeLink,
                  pressed && { opacity: 0.8 }
                ]}
              >
                <Ionicons 
                  name={item.icon as any}
                  size={20}
                  color={isActive ? '#1e293b' : '#cbd5e1'}
                />
                <Text style={{
                  color: isActive ? '#1e293b' : '#cbd5e1',
                  fontWeight: isActive ? '600' : 'normal'
                }}>
                  {item.name}
                </Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}
