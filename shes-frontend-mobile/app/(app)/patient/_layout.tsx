// app/(app)/(patient)/_layout.tsx
import { Tabs } from 'expo-router';

export default function PatientLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="doctors" />
      <Tabs.Screen name="appointments" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="medicalhistory" />
    </Tabs>
  );
}
