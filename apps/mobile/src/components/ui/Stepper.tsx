import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../theme';

interface StepperProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  label,
  unit
}) => {
  const { theme, radii } = useAppTheme();

  const handleDecrement = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const handleIncrement = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text> : null}
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.surfaceElevated,
            borderColor: theme.border,
            borderRadius: radii.lg
          }
        ]}
      >
        <Pressable
          onPress={handleDecrement}
          disabled={value <= min}
          style={({ pressed }) => [
            styles.button,
            { opacity: value <= min ? 0.3 : pressed ? 0.7 : 1 }
          ]}
          accessibilityRole="button"
          accessibilityLabel="Decrease"
        >
          <Ionicons name="remove" size={20} color={theme.text} />
        </Pressable>

        <View style={styles.valueContainer}>
          <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
          {unit ? <Text style={[styles.unit, { color: theme.textSecondary }]}>{unit}</Text> : null}
        </View>

        <Pressable
          onPress={handleIncrement}
          disabled={value >= max}
          style={({ pressed }) => [
            styles.button,
            { opacity: value >= max ? 0.3 : pressed ? 0.7 : 1 }
          ]}
          accessibilityRole="button"
          accessibilityLabel="Increase"
        >
          <Ionicons name="add" size={20} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    minHeight: 48,
    paddingHorizontal: 4
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    flex: 1
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4
  }
});
