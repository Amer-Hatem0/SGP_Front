import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';

interface User {
  token: string;
  role: string;
  userId?: string | number;
}

interface TokenData {
  userId?: string | number;
  sub?: string;
  role?: string;
  exp?: number;
  [key: string]: any;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          const decoded = getTokenData(storedUser.token);
          if (decoded) {
            setTokenData(decoded);
            verifyTokenExpiration(decoded);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await clearAuthData();
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  // Verify token expiration
  const verifyTokenExpiration = useCallback((decodedToken: TokenData) => {
    if (!decodedToken?.exp) return;
    const isExpired = Date.now() >= decodedToken.exp * 1000;
    if (isExpired) {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please log in again.',
        [{ text: 'OK', onPress: () => logout() }]
      );
    }
  }, []);

  // Save user to secure storage
  const saveUser = useCallback(async (userData: User) => {
    try {
      const decoded = getTokenData(userData.token);
      if (!decoded) throw new Error('Invalid token');
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setTokenData(decoded);
      verifyTokenExpiration(decoded);
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  }, [verifyTokenExpiration]);

  // Remove all auth data
  const logout = useCallback(async () => {
    try {
      await clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Get decoded JWT data with proper typing
  const getTokenData = useCallback((token: string): TokenData | null => {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(decode(payload));
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }, []);

  // Clear all auth-related data
  const clearAuthData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setTokenData(null);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }, []);

  // Check authentication status
  const isAuthenticated = useCallback(() => {
    return !!user?.token && !isTokenExpired();
  }, [user]);

  // Check if token is expired
  const isTokenExpired = useCallback((): boolean => {
    if (!tokenData?.exp) return false;
    return Date.now() >= tokenData.exp * 1000;
  }, [tokenData]);

  return {
    user,
    loading,
    tokenData,
    saveUser,
    logout,
    getTokenData,
    isAuthenticated,
    isTokenExpired,
  };
}

// Storage helpers with proper typing
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userString = await AsyncStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Failed to get stored user:', error);
    return null;
  }
};

export const saveUserToStorage = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save user:', error);
    throw error;
  }
};

export const clearAuthStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Failed to clear auth storage:', error);
    throw error;
  }
};