// app/(app)/_layout.tsx
import { Slot, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/(auth)/login');
      } else {
        switch (user.role) {
          case 'Patient':
            router.replace('/(app)/patient/home');
            break;
          case 'Doctor':
            router.replace('/(app)/doctor/home');
            break;
          default:
            router.replace('/(auth)/login');
        }
      }
    }
  }, [loading, user]);

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
