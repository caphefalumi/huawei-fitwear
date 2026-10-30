import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable } from '@/components/pressable';
import { Sheet } from '@/components/sheet';
import { Palette as C } from '@/constants/palette';
import { Glyph, Header, PrimaryButton, SectionTitle, icons } from './meals-ui';
import {
  rescaleItem,
  splitDetail,
  useMeals,
  type MealItem,
  type MealLog,
} from './meals-store';

const ACTION_WIDTH = 88;

type SwipeState = 'edit' | 'delete' | null;

export function MealResultScreen({ log }: { log?: MealLog }) {
  const insets = useSafeAreaInsets();
  const meals = useMeals();
  const { removeItem, updateItem, deleteMeal, logMeal, deleteLog } = meals;
  const readOnly = log !== undefined;
  const mealName = log?.name ?? meals.mealName;
  const items = log?.items ?? meals.items;
  const totals = log ? { kcal: log.kcal, ...log.macros } : meals.totals;
  const [optionsFor, setOptionsFor] = useState<MealItem | null>(null);
  const [amountFor, setAmountFor] = useState<MealItem | null>(null);
  const [amountDraft, setAmountDraft] = useState('');

  function openAmount(item: MealItem) {
    setOptionsFor(null);
    setAmountDraft(String(splitDetail(item.detail).amount));
    setAmountFor(item);
  }

  function saveAmount() {
    if (!amountFor) return;
    const next = Number(amountDraft);
    if (!Number.isFinite(next) || next <= 0) return;
    updateItem(amountFor.id, rescaleItem(amountFor, next));
    setAmountFor(null);
  }

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
        ]}>
        <Header
          label="Meal"
          onBack={() => router.back()}
          action="Delete"
          onAction={() => {
            router.back();
            if (log) deleteLog(log.id);
            else deleteMeal();
          }}
        />

        <View style={styles.heading}>
          <Text style={styles.title}>{mealName}</Text>
          <Text style={styles.subtitle}>
            {log ? `${log.date}, 2026 · ${log.time}` : 'Oct 8, 2026 · 12:30 PM'} · {items.length} items
          </Text>
        </View>

        <Image
          source={require('@/assets/images/meals/meal-photo.png')}
          style={styles.photo}
          contentFit="cover"
        />

        <View style={styles.totalsCard}>
          <View style={styles.totalsTop}>
            <View style={styles.kcalRow}>
              <Text style={styles.kcalValue}>{totals.kcal}</Text>
              <Text style={styles.kcalUnit}>kcal</Text>
            </View>
            <Text style={styles.totalsNote}>Estimated total</Text>
          </View>
          <View style={styles.macroRow}>
            {[
              { value: totals.protein, label: 'Protein' },
              { value: totals.carbs, label: 'Carbs' },
              { value: totals.fat, label: 'Fat' },
            ].map((macro) => (
              <View key={macro.label} style={styles.macroCell}>
                <Text style={styles.macroValue}>{macro.value} g</Text>
                <Text style={styles.macroLabel}>{macro.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <SectionTitle
          title="Meal Details"
          action={readOnly ? undefined : '+ Add item'}
          onPress={() => router.push('/add-item')}
        />

        <View style={styles.list}>
          {items.length === 0 ? (
            <Text style={styles.empty}>No items yet. Add a food or drink to estimate this meal.</Text>
          ) : (
            items.map((item, index) => (
              <MealRow
                key={item.id}
                item={item}
                last={index === items.length - 1}
                readOnly={readOnly}
                onPress={() => setOptionsFor(item)}
                onEdit={() => setOptionsFor(item)}
                onDelete={() => removeItem(item.id)}
              />
            ))
          )}
        </View>

        <Text style={styles.footnote}>
          {readOnly
            ? 'Standard-serving estimates from when this meal was logged.'
            : 'Standard-serving estimates. Adjust portions as needed.'}
        </Text>

        {readOnly ? null : (
          <PrimaryButton
            label="Log Meal"
            disabled={items.length === 0}
            onPress={() => {
              logMeal();
              router.replace('/home');
            }}
          />
        )}
      </ScrollView>

      <Sheet
        visible={optionsFor !== null}
        title={optionsFor?.name ?? ''}
        onClose={() => setOptionsFor(null)}>
        <Text style={styles.sheetSubtitle}>
          {optionsFor ? `${splitDetail(optionsFor.detail).amount} g · selected item` : ''}
        </Text>

        <Pressable
          style={styles.optionRow}
          onPress={() => {
            setOptionsFor(null);
            router.push(`/replace-food?id=${optionsFor?.id ?? ''}`);
          }}>
          <Image source={icons.search} style={styles.optionIcon} contentFit="contain" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Search food</Text>
            <Text style={styles.optionNote}>Select a replacement from the database</Text>
          </View>
          <Image source={icons.chevronRight} style={styles.optionChevron} contentFit="contain" />
        </Pressable>

        <Pressable style={styles.optionRow} onPress={() => optionsFor && openAmount(optionsFor)}>
          <Image source={icons.weight} style={styles.optionIcon} contentFit="contain" />
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Change amount</Text>
            <Text style={styles.optionNote}>Update the portion weight</Text>
          </View>
          <Image source={icons.chevronRight} style={styles.optionChevron} contentFit="contain" />
        </Pressable>

        <Pressable
          style={styles.optionRow}
          onPress={() => {
            const target = optionsFor;
            setOptionsFor(null);
            if (target) removeItem(target.id);
          }}>
          <Image source={icons.close} style={styles.optionIcon} contentFit="contain" />
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, styles.optionDanger]}>Delete item</Text>
            <Text style={styles.optionNote}>Remove this food from the meal</Text>
          </View>
          <Image source={icons.chevronRight} style={styles.optionChevron} contentFit="contain" />
        </Pressable>

        <Pressable style={styles.sheetCancel} onPress={() => setOptionsFor(null)}>
          <Text style={styles.sheetCancelLabel}>Cancel</Text>
        </Pressable>
      </Sheet>

      <Sheet
        visible={amountFor !== null}
        title="Change amount"
        onClose={() => setAmountFor(null)}>
        <Text style={styles.sheetSubtitle}>
          {amountFor ? `${amountFor.name} · ${splitDetail(amountFor.detail).note || 'cooked'}` : ''}
        </Text>

        <View style={styles.previousRow}>
          <Text style={styles.previousLabel}>Previous amount</Text>
          <Text style={styles.previousValue}>
            {amountFor ? `${splitDetail(amountFor.detail).amount} g` : ''}
          </Text>
        </View>

        <Text style={styles.fieldLabel}>New amount</Text>
        <View style={styles.amountBox}>
          <TextInput
            value={amountDraft}
            onChangeText={setAmountDraft}
            keyboardType="numeric"
            style={styles.amountInput}
          />
          <Text style={styles.amountUnit}>g</Text>
        </View>

        {amountFor ? (
          <View style={styles.estimateBox}>
            <View style={styles.estimateTop}>
              <Text style={styles.estimateLabel}>This item · estimated</Text>
              <Text style={styles.estimateValue}>
                {rescaleItem(amountFor, Number(amountDraft) || 0).kcal} kcal
              </Text>
            </View>
            <Text style={styles.estimateMacros}>
              {(() => {
                const next = rescaleItem(amountFor, Number(amountDraft) || 0);
                return `Protein ${next.macros.protein}g · Carbs ${next.macros.carbs}g · Fat ${next.macros.fat}g`;
              })()}
            </Text>
          </View>
        ) : null}

        <PrimaryButton label="Save amount" onPress={saveAmount} />
        <Pressable style={styles.sheetCancel} onPress={() => setAmountFor(null)}>
          <Text style={styles.sheetCancelLabel}>Cancel</Text>
        </Pressable>
      </Sheet>
    </>
  );
}

