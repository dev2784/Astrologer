import { create } from 'zustand';
import { api } from '../utils/api';

// Accurately reflecting your actual database schema now
export interface Subcategory {
  id: string;
  nameEn: string;
  nameHi: string;
  slug: string;
  categoryId: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameHi: string;
  slug: string;
  subcategories: Subcategory[];
}

interface PujaState {
  categories: Category[];
  pujas: any[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchPujas: (subcategoryId?: string) => Promise<void>;
}
interface PujaState {
  categories: Category[];
  pujas: any[];
  selectedPuja: any | null; // New state for details
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchPujas: (subcategoryId?: string) => Promise<void>;
  fetchPujaDetails: (id: string) => Promise<void>; // New fetch action
}


// Add to your store implementation:
export const usePujaStore = create<PujaState>((set) => ({
  categories: [],
  pujas: [],
  selectedPuja: null,
  isLoading: false,
  error: null,
  
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/categories');
      
      // FIX: Extracting the actual array from response.data.categories
      const categoriesArray = response.data.categories || []; 
      
      set({ categories: categoriesArray, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch categories', isLoading: false });
    }
  },

  fetchPujas: async (subcategoryId) => {
    set({ isLoading: true, error: null });
    try {
      const url = subcategoryId ? `/pujas?subcategoryId=${subcategoryId}` : '/pujas';
      
      const response = await api.get(url);
      console.log("FETCHING PUJAS WITH URL:", response);
      set({ pujas: response.data.pujas || response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch pujas', isLoading: false });
    }
  },
  fetchPujaDetails: async (id) => {
    set({ isLoading: true, error: null, selectedPuja: null }); 
    try {
      const response = await api.get(`/pujas/${id}`);
      
      // We are intercepting the raw payload again
      console.log(`RAW API RESPONSE FOR PUJA ${id}:`, JSON.stringify(response.data, null, 2));
      
      // Temporarily assigning it exactly as is so the screen renders *something*
      set({ selectedPuja: response.data.puja || response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch puja details', isLoading: false });
    }
  },
}));