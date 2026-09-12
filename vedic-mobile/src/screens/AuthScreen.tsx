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
import {
  Phone,
  Lock,
  User,
  Mail,
  LogIn,
  ArrowLeft,
  Sparkles,
} from 'lucide-react-native';
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

  if (isRegister && formData.password.length < 8) {
    Alert.alert('Password too short', 'Use at least 8 characters.');
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
    className="flex-1 bg-[#fffaf2]"
  >
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* MAROON HEADER */}
      <View className="bg-[#971f1f] rounded-b-[34px] px-5 pt-14 pb-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          className="w-10 h-10 rounded-full bg-white/15 items-center justify-center"
        >
          <ArrowLeft
            size={21}
            color="#fffaf2"
          />
        </TouchableOpacity>

        <View className="mt-6 flex-row items-center">
          <View className="w-14 h-14 rounded-full bg-[#fff7ed] items-center justify-center">
            <Sparkles
              size={27}
              color="#971f1f"
              strokeWidth={1.8}
            />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-[#fffaf2] text-[27px] font-black">
              {isRegister
                ? 'अपना खाता बनाएं'
                : 'पुनः स्वागत है'}
            </Text>

            <Text className="text-[#f2d7b1] text-[14px] mt-1">
              {isRegister
                ? 'पूजा बुकिंग और सेवाओं के लिए रजिस्टर करें'
                : 'अपने मोबाइल नंबर से सुरक्षित लॉगिन करें'}
            </Text>
          </View>
        </View>
      </View>

      {/* FORM AREA */}
      <View className="px-5 pt-7 pb-10">

        <View
          style={{
            shadowColor: '#7f1d1d',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 2,
          }}
          className="bg-[#fffdf8] border border-[#eadfce] rounded-[26px] px-5 py-6"
        >

          {/* NAME */}
          {isRegister && (
            <View className="mb-4">
              <Text className="text-[#57534e] font-bold text-[12px] mb-2 ml-1">
                पूरा नाम *
              </Text>

              <View className="h-14 bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 flex-row items-center">
                <User
                  size={20}
                  color="#971f1f"
                />

                <TextInput
                  placeholder="जैसे राहुल शर्मा"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      name: text,
                    })
                  }
                  className="flex-1 ml-3 text-[#292524] font-medium"
                  placeholderTextColor="#a8a29e"
                />
              </View>
            </View>
          )}

          {/* PHONE */}
          <View className="mb-4">
            <Text className="text-[#57534e] font-bold text-[12px] mb-2 ml-1">
              मोबाइल नंबर *
            </Text>

            <View className="h-14 bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 flex-row items-center">
              <Phone
                size={20}
                color="#971f1f"
              />

              <TextInput
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    phone: text,
                  })
                }
                className="flex-1 ml-3 text-[#292524] font-medium"
                placeholderTextColor="#a8a29e"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* EMAIL */}
          {isRegister && (
            <View className="mb-4">
              <Text className="text-[#57534e] font-bold text-[12px] mb-2 ml-1">
                ईमेल
              </Text>

              <View className="h-14 bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 flex-row items-center">
                <Mail
                  size={20}
                  color="#971f1f"
                />

                <TextInput
                  placeholder="rahul@example.com"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({
                      ...formData,
                      email: text,
                    })
                  }
                  className="flex-1 ml-3 text-[#292524] font-medium"
                  placeholderTextColor="#a8a29e"
                  autoCapitalize="none"
                />
              </View>
            </View>
          )}

          {/* PASSWORD */}
          <View>
            <Text className="text-[#57534e] font-bold text-[12px] mb-2 ml-1">
              पासवर्ड *
            </Text>

            <View className="h-14 bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 flex-row items-center">
              <Lock
                size={20}
                color="#971f1f"
              />

              <TextInput
                placeholder="••••••••"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    password: text,
                  })
                }
                className="flex-1 ml-3 text-[#292524] font-medium"
                placeholderTextColor="#a8a29e"
              />
            </View>
          </View>

          {/* MAIN BUTTON */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
            className={`h-14 rounded-2xl flex-row items-center justify-center mt-6 ${
              loading
                ? 'bg-[#b96a6a]'
                : 'bg-[#971f1f]'
            }`}
          >
            {loading ? (
              <ActivityIndicator
                color="#fffaf2"
              />
            ) : (
              <>
                <LogIn
                  size={20}
                  color="#fffaf2"
                />

                <Text className="text-[#fffaf2] font-black text-[16px] ml-2">
                  {isRegister
                    ? 'खाता बनाएं'
                    : 'लॉगिन करें'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* GOOGLE */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              Alert.alert(
                'Google Auth',
                'Requires Expo AuthSession or Firebase setup.'
              )
            }
            className="h-14 bg-white border border-[#eadfce] rounded-2xl flex-row items-center justify-center mt-4"
          >
            <Text className="text-[#57534e] font-bold text-[14px]">
              Google से लॉगिन करें
            </Text>
          </TouchableOpacity>
        </View>

        {/* TOGGLE */}
        <View className="flex-row justify-center items-center mt-6 mb-6">
          <Text className="text-stone-500 text-[13px]">
            {isRegister
              ? 'पहले से खाता है? '
              : 'अभी तक खाता नहीं है? '}
          </Text>

          <TouchableOpacity
            onPress={() => {
              Haptics.selectionAsync();
              setIsRegister(!isRegister);
            }}
          >
            <Text className="text-[#971f1f] font-black text-[13px]">
              {isRegister
                ? 'लॉगिन करें'
                : 'रजिस्टर करें'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);
}