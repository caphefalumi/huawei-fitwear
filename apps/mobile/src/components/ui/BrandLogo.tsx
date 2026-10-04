import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

interface BrandLogoProps {
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 32 }) => {
  return (
    <View style={{ width: size, height: size }}>
      <Svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        <Rect width="100" height="100" rx="24" fill="#00796B" />
        <Path
          d="M28 68V32L50 56L72 32V68"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="50" cy="24" r="5" fill="#4FD6C4" />
      </Svg>
    </View>
  );
};
