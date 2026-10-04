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
import { PrimaryButton } from './PrimaryButton';

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
        {/* Top Modal Navigation Bar */}
        <View style={[styles.headerBar, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.headerLeft}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close nutrition facts"
              onPress={onClose}
              style={[styles.closeCircleBtn, { backgroundColor: theme.surfaceElevated }]}
            >
              <Ionicons name="close" size={20} color={theme.text} />
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
              <View style={[styles.photoTimeTag, { backgroundColor: theme.primary }]}>
                <Ionicons name="time-outline" size={12} color={theme.onPrimary} />
                <Text style={[styles.photoTimeTagText, { color: theme.onPrimary }]}>
                  {meal.time}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Meal Main Title & Target Contribution */}
          <View style={styles.titleSection}>
            <Text style={[styles.mealMainTitle, { color: theme.text }]}>{mealTitle}</Text>
            <View style={styles.watchSyncNoticeRow}>
              <Ionicons name="watch" size={14} color={theme.onTrack} />
              <Text style={[styles.watchSyncNoticeText, { color: theme.onTrack }]}>
                Synced with Huawei Watch GT 4 telemetry
              </Text>
            </View>
          </View>

          {/* Total Calories & Macro 2x2 Bento Grid */}
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
                <Ionicons name="checkmark-circle" size={13} color={theme.primary} />
                <Text style={[styles.budgetPercentText, { color: theme.primary }]}>
                  {Math.round((meal.totalCalories / 2200) * 100)}% daily budget
                </Text>
              </View>
            </View>

            <View style={styles.macro2x2Grid}>
              {/* Calories */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIconCircle, { backgroundColor: `${theme.calories}18` }]}>
                  <Ionicons name="flame" size={18} color={theme.calories} />
                </View>
                <View>
                  <Text style={[styles.macroGridValue, { color: theme.text }]}>
                    {meal.totalCalories}
                  </Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>
                    Calories
                  </Text>
                </View>
              </View>

              {/* Protein */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIconCircle, { backgroundColor: `${theme.protein}18` }]}>
                  <Ionicons name="barbell" size={18} color={theme.protein} />
                </View>
                <View>
                  <Text style={[styles.macroGridValue, { color: theme.text }]}>
                    {Math.round(meal.totalProtein)}g
                  </Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>
                    Protein ({pKcal} kcal)
                  </Text>
                </View>
              </View>

              {/* Carbs */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIconCircle, { backgroundColor: `${theme.carbs}18` }]}>
                  <Ionicons name="nutrition" size={18} color={theme.carbs} />
                </View>
                <View>
                  <Text style={[styles.macroGridValue, { color: theme.text }]}>
                    {Math.round(meal.totalCarbs)}g
                  </Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>
                    Carbs ({cKcal} kcal)
                  </Text>
                </View>
              </View>

              {/* Fat */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIconCircle, { backgroundColor: `${theme.fat}18` }]}>
                  <Ionicons name="water" size={18} color={theme.fat} />
                </View>
                <View>
                  <Text style={[styles.macroGridValue, { color: theme.text }]}>
                    {Math.round(meal.totalFat)}g
                  </Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>
                    Healthy Fat ({fKcal} kcal)
                  </Text>
                </View>
              </View>
            </View>

            {/* Caloric Distribution Spline */}
            <View style={styles.ratioSection}>
              <View style={styles.ratioHeader}>
                <Text style={[styles.ratioTitle, { color: theme.textSecondary }]}>
                  CALORIC RATIO
                </Text>
                <Text style={[styles.ratioValuesText, { color: theme.textSecondary }]}>
                  {pPct}% P • {cPct}% C • {fPct}% F
                </Text>
              </View>
              <View style={[styles.ratioTrack, { backgroundColor: theme.surfaceElevated }]}>
                <View style={{ width: `${pPct}%`, height: '100%', backgroundColor: theme.protein }} />
                <View style={{ width: `${cPct}%`, height: '100%', backgroundColor: theme.carbs }} />
                <View style={{ width: `${fPct}%`, height: '100%', backgroundColor: theme.fat }} />
              </View>
            </View>
          </View>

          {/* Detected Ingredients / Food Items List */}
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

            <View style={styles.itemsList}>
              {meal.items.map((item) => {
                const macroDotColor =
                  item.protein > item.carbs && item.protein > item.fat
                    ? theme.protein
                    : item.carbs > item.fat
                    ? theme.carbs
                    : theme.fat;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.ingredientCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                        borderRadius: radii.md
                      }
                    ]}
                  >
                    <View style={styles.ingredientTopRow}>
                      <View style={styles.ingredientNameGroup}>
                        <View style={[styles.ingredientDot, { backgroundColor: macroDotColor }]} />
                        <Text style={[styles.ingredientName, { color: theme.text }]}>
                          {item.name}
                        </Text>
                      </View>
                      <Text style={[styles.ingredientWeight, { color: theme.text }]}>
                        {item.grams}g
                      </Text>
                    </View>

                    <View style={styles.ingredientMetaRow}>
                      <Text style={[styles.ingredientMacros, { color: theme.textSecondary }]}>
                        {item.calories} kcal •{' '}
                        <Text style={{ color: theme.protein, fontWeight: '700' }}>
                          {item.protein}g P
                        </Text>{' '}
                        •{' '}
                        <Text style={{ color: theme.carbs, fontWeight: '700' }}>
                          {item.carbs}g C
                        </Text>{' '}
                        •{' '}
                        <Text style={{ color: theme.fat, fontWeight: '700' }}>
                          {item.fat}g F
                        </Text>
                      </Text>

                      <View
                        style={[
                          styles.confidenceChip,
                          {
                            backgroundColor:
                              item.confidence === 'high' ? theme.onTrackBg : theme.almostThereBg
                          }
                        ]}
                      >
                        <Ionicons
                          name={item.confidence === 'high' ? 'checkmark-circle' : 'help-circle'}
                          size={11}
                          color={item.confidence === 'high' ? theme.onTrack : theme.almostThere}
                        />
                        <Text
                          style={[
                            styles.confidenceChipText,
                            { color: item.confidence === 'high' ? theme.onTrack : theme.almostThere }
                          ]}
                        >
                          {item.confidence === 'high' ? 'Edge AI 96%' : '72% verify'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Delete Option & Done Button */}
          <View style={styles.footerActions}>
            <PrimaryButton label="Done" onPress={onClose} size="large" />

            {onDelete ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete meal"
                onPress={() => {
                  onDelete(meal.id);
                  onClose();
                }}
                style={styles.deleteMealBtn}
              >
                <Ionicons name="trash-outline" size={16} color={theme.error} />
                <Text style={[styles.deleteMealText, { color: theme.error }]}>
                  {"Remove from Today's Log"}
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
    height: 60,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  mealTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  mealTypeBadgeText: {
    fontSize: 11,
    fontWeight: '700'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 40,
    gap: 16
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  photoTimeTag: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  photoTimeTagText: {
    fontSize: 11,
    fontWeight: '600'
  },
  titleSection: {
    gap: 4
  },
  mealMainTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3
  },
  watchSyncNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  watchSyncNoticeText: {
    fontSize: 12,
    fontWeight: '600'
  },
  totalsCard: {
    borderWidth: 1,
    padding: 16,
    gap: 14
  },
  totalsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  totalsCardTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  budgetPercentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  budgetPercentText: {
    fontSize: 11,
    fontWeight: '700'
  },
  macro2x2Grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  macroGridCell: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10
  },
  macroGridIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  macroGridValue: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  macroGridLabel: {
    fontSize: 11,
    fontWeight: '500'
  },
  ratioSection: {
    gap: 6,
    paddingTop: 4
  },
  ratioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ratioTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  ratioValuesText: {
    fontSize: 11,
    fontWeight: '600'
  },
  ratioTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden'
  },
  ingredientsSection: {
    gap: 10
  },
  ingredientsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ingredientsTitle: {
    fontSize: 16,
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
  itemsList: {
    gap: 8
  },
  ingredientCard: {
    borderWidth: 1,
    padding: 12,
    gap: 6
  },
  ingredientTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ingredientNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1
  },
  ingredientDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600'
  },
  ingredientWeight: {
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  ingredientMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ingredientMacros: {
    fontSize: 12
  },
  confidenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  confidenceChipText: {
    fontSize: 10,
    fontWeight: '700'
  },
  footerActions: {
    gap: 12,
    marginTop: 6
  },
  deleteMealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8
  },
  deleteMealText: {
    fontSize: 13,
    fontWeight: '600'
  }
});
