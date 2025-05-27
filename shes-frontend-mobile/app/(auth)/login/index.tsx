import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import  useAuth  from '../../../hooks/useAuth';
import { router } from 'expo-router';
import  axios  from 'axios';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { saveUser, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5014/api/Account/Login', {
        userName: email,
        password,
      });

      await saveUser({
        token: res.data.token,
        role: res.data.role || 'Patient'
      });

      // Role-based redirection
      router.replace(`./app/(app)/${res.data.role.toLowerCase()}/home`);
    } catch (err) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-blue-50">
      <Text className="text-3xl font-bold text-center text-blue-800 mb-6">Welcome Back</Text>
      
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        className="w-full mb-4 p-3 border border-blue-300 rounded"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        className="w-full mb-4 p-3 border border-blue-300 rounded"
        secureTextEntry
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className={`w-full p-3 rounded ${loading ? 'bg-blue-400' : 'bg-blue-700'}`}
      >
        <Text className="text-white text-center">Sign In</Text>
      </Pressable>

      <View className="flex-row justify-center mt-4">
        <Pressable onPress={() => router.push('/register')}>
          <Text className="text-blue-700 mr-4">Create account</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/forgot-password')}>
          <Text className="text-blue-700">Forgot password?</Text>
        </Pressable>
      </View>
    </View>
  );
}