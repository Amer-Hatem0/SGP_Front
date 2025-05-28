import { View, Text, ScrollView, TextInput, Image, Pressable } from 'react-native';
import { useTheme, makeStyles } from '../../../styles/themes';
import { FontAwesome } from '@expo/vector-icons';
import PatientSidebar from '../../../components/patient/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Appointment {
  appointmentDate: string; // using string for ISO date responses
  // other properties can be added as needed
}

interface Report {
  // Define report fields for better type safety
}

interface MedicalHistory {
  diagnosis: string;
  // additional fields here
}

export default function PatientHome() {
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const [fullName, setFullName] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [history, setHistory] = useState<MedicalHistory[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (!userString) throw new Error('User not found');
        
        const user = JSON.parse(userString);
        const token = user.token;
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        // Get profile
        const profileRes = await axios.get(`${API_BASE_URL}/Patient/Profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFullName(profileRes.data.fullName);

        // Get patientId
        const res1 = await axios.get(`${API_BASE_URL}/Patient/PatientIdByUserId/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patientId = res1.data.patientId;

        // Fetch all data in parallel
        const [appointmentsRes, reportsRes, historyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Appointment/Patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/ReportFile/Patient/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API_BASE_URL}/Patient/MedicalHistory/${patientId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setAppointments(appointmentsRes.data);
        setReports(reportsRes.data);
        setHistory(historyRes.data);

      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, []);

  // const nextAppointment = appointments.length > 0
  //   ? appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))[0]
  //   : null;
  const nextAppointment =
  appointments.length > 0
    ? appointments.sort(
        (a, b) =>
          new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
      )[0]
    : null;

  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      
      <ScrollView 
        style={{ flex: 1, padding: theme.spacing.lg, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      >
        {/* Header Section */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          marginBottom: theme.spacing.xl,
          alignItems: 'center'
        }}>
          <Text style={{ 
            fontSize: theme.typography.xl, 
            fontWeight: 'bold',
            color: theme.colors.text 
          }}>
            Welcome, {fullName}
          </Text>
          
          <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
            <Pressable>
              <FontAwesome name="bell" size={24} color={theme.colors.text} />
            </Pressable>
            <Pressable>
              <FontAwesome name="comment" size={24} color={theme.colors.text} />
            </Pressable>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/40' }} 
              style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 20,
                borderWidth: 2,
                borderColor: theme.colors.avatarBorder
              }}
            />
          </View>
        </View>

        {/* Stats Cards (Existing) */}
        <View style={{ 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.xl 
        }}>
          {[
            { icon: 'user-md', label: 'Doctors', count: '520', color: theme.colors.primary },
            { icon: 'user-nurse', label: 'Nurses', count: '6969', color: theme.colors.error },
            { icon: 'wheelchair', label: 'Patients', count: '7509', color: theme.colors.warning },
            { icon: 'medkit', label: 'Pharmacists', count: '2110', color: theme.colors.info }
          ].map((item, index) => (
            <View key={index} style={{
              width: '45%',
              backgroundColor: theme.colors.card,
              padding: theme.spacing.lg,
              borderRadius: theme.radii.md,
              flexDirection: 'row',
              alignItems: 'center',
              gap: theme.spacing.md,
              ...theme.shadows.sm
            }}>
              <FontAwesome
                name={item.icon as any}
                size={28} 
                color={item.color} />
              <View>
                <Text style={{ 
                  fontSize: theme.typography.lg, 
                  fontWeight: 'bold',
                  color: theme.colors.text 
                }}>
                  {item.count}
                </Text>
                <Text style={{ 
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sm
                }}>
                  {item.label}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Welcome Cards Section */}
        <Text style={{ 
          fontSize: theme.typography.md,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.md
        }}>
          Today is {new Date().toLocaleDateString()}
        </Text>

        <View style={{
          gap: theme.spacing.lg,
          marginBottom: theme.spacing.xl
        }}>
          {/* Next Appointment Card */}
          <View style={{
            backgroundColor: theme.colors.card,
            padding: theme.spacing.lg,
            borderRadius: theme.radii.md,
            ...theme.shadows.sm
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: '600',
              color: theme.colors.primary,
              marginBottom: theme.spacing.sm
            }}>
              Next Appointment
            </Text>
            {nextAppointment ? (
              <Text style={{
                fontSize: theme.typography.md,
                color: theme.colors.text
              }}>
                {new Date(nextAppointment.appointmentDate).toLocaleString()}
              </Text>
            ) : (
              <Text style={{
                fontSize: theme.typography.md,
                color: theme.colors.textSecondary
              }}>
                No upcoming appointments
              </Text>
            )}
          </View>

          {/* Reports Card */}
          <View style={{
            backgroundColor: theme.colors.card,
            padding: theme.spacing.lg,
            borderRadius: theme.radii.md,
            ...theme.shadows.sm
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: '600',
              color: theme.colors.success,
              marginBottom: theme.spacing.sm
            }}>
              Medical Reports
            </Text>
            <Text style={{
              fontSize: theme.typography.md,
              color: theme.colors.text
            }}>
              {reports.length} report(s) available
            </Text>
          </View>

          {/* Diagnosis Card */}
          <View style={{
            backgroundColor: theme.colors.card,
            padding: theme.spacing.lg,
            borderRadius: theme.radii.md,
            ...theme.shadows.sm
          }}>
            <Text style={{
              fontSize: theme.typography.lg,
              fontWeight: '600',
              color: theme.colors.info,
              marginBottom: theme.spacing.sm
            }}>
              Recent Diagnosis
            </Text>
            {history.length > 0 ? (
              <Text style={{
                fontSize: theme.typography.md,
                color: theme.colors.text
              }}>
                {history[0].diagnosis}
              </Text>
            ) : (
              <Text style={{
                fontSize: theme.typography.md,
                color: theme.colors.textSecondary
              }}>
                No history available
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}