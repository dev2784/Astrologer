import { create } from 'zustand';
import { api } from '../utils/api';

export interface HomeState {
  todayPanchang: any;
  todayMuhurats: any[];
  featuredPujas: any[];
  
  // Updated to match your exact web API payloads
  gallery: Array<{ id: string; titleEn: string; titleHi?: string; imageUrl: string }>;
  reviews: Array<{ id: string; userName: string; userCity?: string; rating: number; comment: string; createdAt: string }>;
  aboutInfo: { name: string; image: string; yearsExp: number; pujasDone: number; whatsappNo: string; descriptionEn: string; descriptionHi: string } | null;
  
  isLoading: boolean;
  fetchHomeData: () => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  todayPanchang: null,
  todayMuhurats: [],
  featuredPujas: [],
  gallery: [],
  reviews: [],
  aboutInfo: null,
  isLoading: true,

  fetchHomeData: async () => {
    set({ isLoading: true });
    try {
      const today = new Date().toISOString().split("T")[0];

      // Fire all API requests at the same time using Promise.allSettled to prevent one failure from breaking the whole screen
      const [panchangRes, pujasRes, galleryRes, aboutRes, reviewsRes] = await Promise.allSettled([
        api.get(`/panchang?date=${today}`),
        api.get(`/pujas`),
        api.get(`/gallery`),
        api.get(`/about`),
        api.get(`/reviews/admin/all?status=approved`) 
      ]);

      set({
        // Extract data safely, falling back to empty/null if an endpoint fails
        todayPanchang: panchangRes.status === 'fulfilled' ? panchangRes.value.data?.data || null : null,
        featuredPujas: pujasRes.status === 'fulfilled' ? (pujasRes.value.data?.pujas || pujasRes.value.data || []).slice(0, 10) : [],
        gallery: galleryRes.status === 'fulfilled' && galleryRes.value.data.success ? galleryRes.value.data.items : [],
        aboutInfo: aboutRes.status === 'fulfilled' && aboutRes.value.data.success ? aboutRes.value.data.about : null,
        reviews: reviewsRes.status === 'fulfilled' && reviewsRes.value.data.reviews ? reviewsRes.value.data.reviews.slice(0, 10) : [],
        isLoading: false,
      });

    } catch (error) {
      console.error("Failed to fetch home data:", error);
      set({ isLoading: false });
    }
  },
}));