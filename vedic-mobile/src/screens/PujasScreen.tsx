import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Sparkles,
  Phone,
  HeartHandshake,
  Star,
  ShieldCheck,
  Flame,
  BookOpen,
  Home,
  ChevronRight,
} from 'lucide-react-native';

import { usePujaStore } from '../store/usePujaStore';
import { HomeStackParamList } from '../navigation/types';

type NavigationProp =
  NativeStackNavigationProp<HomeStackParamList, 'Categories'>;

const CATEGORY_ICONS = [
  Phone,
  HeartHandshake,
  Star,
  ShieldCheck,
  Flame,
  Sparkles,
  BookOpen,
  Home,
];

export default function PujasScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const {
    categories,
    isLoading,
    error,
    fetchCategories,
  } = usePujaStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fffaf2]">
        <ActivityIndicator size="large" color="#8f1d1d" />
        <Text className="mt-4 text-stone-500">
          पूजा सेवाएं लोड हो रही हैं...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#fffaf2] px-6">
        <Text className="text-red-500 text-center font-bold">
          {error}
        </Text>

        <TouchableOpacity
          className="mt-4 bg-[#8f1d1d] px-6 py-3 rounded-2xl"
          onPress={fetchCategories}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#fffaf2]">
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingBottom: 110,
        }}

        ListHeaderComponent={
          <>
            {/* MAROON HEADER */}
            <View
              style={{
                paddingTop: insets.top + 18,
              }}
              className="bg-[#971f1f] px-5 pb-7 rounded-b-[34px]"
            >
              <View className="flex-row items-center">
                <View className="w-14 h-14 rounded-full bg-[#fff8ed] items-center justify-center">
                  <Sparkles
                    size={28}
                    color="#971f1f"
                    strokeWidth={2}
                  />
                </View>

                <View className="ml-4 flex-1">
                  <Text className="text-white text-[28px] font-bold">
                    पूजा सेवाएं
                  </Text>

                  <Text className="text-[#f3d9ce] text-[15px] mt-1">
                    अपनी आवश्यकता के अनुसार श्रेणी चुनें
                  </Text>
                </View>
              </View>
            </View>

            <View className="px-5 pt-7 pb-3">
              <Text className="text-[22px] font-bold text-[#292524]">
                पूजा की श्रेणियां
              </Text>

              <Text className="text-stone-500 mt-1">
                सेवा चुनें और आगे उपलब्ध पूजा देखें
              </Text>
            </View>
          </>
        }

       renderItem={({ item, index }) => {
  const Icon =
    CATEGORY_ICONS[index % CATEGORY_ICONS.length];

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() =>
        navigation.navigate('Subcategories', {
          category: item,
        })
      }
      className="mx-5 mb-3"
    >
      <View
        style={{
          shadowColor: '#5b211b',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2,
        }}
        className="
          bg-white
          rounded-[22px]
          border border-[#eadfce]
          px-4 py-4
          flex-row
          items-center
        "
      >
        {/* ICON */}
        <View
          className="
            w-[52px] h-[52px]
            rounded-[18px]
            bg-[#fff0df]
            items-center
            justify-center
          "
        >
          <Icon
            size={25}
            color="#971f1f"
            strokeWidth={1.9}
          />
        </View>

        {/* TEXT */}
        <View className="flex-1 ml-4">
          <Text
            numberOfLines={2}
            className="
              text-[17px]
              leading-[23px]
              font-bold
              text-[#292524]
            "
          >
            {item.nameHi?.trim() ||
              item.nameEn?.trim()}
          </Text>

          {!!item.nameEn?.trim() && (
            <Text
              numberOfLines={1}
              className="
                text-[13px]
                leading-[18px]
                text-[#8f1d1d]
                mt-1
                font-medium
              "
            >
              {item.nameEn.trim()}
            </Text>
          )}

          {!!item.subcategories?.length && (
            <Text
              className="
                text-[12px]
                text-stone-400
                mt-1
              "
            >
              {item.subcategories.length} विकल्प
            </Text>
          )}
        </View>

        {/* ARROW */}
        <View
          className="
            w-10 h-10
            rounded-full
            bg-[#fff8ed]
            items-center
            justify-center
          "
        >
          <ChevronRight
            size={20}
            color="#971f1f"
            strokeWidth={2}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}}

        ListEmptyComponent={
          <Text className="text-center text-stone-500 mt-10">
            कोई श्रेणी उपलब्ध नहीं है।
          </Text>
        }
      />
    </View>
  );
}