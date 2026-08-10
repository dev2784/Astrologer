import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Calendar, CalendarClock, Flame, User } from 'lucide-react-native';

import { HomeStackParamList } from './types';
import { useAuthStore } from '../store/useAuthStore'; 

import HomeScreen from '../screens/HomeScreen';
import PanchangScreen from '../screens/PanchangScreen';
import SubcategoriesScreen from '../screens/SubcategoriesScreen';
import PujaListScreen from '../screens/PujaListScreen';
import PujaDetailsScreen from '../screens/PujaDetailsScreen';
import BookingFormScreen from '../screens/BookingFormScreen';
import MuhuratScreen from '../screens/MuhuratScreen';
import PujasScreen from '../screens/PujasScreen';
import AuthScreen from '../screens/AuthScreen'; 

// --- Mock Profile Screen (Create this file later) ---
const ProfileScreen = () => {
  const { userData, logout } = useAuthStore();
  return (
    <View className="flex-1 items-center justify-center bg-stone-50">
      <Text className="text-xl font-bold mb-4">Welcome, {userData?.name || 'User'}</Text>
      <TouchableOpacity onPress={logout} className="bg-red-600 px-6 py-3 rounded-xl">
        <Text className="text-white font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator();

// 1. Existing Puja Flow
function PujaFlowStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: true }}>
      <HomeStack.Screen name="Categories" component={PujasScreen} options={{ title: 'Book a Puja' }} />
      <HomeStack.Screen name="Subcategories" component={SubcategoriesScreen} options={{ title: 'Select Option' }} />
      <HomeStack.Screen name="PujaList" component={PujaListScreen} options={({ route }) => ({ title: route.params?.title || 'Pujas' })} />
      <HomeStack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Book Puja' }} />
      <HomeStack.Screen name="PujaDetails" component={PujaDetailsScreen} options={{ title: 'Details', headerBackTitleVisible: false }} />
    </HomeStack.Navigator>
  );
}

// 2. NEW Account Flow (Auto-switches based on Auth state)
function ProfileFlowStack() {
  const { userToken } = useAuthStore();

  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <ProfileStack.Screen name="Auth" component={AuthScreen} />
      )}
    </ProfileStack.Navigator>
  );
}

// 3. Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Pujas" 
        component={PujaFlowStack} 
        options={{ title: 'Pujas', tabBarIcon: ({ color, size }) => <Flame color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Panchang" 
        component={PanchangScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Muhurat" 
        component={MuhuratScreen} 
        options={{ title: 'Muhurat', tabBarIcon: ({ color, size }) => <CalendarClock color={color} size={size} /> }} 
      />
      {/* Replaced Contact with Account Tab */}
      <Tab.Screen 
        name="Account" 
        component={ProfileFlowStack} 
        options={{ title: 'Account', tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} 
      />
    </Tab.Navigator>
  );
}

// 4. Main App Entry (Checks Auth before rendering)
export default function AppNavigator() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafaf9' }}>
        <ActivityIndicator size="large" color="#ea580c" />
      </View>
    );
  }

  return <TabNavigator />;
}