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
    import { TouchableWithoutFeedback, Keyboard } from 'react-native';

import { router } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '../../../config/apiConfig';

export default function RegisterScreen() {
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
      await axios.post(`${API_BASE_URL}/Account/Register`, form);
      Alert.alert('Success', 'Registered successfully. Check your email for OTP code.');
      router.push({
        pathname: '../(auth)/verifyemail',
        params: { email: form.email }
      });
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

  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    
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

          <View style={styles.gridContainer}>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9ca3af"
              value={form.userName}
              onChangeText={(text) => handleChange('userName', text)}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#9ca3af"
              value={form.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Phone"
              placeholderTextColor="#9ca3af"
              value={form.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              placeholder="Gender"
              placeholderTextColor="#9ca3af"
              value={form.gender}
              onChangeText={(text) => handleChange('gender', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Date of Birth (YYYY-MM-DD)"
              placeholderTextColor="#9ca3af"
              value={form.dateOfBirth}
              onChangeText={(text) => handleChange('dateOfBirth', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Age"
              placeholderTextColor="#9ca3af"
              value={form.age}
              onChangeText={(text) => handleChange('age', text)}
              style={styles.input}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={form.password}
              onChangeText={(text) => handleChange('password', text)}
              style={styles.input}
              secureTextEntry
            />
          </View>

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
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // bg-green-50
  } as const,
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  } as const,
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12, // rounded-xl
    padding: 40, // p-10
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // shadow-lg
    maxWidth: 500, // max-w-lg
    alignSelf: 'center',
    width: '90%',
  } as const,
  title: {
    fontSize: 24, // text-3xl
    fontWeight: '800', // font-extrabold
    textAlign: 'center',
    marginBottom: 24, // mb-6
    color: '#166534', // text-green-800
  } as const,
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16, // gap-4
    marginBottom: 24, // mt-6 equivalent
  } as const,
  input: {
    width: '100%', // grid-cols-2
    height: 40, // p-2 height
    borderWidth: 1,
    borderColor: '#86efac', // border-green-300
    borderRadius: 8, // rounded
    padding: 8, // p-2
    marginBottom: 0,
    fontSize: 14,
  } as const,
  registerButton: {
    width: '100%',
    height: 48, // py-3
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // rounded
    backgroundColor: '#15803d', // bg-green-700
    marginTop: 24, // mt-6
  } as const,
  buttonPressed: {
    backgroundColor: '#166534', // hover:bg-green-800
  } as const,
  buttonDisabled: {
    opacity: 0.7,
  } as const,
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#15803d',
    padding: 12,
    textAlign: 'center',
    borderRadius: 8
  } as const,
  linksContainer: {
    marginTop: 16, // mt-4
    alignItems: 'center',
  } as const,
  linkText: {
    fontSize: 14, // text-sm
    color: '#15803d', // text-green-700
  } as const,
  linkPressed: {
    opacity: 0.7, // hover:underline equivalent
    textDecorationLine: 'underline',
  } as const,
};