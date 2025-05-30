// app/(app)/(doctor)/_layout.tsx
import { Stack } from 'expo-router';

export default function DoctorLayout() {
  return <Stack screenOptions={{ title: 'Doctor Dashboard' }} />;
}
