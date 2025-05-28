import { Stack, Redirect } from 'expo-router';
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
    // Redirect to login if not authenticated
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      {/* Patient stack */}
      {user.role === 'patient' && (
        <Stack.Screen
          name="patient/home"
          options={{ headerShown: false }}
        />
      )}

      {/* Doctor stack */}
      {user.role === 'doctor' && (
        <Stack.Screen
          name="doctor/home"
          options={{ title: 'Doctor Dashboard' }}
        />
      )}

      {/* Supervisor stack */}
      {user.role === 'supervisor' && (
        <Stack.Screen
          name="supervisor/home"
          options={{ title: 'Supervisor Dashboard' }}
        />
      )}

      {/* Admin stack */}
      {user.role === 'admin' && (
        <Stack.Screen
          name="admin/home"
          options={{ title: 'Admin Dashboard' }}
        />
      )}

      {/* Add any other common screens here if needed */}
    </Stack>
  );
}
