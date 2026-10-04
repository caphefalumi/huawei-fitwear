import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useAppTheme, softShadow } from '../../theme';

interface StatCardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  badge?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  subtitle,
  children,
  style,
  badge
}) => {
  const { theme, radii, spacing } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderRadius: radii.lg,
          padding: spacing.lg,
          ...(theme.isDark
            ? null
            : Platform.OS === 'web'
            ? softShadow
            : { ...softShadow, shadowColor: theme.shadow })
        },
        style
      ]}
    >
      {(title || badge || subtitle) ? (
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {title ? (
              <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            ) : null}
            {subtitle ? (
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {badge ? <View style={styles.badgeContainer}>{badge}</View> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginVertical: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  titleContainer: {
    flex: 1
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  badgeContainer: {
    marginLeft: 8
  }
});
