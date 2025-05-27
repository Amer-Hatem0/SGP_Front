import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import  useAuth from '../../../hooks/useAuth';
import { router } from 'expo-router';
import axios from 'axios';
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
  const { saveUser } = useAuth();

  const handleChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5014/api/Account/Register', form);
      
      await saveUser({
        token: res.data.token,
        role: res.data.role || 'Patient'
      });

      Alert.alert('Success', 'Registered successfully!');
      router.replace(`/(app)/${res.data.role.toLowerCase()}/home`);
    } catch (err) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View className="flex-1 p-6 bg-green-50">
      <Text className="text-3xl font-bold text-center text-green-800 mb-6">Create Account</Text>
      
      <View className="flex flex-wrap flex-row justify-between">
        {Object.entries(form).map(([key, value]) => (
          <TextInput
            key={key}
            placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
            value={value}
            onChangeText={(text) => handleChange(key, text)}
            className="w-[48%] mb-4 p-2 border border-green-300 rounded"
            secureTextEntry={key === 'password'}
            keyboardType={
              key === 'email' ? 'email-address' :
              key === 'phoneNumber' ? 'phone-pad' :
              key === 'age' ? 'numeric' : 'default'
            }
          />
        ))}
      </View>

      <Pressable
        onPress={handleRegister}
        className="mt-6 w-full bg-green-700 p-3 rounded"
      >
        <Text className="text-white text-center">Sign Up</Text>
      </Pressable>

      <Pressable 
        onPress={() => router.push('/login')}
        className="mt-4"
      >
        <Text className="text-green-700 text-center">Already have an account? Login</Text>
      </Pressable>
    </View>
  );
}