import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'normal' | 'large';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
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
  const minHeight = isLarge ? 54 : 48;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? theme.neutralFill : theme.primary,
          ...(Platform.OS !== 'web' ? { shadowColor: theme.shadow } : null),
          borderRadius: radii.full,
          minHeight,
          opacity: pressed ? 0.85 : 1
        },
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={theme.onPrimary} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={isLarge ? 22 : 18}
              color={disabled ? theme.textMuted : theme.onPrimary}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.text,
              {
                color: disabled ? theme.textMuted : theme.onPrimary,
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
    marginVertical: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      },
      default: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      }
    })
  },
  icon: {
    marginRight: 8
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2
  }
});
