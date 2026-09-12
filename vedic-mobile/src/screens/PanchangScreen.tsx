import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  CalendarDays,
  Moon,
  Sun,
  Clock3,
  Compass,
  Sparkles,
  RefreshCw,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePanchangStore } from '../store/usePanchangStore';

export default function PanchangScreen() {
  const insets = useSafeAreaInsets();

  const {
    panchangData,
    isLoading,
    error,
    selectedDate,
    setSelectedDate,
    fetchPanchang,
  } = usePanchangStore();

  const [showPicker, setShowPicker] =
    useState(false);

  const fadeAnim =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPanchang(selectedDate);
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
  }, [isLoading, panchangData]);

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

      fetchPanchang(date);
    }
  };

  const openPicker = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    setShowPicker(true);
  };

  const renderChoghadiyaList = (
    title: string,
    choghadiyaArray: any[]
  ) => {
    if (
      !choghadiyaArray ||
      choghadiyaArray.length === 0
    ) {
      return null;
    }

    const validEntries =
      choghadiyaArray.filter(
        (item) =>
          item.name &&
          item.name.trim() !== ''
      );

    if (validEntries.length === 0) {
      return null;
    }

    return (
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-[#292524] text-[19px] font-black">
            {title}
          </Text>

          <View className="bg-[#fff0df] rounded-full px-3 py-1">
            <Text className="text-[#971f1f] text-[10px] font-black">
              {validEntries.length} अवधि
            </Text>
          </View>
        </View>

        <View className="bg-[#fffdf8] rounded-[22px] border border-[#eadfce] overflow-hidden">
          {validEntries.map(
            (item, index) => {
              const type =
                item.type?.toLowerCase() ||
                '';

              const isShubh =
                type.includes('shubh') &&
                !type.includes('ashubh');

              const isAshubh =
                type.includes('ashubh');

              const badgeBg = isShubh
                ? '#ecfdf5'
                : isAshubh
                  ? '#fff1f2'
                  : '#f5f5f4';

              const badgeText =
                isShubh
                  ? '#047857'
                  : isAshubh
                    ? '#be123c'
                    : '#78716c';

              const label =
                isShubh
                  ? 'शुभ'
                  : isAshubh
                    ? 'अशुभ'
                    : 'सामान्य';

              return (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 14,

                    borderBottomWidth:
                      index !==
                      validEntries.length -
                        1
                        ? 1
                        : 0,

                    borderBottomColor:
                      '#f1e7da',
                  }}
                  className="flex-row items-center"
                >
                  <View className="flex-1">
                    <Text className="text-[#292524] text-[15px] font-black">
                      {item.name?.trim()}
                    </Text>

                    <View
                      style={{
                        alignSelf:
                          'flex-start',
                        marginTop: 5,
                        backgroundColor:
                          badgeBg,
                        borderRadius: 999,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            badgeText,
                          fontSize: 10,
                          fontWeight:
                            '800',
                        }}
                      >
                        {label}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center ml-3">
                    <Clock3
                      size={14}
                      color="#971f1f"
                    />

                    <Text className="text-[#57534e] text-[12px] font-bold ml-2">
                      {item.start?.trim()}
                      {' - '}
                      {item.end?.trim()}
                    </Text>
                  </View>
                </View>
              );
            }
          )}
        </View>
      </View>
    );
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
          paddingTop:
            insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 26,

          borderBottomLeftRadius: 34,
          borderBottomRightRadius: 34,
        }}
      >
        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-[#fff7ed] items-center justify-center">
            <Sun
              size={28}
              color="#971f1f"
              strokeWidth={1.8}
            />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-[#fffaf2] text-[28px] font-black">
              दैनिक पंचांग
            </Text>

            <Text className="text-[#f2d7b1] text-[14px] mt-1">
              उज्जैन समयानुसार
            </Text>
          </View>
        </View>

        {/* DATE */}

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
          onChange={
            handleDateChange
          }
        />
      )}

      {/* LOADING */}

      {isLoading ? (
        <View className="px-5 pt-7">
          {[1, 2, 3].map(
            (item) => (
              <View
                key={item}
                className="h-[135px] bg-[#ead6d1] rounded-[24px] mb-4 opacity-60"
              />
            )
          )}
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-16 h-16 rounded-full bg-[#fff0df] items-center justify-center">
            <RefreshCw
              size={28}
              color="#971f1f"
            />
          </View>

          <Text className="text-[#292524] text-[18px] font-black mt-4 text-center">
            पंचांग उपलब्ध नहीं है
          </Text>

          <Text className="text-stone-500 text-center mt-2">
            {error}
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            className="bg-[#971f1f] px-6 py-3 rounded-[16px] mt-5"
            onPress={() =>
              fetchPanchang(
                selectedDate
              )
            }
          >
            <Text className="text-[#fffaf2] font-black">
              फिर से प्रयास करें
            </Text>
          </TouchableOpacity>
        </View>
      ) : !panchangData ||
        !panchangData.data ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-[#fff0df] items-center justify-center">
            <Sparkles
              size={34}
              color="#971f1f"
            />
          </View>

          <Text className="text-[#292524] text-[20px] font-black mt-5 text-center">
            इस दिन का पंचांग उपलब्ध नहीं है
          </Text>

          <Text className="text-stone-500 text-[13px] leading-[20px] text-center mt-2">
            दूसरी तिथि चुनें या एडमिन द्वारा डेटा अपडेट होने के बाद पुनः प्रयास करें।
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
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 110,
          }}
        >
          <Animated.View
            style={{
              opacity:
                fadeAnim,

              transform: [
                {
                  translateY:
                    fadeAnim.interpolate(
                      {
                        inputRange: [
                          0, 1,
                        ],

                        outputRange: [
                          12, 0,
                        ],
                      }
                    ),
                },
              ],
            }}
          >
            {/* MAIN PANCHANG CARD */}

            <View
              style={{
                shadowColor:
                  '#7f1d1d',

                shadowOffset: {
                  width: 0,
                  height: 4,
                },

                shadowOpacity:
                  0.07,

                shadowRadius: 10,

                elevation: 2,
              }}
              className="bg-[#fffdf8] border border-[#eadfce] rounded-[26px] p-5 mb-5"
            >
              <View className="flex-row items-start">
                <View className="flex-1">
                  <Text className="text-[#971f1f] text-[11px] font-black">
                    आज की तिथि
                  </Text>

                  <Text className="text-[#292524] text-[26px] leading-[32px] font-black mt-1">
                    {panchangData.data
                      .tithi?.details
                      ?.tithi_name ||
                      'तिथि उपलब्ध नहीं'}
                  </Text>

                  <Text className="text-stone-500 text-[13px] mt-2 font-bold">
                    {panchangData.data
                      .paksha ||
                      '--'}
                    {' • '}
                    {panchangData.data
                      .data?.day ||
                      panchangData.data
                        .day ||
                      '--'}
                  </Text>
                </View>

                <View className="w-14 h-14 rounded-full bg-[#fff0df] items-center justify-center ml-3">
                  <Sun
                    size={26}
                    color="#971f1f"
                  />
                </View>
              </View>
            </View>

            {/* PANCHANG GRID */}

            <Text className="text-[#292524] text-[20px] font-black mb-3">
              पंचांग विवरण
            </Text>

            <View className="flex-row justify-between mb-3">
              <View className="w-[48.5%] bg-[#fffdf8] border border-[#eadfce] rounded-[20px] p-4">
                <Compass
                  size={20}
                  color="#971f1f"
                />

                <Text className="text-stone-400 text-[10px] font-bold mt-3">
                  नक्षत्र
                </Text>

                <Text className="text-[#292524] text-[14px] font-black mt-1">
                  {panchangData.data
                    .nakshatra
                    ?.details
                    ?.nak_name ||
                    '--'}
                </Text>
              </View>

              <View className="w-[48.5%] bg-[#fffdf8] border border-[#eadfce] rounded-[20px] p-4">
                <Moon
                  size={20}
                  color="#971f1f"
                />

                <Text className="text-stone-400 text-[10px] font-bold mt-3">
                  चंद्र राशि
                </Text>

                <Text className="text-[#292524] text-[14px] font-black mt-1">
                  {panchangData.data
                    .moon_sign ||
                    '--'}
                </Text>
              </View>
            </View>

            {/* IMPORTANT TIMINGS */}

            <Text className="text-[#292524] text-[20px] font-black mt-3 mb-3">
              महत्वपूर्ण समय
            </Text>

            <View className="flex-row justify-between mb-6">
              <View className="w-[48.5%] bg-[#fff1f2] border border-[#fecdd3] rounded-[20px] p-4">
                <View className="flex-row items-center">
                  <Clock3
                    size={17}
                    color="#be123c"
                  />

                  <Text className="text-[#881337] text-[12px] font-black ml-2">
                    राहु काल
                  </Text>
                </View>

                <Text className="text-[#be123c] text-[14px] font-black mt-3">
                  {panchangData.data
                    .rahukaal
                    ?.start ||
                    '--'}
                  {' - '}
                  {panchangData.data
                    .rahukaal?.end ||
                    '--'}
                </Text>
              </View>

              <View className="w-[48.5%] bg-[#ecfdf5] border border-[#a7f3d0] rounded-[20px] p-4">
                <View className="flex-row items-center">
                  <Sparkles
                    size={17}
                    color="#047857"
                  />

                  <Text className="text-[#065f46] text-[12px] font-black ml-2">
                    अभिजित मुहूर्त
                  </Text>
                </View>

                <Text className="text-[#047857] text-[14px] font-black mt-3">
                  {panchangData.data
                    .abhijit_muhurta
                    ?.start ||
                    '--'}
                  {' - '}
                  {panchangData.data
                    .abhijit_muhurta
                    ?.end ||
                    '--'}
                </Text>
              </View>
            </View>

            {renderChoghadiyaList(
              'दिन चौघड़िया',
              panchangData.data
                .choghadiya_day
            )}

            {renderChoghadiyaList(
              'रात्रि चौघड़िया',
              panchangData.data
                .choghadiya_night
            )}
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}