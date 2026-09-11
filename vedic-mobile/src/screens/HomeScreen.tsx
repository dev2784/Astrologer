import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
  Image,
} from 'react-native';

import {
  Sun,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight,
  Calendar,
  MapPin,
  Award,
  Star,
  Flame,
  Image as ImageIcon,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { useHomeStore } from '../store/useHomeStore';
import { Skeleton } from '../components/Skeleton';

export default function HomeScreen({ navigation }: any) {
  const {
    todayPanchang,
    todayMuhurats,
    featuredPujas,
    gallery,
    reviews,
    aboutInfo,
    isLoading,
    fetchHomeData,
  } = useHomeStore();

  const [activeTimingTab, setActiveTimingTab] =
    useState<'rahu' | 'abhijit'>('rahu');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const panchangAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const pujaAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
  if (!isLoading) {
    headerAnim.setValue(0);
    cardAnim.setValue(0);
    pujaAnim.setValue(0);
      panchangAnim.setValue(0);

    Animated.stagger(120, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

      Animated.timing(panchangAnim, {
        toValue: 1,
        duration: 500,
        delay: 120,
        useNativeDriver: true,
      }),

      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),

      Animated.timing(pujaAnim, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [isLoading]);

  const handleTimingToggle = (type: 'rahu' | 'abhijit') => {
    Haptics.selectionAsync();
    setActiveTimingTab(type);
  };

  const openWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const phoneNo = aboutInfo?.whatsappNo || '919340553012';

    Linking.openURL(
      `whatsapp://send?phone=${phoneNo}&text=हरि ओम आचार्य जी! मुझे पूजा के विषय में जानकारी चाहिए।`
    );
  };

  return (
    <View className="flex-1 bg-[#fffaf2]">
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
    >

      {/* PREMIUM HEADER */}
      <Animated.View
          style={{
            backgroundColor: '#7f1d1d',
            paddingTop: 50,
            paddingHorizontal: 18,
            paddingBottom: 26,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,

            opacity: headerAnim,

            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-18, 0],
                }),
              },
            ],
          }}
        >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                overflow: 'hidden',
                borderWidth: 2,
                borderColor: '#f2d19b',
                backgroundColor: '#fff7ed',
              }}
            >
              <Image
                source={require('../../assets/logo.png')}
                style={{
                  width: 48,
                  height: 48,
                }}
                resizeMode="cover"
              />
            </View>

            <View
              style={{
                marginLeft: 12,
                flex: 1,
              }}
            >
              <Text
                style={{
                  color: '#fff7ed',
                  fontWeight: '900',
                  fontSize: 16,
                }}
              >
                Hatkeshwar Jyotish
              </Text>

              <Text
                style={{
                  color: '#f2d7b1',
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                वैदिक मार्गदर्शन • पूजा • ज्योतिष
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={openWhatsApp}
            activeOpacity={0.85}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff7ed',
            }}
          >
            <MessageCircle
              size={20}
              color="#7f1d1d"
              strokeWidth={2.2}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 22 }}>
          <Text
            style={{
              color: '#fffaf2',
              fontWeight: '900',
              fontSize: 26,
            }}
          >
            नमस्कार 🙏
          </Text>

          <Text
            style={{
              color: '#f4d8b4',
              fontSize: 13,
              marginTop: 4,
            }}
          >
            ईश्वर की कृपा और शुभ ऊर्जा आपके साथ रहे
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 18,
          paddingBottom: 36,
        }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >

          {/* PANCHANG CARD */}
          <Animated.View
              style={{
                opacity: panchangAnim,
                transform: [
                  {
                    translateY: panchangAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [22, 0],
                    }),
                  },
                ],
              }}
            >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#fcebd7',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Calendar
                    size={17}
                    color="#9f2d24"
                    strokeWidth={2.2}
                  />
                </View>

                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      fontWeight: '900',
                      color: '#292524',
                      fontSize: 16,
                    }}
                  >
                    आज का पंचांग
                  </Text>

                  <Text
                    style={{
                      color: '#78716c',
                      fontSize: 10,
                      marginTop: 1,
                    }}
                  >
                    दैनिक वैदिक जानकारी
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Panchang')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: '#9f2d24',
                    fontWeight: '800',
                    fontSize: 11,
                  }}
                >
                  संपूर्ण पंचांग
                </Text>

                <ChevronRight
                  size={14}
                  color="#9f2d24"
                />
              </TouchableOpacity>
            </View>

            {isLoading ? (
              <View style={{ paddingVertical: 8 }}>
                <Skeleton
                  width="70%"
                  height={24}
                  className="mb-2"
                />

                <Skeleton
                  width="45%"
                  height={16}
                />
              </View>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: '900',
                    color: '#1c1917',
                    marginBottom: 4,
                  }}
                >
                  {todayPanchang?.tithi?.details?.tithi_name ||
                    'तिथि उपलब्ध नहीं'}
                </Text>

                <Text
                  style={{
                    color: '#78716c',
                    fontSize: 12,
                    marginBottom: 16,
                  }}
                >
                  {todayPanchang?.paksha || 'पक्ष'} • नक्षत्र:{' '}
                  {todayPanchang?.nakshatra?.details?.nak_name || '--'}
                </Text>

                {/* QUICK DETAILS */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#fdf1df',
                    borderRadius: 16,
                    paddingVertical: 12,
                    marginBottom: 15,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: '#a8a29e',
                        fontSize: 10,
                        fontWeight: '800',
                      }}
                    >
                      तिथि
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#44403c',
                        fontWeight: '800',
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      {todayPanchang?.tithi?.details?.tithi_name || '--'}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 1,
                      backgroundColor: '#e7d7c1',
                    }}
                  />

                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: '#a8a29e',
                        fontSize: 10,
                        fontWeight: '800',
                      }}
                    >
                      नक्षत्र
                    </Text>

                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#44403c',
                        fontWeight: '800',
                        fontSize: 12,
                        marginTop: 3,
                      }}
                    >
                      {todayPanchang?.nakshatra?.details?.nak_name ||
                        '--'}
                    </Text>
                  </View>
                </View>

                {/* TIMING SWITCH */}
                <View
                  style={{
                    flexDirection: 'row',
                    backgroundColor: '#f1ece5',
                    borderRadius: 15,
                    padding: 4,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleTimingToggle('rahu')}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor:
                        activeTimingTab === 'rahu'
                          ? '#ffffff'
                          : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '900',
                        color:
                          activeTimingTab === 'rahu'
                            ? '#9f1239'
                            : '#78716c',
                      }}
                    >
                      राहुकाल
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleTimingToggle('abhijit')}
                    activeOpacity={0.85}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor:
                        activeTimingTab === 'abhijit'
                          ? '#ffffff'
                          : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '900',
                        color:
                          activeTimingTab === 'abhijit'
                            ? '#7f1d1d'
                            : '#78716c',
                      }}
                    >
                      अभिजीत मुहूर्त
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* TIMING RESULT */}
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: '#fff7ed',
                    borderRadius: 14,
                    paddingVertical: 13,
                    borderWidth: 1,
                    borderColor: '#f0dfc7',
                  }}
                >
                  {activeTimingTab === 'rahu' ? (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#9f1239',
                        fontWeight: '900',
                        fontSize: 13,
                      }}
                    >
                      राहुकाल:{' '}
                      {todayPanchang?.rahukaal?.start || '--'} -{' '}
                      {todayPanchang?.rahukaal?.end || '--'}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#7f1d1d',
                        fontWeight: '900',
                        fontSize: 13,
                      }}
                    >
                      अभिजीत:{' '}
                      {todayPanchang?.abhijit_muhurta?.start || '--'} -{' '}
                      {todayPanchang?.abhijit_muhurta?.end || '--'}
                    </Text>
                  )}
                </View>
              </>
            )}
          </Animated.View>

          {/* MUHURAT CARD */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Muhurat')}
            activeOpacity={0.9}
            style={{
              backgroundColor: '#7f1d1d',
              borderRadius: 22,
              padding: 18,
              marginBottom: 26,

              shadowColor: '#7f1d1d',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.12,
              shadowRadius: 12,

              elevation: 4,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  flex: 1,
                  paddingRight: 10,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: '#fff7ed',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles
                    size={20}
                    color="#b45309"
                  />
                </View>

                <View
                  style={{
                    marginLeft: 12,
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff7ed',
                      fontSize: 16,
                      fontWeight: '900',
                    }}
                  >
                    आज के शुभ मुहूर्त
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#f5d7b5',
                      fontSize: 11,
                      marginTop: 3,
                    }}
                  >
                    {todayMuhurats.length > 0
                      ? todayMuhurats[0]?.tithi
                      : 'पूजा एवं शुभ कार्य के समय देखें'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#fff7ed',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight
                  size={18}
                  color="#7f1d1d"
                />
              </View>
            </View>
          </TouchableOpacity>

          {/* FEATURED PUJAS */}
          {/* 4. Premium Featured Pujas */}
          <View className="mb-8">
            <View className="flex-row justify-between items-end mb-4">
              <View>
                <Text className="text-[24px] font-black text-stone-900">
                  उज्जैन की प्रमुख पूजाएं
                </Text>
                <Text className="text-stone-500 text-xs mt-1">
                  विशेष वैदिक पूजा एवं अनुष्ठान
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Pujas')}
                activeOpacity={0.7}
                className="flex-row items-center"
              >
                <Text className="text-red-800 font-bold text-sm mr-1">
                  सभी देखें
                </Text>
                <ChevronRight size={16} color="#991b1b" />
              </TouchableOpacity>
            </View>

            {featuredPujas.length === 0 ? (
              <View className="bg-[#fffaf2] border border-[#eadfce] rounded-3xl p-6 items-center">
                <Flame size={28} color="#991b1b" />
                <Text className="text-stone-800 font-bold mt-3">
                  पूजा सेवाएं लोड हो रही हैं
                </Text>
                <Text className="text-stone-500 text-xs mt-1">
                  कृपया कुछ क्षण बाद देखें
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
                className="-mx-4 px-4"
              >
                {featuredPujas.map((puja, index) => (
                  <Animated.View
                    key={puja.id}
                    style={{
                      opacity: fadeAnim,
                      transform: [
                        {
                          translateY: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [18 + index * 2, 0],
                          }),
                        },
                      ],
                    }}
                    className="mr-4"
                  >
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => {
                        Haptics.impactAsync(
                          Haptics.ImpactFeedbackStyle.Light
                        );

                        navigation.navigate('Pujas', {
                          screen: 'PujaDetails',
                          params: {
                            pujaId: puja.id,
                            slug: puja.slug,
                          },
                        });
                      }}
                      style={{
                        width: 235,
                        backgroundColor: '#fffaf2',
                        borderRadius: 24,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: '#eadfce',

                        shadowColor: '#7f1d1d',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.08,
                        shadowRadius: 10,

                        elevation: 4,
                      }}
                    >
                      {/* Image */}
                      <View
                        style={{
                          height: 145,
                          backgroundColor: '#f5ead8',
                          position: 'relative',
                        }}
                      >
                        {puja.imageUrl ? (
                          <Image
                            source={{ uri: puja.imageUrl }}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="flex-1 items-center justify-center bg-[#f8ead7]">
                            <Flame
                              size={40}
                              color="#991b1b"
                              strokeWidth={1.6}
                            />
                          </View>
                        )}

                        {/* Badge */}
                        <View
                          style={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            backgroundColor: 'rgba(255,250,242,0.94)',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 999,
                          }}
                        >
                          <Text className="text-[10px] font-black text-red-900">
                            {puja.tag || 'विशेष पूजा'}
                          </Text>
                        </View>
                      </View>

                      {/* Content */}
                      <View className="p-4">
                        <Text
                          className="text-[17px] font-black text-stone-900 mb-1"
                          numberOfLines={1}
                        >
                          {puja.titleHi || puja.titleEn}
                        </Text>

                        {puja.titleEn && (
                          <Text
                            className="text-stone-500 text-xs mb-3"
                            numberOfLines={1}
                          >
                            {puja.titleEn}
                          </Text>
                        )}

                        <View className="flex-row items-center mb-4">
                          <View className="w-7 h-7 rounded-full bg-[#f7e8d8] items-center justify-center">
                            <MapPin
                              size={13}
                              color="#991b1b"
                            />
                          </View>

                          <Text
                            className="text-stone-600 text-xs ml-2 flex-1"
                            numberOfLines={1}
                          >
                            {puja.placeOfPuja ||
                              puja.location ||
                              'उज्जैन'}
                          </Text>
                        </View>

                        <View className="flex-row items-center justify-between">
                          {puja.charges ? (
                            <Text className="text-red-900 font-black text-base">
                              ₹ {puja.charges}
                            </Text>
                          ) : (
                            <Text className="text-stone-500 font-semibold text-xs">
                              जानकारी देखें
                            </Text>
                          )}

                          <View className="bg-red-900 w-10 h-10 rounded-full items-center justify-center">
                            <ChevronRight
                              size={18}
                              color="#fffaf2"
                            />
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* GALLERY */}
          {gallery && gallery.length > 0 && (
            <View style={{ marginBottom: 28 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: '#fcebd7',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ImageIcon
                    size={16}
                    color="#9f2d24"
                  />
                </View>

                <Text
                  style={{
                    marginLeft: 9,
                    color: '#292524',
                    fontWeight: '900',
                    fontSize: 18,
                  }}
                >
                  पूजा दर्शन
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {gallery.map((img) => (
                  <Image
                    key={img.id}
                    source={{
                      uri: img.imageUrl,
                    }}
                    style={{
                      width: 190,
                      height: 125,
                      borderRadius: 18,
                      marginRight: 10,
                      backgroundColor: '#e7e5e4',
                    }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* REVIEWS */}
          {reviews && reviews.length > 0 && (
            <View style={{ marginBottom: 28 }}>
              <Text
                style={{
                  color: '#292524',
                  fontWeight: '900',
                  fontSize: 18,
                  marginBottom: 12,
                }}
              >
                यजमानों के अनुभव
              </Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {reviews.map((review) => (
                  <View
                    key={review.id}
                    style={{
                      width: 275,
                      marginRight: 12,
                      backgroundColor: '#fffaf2',
                      borderWidth: 1,
                      borderColor: '#eadac4',
                      borderRadius: 20,
                      padding: 16,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        marginBottom: 8,
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          color={
                            star <= review.rating
                              ? '#d97706'
                              : '#d6d3d1'
                          }
                          fill={
                            star <= review.rating
                              ? '#d97706'
                              : 'transparent'
                          }
                        />
                      ))}
                    </View>

                    <Text
                      style={{
                        color: '#57534e',
                        fontSize: 13,
                        lineHeight: 20,
                        fontStyle: 'italic',
                        marginBottom: 12,
                      }}
                    >
                      "{review.comment}"
                    </Text>

                    <Text
                      style={{
                        color: '#292524',
                        fontSize: 11,
                        fontWeight: '900',
                      }}
                    >
                      {review.userName}
                      {review.userCity
                        ? ` • ${review.userCity}`
                        : ''}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Light
                  );

                  navigation.navigate('WriteReview');
                }}
                activeOpacity={0.9}
                style={{
                  marginTop: 12,
                  backgroundColor: '#fffaf2',
                  borderColor: '#e2c49f',
                  borderWidth: 1,
                  borderRadius: 14,
                  paddingVertical: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Star
                  size={16}
                  color="#9f2d24"
                />

                <Text
                  style={{
                    marginLeft: 8,
                    color: '#9f2d24',
                    fontWeight: '900',
                    fontSize: 13,
                  }}
                >
                  अपना अनुभव साझा करें
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ABOUT */}
          {aboutInfo && (
            <View
              style={{
                backgroundColor: '#fffaf2',
                borderWidth: 1,
                borderColor: '#eadac4',
                borderRadius: 22,
                padding: 18,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 13,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    overflow: 'hidden',
                    backgroundColor: '#e7e5e4',
                  }}
                >
                  <Image
                    source={{
                      uri: aboutInfo.image,
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 12,
                  }}
                >
                  <Text
                    style={{
                      color: '#292524',
                      fontWeight: '900',
                      fontSize: 16,
                    }}
                  >
                    {aboutInfo.name}
                  </Text>

                  <Text
                    style={{
                      color: '#78716c',
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {aboutInfo.yearsExp}+ वर्षों का अनुभव •{' '}
                    {aboutInfo.pujasDone}+ अनुष्ठान
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  color: '#57534e',
                  fontSize: 13,
                  lineHeight: 21,
                  marginBottom: 16,
                }}
              >
                {aboutInfo.descriptionHi ||
                  aboutInfo.descriptionEn}
              </Text>

              <TouchableOpacity
                onPress={openWhatsApp}
                activeOpacity={0.9}
                style={{
                  backgroundColor: '#7f1d1d',
                  borderRadius: 14,
                  paddingVertical: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}
              >
                <Phone
                  size={16}
                  color="#fff7ed"
                />

                <Text
                  style={{
                    marginLeft: 8,
                    color: '#fff7ed',
                    fontWeight: '900',
                    fontSize: 13,
                  }}
                >
                  पंडित जी से सीधे संपर्क करें
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </Animated.View>
      </ScrollView>
       </ScrollView>
    </View>
  );
}