import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LogIn, Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { api } from '../utils/api';
import { useAuthStore } from '../store/useAuthStore';

export default function WriteReviewScreen() {
  const navigation = useNavigation<any>();
  
  // 1. Pull auth state and redirect logic
  const { userToken, userData, setRedirect } = useAuthStore();

  // 2. Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Missing Field', 'Please write a comment for your review.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Adjust this endpoint to match your actual Fastify review creation route
      await api.post('/api/reviews', {
        rating,
        comment: comment.trim(),
        userName: userData?.name, // Pulled securely from Auth state
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Thank You!', 
        'Your review has been submitted and is pending approval.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert('Submission Failed', error?.response?.data?.error || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. HARD GUARD: If user is not logged in, block the form entirely
  if (!userToken || !userData) {
    return (
      <View className="flex-1 bg-amber-500 items-center justify-center px-6">
        <Text className="text-2xl font-black text-slate-900 mb-2 text-center">Login Required</Text>
        <Text className="text-slate-500 text-center mb-8">
          You must be logged in to share your experience.
        </Text>
        
        <TouchableOpacity 
          className="bg-orange-600 w-full py-4 rounded-xl flex-row items-center justify-center shadow-sm"
          onPress={() => {
            Haptics.selectionAsync();
            // SAVE THE RETURN PATH
            setRedirect({
              tab: 'HomeTab', 
              screen: 'WriteReview', 
            });
            // Send to Login
            navigation.navigate('Account');
          }}
        >
          <LogIn size={20} color="#ffffff" />
          <Text className="text-white font-bold text-lg ml-2">Log In to Review</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Authorized View: The Review Form
  return (
    <ScrollView className="flex-1 bg-stone-50 px-5 pt-6" showsVerticalScrollIndicator={false}>
      <Text className="text-2xl font-bold text-slate-800 mb-2">Write a Review</Text>
      <Text className="text-sm text-slate-500 mb-8">
        Posting publicly as <Text className="font-bold text-slate-700">{userData.name}</Text>
      </Text>

      <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <Text className="text-sm font-bold text-slate-700 mb-4 text-center">Tap to Rate</Text>
        
        {/* Interactive Star Rating */}
        <View className="flex-row justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => {
                Haptics.selectionAsync();
                setRating(star);
              }}
              className="p-1"
            >
              <Star 
                size={36} 
                color={star <= rating ? "#eab308" : "#cbd5e1"} 
                fill={star <= rating ? "#eab308" : "transparent"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-sm font-bold text-slate-500 mb-2">Your Experience</Text>
        <TextInput 
          className="bg-stone-50 p-4 rounded-xl text-slate-800 border border-stone-200 min-h-[120px]"
          placeholder="How was the Puja? Panditji's behavior? Detail your experience..."
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={comment}
          onChangeText={setComment}
        />
      </View>

      <TouchableOpacity 
        className={`rounded-xl py-4 items-center mb-10 shadow-sm ${isSubmitting ? 'bg-slate-400' : 'bg-orange-600'}`}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white font-bold text-lg">Submit Review</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}