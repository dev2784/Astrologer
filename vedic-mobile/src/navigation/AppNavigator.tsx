import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Calendar, Phone, CalendarClock, Flame } from 'lucide-react-native';

import { HomeStackParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import PanchangScreen from '../screens/PanchangScreen';
import SubcategoriesScreen from '../screens/SubcategoriesScreen';
import PujaListScreen from '../screens/PujaListScreen';
import PujaDetailsScreen from '../screens/PujaDetailsScreen';
import BookingFormScreen from  '../screens/BookingFormScreen';
import MuhuratScreen from '../screens/MuhuratScreen';
import ContactScreen from '../screens/ContactScreen';
import PujasScreen from '../screens/PujasScreen';

// We will create these screens in the next step. 
// For now, we will mock them inline to prevent compiler crashes.
import { View, Text } from 'react-native';
const DummyScreen = () => <View><Text>Placeholder</Text></View>;

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

// This stack handles the entire 5-step Puja flow
function PujaFlowStack() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: true }}>
      <HomeStack.Screen name="Categories" component={PujasScreen} options={{ title: 'Book a Puja' }} />
      <HomeStack.Screen 
		  name="Subcategories" 
		  component={SubcategoriesScreen} 
		  options={{ title: 'Select Option' }} 
		/>

      <HomeStack.Screen 
		  name="PujaList" 
		  component={PujaListScreen} 
		  // Dynamically set the header title based on the passed params
		  options={({ route }) => ({ title: route.params.title })}
		/>
      <HomeStack.Screen 
        name="BookingForm" 
        component={BookingFormScreen} 
        options={{ title: 'Book Puja' }} 
      />
      <HomeStack.Screen 
        name="PujaDetails" 
        component={PujaDetailsScreen} 
        options={{ title: 'Details', headerBackTitleVisible: false }} 
      />
      
    </HomeStack.Navigator>
  );
}

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
        component={HomeScreen} // We inject the entire stack here
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
    <Tab.Screen 
        name="Pujas" 
        component={PujaFlowStack} 
        options={{ 
          title: 'Pujas',
          tabBarIcon: ({ color, size }) => (
            <Flame color={color} size={size} />
          )
        }} 
      />
      <Tab.Screen 
        name="Panchang" 
        component={PanchangScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Muhurat" 
        component={MuhuratScreen} 
        options={{ title: 'Muhurat',
        tabBarIcon: ({ color, size }) => (
            <CalendarClock color={color} size={size} />
          ) }} 
      />
      <Tab.Screen 
        name="Contact" 
        component={ContactScreen} 
        options={{ 
          title: 'Contact',
          tabBarIcon: ({ color, size }) => (
            <Phone color={color} size={size} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
      <TabNavigator />
  );
}