import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme, onColor } from '../../theme';

interface MacroBarProps {
  label: string;
  letter: 'P' | 'C' | 'F';
  currentGrams: number;
  targetGrams: number;
  color: string;
}

export const MacroBar: React.FC<MacroBarProps> = ({
  label,
  letter,
  currentGrams,
  targetGrams,
  color
}) => {
  const { theme, radii } = useAppTheme();
  const safeTarget = Math.max(targetGrams, 1);
  const percentage = Math.min(Math.max(currentGrams / safeTarget, 0), 1);

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.letterBadge, { backgroundColor: color, borderRadius: radii.sm }]}>
            <Text style={[styles.letterText, { color: onColor(color) }]}>{letter}</Text>
          </View>
          <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        </View>

        <View style={styles.valueRow}>
          <Text style={[styles.currentValue, { color: theme.text }]}>
            {Math.round(currentGrams)}
          </Text>
          <Text style={[styles.targetValue, { color: theme.textSecondary }]}>
            /{Math.round(targetGrams)}g
          </Text>
        </View>
      </View>

      {/* Bar Track */}
      <View style={[styles.track, { backgroundColor: theme.track, borderRadius: radii.full }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.round(percentage * 100)}%`,
              backgroundColor: color,
              borderRadius: radii.full
            }
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  letterBadge: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  letterText: {
    fontSize: 11,
    fontWeight: '800'
  },
  label: {
    fontSize: 14,
    fontWeight: '600'
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  currentValue: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  targetValue: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 2,
    fontVariant: ['tabular-nums']
  },
  track: {
    height: 8,
    width: '100%',
    overflow: 'hidden'
  },
  fill: {
    height: '100%'
  }
});
