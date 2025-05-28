import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  useAuth  from '../hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

// Auth Screens
import Login from '../app/(auth)/login';
import ForgotPassword from '../app/(auth)/forgot-password';
import Register from '../app/(auth)/register';

// Patient Screens
import PatientHome from '../app/(app)/patient/home';
import Profile from '../app/(app)/patient/profile';
import Doctors from '../app/(app)/patient/doctors';
import MyAppointments from '../app/(app)/patient/appointments';
import UploadReport from '../app/(app)/patient/reports';
import MedicalHistory from '../app/(app)/patient/medicalhistory';

// Other Role Screens
import DoctorHome from '../app/(app)/doctor/home';
import AdminHome from '../app/(app)/admin/home';
import SupervisorHome from '../app/(app)/supervisor/home';
import ChatPage from '../app/(app)/chat/chatscreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PatientTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="PatientHome" component={PatientHome} />
      <Tab.Screen name="Doctors" component={Doctors} />
      <Tab.Screen name="Appointments" component={MyAppointments} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // Auth Screens
          <>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          // Role-based Navigation
          <>
            {user.role === 'patient' && (
              <>
                <Stack.Screen name="PatientMain" component={PatientTabs} options={{ headerShown: false }} />
                <Stack.Screen name="UploadReport" component={UploadReport} />
                <Stack.Screen name="MedicalHistory" component={MedicalHistory} />
                <Stack.Screen name="ChatPage" component={ChatPage} />
              </>
            )}
            {user.role === 'doctor' && (
              <Stack.Screen name="DoctorHome" component={DoctorHome} />
            )}
            {user.role === 'admin' && (
              <Stack.Screen name="AdminHome" component={AdminHome} />
            )}
            {user.role === 'supervisor' && (
              <Stack.Screen name="SupervisorHome" component={SupervisorHome} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}