// app/index.tsx
import { Redirect } from 'expo-router';
import useAuth from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;

  switch (user.role) {
    case 'patient':
      return <Redirect href="/(app)/patient/home" />;
    case 'doctor':
      return <Redirect href="/(app)/doctor/home" />;
    case 'admin':
      return <Redirect href="/(app)/admin/home" />;
    case 'supervisor':
      return <Redirect href="/(app)/supervisor/home" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}
