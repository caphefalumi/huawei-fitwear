import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import type { MealGlyph } from './meals-store';

export const icons = {
  back: require('@/assets/images/recovery/chevron-left.svg'),
  chevronRight: require('@/assets/images/meals/chevron-right.svg'),
  search: require('@/assets/images/meals/search.svg'),
  searchMd: require('@/assets/images/meals/search-md.svg'),
  searchLg: require('@/assets/images/meals/search-lg.svg'),
  close: require('@/assets/images/meals/x.svg'),
  closeLg: require('@/assets/images/meals/x-lg.svg'),
  check: require('@/assets/images/meals/check.svg'),
  pencil: require('@/assets/images/meals/pencil.svg'),
  utensils: require('@/assets/images/meals/utensils.svg'),
  ruler: require('@/assets/images/meals/ruler.svg'),
  zapOff: require('@/assets/images/meals/zap-off.svg'),
  switchCamera: require('@/assets/images/meals/switch-camera.svg'),
  images: require('@/assets/images/meals/images.svg'),
  weight: require('@/assets/images/meals/weight.svg'),
};

const glyphIcons: Record<MealGlyph, number> = {
  wheat: require('@/assets/images/meals/wheat.svg'),
  drumstick: require('@/assets/images/meals/drumstick.svg'),
  carrot: require('@/assets/images/meals/carrot.svg'),
  droplet: require('@/assets/images/meals/droplet.svg'),
};

export function Glyph({ glyph, size = 19 }: { glyph: MealGlyph; size?: number }) {
  return (
    <Image
      source={glyphIcons[glyph]}
      style={{ width: size, height: size }}
      contentFit="contain"
    />
  );
}

export function Field({
  label,
  children,
  style,
}: {
  label?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      {children}
    </View>
  );
}

export function Box({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.box, style]}>{children}</View>;
}

export function ValueInput({
  value,
  onChangeText,
  unit,
  placeholder,
  keyboardType = 'numeric',
  autoFocus,
}: {
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
  placeholder?: string;
  keyboardType?: 'numeric' | 'default';
  autoFocus?: boolean;
}) {
  return (
    <View style={styles.inputRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        style={styles.input}
      />
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </View>
  );
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder,
  size = 19,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder: string;
  size?: number;
}) {
  return (
    <Box style={styles.searchBox}>
      <Image
        source={size > 20 ? icons.searchMd : icons.search}
        style={{ width: size, height: size }}
        contentFit="contain"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textMuted}
        style={styles.searchInput}
        autoCapitalize="none"
      />
      {value.length > 0 ? (
        <Pressable onPress={onClear} hitSlop={10}>
          <Image source={icons.close} style={{ width: 18, height: 18 }} contentFit="contain" />
        </Pressable>
      ) : null}
    </Box>
  );
}

export function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      style={[styles.primary, disabled && styles.primaryDisabled]}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.secondary} onPress={onPress}>
      <Text style={styles.secondaryLabel}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        onPress ? (
          <Pressable onPress={onPress} hitSlop={10}>
            <Text style={styles.sectionAction}>{action}</Text>
          </Pressable>
        ) : (
          <Text style={styles.sectionAction}>{action}</Text>
        )
      ) : null}
    </View>
  );
}

/** 2×2 editable nutrient inputs used by the Database and AI Review screens. */
export function NutrientGrid({
  values,
  onChange,
  units,
}: {
  values: { energy: string; protein: string; carbs: string; fat: string };
  onChange: (key: 'energy' | 'protein' | 'carbs' | 'fat', value: string) => void;
  units: { energy: string; protein: string; carbs: string; fat: string };
}) {
  return (
    <View style={styles.grid}>
      <View style={styles.gridCell}>
        <Text style={styles.gridLabel}>Energy</Text>
        <Box>
          <ValueInput
            value={values.energy}
            onChangeText={(text) => onChange('energy', text)}
            unit={units.energy}
          />
        </Box>
      </View>
      <View style={styles.gridCell}>
        <Text style={styles.gridLabel}>Protein</Text>
        <Box>
          <ValueInput
            value={values.protein}
            onChangeText={(text) => onChange('protein', text)}
            unit={units.protein}
          />
        </Box>
      </View>
      <View style={styles.gridCell}>
        <Text style={styles.gridLabel}>Carbs</Text>
        <Box>
          <ValueInput
            value={values.carbs}
            onChangeText={(text) => onChange('carbs', text)}
            unit={units.carbs}
          />
        </Box>
      </View>
      <View style={styles.gridCell}>
        <Text style={styles.gridLabel}>Fat</Text>
        <Box>
          <ValueInput
            value={values.fat}
            onChangeText={(text) => onChange('fat', text)}
            unit={units.fat}
          />
        </Box>
      </View>
    </View>
  );
}

export function Header({
  label,
  onBack,
  action,
  onAction,
}: {
  label: string;
  onBack: () => void;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.headerRow}>
      <Pressable style={styles.headerBack} onPress={onBack} hitSlop={10}>
        <Image source={icons.back} style={styles.headerBackIcon} contentFit="contain" />
        <Text style={styles.headerLabel}>{label}</Text>
      </Pressable>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={styles.headerAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    color: C.text,
  },
  unit: {
    fontSize: 13,
    color: C.textMuted,
  },
  searchBox: {
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    fontSize: 15,
    color: C.text,
  },
  primary: {
    height: 52,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryDisabled: {
    backgroundColor: C.card,
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onAccent,
  },
  secondary: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.accent,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
  },
  sectionAction: {
    fontSize: 12,
    fontWeight: '500',
    color: C.accent,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridCell: {
    width: '48%',
    gap: 6,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerBackIcon: {
    width: 18,
    height: 18,
  },
  headerLabel: {
    fontSize: 13,
    color: C.accent,
  },
  headerAction: {
    fontSize: 13,
    fontWeight: '600',
    color: C.accent,
  },
});
