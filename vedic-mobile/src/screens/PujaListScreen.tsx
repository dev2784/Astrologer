import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePujaStore } from '../store/usePujaStore';
import { HomeStackParamList } from '../navigation/types';

type PujaListRouteProp = RouteProp<HomeStackParamList, 'PujaList'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PujaList'>;

export default function PujaListScreen() {
  const route = useRoute<PujaListRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  const { subcategoryId, title } = route.params;
  const { pujas, isLoading, error, fetchPujas } = usePujaStore();

  useEffect(() => {
    // Fetch the pujas specifically for this subcategory when screen mounts
    fetchPujas(subcategoryId as string);
  }, [subcategoryId]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50">
        <ActivityIndicator size="large" color="#ea580c" />
        <Text className="mt-4 text-slate-500">Loading {title}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50 p-6">
        <Text className="text-red-500 text-center font-bold">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-orange-600 px-6 py-3 rounded-lg"
          onPress={() => fetchPujas(subcategoryId as string)}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-stone-50 px-4 pt-4">
      <Text className="text-xl font-bold text-slate-800 mb-4">{title}</Text>
      
      <FlatList
        data={pujas}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white rounded-xl mb-4 shadow-sm border border-slate-200 overflow-hidden"
            onPress={() => navigation.navigate('PujaDetails', { pujaId: item.id })}
          >
            {/* The Image Header */}
            {item.imageUrl && (
              // <View className="w-full h-32 bg-stone-200">
              //   <View 
              //     className="w-full h-full"
              //     style={{
              //       backgroundImage: `url(${item.imageUrl})`,
              //       backgroundSize: 'cover',
              //       backgroundPosition: 'center',
              //     }}
              //     // Fallback for NativeWind if background-image fails in React Native Image component
              //     // You should ideally use <Image source={{ uri: item.imageUrl }} className="w-full h-full" resizeMode="cover" />
              //   />
              // </View>
              <Image 
                source={{ uri: item.imageUrl }} 
                className="w-full h-32 bg-stone-200"
                resizeMode="cover"
              />
            )}
            
            {/* The Content Body */}
            <View className="p-4">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-slate-800">
                    {item.titleEn?.trim()}
                  </Text>
                  <Text className="text-md text-orange-600 font-medium mt-1">
                    {item.titleHi?.trim()}
                  </Text>
                </View>
                
                {/* Charges Tag */}
                {item.charges && (
                  <View className="bg-green-100 px-3 py-1 rounded-md">
                    <Text className="text-green-800 font-bold text-sm">
                      {item.charges}
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Estimated Time Footer */}
              {item.estimatedTime && (
                <View className="flex-row items-center mt-2 border-t border-slate-100 pt-2">
                  <Text className="text-slate-500 text-sm font-medium">
                    Duration: {item.estimatedTime}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="p-6 items-center">
            <Text className="text-slate-500 text-center">
              No pujas found for this selection.
            </Text>
          </View>
        }
      />
    </View>
  );
}