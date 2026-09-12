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
  ChevronLeft,
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
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

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
          outputRange: [14, 0],
        }),
      },
    ],
  };

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
        {/* BACK BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={{
            width: 40,
            height: 40,

            borderRadius: 20,

            backgroundColor:
              'rgba(255,250,242,0.14)',

            alignItems: 'center',
            justifyContent: 'center',

            marginBottom: 14,
          }}
        >
          <ChevronLeft
            size={23}
            color="#fffaf2"
            strokeWidth={2.2}
          />
        </TouchableOpacity>

        {/* TITLE */}
        <Text
          style={{
            color: '#fffaf2',

            fontSize: 25,
            lineHeight: 34,

            fontWeight: '900',
          }}
        >
          {category.nameHi?.trim() ||
            category.nameEn?.trim()}
        </Text>

        {/* ENGLISH NAME */}
        {!!category.nameEn?.trim() && (
          <Text
            numberOfLines={2}
            style={{
              color: '#f2d7b1',

              fontSize: 13,
              lineHeight: 19,

              marginTop: 6,
            }}
          >
            {category.nameEn.trim()}
          </Text>
        )}

        {/* OPTION COUNT */}
        <View
          style={{
            marginTop: 14,

            backgroundColor:
              'rgba(255,247,237,0.12)',

            alignSelf: 'flex-start',

            paddingHorizontal: 12,
            paddingVertical: 6,

            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: '#fff7ed',
              fontWeight: '800',
              fontSize: 12,
            }}
          >
            {category.subcategories?.length || 0}{' '}
            विकल्प
          </Text>
        </View>
      </View>

      {/* SUBCATEGORY LIST */}
      <Animated.View
        style={[
          {
            flex: 1,
          },
          screenStyle,
        ]}
      >
        <FlatList
          data={category.subcategories || []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 110,
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
                          10 + index * 2,
                          0,
                        ],
                      }),
                  },
                ],
              }}
            >
              <TouchableOpacity
                activeOpacity={0.86}
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

                  borderRadius: 22,

                  borderWidth: 1,
                  borderColor: '#eadfce',

                  marginBottom: 14,

                  paddingHorizontal: 16,
                  paddingVertical: 16,

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
                {/* ICON */}
                <View
                  style={{
                    width: 52,
                    height: 52,

                    borderRadius: 26,

                    backgroundColor: '#f7e8d8',

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Flame
                    size={23}
                    color="#971f1f"
                    strokeWidth={1.9}
                  />
                </View>

                {/* TEXT */}
                <View
                  style={{
                    flex: 1,
                    marginLeft: 15,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    style={{
                      color: '#1c1917',

                      fontWeight: '900',

                      fontSize: 17,
                      lineHeight: 23,
                    }}
                  >
                    {item.nameHi?.trim() ||
                      item.nameEn?.trim()}
                  </Text>

                  {!!item.nameEn?.trim() && (
                    <Text
                      numberOfLines={1}
                      style={{
                        color: '#78716c',

                        fontSize: 13,

                        marginTop: 4,
                      }}
                    >
                      {item.nameEn.trim()}
                    </Text>
                  )}
                </View>

                {/* ARROW */}
                <View
                  style={{
                    width: 42,
                    height: 42,

                    borderRadius: 21,

                    backgroundColor: '#971f1f',

                    alignItems: 'center',
                    justifyContent: 'center',

                    marginLeft: 10,
                  }}
                >
                  <ChevronRight
                    size={20}
                    color="#fffaf2"
                    strokeWidth={2}
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
                कोई उपश्रेणी उपलब्ध नहीं
              </Text>
            </View>
          }
        />
      </Animated.View>
    </View>
  );
}