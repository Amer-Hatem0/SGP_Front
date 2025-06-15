// app/(app)/patient/_layout.tsx
import React from 'react';
import { View } from 'react-native';
import PatientNavbar from '../../components/patient/PatientNavbar';
import PatientSidebar from '../../components/patient/Sidebar';
import { Slot } from 'expo-router';

export default function PatientLayout() {
  return (
    <View style={{ flex: 1 }}>
      {/* Top Navigation Bar */}
      <PatientNavbar />

      {/* Main content area with sidebar and screen content */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar */}
        <PatientSidebar />

        {/* Page Content */}
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <Slot />
        </View>
      </View>
    </View>
  );
}
