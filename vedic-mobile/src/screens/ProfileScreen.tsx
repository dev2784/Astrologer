import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { User, Phone, Mail, LogOut, ChevronRight, CalendarClock, LifeBuoy } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useAuthStore } from '../store/useAuthStore';

export default function ProfileScreen({ navigation }: any) {
  const { userData, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await logout();
          }
        },
      ]
    );
  };

  // Get first letter of name for the Avatar avatar fallback
  const userInitials = userData?.name ? userData.name.charAt(0).toUpperCase() : 'U';

  return (
    <ScrollView className="flex-1 bg-stone-50" showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View className="px-5 pt-16 pb-6 bg-white border-b border-slate-100 shadow-sm">
        <Text className="text-3xl font-black text-slate-900 tracking-tight">My Account</Text>
      </View>

      <View className="px-4 pt-6 pb-12">
        
        {/* User Identity Card */}
        <View className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-6 flex-row items-center">
          <View className="w-16 h-16 bg-orange-100 rounded-full border border-orange-200 flex items-center justify-center mr-4">
            <Text className="text-2xl font-black text-orange-600">{userInitials}</Text>
          </View>
          
          <View className="flex-1">
            <Text className="text-xl font-bold text-slate-900 mb-1" numberOfLines={1}>
              {userData?.name || 'Vedic User'}
            </Text>
            <View className="flex-row items-center mb-1">
              <Phone size={14} color="#64748b" />
              <Text className="text-slate-500 text-sm ml-1.5">{userData?.phone || 'No phone number'}</Text>
            </View>
            {userData?.email && (
              <View className="flex-row items-center">
                <Mail size={14} color="#64748b" />
                <Text className="text-slate-500 text-sm ml-1.5" numberOfLines={1}>{userData.email}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions Menu */}
        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 ml-2">Account Settings</Text>
        
        <View className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-8">
          
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-slate-100"
            onPress={() => {
              Haptics.selectionAsync();
              // navigation.navigate('MyBookings'); // TODO: Create this screen next
              Alert.alert('Coming Soon', 'Your booking history will appear here.');
            }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center mr-3">
                <CalendarClock size={20} color="#d97706" />
              </View>
              <Text className="text-base font-bold text-slate-800">My Bookings</Text>
            </View>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate('Contact' as any);
            }}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-sky-50 rounded-full items-center justify-center mr-3">
                <LifeBuoy size={20} color="#0284c7" />
              </View>
              <Text className="text-base font-bold text-slate-800">Support & Help</Text>
            </View>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>

        </View>

        {/* Destructive Action */}
        <TouchableOpacity 
          className="flex-row items-center justify-center bg-white p-4 rounded-2xl border border-red-100 shadow-sm"
          onPress={handleLogout}
        >
          <LogOut size={20} color="#ef4444" />
          <Text className="text-red-600 font-bold text-base ml-2">Log Out</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}