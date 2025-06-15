// app/(app)/doctor/_layout.tsx

import React from 'react';
import { View } from 'react-native';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { useTheme } from '../../styles/themes';
import { Slot } from 'expo-router';

export default function DoctorLayout() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {/* Sidebar */}
      <DoctorSidebar />

      {/* Main Content */}
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <Slot />
      </View>
    </View>
  );
}
