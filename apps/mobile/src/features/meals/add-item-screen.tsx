import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import {
  Box,
  Field,
  Header,
  NutrientGrid,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  SectionTitle,
  ValueInput,
  icons,
} from './meals-ui';
import { Image } from 'expo-image';
import {
  FOOD_DB,
  estimatePortion,
  useMeals,
  type FoodEntry,
  type MealEstimate,
} from './meals-store';

type NutrientKey = 'energy' | 'protein' | 'carbs' | 'fat';

const toDraft = (estimate: MealEstimate) => ({
  energy: String(estimate.kcal),
  protein: String(estimate.protein),
  carbs: String(estimate.carbs),
  fat: String(estimate.fat),
});

export function AddItemScreen() {
  const insets = useSafeAreaInsets();
  const { addItem } = useMeals();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<FoodEntry | null>(null);
  const [amount, setAmount] = useState('180');
  const [draft, setDraft] = useState<Record<NutrientKey, string>>({
    energy: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [description, setDescription] = useState('');

  const matches = query.trim()
    ? FOOD_DB.filter((food) => food.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];
  const noMatch = query.trim().length > 0 && matches.length === 0;

  function selectFood(food: FoodEntry) {
    const estimate = estimatePortion(food, Number(amount) || 100);
    setSelected(food);
    setDraft(toDraft(estimate));
  }

  function handleAmount(next: string) {
    setAmount(next);
    if (!selected) return;
    const grams = Number(next);
    if (!Number.isFinite(grams) || grams <= 0) return;
    setDraft(toDraft(estimatePortion(selected, grams)));
  }

  function handleAdd() {
    if (!selected) return;
    const grams = Number(amount) || 0;
    addItem({
      id: `${selected.id}-${Date.now()}`,
      name: selected.name,
      detail: `${grams}${selected.unit} · cooked`,
      kcal: Number(draft.energy) || 0,
      macros: {
        protein: Number(draft.protein) || 0,
        carbs: Number(draft.carbs) || 0,
        fat: Number(draft.fat) || 0,
      },
      glyph: selected.glyph,
    });
    router.back();
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <Header label="Lunch" onBack={() => router.back()} action="Cancel" onAction={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.title}>{noMatch ? 'Add Item' : 'Add Item · Database'}</Text>
        <Text style={styles.subtitle}>
          {noMatch
            ? 'Search the food and drinks database.'
            : selected
              ? 'Search the database, add a portion, and review the nutrition estimate before logging.'
              : 'Search for a food, then add its portion.'}
        </Text>
      </View>

      {selected ? (
        <Field label="Search food">
          <Box>
            <Text style={styles.selectedName}>{selected.name}</Text>
            <Image source={icons.check} style={styles.checkIcon} contentFit="contain" />
          </Box>
        </Field>
      ) : (
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search food"
        />
      )}

      {!selected && query.trim().length > 0 && !noMatch ? (
        <>
          <SectionTitle title="Database results" action={`${matches.length} matches`} />

          {matches.map((food) => (
            <View key={food.id} style={styles.resultCard}>
              <View style={styles.resultTop}>
                <Text style={styles.resultName}>{food.name}</Text>
                <Pressable onPress={() => selectFood(food)} hitSlop={8}>
                  <Text style={styles.resultSelect}>Select</Text>
                </Pressable>
              </View>
              <Text style={styles.resultServing}>{food.serving}</Text>
              <Text style={styles.resultMacros}>
                {food.per100.kcal} kcal · P {food.per100.protein}g · C {food.per100.carbs}g · F{' '}
                {food.per100.fat}g
              </Text>
            </View>
          ))}

          <View style={styles.hintCard}>
            <Text style={styles.hintTitle}>Choose a food first</Text>
            <Text style={styles.hintNote}>
              Next, enter the amount in grams and review the estimate before adding it to lunch.
            </Text>
          </View>
        </>
      ) : null}

      {!selected && !query.trim() ? (
        <View style={styles.hintCard}>
          <Text style={styles.hintTitle}>Search the database</Text>
          <Text style={styles.hintNote}>
            Type a food name to see matches, then pick a portion weight.
          </Text>
        </View>
      ) : null}

      {noMatch ? (
        <>
          <View style={[styles.hintCard, styles.noMatchCard]}>
            <Image source={icons.searchLg} style={styles.noMatchIcon} contentFit="contain" />
            <Text style={styles.noMatchTitle}>No database match</Text>
            <Text style={styles.hintNote}>Try a different name, or get an estimate to review.</Text>
          </View>

          <Field label="Description · optional">
            <Box style={styles.descriptionBox}>
              <ValueInput
                value={description}
                onChangeText={setDescription}
                placeholder="250 ml oat milk latte, no added sugar"
                keyboardType="default"
              />
            </Box>
          </Field>

          <Text style={styles.footnote}>
            Search with AI sends the name and description to the cloud for an editable nutrition
            estimate.
          </Text>

          <PrimaryButton
            label="Search with AI"
            onPress={() =>
              router.push(
                `/review-item?name=${encodeURIComponent(query.trim())}&description=${encodeURIComponent(description)}`,
              )
            }
          />
          <SecondaryButton label="Search again" onPress={() => setQuery('')} />
          <Text style={styles.centerNote}>Review and correct the estimate before adding.</Text>
        </>
      ) : null}

      {selected ? (
        <>
          <Field label="Portion weight">
            <Box>
              <ValueInput value={amount} onChangeText={handleAmount} unit={selected.unit} />
            </Box>
          </Field>

          <SectionTitle title="Nutrition estimate" action="Manual" />

          <NutrientGrid
            values={draft}
            onChange={(key, value) => setDraft((prev) => ({ ...prev, [key]: value }))}
            units={{ energy: 'kcal', protein: 'g', carbs: 'g', fat: 'g' }}
          />

          <Text style={styles.footnote}>
            Per 100 {selected.unit}: {selected.per100.kcal} kcal · {selected.per100.protein} g protein
            · {selected.per100.carbs} g carbs · {selected.per100.fat} g fat. Edit values as needed.
          </Text>

          <PrimaryButton label="Add Item" onPress={handleAdd} />
          <SecondaryButton
            label="Search with AI"
            onPress={() =>
              router.push(`/review-item?name=${encodeURIComponent(selected.name)}`)
            }
          />
        </>
      ) : null}
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
    lineHeight: 19,
    color: C.textMuted,
  },
  selectedName: {
    flex: 1,
    fontSize: 15,
    color: C.text,
  },
  checkIcon: {
    width: 19,
    height: 19,
  },
  resultCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  resultSelect: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
  resultServing: {
    fontSize: 11,
    color: C.textMuted,
  },
  resultMacros: {
    fontSize: 10,
    color: C.textMuted,
  },
  hintCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  hintNote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  noMatchCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    paddingVertical: 24,
  },
  noMatchIcon: {
    width: 26,
    height: 26,
    opacity: 0.6,
  },
  noMatchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.text,
  },
  descriptionBox: {
    alignItems: 'flex-start',
    minHeight: 76,
  },
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  centerNote: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: 'center',
  },
});
