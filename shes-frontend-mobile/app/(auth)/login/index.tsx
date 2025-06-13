// app/(auth)/login/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  Alert, 
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useTheme, makeLoginStyles } from '../../styles/themes';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../../config/apiConfig';

export default function LoginScreen() {
  const { theme } = useTheme();
  const styles = makeLoginStyles(theme);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/Account/Login`, {
        userName: email,
        password,
      });

      const token = res.data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role || 'Patient';
      const userId = parseInt(decoded.sub);

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify({
        token,
        role,
        userId,
        email,
        name: decoded.name || 'User'
      }));

      // Role-based navigation
      switch (role) {
        case 'Patient':
          router.replace('/(app)/patient/home');
          break;
        case 'Doctor':
          router.replace('/(app)/doctor/home');
          break;
        case 'Supervisor':
          router.replace('/(app)/supervisor/home');
          break;
        case 'Admin':
          router.replace('/(app)/admin/home');
          break;
        default:
          router.replace('/(auth)/login');
      }
    } catch (err: unknown) {
          console.error("Login error:", err);

          let message = 'Invalid credentials. Please try again.';

          if (axios.isAxiosError(err)) {
            message = err.response?.data?.message || message;
          }

          Alert.alert('Login Failed', message);
        } 
      finally {
          setLoading(false);
        }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        
        <TextInput
          autoFocus
          placeholder="Email Address"
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        <View style={styles.linksContainer}>
          <Pressable 
            onPress={() => router.push('/(auth)/register')}
            style={({ pressed }) => pressed && styles.linkPressed}
          >
            <Text style={styles.linkText}>Create account</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.push('/(auth)/forgot-password')}
            style={({ pressed }) => pressed && styles.linkPressed}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}