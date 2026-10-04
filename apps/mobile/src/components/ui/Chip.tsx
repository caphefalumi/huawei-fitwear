import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  style
}) => {
  const { theme, radii } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.surfaceElevated,
          borderColor: selected ? theme.primary : theme.border,
          borderRadius: radii.full,
          opacity: pressed ? 0.8 : 1
        },
        style
      ]}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? theme.onPrimary : theme.textSecondary}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            color: selected ? theme.onPrimary : theme.text
          }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginRight: 8,
    marginVertical: 4
  },
  icon: {
    marginRight: 6
  },
  text: {
    fontSize: 13,
    fontWeight: '600'
  }
});
