import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { Pressable } from '@/components/pressable';
import {
  Box,
  Field,
  Header,
  NutrientGrid,
  PrimaryButton,
  ValueInput,
} from './meals-ui';
import { splitDetail, useMeals } from './meals-store';

type NutrientKey = 'energy' | 'protein' | 'carbs' | 'fat';

export function ReviewItemScreen() {
  const insets = useSafeAreaInsets();
  const { addItem, updateItem, items, history } = useMeals();
  const params = useLocalSearchParams<{ name?: string; description?: string; log?: string; id?: string }>();
  const existing = (params.log ? history.find((meal) => meal.id === params.log)?.items : items)?.find((item) => item.id === params.id);
  const portion = existing ? splitDetail(existing.detail) : null;
  const [name, setName] = useState(existing?.name ?? params.name ?? '');
  const [unit, setUnit] = useState<'g' | 'ml'>(portion?.unit === 'ml' ? 'ml' : 'g');
  const [amount, setAmount] = useState(portion ? String(portion.amount) : '');
  const [draft, setDraft] = useState<Record<NutrientKey, string>>(existing ? { energy: String(existing.kcal), protein: String(existing.macros.protein), carbs: String(existing.macros.carbs), fat: String(existing.macros.fat) } : { energy: '', protein: '', carbs: '', fat: '' });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);

  async function handleAdd() {
    if (saving) return;
    if (params.id && !existing) { setError('This item is no longer available. Return to the meal.'); return; }
    if (!name.trim() || !amount.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0 || Object.values(draft).some((value) => !value.trim() || !Number.isFinite(Number(value)) || Number(value) < 0)) {
      setError('Enter a name, positive amount and all nutrition values (zero is allowed).'); return;
    }
    setSaving(true); setError(null);
    try {
      const item = {
        id: existing?.id ?? `manual-${Date.now()}`, name: name.trim(), detail: `${Number(amount)}${unit} · reviewed`, kcal: Number(draft.energy),
        macros: { protein: Number(draft.protein), carbs: Number(draft.carbs), fat: Number(draft.fat) }, glyph: unit === 'ml' ? 'droplet' as const : 'wheat' as const,
      };
      if (existing) await updateItem(existing.id, item, params.log);
      else await addItem(item, params.log);
      if (!active.current) return;
      if (existing || params.log) router.back();
      else router.navigate('/meal');
    } catch (cause) { if (active.current) setError(cause instanceof Error ? cause.message : 'Could not save item.'); }
    finally { if (active.current) setSaving(false); }
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
        <Text style={styles.title}>{existing ? 'Review item' : 'Manual item'}</Text>
        <Text style={styles.subtitle}>{existing ? 'Review and correct the portion and nutrition before logging.' : 'Enter nutrition from a food label or your measured recipe.'}</Text>
      </View>

      <View style={styles.estimateBar}>
        <Text style={styles.estimateTag}>{existing ? 'Editable nutrition · review required' : 'Manual entry · no AI estimate'}</Text>
        <Text style={styles.estimateCategory}>Full portion values</Text>
      </View>

      <Field label="Food or drink name">
        <Box>
          <ValueInput value={name} onChangeText={setName} keyboardType="default" />
        </Box>
      </Field>

      <Field label="Amount">
        <Box>
          <ValueInput value={amount} onChangeText={setAmount} unit={unit} />
        </Box>
      </Field>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        {(['g', 'ml'] as const).map((value) => <Pressable key={value} accessibilityRole="radio" accessibilityState={{ selected: unit === value }} onPress={() => setUnit(value)} style={{ padding: 12 }}><Text style={{ color: unit === value ? C.accent : C.text }}>{value}</Text></Pressable>)}
      </View>
      {error ? <Text accessibilityRole="alert" style={styles.footnote}>{error}</Text> : null}

      <View style={styles.nutrientHeader}>
        <Text style={styles.nutrientTitle}>Nutrition for the full portion</Text>
        <Text style={styles.nutrientAction}>Editable</Text>
      </View>

      <NutrientGrid
        values={draft}
        onChange={(key, value) => setDraft((prev) => ({ ...prev, [key]: value }))}
        units={{ energy: 'kcal', protein: 'g', carbs: 'g', fat: 'g' }}
      />

      <Text style={styles.footnote}>
        {params.description ? `${params.description}. ` : ''}Enter values for the entire portion, not per 100 {unit}.
      </Text>

      <Text style={styles.centerNote}>Review the name, amount, and nutrients above.</Text>

      <PrimaryButton label={saving ? 'Saving…' : existing ? 'Save item' : 'Add item'} disabled={saving} onPress={handleAdd} />
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
