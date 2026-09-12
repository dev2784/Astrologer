import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';

import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Send,
  ChevronLeft,
  Headphones,
  Sparkles,
} from 'lucide-react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../utils/api';

export default function ContactScreen({
  navigation,
}: any) {
  const insets = useSafeAreaInsets();

  const [language] =
    useState<'en' | 'hi'>('hi');

  const [formData, setFormData] =
    useState({
      name: '',
      phone: '',
      email: '',
      message: '',
    });

  const [submitStatus, setSubmitStatus] =
    useState<
      'idle' | 'loading' | 'success' | 'error'
    >('idle');

  const WHATSAPP_NUMBER = '919340553012';
  const EMAIL_ADDRESS =
    'panditji@example.com';

  const MAP_QUERY =
    'Mangalnath+Mandir,+Ujjain,+Madhya+Pradesh';

  const openMap = () => {
    const url = Platform.select({
      ios: `maps:0,0?q=${MAP_QUERY}`,
      android: `geo:0,0?q=${MAP_QUERY}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const handleLink = async (
    type: 'phone' | 'email' | 'whatsapp'
  ) => {
    let url = '';

    if (type === 'phone') {
      url = `tel:+${WHATSAPP_NUMBER}`;
    }

    if (type === 'email') {
      url = `mailto:${EMAIL_ADDRESS}`;
    }

    if (type === 'whatsapp') {
      url =
        `whatsapp://send?phone=${WHATSAPP_NUMBER}` +
        `&text=Hari%20Om!%20I%20have%20an%20inquiry.`;
    }

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        'त्रुटि',
        'यह विकल्प इस डिवाइस पर उपलब्ध नहीं है।'
      );
    }
  };

  const handleContactSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      Alert.alert(
        'जानकारी अधूरी है',
        'कृपया सभी अनिवार्य फ़ील्ड भरें।'
      );

      return;
    }

    setSubmitStatus('loading');

    try {
      await api.post(
        '/contact',
        formData
      );

      setSubmitStatus('success');

      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      setSubmitStatus('error');

      Alert.alert(
        'संदेश नहीं भेजा गया',
        error?.response?.data?.error ||
          'कृपया दोबारा प्रयास करें।'
      );

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            backgroundColor: '#971f1f',

            paddingTop:
              insets.top + 14,

            paddingHorizontal: 20,

            paddingBottom: 28,

            borderBottomLeftRadius: 34,
            borderBottomRightRadius: 34,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
            className="w-10 h-10 rounded-full bg-white/15 items-center justify-center"
          >
            <ChevronLeft
              size={23}
              color="#fffaf2"
            />
          </TouchableOpacity>

          <View className="flex-row items-center mt-5">
            <View className="w-14 h-14 rounded-full bg-[#fff7ed] items-center justify-center">
              <Headphones
                size={27}
                color="#971f1f"
              />
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-[#fffaf2] text-[28px] font-black">
                सहायता और संपर्क
              </Text>

              <Text className="text-[#f2d7b1] text-[13px] mt-1">
                हम आपकी सहायता के लिए यहां हैं
              </Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}

        <View className="px-5 pt-7">

          {/* QUICK CONTACT */}

          <Text className="text-[#292524] text-[20px] font-black mb-3">
            तुरंत संपर्क करें
          </Text>

          <View className="flex-row justify-between mb-4">

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                handleLink('phone')
              }
              className="w-[48.5%] bg-[#fffdf8] border border-[#eadfce] rounded-[22px] p-4"
            >
              <View className="w-11 h-11 rounded-full bg-[#fff0df] items-center justify-center">
                <Phone
                  size={21}
                  color="#971f1f"
                />
              </View>

              <Text className="text-[#292524] font-black text-[14px] mt-3">
                कॉल करें
              </Text>

              <Text className="text-stone-500 text-[11px] mt-1">
                सीधे बात करें
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                handleLink('whatsapp')
              }
              className="w-[48.5%] bg-[#fffdf8] border border-[#eadfce] rounded-[22px] p-4"
            >
              <View className="w-11 h-11 rounded-full bg-[#ecfdf5] items-center justify-center">
                <MessageCircle
                  size={21}
                  color="#16a34a"
                />
              </View>

              <Text className="text-[#292524] font-black text-[14px] mt-3">
                WhatsApp
              </Text>

              <Text className="text-stone-500 text-[11px] mt-1">
                चैट शुरू करें
              </Text>
            </TouchableOpacity>
          </View>

          {/* ADDRESS */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={openMap}
            className="bg-[#fffdf8] border border-[#eadfce] rounded-[22px] px-4 py-4 flex-row items-center mb-4"
          >
            <View className="w-12 h-12 rounded-full bg-[#fff0df] items-center justify-center">
              <MapPin
                size={22}
                color="#971f1f"
              />
            </View>

            <View className="flex-1 ml-3">
              <Text className="text-[#292524] text-[14px] font-black">
                हमारा पता
              </Text>

              <Text className="text-stone-500 text-[12px] leading-[18px] mt-1">
                Mangalnath Mandir Road,
                Ujjain, Madhya Pradesh
              </Text>

              <Text className="text-[#971f1f] text-[11px] font-bold mt-1">
                Maps में खोलें
              </Text>
            </View>
          </TouchableOpacity>

          {/* EMAIL */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              handleLink('email')
            }
            className="bg-[#fffdf8] border border-[#eadfce] rounded-[22px] px-4 py-4 flex-row items-center mb-7"
          >
            <View className="w-12 h-12 rounded-full bg-[#fff0df] items-center justify-center">
              <Mail
                size={22}
                color="#971f1f"
              />
            </View>

            <View className="flex-1 ml-3">
              <Text className="text-[#292524] text-[14px] font-black">
                ईमेल
              </Text>

              <Text
                numberOfLines={1}
                className="text-stone-500 text-[12px] mt-1"
              >
                {EMAIL_ADDRESS}
              </Text>
            </View>
          </TouchableOpacity>

          {/* FORM TITLE */}

          <View className="flex-row items-center mb-3">
            <Sparkles
              size={19}
              color="#971f1f"
            />

            <Text className="text-[#292524] text-[20px] font-black ml-2">
              हमें संदेश भेजें
            </Text>
          </View>

          <Text className="text-stone-500 text-[12px] leading-[19px] mb-4">
            पूजा बुकिंग, मुहूर्त या किसी भी अन्य जानकारी के लिए अपना संदेश भेजें।
          </Text>

          {/* FORM */}

          <View
            style={{
              shadowColor:
                '#7f1d1d',

              shadowOffset: {
                width: 0,
                height: 4,
              },

              shadowOpacity:
                0.05,

              shadowRadius: 10,

              elevation: 2,
            }}
            className="bg-[#fffdf8] border border-[#eadfce] rounded-[26px] px-5 py-6"
          >

            {/* NAME */}

            <Text className="text-[#57534e] text-[12px] font-bold mb-2">
              आपका नाम *
            </Text>

            <TextInput
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 text-[#292524] mb-4"
              placeholder="नाम दर्ज करें"
              placeholderTextColor="#a8a29e"
              value={formData.name}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  name: text,
                })
              }
            />

            {/* PHONE */}

            <Text className="text-[#57534e] text-[12px] font-bold mb-2">
              फ़ोन नंबर *
            </Text>

            <TextInput
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 text-[#292524] mb-4"
              placeholder="+91 00000 00000"
              placeholderTextColor="#a8a29e"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  phone: text,
                })
              }
            />

            {/* EMAIL */}

            <Text className="text-[#57534e] text-[12px] font-bold mb-2">
              ईमेल
            </Text>

            <TextInput
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 text-[#292524] mb-4"
              placeholder="example@mail.com"
              placeholderTextColor="#a8a29e"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  email: text,
                })
              }
            />

            {/* MESSAGE */}

            <Text className="text-[#57534e] text-[12px] font-bold mb-2">
              आपका संदेश *
            </Text>

            <TextInput
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 text-[#292524] min-h-[120px]"
              placeholder="अपना प्रश्न या आवश्यकता यहां लिखें..."
              placeholderTextColor="#a8a29e"
              multiline
              textAlignVertical="top"
              value={formData.message}
              onChangeText={(text) =>
                setFormData({
                  ...formData,
                  message: text,
                })
              }
            />

            {/* SUBMIT */}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={
                handleContactSubmit
              }
              disabled={
                submitStatus ===
                'loading'
              }
              className={`rounded-[18px] py-4 mt-6 flex-row items-center justify-center ${
                submitStatus ===
                'loading'
                  ? 'bg-[#b96a6a]'
                  : submitStatus ===
                      'success'
                    ? 'bg-[#15803d]'
                    : submitStatus ===
                        'error'
                      ? 'bg-[#b91c1c]'
                      : 'bg-[#971f1f]'
              }`}
            >
              {submitStatus ===
              'loading' ? (
                <ActivityIndicator
                  color="#fffaf2"
                />
              ) : submitStatus ===
                'success' ? (
                <Text className="text-white font-black text-[15px]">
                  संदेश भेज दिया गया ✓
                </Text>
              ) : submitStatus ===
                'error' ? (
                <Text className="text-white font-black text-[15px]">
                  फिर से प्रयास करें
                </Text>
              ) : (
                <>
                  <Text className="text-[#fffaf2] font-black text-[15px] mr-2">
                    संदेश भेजें
                  </Text>

                  <Send
                    size={19}
                    color="#fffaf2"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}