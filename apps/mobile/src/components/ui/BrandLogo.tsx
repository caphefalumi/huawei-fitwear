import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { useAppTheme } from '../../theme';

interface BrandLogoProps {
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 32 }) => {
  const { theme } = useAppTheme();
  return (
    <View style={{ width: size, height: size }}>
      <Svg viewBox="0 0 100 100" width={size} height={size} fill="none">
        <Rect width="100" height="100" rx="24" fill={theme.primary} />
        <Path
          d="M28 68V32L50 56L72 32V68"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="50" cy="24" r="5" fill={theme.isDark ? '#93C5FD' : '#60A5FA'} />
      </Svg>
    </View>
  );
};
