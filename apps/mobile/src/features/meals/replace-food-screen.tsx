import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { Header, SearchInput, SectionTitle } from './meals-ui';
import { FOOD_DB, estimatePortion, splitDetail, useMeals, type FoodEntry } from './meals-store';

export function ReplaceFoodScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const { items, updateItem } = useMeals();
  const current = items.find((item) => item.id === params.id);
  const [query, setQuery] = useState('');

  const matches = query.trim()
    ? FOOD_DB.filter((food) => food.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  function replace(food: FoodEntry) {
    if (!current) return;
    const amount = splitDetail(current.detail).amount || 100;
    const estimate = estimatePortion(food, amount);
    updateItem(current.id, {
      ...current,
      name: food.name,
      detail: `${amount}${food.unit} · cooked`,
      kcal: estimate.kcal,
      macros: { protein: estimate.protein, carbs: estimate.carbs, fat: estimate.fat },
      glyph: food.glyph,
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
        <Text style={styles.title}>Search food</Text>
        <Text style={styles.subtitle}>Select a replacement from the database.</Text>
      </View>

      <View style={styles.currentCard}>
        <Text style={styles.currentEyebrow}>CURRENT ITEM · NOT REPLACED YET</Text>
        <Text style={styles.currentName}>
          {current ? `${current.name} · ${current.detail}` : 'No item selected'}
        </Text>
        <Text style={styles.currentNote}>Your meal stays unchanged until you confirm.</Text>
      </View>

      <SearchInput
        value={query}
        onChangeText={setQuery}
        onClear={() => setQuery('')}
        placeholder="rice"
        size={19}
      />

      {matches.length > 0 ? (
        <>
          <SectionTitle title="Database results" action={`${matches.length} matches`} />

          {matches.map((food) => (
            <View key={food.id} style={styles.resultCard}>
              <View style={styles.resultTop}>
                <Text style={styles.resultName}>{food.name}</Text>
                <Pressable onPress={() => replace(food)} hitSlop={8}>
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
        </>
      ) : null}

      <Text style={styles.footnote}>
        Select a food, then review its amount before confirming the replacement.
      </Text>
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
  currentCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  currentEyebrow: {
    fontSize: 11,
    letterSpacing: 0.3,
    color: C.textMuted,
  },
  currentName: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  currentNote: {
    fontSize: 11,
    color: C.textMuted,
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
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
});
