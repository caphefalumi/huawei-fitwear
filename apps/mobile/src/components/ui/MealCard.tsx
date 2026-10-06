import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme, softShadow } from '../../theme';
import { MealDoc } from '../../types/types';

interface MealCardProps {
  meal: MealDoc;
  onPress?: () => void;
  onDelete?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onPress,
  onDelete
}) => {
  const { theme, radii } = useAppTheme();

  const getMealTypeTheme = () => {
    switch (meal.type) {
      case 'breakfast':
        return { icon: 'sunny' as const, bg: theme.isDark ? '#272010' : '#FEF3C7', color: '#D97706' };
      case 'lunch':
        return { icon: 'restaurant' as const, bg: theme.isDark ? '#1E293B' : '#EFF6FF', color: '#2563EB' };
      case 'dinner':
        return { icon: 'moon' as const, bg: theme.isDark ? '#26182D' : '#F3E8FF', color: '#9333EA' };
      case 'snack':
        return { icon: 'cafe' as const, bg: theme.isDark ? '#122B22' : '#ECFDF5', color: '#059669' };
    }
  };

  const mealTheme = getMealTypeTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderRadius: radii.xl,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          ...(theme.isDark
            ? null
            : Platform.OS === 'web'
            ? softShadow
            : { ...softShadow, shadowColor: theme.shadow })
        }
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.typeBadge}>
          <View style={[styles.iconCircle, { backgroundColor: mealTheme.bg }]}>
            <Ionicons name={mealTheme.icon} size={17} color={mealTheme.color} />
          </View>
          <View>
            <Text style={[styles.typeTitle, { color: theme.text }]}>
              {meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}
            </Text>
            <Text style={[styles.mealTime, { color: theme.textSecondary }]}>
              {meal.time}
            </Text>
          </View>
        </View>

        <View style={styles.calorieBadge}>
          <Text style={[styles.calorieValue, { color: theme.text }]}>
            {meal.totalCalories}
          </Text>
          <Text style={[styles.calorieUnit, { color: theme.textSecondary }]}>
            kcal
          </Text>
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Delete meal"
              onPress={onDelete}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={({ pressed }) => [
                styles.deleteButton,
                { opacity: pressed ? 0.6 : 1 }
              ]}
            >
              <View
                style={[
                  styles.deleteCircle,
                  { backgroundColor: theme.isDark ? 'rgba(239, 68, 68, 0.18)' : '#FEE2E2' }
                ]}
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
              </View>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {meal.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={[styles.bullet, { backgroundColor: theme.borderSubtle }]} />
            <Text
              style={[styles.itemName, { color: theme.text }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={[styles.itemGrams, { color: theme.textSecondary }]}>
              {item.grams}g
            </Text>
          </View>
        ))}
      </View>

      {/* Macros Footer */}
      <View
        style={[
          styles.macrosFooter,
          { borderTopColor: theme.borderSubtle }
        ]}
      >
        <View style={[styles.macroPill, { backgroundColor: theme.isDark ? '#1E293B' : '#EFF6FF' }]}>
          <Text style={[styles.macroVal, { color: theme.protein }]}>
            {Math.round(meal.totalProtein)}g Protein
          </Text>
        </View>
        <View style={[styles.macroPill, { backgroundColor: theme.isDark ? '#272010' : '#FEF3C7' }]}>
          <Text style={[styles.macroVal, { color: theme.carbs }]}>
            {Math.round(meal.totalCarbs)}g Carbs
          </Text>
        </View>
        <View style={[styles.macroPill, { backgroundColor: theme.isDark ? '#26182D' : '#F3E8FF' }]}>
          <Text style={[styles.macroVal, { color: theme.fat }]}>
            {Math.round(meal.totalFat)}g Fat
          </Text>
        </View>

        {meal.syncedToWatch ? (
          <View style={styles.syncIndicator}>
            <Ionicons name="watch" size={12} color={theme.primary} />
            <Text style={[styles.syncText, { color: theme.primary }]}>Synced</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    marginVertical: 5
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  typeTitle: {
    fontSize: 15,
    fontWeight: '700'
  },
  mealTime: {
    fontSize: 12,
    fontWeight: '500'
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3
  },
  calorieValue: {
    fontSize: 19,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  calorieUnit: {
    fontSize: 12,
    fontWeight: '600'
  },
  deleteButton: {
    marginLeft: 8
  },
  deleteCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemsContainer: {
    marginBottom: 10,
    gap: 5
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1
  },
  itemGrams: {
    fontSize: 12,
    fontWeight: '600',
    fontVariant: ['tabular-nums']
  },
  macrosFooter: {
    borderTopWidth: 1,
    paddingTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7
  },
  macroPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  macroVal: {
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  syncIndicator: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700'
  }
});
