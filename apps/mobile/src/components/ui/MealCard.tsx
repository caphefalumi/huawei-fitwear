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

  const getMealIcon = () => {
    switch (meal.type) {
      case 'breakfast':
        return 'sunny';
      case 'lunch':
        return 'restaurant';
      case 'dinner':
        return 'moon';
      case 'snack':
        return 'cafe';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          borderRadius: radii.xl,
          opacity: pressed ? 0.85 : 1,
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
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: theme.surfaceElevated }
            ]}
          >
            <Ionicons name={getMealIcon()} size={16} color={theme.primary} />
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
              onPress={onDelete}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsContainer}>
        {meal.items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <View style={[styles.bullet, { backgroundColor: theme.textMuted }]} />
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
        <View style={styles.macroPill}>
          <Text style={[styles.macroLabel, { color: theme.protein }]}>P</Text>
          <Text style={[styles.macroVal, { color: theme.text }]}>
            {Math.round(meal.totalProtein)}g
          </Text>
        </View>
        <View style={styles.macroPill}>
          <Text style={[styles.macroLabel, { color: theme.carbs }]}>C</Text>
          <Text style={[styles.macroVal, { color: theme.text }]}>
            {Math.round(meal.totalCarbs)}g
          </Text>
        </View>
        <View style={styles.macroPill}>
          <Text style={[styles.macroLabel, { color: theme.fat }]}>F</Text>
          <Text style={[styles.macroVal, { color: theme.text }]}>
            {Math.round(meal.totalFat)}g
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
    padding: 16,
    marginVertical: 6
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
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
    fontSize: 16,
    fontWeight: '700'
  },
  mealTime: {
    fontSize: 12,
    fontWeight: '500'
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  calorieValue: {
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  calorieUnit: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4
  },
  itemsContainer: {
    marginBottom: 12,
    gap: 4
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
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  macroLabel: {
    fontSize: 11,
    fontWeight: '800'
  },
  macroVal: {
    fontSize: 12,
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
