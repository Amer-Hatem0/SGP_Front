// app/(app)/patient/_layout.tsx
import React, { useState } from 'react';
import {
  View,
  Pressable,
  Dimensions,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import PatientNavbar from '../../components/patient/PatientNavbar';
import PatientSidebar from '../../components/patient/Sidebar';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from '@react-native-community/blur';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.5;

export default function PatientLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleOutsidePress = () => {
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Navbar with hamburger toggle */}
      <View style={styles.navWrapper}>
        <Pressable onPress={() => setIsSidebarOpen(prev => !prev)} style={styles.hamburgerButton}>
          <Ionicons name="menu" size={28} color="#333" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <PatientNavbar />
        </View>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Touch outside to close sidebar */}
        {isSidebarOpen && (
          <TouchableWithoutFeedback onPress={handleOutsidePress}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}

        {/* Sidebar - shown conditionally */}
        {isSidebarOpen && (
          <View style={styles.sidebar}>
            <PatientSidebar />
          </View>
        )}

        {/* Main content */}
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  hamburgerButton: {
    padding: 8,
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    zIndex: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
