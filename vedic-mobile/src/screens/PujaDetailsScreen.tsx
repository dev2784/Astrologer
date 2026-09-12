import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
  Image,
  Animated,
} from 'react-native';

import {
  useRoute,
  useNavigation,
  RouteProp,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import RenderHtml from 'react-native-render-html';

import {
  Clock3,
  Users,
  PackageCheck,
  ChevronRight,
  Sparkles,
  Flame,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { usePujaStore } from '../store/usePujaStore';
import { HomeStackParamList } from '../navigation/types';

type PujaDetailsRouteProp =
  RouteProp<HomeStackParamList, 'PujaDetails'>;

type NavigationProp =
  NativeStackNavigationProp<
    HomeStackParamList,
    'BookingForm'
  >;

export default function PujaDetailsScreen() {
  const route = useRoute<PujaDetailsRouteProp>();
  const navigation =
    useNavigation<NavigationProp>();

  const { width } = useWindowDimensions();

  const { pujaId } = route.params;

  const {
    selectedPuja,
    isLoading,
    error,
    fetchPujaDetails,
  } = usePujaStore();

  const screenAnim =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (pujaId) {
      fetchPujaDetails(pujaId as string);
    }

    screenAnim.setValue(0);

    Animated.timing(screenAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [pujaId]);

  const pageStyle = {
    opacity: screenAnim,

    transform: [
      {
        translateY: screenAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  };

  // ERROR FIRST
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fffaf2',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#f8ead7',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flame
            size={27}
            color="#7f1d1d"
          />
        </View>

        <Text
          style={{
            marginTop: 15,
            color: '#7f1d1d',
            textAlign: 'center',
            fontWeight: '800',
            fontSize: 14,
          }}
        >
          {error}
        </Text>

        <TouchableOpacity
          onPress={() =>
            fetchPujaDetails(
              pujaId as string
            )
          }
          activeOpacity={0.85}
          style={{
            marginTop: 18,
            backgroundColor: '#7f1d1d',
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              color: '#fffaf2',
              fontWeight: '800',
            }}
          >
            फिर से प्रयास करें
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading || !selectedPuja) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fffaf2',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#7f1d1d"
        />

        <Text
          style={{
            marginTop: 14,
            color: '#78716c',
            fontSize: 13,
            fontWeight: '600',
          }}
        >
          पूजा विवरण लोड हो रहा है...
        </Text>
      </View>
    );
  }

  const htmlStyles: any = {
    body: {
      color: '#57534e',
    },

    p: {
      fontSize: 14,
      color: '#57534e',
      lineHeight: 23,
      marginTop: 0,
      marginBottom: 10,
    },

    strong: {
      color: '#292524',
      fontWeight: '900',
    },

    ul: {
      paddingLeft: 18,
      color: '#57534e',
    },

    ol: {
      paddingLeft: 18,
      color: '#57534e',
    },

    li: {
      fontSize: 14,
      color: '#57534e',
      lineHeight: 22,
      marginBottom: 6,
    },

    h1: {
      color: '#7f1d1d',
      fontSize: 20,
      fontWeight: '900',
    },

    h2: {
      color: '#7f1d1d',
      fontSize: 18,
      fontWeight: '900',
    },

    h3: {
      color: '#7f1d1d',
      fontSize: 16,
      fontWeight: '900',
    },
  };

  const formatCharges = () => {
    if (!selectedPuja.charges) {
      return 'जानकारी के लिए संपर्क करें';
    }

    const value =
      String(selectedPuja.charges);

    return value.includes('₹')
      ? value
      : `₹ ${value}`;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      <Animated.View
        style={[
          {
            flex: 1,
          },
          pageStyle,
        ]}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 28,
          }}
        >
          {/* =========================
              HERO IMAGE
          ========================= */}

          <View
            style={{
              height: 260,
              backgroundColor: '#f5ead8',
              position: 'relative',
            }}
          >
            {selectedPuja.imageUrl ? (
              <Image
                source={{
                  uri: selectedPuja.imageUrl,
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
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame
                  size={55}
                  color="#7f1d1d"
                  strokeWidth={1.4}
                />
              </View>
            )}

            {/* HERO BADGE */}

            <View
              style={{
                position: 'absolute',
                left: 16,
                bottom: 16,

                backgroundColor:
                  'rgba(255,250,242,0.95)',

                paddingHorizontal: 11,
                paddingVertical: 6,

                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: '#7f1d1d',
                  fontSize: 10,
                  fontWeight: '900',
                }}
              >
                {selectedPuja.tag ||
                  'विशेष वैदिक पूजा'}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 20,
            }}
          >
            {/* =========================
                TITLE
            ========================= */}

            <Text
              style={{
                color: '#1c1917',
                fontSize: 26,
                fontWeight: '900',
                lineHeight: 32,
              }}
            >
              {selectedPuja.titleHi?.trim() ||
                selectedPuja.titleEn?.trim()}
            </Text>

            {selectedPuja.titleEn && (
              <Text
                style={{
                  color: '#78716c',
                  fontSize: 13,
                  marginTop: 5,
                  marginBottom: 18,
                }}
              >
                {selectedPuja.titleEn?.trim()}
              </Text>
            )}

            {/* =========================
                PRICE CARD
            ========================= */}

            <View
              style={{
                backgroundColor: '#7f1d1d',
                borderRadius: 20,
                padding: 17,
                marginBottom: 18,

                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:
                  'space-between',

                shadowColor: '#7f1d1d',
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <View>
                <Text
                  style={{
                    color: '#f2d7b1',
                    fontSize: 10,
                    fontWeight: '700',
                  }}
                >
                  पूजा शुल्क
                </Text>

                <Text
                  style={{
                    color: '#fffaf2',
                    fontSize: 19,
                    fontWeight: '900',
                    marginTop: 3,
                  }}
                >
                  {formatCharges()}
                </Text>
              </View>

              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
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
            </View>

            {/* =========================
                INFO GRID
            ========================= */}

            <View
              style={{
                flexDirection: 'row',
                justifyContent:
                  'space-between',
                marginBottom: 22,
              }}
            >
              {/* DURATION */}

              <View
                style={{
                  width: '31.5%',
                  backgroundColor: '#fffdf8',
                  borderWidth: 1,
                  borderColor: '#eadfce',
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: '#f7e8d8',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 7,
                  }}
                >
                  <Clock3
                    size={16}
                    color="#7f1d1d"
                  />
                </View>

                <Text
                  style={{
                    color: '#a8a29e',
                    fontSize: 9,
                    fontWeight: '800',
                  }}
                >
                  समय
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    color: '#292524',
                    fontSize: 11,
                    lineHeight: 15,
                    fontWeight: '800',
                    textAlign: 'center',
                    marginTop: 3,
                  }}
                >
                  {selectedPuja.estimatedTime ||
                    'N/A'}
                </Text>
              </View>

              {/* YAJMAN */}

              <View
                style={{
                  width: '31.5%',
                  backgroundColor: '#fffdf8',
                  borderWidth: 1,
                  borderColor: '#eadfce',
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: '#f7e8d8',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 7,
                  }}
                >
                  <Users
                    size={16}
                    color="#7f1d1d"
                  />
                </View>

                <Text
                  style={{
                    color: '#a8a29e',
                    fontSize: 9,
                    fontWeight: '800',
                  }}
                >
                  यजमान
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    color: '#292524',
                    fontSize: 11,
                    lineHeight: 15,
                    fontWeight: '800',
                    textAlign: 'center',
                    marginTop: 3,
                  }}
                >
                  {selectedPuja.noOfYajman ||
                    'N/A'}
                </Text>
              </View>

              {/* SAMAGRI */}

              <View
                style={{
                  width: '31.5%',
                  backgroundColor: '#fffdf8',
                  borderWidth: 1,
                  borderColor: '#eadfce',
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 8,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: '#f7e8d8',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 7,
                  }}
                >
                  <PackageCheck
                    size={16}
                    color="#7f1d1d"
                  />
                </View>

                <Text
                  style={{
                    color: '#a8a29e',
                    fontSize: 9,
                    fontWeight: '800',
                  }}
                >
                  सामग्री
                </Text>

                <Text
                  numberOfLines={2}
                  style={{
                    color: '#292524',
                    fontSize: 11,
                    lineHeight: 15,
                    fontWeight: '800',
                    textAlign: 'center',
                    marginTop: 3,
                  }}
                >
                  {selectedPuja.samagri ||
                    'N/A'}
                </Text>
              </View>
            </View>

            {/* =========================
                ABOUT
            ========================= */}

            {selectedPuja.about && (
              <View
                style={{
                  backgroundColor: '#fffdf8',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#eadfce',
                  padding: 16,
                  marginBottom: 18,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor:
                        '#f7e8d8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Flame
                      size={16}
                      color="#7f1d1d"
                    />
                  </View>

                  <Text
                    style={{
                      marginLeft: 9,
                      color: '#1c1917',
                      fontWeight: '900',
                      fontSize: 18,
                    }}
                  >
                    पूजा के बारे में
                  </Text>
                </View>

                <RenderHtml
                  contentWidth={width - 64}
                  source={{
                    html: selectedPuja.about,
                  }}
                  tagsStyles={htmlStyles}
                />
              </View>
            )}

            {/* =========================
                BENEFITS
            ========================= */}

            {selectedPuja.benefits && (
              <View
                style={{
                  backgroundColor: '#fffdf8',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#eadfce',
                  padding: 16,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor:
                        '#fff0d8',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles
                      size={16}
                      color="#b45309"
                    />
                  </View>

                  <Text
                    style={{
                      marginLeft: 9,
                      color: '#1c1917',
                      fontWeight: '900',
                      fontSize: 18,
                    }}
                  >
                    पूजा के लाभ
                  </Text>
                </View>

                <RenderHtml
                  contentWidth={width - 64}
                  source={{
                    html: selectedPuja.benefits,
                  }}
                  tagsStyles={htmlStyles}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      {/* =========================
          STICKY BOOKING BAR
      ========================= */}

      <View
        style={{
          backgroundColor: '#fffaf2',

          borderTopWidth: 1,
          borderTopColor: '#eadfce',

          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 12,

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,

          elevation: 12,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => {
            Haptics.impactAsync(
              Haptics
                .ImpactFeedbackStyle
                .Medium
            );

            navigation.navigate(
              'BookingForm',
              {
                pujaId: selectedPuja.id,
                categoryId:
                  selectedPuja.categoryId,
                subcategoryId:
                  selectedPuja.subcategoryId,
              }
            );
          }}
          style={{
            backgroundColor: '#7f1d1d',

            borderRadius: 16,

            minHeight: 54,

            paddingHorizontal: 18,

            flexDirection: 'row',

            alignItems: 'center',

            justifyContent:
              'space-between',
          }}
        >
          <View>
            <Text
              style={{
                color: '#f2d7b1',
                fontSize: 9,
                fontWeight: '700',
              }}
            >
              पूजा बुक करें
            </Text>

            <Text
              style={{
                color: '#fffaf2',
                fontSize: 16,
                fontWeight: '900',
                marginTop: 1,
              }}
            >
              अभी बुकिंग करें
            </Text>
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
              size={19}
              color="#7f1d1d"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}