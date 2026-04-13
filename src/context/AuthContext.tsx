import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface Psychic {
  id: string;
  email: string;
  name: string;
  profile_picture?: string;
  specialties: string[];
  years_experience: number;
  chat_rate: number;
  phone_rate: number;
  video_rate: number;
  online_status: string;
  total_earnings: number;
  average_rating: number;
  total_reviews: number;
  total_readings: number;
  status: string; // pending, approved, suspended
}

interface AuthContextType {
  psychic: Psychic | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Psychic>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [psychic, setPsychic] = useState<Psychic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedPsychic = await AsyncStorage.getItem('psychic');
      if (storedPsychic) {
        setPsychic(JSON.parse(storedPsychic));
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/psychic/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.psychic) {
        setPsychic(data.psychic);
        await AsyncStorage.setItem('psychic', JSON.stringify(data.psychic));
        return { success: true };
      } else {
        return { success: false, error: data.detail || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = async () => {
    setPsychic(null);
    await AsyncStorage.removeItem('psychic');
  };

  const updateProfile = (data: Partial<Psychic>) => {
    if (psychic) {
      const updated = { ...psychic, ...data };
      setPsychic(updated);
      AsyncStorage.setItem('psychic', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        psychic,
        isLoading,
        isAuthenticated: !!psychic,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
