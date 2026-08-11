import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Moon, Sun, Clock, Compass } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { usePanchangStore } from '../store/usePanchangStore';
import { CardSkeletonList } from '../components/Skeleton';

export default function PanchangScreen() {
  const { panchangData, isLoading, error, selectedDate, setSelectedDate, fetchPanchang } = usePanchangStore();
  const [showPicker, setShowPicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPanchang(selectedDate);
  }, []);

  useEffect(() => {
    if (!isLoading && panchangData) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, panchangData]);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') setShowPicker(false);
    if (date) {
      Haptics.selectionAsync();
      setSelectedDate(date);
    }
  };

  const openPicker = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPicker(true);
  };

  const renderChoghadiyaList = (title: string, choghadiyaArray: any[]) => {
    if (!choghadiyaArray || choghadiyaArray.length === 0) return null;
    const validEntries = choghadiyaArray.filter(item => item.name && item.name.trim() !== '');
    if (validEntries.length === 0) return null;

    return (
      <View className="mb-6">
        <Text className="text-lg font-bold text-slate-800 mb-3">{title}</Text>
        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {validEntries.map((item, index) => {
            const isShubh = item.type?.toLowerCase().includes('shubh') && !item.type?.toLowerCase().includes('ashubh');
            const isAshubh = item.type?.toLowerCase().includes('ashubh');

            let bgColor = "bg-white";
            let textColor = "text-slate-700";
            let typeLabel = "Neutral";
            let badgeBg = "bg-slate-100";

            if (isShubh) {
              bgColor = "bg-emerald-50/60";
              textColor = "text-emerald-900";
              typeLabel = "Auspicious";
              badgeBg = "bg-emerald-100";
            } else if (isAshubh) {
              bgColor = "bg-rose-50/60";
              textColor = "text-rose-900";
              typeLabel = "Inauspicious";
              badgeBg = "bg-rose-100";
            }

            return (
              <View
                key={index}
                className={`p-3.5 flex-row justify-between items-center ${bgColor} ${
                  index !== validEntries.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className={`font-bold text-base ${textColor}`}>{item.name?.trim()}</Text>
                  <View className={`self-start px-2 py-0.5 rounded-full mt-1 ${badgeBg}`}>
                    <Text className={`text-[10px] font-bold ${textColor}`}>{typeLabel}</Text>
                  </View>
                </View>
                <Text className="font-semibold text-slate-600 text-sm">
                  {item.start?.trim()} - {item.end?.trim()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-amber-100">
      <View className="bg-amber-300 pt-14 pb-4 px-5 flex-row justify-between items-center border-b border-slate-100 shadow-sm z-10">
        <View>
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Daily Panchang</Text>
          <Text className="text-xs text-orange-600 font-semibold tracking-wider uppercase mt-0.5">Ujjain Timezone</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center bg-orange-50 border border-orange-200/60 px-3.5 py-2 rounded-xl"
          onPress={openPicker}
        >
          <Calendar color="#ea580c" size={16} />
          <Text className="text-orange-700 font-bold ml-2 text-xs">
            {selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {isLoading ? (
        <CardSkeletonList count={3} />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-rose-600 font-bold text-center mb-4 text-base">{error}</Text>
          <TouchableOpacity
            className="bg-orange-600 px-6 py-3 rounded-xl shadow-sm"
            onPress={() => fetchPanchang(selectedDate)}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !panchangData || !panchangData.data ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-slate-400 font-medium text-base text-center">
            No Panchang entries recorded for this date.
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 pt-5" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <View className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm mb-5">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-2xl font-black text-slate-900 mb-1">
                    {panchangData.data.tithi?.details?.tithi_name || 'Tithi Not Available'}
                  </Text>
                  <Text className="text-orange-600 font-bold text-xs uppercase tracking-wider">
                    {panchangData.data.paksha} • {panchangData.data.data?.day || panchangData.data.day}
                  </Text>
                </View>
                <View className="bg-amber-100/80 p-2.5 rounded-2xl">
                  <Sun color="#d97706" size={24} />
                </View>
              </View>

              <View className="flex-row flex-wrap gap-2 pt-3 border-t border-slate-100">
                <View className="bg-slate-50 px-3 py-1.5 rounded-lg flex-row items-center">
                  <Compass size={14} color="#64748b" />
                  <Text className="text-slate-600 text-xs font-semibold ml-1.5">
                    {panchangData.data.nakshatra?.details?.nak_name || '--'}
                  </Text>
                </View>
                <View className="bg-slate-50 px-3 py-1.5 rounded-lg flex-row items-center">
                  <Moon size={14} color="#64748b" />
                  <Text className="text-slate-600 text-xs font-semibold ml-1.5">
                    {panchangData.data.moon_sign || '--'} Sign
                  </Text>
                </View>
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-lg font-bold text-slate-800 mb-3">Important Timings</Text>
              
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-rose-50/80 p-4 rounded-2xl border border-rose-100">
                  <View className="flex-row items-center mb-1">
                    <Clock size={16} color="#e11d48" />
                    <Text className="text-rose-900 font-bold text-xs ml-1.5">Rahu Kaal</Text>
                  </View>
                  <Text className="text-rose-700 font-extrabold text-sm mt-1">
                    {panchangData.data.rahukaal?.start || '--'} - {panchangData.data.rahukaal?.end || '--'}
                  </Text>
                </View>

                <View className="flex-1 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100">
                  <View className="flex-row items-center mb-1">
                    <Clock size={16} color="#059669" />
                    <Text className="text-emerald-900 font-bold text-xs ml-1.5">Abhijit Muhurta</Text>
                  </View>
                  <Text className="text-emerald-700 font-extrabold text-sm mt-1">
                    {panchangData.data.abhijit_muhurta?.start || '--'} - {panchangData.data.abhijit_muhurta?.end || '--'}
                  </Text>
                </View>
              </View>
            </View>

            {renderChoghadiyaList("Day Choghadiya", panchangData.data.choghadiya_day)}
            {renderChoghadiyaList("Night Choghadiya", panchangData.data.choghadiya_night)}

            <View className="h-10" />
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}