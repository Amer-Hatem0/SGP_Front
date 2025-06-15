// import React, { useEffect, useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput, 
//   Pressable, 
//   Image,
//   ScrollView,
//   StyleSheet
// } from 'react-native';
// import axios from 'axios';
// import API_BASE_URL from '../../../../config/apiConfig';
// import { useNavigation } from '@react-navigation/native';
// import { useTheme } from '../../../styles/themes';
// import { FontAwesome } from '@expo/vector-icons';
// import * as SecureStore from 'expo-secure-store';

// // Define navigation type
// type DoctorHomeNavigationProp = {
//   navigate: (screen: 'home' | 'chat' | 'notifications' | 'tasks-history' | 'patient-management' | 'leave-schedule') => void;
// };

// export default function DoctorHome() {
//   const navigation = useNavigation<DoctorHomeNavigationProp>();
//   const [dailyTasks, setDailyTasks] = useState(null);
//   const [performance, setPerformance] = useState(null);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [hasNewMessage, setHasNewMessage] = useState(false);
//   const { theme } = useTheme();
//   const styles = makeDoctorHomeStyles(theme);

//   useEffect(() => {
//     fetchDailyTasks();
//     fetchPerformanceReport();
//     fetchNotifications();
//     checkNewMessages();
//   }, []);

//   const fetchDailyTasks = async () => {
//     try {
//       const token = await SecureStore.getItemAsync('userToken');
//       const res = await axios.get(`${API_BASE_URL}/Doctor/DailyTasks`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDailyTasks(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPerformanceReport = async () => {
//     try {
//       const token = await SecureStore.getItemAsync('userToken');
//       const res = await axios.get(`${API_BASE_URL}/Doctor/PerformanceReport`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPerformance(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchNotifications = async () => {
//     try {
//       const token = await SecureStore.getItemAsync('userToken');
//       const res = await axios.get(`${API_BASE_URL}/Notification/ByUser/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const all = res.data;
//       setUnreadCount(all.filter(n => !n.isRead).length);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const checkNewMessages = async () => {
//     try {
//       const token = await SecureStore.getItemAsync('userToken');
//       const res = await axios.get(`${API_BASE_URL}/Doctor/DoctorHasNewMessages`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setHasNewMessage(res.data === true);
//     } catch (err) {
//       console.error('Error checking messages');
//     }
//   };

//   const goToChat = () => {
//     navigation.navigate('chat');
//   };

//   const goToNotifications = () => {
//     navigation.navigate('notifications');
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.main}>
//         <View style={styles.header}>
//           <TextInput 
//             placeholder="Search here..."
//             placeholderTextColor={theme.colors.textSecondary}
//             style={styles.search}
//           />
          
//           <View style={styles.icons}>
//             <Pressable 
//               onPress={goToNotifications} 
//               style={styles.iconContainer}
//               android_ripple={{ color: theme.colors.ripple, borderless: true }}
//             >
//               <FontAwesome name="bell" size={24} color={theme.colors.text} />
//               {unreadCount > 0 && (
//                 <View style={styles.unreadCountContainer}>
//                   <Text style={styles.unreadCount}>{unreadCount}</Text>
//                 </View>
//               )}
//             </Pressable>
            
//             <Pressable 
//               onPress={goToChat} 
//               style={styles.iconContainer}
//               android_ripple={{ color: theme.colors.ripple, borderless: true }}
//             >
//               <FontAwesome name="comments" size={24} color={theme.colors.text} />
//               {hasNewMessage && (
//                 <View style={styles.badge} />
//               )}
//             </Pressable>
            
//             <Image
//               source={{ uri: 'https://i.pravatar.cc/40' }}
//               style={styles.avatar}
//             />
//           </View>
//         </View>

//         <View style={styles.stats}>
//           {/* Today's Appointments Card */}
//           <Pressable 
//             style={styles.card}
//             android_ripple={{ color: theme.colors.ripple }}
//           >
//             <FontAwesome name="user-md" size={28} color={theme.colors.primary} />
//             <View style={styles.cardContent}>
//               <Text style={styles.statNumber}>
//                 {dailyTasks?.appointmentsToday ?? '...'}
//               </Text>
//               <Text style={styles.statLabel}>Today's Appointments</Text>
//             </View>
//           </Pressable>

//           {/* Performance Card */}
//           <Pressable 
//             style={styles.card}
//             android_ripple={{ color: theme.colors.ripple }}
//           >
//             <FontAwesome name="chart-line" size={28} color={theme.colors.warning} />
//             <View style={styles.cardContent}>
//               <Text style={styles.ratingText}>
//                 ⭐ Rating: {performance?.rating ?? 'N/A'} / 5
//               </Text>
//               <Text style={[styles.statLabel, styles.performanceLabel]}>
//                 Performance Score
//               </Text>
//             </View>
//           </Pressable>

//           {/* Notifications Card */}
//           <Pressable 
//             style={styles.card}
//             android_ripple={{ color: theme.colors.ripple }}
//           >
//             <FontAwesome name="bell" size={28} color={theme.colors.error} />
//             <View style={styles.cardContent}>
//               <Text style={styles.statNumber}>{unreadCount}</Text>
//               <Text style={styles.statLabel}>New Notifications</Text>
//             </View>
//           </Pressable>

//           {/* Follow Up Card */}
//           <Pressable 
//             style={styles.card}
//             android_ripple={{ color: theme.colors.ripple }}
//           >
//             <FontAwesome name="procedures" size={28} color={theme.colors.info} />
//             <View style={styles.cardContent}>
//               <Text style={styles.statNumber}>
//                 {dailyTasks?.patientsNeedingFollowUp ?? '...'}
//               </Text>
//               <Text style={styles.statLabel}>Patients to Follow Up</Text>
//             </View>
//           </Pressable>
//         </View>
//       </View>
//     </ScrollView>
//   );
// }