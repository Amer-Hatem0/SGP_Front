// /components/patient/Sidebar.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import PatientHome from '../../(app)/patient/home';
import PatientProfile from '../../(app)/patient/profile';
import PatientDoctors from '../../(app)/patient/doctors';
import PatientAppointments from '../../(app)/patient/appointments';
import PatientReports from '../../(app)/patient/reports';

const Tab = createBottomTabNavigator();

export default function PatientSidebar() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#25a6e9',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={PatientHome}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PatientProfile}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Doctors" 
        component={PatientDoctors}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="medical-services" size={24} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={PatientAppointments}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
          tabBarLabel: 'Appts'
        }}
      />
      <Tab.Screen 
        name="Reports" 
        component={PatientReports}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="folder" size={24} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}