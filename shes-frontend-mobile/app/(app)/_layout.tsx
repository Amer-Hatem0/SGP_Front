// app/(app)/_layout.tsx
import { Slot, Redirect } from 'expo-router';
import useAuth from '@/hooks/useAuth';

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) return <Redirect href="/(auth)/login" />;

  return <Slot />; // Now this will go to doctor/_layout or patient/_layout
}
