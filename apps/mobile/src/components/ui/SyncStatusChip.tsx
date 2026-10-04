import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import type { ConnectionStatus } from '../../types/types';

interface SyncStatusChipProps {
  status: ConnectionStatus;
  pendingCount?: number;
  onPress?: () => void;
}

export const SyncStatusChip: React.FC<SyncStatusChipProps> = ({
  status,
  pendingCount = 0,
  onPress
}) => {
  const { theme, radii } = useAppTheme();

  const config = {
    connected: {
      label: 'Watch synced just now',
      color: theme.onTrack,
      icon: 'watch' as const,
      dot: true
    },
    syncing: {
      label: 'Syncing...',
      color: theme.info,
      icon: 'sync' as const,
      dot: true
    },
    offline: {
      label: pendingCount > 0 ? `Waiting for watch (${pendingCount})` : 'Waiting for watch',
      color: theme.warning,
      icon: 'time-outline' as const,
      dot: true
    },
    not_paired: {
      label: 'Watch not connected. Tap to fix',
      color: theme.error,
      icon: 'alert-circle-outline' as const,
      dot: true
    },
    error: {
      label: 'Watch not connected. Tap to fix',
      color: theme.error,
      icon: 'alert-circle' as const,
      dot: true
    }
  }[status] || {
    label: 'Watch synced',
    color: theme.onTrack,
    icon: 'watch' as const,
    dot: true
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={config.label}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: theme.surfaceElevated,
          borderColor: theme.border,
          borderRadius: radii.full,
          opacity: pressed ? 0.8 : 1
        }
      ]}
    >
      {config.dot && (
        <View style={[styles.dot, { backgroundColor: config.color }]} />
      )}
      <Ionicons
        name={config.icon}
        size={14}
        color={config.color}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: theme.text }]}>{config.label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  icon: {
    marginRight: 6
  },
  text: {
    fontSize: 12,
    fontWeight: '600'
  }
});
