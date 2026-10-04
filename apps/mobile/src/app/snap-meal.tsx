import React, { useState } from 'react';
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
  Image,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../theme';
import { useNutritionStore } from '../store/nutritionStore';
import { exerciseService } from '../services/exerciseService';
import { Timestamp, MealItem, MealType, FoodDoc } from '../types/types';
import { PrimaryButton, SecondaryButton, ProgressRing } from '../components/ui';
import { useAddMealMutation } from '@/hooks/use-queries';

let globalItemCounter = 1000;
function createMealItemId(): string {
  globalItemCounter += 1;
  return `item_${globalItemCounter}`;
}

export default function SnapMealScreen() {
  const { theme, radii } = useAppTheme();
  const { addMeal, todaySummary } = useNutritionStore();
  const addMealMutation = useAddMealMutation();

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

  const handleScaleAllItems = (factor: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setDetectedItems((prev) =>
      prev.map((item) => {
        const newGrams = Math.max(10, Math.round(item.grams * factor));
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

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      exerciseService.searchFoods(query).then(setSearchResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFoodItem = (food: FoodDoc) => {
    const newItem: MealItem = {
      id: createMealItemId(),
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
    const mealPayload = {
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
    };
    try {
      await addMealMutation.mutateAsync(mealPayload);
    } catch {
    }
    await addMeal(mealPayload);

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

  if (phase === 2) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.analysisCenter}>
          <View style={[styles.scanViewport, { borderColor: theme.border, borderRadius: radii.xl }]}>
            <Image source={{ uri: capturedImage }} style={styles.scanImage} resizeMode="cover" />
            <View style={styles.scanOverlay} />
            <View style={[styles.scanLaser, { backgroundColor: theme.primary }]} />

            <View style={[styles.scanDetectBadge, { top: 24, left: 24, borderColor: theme.protein }]}>
              <View style={[styles.photoTagDot, { backgroundColor: theme.protein }]} />
              <Text style={styles.scanDetectText}>Chicken Breast • 96%</Text>
            </View>

            <View style={[styles.scanDetectBadge, { bottom: 32, right: 24, borderColor: theme.carbs }]}>
              <View style={[styles.photoTagDot, { backgroundColor: theme.carbs }]} />
              <Text style={styles.scanDetectText}>Jasmine Rice • 92%</Text>
            </View>
          </View>

          <View style={styles.analysisHeaderBlock}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.analysisHeading, { color: theme.text }]}>Analyzing Plate</Text>
          </View>
          <Text style={[styles.analysisSubtext, { color: theme.textSecondary }]}>
            Running fully on-device • Works without internet
          </Text>

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
    const hasLowConfidence = detectedItems.some((i) => i.confidence === 'low' || i.confidence === 'medium');

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Top Header */}
        <View style={[styles.reviewHeader, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.reviewHeaderLeft}>
            <Pressable
              style={[styles.circleButtonReview, { backgroundColor: theme.surfaceElevated }]}
              onPress={() => setPhase(1)}
              accessibilityRole="button"
              accessibilityLabel="Back to camera"
            >
              <Ionicons name="arrow-back" size={20} color={theme.text} />
            </Pressable>
            <View style={[styles.brandIconMini, { backgroundColor: theme.primaryContainer }]}>
              <Ionicons name="fitness" size={16} color={theme.primary} />
            </View>
            <Text style={[styles.reviewHeaderTitle, { color: theme.text }]}>Meal Snap Camera</Text>
          </View>

          <Pressable
            style={[styles.circleButtonReview, { backgroundColor: theme.primaryContainer }]}
            onPress={() => setShowSearchModal(true)}
            accessibilityRole="button"
            accessibilityLabel="Add missing food item"
          >
            <Ionicons name="add" size={22} color={theme.primary} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.reviewScroll} showsVerticalScrollIndicator={false}>
          {/* Status Context Bar (Edge AI Offline Engine) */}
          <View style={styles.edgeContextBar}>
            <View style={[styles.edgeModelBadge, { backgroundColor: theme.primaryContainer }]}>
              <View style={[styles.pulseDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.edgeModelText, { color: theme.onPrimaryContainer }]}>
                Edge AI Vision Model v3.4
              </Text>
            </View>
            <View style={styles.edgeLatencyRow}>
              <Ionicons name="flash" size={14} color={theme.onTrack} />
              <Text style={[styles.edgeLatencyText, { color: theme.textSecondary }]}>
                On-device (0.18s)
              </Text>
            </View>
          </View>

          {/* Food Snapshot Showcase (4:3 ratio with rich edge badges) */}
          <View style={[styles.photoShowcaseContainer, { borderRadius: radii.lg }]}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.reviewImage}
              resizeMode="cover"
            />
            <View style={styles.photoOverlayGradient} />

            {/* Offline Ready Badge */}
            <View style={[styles.photoOfflineBadge, { backgroundColor: 'rgba(18, 30, 28, 0.85)' }]}>
              <Ionicons name="hardware-chip-outline" size={14} color={theme.primary} />
              <Text style={styles.photoOfflineBadgeText}>Edge AI Detected (Offline ready)</Text>
            </View>

            {/* Visual Bounding Chips */}
            <View style={[styles.photoTagChip, { top: '30%', left: '20%' }]}>
              <View style={[styles.photoTagDot, { backgroundColor: theme.protein }]} />
              <Text style={styles.photoTagText}>Chicken</Text>
            </View>
            <View style={[styles.photoTagChip, { bottom: '25%', right: '25%' }]}>
              <View style={[styles.photoTagDot, { backgroundColor: theme.carbs }]} />
              <Text style={styles.photoTagText}>Rice / Potato</Text>
            </View>
          </View>

          {/* Confidence / Heuristic Warning Banner */}
          {hasLowConfidence && (
            <View style={[styles.confidenceAlertCard, { backgroundColor: `${theme.warning}18`, borderColor: `${theme.warning}40` }]}>
              <View style={[styles.confidenceAlertIcon, { backgroundColor: `${theme.warning}30` }]}>
                <Ionicons name="warning-outline" size={18} color={theme.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.confidenceAlertHeader}>
                  <Text style={[styles.confidenceAlertTitle, { color: theme.warning }]}>
                    Review portion weight
                  </Text>
                  <Text style={[styles.confidenceAlertMeta, { color: theme.warning }]}>
                    72% certainty
                  </Text>
                </View>
                <Text style={[styles.confidenceAlertDesc, { color: theme.textSecondary }]}>
                  Depth map indicates dense pile. Tap stepper below to confirm weight or adjust grams.
                </Text>
              </View>
            </View>
          )}

          {/* Meal Type Bar */}
          <View style={[styles.mealTypeBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
              <Pressable
                key={t}
                onPress={() => setSelectedMealType(t)}
                style={[
                  styles.mealTypeTab,
                  {
                    backgroundColor: selectedMealType === t ? theme.primary : 'transparent',
                    borderRadius: radii.sm
                  }
                ]}
              >
                <Text
                  style={[
                    styles.mealTypeTabText,
                    {
                      color: selectedMealType === t ? theme.onPrimary : theme.textSecondary,
                      fontWeight: selectedMealType === t ? '700' : '500'
                    }
                  ]}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={[styles.scaleMultiplierRow, { backgroundColor: theme.surfaceElevated, borderRadius: radii.md }]}>
            <Text style={[styles.scalePromptText, { color: theme.textSecondary }]}>Quick Scale Portion:</Text>
            <View style={styles.scaleButtonsGroup}>
              {[
                { label: '0.5×', val: 0.5 },
                { label: '1.0×', val: 1.0 },
                { label: '1.5×', val: 1.5 },
                { label: '2.0×', val: 2.0 }
              ].map((scale) => (
                <Pressable
                  key={scale.label}
                  onPress={() => handleScaleAllItems(scale.val)}
                  style={[styles.scaleBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
                >
                  <Text style={[styles.scaleBtnText, { color: theme.primary }]}>{scale.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Detected Items Header */}
          <View style={styles.detectedSectionHeader}>
            <View style={styles.detectedTitleGroup}>
              <Text style={[styles.detectedSectionTitle, { color: theme.text }]}>Detected Foods</Text>
              <View style={[styles.detectedCountPill, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={[styles.detectedCountText, { color: theme.textSecondary }]}>
                  {detectedItems.length} items
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setShowSearchModal(true)}
              style={styles.addInlineBtn}
            >
              <Ionicons name="add-circle" size={16} color={theme.primary} />
              <Text style={[styles.addInlineText, { color: theme.primary }]}>Add item</Text>
            </Pressable>
          </View>

          {/* Detected Foods Cards */}
          {detectedItems.map((item) => {
            const isLow = item.confidence === 'low' || item.confidence === 'medium';
            const macroColor =
              item.protein > item.carbs && item.protein > item.fat
                ? theme.protein
                : item.carbs > item.fat
                ? theme.carbs
                : theme.fat;

            return (
              <View
                key={item.id}
                style={[
                  styles.foodCardStitch,
                  {
                    backgroundColor: theme.card,
                    borderColor: isLow ? theme.warning : theme.border,
                    borderRadius: radii.md
                  }
                ]}
              >
                <View style={styles.foodCardStitchTop}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.foodCardStitchTitleRow}>
                      <View style={[styles.macroDotCircle, { backgroundColor: macroColor }]} />
                      <Text style={[styles.foodCardStitchName, { color: theme.text }]} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>

                    <View style={styles.foodCardStitchMetaRow}>
                      <View
                        style={[
                          styles.confidencePill,
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
                        <Ionicons
                          name={item.confidence === 'high' ? 'checkmark-circle' : 'help-circle'}
                          size={11}
                          color={
                            item.confidence === 'high'
                              ? theme.onTrack
                              : item.confidence === 'medium'
                              ? theme.almostThere
                              : theme.overTarget
                          }
                        />
                        <Text
                          style={[
                            styles.confidencePillText,
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
                          {item.confidence === 'high' ? 'High 96%' : 'Med 72%'}
                        </Text>
                      </View>

                      <Text style={[styles.foodCardStitchSub, { color: theme.textSecondary }]}>
                        • {item.calories} kcal • {item.protein}g P
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => handleDeleteItem(item.id)}
                    style={styles.trashBtn}
                  >
                    <Ionicons name="trash-outline" size={17} color={theme.textMuted} />
                  </Pressable>
                </View>

                {/* Inline Serving Weight Stepper */}
                <View style={[styles.stepperRowStitch, { borderTopColor: theme.borderSubtle }]}>
                  <Text style={[styles.stepperPromptText, { color: theme.textSecondary }]}>
                    Adjust serving weight:
                  </Text>
                  <View style={[styles.stepperGroupStitch, { backgroundColor: theme.surfaceElevated }]}>
                    <Pressable
                      onPress={() => handleUpdateGrams(item.id, Math.max(10, item.grams - 10))}
                      style={styles.stepperSmallBtn}
                    >
                      <Ionicons name="remove" size={16} color={theme.text} />
                    </Pressable>
                    <Text style={[styles.stepperSmallVal, { color: theme.text }]}>
                      {item.grams}g
                    </Text>
                    <Pressable
                      onPress={() => handleUpdateGrams(item.id, item.grams + 10)}
                      style={styles.stepperSmallBtn}
                    >
                      <Ionicons name="add" size={16} color={theme.text} />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Total Macros Summary Card (Stitch 2x2 Grid) */}
          <View
            style={[
              styles.totalsSummaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.lg,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.totalsSummaryHeader}>
              <Text style={[styles.totalsSummaryTitle, { color: theme.text }]}>Meal Totals</Text>
              <View style={styles.totalsBudgetTag}>
                <Ionicons name="checkmark-circle" size={14} color={theme.primary} />
                <Text style={[styles.totalsBudgetText, { color: theme.primary }]}>
                  {Math.round((totalCalories / Math.max(todaySummary.calorieTarget, 1)) * 100)}% daily budget
                </Text>
              </View>
            </View>

            <View style={styles.macro2x2Grid}>
              {/* Calories */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIcon, { backgroundColor: `${theme.calories}18` }]}>
                  <Ionicons name="flame" size={18} color={theme.calories} />
                </View>
                <View>
                  <Text style={[styles.macroGridNum, { color: theme.text }]}>{totalCalories}</Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>Calories</Text>
                </View>
              </View>

              {/* Protein */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIcon, { backgroundColor: `${theme.protein}18` }]}>
                  <Ionicons name="barbell" size={18} color={theme.protein} />
                </View>
                <View>
                  <Text style={[styles.macroGridNum, { color: theme.text }]}>{Math.round(totalProtein)}g</Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>Protein</Text>
                </View>
              </View>

              {/* Carbs */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIcon, { backgroundColor: `${theme.carbs}18` }]}>
                  <Ionicons name="nutrition" size={18} color={theme.carbs} />
                </View>
                <View>
                  <Text style={[styles.macroGridNum, { color: theme.text }]}>{Math.round(totalCarbs)}g</Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>Carbs</Text>
                </View>
              </View>

              {/* Fat */}
              <View style={[styles.macroGridCell, { backgroundColor: theme.surfaceElevated }]}>
                <View style={[styles.macroGridIcon, { backgroundColor: `${theme.fat}18` }]}>
                  <Ionicons name="water" size={18} color={theme.fat} />
                </View>
                <View>
                  <Text style={[styles.macroGridNum, { color: theme.text }]}>{Math.round(totalFat)}g</Text>
                  <Text style={[styles.macroGridLabel, { color: theme.textSecondary }]}>Healthy Fat</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Realtime Sync Note */}
          <View style={styles.syncNoteRow}>
            <Ionicons name="watch-outline" size={16} color={theme.onTrack} />
            <Text style={[styles.syncNoteText, { color: theme.textSecondary }]}>
              Home calorie ring & Huawei watch will update immediately on save.
            </Text>
          </View>

          {/* Primary Action Buttons */}
          <View style={styles.bottomButtonsStack}>
            <PrimaryButton
              label={`Add to Today (+${totalCalories} kcal)`}
              icon="checkmark-circle"
              size="large"
              onPress={handleSaveMeal}
            />

            <SecondaryButton
              label="Retake Photo"
              icon="camera-outline"
              onPress={() => setPhase(1)}
            />
          </View>
        </ScrollView>

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
                onChangeText={handleSearchChange}
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
    padding: 24
  },
  scanViewport: {
    width: '100%',
    height: 220,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20
  },
  scanImage: {
    width: '100%',
    height: '100%'
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 32, 27, 0.35)'
  },
  scanLaser: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '48%',
    height: 3,
    shadowColor: '#4FD6C4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8
  },
  scanDetectBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'rgba(18, 30, 28, 0.85)'
  },
  scanDetectText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  analysisHeaderBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  scaleMultiplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 12
  },
  scalePromptText: {
    fontSize: 12,
    fontWeight: '600'
  },
  scaleButtonsGroup: {
    flexDirection: 'row',
    gap: 6
  },
  scaleBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1
  },
  scaleBtnText: {
    fontSize: 11,
    fontWeight: '800'
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  reviewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  brandIconMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  circleButtonReview: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reviewHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  edgeContextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  edgeModelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 6
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  edgeModelText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  edgeLatencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  edgeLatencyText: {
    fontSize: 11,
    fontWeight: '500'
  },
  photoShowcaseContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12
  },
  photoOverlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)'
  },
  photoOfflineBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999
  },
  photoOfflineBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600'
  },
  photoTagChip: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999
  },
  photoTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  photoTagText: {
    color: '#121E1C',
    fontSize: 11,
    fontWeight: '700'
  },
  confidenceAlertCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12
  },
  confidenceAlertIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1
  },
  confidenceAlertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  confidenceAlertTitle: {
    fontSize: 13,
    fontWeight: '700'
  },
  confidenceAlertMeta: {
    fontSize: 11,
    fontWeight: '600'
  },
  confidenceAlertDesc: {
    fontSize: 12,
    lineHeight: 16
  },
  detectedSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 8
  },
  detectedTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  detectedCountPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  detectedCountText: {
    fontSize: 11,
    fontWeight: '600'
  },
  addInlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  addInlineText: {
    fontSize: 13,
    fontWeight: '600'
  },
  foodCardStitch: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10
  },
  foodCardStitchTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  foodCardStitchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  macroDotCircle: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  foodCardStitchName: {
    fontSize: 15,
    fontWeight: '700'
  },
  foodCardStitchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4
  },
  confidencePillText: {
    fontSize: 10,
    fontWeight: '700'
  },
  foodCardStitchSub: {
    fontSize: 12,
    fontWeight: '500'
  },
  trashBtn: {
    padding: 4
  },
  stepperRowStitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  stepperPromptText: {
    fontSize: 12,
    fontWeight: '500'
  },
  stepperGroupStitch: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 2
  },
  stepperSmallBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },
  stepperSmallVal: {
    width: 48,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  totalsSummaryCard: {
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
    marginBottom: 12
  },
  totalsSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  totalsSummaryTitle: {
    fontSize: 16,
    fontWeight: '700'
  },
  totalsBudgetTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  totalsBudgetText: {
    fontSize: 12,
    fontWeight: '600'
  },
  macro2x2Grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  macroGridCell: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10
  },
  macroGridIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  macroGridNum: {
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  macroGridLabel: {
    fontSize: 11,
    fontWeight: '500'
  },
  syncNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 10,
    paddingHorizontal: 8
  },
  syncNoteText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center'
  },
  bottomButtonsStack: {
    gap: 8,
    marginTop: 6
  },
  addMissingHeaderBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  reviewScroll: {
    padding: 16,
    paddingBottom: 40
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
