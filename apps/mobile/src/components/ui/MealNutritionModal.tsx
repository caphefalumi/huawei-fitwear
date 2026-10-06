import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Pressable,
  Image,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, softShadow } from '../../theme';
import { MealDoc } from '../../types/types';

interface MealNutritionModalProps {
  meal: MealDoc | null;
  visible: boolean;
  onClose: () => void;
  onDelete?: (mealId: string) => void;
}

export const MealNutritionModal: React.FC<MealNutritionModalProps> = ({
  meal,
  visible,
  onClose,
  onDelete
}) => {
  const { theme, radii } = useAppTheme();

  if (!meal) return null;

  // Calorie calculations
  const pKcal = Math.round(meal.totalProtein * 4);
  const cKcal = Math.round(meal.totalCarbs * 4);
  const fKcal = Math.round(meal.totalFat * 9);
  const sumKcal = Math.max(pKcal + cKcal + fKcal, 1);
  const pPct = Math.round((pKcal / sumKcal) * 100);
  const cPct = Math.round((cKcal / sumKcal) * 100);
  const fPct = Math.max(0, 100 - pPct - cPct);

  const mealTitle =
    meal.items.length > 0
      ? meal.items.map((i) => i.name).slice(0, 2).join(' & ') +
        (meal.items.length > 2 ? ` + ${meal.items.length - 2} more` : '')
      : `${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)} Meal`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top Header Navigation */}
        <View style={[styles.headerBar, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.headerLeft}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close nutrition facts"
              onPress={onClose}
              style={[styles.closeCircleBtn, { backgroundColor: theme.surfaceElevated }]}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </Pressable>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>Nutrition Facts</Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                {meal.date} • Logged at {meal.time}
              </Text>
            </View>
          </View>

          <View style={[styles.mealTypeBadge, { backgroundColor: theme.primaryContainer }]}>
            <Text style={[styles.mealTypeBadgeText, { color: theme.primary }]}>
              {meal.type.toUpperCase()}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Meal Photo Viewport */}
          {meal.imageUrl ? (
            <View style={[styles.photoViewport, { borderRadius: radii.lg, backgroundColor: theme.surfaceElevated }]}>
              <Image source={{ uri: meal.imageUrl }} style={styles.photoImage} resizeMode="cover" />
              <View style={styles.photoGradientOverlay} />
              <View style={styles.photoTimeTag}>
                <Ionicons name="time-outline" size={11} color="#FFFFFF" />
                <Text style={styles.photoTimeTagText}>{meal.time}</Text>
              </View>
            </View>
          ) : null}

          {/* Meal Main Title */}
          <View style={styles.titleSection}>
            <Text style={[styles.mealMainTitle, { color: theme.text }]}>{mealTitle}</Text>
          </View>

          {/* Total Energy & 4-Column Clean Macro Card */}
          <View
            style={[
              styles.totalsCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.lg,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.totalsCardHeader}>
              <Text style={[styles.totalsCardTitle, { color: theme.text }]}>Total Energy</Text>
              <View style={[styles.budgetPercentPill, { backgroundColor: theme.primaryContainer }]}>
                <Ionicons name="checkmark-circle" size={12} color={theme.primary} />
                <Text style={[styles.budgetPercentText, { color: theme.primary }]}>
                  {Math.round((meal.totalCalories / 2200) * 100)}% daily goal
                </Text>
              </View>
            </View>

            {/* Clean 2x2 Macro Cards (Zero Overflow) */}
            <View style={styles.macroGridContainer}>
              <View style={styles.macroRow}>
                {/* Calories */}
                <View style={[styles.macroCard, { backgroundColor: theme.surfaceElevated }]}>
                  <View style={[styles.macroCardIcon, { backgroundColor: `${theme.calories}18` }]}>
                    <Ionicons name="flame" size={16} color={theme.calories} />
                  </View>
                  <View style={styles.macroCardTextGroup}>
                    <Text style={[styles.macroCardValue, { color: theme.text }]}>
                      {meal.totalCalories}
                    </Text>
                    <Text style={[styles.macroCardLabel, { color: theme.textSecondary }]}>
                      Calories
                    </Text>
                  </View>
                </View>

                {/* Protein */}
                <View style={[styles.macroCard, { backgroundColor: theme.surfaceElevated }]}>
                  <View style={[styles.macroCardIcon, { backgroundColor: `${theme.protein}18` }]}>
                    <Ionicons name="barbell" size={16} color={theme.protein} />
                  </View>
                  <View style={styles.macroCardTextGroup}>
                    <Text style={[styles.macroCardValue, { color: theme.text }]}>
                      {Math.round(meal.totalProtein)}g
                    </Text>
                    <Text style={[styles.macroCardLabel, { color: theme.textSecondary }]}>
                      Protein
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.macroRow}>
                {/* Carbs */}
                <View style={[styles.macroCard, { backgroundColor: theme.surfaceElevated }]}>
                  <View style={[styles.macroCardIcon, { backgroundColor: `${theme.carbs}18` }]}>
                    <Ionicons name="nutrition" size={16} color={theme.carbs} />
                  </View>
                  <View style={styles.macroCardTextGroup}>
                    <Text style={[styles.macroCardValue, { color: theme.text }]}>
                      {Math.round(meal.totalCarbs)}g
                    </Text>
                    <Text style={[styles.macroCardLabel, { color: theme.textSecondary }]}>
                      Carbs
                    </Text>
                  </View>
                </View>

                {/* Fat */}
                <View style={[styles.macroCard, { backgroundColor: theme.surfaceElevated }]}>
                  <View style={[styles.macroCardIcon, { backgroundColor: `${theme.fat}18` }]}>
                    <Ionicons name="water" size={16} color={theme.fat} />
                  </View>
                  <View style={styles.macroCardTextGroup}>
                    <Text style={[styles.macroCardValue, { color: theme.text }]}>
                      {Math.round(meal.totalFat)}g
                    </Text>
                    <Text style={[styles.macroCardLabel, { color: theme.textSecondary }]}>
                      Healthy Fat
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Caloric Distribution Ratio */}
            <View style={styles.ratioSection}>
              <Text style={[styles.ratioTitle, { color: theme.text }]}>
                Calorie Breakdown
              </Text>

              {/* Segmented Progress Bar */}
              <View style={[styles.ratioTrack, { backgroundColor: theme.surfaceElevated }]}>
                <View
                  style={{
                    width: `${pPct}%`,
                    height: '100%',
                    backgroundColor: theme.protein,
                    borderRadius: 4
                  }}
                />
                <View
                  style={{
                    width: `${cPct}%`,
                    height: '100%',
                    backgroundColor: theme.carbs,
                    borderRadius: 4
                  }}
                />
                <View
                  style={{
                    width: `${fPct}%`,
                    height: '100%',
                    backgroundColor: theme.fat,
                    borderRadius: 4
                  }}
                />
              </View>

              {/* Explicit, readable labels: Protein • Carbs • Fat */}
              <View style={styles.ratioLegendRow}>
                <View style={styles.ratioLegendItem}>
                  <View style={[styles.ratioDot, { backgroundColor: theme.protein }]} />
                  <Text style={styles.ratioLegendText}>
                    <Text style={{ color: theme.protein, fontWeight: '700' }}>{pPct}%</Text>{' '}
                    <Text style={{ color: theme.textSecondary }}>Protein</Text>
                  </Text>
                </View>

                <View style={styles.ratioLegendItem}>
                  <View style={[styles.ratioDot, { backgroundColor: theme.carbs }]} />
                  <Text style={styles.ratioLegendText}>
                    <Text style={{ color: theme.carbs, fontWeight: '700' }}>{cPct}%</Text>{' '}
                    <Text style={{ color: theme.textSecondary }}>Carbs</Text>
                  </Text>
                </View>

                <View style={styles.ratioLegendItem}>
                  <View style={[styles.ratioDot, { backgroundColor: theme.fat }]} />
                  <Text style={styles.ratioLegendText}>
                    <Text style={{ color: theme.fat, fontWeight: '700' }}>{fPct}%</Text>{' '}
                    <Text style={{ color: theme.textSecondary }}>Fat</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Clean Ingredients List Card */}
          <View style={styles.ingredientsSection}>
            <View style={styles.ingredientsHeaderRow}>
              <Text style={[styles.ingredientsTitle, { color: theme.text }]}>
                Ingredients & Portions
              </Text>
              <View style={[styles.itemsCountPill, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={[styles.itemsCountText, { color: theme.textSecondary }]}>
                  {meal.items.length} items
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.ingredientsCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.lg,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              {meal.items.map((item, idx) => {
                const isLast = idx === meal.items.length - 1;
                const dotColor =
                  item.protein > item.carbs && item.protein > item.fat
                    ? theme.protein
                    : item.carbs > item.fat
                    ? theme.carbs
                    : theme.fat;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.ingredientItemRow,
                      !isLast && { borderBottomColor: theme.borderSubtle, borderBottomWidth: StyleSheet.hairlineWidth }
                    ]}
                  >
                    <View style={styles.ingredientLeftCol}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View style={[styles.ingredientDot, { backgroundColor: dotColor }]} />
                        <Text style={[styles.ingredientName, { color: theme.text }]} numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>
                      <Text style={[styles.ingredientSub, { color: theme.textSecondary }]}>
                        {item.protein}g P • {item.carbs}g C • {item.fat}g F
                      </Text>
                    </View>

                    <View style={styles.ingredientRightCol}>
                      <Text style={[styles.ingredientCalories, { color: theme.text }]}>
                        {item.calories} kcal
                      </Text>
                      <Text style={[styles.ingredientWeight, { color: theme.textSecondary }]}>
                        {item.grams}g
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Action Footer (Compact Button) */}
          <View style={styles.footerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Done"
              onPress={onClose}
              style={({ pressed }) => [
                styles.doneButton,
                {
                  backgroundColor: theme.primary,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }]
                }
              ]}
            >
              <Text style={[styles.doneButtonText, { color: theme.onPrimary }]}>
                Done
              </Text>
            </Pressable>

            {onDelete ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove meal from log"
                onPress={() => {
                  onDelete(meal.id);
                  onClose();
                }}
                style={styles.deleteMealBtn}
              >
                <Ionicons name="trash-outline" size={15} color={theme.error} />
                <Text style={[styles.deleteMealText, { color: theme.error }]}>
                  Remove from log
                </Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  mealTypeBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999
  },
  mealTypeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14
  },
  photoViewport: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    position: 'relative'
  },
  photoImage: {
    width: '100%',
    height: '100%'
  },
  photoGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)'
  },
  photoTimeTag: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(15, 23, 42, 0.70)'
  },
  photoTimeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF'
  },
  titleSection: {
    paddingVertical: 2
  },
  mealMainTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  totalsCard: {
    width: '100%',
    borderWidth: 1,
    padding: 14,
    gap: 12,
    overflow: 'hidden'
  },
  totalsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  totalsCardTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  budgetPercentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 9999
  },
  budgetPercentText: {
    fontSize: 11,
    fontWeight: '700'
  },
  macroGridContainer: {
    gap: 8,
    width: '100%'
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%'
  },
  macroCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12
  },
  macroCardIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  macroCardTextGroup: {
    flex: 1
  },
  macroCardValue: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  macroCardLabel: {
    fontSize: 11,
    fontWeight: '500'
  },
  ratioSection: {
    gap: 8,
    paddingTop: 4
  },
  ratioTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  ratioTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 3,
    overflow: 'hidden'
  },
  ratioLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2
  },
  ratioLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  ratioDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  ratioLegendText: {
    fontSize: 12,
    fontWeight: '500'
  },
  ingredientsSection: {
    gap: 8
  },
  ingredientsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ingredientsTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  itemsCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  itemsCountText: {
    fontSize: 11,
    fontWeight: '600'
  },
  ingredientsCard: {
    borderWidth: 1,
    overflow: 'hidden'
  },
  ingredientItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  ingredientLeftCol: {
    flex: 1,
    gap: 2
  },
  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  ingredientName: {
    fontSize: 13,
    fontWeight: '600'
  },
  ingredientSub: {
    fontSize: 11,
    fontWeight: '500',
    paddingLeft: 12
  },
  ingredientRightCol: {
    alignItems: 'flex-end',
    gap: 1
  },
  ingredientCalories: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  ingredientWeight: {
    fontSize: 11,
    fontWeight: '500',
    fontVariant: ['tabular-nums']
  },
  footerActions: {
    gap: 8,
    marginTop: 4
  },
  doneButton: {
    height: 44,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '700'
  },
  deleteMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6
  },
  deleteMealText: {
    fontSize: 12,
    fontWeight: '600'
  }
});
