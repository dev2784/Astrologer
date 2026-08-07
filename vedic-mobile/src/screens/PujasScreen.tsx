import { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { usePujaStore } from '../store/usePujaStore';
import { HomeStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Categories'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { categories, isLoading, error, fetchCategories } = usePujaStore();

  // Fetch data the moment the screen loads
  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50">
        <ActivityIndicator size="large" color="#ea580c" />
        <Text className="mt-4 text-slate-500">Loading Categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-50 p-6">
        <Text className="text-red-500 text-center font-bold">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-orange-600 px-6 py-3 rounded-lg"
          onPress={fetchCategories}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-stone-50 px-4 pt-4">
      <Text className="text-2xl font-bold text-slate-800 mb-4">What are you looking for?</Text>
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white p-5 rounded-xl mb-3 shadow-sm border border-slate-200"
            onPress={() => navigation.navigate('Subcategories', { category: item })}
          >
            <Text className="text-lg font-bold text-slate-800">
              {item.nameEn?.trim()}
            </Text>
            <Text className="text-md text-orange-600 mt-1 font-medium">
              {item.nameHi?.trim()}
            </Text>
            
            {item.subcategories && item.subcategories.length > 0 && (
              <View className="mt-3 bg-stone-100 self-start px-3 py-1 rounded-full">
                <Text className="text-slate-500 text-xs font-semibold">
                  {item.subcategories.length} Options
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="text-center text-slate-500 mt-10">No categories found.</Text>
        }
      />
    </View>
  );
}