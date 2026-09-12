import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  CalendarDays,
  Sparkles,
  Info,
  Clock3,
  RefreshCw,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMuhuratStore } from '../store/useMuhuratStore';

export default function MuhuratScreen() {
  const insets = useSafeAreaInsets();

  const {
    muhurats,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    fetchMuhurats,
  } = useMuhuratStore();

  const [showPicker, setShowPicker] =
    useState(false);

  const fadeAnim =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchMuhurats(selectedDate);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, muhurats]);

  const handleDateChange = (
    event: any,
    date?: Date
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (date) {
      Haptics.selectionAsync();

      setSelectedDate(date);

      fetchMuhurats(date);
    }
  };

  const openPicker = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    setShowPicker(true);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      {/* HEADER */}

      <View
        style={{
          backgroundColor: '#971f1f',

          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 26,

          borderBottomLeftRadius: 34,
          borderBottomRightRadius: 34,
        }}
      >
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-[#fff7ed] items-center justify-center">
            <Sparkles
              size={27}
              color="#971f1f"
              strokeWidth={1.8}
            />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-[#fffaf2] text-[28px] font-black">
              शुभ मुहूर्त
            </Text>

            <Text className="text-[#f2d7b1] text-[14px] mt-1">
              शुभ कार्यों के लिए मंगल समय देखें
            </Text>
          </View>
        </View>

        {/* DATE SELECTOR */}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openPicker}
          className="mt-5 bg-white/10 rounded-[18px] px-4 py-3 flex-row items-center"
        >
          <View className="w-10 h-10 rounded-full bg-[#fff7ed] items-center justify-center">
            <CalendarDays
              size={20}
              color="#971f1f"
            />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-[#f2d7b1] text-[10px] font-bold">
              चयनित तिथि
            </Text>

            <Text className="text-[#fffaf2] text-[15px] font-black mt-1">
              {selectedDate.toLocaleDateString(
                'hi-IN',
                {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }
              )}
            </Text>
          </View>

          <Text className="text-[#fffaf2] text-[12px] font-bold">
            बदलें
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

      {/* CONTENT */}

      {isLoading ? (
        <View className="px-5 pt-7">
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="h-[130px] bg-[#ead6d1] rounded-[24px] mb-4 opacity-60"
            />
          ))}
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-full bg-[#fff0df] items-center justify-center">
            <RefreshCw
              size={28}
              color="#971f1f"
            />
          </View>

          <Text className="text-[#292524] font-black text-[18px] mt-4">
            मुहूर्त लोड नहीं हो पाए
          </Text>

          <Text className="text-stone-500 text-center mt-2">
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-[#971f1f] px-6 py-3 rounded-[16px] mt-5"
            onPress={() =>
              fetchMuhurats(selectedDate)
            }
          >
            <Text className="text-[#fffaf2] font-black">
              फिर से प्रयास करें
            </Text>
          </TouchableOpacity>
        </View>
      ) : muhurats.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-[#fff0df] items-center justify-center">
            <Sparkles
              size={34}
              color="#971f1f"
              strokeWidth={1.6}
            />
          </View>

          <Text className="text-[#292524] text-[20px] font-black text-center mt-5">
            आज कोई विशेष मुहूर्त नहीं
          </Text>

          <Text className="text-stone-500 text-[13px] leading-[20px] text-center mt-2">
            दूसरी तिथि चुनकर उपलब्ध शुभ मुहूर्त देखें।
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={openPicker}
            className="bg-[#971f1f] px-6 py-3 rounded-[16px] mt-5"
          >
            <Text className="text-[#fffaf2] font-black">
              दूसरी तिथि चुनें
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [
              {
                translateY:
                  fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [12, 0],
                  }),
              },
            ],
          }}
        >
          <FlatList
            data={muhurats}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 24,
              paddingBottom: 110,
            }}
            ListHeaderComponent={
              <View className="mb-4">
                <Text className="text-[#292524] text-[22px] font-black">
                  आज के शुभ मुहूर्त
                </Text>

                <Text className="text-stone-500 text-[13px] mt-1">
                  चयनित तिथि के उपलब्ध शुभ समय
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const details =
                item.details &&
                item.details !==
                  'undefined'
                  ? item.details
                  : null;

              return (
                <View
                  style={{
                    shadowColor: '#7f1d1d',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                  className="bg-[#fffdf8] border border-[#eadfce] rounded-[24px] p-5 mb-4"
                >
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 rounded-full bg-[#fff0df] items-center justify-center">
                      <Sparkles
                        size={22}
                        color="#971f1f"
                      />
                    </View>

                    <View className="flex-1 ml-4">
                      <Text className="text-[#292524] text-[18px] leading-[24px] font-black">
                        {item.tithi}
                      </Text>

                      <View className="flex-row items-center mt-2">
                        <Clock3
                          size={14}
                          color="#971f1f"
                        />

                        <Text className="text-[#971f1f] text-[12px] font-bold ml-2">
                          शुभ समय
                        </Text>
                      </View>
                    </View>
                  </View>

                  {details && (
                    <View className="bg-[#fff4e5] rounded-[18px] px-4 py-4 mt-4 flex-row items-start">
                      <Info
                        size={17}
                        color="#971f1f"
                      />

                      <Text className="text-stone-600 text-[13px] leading-[20px] flex-1 ml-3">
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