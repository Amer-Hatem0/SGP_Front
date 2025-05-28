// components/patient/Sidebar.tsx
import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../styles/themes';
import PatientHome from '../../(app)/patient/home';
import PatientProfile from '../../(app)/patient/profile';
import PatientDoctors from '../../(app)/patient/doctors';
import PatientAppointments from '../../(app)/patient/appointments';
import PatientReports from '../../(app)/patient/reports';
import PatientChat from '../../(app)/chat/chatscreen';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default function PatientSidebar() {
  const { theme } = useTheme();
  const [user, setUser] = useState({ name: 'Patient' });

  React.useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
          backgroundColor: theme.colors.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: theme.colors.border,
        },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'; // Default fallback


          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Doctors') {
            iconName = 'medkit';
          } else if (route.name === 'Appointments') {
            iconName = 'calendar';
          } else if (route.name === 'Reports') {
            iconName = 'folder';
          } else if (route.name === 'Chat') {
            iconName = 'chatbubbles';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          let label = route.name;
          if (route.name === 'Appointments') label = 'Appts';
          if (route.name === 'Medical History') label = 'History';

          return (
            <Text style={{ 
              color, 
              fontSize: 12,
              marginBottom: 3 
            }}>
              {label}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={PatientHome}
      />
      <Tab.Screen 
        name="Profile" 
        component={PatientProfile}
      />
      <Tab.Screen 
        name="Doctors" 
        component={PatientDoctors}
      />
      <Tab.Screen 
        name="Appointments" 
        component={PatientAppointments}
      />
      <Tab.Screen 
        name="Reports" 
        component={PatientReports}
      />
      <Tab.Screen 
        name="Chat" 
        component={PatientChat}
      />
    </Tab.Navigator>
  );
}

// For the collapsible sidebar alternative (if needed)
export function PatientCollapsibleSidebar() {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({ name: 'Patient' });

  React.useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  return (
    <View style={[styles.sidebarContainer, { 
      width: collapsed ? 70 : 240,
      backgroundColor: theme.colors.card 
    }]}>
      <View style={styles.sidebarHeader}>
        {collapsed ? (
          <TouchableOpacity 
            onPress={() => setCollapsed(false)}
            style={styles.sidebarButton}
          >
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : (
          <>
            <Text style={[styles.sidebarTitle, { color: theme.colors.text }]}>
              ➕ Hospital
            </Text>
            <TouchableOpacity 
              onPress={() => setCollapsed(true)}
              style={styles.sidebarButton}
            >
              <Ionicons name="menu" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Navigation links would be implemented using React Navigation's drawer navigator */}
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 100,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  sidebarHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sidebarButton: {
    padding: 8,
  },
});