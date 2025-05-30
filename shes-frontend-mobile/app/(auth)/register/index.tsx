import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  Text,
  Pressable
} from 'react-native';
import { useTheme, makeRegisterStyles } from '../../styles/themes';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../../config/apiConfig';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const styles = makeRegisterStyles(theme);
  const [form, setForm] = useState({
    userName: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/Account/Register`, form);
      
      const token = res.data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role || 'Patient';
      const userId = parseInt(decoded.sub);

      await AsyncStorage.setItem('user', JSON.stringify({
        token,
        role,
        userId,
        email: form.email,
        name: decoded.name || form.fullName || 'User'
      }));

      Alert.alert('Success', 'Account created successfully!');
      router.replace(`../(app)/${role.toLowerCase()}/home`);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      let message = 'Registration failed. Please try again.';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Username"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.userName}
              onChangeText={(text) => handleChange('userName', text)}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              style={styles.input}
            />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Phone"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Gender"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.gender}
              onChangeText={(text) => handleChange('gender', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Age"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.age}
              onChangeText={(text) => handleChange('age', text)}
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          <TextInput
            placeholder="Password"
            placeholderTextColor={theme.colors.textSecondary}
            value={form.password}
            onChangeText={(text) => handleChange('password', text)}
            style={[styles.input, styles.fullWidthInput]}
            secureTextEntry
          />

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled
            ]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>

          <View style={styles.linksContainer}>
            <Pressable 
              onPress={() => router.push('/(auth)/login')}
              style={({ pressed }) => pressed && styles.linkPressed}
            >
              <Text style={styles.linkText}>Already have an account? Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}