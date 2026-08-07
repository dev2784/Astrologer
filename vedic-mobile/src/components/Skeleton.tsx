import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, className = '' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width: width as any,
        height,
        borderRadius,
        opacity,
      }}
      className={`bg-slate-200 ${className}`}
    />
  );
}

// Preset layout for Panchang/Muhurat loading state
export function CardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View className="px-4 pt-6">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="bg-white p-5 rounded-2xl border border-slate-100 mb-4 shadow-sm">
          <Skeleton width="60%" height={22} className="mb-3" />
          <Skeleton width="40%" height={16} className="mb-4" />
          <View className="flex-row justify-between pt-2 border-t border-slate-100">
            <Skeleton width="30%" height={18} />
            <Skeleton width="30%" height={18} />
          </View>
        </View>
      ))}
    </View>
  );
}