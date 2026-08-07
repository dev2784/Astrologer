import { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, useWindowDimensions, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RenderHtml from 'react-native-render-html';

import { usePujaStore } from '../store/usePujaStore';
import { HomeStackParamList } from '../navigation/types';

type PujaDetailsRouteProp = RouteProp<HomeStackParamList, 'PujaDetails'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BookingForm'>;

export default function PujaDetailsScreen() {
  const route = useRoute<PujaDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  
  const { pujaId } = route.params;
  const { selectedPuja, isLoading, error, fetchPujaDetails } = usePujaStore();

  useEffect(() => {
    if (pujaId) fetchPujaDetails(pujaId as string);
  }, [pujaId]);

  if (isLoading || !selectedPuja) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50">
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50 p-6">
        <Text className="text-red-500 font-bold text-center">{error}</Text>
      </View>
    );
  }

  // Base styling for the HTML renderer to make it match your app's typography
  const htmlStyles = {
    p: { fontSize: 16, color: '#334155', lineHeight: 24, marginBottom: 10 },
    strong: { color: '#0f172a' },
    ul: { paddingLeft: 20, color: '#334155' },
    li: { marginBottom: 5, lineHeight: 22 },
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        {selectedPuja.imageUrl && (
          <Image 
            source={{ uri: selectedPuja.imageUrl }} 
            className="w-full h-64 bg-stone-200"
            resizeMode="cover"
          />
        )}

        <View className="p-5">
          {/* Titles */}
          <Text className="text-2xl font-bold text-slate-800">
            {selectedPuja.titleEn?.trim()}
          </Text>
          <Text className="text-lg text-orange-600 font-medium mt-1 mb-4">
            {selectedPuja.titleHi?.trim()}
          </Text>

          {/* Info Grid */}
          <View className="bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6 flex-row flex-wrap">
            <View className="w-1/2 mb-3">
              <Text className="text-xs text-slate-500 font-bold uppercase">Charges</Text>
              <Text className="text-sm text-slate-800 font-medium">{selectedPuja.charges || 'N/A'}</Text>
            </View>
            <View className="w-1/2 mb-3">
              <Text className="text-xs text-slate-500 font-bold uppercase">Duration</Text>
              <Text className="text-sm text-slate-800 font-medium">{selectedPuja.estimatedTime || 'N/A'}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-xs text-slate-500 font-bold uppercase">Yajman</Text>
              <Text className="text-sm text-slate-800 font-medium">{selectedPuja.noOfYajman || 'N/A'}</Text>
            </View>
            <View className="w-1/2">
              <Text className="text-xs text-slate-500 font-bold uppercase">Samagri</Text>
              <Text className="text-sm text-slate-800 font-medium">{selectedPuja.samagri || 'N/A'}</Text>
            </View>
          </View>

          {/* About Section (HTML) */}
          {selectedPuja.about && (
            <View className="mb-6">
              <Text className="text-xl font-bold text-slate-800 mb-2">About</Text>
              <RenderHtml 
                contentWidth={width - 40} 
                source={{ html: selectedPuja.about }} 
                tagsStyles={htmlStyles}
              />
            </View>
          )}

          {/* Benefits Section (HTML) */}
          {selectedPuja.benefits && (
            <View className="mb-8">
              <Text className="text-xl font-bold text-slate-800 mb-2">Benefits</Text>
              <RenderHtml 
                contentWidth={width - 40} 
                source={{ html: selectedPuja.benefits }} 
                tagsStyles={htmlStyles}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar for Booking */}
      <View className="p-4 bg-white border-t border-slate-200 shadow-lg">
        <TouchableOpacity 
          className="bg-orange-600 rounded-xl py-4 items-center"
          onPress={() => navigation.navigate('BookingForm', { 
            pujaId: selectedPuja.id,
            categoryId: selectedPuja.categoryId,
            subcategoryId: selectedPuja.subcategoryId
          })}
        >
          <Text className="text-white font-bold text-lg">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}