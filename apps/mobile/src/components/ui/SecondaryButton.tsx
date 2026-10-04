import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'normal' | 'large';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  size = 'normal'
}) => {
  const { theme, radii } = useAppTheme();

  const isLarge = size === 'large';
  const minHeight = isLarge ? 64 : 52;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? theme.neutralFill : theme.primaryContainer,
          borderColor: theme.border,
          borderRadius: radii.md,
          minHeight,
          opacity: pressed ? 0.88 : 1
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={isLarge ? 22 : 18}
              color={disabled ? theme.textMuted : theme.primary}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: disabled ? theme.textMuted : theme.primary,
                fontSize: isLarge ? 17 : 15
              },
              textStyle
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    marginVertical: 6
  },
  icon: {
    marginRight: 8
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.1
  }
});
