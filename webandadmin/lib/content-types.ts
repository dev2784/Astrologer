export interface ChoghadiyaSlot {
  name: string;
  start: string;
  end: string;
  type: "shubh" | "ashubh" | "neutral" | "";
}

export interface PanchangData {
  day: string;
  sunrise: string;
  sunset: string;
  tithi: { details: { tithi_name: string }; end_time: { hour: number; minute: number; second: number } };
  nakshatra: { details: { nak_name: string }; end_time: { hour: number; minute: number; second: number } };
  yog: { details: { yog_name: string } };
  karan: { details: { karan_name: string } };
  hindu_maah: { purnimanta: string };
  paksha: string;
  ritu: string;
  ayana: string;
  vikram_samvat: number;
  shaka_samvat: number;
  sun_sign: string;
  moon_sign: string;
  abhijit_muhurta?: { start: string; end: string };
  rahukaal?: { start: string; end: string };
  choghadiya_day?: ChoghadiyaSlot[];
  choghadiya_night?: ChoghadiyaSlot[];
}

export interface PujaSummary { id: string; slug: string; titleEn: string; titleHi: string; imageUrl?: string; charges: string; placeOfPuja: string; estimatedTime: string; noOfYajman: string; }
