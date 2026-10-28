import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Sheet } from '@/components/sheet';
import { Palette as C } from '@/constants/palette';
import { Header, icons } from './meals-ui';
import { useMeals } from './meals-store';

const CATEGORIES = ['Food', 'Drinks', 'Both'] as const;

export function MealCaptureScreen() {
  const insets = useSafeAreaInsets();
  const { tutorialSeen, dismissTutorial } = useMeals();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('Food');
  const [description, setDescription] = useState('');

  return (
    <>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
        ]}>
        <Header label="Meals" onBack={() => router.back()} />

        <View style={styles.heading}>
          <Text style={styles.title}>Capture Meal</Text>
          <Text style={styles.subtitle}>Capture food or drinks.</Text>
        </View>

        <View style={styles.preview}>
          <Text style={styles.previewLabel}>• GUIDELINES · NO IMAGE</Text>

          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />

          <View style={styles.circle}>
            <Image source={icons.utensils} style={styles.circleIcon} contentFit="contain" />
            <Text style={styles.circleTitle}>Place food or drink here</Text>
            <Text style={styles.circleNote}>Top-down shot · keep steady</Text>
          </View>

          <View style={styles.rulerChip}>
            <Image source={icons.ruler} style={styles.rulerIcon} contentFit="contain" />
            <Text style={styles.rulerText}>Place 15 cm ruler beside plate or cup</Text>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((option) => {
              const active = option === category;
              return (
                <Pressable
                  key={option}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategory(option)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Optional description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add ingredients, preparation, or drink details (e.g. sugar, milk, size)."
            placeholderTextColor={C.textMuted}
            multiline
            style={styles.description}
          />
        </View>

        <Text style={styles.footnote}>
          Photo and description are sent to cloud analysis for ingredient detection.
        </Text>

        <View style={styles.controls}>
          <Image source={icons.zapOff} style={styles.controlIcon} contentFit="contain" />
          <Pressable style={styles.shutterRing} onPress={() => router.push('/meal')}>
            <View style={styles.shutter} />
          </Pressable>
          <Image source={icons.switchCamera} style={styles.controlIcon} contentFit="contain" />
        </View>

        <Pressable style={styles.libraryButton} onPress={() => router.push('/meal')}>
          <Image source={icons.images} style={styles.libraryIcon} contentFit="contain" />
          <Text style={styles.libraryLabel}>Upload from library</Text>
        </Pressable>
      </ScrollView>

      <Sheet visible={!tutorialSeen} title="Your first capture" onClose={dismissTutorial}>
        <Text style={styles.tutorialEyebrow}>ONE-TIME GUIDE · 🐒 VoocHealth</Text>
        <Text style={styles.tutorialBody}>
          Choose Food or Drinks. Center it with a 15 cm ruler beside the plate or cup, fully in
          frame.
        </Text>
        <View style={styles.tutorialCard}>
          <Text style={styles.tutorialLine}>← Swipe left: Edit</Text>
          <Text style={styles.tutorialLine}>Swipe right: Delete →</Text>
          <Text style={styles.tutorialLine}>Tap an item: choose food or change amount</Text>
        </View>
        <Text style={styles.tutorialNote}>
          Description is optional. Your photo and description are sent to cloud analysis for
          ingredient detection.
        </Text>
        <Pressable
          style={styles.primary}
          onPress={() => {
            dismissTutorial();
            router.push('/meal');
          }}>
          <Text style={styles.primaryLabel}>Got it</Text>
        </Pressable>
        <Pressable style={styles.skip} onPress={dismissTutorial}>
          <Text style={styles.skipLabel}>Skip</Text>
        </Pressable>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    paddingHorizontal: 24,
    gap: 18,
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
    fontSize: 12,
    color: C.textMuted,
  },
  preview: {
    height: 370,
    borderRadius: 18,
    backgroundColor: '#2B2724',
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewLabel: {
    position: 'absolute',
    top: 14,
    left: 18,
    fontSize: 10,
    letterSpacing: 0.4,
    color: 'rgba(255,255,255,0.55)',
  },
  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  cornerTopLeft: {
    top: 44,
    left: 18,
    borderTopWidth: 1,
    borderLeftWidth: 1,
  },
  cornerTopRight: {
    top: 44,
    right: 18,
    borderTopWidth: 1,
    borderRightWidth: 1,
  },
  cornerBottomLeft: {
    bottom: 44,
    left: 18,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
  },
  cornerBottomRight: {
    bottom: 44,
    right: 18,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  circle: {
    width: 192,
    height: 192,
    borderRadius: 96,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: -18,
  },
  circleIcon: {
    width: 30,
    height: 30,
  },
  circleTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.92)',
  },
  circleNote: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
  },
  rulerChip: {
    position: 'absolute',
    bottom: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.28)',
  },
  rulerIcon: {
    width: 20,
    height: 20,
  },
  rulerText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: C.textMuted,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: C.accentTint,
    borderColor: C.accentBorder,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: C.textMuted,
  },
  chipTextActive: {
    color: C.accent,
  },
  description: {
    minHeight: 84,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 12,
    color: C.text,
    textAlignVertical: 'top',
  },
  footnote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: -2,
  },
  controlIcon: {
    width: 24,
    height: 24,
    opacity: 0.5,
  },
  shutterRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(157,35,50,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.accent,
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  libraryIcon: {
    width: 19,
    height: 19,
  },
  libraryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  tutorialEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: C.accent,
  },
  tutorialBody: {
    fontSize: 13,
    lineHeight: 19,
    color: C.text,
  },
  tutorialCard: {
    backgroundColor: C.background,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  tutorialLine: {
    fontSize: 12,
    color: C.text,
  },
  tutorialNote: {
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  primary: {
    height: 52,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.onAccent,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  skipLabel: {
    fontSize: 13,
    color: C.textMuted,
  },
});
