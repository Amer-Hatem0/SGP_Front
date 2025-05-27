import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64'; // For JWT decoding
import { useEffect, useState } from 'react';

interface User {
  token: string;
  role: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on app launch
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await getStoredUser();
      setUser(storedUser);
      setLoading(false);
    };
    loadUser();
  }, []);

  // Save user to secure storage
  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Failed to save user', error);
    }
  };

  // Remove user data
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  // Get decoded JWT data
  const getTokenData = (token: string) => {
    try {
      const payload = token.split('.')[1];
      const decoded = decode(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  return {
    user,
    loading,
    saveUser,
    logout,
    getTokenData,
  };
}

// Helper functions
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch {
    return null;
  }
};

export const saveUserToStorage = async (user: User) => {
  await AsyncStorage.setItem('user', JSON.stringify(user));
};