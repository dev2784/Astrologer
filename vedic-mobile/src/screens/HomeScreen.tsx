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
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight,
  Calendar,
  MapPin,
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

  // ---------------------------------------
  // SCREEN SECTION ANIMATIONS
  // ---------------------------------------

  const greetingAnim = useRef(new Animated.Value(0)).current;
  const panchangAnim = useRef(new Animated.Value(0)).current;
  const muhuratAnim = useRef(new Animated.Value(0)).current;
  const pujaAnim = useRef(new Animated.Value(0)).current;
  const galleryAnim = useRef(new Animated.Value(0)).current;
  const reviewAnim = useRef(new Animated.Value(0)).current;
  const aboutAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchHomeData();

    Animated.stagger(90, [
      Animated.timing(greetingAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),

      Animated.timing(panchangAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),

      Animated.timing(muhuratAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),

      Animated.timing(pujaAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),

      Animated.timing(galleryAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),

      Animated.timing(reviewAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),

      Animated.timing(aboutAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const sectionAnim = (
    anim: Animated.Value,
    translateY: number = 18
  ) => ({
    opacity: anim,

    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [translateY, 0],
        }),
      },
    ],
  });

  // ---------------------------------------
  // ACTIONS
  // ---------------------------------------

  const handleTimingToggle = (type: 'rahu' | 'abhijit') => {
    Haptics.selectionAsync();
    setActiveTimingTab(type);
  };

  const openWhatsApp = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    const phoneNo =
      aboutInfo?.whatsappNo || '919340553012';

    Linking.openURL(
      `whatsapp://send?phone=${phoneNo}&text=हरि ओम आचार्य जी! मुझे पूजा के विषय में जानकारी चाहिए।`
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      {/* ==================================================
          FIXED TOP HEADER
      ================================================== */}

      <View
        style={{
          backgroundColor: '#7f1d1d',
          paddingTop: 48,
          paddingHorizontal: 18,
          paddingBottom: 12,

          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 5,

          elevation: 5,
          zIndex: 20,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* LOGO */}

          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,

              overflow: 'hidden',

              borderWidth: 2,
              borderColor: '#f2d19b',

              backgroundColor: '#fff7ed',
            }}
          >
            <Image
              source={require('../../assets/logo.png')}
              style={{
                width: 42,
                height: 42,
              }}
              resizeMode="cover"
            />
          </View>

          {/* BRAND */}

          <View
            style={{
              marginLeft: 11,
              flex: 1,
            }}
          >
            <Text
              style={{
                color: '#fff7ed',
                fontWeight: '900',
                fontSize: 15,
              }}
            >
              Hatkeshwar Jyotish
            </Text>

            <Text
              style={{
                color: '#f2d7b1',
                fontSize: 10,
                marginTop: 1,
              }}
            >
              वैदिक मार्गदर्शन • पूजा • ज्योतिष
            </Text>
          </View>
        </View>

        {/* WHATSAPP */}

        <TouchableOpacity
          onPress={openWhatsApp}
          activeOpacity={0.85}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,

            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: '#fff7ed',
          }}
        >
          <MessageCircle
            size={19}
            color="#7f1d1d"
            strokeWidth={2.2}
          />
        </TouchableOpacity>
      </View>

      {/* ==================================================
          MAIN SCROLL
      ================================================== */}

      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 36,
        }}
      >
        {/* ==================================================
            SCROLLABLE GREETING
        ================================================== */}

        <Animated.View
          style={{
            ...sectionAnim(greetingAnim, -12),

            backgroundColor: '#7f1d1d',

            paddingHorizontal: 18,
            paddingTop: 15,
            paddingBottom: 26,

            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
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
        </Animated.View>

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 18,
          }}
        >
          {/* ==================================================
              PANCHANG
          ================================================== */}

          <Animated.View
            style={[
              sectionAnim(panchangAnim),
              {
                marginBottom: 26,
              },
            ]}
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

                <View
                  style={{
                    marginLeft: 10,
                  }}
                >
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
                onPress={() =>
                  navigation.navigate('Panchang')
                }
                activeOpacity={0.7}
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
              <View
                style={{
                  paddingVertical: 8,
                }}
              >
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
                  {todayPanchang?.tithi?.details
                    ?.tithi_name ||
                    'तिथि उपलब्ध नहीं'}
                </Text>

                <Text
                  style={{
                    color: '#78716c',
                    fontSize: 12,
                    marginBottom: 16,
                  }}
                >
                  {todayPanchang?.paksha || 'पक्ष'}
                  {' • '}
                  नक्षत्र:{' '}
                  {todayPanchang?.nakshatra?.details
                    ?.nak_name || '--'}
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
                  {/* TITHI */}

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
                      {todayPanchang?.tithi?.details
                        ?.tithi_name || '--'}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 1,
                      backgroundColor: '#e7d7c1',
                    }}
                  />

                  {/* NAKSHATRA */}

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
                      {todayPanchang?.nakshatra?.details
                        ?.nak_name || '--'}
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
                    onPress={() =>
                      handleTimingToggle('rahu')
                    }
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
                    onPress={() =>
                      handleTimingToggle('abhijit')
                    }
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
                      {todayPanchang?.rahukaal?.start ||
                        '--'}
                      {' - '}
                      {todayPanchang?.rahukaal?.end ||
                        '--'}
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
                      {todayPanchang?.abhijit_muhurta
                        ?.start || '--'}
                      {' - '}
                      {todayPanchang?.abhijit_muhurta
                        ?.end || '--'}
                    </Text>
                  )}
                </View>
              </>
            )}
          </Animated.View>

          {/* ==================================================
              MUHURAT
          ================================================== */}

          <Animated.View
            style={sectionAnim(muhuratAnim)}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Muhurat')
              }
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
          </Animated.View>

          {/* ==================================================
              FEATURED PUJAS
          ================================================== */}

          <Animated.View
            style={sectionAnim(pujaAnim)}
          >
            <View
              style={{
                marginBottom: 32,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',

                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    paddingRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: '900',
                      color: '#1c1917',
                    }}
                  >
                    उज्जैन की प्रमुख पूजाएं
                  </Text>

                  <Text
                    style={{
                      color: '#78716c',
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    विशेष वैदिक पूजा एवं अनुष्ठान
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Pujas')
                  }
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: '#991b1b',

                      fontWeight: '800',

                      fontSize: 13,

                      marginRight: 2,
                    }}
                  >
                    सभी देखें
                  </Text>

                  <ChevronRight
                    size={16}
                    color="#991b1b"
                  />
                </TouchableOpacity>
              </View>

              {featuredPujas.length === 0 ? (
                <View
                  style={{
                    backgroundColor: '#fffaf2',

                    borderWidth: 1,
                    borderColor: '#eadfce',

                    borderRadius: 24,

                    padding: 24,

                    alignItems: 'center',
                  }}
                >
                  <Flame
                    size={28}
                    color="#991b1b"
                  />

                  <Text
                    style={{
                      color: '#292524',

                      fontWeight: '800',

                      marginTop: 12,
                    }}
                  >
                    पूजा सेवाएं लोड हो रही हैं
                  </Text>

                  <Text
                    style={{
                      color: '#78716c',

                      fontSize: 12,

                      marginTop: 4,
                    }}
                  >
                    कृपया कुछ क्षण बाद देखें
                  </Text>
                </View>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    paddingRight: 20,
                  }}
                >
                  {featuredPujas.map(
                    (puja, index) => (
                      <Animated.View
                        key={puja.id}
                        style={{
                          opacity: pujaAnim,

                          transform: [
                            {
                              translateY:
                                pujaAnim.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [
                                    14 + index * 2,
                                    0,
                                  ],
                                }),
                            },
                          ],

                          marginRight: 16,
                        }}
                      >
                        <TouchableOpacity
                          activeOpacity={0.88}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics
                                .ImpactFeedbackStyle
                                .Light
                            );

                            navigation.navigate(
                              'Pujas',
                              {
                                screen:
                                  'PujaDetails',

                                params: {
                                  pujaId: puja.id,
                                  slug: puja.slug,
                                },
                              }
                            );
                          }}
                          style={{
                            width: 235,

                            backgroundColor:
                              '#fffaf2',

                            borderRadius: 24,

                            overflow: 'hidden',

                            borderWidth: 1,
                            borderColor: '#eadfce',

                            shadowColor:
                              '#7f1d1d',

                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },

                            shadowOpacity: 0.08,

                            shadowRadius: 10,

                            elevation: 4,
                          }}
                        >
                          {/* PUJA IMAGE */}

                          <View
                            style={{
                              height: 145,

                              backgroundColor:
                                '#f5ead8',

                              position: 'relative',
                            }}
                          >
                            {puja.imageUrl ? (
                              <Image
                                source={{
                                  uri: puja.imageUrl,
                                }}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                }}
                                resizeMode="cover"
                              />
                            ) : (
                              <View
                                style={{
                                  flex: 1,

                                  alignItems:
                                    'center',

                                  justifyContent:
                                    'center',

                                  backgroundColor:
                                    '#f8ead7',
                                }}
                              >
                                <Flame
                                  size={40}
                                  color="#991b1b"
                                  strokeWidth={1.6}
                                />
                              </View>
                            )}

                            {/* BADGE */}

                            <View
                              style={{
                                position:
                                  'absolute',

                                top: 12,
                                left: 12,

                                backgroundColor:
                                  'rgba(255,250,242,0.94)',

                                paddingHorizontal: 10,
                                paddingVertical: 5,

                                borderRadius: 999,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 10,

                                  fontWeight: '900',

                                  color:
                                    '#7f1d1d',
                                }}
                              >
                                {puja.tag ||
                                  'विशेष पूजा'}
                              </Text>
                            </View>
                          </View>

                          {/* PUJA CONTENT */}

                          <View
                            style={{
                              padding: 16,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 17,

                                fontWeight: '900',

                                color: '#1c1917',

                                marginBottom: 4,
                              }}
                            >
                              {puja.titleHi ||
                                puja.titleEn}
                            </Text>

                            {puja.titleEn && (
                              <Text
                                numberOfLines={1}
                                style={{
                                  color:
                                    '#78716c',

                                  fontSize: 12,

                                  marginBottom: 12,
                                }}
                              >
                                {puja.titleEn}
                              </Text>
                            )}

                            <View
                              style={{
                                flexDirection: 'row',

                                alignItems:
                                  'center',

                                marginBottom: 16,
                              }}
                            >
                              <View
                                style={{
                                  width: 28,
                                  height: 28,

                                  borderRadius: 14,

                                  backgroundColor:
                                    '#f7e8d8',

                                  alignItems:
                                    'center',

                                  justifyContent:
                                    'center',
                                }}
                              >
                                <MapPin
                                  size={13}
                                  color="#991b1b"
                                />
                              </View>

                              <Text
                                numberOfLines={1}
                                style={{
                                  color:
                                    '#57534e',

                                  fontSize: 12,

                                  marginLeft: 8,

                                  flex: 1,
                                }}
                              >
                                {puja.placeOfPuja ||
                                  puja.location ||
                                  'उज्जैन'}
                              </Text>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',

                                alignItems:
                                  'center',

                                justifyContent:
                                  'space-between',
                              }}
                            >
                              {puja.charges ? (
                                <Text
                                  style={{
                                    color:
                                      '#7f1d1d',

                                    fontWeight:
                                      '900',

                                    fontSize: 16,
                                  }}
                                >
                                  ₹ {puja.charges}
                                </Text>
                              ) : (
                                <Text
                                  style={{
                                    color:
                                      '#78716c',

                                    fontWeight:
                                      '600',

                                    fontSize: 12,
                                  }}
                                >
                                  जानकारी देखें
                                </Text>
                              )}

                              <View
                                style={{
                                  width: 40,
                                  height: 40,

                                  borderRadius: 20,

                                  backgroundColor:
                                    '#7f1d1d',

                                  alignItems:
                                    'center',

                                  justifyContent:
                                    'center',
                                }}
                              >
                                <ChevronRight
                                  size={18}
                                  color="#fffaf2"
                                />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    )
                  )}
                </ScrollView>
              )}
            </View>
          </Animated.View>

          {/* ==================================================
              GALLERY
          ================================================== */}

          {gallery && gallery.length > 0 && (
            <Animated.View
              style={[
                sectionAnim(galleryAnim),
                {
                  marginBottom: 28,
                },
              ]}
            >
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

                      backgroundColor:
                        '#e7e5e4',
                    }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* ==================================================
              REVIEWS
          ================================================== */}

          {reviews && reviews.length > 0 && (
            <Animated.View
              style={[
                sectionAnim(reviewAnim),
                {
                  marginBottom: 28,
                },
              ]}
            >
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
                      {[1, 2, 3, 4, 5].map(
                        (star) => (
                          <Star
                            key={star}
                            size={14}
                            color={
                              star <=
                              review.rating
                                ? '#d97706'
                                : '#d6d3d1'
                            }
                            fill={
                              star <=
                              review.rating
                                ? '#d97706'
                                : 'transparent'
                            }
                          />
                        )
                      )}
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
                    Haptics
                      .ImpactFeedbackStyle
                      .Light
                  );

                  navigation.navigate(
                    'WriteReview'
                  );
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
            </Animated.View>
          )}

          {/* ==================================================
              ABOUT
          ================================================== */}

          {aboutInfo && (
            <Animated.View
              style={[
                sectionAnim(aboutAnim),
                {
                  backgroundColor: '#fffaf2',

                  borderWidth: 1,

                  borderColor: '#eadac4',

                  borderRadius: 22,

                  padding: 18,

                  marginBottom: 20,
                },
              ]}
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

                    backgroundColor:
                      '#e7e5e4',
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
                    {aboutInfo.yearsExp}+ वर्षों का अनुभव
                    {' • '}
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
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}