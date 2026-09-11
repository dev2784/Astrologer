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
import ProfileScreen from '../screens/ProfileScreen';
import ContactScreen from '../screens/ContactScreen';
import WriteReviewScreen from '../screens/WriteReviewScreen';


const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator();

const HomeFlow = createNativeStackNavigator();

function HomeFlowStack() {
  return (
    <HomeFlow.Navigator screenOptions={{ headerShown: true }}>
      <HomeFlow.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ headerShown: false }} // Keep Home headerless
      />
      <HomeFlow.Screen 
        name="WriteReview" 
        component={WriteReviewScreen} 
        options={{ title: 'Write Review', headerBackButtonDisplayMode: 'minimal' }}
      />
    </HomeFlow.Navigator>
  );
}

// 1. Existing Puja Flow
function PujaFlowStack() {
  return (
    <HomeStack.Navigator screenOptions={{ 
    headerShown: true,
    
    // 1. HEADER BACKGROUND COLOR
    headerStyle: {
      backgroundColor: '#ffc864', // Example: Orange background
    },
    
    // 2. HEADER TEXT & BACK BUTTON COLOR
    headerTintColor: '#ffffff', // Example: White text and back arrows
    
    // 3. HEADER TITLE FONT STYLING (Optional, for specific text tweaks)
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 18,
    },

    // 4. SCREEN BACKGROUND COLOR (The actual page content below the header)
    // Note: If you are using @react-navigation/native-stack use 'contentStyle'
    // If you are using @react-navigation/stack use 'cardStyle'
    contentStyle: {
      backgroundColor: '#ffc864', // Example: Stone-50 background
    }
  }}>
      <HomeStack.Screen name="Categories" component={PujasScreen} options={{ title: 'Book a Puja' }} />
      <HomeStack.Screen name="Subcategories" component={SubcategoriesScreen} options={{ title: 'Select Option' }} />
      <HomeStack.Screen name="PujaList" component={PujaListScreen} options={({ route }) => ({ title: route.params?.title || 'Pujas' })} />
      <HomeStack.Screen name="BookingForm" component={BookingFormScreen} options={{ title: 'Book Puja' }} />
      <HomeStack.Screen name="PujaDetails" component={PujaDetailsScreen} options={{ title: 'Details', headerBackButtonDisplayMode: 'minimal' }} />
    
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
  const tabIcon = (
    Icon: any,
    focused: boolean,
    color: string
  ) => (
    <View
      style={{
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? '#7f1d1d' : 'transparent',
      }}
    >
      <Icon
        size={focused ? 18 : 19}
        color={focused ? '#fff7ed' : color}
        strokeWidth={focused ? 2.4 : 1.8}
      />
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: '#7f1d1d',
        tabBarInactiveTintColor: '#78716c',

        tabBarStyle: {
          height: 72,
          paddingTop: 7,
          paddingBottom: 8,

          backgroundColor: '#fffaf2',

          borderTopWidth: 1,
          borderTopColor: '#eadfce',

          shadowColor: '#3f1d12',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.08,
          shadowRadius: 12,

          elevation: 14,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 1,
        },

        tabBarItemStyle: {
          paddingVertical: 1,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeFlowStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color }) =>
            tabIcon(Home, focused, color),
        }}
      />

      <Tab.Screen
        name="Pujas"
        component={PujaFlowStack}
        options={{
          title: 'Pujas',
          tabBarIcon: ({ focused, color }) =>
            tabIcon(Flame, focused, color),
        }}
      />

      <Tab.Screen
        name="Panchang"
        component={PanchangScreen}
        options={{
          title: 'Panchang',
          tabBarIcon: ({ focused, color }) =>
            tabIcon(Calendar, focused, color),
        }}
      />

      <Tab.Screen
        name="Muhurat"
        component={MuhuratScreen}
        options={{
          title: 'Muhurat',
          tabBarIcon: ({ focused, color }) =>
            tabIcon(CalendarClock, focused, color),
        }}
      />

      <Tab.Screen
        name="Account"
        component={ProfileFlowStack}
        options={{
          title: 'Account',
          tabBarIcon: ({ focused, color }) =>
            tabIcon(User, focused, color),
        }}
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