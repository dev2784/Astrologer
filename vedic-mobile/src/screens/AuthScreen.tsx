import React, { useState } from 'react';
import { api } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Phone, Lock, User, Mail, LogIn, ArrowLeft } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

export default function AuthScreen({ navigation }: any) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, redirectData, clearRedirect } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });


  const handleSubmit = async () => {
  // 1. Brutal local validation
  if (!formData.phone || !formData.password) {
    Alert.alert('Missing Fields', 'Phone and password are required.');
    return;
  }
  if (isRegister && !formData.name) {
    Alert.alert('Missing Fields', 'Name is required for registration.');
    return;
  }

  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  setLoading(true);

  // Assuming your api baseURL handles the domain, we just hit the auth routes
  const endpoint = isRegister ? '/auth/register' : '/auth/login';

  try {
    // 2. Hit the backend using your configured Axios instance
    const response = await api.post(endpoint, formData);
    
    // Axios puts the JSON response inside the 'data' object
    const { token, user } = response.data;

    // 3. Handle success
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Update global state (This instantly swaps the screen to Profile automatically)
    await login(token, user);
    
   if (redirectData) {
      // Fire the cross-stack navigation
      navigation.navigate(redirectData.tab, {
        screen: redirectData.screen,
        params: redirectData.params,
      });
      // Clear it from memory so it doesn't cause bugs later
      clearRedirect();
    } else {
      Alert.alert(
        'Success', 
        isRegister ? 'Account successfully created!' : 'You are now logged in.'
      );
    }

  } catch (error: any) {
    // 4. Handle errors using your exact pattern
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      'Authentication Failed', 
      error?.response?.data?.error || error.message || 'Something went wrong.'
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-stone-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* Header / Back Button */}
        <View className="px-5 pt-14 pb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100"
          >
            <ArrowLeft size={20} color="#334155" />
          </TouchableOpacity>
        </View>

        <View className="px-6 pt-4 flex-1">
          {/* Title Section */}
          <View className="mb-8">
            <Text className="text-3xl font-black text-slate-900 tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text className="text-slate-500 font-medium mt-2">
              {isRegister 
                ? 'Register to book Pujas and manage your details.' 
                : 'Log in securely with your phone number.'}
            </Text>
          </View>

          {/* Form Fields */}
          <View className="space-y-4 mb-8">
            
            {isRegister && (
              <View>
                <Text className="text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Full Name *</Text>
                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14 shadow-sm">
                  <User size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    className="flex-1 ml-3 text-slate-900 font-medium"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>
            )}

            <View>
              <Text className="text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Phone Number *</Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14 shadow-sm">
                <Phone size={20} color="#94a3b8" />
                <TextInput
                  placeholder="+91 9876543210"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  className="flex-1 ml-3 text-slate-900 font-medium"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {isRegister && (
              <View>
                <Text className="text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Email (Optional)</Text>
                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14 shadow-sm">
                  <Mail size={20} color="#94a3b8" />
                  <TextInput
                    placeholder="rahul@example.com"
                    keyboardType="email-address"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    className="flex-1 ml-3 text-slate-900 font-medium"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}

            <View>
              <Text className="text-xs font-bold text-slate-700 uppercase mb-1.5 ml-1">Password *</Text>
              <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14 shadow-sm">
                <Lock size={20} color="#94a3b8" />
                <TextInput
                  placeholder="••••••••"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  className="flex-1 ml-3 text-slate-900 font-medium"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`h-14 rounded-2xl flex-row items-center justify-center shadow-sm ${loading ? 'bg-orange-400' : 'bg-orange-600'}`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <LogIn size={20} color="#fff" />
                <Text className="text-white font-bold text-base ml-2">
                  {isRegister ? 'Create Account' : 'Log In'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Google Login Placeholder */}
          <TouchableOpacity
            onPress={() => Alert.alert('Google Auth', 'Requires Expo AuthSession or Firebase setup.')}
            className="h-14 bg-white border border-slate-200 rounded-2xl flex-row items-center justify-center shadow-sm mt-4"
          >
            <Text className="text-slate-700 font-bold text-base">Sign in with Google</Text>
          </TouchableOpacity>

          {/* Toggle Register / Login */}
          <View className="flex-row justify-center mt-8 mb-10">
            <Text className="text-slate-500 font-medium">
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => {
              Haptics.selectionAsync();
              setIsRegister(!isRegister);
            }}>
              <Text className="text-orange-600 font-bold">
                {isRegister ? 'Log In' : 'Register Now'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}