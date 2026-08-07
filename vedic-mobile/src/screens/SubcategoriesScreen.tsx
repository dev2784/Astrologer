import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../navigation/types';

type SubcategoriesRouteProp = RouteProp<HomeStackParamList, 'Subcategories'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Subcategories'>;

export default function SubcategoriesScreen() {
  const route = useRoute<SubcategoriesRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  // We passed this entire object from the HomeScreen
  const { category } = route.params;

  return (
    <View className="flex-1 bg-stone-50 px-4 pt-4">
      <Text className="text-xl font-bold text-slate-800 mb-1">
        {category.nameEn?.trim()}
      </Text>
      <Text className="text-md text-orange-600 mb-6 font-medium">
        {category.nameHi?.trim()}
      </Text>
      
      <FlatList
        data={category.subcategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="bg-white p-5 rounded-xl mb-3 shadow-sm border border-slate-200"
            onPress={() => navigation.navigate('PujaList', { 
              subcategoryId: item.id,
              title: item.nameHi
            })}
          >
            <Text className="text-lg font-bold text-slate-800">
              {item.nameEn?.trim()}
            </Text>
            <Text className="text-md text-slate-500 mt-1">
              {item.nameHi?.trim()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="p-6 items-center">
            <Text className="text-slate-500 text-center">
              No subcategories available for this selection.
            </Text>
          </View>
        }
      />
    </View>
  );
}