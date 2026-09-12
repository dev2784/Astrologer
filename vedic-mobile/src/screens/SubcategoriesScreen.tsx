import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
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
  ChevronRight,
  Flame,
} from 'lucide-react-native';

import * as Haptics from 'expo-haptics';

import { HomeStackParamList } from '../navigation/types';

type SubcategoriesRouteProp =
  RouteProp<HomeStackParamList, 'Subcategories'>;

type NavigationProp =
  NativeStackNavigationProp<
    HomeStackParamList,
    'Subcategories'
  >;

export default function SubcategoriesScreen() {
  const route = useRoute<SubcategoriesRouteProp>();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NavigationProp>();

  const { category } = route.params;

  const screenAnim =
    useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(screenAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, []);

  const screenStyle = {
    opacity: screenAnim,
    transform: [
      {
        translateY: screenAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
    ],
  };

  return (
    <View
      style={{
        paddingTop: insets.top + 16,
      }}
      className="bg-[#971f1f] px-5 pb-7 rounded-b-[34px]"
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
            fontSize: 22,
            fontWeight: '900',
          }}
        >
          {category.nameHi?.trim() ||
            category.nameEn?.trim()}
        </Text>

        {category.nameEn && (
          <Text
            style={{
              color: '#f2d7b1',
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {category.nameEn?.trim()}
          </Text>
        )}

        <View
          style={{
            marginTop: 12,

            backgroundColor:
              'rgba(255,247,237,0.12)',

            alignSelf: 'flex-start',

            paddingHorizontal: 10,
            paddingVertical: 5,

            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: '#fff7ed',
              fontWeight: '800',
              fontSize: 10,
            }}
          >
            {category.subcategories?.length || 0} विकल्प
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
          data={category.subcategories}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 20,
            paddingBottom: 28,
          }}
          renderItem={({ item, index }) => (
            <Animated.View
              style={{
                opacity: screenAnim,

                transform: [
                  {
                    translateY:
                      screenAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          12 + index * 2,
                          0,
                        ],
                      }),
                  },
                ],
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
                    'PujaList',
                    {
                      subcategoryId: item.id,
                      title:
                        item.nameHi?.trim() ||
                        item.nameEn?.trim(),
                    }
                  );
                }}
                style={{
                  backgroundColor: '#fffdf8',

                  borderRadius: 20,

                  borderWidth: 1,
                  borderColor: '#eadfce',

                  marginBottom: 14,

                  padding: 16,

                  flexDirection: 'row',
                  alignItems: 'center',

                  shadowColor: '#7f1d1d',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.05,
                  shadowRadius: 9,

                  elevation: 2,
                }}
              >
                {/* ICON */}

                <View
                  style={{
                    width: 46,
                    height: 46,

                    borderRadius: 23,

                    backgroundColor: '#f7e8d8',

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Flame
                    size={20}
                    color="#7f1d1d"
                    strokeWidth={1.9}
                  />
                </View>

                {/* TEXT */}

                <View
                  style={{
                    flex: 1,
                    marginLeft: 13,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#1c1917',

                      fontWeight: '900',

                      fontSize: 15,

                      lineHeight: 20,
                    }}
                  >
                    {item.nameHi?.trim() ||
                      item.nameEn?.trim()}
                  </Text>

                  {item.nameEn && (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#78716c',

                        fontSize: 11,

                        marginTop: 4,
                      }}
                    >
                      {item.nameEn?.trim()}
                    </Text>
                  )}
                </View>

                {/* ARROW */}

                <View
                  style={{
                    width: 34,
                    height: 34,

                    borderRadius: 17,

                    backgroundColor: '#7f1d1d',

                    alignItems: 'center',
                    justifyContent: 'center',

                    marginLeft: 10,
                  }}
                >
                  <ChevronRight
                    size={17}
                    color="#fffaf2"
                  />
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
                  width: 58,
                  height: 58,

                  borderRadius: 29,

                  backgroundColor: '#f8ead7',

                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Flame
                  size={25}
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
                कोई उपश्रेणी उपलब्ध नहीं
              </Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
}