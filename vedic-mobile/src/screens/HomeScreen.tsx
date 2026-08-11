import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Linking, Image } from 'react-native';
import { Sun, Sparkles, Phone, MessageCircle, ChevronRight, Calendar, MapPin, Award, Star, Image as ImageIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useHomeStore } from '../store/useHomeStore';
import { Skeleton } from '../components/Skeleton';

export default function HomeScreen({ navigation }: any) {
  const { 
    todayPanchang, 
    todayMuhurats, 
    featuredPujas, 
    gallery, 
    reviews, 
    aboutInfo, 
    isLoading, 
    fetchHomeData 
  } = useHomeStore();
  
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
    const phoneNo = aboutInfo?.whatsappNo || '919340553012';
    Linking.openURL(`whatsapp://send?phone=${phoneNo}&text=हरि ओम आचार्य जी! मुझे पूजा के विषय में जानकारी चाहिए।`);
  };

  return (
    <View className="flex-1 bg-stone-50">
      
      {/* 1. Header with Hacked Image Mask */}
      <View className="bg-white pt-14 pb-4 px-5 flex-row justify-between items-center border-b border-slate-100 shadow-sm z-10">
        <View className="flex-1 justify-center">
          <View style={{ width: 45, height: 45, overflow: 'hidden', borderRadius: 25 }}>
            <Image 
              source={require('../../assets/logo.png')} 
              style={{ width: 200, height: 45, transform: [{ translateX: -10 }] }} 
              resizeMode="cover" 
            />
          </View>
        </View>

        <TouchableOpacity 
          onPress={openWhatsApp}
          className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex-row items-center"
        >
          <MessageCircle size={16} color="#16a34a" />
          <Text className="text-emerald-700 font-bold text-xs ml-1.5">संपर्क करें</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }} className="px-4 pt-5 pb-10">

          {/* 2. Interactive Today's Panchang Summary Card */}
          <View className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center bg-orange-100/80 px-2.5 py-1 rounded-lg">
                <Calendar size={14} color="#ea580c" />
                <Text className="text-orange-800 font-bold text-xs ml-1.5">आज का पंचांग</Text>
              </View>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Panchang')}
                className="flex-row items-center"
              >
                <Text className="text-orange-600 font-bold text-xs">संपूर्ण पंचांग</Text>
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
                  {todayPanchang?.tithi?.details?.tithi_name || 'तिथि लोड हो रही है...'}
                </Text>
                <Text className="text-slate-500 font-medium text-xs mb-4">
                  {todayPanchang?.paksha || 'पक्ष'} • नक्षत्र: {todayPanchang?.nakshatra?.details?.nak_name || '--'}
                </Text>

                {/* Interactive Segmented Switcher for Important Timings */}
                <View className="bg-stone-100 p-1 rounded-xl flex-row mb-3">
                  <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${activeTimingTab === 'rahu' ? 'bg-white shadow-xs' : ''}`}
                    onPress={() => handleTimingToggle('rahu')}
                  >
                    <Text className={`text-xs font-bold ${activeTimingTab === 'rahu' ? 'text-rose-600' : 'text-slate-500'}`}>
                      राहुकाल
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    className={`flex-1 py-2 rounded-lg items-center ${activeTimingTab === 'abhijit' ? 'bg-white shadow-xs' : ''}`}
                    onPress={() => handleTimingToggle('abhijit')}
                  >
                    <Text className={`text-xs font-bold ${activeTimingTab === 'abhijit' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      अभिजीत मुहूर्त
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {activeTimingTab === 'rahu' ? (
                    <Text className="text-rose-700 font-bold text-sm text-center">
                      राहुकाल: {todayPanchang?.rahukaal?.start || '--'} - {todayPanchang?.rahukaal?.end || '--'}
                    </Text>
                  ) : (
                    <Text className="text-emerald-700 font-bold text-sm text-center">
                      अभिजीत: {todayPanchang?.abhijit_muhurta?.start || '--'} - {todayPanchang?.abhijit_muhurta?.end || '--'}
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
                <Text className="text-white font-black text-sm ml-1.5">आज के शुभ मुहूर्त</Text>
              </View>
              <Text className="text-amber-50 font-medium text-xs leading-4" numberOfLines={2}>
                {todayMuhurats.length > 0 ? todayMuhurats[0]?.tithi : 'पूजा एवं अनुष्ठान के लिए शुभ तिथियां देखें।'}
              </Text>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('Muhurat')}
              className="bg-white px-3.5 py-2 rounded-xl"
            >
              <Text className="text-amber-700 font-bold text-xs">सभी देखें</Text>
            </TouchableOpacity>
          </View>

          {/* 4. Featured Pujas Carousel Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-slate-900">उज्जैन की प्रमुख पूजाएं</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Pujas')}>
                <Text className="text-orange-600 font-bold text-xs">सभी देखें</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 flex-row">
              {featuredPujas.map((puja) => (
                <View 
                  key={puja.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mr-3 w-64"
                >
                  <View className="bg-orange-100 self-start px-2.5 py-0.5 rounded-full mb-2">
                    <Text className="text-orange-700 font-bold text-[10px] uppercase">{puja.tag || 'विशेष पूजा'}</Text>
                  </View>

                  <Text className="text-base font-bold text-slate-800 mb-1" numberOfLines={1}>{puja.title}</Text>
                  
                  <View className="flex-row items-center mb-4">
                    <MapPin size={12} color="#64748b" />
                    <Text className="text-slate-500 text-xs ml-1" numberOfLines={1}>{puja.location || 'उज्जैन'}</Text>
                  </View>

                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Pujas', { 
                      screen: 'BookingForm', 
                      params: { pujaId: puja.id } 
                    })}
                    className="bg-orange-600 py-2.5 rounded-xl items-center"
                  >
                    <Text className="text-white font-bold text-xs">बुकिंग करें</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>



          {/* 5. Dynamic Gallery Section */}
          {gallery && gallery.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-3">
                <ImageIcon size={20} color="#334155" />
                <Text className="text-lg font-bold text-slate-900 ml-2">पूजा दर्शन</Text>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 flex-row">
                {gallery.map((img) => (
                  <Image 
                    key={img.id}
                    source={{ uri: img.imageUrl }}
                    className="w-48 h-32 rounded-2xl mr-3 border border-slate-200 bg-slate-200"
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* 6. Dynamic Review / Testimonials Section */}
          {reviews && reviews.length > 0 && (
            <View className="mb-8">
              <Text className="text-lg font-bold text-slate-900 mb-3">यजमानों के अनुभव</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4 flex-row">
                {reviews.map((review) => (
                  <View 
                    key={review.id}
                    className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mr-3 w-72"
                  >
                    <View className="flex-row items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={14} 
                          color={star <= review.rating ? "#eab308" : "#cbd5e1"} 
                          fill={star <= review.rating ? "#eab308" : "transparent"} 
                        />
                      ))}
                    </View>
                    <Text className="text-slate-600 text-sm leading-5 mb-3 italic">"{review.comment}"</Text>
                    <Text className="text-slate-900 font-bold text-xs">- {review.userName} {review.userCity ? `(${review.userCity})` : ''}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('WriteReview'); // Triggers the new screen
                }}
                className="bg-white border border-orange-200 py-3 rounded-xl items-center flex-row justify-center shadow-sm"
              >
                <Star size={16} color="#ea580c" />
                <Text className="text-orange-700 font-bold text-sm ml-2">अपना अनुभव साझा करें</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 7. Dynamic About Section */}
          {aboutInfo && (
            <View className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-6">
              <View className="flex-row items-center mb-3">
                <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-slate-200">
                  <Image 
                    source={{ uri: aboutInfo.image }} 
                    className="w-full h-full object-cover" 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900">
                    {aboutInfo.name}
                  </Text>
                  <Text className="text-slate-500 text-xs">{aboutInfo.yearsExp}+ वर्षों का अनुभव | {aboutInfo.pujasDone}+ अनुष्ठान</Text>
                </View>
              </View>

              <Text className="text-slate-600 text-sm leading-6 mb-5">
                {aboutInfo.descriptionHi || aboutInfo.descriptionEn}
              </Text>

              <TouchableOpacity 
                onPress={openWhatsApp}
                className="bg-slate-100 py-3.5 rounded-xl items-center flex-row justify-center"
              >
                <Phone size={16} color="#334155" />
                <Text className="text-slate-700 font-bold text-sm ml-2">पंडित जी से सीधे संपर्क करें</Text>
              </TouchableOpacity>
            </View>
          )}

        </Animated.View>
      </ScrollView>
    </View>
  );
}