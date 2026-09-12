import React, {
  useState,
  useEffect,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';

import {
  LogIn,
  Star,
  ChevronLeft,
  Sparkles,
  MessageSquareText,
  CheckCircle2,
  ChevronDown,
  Check,
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';

import * as Haptics from 'expo-haptics';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { api } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

export default function WriteReviewScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const {
    userToken,
    userData,
    setRedirect,
  } = useAuthStore();

  const [pujas, setPujas] =
    useState<
      {
        id: string;
        titleEn: string;
      }[]
    >([]);

  const [pujaId, setPujaId] =
    useState('');

  const [loadingPujas, setLoadingPujas] =
    useState(true);

  const [loadError, setLoadError] =
    useState(false);
  const [showPujaPicker, setShowPujaPicker] = useState(false);

  const [retry, setRetry] =
    useState(0);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoadingPujas(true);
      setLoadError(false);

      try {
        const all: {
          id: string;
          titleEn: string;
        }[] = [];

        let hasMore = true;

        while (hasMore) {
          const { data } =
            await api.get(
              '/pujas',
              {
                params: {
                  skip: all.length,
                  take: 100,
                },
              }
            );

          if (!active) {
            return;
          }

          all.push(
            ...data.pujas
          );

          hasMore =
            data.hasMore &&
            data.pujas.length > 0;
        }

        if (active) {
          setPujas(all);
        }
      } catch {
        if (active) {
          setLoadError(true);
        }
      } finally {
        if (active) {
          setLoadingPujas(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [retry]);

  const handleSubmit = async () => {
    if (!pujaId) {
      Alert.alert(
        'पूजा चुनें',
        'जिस पूजा का अनुभव साझा करना चाहते हैं, उसे चुनें।'
      );

      return;
    }

    if (!userData?.phone) {
      Alert.alert(
        'फ़ोन नंबर आवश्यक है',
        'कृपया ऐसे खाते से लॉगिन करें जिसमें मोबाइल नंबर उपलब्ध हो।'
      );

      return;
    }

    if (!comment.trim()) {
      Alert.alert(
        'अनुभव लिखें',
        'कृपया अपने अनुभव के बारे में कुछ लिखें।'
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(
        '/reviews',
        {
          pujaId,
          userPhone:
            userData.phone,
          rating,
          comment:
            comment.trim(),
          userName:
            userData?.name,
        }
      );

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      Alert.alert(
        'धन्यवाद 🙏',
        'आपकी समीक्षा सफलतापूर्वक भेज दी गई है और अनुमोदन के बाद दिखाई जाएगी।',
        [
          {
            text: 'ठीक है',
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'समीक्षा नहीं भेजी गई',
        error?.response?.data
          ?.error ||
          'कुछ गलत हो गया। कृपया दोबारा प्रयास करें।'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================
  // LOGIN REQUIRED
  // =========================

  if (!userToken || !userData) {
    return (
      <View className="flex-1 bg-[#fffaf2]">

        <View
          style={{
            backgroundColor:
              '#971f1f',

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
              <Star
                size={27}
                color="#971f1f"
              />
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-[#fffaf2] text-[27px] font-black">
                अपना अनुभव साझा करें
              </Text>

              <Text className="text-[#f2d7b1] text-[13px] mt-1">
                समीक्षा लिखने के लिए लॉगिन आवश्यक है
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 px-5 pt-8">
          <View className="bg-[#fffdf8] border border-[#eadfce] rounded-[26px] px-5 py-7">
            <View className="w-16 h-16 rounded-full bg-[#fff0df] items-center justify-center self-center">
              <MessageSquareText
                size={28}
                color="#971f1f"
              />
            </View>

            <Text className="text-[#292524] text-[21px] font-black text-center mt-5">
              समीक्षा लिखें
            </Text>

            <Text className="text-stone-500 text-[13px] leading-[20px] text-center mt-2">
              लॉगिन के बाद आप अपनी पूजा का अनुभव और रेटिंग साझा कर सकते हैं।
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.selectionAsync();

                setRedirect({
                  tab: 'HomeTab',
                  screen:
                    'WriteReview',
                });

                navigation.navigate(
                  'Account'
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
  // REVIEW FORM
  // =========================

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
          paddingBottom: 110,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            backgroundColor:
              '#971f1f',

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
              <Star
                size={27}
                color="#971f1f"
              />
            </View>

            <View className="flex-1 ml-4">
              <Text className="text-[#fffaf2] text-[27px] font-black">
                समीक्षा लिखें
              </Text>

              <Text className="text-[#f2d7b1] text-[13px] mt-1">
                अपना पूजा अनुभव साझा करें
              </Text>
            </View>
          </View>

          <View className="bg-white/10 rounded-[18px] px-4 py-3 mt-5">
            <Text className="text-[#f2d7b1] text-[10px] font-bold">
              समीक्षा लिख रहे हैं
            </Text>

            <Text className="text-[#fffaf2] text-[15px] font-black mt-1">
              {userData.name}
            </Text>
          </View>
        </View>

        <View className="px-5 pt-7">

          {/* PUJA SELECTION */}

          <Text className="text-[#292524] text-[19px] font-black mb-2">
            पूजा चुनें
          </Text>

          <Text className="text-stone-500 text-[12px] mb-4">
            जिस पूजा के बारे में समीक्षा लिखना चाहते हैं उसे चुनें
          </Text>

          <View className="bg-[#fffdf8] border border-[#eadfce] rounded-[24px] p-4">
  {loadingPujas ? (
    <View className="py-5">
      <ActivityIndicator color="#971f1f" />
    </View>
  ) : loadError ? (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setRetry((value) => value + 1)}
      className="py-4 items-center"
    >
      <Text className="text-[#971f1f] font-black">
        पूजा लोड नहीं हुई
      </Text>

      <Text className="text-stone-500 text-[12px] mt-1">
        दोबारा प्रयास करने के लिए टैप करें
      </Text>
    </TouchableOpacity>
  ) : pujas.length === 0 ? (
    <Text className="text-stone-500 text-center py-4">
      कोई पूजा उपलब्ध नहीं है।
    </Text>
  ) : (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setShowPujaPicker(true)}
      className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-full bg-[#fff0df] items-center justify-center">
        <Sparkles size={18} color="#971f1f" />
      </View>

      <View className="flex-1 ml-3">
        <Text className="text-stone-400 text-[10px] font-bold">
          चयनित पूजा
        </Text>

        <Text
          numberOfLines={1}
          className={`text-[14px] mt-1 ${
            pujaId
              ? 'text-[#292524] font-black'
              : 'text-stone-400 font-medium'
          }`}
        >
          {pujaId
            ? pujas.find((p) => p.id === pujaId)?.titleEn
            : 'पूजा चुनें'}
        </Text>
      </View>

      <ChevronDown
        size={20}
        color="#971f1f"
      />
    </TouchableOpacity>
  )}
</View>

          {/* RATING */}

          <Text className="text-[#292524] text-[19px] font-black mt-7 text-center">
            आपका अनुभव कैसा रहा?
          </Text>

          <Text className="text-stone-500 text-[12px] text-center mt-1">
            स्टार पर टैप करके रेटिंग दें
          </Text>

          <View className="flex-row justify-center mt-5 mb-7">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <TouchableOpacity
                  key={star}
                  activeOpacity={
                    0.8
                  }
                  onPress={() => {
                    Haptics.selectionAsync();

                    setRating(
                      star
                    );
                  }}
                  className="px-1.5"
                >
                  <Star
                    size={38}
                    color={
                      star <=
                      rating
                        ? '#d97706'
                        : '#d6d3d1'
                    }
                    fill={
                      star <=
                      rating
                        ? '#f59e0b'
                        : 'transparent'
                    }
                  />
                </TouchableOpacity>
              )
            )}
          </View>

          {/* COMMENT */}

          <View className="bg-[#fffdf8] border border-[#eadfce] rounded-[24px] p-5">
            <Text className="text-[#292524] text-[16px] font-black">
              अपना अनुभव लिखें
            </Text>

            <Text className="text-stone-500 text-[11px] leading-[17px] mt-1 mb-3">
              पूजा, व्यवस्था या पंडितजी के व्यवहार के बारे में अपने अनुभव साझा करें।
            </Text>

            <TextInput
              className="bg-[#fffaf2] border border-[#eadfce] rounded-2xl px-4 py-4 text-[#292524] min-h-[130px]"
              placeholder="अपना अनुभव यहां लिखें..."
              placeholderTextColor="#a8a29e"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={comment}
              onChangeText={
                setComment
              }
            />
          </View>

          {/* INFO */}

          <View className="bg-[#fff1df] rounded-[18px] px-4 py-4 mt-5">
            <Text className="text-[#971f1f] text-[12px] font-black">
              समीक्षा अनुमोदन
            </Text>

            <Text className="text-stone-600 text-[11px] leading-[18px] mt-1">
              आपकी समीक्षा एडमिन की मंजूरी के बाद सार्वजनिक रूप से दिखाई जाएगी।
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
            className={`rounded-[20px] py-4 mt-6 items-center ${
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
              <Text className="text-[#fffaf2] text-[16px] font-black">
                समीक्षा भेजें
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
  visible={showPujaPicker}
  transparent
  animationType="fade"
  onRequestClose={() => setShowPujaPicker(false)}
>
  <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(28,25,23,0.45)',
      justifyContent: 'flex-end',
    }}
  >
    <View
      style={{
        backgroundColor: '#fffaf2',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: '70%',
        paddingTop: 20,
        paddingBottom: 24,
      }}
    >
      <View className="px-5 mb-4">
        <View className="w-12 h-1 bg-stone-300 rounded-full self-center mb-5" />

        <Text className="text-[#292524] text-[21px] font-black">
          पूजा चुनें
        </Text>

        <Text className="text-stone-500 text-[12px] mt-1">
          जिस पूजा का अनुभव साझा करना चाहते हैं उसे चुनें
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        {pujas.map((puja) => {
          const selected = puja.id === pujaId;

          return (
            <TouchableOpacity
              key={puja.id}
              activeOpacity={0.85}
              onPress={() => {
                Haptics.selectionAsync();
                setPujaId(puja.id);
                setShowPujaPicker(false);
              }}
              style={{
                backgroundColor: selected
                  ? '#fff1df'
                  : '#fffdf8',
              }}
              className="border border-[#eadfce] rounded-[18px] px-4 py-4 mb-3 flex-row items-center"
            >
              <View
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  selected
                    ? 'bg-[#971f1f]'
                    : 'bg-[#fff0df]'
                }`}
              >
                {selected ? (
                  <Check
                    size={18}
                    color="#fffaf2"
                  />
                ) : (
                  <Sparkles
                    size={17}
                    color="#971f1f"
                  />
                )}
              </View>

              <Text
                numberOfLines={2}
                className={`flex-1 ml-3 text-[14px] ${
                  selected
                    ? 'text-[#971f1f] font-black'
                    : 'text-[#292524] font-bold'
                }`}
              >
                {puja.titleEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  </View>
</Modal>
    </View>
  );
}