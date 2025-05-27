import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleSendOTP = async () => {
    try {
      await axios.post('http://localhost:5014/api/Account/send-otp', { username });
      setStep(2);
      Alert.alert('Success', 'OTP sent to your registered email');
    } catch (err) {
      Alert.alert('Error', 'Failed to send OTP. Please check your username.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:5014/api/Account/reset-password', {
        username,
        otp,
        newPassword
      });
      Alert.alert('Success', 'Password reset successfully!');
      router.replace('/login');
    } catch (err) {
      Alert.alert('Error', 'Password reset failed. Please try again.');
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-yellow-50">
      <Text className="text-3xl font-bold text-center text-yellow-700 mb-6">Reset Password</Text>
      
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        className="w-full mb-4 p-3 border border-yellow-300 rounded"
      />

      {step === 2 && (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            className="w-full mb-4 p-3 border border-yellow-300 rounded"
            keyboardType="numeric"
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            className="w-full mb-4 p-3 border border-yellow-300 rounded"
            secureTextEntry
          />
        </>
      )}

      <Pressable
        onPress={step === 1 ? handleSendOTP : handleResetPassword}
        className={`w-full p-3 rounded ${step === 1 ? 'bg-yellow-600' : 'bg-yellow-700'}`}
      >
        <Text className="text-white text-center">
          {step === 1 ? 'Send OTP' : 'Reset Password'}
        </Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push('/login')}
        className="mt-4"
      >
        <Text className="text-yellow-700 text-center">Back to Login</Text>
      </Pressable>
    </View>
  );
}