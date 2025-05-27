import { Stack } from 'expo-router';
import useAuth from '@/hooks/useAuth'; // Optional auth hook

export default function AppLayout() {
  // const { role } = useAuth(); // If using role-based routing
  
  return (
    <Stack>
      {/* Common app screens */}
      <Stack.Screen 
        name="(patient)" 
        options={{ headerShown: false }} 
      />
      
      {/* Role-specific stacks */}
      <Stack.Screen 
        name="doctor/home" 
        options={{ title: 'Doctor Dashboard' }} 
      />
      <Stack.Screen 
        name="supervisor/home" 
        options={{ title: 'Supervisor Dashboard' }} 
      />
      <Stack.Screen 
        name="admin/home" 
        options={{ title: 'Admin Dashboard' }} 
      />
    </Stack>
  );
}