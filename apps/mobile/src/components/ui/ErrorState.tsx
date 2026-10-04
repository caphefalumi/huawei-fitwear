import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';
import { SecondaryButton } from './SecondaryButton';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong loading this data.',
  onRetry
}) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: theme.overTargetBg, borderColor: theme.overTarget }
        ]}
      >
        <Ionicons name="alert-circle" size={36} color={theme.overTarget} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Unable to Load</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {message}
      </Text>
      {onRetry && (
        <SecondaryButton
          label="Try Again"
          icon="refresh"
          onPress={onRetry}
          style={styles.retryButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginVertical: 24
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 260
  },
  retryButton: {
    minWidth: 140
  }
});
