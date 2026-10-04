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
      label: 'Watch Synced',
      color: theme.connected,
      icon: 'watch' as const,
      dot: true
    },
    syncing: {
      label: 'Syncing...',
      color: theme.syncing,
      icon: 'sync' as const,
      dot: true
    },
    offline: {
      label: pendingCount > 0 ? `Offline (${pendingCount} pending)` : 'Watch Offline',
      color: theme.offline,
      icon: 'cloud-offline' as const,
      dot: false
    },
    not_paired: {
      label: 'Pair Watch',
      color: theme.textSecondary,
      icon: 'add-circle-outline' as const,
      dot: false
    },
    error: {
      label: 'Sync Error',
      color: theme.error,
      icon: 'alert-circle' as const,
      dot: true
    }
  }[status] || {
    label: 'Watch Synced',
    color: theme.connected,
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
