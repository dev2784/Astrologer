import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { api } from '../utils/api';
import { HomeStackParamList } from '../navigation/types';

type BookingFormRouteProp = RouteProp<HomeStackParamList, 'BookingForm'>;
type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'BookingForm'>;

export default function BookingFormScreen() {
  const route = useRoute<BookingFormRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  
  const { pujaId, categoryId, subcategoryId } = route.params;

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  
  // Date Picker State
  const [bookingDate, setBookingDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Android requires manually hiding the picker after selection
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setBookingDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    // Brutal validation. Do not hit the server if the user is lazy.
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Missing Fields', 'Name, Phone, and Address are strictly required.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      pujaId: pujaId || null,
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      bookingDate: bookingDate.toISOString(),
    };

    try {
      await api.post('/bookings', payload);
      Alert.alert(
        'Success', 
        'Your Puja has been successfully booked!',
        [{ text: 'OK', onPress: () => navigation.navigate('Categories') }] // Kick them back to home
      );
    } catch (error: any) {
      Alert.alert('Booking Failed', error?.response?.data?.error || error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-50 px-4 pt-4" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-slate-800 mb-6">Complete Booking</Text>

      <View className="bg-white p-5 rounded-xl border border-slate-200 mb-6 shadow-sm">
        
        <Text className="text-sm font-bold text-slate-500 mb-1">Full Name *</Text>
        <TextInput 
          className="bg-stone-100 p-3 rounded-lg mb-4 text-slate-800 border border-stone-200"
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-sm font-bold text-slate-500 mb-1">Phone Number *</Text>
        <TextInput 
          className="bg-stone-100 p-3 rounded-lg mb-4 text-slate-800 border border-stone-200"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text className="text-sm font-bold text-slate-500 mb-1">Email Address</Text>
        <TextInput 
          className="bg-stone-100 p-3 rounded-lg mb-4 text-slate-800 border border-stone-200"
          placeholder="Enter your email (optional)"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text className="text-sm font-bold text-slate-500 mb-1">Full Address *</Text>
        <TextInput 
          className="bg-stone-100 p-3 rounded-lg mb-4 text-slate-800 border border-stone-200"
          placeholder="Enter the location for the Puja"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          value={address}
          onChangeText={setAddress}
        />

        <Text className="text-sm font-bold text-slate-500 mb-1">Select Date *</Text>
        <TouchableOpacity 
          className="bg-stone-100 p-4 rounded-lg mb-4 border border-stone-200 items-center"
          onPress={() => setShowPicker(true)}
        >
          <Text className="text-slate-800 font-medium">
            {bookingDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={bookingDate}
            mode="date"
            display="default"
            minimumDate={new Date()} // Prevent booking in the past
            onChange={handleDateChange}
          />
        )}
      </View>

      <TouchableOpacity 
        className={`rounded-xl py-4 items-center mb-10 ${isSubmitting ? 'bg-slate-400' : 'bg-orange-600'}`}
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