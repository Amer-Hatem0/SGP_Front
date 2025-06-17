import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  TextInput,
  Pressable
} from 'react-native';
import { useTheme, makeForgotPasswordStyles } from '../../styles/themes';
import { router } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '../../../config/apiConfig';

export default function ForgotPasswordScreen() {
  const { theme } = useTheme();
  const styles = makeForgotPasswordStyles(theme);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter your username');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/Account/send-otp`, { username });
      setStep(2);
      Alert.alert('Success', 'OTP sent to your registered email');
    } catch (err: unknown) {
      console.error("OTP send error:", err);
      let message = 'Failed to send OTP. Please check your username.';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter both OTP and new password');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/Account/reset-password`, {
        username,
        otp,
        newPassword
      });
      
      Alert.alert('Success', 'Password reset successfully!');
      router.replace('/(auth)/login');
    } catch (err: unknown) {
      console.error("Password reset error:", err);
      let message = 'Password reset failed. Please try again.';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      Alert.alert('Error', message);
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
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={theme.colors.textSecondary}
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
          />

          {step === 2 && (
            <>
              <TextInput
                placeholder="Enter OTP"
                placeholderTextColor={theme.colors.textSecondary}
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="New Password"
                placeholderTextColor={theme.colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                secureTextEntry
              />
            </>
          )}

          <Pressable
            onPress={step === 1 ? handleSendOTP : handleResetPassword}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled,
              step === 1 ? styles.otpButton : styles.resetButton
            ]}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>
                {step === 1 ? 'Send OTP' : 'Reset Password'}
              </Text>
            )}
          </Pressable>

          <Pressable 
            onPress={() => router.push('/(auth)/login')}
            style={({ pressed }) => pressed && styles.linkPressed}
          >
            <Text style={styles.linkText}>Back to Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}