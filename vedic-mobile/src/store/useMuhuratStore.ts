import { create } from 'zustand';
import { api } from '../utils/api';

interface MuhuratState {
  muhurats: any[];
  isLoading: boolean;
  error: string | null;
  selectedDate: Date;
  fetchMuhurats: (date: Date) => Promise<void>;
  setSelectedDate: (date: Date) => void;
}

export const useMuhuratStore = create<MuhuratState>((set, get) => ({
  muhurats: [],
  isLoading: false,
  error: null,
  selectedDate: new Date(), 
  
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchMuhurats(date);
  },

  fetchMuhurats: async (date) => {
    set({ isLoading: true, error: null, muhurats: [] });
    try {
      // Safe timezone formatting
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const response = await api.get(`/muhurat?date=${formattedDate}`);
      console.log(response.data)
      const dataList = response.data.muhurats || [];
      set({ muhurats: dataList, isLoading: false });
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || error.message || 'Failed to fetch Muhurat data';
      
      // Same logic: suppress 404s and empty data messages
      if (error?.response?.status === 404 || errMsg.includes('No data') || errMsg.includes('No Muhurat')) {
        set({ muhurats: [], error: null, isLoading: false });
      } else {
        set({ error: errMsg, isLoading: false });
      }
    }
  },
}));