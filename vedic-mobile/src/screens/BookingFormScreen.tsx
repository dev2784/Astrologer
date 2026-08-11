import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LogIn } from 'lucide-react-native';

import { api } from '../utils/api';
import { HomeStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/useAuthStore';



type BookingFormRouteProp = RouteProp<HomeStackParamList, 'BookingForm'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BookingForm'>;

export default function BookingFormScreen() {
  const route = useRoute<BookingFormRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  const { pujaId, categoryId, subcategoryId } = route.params;

  // 1. Pull user authentication state
  const { userToken, userData, setRedirect } = useAuthStore();

  // 2. Form State (Only Address and Date remain)
  const [address, setAddress] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setBookingDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      Alert.alert('Missing Field', 'Address is strictly required to perform the Puja.');
      return;
    }

    if (!userData) {
      Alert.alert('Error', 'User profile corrupted. Please log in again.');
      return;
    }

    setIsSubmitting(true);

    // Silently inject the logged-in user's profile data into the booking payload
    const payload = {
      pujaId: pujaId || null,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      name: userData.name,       // Injected from Auth Store
      phone: userData.phone,     // Injected from Auth Store
      email: userData.email,     // Injected from Auth Store
      address: address.trim(),
      bookingDate: bookingDate.toISOString(),
    };

    try {
      await api.post('/bookings', payload);
      Alert.alert(
        'Success', 
        'Your Puja has been successfully booked!',
        [{ text: 'OK', onPress: () => navigation.navigate('Categories') }]
      );
    } catch (error: any) {
      Alert.alert('Booking Failed', error?.response?.data?.error || error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. HARD GUARD: If user is not logged in, block the form entirely
  if (!userToken || !userData) {
    return (
      <View className="flex-1 bg-stone-50 items-center justify-center px-6">
        <Text className="text-2xl font-black text-slate-900 mb-2 text-center">Login Required</Text>
        <Text className="text-slate-500 text-center mb-8">
          You must be logged into your account to book a Puja.
        </Text>
        
        <TouchableOpacity 
          className="bg-orange-600 w-full py-4 rounded-xl flex-row items-center justify-center shadow-sm"
          onPress={() => {
            // SAVE THE RETURN PATH BEFORE LEAVING
            setRedirect({
              tab: 'Pujas', // The name of the Tab in AppNavigator
              screen: 'BookingForm', // The name of the Screen inside PujaFlowStack
              params: route.params, // Passes pujaId, categoryId, etc.
            });
            // Send them to the login tab
            navigation.navigate('Account' as any);
          }}
        >
          <LogIn size={20} color="#ffffff" />
          <Text className="text-white font-bold text-lg ml-2">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Authorized View: Only Address and Date
  return (
    <ScrollView className="flex-1 bg-stone-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-slate-800 mb-2">Complete Booking</Text>
      
      {/* Show the user who they are booking as, since we removed the inputs */}
      <Text className="text-sm text-slate-500 mb-6">
        Booking as: <Text className="font-bold text-slate-700">{userData.name} ({userData.phone})</Text>
      </Text>

      <View className="bg-white p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
        
        <Text className="text-sm font-bold text-slate-500 mb-1">Full Address *</Text>
        <TextInput 
          className="bg-stone-100 p-3 rounded-lg mb-6 text-slate-800 border border-stone-200 min-h-[100px]"
          placeholder="Enter the exact location/venue for the Puja"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={address}
          onChangeText={setAddress}
        />

        <Text className="text-sm font-bold text-slate-500 mb-1">Select Date *</Text>
        <TouchableOpacity 
          className="bg-stone-100 p-4 rounded-lg mb-2 border border-stone-200 items-center"
          onPress={() => setShowPicker(true)}
        >
          <Text className="text-slate-800 font-medium text-base">
            {bookingDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}
      </View>

      <TouchableOpacity 
        className={`rounded-xl py-4 items-center mb-10 shadow-sm ${isSubmitting ? 'bg-slate-400' : 'bg-orange-600'}`}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-lg">Confirm Booking</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}