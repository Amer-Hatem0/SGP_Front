import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import API_BASE_URL from '../../../config/apiConfig';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function VerifyEmailScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP code');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/Account/verify-email`, {
        email,
        code: otp
      });
      Alert.alert('Success', 'Email verified successfully!');
      router.replace('/(auth)/login');
    } catch (err: unknown) {
      console.error("Verification error:", err);
      let message = 'Verification failed. Please check the code and try again.';

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  // const handleResendOTP = async () => {
  //   setResendLoading(true);
  //   try {
  //     await axios.post(`${API_BASE_URL}/Account/resend-otp`, { email });
  //     Alert.alert('Success', 'New OTP sent to your email');
  //   } catch (err: unknown) {
  //     console.error("Resend error:", err);
  //     let message = 'Failed to resend OTP. Please try again.';

  //     if (axios.isAxiosError(err)) {
  //       message = err.response?.data?.message || message;
  //     }

  //     Alert.alert('Error', message);
  //   } finally {
  //     setResendLoading(false);
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify Email</Text>
        <Text style={styles.subtitle}>Check your email and enter the verification code.</Text>

        <TextInput
          placeholder="Enter OTP"
          placeholderTextColor="#9ca3af" // text-gray-400
          value={otp}
          onChangeText={setOtp}
          style={styles.input}
          keyboardType="numeric"
          
        />

        <Pressable
          onPress={handleVerify}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled
          ]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Verify Email</Text>
          )}
        </Pressable>

        {/* <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive code?</Text>
          <Pressable
            onPress={handleResendOTP}
            disabled={resendLoading}
          >
            <Text style={[
              styles.resendButtonText,
              resendLoading && styles.resendButtonDisabled
            ]}>
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </Text>
          </Pressable>
        </View> */}
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f0fdf4', // bg-green-50
  } as const,
  card: {
    marginHorizontal: 24,
    padding: 32,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  } as const,
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#166534', // text-green-800
  } as const,
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6b7280', // text-gray-500
  } as const,
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#86efac', // border-green-300
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    fontSize: 16,
    backgroundColor: 'white',
  } as const,
  button: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#15803d', // bg-green-700
  } as const,
  buttonPressed: {
    backgroundColor: '#166534', // bg-green-800
  } as const,
  buttonDisabled: {
    opacity: 0.6,
  } as const,
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    borderRadius: 8,
    backgroundColor: '#15803d', // bg-green-700
    padding: 12,
    textAlign: 'center'
  } as const,
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 4,
  } as const,
  resendText: {
    fontSize: 14,
    color: '#6b7280', // text-gray-500
  } as const,
  resendButtonText: {
    fontSize: 14,
    color: '#15803d', // text-green-700
    fontWeight: '600',
  } as const,
  resendButtonDisabled: {
    color: '#9ca3af', // text-gray-400
  } as const,
};