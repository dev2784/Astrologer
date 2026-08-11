import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  userToken: string | null;
  userData: any | null;
  isLoading: boolean;
  
  // NEW: Redirect tracking
  redirectData: { tab: string; screen: string; params?: any } | null;
  setRedirect: (data: { tab: string; screen: string; params?: any }) => void;
  clearRedirect: () => void;

  checkAuth: () => Promise<void>;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  userToken: null,
  userData: null,
  isLoading: true,
  
  // NEW: Redirect implementations
  redirectData: null,
  setRedirect: (data) => set({ redirectData: data }),
  clearRedirect: () => set({ redirectData: null }),

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');
      if (token && user) {
        set({ userToken: token, userData: JSON.parse(user), isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (e) {
      set({ isLoading: false });
    }
  },

  login: async (token, user) => {
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(user));
    set({ userToken: token, userData: user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    set({ userToken: null, userData: null });
  },
}));