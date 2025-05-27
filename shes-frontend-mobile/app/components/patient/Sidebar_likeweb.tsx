// // /components/patient/Sidebar.tsx
// import { Drawer } from 'expo-router/drawer';
// import { useRouter } from 'expo-router';
// import { Pressable, View, Text } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';

// export default function PatientSidebar() {
//   const router = useRouter();
  
//   return (
//     <Drawer
//       screenOptions={{
//         headerShown: false,
//         drawerPosition: 'left',
//         drawerType: 'front'
//       }}
//       drawerContent={() => (
//         <View style={{ padding: 20, flex: 1 }}>
//           <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 30 }}>
//             ➕ Hospital
//           </Text>
          
//           {[
//             { name: 'Home', icon: 'home', route: '/(app)/patient/home' },
//             { name: 'Profile', icon: 'person', route: '/(app)/patient/profile' },
//             { name: 'Doctors', icon: 'medical-services', route: '/(app)/patient/doctors' },
//             { name: 'Appointments', icon: 'event', route: '/(app)/patient/appointments' },
//             { name: 'Reports', icon: 'folder', route: '/(app)/patient/reports' }
//           ].map((item) => (
//             <Pressable
//               key={item.name}
//               onPress={() => router.push(item.route)}
//               style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
//             >
//               <MaterialIcons name={item.icon} size={24} color="#333" style={{ marginRight: 10 }} />
//               <Text>{item.name}</Text>
//             </Pressable>
//           ))}
//         </View>
//       )}
//     >
//       <Drawer.Screen name="home" />
//       <Drawer.Screen name="profile" />
//       <Drawer.Screen name="doctors" />
//       <Drawer.Screen name="appointments" />
//       <Drawer.Screen name="reports" />
//     </Drawer>
//   );
// }