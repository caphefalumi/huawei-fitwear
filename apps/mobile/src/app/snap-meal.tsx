import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../theme';
import { useNutritionStore } from '../store/nutritionStore';
import { exerciseService } from '../services/exerciseService';
import { Timestamp, MealItem, MealType, ConfidenceLevel, FoodDoc } from '../types/types';
import { PrimaryButton, SecondaryButton, Stepper, ProgressRing } from '../components/ui';

export default function SnapMealScreen() {
  const { theme, radii, spacing } = useAppTheme();
  const { addMeal, todaySummary } = useNutritionStore();

  // Phase: 1 = Camera, 2 = Analyzing, 3 = Review, 4 = Success
  const [phase, setPhase] = useState<1 | 2 | 3 | 4>(1);

  // Camera states
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(true);
  const [capturedImage, setCapturedImage] = useState<string>(
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'
  );

  // Analysis states (4 steps)
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const analysisSteps = [
    { title: 'Finding food boundaries...', icon: 'scan-outline' as const },
    { title: 'Identifying each dish & ingredient...', icon: 'restaurant-outline' as const },
    { title: 'Estimating portion depth & volume...', icon: 'cube-outline' as const },
    { title: 'Calculating macro & calorie breakdown...', icon: 'calculator-outline' as const }
  ];

  // Review states
  const defaultMealType = (): MealType => {
    const hour = new Date().getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 15) return 'lunch';
    if (hour < 18) return 'snack';
    return 'dinner';
  };

  const [selectedMealType, setSelectedMealType] = useState<MealType>(defaultMealType());
  const [detectedItems, setDetectedItems] = useState<MealItem[]>([
    {
      id: 'item_1',
      name: 'Grilled Chicken Breast',
      grams: 180,
      calories: 296,
      protein: 55,
      carbs: 0,
      fat: 6,
      confidence: 'high'
    },
    {
      id: 'item_2',
      name: 'Steamed Jasmine Rice',
      grams: 200,
      calories: 260,
      protein: 5,
      carbs: 57,
      fat: 0.5,
      confidence: 'high'
    },
    {
      id: 'item_3',
      name: 'Hass Avocado Slices',
      grams: 65,
      calories: 104,
      protein: 1.3,
      carbs: 5.5,
      fat: 9.6,
      confidence: 'medium'
    },
    {
      id: 'item_4',
      name: 'Sweet Chili Dressing',
      grams: 25,
      calories: 45,
      protein: 0.2,
      carbs: 10,
      fat: 0.1,
      confidence: 'low'
    }
  ]);

  // Food Search Modal
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<FoodDoc[]>([]);

  // Execute on-device simulated analysis
  const startAnalysis = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setPhase(2);
    setAnalysisStep(0);

    // Step sequence (~3 seconds total, 750ms each)
    setTimeout(() => setAnalysisStep(1), 750);
    setTimeout(() => setAnalysisStep(2), 1500);
    setTimeout(() => setAnalysisStep(3), 2250);
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setPhase(3);
    }, 3000);
  };

  // Gallery Picker
  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8
      });
      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        startAnalysis();
      }
    } catch {
      // Fallback: use default sample
      startAnalysis();
    }
  };

  // Update item grams and recalculate macros proportionally
  const handleUpdateGrams = (id: string, newGrams: number) => {
    setDetectedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const ratio = newGrams / (item.grams || 1);
        return {
          ...item,
          grams: newGrams,
          calories: Math.round(item.calories * ratio),
          protein: Number((item.protein * ratio).toFixed(1)),
          carbs: Number((item.carbs * ratio).toFixed(1)),
          fat: Number((item.fat * ratio).toFixed(1))
        };
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setDetectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Search Food Modal
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      exerciseService.searchFoods(searchQuery).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddFoodItem = (food: FoodDoc) => {
    const newItem: MealItem = {
      id: `item_${Date.now()}`,
      name: food.name,
      grams: food.servingGrams,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      confidence: 'high'
    };
    setDetectedItems((prev) => [...prev, newItem]);
    setShowSearchModal(false);
    setSearchQuery('');
  };

  // Total Calculations
  const totalCalories = detectedItems.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = detectedItems.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = detectedItems.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFat = detectedItems.reduce((acc, curr) => acc + curr.fat, 0);

  const handleSaveMeal = async () => {
    await addMeal({
      userId: 'user_default',
      type: selectedMealType,
      time: Timestamp.formatTime(),
      date: Timestamp.toDateString(),
      imageUrl: capturedImage,
      items: detectedItems,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setPhase(4);
  };

  // ================= 1. CAMERA VIEW =================
  if (phase === 1) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.cameraHeader}>
          <Pressable
            style={[styles.circleButton, { backgroundColor: theme.surfaceElevated }]}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </Pressable>

          <View style={[styles.edgeAiBadge, { borderColor: theme.primary, backgroundColor: theme.surfaceElevated }]}>
            <View style={[styles.greenPulse, { backgroundColor: theme.primary }]} />
            <Text style={[styles.edgeAiText, { color: theme.text }]}>Analyzed on your phone</Text>
          </View>

          <Pressable
            style={[styles.circleButton, { backgroundColor: theme.surfaceElevated }]}
            onPress={() => setFlashOn(!flashOn)}
          >
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={22}
              color={flashOn ? theme.carbs : theme.text}
            />
          </Pressable>
        </View>

        {/* Viewfinder Camera Simulation */}
        <View style={[styles.viewfinderContainer, { backgroundColor: theme.surfaceElevated }]}>
          <Image
            source={{ uri: capturedImage }}
            style={styles.cameraPreviewImage}
            resizeMode="cover"
          />

          {/* Plate Framing Overlay Guide */}
          <View style={[styles.plateGuide, { borderColor: theme.border }]}>
            <View style={[styles.crosshair, styles.crosshairTopLeft, { borderColor: theme.primary }]} />
            <View style={[styles.crosshair, styles.crosshairTopRight, { borderColor: theme.primary }]} />
            <View style={[styles.crosshair, styles.crosshairBottomLeft, { borderColor: theme.primary }]} />
            <View style={[styles.crosshair, styles.crosshairBottomRight, { borderColor: theme.primary }]} />
            <Text style={[styles.guideInstruction, { color: theme.onPrimary, backgroundColor: theme.scrim }]}>Align plate within frame</Text>
          </View>

          {/* Reference Object Tip Banner */}
          {showTip ? (
            <View style={[styles.tipBanner, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Ionicons name="bulb-outline" size={20} color={theme.carbs} style={{ marginRight: 8 }} />
              <Text style={[styles.tipText, { color: theme.text }]}>
                Place a card or utensil next to your plate for optimal portion estimation.
              </Text>
              <Pressable onPress={() => setShowTip(false)}>
                <Text style={[styles.tipSkip, { color: theme.primary }]}>Skip</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <Pressable
            style={[styles.galleryButton, { backgroundColor: theme.surfaceElevated }]}
            onPress={handlePickFromGallery}
          >
            <Ionicons name="images" size={24} color={theme.text} />
          </Pressable>

          <Pressable
            onPress={startAnalysis}
            style={({ pressed }) => [
              styles.shutterOuter,
              { borderColor: theme.primary, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <View style={[styles.shutterInner, { backgroundColor: theme.primary }]} />
          </Pressable>

          <View style={{ width: 48 }} />
        </View>
      </SafeAreaView>
    );
  }

  // ================= 2. ON-DEVICE ANALYSIS VIEW =================
  if (phase === 2) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.analysisCenter}>
          <View style={[styles.analysisIconBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>

          <Text style={[styles.analysisHeading, { color: theme.text }]}>
            Analyzing Plate
          </Text>
          <Text style={[styles.analysisSubtext, { color: theme.textSecondary }]}>
            Running fully on-device • Works without internet
          </Text>

          {/* Step Sequence */}
          <View style={styles.stepSequenceBox}>
            {analysisSteps.map((stepItem, idx) => {
              const isPast = idx < analysisStep;
              const isCurrent = idx === analysisStep;

              return (
                <View key={idx} style={styles.analysisStepRow}>
                  <View
                    style={[
                      styles.stepCircle,
                      {
                        backgroundColor: isPast
                          ? theme.primary
                          : isCurrent
                          ? theme.surfaceElevated
                          : theme.surfaceSubtle,
                        borderColor: isCurrent ? theme.primary : theme.border
                      }
                    ]}
                  >
                    {isPast ? (
                      <Ionicons name="checkmark" size={14} color={theme.onPrimary} />
                    ) : (
                      <Ionicons
                        name={stepItem.icon}
                        size={14}
                        color={isCurrent ? theme.primary : theme.textMuted}
                      />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.analysisStepText,
                      {
                        color: isPast || isCurrent ? theme.text : theme.textMuted,
                        fontWeight: isCurrent ? '700' : '500'
                      }
                    ]}
                  >
                    {stepItem.title}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ================= 3. REVIEW DETECTED FOOD SCREEN =================
  if (phase === 3) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.reviewHeader}>
          <Pressable
            style={styles.circleButtonReview}
            onPress={() => setPhase(1)}
          >
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.reviewHeaderTitle, { color: theme.text }]}>Review Plate</Text>
          <Pressable
            style={styles.addMissingHeaderBtn}
            onPress={() => setShowSearchModal(true)}
          >
            <Ionicons name="add" size={24} color={theme.primary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.reviewScroll}>
          {/* Photo with Overlay Chips */}
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.reviewImage}
              resizeMode="cover"
            />
            {/* Visual AI Chips */}
            <View style={[styles.overlayChip, { top: 24, left: 32 }]}>
              <View style={[styles.chipDot, { backgroundColor: theme.protein }]} />
              <Text style={[styles.chipText, { color: theme.onPrimary }]}>Chicken Breast ~180g</Text>
            </View>
            <View style={[styles.overlayChip, { bottom: 32, right: 40 }]}>
              <View style={[styles.chipDot, { backgroundColor: theme.carbs }]} />
              <Text style={[styles.chipText, { color: theme.onPrimary }]}>Jasmine Rice ~200g</Text>
            </View>
          </View>

          {/* Meal Type & Time Selector */}
          <View style={[styles.mealTypeBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setSelectedMealType(t)}
                style={({ pressed }) => [
                  styles.mealTypeTab,
                  {
                    backgroundColor: selectedMealType === t ? theme.primary : 'transparent',
                    opacity: pressed ? 0.8 : 1
                  }
                ]}
              >
                <Text
                  style={[
                    styles.mealTypeTabText,
                    {
                      color: selectedMealType === t ? theme.onPrimary : theme.textSecondary
                    }
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Detected Items List */}
          <Text style={[styles.detectedSectionTitle, { color: theme.text }]}>
            Detected Foods ({detectedItems.length})
          </Text>

          {detectedItems.map((item) => {
            const isLowConfidence = item.confidence === 'low';
            return (
              <View
                key={item.id}
                style={[
                  styles.foodItemCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: isLowConfidence ? theme.almostThere : theme.border
                  }
                ]}
              >
                <View style={styles.foodItemHeader}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.foodTitleRow}>
                      <Text style={[styles.foodName, { color: theme.text }]}>
                        {item.name}
                      </Text>
                      {/* Confidence Badge */}
                      <View
                        style={[
                          styles.confidenceBadge,
                          {
                            backgroundColor:
                              item.confidence === 'high'
                                ? theme.onTrackBg
                                : item.confidence === 'medium'
                                ? theme.almostThereBg
                                : theme.overTargetBg
                          }
                        ]}
                      >
                        <Text
                          style={[
                            styles.confidenceText,
                            {
                              color:
                                item.confidence === 'high'
                                  ? theme.onTrack
                                  : item.confidence === 'medium'
                                  ? theme.almostThere
                                  : theme.overTarget
                            }
                          ]}
                        >
                          {item.confidence || 'high'}
                        </Text>
                      </View>
                    </View>

                    {isLowConfidence && (
                      <Text style={[styles.checkThisPrompt, { color: theme.almostThere }]}>
                        ⚠️ Low confidence: please verify grams or item name.
                      </Text>
                    )}
                  </View>

                  <Pressable
                    onPress={() => handleDeleteItem(item.id)}
                    style={styles.deleteItemBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color={theme.textMuted} />
                  </Pressable>
                </View>

                {/* Grams Stepper */}
                <Stepper
                  label="PORTION"
                  value={item.grams}
                  onChange={(val) => handleUpdateGrams(item.id, val)}
                  min={10}
                  max={1000}
                  step={10}
                  unit="g"
                />

                {/* Item Macros */}
                <View style={[styles.itemMacroRow, { borderTopColor: theme.borderSubtle }]}>
                  <Text style={[styles.itemKcal, { color: theme.text }]}>
                    {item.calories} kcal
                  </Text>
                  <Text style={[styles.itemMacro, { color: theme.protein }]}>
                    {item.protein}g P
                  </Text>
                  <Text style={[styles.itemMacro, { color: theme.carbs }]}>
                    {item.carbs}g C
                  </Text>
                  <Text style={[styles.itemMacro, { color: theme.fat }]}>
                    {item.fat}g F
                  </Text>
                </View>
              </View>
            );
          })}

          <SecondaryButton
            label="Add Missing Food Item"
            icon="add-circle-outline"
            onPress={() => setShowSearchModal(true)}
            style={{ marginVertical: 12 }}
          />
        </ScrollView>

        {/* Pinned Totals Bottom Bar */}
        <View style={[styles.pinnedFooter, { backgroundColor: theme.surfaceElevated, borderTopColor: theme.border }]}>
          <View style={styles.totalsOverview}>
            <View>
              <Text style={[styles.footerKcalTotal, { color: theme.text }]}>
                {totalCalories} kcal
              </Text>
              <Text style={[styles.footerMacroString, { color: theme.textSecondary }]}>
                {Math.round(totalProtein)}g P • {Math.round(totalCarbs)}g C • {Math.round(totalFat)}g F
              </Text>
            </View>
            <PrimaryButton
              label="Save Meal"
              icon="checkmark-circle"
              size="large"
              onPress={handleSaveMeal}
              style={{ minWidth: 150 }}
            />
          </View>
        </View>

        {/* Search Food Modal */}
        <Modal
          visible={showSearchModal}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowSearchModal(false)}
        >
          <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Add Food Item</Text>
              <Pressable onPress={() => setShowSearchModal(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>

            <View style={[styles.searchBarContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <Ionicons name="search" size={20} color={theme.textSecondary} style={{ marginRight: 8 }} />
              <TextInput
                style={[styles.searchInput, { color: theme.text }]}
                placeholder="Search chicken, rice, pho, oats..."
                placeholderTextColor={theme.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {searchResults.map((food) => (
                <Pressable
                  key={food.id}
                  style={[styles.searchResultRow, { borderBottomColor: theme.border }]}
                  onPress={() => handleAddFoodItem(food)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.foodResultName, { color: theme.text }]}>
                      {food.name}
                    </Text>
                    <Text style={[styles.foodResultSub, { color: theme.textSecondary }]}>
                      {food.servingGrams}g • {food.protein}g P • {food.carbs}g C • {food.fat}g F
                    </Text>
                  </View>
                  <Text style={[styles.foodResultKcal, { color: theme.primary }]}>
                    {food.calories} kcal
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  // ================= 4. SUCCESS & WATCH SYNC CONFIRMATION =================
  const newCaloriesLeft = Math.max(todaySummary.calorieTarget - totalCalories, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.successCenter}>
        <View style={styles.successIconCircle}>
          <ProgressRing
            size={140}
            strokeWidth={9}
            progress={Math.min((todaySummary.caloriesConsumed + totalCalories) / todaySummary.calorieTarget, 1)}
            color={theme.calories}
            primaryValue={newCaloriesLeft}
            primaryLabel="KCAL LEFT"
            icon={{ name: 'fire', color: theme.ringIcon.calories }}
            badge={todaySummary.caloriesConsumed + totalCalories > todaySummary.calorieTarget ? 'warning' : undefined}
            accessibilityLabel={`Calories remaining, ${newCaloriesLeft} kilocalories left`}
          />
        </View>

        <Text style={[styles.successTitle, { color: theme.text }]}>Meal Saved!</Text>
        <Text style={[styles.successSubtitle, { color: theme.textSecondary }]}>
          {totalCalories} kcal logged for {selectedMealType}.
        </Text>

        {/* Watch Synced Confirmation Card */}
        <View style={[styles.watchSyncBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <View style={styles.watchSyncIconRow}>
            <Ionicons name="watch" size={28} color={theme.primary} />
            <Text style={[styles.watchSyncTitle, { color: theme.primary }]}>
              Synced to Huawei Watch
            </Text>
          </View>
          <Text style={[styles.watchSyncText, { color: theme.textSecondary }]}>
            Calories remaining updated to {newCaloriesLeft} kcal on your wrist.
          </Text>
        </View>

        <PrimaryButton
          label="Done"
          size="large"
          onPress={() => router.replace('/(tabs)')}
          style={styles.doneBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  edgeAiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6
  },
  greenPulse: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  edgeAiText: {
    fontSize: 11,
    fontWeight: '700'
  },
  viewfinderContainer: {
    flex: 1,
    position: 'relative',
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden'
  },
  cameraPreviewImage: {
    width: '100%',
    height: '100%'
  },
  plateGuide: {
    position: 'absolute',
    top: '15%',
    left: '10%',
    right: '10%',
    bottom: '25%',
    borderWidth: 1,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  crosshair: {
    position: 'absolute',
    width: 24,
    height: 24
  },
  crosshairTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4
  },
  crosshairTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4
  },
  crosshairBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4
  },
  crosshairBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4
  },
  guideInstruction: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16
  },
  tipBanner: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tipText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 16
  },
  tipSkip: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shutterInner: {
    width: 66,
    height: 66,
    borderRadius: 33
  },
  analysisCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  analysisIconBox: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  analysisHeading: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6
  },
  analysisSubtext: {
    fontSize: 13,
    marginBottom: 32
  },
  stepSequenceBox: {
    width: '100%',
    gap: 16
  },
  analysisStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  analysisStepText: {
    fontSize: 14
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  circleButtonReview: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reviewHeaderTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  addMissingHeaderBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reviewScroll: {
    padding: 16,
    paddingBottom: 120
  },
  photoContainer: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16
  },
  reviewImage: {
    width: '100%',
    height: '100%'
  },
  overlayChip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12
  },
  chipDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700'
  },
  mealTypeBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16
  },
  mealTypeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10
  },
  mealTypeTabText: {
    fontSize: 12,
    fontWeight: '700'
  },
  detectedSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10
  },
  foodItemCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  foodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700'
  },
  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  checkThisPrompt: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4
  },
  deleteItemBtn: {
    padding: 4
  },
  itemMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  itemKcal: {
    fontSize: 12,
    fontWeight: '700'
  },
  itemMacro: {
    fontSize: 12,
    fontWeight: '600'
  },
  pinnedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: 24
  },
  totalsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerKcalTotal: {
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums']
  },
  footerMacroString: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800'
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
    paddingHorizontal: 12,
    height: 44
  },
  searchInput: {
    flex: 1,
    fontSize: 15
  },
  searchResultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  foodResultName: {
    fontSize: 15,
    fontWeight: '700'
  },
  foodResultSub: {
    fontSize: 12,
    marginTop: 2
  },
  foodResultKcal: {
    fontSize: 14,
    fontWeight: '800'
  },
  successCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8
  },
  successSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  watchSyncBox: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 32
  },
  watchSyncIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  watchSyncTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  watchSyncText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18
  },
  doneBtn: {
    width: '100%'
  }
});
