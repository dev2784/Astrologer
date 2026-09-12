import { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';

import {
  useRoute,
  useNavigation,
  RouteProp,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import DateTimePicker from '@react-native-community/datetimepicker';

import {
  LogIn,
  LockKeyhole,
  Sparkles,
  ChevronLeft,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react-native';

import { api } from '../utils/api';
import { HomeStackParamList } from '../navigation/types';
import { useAuthStore } from '../store/useAuthStore';

type BookingFormRouteProp =
  RouteProp<HomeStackParamList, 'BookingForm'>;

type NavigationProp =
  NativeStackNavigationProp<
    HomeStackParamList,
    'BookingForm'
  >;

export default function BookingFormScreen() {
  const route = useRoute<BookingFormRouteProp>();
  const navigation =
    useNavigation<NavigationProp>();

  const {
    pujaId,
    categoryId,
    subcategoryId,
  } = route.params;

  const {
    userToken,
    userData,
    setRedirect,
  } = useAuthStore();

  const [address, setAddress] =
    useState('');

  const [bookingDate, setBookingDate] =
    useState(new Date());

  const [showPicker, setShowPicker] =
    useState(false);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (selectedDate) {
      setBookingDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!address.trim()) {
      Alert.alert(
        'पता आवश्यक है',
        'कृपया पूजा का पूरा पता दर्ज करें।'
      );
      return;
    }

    if (!userData) {
      Alert.alert(
        'त्रुटि',
        'यूज़र प्रोफाइल उपलब्ध नहीं है। कृपया दोबारा लॉगिन करें।'
      );
      return;
    }

    setIsSubmitting(true);

    const payload = {
      pujaId: pujaId || null,
      categoryId: categoryId || null,
      subcategoryId:
        subcategoryId || null,

      name: userData.name,
      phone: userData.phone,
      email: userData.email,

      address: address.trim(),
      bookingDate:
        bookingDate.toISOString(),
    };

    try {
      await api.post(
        '/bookings',
        payload
      );

      setShowSuccess(true);
    } catch (error: any) {
      Alert.alert(
        'बुकिंग असफल रही',
        error?.response?.data?.error ||
          error.message ||
          'कुछ गलत हो गया। कृपया दोबारा प्रयास करें।'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!userToken || !userData) {
    return (
      <View className="flex-1 bg-[#fffaf2]">

        {/* HEADER */}
        <View className="bg-[#971f1f] rounded-b-[34px] px-5 pt-14 pb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
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
              shadowColor:
                '#7f1d1d',
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

            <View className="bg-[#fff4e5] rounded-[18px] px-4 py-4 mt-6">
              <Text className="text-[#7f1d1d] font-bold text-[13px]">
                लॉगिन क्यों आवश्यक है?
              </Text>

              <Text className="text-stone-600 text-[12px] leading-[19px] mt-2">
                आपकी बुकिंग, संपर्क विवरण और पूजा की जानकारी सुरक्षित रखने के लिए।
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setRedirect({
                  tab: 'Pujas',
                  screen:
                    'BookingForm',
                  params:
                    route.params,
                });

                navigation.navigate(
                  'Account' as any
                );
              }}
              className="bg-[#971f1f] rounded-[18px] py-4 mt-6 flex-row items-center justify-center"
            >
              <LogIn
                size={20}
                color="#fffaf2"
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

  // =========================
  // LOGGED IN BOOKING FORM
  // =========================

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      <ScrollView
        className="flex-1 bg-[#fffaf2]"
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 120,
        }}
      >
        {/* HEADER */}

        <View className="bg-[#971f1f] rounded-b-[34px] px-5 pt-14 pb-8">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.goBack()
            }
            className="w-10 h-10 rounded-full bg-white/15 items-center justify-center mb-5"
          >
            <ArrowLeft
              size={21}
              color="#fffaf2"
            />
          </TouchableOpacity>

          <Text className="text-[#fffaf2] text-[28px] font-black">
            पूजा बुकिंग
          </Text>

          <Text className="text-[#f2d7b1] text-[14px] mt-1">
            पूजा की तिथि और स्थान की जानकारी भरें
          </Text>

          <View className="mt-5 bg-white/10 rounded-[18px] px-4 py-3">
            <Text className="text-[#f2d7b1] text-[11px] font-bold">
              बुकिंग किसके नाम से
            </Text>

            <Text className="text-[#fffaf2] text-[15px] font-black mt-1">
              {userData.name}
            </Text>

            <Text className="text-[#f2d7b1] text-[12px] mt-1">
              {userData.phone}
            </Text>
          </View>
        </View>

        {/* FORM */}

        <View className="px-5 pt-7">
          <View
            style={{
              shadowColor:
                '#7f1d1d',
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
            {/* ADDRESS */}

            <Text className="text-[#292524] text-[17px] font-black">
              पूजा का स्थान
            </Text>

            <Text className="text-stone-500 text-[12px] mt-1 mb-3">
              जहां पूजा करानी है उसका पूरा पता दर्ज करें
            </Text>

            <TextInput
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 text-[#292524] min-h-[120px]"
              placeholder="पूरा पता दर्ज करें"
              placeholderTextColor="#a8a29e"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={address}
              onChangeText={
                setAddress
              }
            />

            {/* DATE */}

            <Text className="text-[#292524] text-[17px] font-black mt-6">
              पूजा की तिथि
            </Text>

            <Text className="text-stone-500 text-[12px] mt-1 mb-3">
              अपनी सुविधानुसार दिन चुनें
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() =>
                setShowPicker(true)
              }
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4"
            >
              <Text className="text-[#971f1f] text-center font-black text-[15px]">
                {bookingDate.toLocaleDateString(
                  'hi-IN',
                  {
                    weekday:
                      'short',
                    year:
                      'numeric',
                    month:
                      'long',
                    day:
                      'numeric',
                  }
                )}
              </Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={
                  bookingDate
                }
                mode="date"
                display="default"
                minimumDate={
                  new Date()
                }
                onChange={
                  handleDateChange
                }
              />
            )}
          </View>

          {/* NOTE */}

          <View className="bg-[#fff1df] rounded-[18px] px-4 py-4 mt-5">
            <Text className="text-[#971f1f] font-black text-[13px]">
              ध्यान दें
            </Text>

            <Text className="text-stone-600 text-[12px] leading-[19px] mt-1">
              बुकिंग के बाद हमारी टीम आपसे संपर्क करके तिथि और पूजा की अंतिम पुष्टि करेगी।
            </Text>
          </View>

          {/* SUBMIT */}

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={
              handleSubmit
            }
            disabled={
              isSubmitting
            }
            className={`rounded-[20px] py-4 items-center mt-6 ${
              isSubmitting
                ? 'bg-[#b96a6a]'
                : 'bg-[#971f1f]'
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator
                color="#fffaf2"
              />
            ) : (
              <Text className="text-[#fffaf2] font-black text-[17px]">
                बुकिंग की पुष्टि करें
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* =========================
          SUCCESS MODAL
      ========================= */}

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowSuccess(false)
        }
      >
        <View
          style={{
            flex: 1,

            backgroundColor:
              'rgba(28,25,23,0.48)',

            alignItems:
              'center',

            justifyContent:
              'center',

            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              width: '100%',

              backgroundColor:
                '#fffaf2',

              borderRadius: 28,

              padding: 24,

              borderWidth: 1,

              borderColor:
                '#eadfce',

              shadowColor:
                '#7f1d1d',

              shadowOffset: {
                width: 0,
                height: 8,
              },

              shadowOpacity: 0.18,

              shadowRadius: 18,

              elevation: 8,
            }}
          >
            {/* SUCCESS ICON */}

            <View
              style={{
                width: 72,
                height: 72,

                borderRadius: 36,

                backgroundColor:
                  '#971f1f',

                alignSelf:
                  'center',

                alignItems:
                  'center',

                justifyContent:
                  'center',
              }}
            >
              <CheckCircle2
                size={36}
                color="#fffaf2"
                strokeWidth={2}
              />
            </View>

            {/* TITLE */}

            <Text
              style={{
                color:
                  '#292524',

                fontSize: 23,

                fontWeight:
                  '900',

                textAlign:
                  'center',

                marginTop: 18,
              }}
            >
              बुकिंग सफल हुई
            </Text>

            {/* MESSAGE */}

            <Text
              style={{
                color:
                  '#78716c',

                fontSize: 14,

                lineHeight: 22,

                textAlign:
                  'center',

                marginTop: 8,
              }}
            >
              आपकी पूजा बुकिंग सफलतापूर्वक दर्ज हो गई है।
              {'\n'}
              हमारी टीम जल्द ही आपसे संपर्क करेगी।
            </Text>

            {/* DATE INFO */}

            <View
              style={{
                backgroundColor:
                  '#fff1df',

                borderRadius: 18,

                paddingHorizontal: 16,
                paddingVertical: 14,

                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color:
                    '#971f1f',

                  fontWeight:
                    '900',

                  textAlign:
                    'center',

                  fontSize: 13,
                }}
              >
                🙏 धन्यवाद
              </Text>

              <Text
                style={{
                  color:
                    '#57534e',

                  fontSize: 12,

                  lineHeight: 18,

                  textAlign:
                    'center',

                  marginTop: 5,
                }}
              >
                चुनी गई पूजा तिथि
              </Text>

              <Text
                style={{
                  color:
                    '#292524',

                  fontSize: 14,

                  fontWeight:
                    '900',

                  textAlign:
                    'center',

                  marginTop: 3,
                }}
              >
                {bookingDate.toLocaleDateString(
                  'hi-IN',
                  {
                    weekday:
                      'long',
                    year:
                      'numeric',
                    month:
                      'long',
                    day:
                      'numeric',
                  }
                )}
              </Text>

              <Text
                style={{
                  color:
                    '#78716c',

                  fontSize: 11,

                  lineHeight: 17,

                  textAlign:
                    'center',

                  marginTop: 8,
                }}
              >
                अंतिम तिथि और पूजा के अन्य विवरण फोन पर कन्फर्म किए जाएंगे।
              </Text>
            </View>

            {/* BUTTON */}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccess(
                  false
                );

                setAddress('');

                navigation.navigate(
                  'Categories'
                );
              }}
              style={{
                marginTop: 22,

                backgroundColor:
                  '#971f1f',

                borderRadius: 18,

                paddingVertical: 15,

                flexDirection:
                  'row',

                alignItems:
                  'center',

                justifyContent:
                  'center',
              }}
            >
              <Text
                style={{
                  color:
                    '#fffaf2',

                  fontSize: 16,

                  fontWeight:
                    '900',
                }}
              >
                पूजा सेवाएं देखें
              </Text>

              <ChevronRight
                size={20}
                color="#fffaf2"
                style={{
                  marginLeft: 6,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}