import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { BackHeader, Card } from '@/features/home/ui';

const icons = {
  play: require('@/assets/images/workout/play.svg'),
  shieldCheck: require('@/assets/images/home/shield-check.svg'),
};

type Guide = {
  name: string;
  sets: number;
  reps: number;
  load: number;
  loadUnit: string;
  step: number;
  cues: { title: string; detail: string }[];
};

const GUIDES: Record<string, Guide> = {
  'bench-press': {
    name: 'Barbell bench press',
    sets: 3,
    reps: 10,
    load: 30,
    loadUnit: 'kg',
    step: 2.5,
    cues: [
      { title: 'Stable feet & back', detail: 'Feet on floor, hips and upper back on bench.' },
      {
        title: 'Straight wrists',
        detail: 'Grip wider than shoulders, squeeze scapula before lowering.',
      },
      { title: 'Controlled lowering', detail: 'Lower slowly to chest, exhale on press. No bounce.' },
    ],
  },
  'incline-dumbbell-press': {
    name: 'Incline dumbbell press',
    sets: 3,
    reps: 12,
    load: 10,
    loadUnit: 'kg/hand',
    step: 2,
    cues: [
      { title: 'Bench at 30°', detail: 'Steep enough for upper chest, low enough to protect shoulders.' },
      { title: 'Elbows at 45°', detail: 'Keep elbows slightly tucked, wrists stacked over elbows.' },
      { title: 'Even press', detail: 'Press both dumbbells together, stop before they touch.' },
    ],
  },
  'cable-chest-fly': {
    name: 'Cable chest fly',
    sets: 3,
    reps: 12,
    load: 7.5,
    loadUnit: 'kg/side',
    step: 2.5,
    cues: [
      { title: 'Slight forward lean', detail: 'Step forward, keep a soft bend in the elbows.' },
      { title: 'Arc, don’t press', detail: 'Bring hands together in a wide arc, not a press.' },
      { title: 'Slow return', detail: 'Let the cables pull back over two seconds.' },
    ],
  },
};

export function ExerciseGuideScreen() {
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const { recovery } = useHealth();
  const guide = GUIDES[name ?? 'bench-press'] ?? GUIDES['bench-press'];
  const [load, setLoad] = useState(guide.load);

  function adjust(direction: -1 | 1) {
    setLoad((prev) => Math.max(0, Number((prev + direction * guide.step).toFixed(1))));
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <BackHeader label="Chest plan" onPress={() => router.back()} />

      <View style={styles.heading}>
        <Text style={styles.title}>{guide.name}</Text>
        <Text style={styles.subtitle}>Technique guide</Text>
      </View>

      <View style={styles.demoWrap}>
        <Image
          source={require('@/assets/images/workout/bench-demo.svg')}
          style={styles.demo}
          contentFit="cover"
        />
        <View style={styles.demoPlay}>
          <Image source={icons.play} style={styles.demoPlayIcon} contentFit="contain" />
        </View>
        <View style={styles.demoBadge}>
          <Text style={styles.demoBadgeLabel}>Demo GIF</Text>
        </View>
      </View>

      <Card style={styles.prescriptionCard}>
        <View style={styles.prescriptionRow}>
          <View style={styles.prescription}>
            <Text style={styles.prescriptionValue}>{guide.sets} sets</Text>
            <Text style={styles.prescriptionLabel}>Sets</Text>
          </View>
          <View style={styles.prescription}>
            <Text style={styles.prescriptionValue}>{guide.reps} reps</Text>
            <Text style={styles.prescriptionLabel}>Reps</Text>
          </View>
        </View>
        <View style={styles.loadRow}>
          <Text style={styles.loadLabel}>Weight</Text>
          <View style={styles.loadInput}>
            <Text style={styles.loadValue}>{load}</Text>
            <Text style={styles.loadUnit}>{guide.loadUnit}</Text>
          </View>
          <View style={styles.stepper}>
            <Pressable style={styles.stepButton} onPress={() => adjust(-1)}>
              <View style={styles.minus} />
            </Pressable>
            <Pressable style={styles.stepButton} onPress={() => adjust(1)}>
              <View style={styles.minus} />
              <View style={styles.plus} />
            </Pressable>
          </View>
        </View>
      </Card>

      <View style={styles.cues}>
        <Text style={styles.sectionTitle}>3 key cues</Text>
        {guide.cues.map((cue, index) => (
          <View key={cue.title} style={styles.cue}>
            <View style={styles.cueMarker}>
              <Text style={styles.cueMarkerLabel}>{index + 1}</Text>
            </View>
            <View style={styles.cueCopy}>
              <Text style={styles.cueTitle}>{cue.title}</Text>
              <Text style={styles.cueDetail}>{cue.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.warning}>
        <Image source={icons.shieldCheck} style={styles.warningIcon} contentFit="contain" />
        <Text style={styles.warningText}>
          {recovery.area} is recovering. Review only; stop if you feel pain.
        </Text>
      </View>

      <Pressable style={styles.disabledAction}>
        <Image source={icons.play} style={styles.actionIcon} contentFit="contain" />
        <Text style={styles.disabledActionLabel}>Start workout</Text>
      </Pressable>
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
    gap: 3,
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
  demoWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: C.card,
  },
  demo: {
    width: '100%',
    aspectRatio: 354 / 160,
  },
  demoPlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -22,
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: C.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoPlayIcon: {
    width: 18,
    height: 18,
  },
  demoBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: C.surface,
  },
  demoBadgeLabel: {
    fontSize: 10,
    color: C.text,
  },
  prescriptionCard: {
    padding: 14,
    gap: 12,
  },
  prescriptionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  prescription: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  prescriptionValue: {
    fontSize: 16,
    color: C.text,
  },
  prescriptionLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  loadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadLabel: {
    fontSize: 10,
    color: C.textMuted,
  },
  loadInput: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    backgroundColor: C.previewTint,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  loadValue: {
    fontSize: 10,
    fontWeight: '600',
    color: C.text,
  },
  loadUnit: {
    fontSize: 10,
    color: C.textMuted,
  },
  stepper: {
    flexDirection: 'row',
    gap: 4,
  },
  stepButton: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: C.previewTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minus: {
    width: 8,
    height: 1,
    backgroundColor: C.textMuted,
  },
  plus: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: C.textMuted,
  },
  cues: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: C.text,
  },
  cue: {
    flexDirection: 'row',
    gap: 10,
  },
  cueMarker: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cueMarkerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text,
  },
  cueCopy: {
    flex: 1,
    gap: 3,
  },
  cueTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text,
  },
  cueDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.accentTint,
    borderRadius: 14,
    padding: 14,
  },
  warningIcon: {
    width: 18,
    height: 18,
  },
  warningText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: C.textMuted,
  },
  disabledAction: {
    flexDirection: 'row',
    gap: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 14,
    height: 14,
  },
  disabledActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.textMuted,
  },
});