function MealRow({
  item,
  last,
  readOnly,
  onPress,
  onEdit,
  onDelete,
}: {
  item: MealItem;
  last: boolean;
  readOnly: boolean;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [state, setState] = useState<SwipeState>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  const settle = (next: SwipeState) => {
    setState(next);
    Animated.timing(translateX, {
      toValue: next === 'edit' ? -ACTION_WIDTH : next === 'delete' ? ACTION_WIDTH : 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 8 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_, gesture) => {
          translateX.setValue(Math.max(-ACTION_WIDTH, Math.min(ACTION_WIDTH, gesture.dx)));
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -ACTION_WIDTH / 2) settle('edit');
          else if (gesture.dx > ACTION_WIDTH / 2) settle('delete');
          else settle(null);
        },
      }),
    // settle/translateX are stable for the lifetime of the row
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const content = (
    <>
      <Glyph glyph={item.glyph} />
      <View style={styles.rowText}>
        <View style={styles.rowTop}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemKcal}>{item.kcal} kcal</Text>
        </View>
        <Text style={styles.itemDetail}>{item.detail}</Text>
        <Text style={styles.itemMacros}>
          Protein {item.macros.protein}g · Carbs {item.macros.carbs}g · Fat {item.macros.fat}g
        </Text>
      </View>
    </>
  );

  if (readOnly) {
    return (
      <View style={[styles.rowWrap, !last && styles.rowDivider]}>
        <View style={styles.rowSurface}>
          <View style={styles.row}>{content}</View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.rowWrap, !last && styles.rowDivider]}>
      <View style={styles.rowActions}>
        <Pressable
          style={styles.deleteAction}
          onPress={() => {
            settle(null);
            onDelete();
          }}>
          <Text style={styles.deleteActionLabel}>Delete</Text>
        </Pressable>
        <Pressable
          style={styles.editAction}
          onPress={() => {
            settle(null);
            onEdit();
          }}>
          <Text style={styles.editActionLabel}>Edit</Text>
        </Pressable>
      </View>

      <Animated.View
        style={[styles.rowSurface, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}>
        <Pressable
          style={styles.row}
          onPress={() => {
            if (state) settle(null);
            else onPress();
          }}>
          {content}
        </Pressable>
      </Animated.View>
    </View>
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
  photo: {
    width: '100%',
    height: 154,
    borderRadius: 14,
  },
  totalsCard: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 18,
    gap: 14,
  },
  totalsTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  kcalValue: {
    fontSize: 34,
    fontWeight: '600',
    color: C.text,
  },
  kcalUnit: {
    fontSize: 13,
    color: C.textMuted,
    marginBottom: 6,
  },
  totalsNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  macroRow: {
    flexDirection: 'row',
  },
  macroCell: {
    flex: 1,
    gap: 2,
  },
  macroValue: {
    fontSize: 19,
    fontWeight: '600',
    color: C.text,
  },
  macroLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  list: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  empty: {
    padding: 18,
    fontSize: 12,
    color: C.textMuted,
  },
  rowWrap: {
    overflow: 'hidden',
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowActions: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteAction: {
    width: ACTION_WIDTH,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.onAccent,
  },
  editAction: {
    width: ACTION_WIDTH,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
  rowSurface: {
    backgroundColor: C.surface,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  itemKcal: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
  },
  itemDetail: {
    fontSize: 10,
    color: C.textMuted,
  },
  itemMacros: {
    fontSize: 10,
    color: C.textMuted,
    marginTop: 4,
  },
  footnote: {
    fontSize: 11,
    color: C.textMuted,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: C.textMuted,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  optionDanger: {
    color: C.accent,
  },
  optionIcon: {
    width: 20,
    height: 20,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  optionNote: {
    fontSize: 11,
    color: C.textMuted,
  },
  optionChevron: {
    width: 16,
    height: 16,
  },
  sheetCancel: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  sheetCancelLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
  previousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previousLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  previousValue: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  amountInput: {
    flex: 1,
    fontSize: 15,
    color: C.text,
  },
  amountUnit: {
    fontSize: 13,
    color: C.textMuted,
  },
  estimateBox: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    gap: 4,
  },
  estimateTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  estimateLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  estimateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  estimateMacros: {
    fontSize: 11,
    color: C.textMuted,
  },
});
