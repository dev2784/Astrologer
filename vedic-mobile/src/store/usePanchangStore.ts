import { create } from 'zustand';
import { api } from '../utils/api';

interface PanchangState {
  panchangData: any | null;
  isLoading: boolean;
  error: string | null;
  selectedDate: Date;
  fetchPanchang: (date: Date) => Promise<void>;
  setSelectedDate: (date: Date) => void;
}

export const usePanchangStore = create<PanchangState>((set, get) => ({
  panchangData: null,
  isLoading: false,
  error: null,
  selectedDate: new Date(), // Defaults to today
  
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchPanchang(date); // Immediately fetch data when date changes
  },

  fetchPanchang: async (date) => {
    set({ isLoading: true, error: null, panchangData: null });
    try {
      // Use local timezone formatting to prevent UTC shifts
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      const response = await api.get(`/panchang?date=${formattedDate}`);
      
		
      // Based on your payload, the API returns an array (list: [{...}]). 
      // We extract the first item. If the array is empty, we set null.
      const dataList = response.data;
      const todayPanchang = dataList;
      set({ panchangData: todayPanchang, isLoading: false });
    } catch (error: any) {
      const errMsg = error?.response?.data?.error || error.message || 'Failed to fetch Panchang data';
      
      // If the backend says no data, or returns a 404, don't treat it as an error. 
      // Just set data to null so the UI shows the clean empty state.
      if (error?.response?.status === 404 || errMsg.includes('No Panchang data')) {
        set({ panchangData: null, error: null, isLoading: false });
      } else {
        set({ error: errMsg, isLoading: false });
      }
    }
  },
}));