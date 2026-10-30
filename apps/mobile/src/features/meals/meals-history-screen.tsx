import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Palette as C } from '@/constants/palette';
import { icons } from './meals-ui';
import { useMeals, type MealLog } from './meals-store';

type SortKey = 'newest' | 'kcal' | 'protein' | 'carbs' | 'fat';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest' },
  { key: 'kcal', label: 'kcal' },
  { key: 'protein', label: 'Protein' },
  { key: 'carbs', label: 'Carbs' },
  { key: 'fat', label: 'Fat' },
];

const metricOf = (item: MealLog, key: Exclude<SortKey, 'newest'>) =>
  key === 'kcal' ? item.kcal : item.macros[key];

export function MealsHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { history } = useMeals();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('newest');
  const [descending, setDescending] = useState(true);

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = history.filter((item) => item.name.toLowerCase().includes(needle));
    if (sort === 'newest') return descending ? filtered : [...filtered].reverse();
    const direction = descending ? -1 : 1;
    return [...filtered].sort((a, b) => direction * (metricOf(a, sort) - metricOf(b, sort)));
  }, [history, query, sort, descending]);

  function handleSort(next: SortKey) {
    if (next === sort) setDescending((prev) => !prev);
    else {
      setSort(next);
      setDescending(true);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <View style={styles.heading}>
        <Text style={styles.title}>Meals</Text>
        <Text style={styles.subtitle}>Your logged meals</Text>
      </View>

      <View style={styles.search}>
        <Image source={icons.searchMd} style={styles.searchIcon} contentFit="contain" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search meals"
          placeholderTextColor={C.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortsScroll}
        contentContainerStyle={styles.sorts}>
        {SORTS.map((option) => {
          const active = option.key === sort;
          return (
            <Pressable
              key={option.key}
              style={[styles.sortChip, active && styles.sortChipActive]}
              onPress={() => handleSort(option.key)}>
              <Text style={[styles.sortLabel, active && styles.sortLabelActive]}>
                {option.label}
                {active ? (descending ? ' ↓' : ' ↑') : ''}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {items.length === 0 ? (
        <Text style={styles.empty}>No meals match “{query.trim()}”.</Text>
      ) : (
        items.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/meal?log=${item.id}`)}>
            <Image
              source={require('@/assets/images/meals/meal-photo.png')}
              style={styles.photo}
              contentFit="cover"
            />
            <View style={styles.copy}>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.date}>
                {item.date}
                {sort === 'newest' ? ` · ${item.time}` : ''}
                {sort !== 'newest' && sort !== 'kcal'
                  ? ` · ${metricOf(item, sort)} g ${sort}`
                  : ''}
              </Text>
            </View>
            <Text style={styles.kcal}>{item.kcal} kcal</Text>
          </Pressable>
        ))
      )}
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
    gap: 14,
  },
  heading: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
  },
  subtitle: {
    fontSize: 12,
    color: C.textMuted,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  searchIcon: {
    width: 18,
    height: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.text,
    padding: 0,
  },
  sortsScroll: {
    // Chips scale on press; the extra padding keeps that from being clipped at the edges.
    marginHorizontal: -24,
    marginVertical: -6,
  },
  sorts: {
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  sortChip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortChipActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accentBorder,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.textMuted,
  },
  sortLabelActive: {
    color: C.accent,
  },
  empty: {
    fontSize: 13,
    color: C.textMuted,
    textAlign: 'center',
    paddingVertical: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  photo: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: C.card,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  date: {
    fontSize: 11,
    color: C.textMuted,
  },
  kcal: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
});
