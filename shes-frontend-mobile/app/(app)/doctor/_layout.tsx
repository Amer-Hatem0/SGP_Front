// app/(app)/doctor/_layout.tsx

import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import { useTheme } from '../../styles/themes';
import { Slot } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DoctorLayout() {
  const { theme } = useTheme();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#1e293b' }]}>
      <View style={styles.container}>

        {/* 🟦 Only show this top navbar if sidebar is hidden */}
        {!isSidebarVisible && (
          <View style={[styles.header, { backgroundColor: '#1e293b' }]}>
            <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}></Text>
          </View>
        )}

        {/* 🟩 Main body with sidebar (if visible) and content */}
        <View style={styles.body}>
          {isSidebarVisible && (
            <View style={styles.sidebar}>
              <DoctorSidebar />
            </View>
          )}

          {/* 🟨 Main Content area */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (isSidebarVisible) setIsSidebarVisible(false);
            }}
            style={styles.content}
          >
            <Slot />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '600',
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 10,
  },
});
