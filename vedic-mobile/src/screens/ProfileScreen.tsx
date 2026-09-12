import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {
  Phone,
  Mail,
  LogOut,
  ChevronRight,
  CalendarClock,
  LifeBuoy,
  UserRound,
  ShieldCheck,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '../store/useAuthStore';

export default function ProfileScreen({
  navigation,
}: any) {
  const insets = useSafeAreaInsets();

  const {
    userData,
    logout,
  } = useAuthStore();

  const handleLogout = () => {
    Haptics.selectionAsync();

    Alert.alert(
      'लॉगआउट करें',
      'क्या आप अपने खाते से लॉगआउट करना चाहते हैं?',
      [
        {
          text: 'रद्द करें',
          style: 'cancel',
        },
        {
          text: 'लॉगआउट',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );

            await logout();
          },
        },
      ]
    );
  };

  const userInitials =
    userData?.name
      ? userData.name
          .charAt(0)
          .toUpperCase()
      : 'U';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 110,
        }}
      >
        {/* =========================
            HEADER
        ========================= */}

        <View
          style={{
            backgroundColor: '#971f1f',

            paddingTop:
              insets.top + 18,

            paddingHorizontal: 20,

            paddingBottom: 32,

            borderBottomLeftRadius: 34,
            borderBottomRightRadius: 34,
          }}
        >
          <Text className="text-[#f2d7b1] text-[12px] font-bold">
            आपका खाता
          </Text>

          <Text className="text-[#fffaf2] text-[29px] font-black mt-1">
            मेरी प्रोफ़ाइल
          </Text>

          <Text className="text-[#f2d7b1] text-[13px] mt-1">
            अपनी जानकारी और बुकिंग प्रबंधित करें
          </Text>

          {/* PROFILE IDENTITY */}

          <View className="mt-6 bg-white/10 rounded-[24px] px-4 py-4 flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-[#fff7ed] items-center justify-center">
              <Text className="text-[#971f1f] text-[26px] font-black">
                {userInitials}
              </Text>
            </View>

            <View className="flex-1 ml-4">
              <Text
                numberOfLines={1}
                className="text-[#fffaf2] text-[20px] font-black"
              >
                {userData?.name ||
                  'Vedic User'}
              </Text>

              <View className="flex-row items-center mt-2">
                <Phone
                  size={14}
                  color="#f2d7b1"
                />

                <Text className="text-[#f2d7b1] text-[12px] ml-2">
                  {userData?.phone ||
                    'मोबाइल उपलब्ध नहीं'}
                </Text>
              </View>

              {userData?.email && (
                <View className="flex-row items-center mt-1">
                  <Mail
                    size={14}
                    color="#f2d7b1"
                  />

                  <Text
                    numberOfLines={1}
                    className="text-[#f2d7b1] text-[12px] ml-2 flex-1"
                  >
                    {userData.email}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* =========================
            CONTENT
        ========================= */}

        <View className="px-5 pt-7">

          {/* VERIFIED CARD */}

          <View className="bg-[#fff1df] border border-[#f3dfc5] rounded-[20px] px-4 py-4 flex-row items-center mb-6">
            <View className="w-10 h-10 rounded-full bg-[#fffdf8] items-center justify-center">
              <ShieldCheck
                size={20}
                color="#971f1f"
              />
            </View>

            <View className="flex-1 ml-3">
              <Text className="text-[#7f1d1d] text-[13px] font-black">
                सुरक्षित खाता
              </Text>

              <Text className="text-stone-600 text-[11px] leading-[17px] mt-1">
                आपकी बुकिंग और संपर्क जानकारी आपके खाते से सुरक्षित जुड़ी हुई है।
              </Text>
            </View>
          </View>

          {/* ACCOUNT OPTIONS */}

          <Text className="text-[#292524] text-[19px] font-black mb-3">
            खाता सेवाएं
          </Text>

          <View
            style={{
              shadowColor:
                '#7f1d1d',

              shadowOffset: {
                width: 0,
                height: 4,
              },

              shadowOpacity: 0.05,

              shadowRadius: 10,

              elevation: 2,
            }}
            className="bg-[#fffdf8] border border-[#eadfce] rounded-[24px] overflow-hidden"
          >

            {/* BOOKINGS */}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.selectionAsync();

                Alert.alert(
                  'जल्द उपलब्ध',
                  'आपकी पूजा बुकिंग का इतिहास जल्द यहां दिखाई देगा।'
                );
              }}
              className="flex-row items-center px-4 py-4 border-b border-[#f1e7da]"
            >
              <View className="w-11 h-11 rounded-full bg-[#fff0df] items-center justify-center">
                <CalendarClock
                  size={21}
                  color="#971f1f"
                />
              </View>

              <View className="flex-1 ml-3">
                <Text className="text-[#292524] text-[15px] font-black">
                  मेरी बुकिंग
                </Text>

                <Text className="text-stone-500 text-[11px] mt-1">
                  पूजा बुकिंग और स्थिति देखें
                </Text>
              </View>

              <ChevronRight
                size={20}
                color="#a8a29e"
              />
            </TouchableOpacity>

            {/* SUPPORT */}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.selectionAsync();

                navigation.navigate(
                  'Contact' as any
                );
              }}
              className="flex-row items-center px-4 py-4"
            >
              <View className="w-11 h-11 rounded-full bg-[#fff0df] items-center justify-center">
                <LifeBuoy
                  size={21}
                  color="#971f1f"
                />
              </View>

              <View className="flex-1 ml-3">
                <Text className="text-[#292524] text-[15px] font-black">
                  सहायता और संपर्क
                </Text>

                <Text className="text-stone-500 text-[11px] mt-1">
                  किसी प्रश्न के लिए हमसे संपर्क करें
                </Text>
              </View>

              <ChevronRight
                size={20}
                color="#a8a29e"
              />
            </TouchableOpacity>
          </View>

          {/* LOGOUT */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLogout}
            className="mt-6 bg-[#fffdf8] border border-[#fecaca] rounded-[20px] py-4 flex-row items-center justify-center"
          >
            <LogOut
              size={20}
              color="#b91c1c"
            />

            <Text className="text-[#b91c1c] text-[15px] font-black ml-2">
              लॉगआउट करें
            </Text>
          </TouchableOpacity>

          {/* FOOTER */}

          <View className="items-center mt-8">
            <UserRound
              size={19}
              color="#a8a29e"
            />

            <Text className="text-stone-400 text-[11px] mt-2 text-center">
              Hatkeshwar Jyotish
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}