import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import type { AdherenceStatus } from '../../types/types';

interface StatusBadgeProps {
  status: AdherenceStatus;
  size?: 'small' | 'medium';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium'
}) => {
  const { theme, radii } = useAppTheme();

  const config = {
    ON_TRACK: {
      label: 'On Track',
      icon: 'checkmark-circle' as const,
      color: theme.onTrack,
      bgColor: theme.onTrackBg
    },
    ALMOST_THERE: {
      label: 'Almost There',
      icon: 'alert-circle' as const,
      color: theme.almostThere,
      bgColor: theme.almostThereBg
    },
    OVER_TARGET: {
      label: 'Over Target',
      icon: 'warning' as const,
      color: theme.overTarget,
      bgColor: theme.overTargetBg
    }
  }[status] || {
    label: 'On Track',
    icon: 'checkmark-circle' as const,
    color: theme.onTrack,
    bgColor: theme.onTrackBg
  };

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          borderRadius: radii.full,
          paddingVertical: isSmall ? 3 : 5,
          paddingHorizontal: isSmall ? 8 : 12
        }
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSmall ? 13 : 16}
        color={config.color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          {
            color: config.color,
            fontSize: isSmall ? 11 : 13
          }
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  icon: {
    marginRight: 5
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3
  }
});
