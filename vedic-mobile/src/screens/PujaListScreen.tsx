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

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  ChevronLeft,
  ChevronRight,
  Flame,
  MapPin,
  Clock3,
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
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const { subcategoryId, title } = route.params;

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
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, [subcategoryId]);

  const animationStyle = {
    opacity: screenAnim,
    transform: [
      {
        translateY: screenAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
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
          color="#971f1f"
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
        <Flame
          size={35}
          color="#971f1f"
        />

        <Text
          style={{
            marginTop: 14,
            color: '#971f1f',
            textAlign: 'center',
            fontWeight: '800',
          }}
        >
          {error}
        </Text>

        <TouchableOpacity
          onPress={() =>
            fetchPujas(subcategoryId as string)
          }
          style={{
            marginTop: 18,
            backgroundColor: '#971f1f',
            paddingHorizontal: 22,
            paddingVertical: 12,
            borderRadius: 14,
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
          backgroundColor: '#971f1f',

          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 24,

          borderBottomLeftRadius: 34,
          borderBottomRightRadius: 34,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={{
            width: 40,
            height: 40,

            borderRadius: 20,

            backgroundColor:
              'rgba(255,250,242,0.14)',

            alignItems: 'center',
            justifyContent: 'center',

            marginBottom: 12,
          }}
        >
          <ChevronLeft
            size={23}
            color="#fffaf2"
          />
        </TouchableOpacity>

        <Text
          numberOfLines={2}
          style={{
            color: '#fffaf2',

            fontWeight: '900',

            fontSize: 25,
            lineHeight: 33,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: '#f2d7b1',

            fontSize: 13,
            marginTop: 5,
          }}
        >
          अपनी आवश्यकता के अनुसार पूजा चुनें
        </Text>

        <View
          style={{
            marginTop: 14,

            alignSelf: 'flex-start',

            backgroundColor:
              'rgba(255,247,237,0.13)',

            paddingHorizontal: 12,
            paddingVertical: 6,

            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: '#fff7ed',

              fontSize: 12,
              fontWeight: '800',
            }}
          >
            {pujas.length} पूजा विकल्प
          </Text>
        </View>
      </View>

      {/* LIST */}

      <View
        style={[
          {
            flex: 1,
          },
        ]}
      >
        <FlatList
          data={pujas}
          keyExtractor={(item, index) =>
            item?.id?.toString() ||
            index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 110,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.86}
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
                backgroundColor: '#fffdf8',

                borderRadius: 22,

                borderWidth: 1,
                borderColor: '#eadfce',

                marginBottom: 14,

                padding: 14,

                flexDirection: 'row',
                alignItems: 'center',

                shadowColor: '#7f1d1d',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },

                shadowOpacity: 0.06,
                shadowRadius: 8,

                elevation: 2,
              }}
            >
              {/* IMAGE */}

              <View
                style={{
                  width: 88,
                  height: 88,

                  borderRadius: 18,

                  overflow: 'hidden',

                  backgroundColor: '#f7e8d8',

                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!!item.imageUrl ? (
                  <Image
                    source={{
                      uri: item.imageUrl,
                    }}
                    style={{
                      width: 88,
                      height: 88,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <Flame
                    size={31}
                    color="#971f1f"
                    strokeWidth={1.6}
                  />
                )}
              </View>

              {/* DETAILS */}

              <View
                style={{
                  flex: 1,
                  marginLeft: 14,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    color: '#1c1917',

                    fontWeight: '900',

                    fontSize: 17,
                    lineHeight: 22,
                  }}
                >
                  {item.titleHi?.trim() ||
                    item.titleEn?.trim()}
                </Text>

                {!!item.titleEn?.trim() && (
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#971f1f',

                      fontSize: 12,

                      marginTop: 3,
                    }}
                  >
                    {item.titleEn.trim()}
                  </Text>
                )}

                {/* META */}

                {(item.placeOfPuja ||
                  item.location) && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      marginTop: 8,
                    }}
                  >
                    <MapPin
                      size={13}
                      color="#78716c"
                    />

                    <Text
                      numberOfLines={1}
                      style={{
                        marginLeft: 5,

                        color: '#78716c',

                        fontSize: 11,

                        flex: 1,
                      }}
                    >
                      {item.placeOfPuja ||
                        item.location}
                    </Text>
                  </View>
                )}

                {!!item.estimatedTime && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',

                      marginTop: 5,
                    }}
                  >
                    <Clock3
                      size={13}
                      color="#78716c"
                    />

                    <Text
                      style={{
                        marginLeft: 5,

                        color: '#78716c',

                        fontSize: 11,
                      }}
                    >
                      {item.estimatedTime}
                    </Text>
                  </View>
                )}

                {!!item.charges && (
                  <Text
                    style={{
                      color: '#971f1f',

                      fontSize: 14,
                      fontWeight: '900',

                      marginTop: 7,
                    }}
                  >
                    {String(
                      item.charges
                    ).includes('₹')
                      ? item.charges
                      : `₹ ${item.charges}`}
                  </Text>
                )}
              </View>

              {/* ARROW */}

              <View
                style={{
                  width: 40,
                  height: 40,

                  borderRadius: 20,

                  backgroundColor: '#971f1f',

                  alignItems: 'center',
                  justifyContent: 'center',

                  marginLeft: 8,
                }}
              >
                <ChevronRight
                  size={19}
                  color="#fffaf2"
                />
              </View>
            </TouchableOpacity>
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

                  backgroundColor: '#f8ead7',

                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame
                  size={27}
                  color="#971f1f"
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
            </View>
          }
        />
      </View>
    </View>
  );
}