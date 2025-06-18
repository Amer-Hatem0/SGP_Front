import { View, Text,ActivityIndicator, ScrollView, TextInput, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, makeStyles, makeProfileStyles, makeMedicalStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '@/config/apiConfig';
import { KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


type Profile = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  currentStatus: string;
};

type ProfileField = {
  label: string;
  key: keyof Profile; // This ensures key can only be properties of Profile
};

const formatDate = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoString; // fallback to original if error occurs
  }
};

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const styles2 = makeProfileStyles(theme);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ... (fetch logic same as web)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (!userData) throw new Error('User not found');
        
        const { token } = JSON.parse(userData);
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(decoded.userId || decoded.sub);

        const res = await axios.get(
          `${API_BASE_URL}/Patient/Profile/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(res.data);
        setForm(res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) throw new Error('User not found');
      
      const { token } = JSON.parse(userData);
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = parseInt(decoded.userId || decoded.sub);
      console.log("Sending this data:", form); // 👈 ADD THIS
      const response= await axios.put(
        `${API_BASE_URL}/Patient/Profile/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Response:", response.data); // 👈 ADD THIS
      setProfile(prev => ({ ...prev!, ...form }));
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const handleChange = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const profileFields: ProfileField[] = [
    { label: 'Full Name', key: 'fullName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone', key: 'phone' },
    { label: 'Gender', key: 'gender' },
    { label: 'Date of Birth', key: 'dateOfBirth' },
    { label: 'Status', key: 'currentStatus' }
  ];

  return (
    <View style={{ flex: 1}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={100} // adjust depending on header height
    >
      <ScrollView style={{ flex: 1,
       paddingTop: 80,  // For navbar
      paddingBottom: 100,  // For tabbar
      paddingHorizontal: theme.spacing.lg }}>

        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: theme.spacing.lg }}>
          Patient Profile
        </Text>

        {profile ? (
          <View style={styles2.container}>
            <View style={styles.profileHeader}>
              <Image 
                source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar7.png' }} 
                style={styles.avatar}
              />
              <Text style={styles.profileName}>{profile.fullName}</Text>
              <Text style={styles.profileRole}>Patient</Text>
            </View>

            <View style={styles.profileDetails}>
              {profileFields.map(field => (
                <View key={field.key} style={styles.profileField}>
                  <Text style={styles.fieldLabel}>{field.label}:</Text>
                  {editing ? (
                    field.key === 'dateOfBirth' ? (
                    <TextInput
                      value={form.dateOfBirth?.split('T')[0] || ''} // Show just YYYY-MM-DD when editing
                      onChangeText={text => handleChange('dateOfBirth', text)}
                      style={styles.textInput}
                      placeholder="YYYY-MM-DD"
                    />
                  ) : (
                    <TextInput
                      value={form[field.key] || ''}
                      onChangeText={text => handleChange(field.key, text)}
                      style={styles.textInput}
                    />
                  )
                 ) : (
                    <Text style={styles.fieldValue}>
                      {field.key === 'dateOfBirth' 
                        ? formatDate(profile[field.key]) 
                        : profile[field.key]}
                    </Text>
                  )}
                </View>
              ))}

              <Pressable
                onPress={editing ? handleSave : () => setEditing(true)}
                style={[
                  styles.button,
                  editing ? styles.saveButton : styles.editButton
                ]}
              >
                <Text style={styles.buttonText}>
                  {editing ? 'Save' : 'Edit'}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text>Loading profile...</Text>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}