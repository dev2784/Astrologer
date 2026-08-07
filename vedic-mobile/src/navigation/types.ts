export type HomeStackParamList = {
  Categories: undefined; // No params needed
  Subcategories: { category: any }; // We pass the whole category object to show its subcategories
  PujaList: { subcategoryId: string | number; title: string };
  PujaDetails: { pujaId: string | number };
  BookingForm: { pujaId: string | number; categoryId: string | number; subcategoryId: string | number };
};