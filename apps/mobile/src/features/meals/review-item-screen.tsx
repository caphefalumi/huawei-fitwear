import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import {
  Box,
  Field,
  Header,
  NutrientGrid,
  PrimaryButton,
  ValueInput,
} from './meals-ui';
import { useMeals } from './meals-store';

const DRINK_PATTERN = /latte|coffee|tea|juice|smoothie|milk|soda|water/i;

type NutrientKey = 'energy' | 'protein' | 'carbs' | 'fat';

export function ReviewItemScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useMeals();
  const params = useLocalSearchParams<{ name?: string; description?: string }>();

  const initialName = params.name ?? 'Oat milk latte';
  const isDrink = DRINK_PATTERN.test(initialName);
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState(isDrink ? '250' : '180');
  const [draft, setDraft] = useState<Record<NutrientKey, string>>(
    isDrink
      ? { energy: '150', protein: '3', carbs: '21', fat: '6' }
      : { energy: '320', protein: '18', carbs: '30', fat: '12' },
  );

  function handleAdd() {
    addItem({
      id: `ai-${Date.now()}`,
      name,
      detail: `${amount}${isDrink ? 'ml' : 'g'} · cloud estimate`,
      kcal: Number(draft.energy) || 0,
      macros: {
        protein: Number(draft.protein) || 0,
        carbs: Number(draft.carbs) || 0,
        fat: Number(draft.fat) || 0,
      },
      glyph: isDrink ? 'droplet' : 'drumstick',
    });
    router.navigate('/meal');
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <Header label="Search" onBack={() => router.back()} action="Cancel" onAction={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.title}>Review item</Text>
        <Text style={styles.subtitle}>Estimated autofill · check before adding.</Text>
      </View>

      <View style={styles.estimateBar}>
        <Text style={styles.estimateTag}>Cloud estimate</Text>
        <Text style={styles.estimateCategory}>{isDrink ? 'Drinks' : 'Food'}</Text>
      </View>

      <Field label="Food or drink name">
        <Box>
          <ValueInput value={name} onChangeText={setName} keyboardType="default" />
        </Box>
      </Field>

      <Field label="Amount">
        <Box>
          <ValueInput value={amount} onChangeText={setAmount} unit={isDrink ? 'ml' : 'g'} />
        </Box>
      </Field>

      <View style={styles.nutrientHeader}>
        <Text style={styles.nutrientTitle}>Nutrition estimate</Text>
        <Text style={styles.nutrientAction}>Editable</Text>
      </View>

      <NutrientGrid
        values={draft}
        onChange={(key, value) => setDraft((prev) => ({ ...prev, [key]: value }))}
        units={{ energy: 'kcal', protein: 'g', carbs: 'g', fat: 'g' }}
      />

      <Text style={styles.footnote}>
        For the full {amount} {isDrink ? 'ml' : 'g'}, {params.description || 'no added sugar'}.
        Values vary by recipe; edit any field.
      </Text>

      <Text style={styles.centerNote}>Review the name, amount, and nutrients above.</Text>

      <PrimaryButton label="Add item" onPress={handleAdd} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 16,
  },
  heading: {
    gap: 6,
    marginTop: -4,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  estimateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.accentTint,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  estimateTag: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
  estimateCategory: {
    fontSize: 11,
    color: C.textMuted,
  },
  nutrientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nutrientTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
  },
  nutrientAction: {
    fontSize: 12,
    fontWeight: '500',
    color: C.accent,
  },
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  centerNote: {
    fontSize: 11,
    color: C.textMuted,
  },
});
