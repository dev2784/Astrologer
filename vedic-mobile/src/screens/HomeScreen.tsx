import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Linking } from 'react-native';
import { Sun, Sparkles, Phone, MessageCircle, ChevronRight, Calendar, MapPin, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useHomeStore } from '../store/useHomeStore';
import { Skeleton } from '../components/Skeleton';

export default function HomeScreen({ navigation }: any) {
  const { todayPanchang, todayMuhurats, featuredPujas, isLoading, fetchHomeData } = useHomeStore();
  const [activeTimingTab, setActiveTimingTab] = useState<'rahu' | 'abhijit'>('rahu');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading]);

  const handleTimingToggle = (type: 'rahu' | 'abhijit') => {
    Haptics.selectionAsync();
    setActiveTimingTab(type);
  };

  const openWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('whatsapp://send?phone=919340553012&text=Hari%20Om!%20I%20want%20to%20book%20a%20Puja.');
  };

  return (
    <View className="flex-1 bg-stone-50">
      
      {/* 1. Header with Branding */}
      <View className="bg-white pt-14 pb-4 px-5 flex-row justify-between items-center border-b border-slate-100 shadow-sm z-10">
        <View>
          <Text className="text-2xl font-black text-amber-700 tracking-tight">Shree Mahakal</Text>
          <Text className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Ujjain Pujas & Panchang</Text>
        </View>

        <TouchableOpacity 
          onPress={openWhatsApp}
          className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex-row items-center"
        >
          <MessageCircle size={16} color="#16a34a" />
          <Text className="text-emerald-700 font-bold text-xs ml-1.5">WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }} className="px-4 pt-5 pb-10">

          {/* 2. Interactive Today's Panchang Summary Card */}
          <View className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center bg-orange-100/80 px-2.5 py-1 rounded-lg">
                <Calendar size={14} color="#ea580c" />
                <Text className="text-orange-800 font-bold text-xs ml-1.5">Today's Panchang</Text>
              </View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Panchang')}
                className="flex-row items-center"
              >
                <Text className="text-orange-600 font-bold text-xs">Full Panchang</Text>
                <ChevronRight size={14} color="#ea580c" />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View className="py-2">
                <Skeleton width="70%" height={24} className="mb-2" />
                <Skeleton width="40%" height={16} />
              </View>
            ) : (
              <>
                <Text className="text-2xl font-black text-slate-900 mb-1">
                  {todayPanchang?.tithi?.details?.tithi_name || 'Tithi Loading...'}
                </Text>
                <Text className="text-slate-500 font-medium text-xs mb-4">
                  {todayPanchang?.paksha || 'Paksha'} • Nakshatra: {todayPanchang?.nakshatra?.details?.nak_name || '--'}
                </Text>

                {/* Interactive Segmented Switcher for Important Timings */}
                <View className="bg-stone-100 p-1 rounded-xl flex-row mb-3">
                  <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${activeTimingTab === 'rahu' ? 'bg-white shadow-xs' : ''}`}
                    onPress={() => handleTimingToggle('rahu')}
                  >
                    <Text className={`text-xs font-bold ${activeTimingTab === 'rahu' ? 'text-rose-600' : 'text-slate-500'}`}>
                      Rahu Kaal
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${activeTimingTab === 'abhijit' ? 'bg-white shadow-xs' : ''}`}
                    onPress={() => handleTimingToggle('abhijit')}
                  >
                    <Text className={`text-xs font-bold ${activeTimingTab === 'abhijit' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      Abhijit Muhurta
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {activeTimingTab === 'rahu' ? (
                    <Text className="text-rose-700 font-bold text-sm text-center">
                      Rahu Kaal: {todayPanchang?.rahukaal?.start || '--'} - {todayPanchang?.rahukaal?.end || '--'}
                    </Text>
                  ) : (
                    <Text className="text-emerald-700 font-bold text-sm text-center">
                      Abhijit: {todayPanchang?.abhijit_muhurta?.start || '--'} - {todayPanchang?.abhijit_muhurta?.end || '--'}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>

          {/* 3. Today's Shubh Muhurat Short Banner */}
          <View className="bg-amber-500 p-4 rounded-2xl mb-6 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center mb-1">
                <Sparkles size={16} color="#ffffff" />
                <Text className="text-white font-black text-sm ml-1.5">Today's Shubh Muhurat</Text>
              </View>
              <Text className="text-amber-50 font-medium text-xs leading-4" numberOfLines={2}>
                {todayMuhurats.length > 0 ? todayMuhurats[0]?.tithi : 'Check auspicious dates for Pujas and ceremonies.'}
              </Text>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Muhurat')}
              className="bg-white px-3.5 py-2 rounded-xl"
            >
              <Text className="text-amber-700 font-bold text-xs">View All</Text>
            </TouchableOpacity>
          </View>

          {/* 4. Featured Pujas Carousel Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-slate-900">Featured Pujas in Ujjain</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
                <Text className="text-orange-600 font-bold text-xs">Enquire All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 flex-row">
              {featuredPujas.map((puja) => (
                <View 
                  key={puja.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mr-3 w-64"
                >
                  <View className="bg-orange-100 self-start px-2.5 py-0.5 rounded-full mb-2">
                    <Text className="text-orange-700 font-bold text-[10px] uppercase">{puja.tag}</Text>
                  </View>

                  <Text className="text-base font-bold text-slate-800 mb-1" numberOfLines={1}>{puja.title}</Text>
                  
                  <View className="flex-row items-center mb-4">
                    <MapPin size={12} color="#64748b" />
                    <Text className="text-slate-500 text-xs ml-1" numberOfLines={1}>{puja.location}</Text>
                  </View>

                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Contact')}
                    className="bg-orange-600 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-white font-bold text-xs">Book / Enquire</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 5. About Panditji & Vedic Services Section */}
          <View className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <View className="flex-row items-center mb-3">
              <View className="bg-amber-100 p-2 rounded-xl mr-3">
                <Award size={20} color="#d97706" />
              </View>
              <View>
                <Text className="text-base font-bold text-slate-900">Vedic Authenticity</Text>
                <Text className="text-slate-500 text-xs">Experienced Priests in Ujjain</Text>
              </View>
            </View>

            <Text className="text-slate-600 text-xs leading-5 mb-4">
              We perform traditional Vedic Anushthan, Kalsarp Dosh Shanti, and Mangal Dosh Pujas at holy places in Ujjain following strict Vidhi-Vidhan.
            </Text>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Contact')}
              className="bg-slate-100 py-3 rounded-xl items-center flex-row justify-center"
            >
              <Phone size={16} color="#334155" />
              <Text className="text-slate-700 font-bold text-xs ml-2">Contact Panditji Directly</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}