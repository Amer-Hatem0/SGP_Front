// app/(app)/_layout.tsx
import { Slot, Redirect } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Slot />;
}
