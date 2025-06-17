// app/(app)/patient/_layout.tsx
import React from 'react';
import { View } from 'react-native';
import PatientNavbar from '../../components/patient/PatientNavbar';
import PatientSidebar from '../../components/patient/Sidebar';
import { Slot } from 'expo-router';

export default function PatientLayout() {
  return (
    <View style={{ flex: 1 }}>
      <PatientNavbar />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar here is just UI, not a navigator */}
        <PatientSidebar /> 
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
          <Slot /> {/* Page content */}
        </View>
      </View>
    </View>
  );
}
