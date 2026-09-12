import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
} from 'react-native';

import {
  useRoute,
  useNavigation,
  RouteProp,
} from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ChevronRight,
  Clock3,
  Flame,
  MapPin,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { usePujaStore } from '../store/usePujaStore';
import { HomeStackParamList } from '../navigation/types';

type PujaListRouteProp =
  RouteProp<HomeStackParamList, 'PujaList'>;

type NavigationProp =
  NativeStackNavigationProp<
    HomeStackParamList,
    'PujaList'
  >;

export default function PujaListScreen() {
  const route = useRoute<PujaListRouteProp>();

  const navigation =
    useNavigation<NavigationProp>();

  const { subcategoryId, title } =
    route.params;

  const {
    pujas,
    isLoading,
    error,
    fetchPujas,
  } = usePujaStore();

  const screenAnim =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPujas(subcategoryId as string);

    screenAnim.setValue(0);

    Animated.timing(screenAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start();
  }, [subcategoryId]);

  const screenStyle = {
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

  if (isLoading) {
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
          पूजा सेवाएं लोड हो रही हैं...
        </Text>
      </View>
    );
  }

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
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: '#f8ead7',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Flame
            size={26}
            color="#7f1d1d"
          />
        </View>

        <Text
          style={{
            marginTop: 14,
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
            fetchPujas(
              subcategoryId as string
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
              fontSize: 13,
            }}
          >
            फिर से प्रयास करें
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fffaf2',
      }}
    >
      {/* HEADER */}

      <View
        style={{
          backgroundColor: '#7f1d1d',
          paddingHorizontal: 18,
          paddingTop: 22,
          paddingBottom: 22,

          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
      >
        <Text
          style={{
            color: '#fffaf2',
            fontWeight: '900',
            fontSize: 22,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: '#f2d7b1',
            fontSize: 11,
            marginTop: 4,
          }}
        >
          अपनी आवश्यकता के अनुसार पूजा चुनें
        </Text>

        <View
          style={{
            marginTop: 12,
            alignSelf: 'flex-start',
            backgroundColor:
              'rgba(255,247,237,0.12)',

            paddingHorizontal: 10,
            paddingVertical: 5,

            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: '#fff7ed',
              fontSize: 10,
              fontWeight: '800',
            }}
          >
            {pujas.length} पूजा विकल्प
          </Text>
        </View>
      </View>

      <Animated.View
        style={[
          {
            flex: 1,
          },
          screenStyle,
        ]}
      >
        <FlatList
          data={pujas}
          keyExtractor={(
            item,
            index
          ) =>
            item?.id?.toString() ||
            index.toString()
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 28,
          }}
          renderItem={({
            item,
            index,
          }) => (
            <Animated.View
              style={{
                opacity: screenAnim,

                transform: [
                  {
                    translateY:
                      screenAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          15 + index * 2,
                          0,
                        ],
                      }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  Haptics.impactAsync(
                    Haptics
                      .ImpactFeedbackStyle
                      .Light
                  );

                  navigation.navigate(
                    'PujaDetails',
                    {
                      pujaId: item.id,
                    }
                  );
                }}
                style={{
                  backgroundColor:
                    '#fffdf8',

                  borderRadius: 24,

                  overflow: 'hidden',

                  marginBottom: 18,

                  borderWidth: 1,
                  borderColor:
                    '#eadfce',

                  shadowColor:
                    '#7f1d1d',

                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },

                  shadowOpacity: 0.07,

                  shadowRadius: 12,

                  elevation: 4,
                }}
              >
                {/* IMAGE */}

                <View
                  style={{
                    height: 175,
                    backgroundColor:
                      '#f5ead8',

                    position: 'relative',
                  }}
                >
                  {item.imageUrl ? (
                    <Image
                      source={{
                        uri: item.imageUrl,
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
                        size={44}
                        color="#7f1d1d"
                        strokeWidth={1.5}
                      />
                    </View>
                  )}

                  {/* TOP BADGE */}

                  <View
                    style={{
                      position:
                        'absolute',

                      top: 12,
                      left: 12,

                      backgroundColor:
                        'rgba(255,250,242,0.95)',

                      paddingHorizontal: 10,
                      paddingVertical: 5,

                      borderRadius: 999,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          '#7f1d1d',

                        fontWeight:
                          '900',

                        fontSize: 10,
                      }}
                    >
                      {item.tag ||
                        'विशेष पूजा'}
                    </Text>
                  </View>

                  {/* PRICE BADGE */}

                  {item.charges && (
                    <View
                      style={{
                        position:
                          'absolute',

                        top: 12,
                        right: 12,

                        backgroundColor:
                          '#7f1d1d',

                        paddingHorizontal: 11,
                        paddingVertical: 6,

                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            '#fffaf2',

                          fontWeight:
                            '900',

                          fontSize: 11,
                        }}
                      >
                        {String(
                          item.charges
                        ).includes('₹')
                          ? item.charges
                          : `₹ ${item.charges}`}
                      </Text>
                    </View>
                  )}
                </View>

                {/* CONTENT */}

                <View
                  style={{
                    padding: 16,
                  }}
                >
                  {/* TITLE */}

                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#1c1917',

                      fontWeight: '900',

                      fontSize: 18,

                      lineHeight: 23,
                    }}
                  >
                    {item.titleHi?.trim() ||
                      item.titleEn?.trim()}
                  </Text>

                  {item.titleEn && (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#78716c',

                        fontSize: 11,

                        marginTop: 4,
                      }}
                    >
                      {item.titleEn?.trim()}
                    </Text>
                  )}

                  {/* INFO ROW */}

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      marginTop: 14,

                      flexWrap: 'wrap',
                    }}
                  >
                    {/* LOCATION */}

                    {(item.placeOfPuja ||
                      item.location) && (
                      <View
                        style={{
                          flexDirection:
                            'row',

                          alignItems:
                            'center',

                          backgroundColor:
                            '#fff1dd',

                          paddingHorizontal: 9,
                          paddingVertical: 6,

                          borderRadius: 10,

                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        <MapPin
                          size={13}
                          color="#9a3412"
                        />

                        <Text
                          numberOfLines={1}
                          style={{
                            marginLeft: 5,

                            color:
                              '#57534e',

                            fontSize: 10,

                            fontWeight:
                              '700',

                            maxWidth: 120,
                          }}
                        >
                          {item.placeOfPuja ||
                            item.location}
                        </Text>
                      </View>
                    )}

                    {/* DURATION */}

                    {item.estimatedTime && (
                      <View
                        style={{
                          flexDirection:
                            'row',

                          alignItems:
                            'center',

                          backgroundColor:
                            '#f4efe8',

                          paddingHorizontal: 9,
                          paddingVertical: 6,

                          borderRadius: 10,

                          marginBottom: 8,
                        }}
                      >
                        <Clock3
                          size={13}
                          color="#7f1d1d"
                        />

                        <Text
                          style={{
                            marginLeft: 5,

                            color:
                              '#57534e',

                            fontSize: 10,

                            fontWeight:
                              '700',
                          }}
                        >
                          {item.estimatedTime}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* BOTTOM */}

                  <View
                    style={{
                      marginTop: 8,

                      paddingTop: 14,

                      borderTopWidth: 1,
                      borderTopColor:
                        '#efe3d4',

                      flexDirection: 'row',
                      alignItems: 'center',

                      justifyContent:
                        'space-between',
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
                          color: '#a8a29e',
                          fontSize: 10,
                          fontWeight: '700',
                        }}
                      >
                        अधिक जानकारी
                      </Text>

                      <Text
                        style={{
                          color: '#7f1d1d',
                          fontWeight: '900',
                          fontSize: 12,
                          marginTop: 2,
                        }}
                      >
                        पूजा विवरण देखें
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 42,
                        height: 42,

                        borderRadius: 21,

                        backgroundColor:
                          '#7f1d1d',

                        alignItems: 'center',
                        justifyContent:
                          'center',
                      }}
                    >
                      <ChevronRight
                        size={19}
                        color="#fffaf2"
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          ListEmptyComponent={
            <View
              style={{
                alignItems: 'center',
                paddingTop: 70,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,

                  borderRadius: 30,

                  backgroundColor:
                    '#f8ead7',

                  alignItems: 'center',
                  justifyContent:
                    'center',
                }}
              >
                <Flame
                  size={26}
                  color="#7f1d1d"
                />
              </View>

              <Text
                style={{
                  marginTop: 14,

                  color: '#57534e',

                  fontWeight: '800',

                  fontSize: 14,
                }}
              >
                कोई पूजा उपलब्ध नहीं
              </Text>

              <Text
                style={{
                  color: '#a8a29e',

                  fontSize: 11,

                  marginTop: 4,
                }}
              >
                कृपया दूसरी श्रेणी चुनें
              </Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
}