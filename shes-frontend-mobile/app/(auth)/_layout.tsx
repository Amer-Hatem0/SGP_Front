// app/(auth)/_layout.tsx
import { Stack, Redirect } from 'expo-router';
import useAuth from '@/hooks/useAuth'; // good job using this hook!

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    if (user?.role === 'Doctor') return <Redirect href="/(app)/doctor/home" />;
if (user?.role === 'Patient') return <Redirect href="/(app)/patient/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
