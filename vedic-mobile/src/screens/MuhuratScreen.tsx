import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Platform, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Sparkles, Info } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useMuhuratStore } from '../store/useMuhuratStore';
import { CardSkeletonList } from '../components/Skeleton';

export default function MuhuratScreen() {
  const { muhurats, isLoading, error, selectedDate, setSelectedDate, fetchMuhurats } = useMuhuratStore();
  const [showPicker, setShowPicker] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchMuhurats(selectedDate);
  }, []);

  useEffect(() => {
    if (!isLoading && muhurats.length > 0) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, muhurats]);

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

  return (
    <View className="flex-1 bg-amber-100">
      <View className="bg-amber-300 pt-14 pb-4 px-5 flex-row justify-between items-center border-b border-slate-100 shadow-sm z-10">
        <View>
          <Text className="text-2xl font-extrabold text-slate-900 tracking-tight">Shubh Muhurat</Text>
          <Text className="text-xs text-orange-600 font-semibold tracking-wider uppercase mt-0.5">Auspicious Dates</Text>
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
          <Text className="text-rose-600 font-bold text-center mb-4">{error}</Text>
          <TouchableOpacity
            className="bg-orange-600 px-6 py-3 rounded-xl shadow-sm"
            onPress={() => fetchMuhurats(selectedDate)}
          >
            <Text className="text-white font-bold">Retry</Text>
          </TouchableOpacity>
        </View>
      ) : muhurats.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Sparkles size={36} color="#cbd5e1" className="mb-2" />
          <Text className="text-slate-400 font-medium text-base text-center">
            No special Muhurat entries recorded for this date.
          </Text>
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <FlatList
            data={muhurats}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const details = item.details && item.details !== 'undefined' ? item.details : null;

              return (
                <View className="bg-white p-5 rounded-2xl border border-slate-100 mb-4 shadow-sm">
                  <View className="flex-row items-start justify-between">
                    <Text className="text-lg font-bold text-slate-800 flex-1 leading-6">{item.tithi}</Text>
                    <View className="bg-amber-100/80 p-2 rounded-xl ml-2">
                      <Sparkles size={16} color="#d97706" />
                    </View>
                  </View>

                  {details && (
                    <View className="flex-row items-start mt-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <Info size={16} color="#ea580c" className="mt-0.5" />
                      <Text className="text-slate-600 font-medium ml-2.5 flex-1 leading-5 text-sm">
                        {details}
                      </Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        </Animated.View>
      )}
    </View>
  );
}