import { create } from 'zustand';
import { api } from '../utils/api';

interface HomeState {
  todayPanchang: any | null;
  todayMuhurats: any[];
  featuredPujas: any[];
  isLoading: boolean;
  error: string | null;
  fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  todayPanchang: null,
  todayMuhurats: [],
  featuredPujas: [],
  isLoading: false,
  error: null,

  fetchHomeData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Get today's date in YYYY-MM-DD
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const todayStr = `${year}-${month}-${day}`;

      // Parallel API calls for fast home loading
      const [panchangRes, muhuratRes] = await Promise.allSettled([
        api.get(`/panchang?date=${todayStr}`),
        api.get(`/muhurat?date=${todayStr}`)
      ]);

      const panchangData = panchangRes.status === 'fulfilled' ? panchangRes.value.data?.data : null;
      const muhuratData = muhuratRes.status === 'fulfilled' ? (muhuratRes.value.data?.muhurats || []) : [];

      // Sample featured pujas (Replace with your API route when available)
      const mockPujas = [
        { id: '1', title: 'Mangal Dosh Nivaran Puja', location: 'Mangalnath Mandir, Ujjain', tag: 'Most Popular' },
        { id: '2', title: 'Kalsarp Dosh Shanti', location: 'Ram Ghat, Ujjain', tag: 'High Demand' },
        { id: '3', title: 'Maha Mrityunjay Jaap', location: 'Mahakaleshwar Temple, Ujjain', tag: 'Auspicious' },
      ];

      set({
        todayPanchang: panchangData,
        todayMuhurats: muhuratData,
        featuredPujas: mockPujas,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load home data', isLoading: false });
    }
  },
}));