import { StyleSheet, Text, View } from 'react-native';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';

type RadioListProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
};

/** Label on the left, radio on the right; tapping a row selects it. */
export function RadioList<T extends string>({ options, value, onChange }: RadioListProps<T>) {
  return (
    <View>
      {options.map((option, index) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            style={[styles.row, index < options.length - 1 && styles.rowDivider]}
            onPress={() => onChange(option)}>
            <Text style={styles.label}>{option}</Text>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active ? <View style={styles.dot} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  label: {
    fontSize: 15,
    color: C.text,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: C.accent,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: C.accent,
  },
});
