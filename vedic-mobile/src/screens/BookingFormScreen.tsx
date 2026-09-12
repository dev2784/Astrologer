import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  LogIn,
  LockKeyhole,
  Sparkles,
  ChevronLeft,
} from 'lucide-react-native';

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
    <View className="flex-1 bg-[#fffaf2]">

      {/* TOP MAROON HEADER */}
      <View className="bg-[#971f1f] rounded-b-[34px] px-5 pt-14 pb-8">

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white/15 items-center justify-center mb-5"
        >
          <ChevronLeft
            size={23}
            color="#fffaf2"
          />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-[#fff7ed] items-center justify-center">
            <LockKeyhole
              size={27}
              color="#971f1f"
              strokeWidth={1.9}
            />
          </View>

          <View className="flex-1 ml-4">
            <Text className="text-[#fffaf2] text-[26px] font-black">
              लॉगिन आवश्यक है
            </Text>

            <Text className="text-[#f2d7b1] text-[14px] mt-1">
              पूजा बुकिंग के लिए अपने खाते में लॉगिन करें
            </Text>
          </View>
        </View>
      </View>


      {/* BODY */}
      <View className="flex-1 px-5 pt-8">

        <View
          style={{
            shadowColor: '#7f1d1d',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.07,
            shadowRadius: 12,
            elevation: 3,
          }}
          className="bg-[#fffdf8] border border-[#eadfce] rounded-[26px] px-5 py-6"
        >

          {/* ICON */}
          <View className="w-16 h-16 rounded-full bg-[#fff0df] items-center justify-center self-center">
            <Sparkles
              size={29}
              color="#971f1f"
              strokeWidth={1.8}
            />
          </View>

          <Text className="text-[#292524] text-[22px] font-black text-center mt-5">
            अपनी पूजा बुक करें
          </Text>

          <Text className="text-stone-500 text-[14px] leading-[22px] text-center mt-2">
            बुकिंग जारी रखने के लिए कृपया अपने खाते में लॉगिन करें।
            लॉगिन के बाद आप इसी पूजा पर वापस आ जाएंगे।
          </Text>


          {/* SMALL INFO */}
          <View className="bg-[#fff4e5] rounded-[18px] px-4 py-4 mt-6">

            <Text className="text-[#7f1d1d] font-bold text-[13px]">
              लॉगिन क्यों आवश्यक है?
            </Text>

            <Text className="text-stone-600 text-[12px] leading-[19px] mt-2">
              आपकी बुकिंग, संपर्क विवरण और पूजा की जानकारी सुरक्षित रखने के लिए।
            </Text>
          </View>


          {/* LOGIN BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setRedirect({
                tab: 'Pujas',
                screen: 'BookingForm',
                params: route.params,
              });

              navigation.navigate('Account' as any);
            }}
            className="bg-[#971f1f] rounded-[18px] py-4 mt-6 flex-row items-center justify-center"
          >
            <LogIn
              size={20}
              color="#fffaf2"
              strokeWidth={2}
            />

            <Text className="text-[#fffaf2] font-black text-[16px] ml-2">
              लॉगिन करें
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  );
}

  // 4. Authorized View: Only Address and Date
  return (
    <ScrollView className="flex-1 bg-amber-500 px-4 pt-4" showsVerticalScrollIndicator={false}>
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