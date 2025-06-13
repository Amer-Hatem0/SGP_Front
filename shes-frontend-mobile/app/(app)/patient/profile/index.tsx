import { View, Text,ActivityIndicator, ScrollView, TextInput, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, makeStyles, makeProfileStyles, makeMedicalStyles } from '../../../styles/themes';
import PatientSidebar from '../../../components/patient/Sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Profile>>({});
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const styles2 = makeProfileStyles(theme);
  const [loading, setLoading] = useState(true);
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
          `http://localhost:5014/api/Patient/Profile/${userId}`,
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

      await axios.put(
        `http://localhost:5014/api/Patient/Profile/${userId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

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
    <View style={{ flex: 1, flexDirection: 'row' }}>
      <PatientSidebar />
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
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
                    <TextInput
                      value={form[field.key] || ''}
                      onChangeText={text => handleChange(field.key, text)}
                      style={styles.textInput}
                    />
                  ) : (
                    <Text style={styles.fieldValue}>{profile[field.key]}</Text>
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
    </View>
  );
}