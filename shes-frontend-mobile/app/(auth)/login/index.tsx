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
import { decode } from 'base-64';
import { useTheme, makeLoginStyles } from '../../styles/themes';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../../../config/apiConfig';
import { useAuthContext } from '@/context/AuthContext';

export default function LoginScreen() {
  const { saveUser } = useAuthContext(); // Correct hook placement
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
      }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000,
    }
    );

      const token = res.data.token;
      const decoded = JSON.parse(decode(token.split('.')[1]));
      const role = decoded.role || 'Patient';
      const userId = parseInt(decoded.sub);

      if (!userId) {
        throw new Error('User ID not found in token');
      }

      // Save to AsyncStorage
      // await AsyncStorage.setItem('user', JSON.stringify({
      //   token,
      //   role,
      //   userId,
      //   email,
      //   name: decoded.name || 'User'
      // }));
      saveUser({
        token,
        role,
        userId,
        email,
        name: decoded.name || 'User'
      });
      const savedUser = await AsyncStorage.getItem('user');
      console.log('Saved user:', savedUser);
      

      // Role-based navigation
      switch (role) {
        case 'Patient':
          console.log("Patient logged in");
          router.replace('/(app)/patient/home');
          break;
        case 'Doctor':
          router.replace('/(app)/doctor/home');
          break;
        default:
          console.warn('Unknown role:', role);
          router.replace('/login');
      }
    } catch (err: unknown) {
          console.error("Login error:", err);

          let message = 'Invalid credentials. Please try again.';

          if (axios.isAxiosError(err)) {
            if (err.code === 'ERR_NETWORK') {
        message = 'Cannot connect to server. Check:';
        message += '\n• API URL: ' + API_BASE_URL;
        message += '\n• Network connection';
        message += '\n• CORS settings on server';
      } else {
        message = err.response?.data?.message || err.message;
      }
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
            loading && styles.buttonDisabled,
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