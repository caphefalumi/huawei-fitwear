import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette as C } from '@/constants/palette';
import { useHealth } from '@/features/health/health-store';
import { Card, MacroBar, SectionHeading } from '@/features/home/ui';

const icons = {
  chevronRight: require('@/assets/images/home/chevron-right.svg'),
  ringBg: require('@/assets/images/home/ring-bg.svg'),
  ringRemaining: require('@/assets/images/home/ring-remaining.svg'),
  ringTrackSaved: require('@/assets/images/home/ring-track-saved.svg'),
  ringSaved: require('@/assets/images/home/ring-saved.svg'),
  weightChart: require('@/assets/images/home/weight-chart.svg'),
  weightChartSaved: require('@/assets/images/home/weight-chart-saved.svg'),
  previousLog: require('@/assets/images/home/previous-log.svg'),
  shieldCheck: require('@/assets/images/home/shield-check.svg'),
  check: require('@/assets/images/home/check.svg'),
};

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { weightKg, weightUpdated } = useHealth();

  const targetKcal = weightUpdated ? 2160 : 2200;
  const consumedKcal = 1320;
  const kcalLeft = targetKcal - consumedKcal;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: 12 + insets.top, paddingBottom: 26 + insets.bottom },
      ]}>
      <View style={styles.topRow}>
        <Text style={styles.date}>THU, OCT 8</Text>
        <Text style={styles.name}>Sam N.</Text>
      </View>

      <Text style={styles.title}>Today</Text>

      {weightUpdated ? (
        <View style={styles.banner}>
          <Image source={icons.check} style={styles.bannerIcon} contentFit="contain" />
          <Text style={styles.bannerText}>Weight saved · nutrition targets updated</Text>
        </View>
      ) : null}

      <Card>
        <Pressable
          style={styles.cardHeader}
          onPress={() => router.push('/nutrition')}
          hitSlop={10}>
          <Text style={styles.cardHeaderText}>Nutrition</Text>
          <Image source={icons.chevronRight} style={styles.chevron} contentFit="contain" />
        </Pressable>

        <View style={styles.nutritionBody}>
          <View style={styles.ring}>
            <Image
              source={weightUpdated ? icons.ringTrackSaved : icons.ringBg}
              style={styles.ringLayer}
              contentFit="contain"
            />
            <Image
              source={weightUpdated ? icons.ringSaved : icons.ringRemaining}
              style={styles.ringLayer}
              contentFit="contain"
            />
            <View style={styles.ringCenter}>
              <Text style={styles.ringValue}>{kcalLeft}</Text>
              <Text style={styles.ringLabel}>kcal left</Text>
            </View>
          </View>

          <View style={styles.macros}>
            <MacroBar label="Protein" value={92} target={140} unit="g" />
            <MacroBar label="Carbs" value={152} target={weightUpdated ? 265 : 275} unit="g" />
            <MacroBar label="Fat" value={38} target={60} unit="g" />
          </View>
        </View>

        {weightUpdated ? (
          <Text style={styles.consumedLine}>
            1,320 consumed · {kcalLeft} kcal left of {targetKcal.toLocaleString('en-US')}
          </Text>
        ) : null}
      </Card>

      <View style={styles.section}>
        <SectionHeading title="Progress" actionLabel="Details" onPress={() => router.push('/progress')} />
        <Card>
          <View style={styles.weightRow}>
            <View style={styles.weightText}>
              <Text style={styles.weightLabel}>Latest weight</Text>
              <View style={styles.weightValueRow}>
                <Text style={styles.weightValue}>{weightKg.toFixed(1)}</Text>
                <Text style={styles.weightUnit}>kg</Text>
              </View>
              <Text style={styles.weightSub}>
                {weightUpdated ? 'Logged Oct 8' : '−1.2 kg in 4 weeks'}
              </Text>
            </View>
            <Image
              source={weightUpdated ? icons.weightChartSaved : icons.weightChart}
              style={styles.weightChart}
              contentFit="contain"
            />
          </View>

          {weightUpdated ? (
            <View style={styles.previousRow}>
              <Image source={icons.previousLog} style={styles.previousChart} contentFit="contain" />
              <Text style={styles.previousText}>Previous · Oct 7</Text>
              <Text style={styles.previousValue}>72.0 kg</Text>
            </View>
          ) : null}

          <Pressable onPress={() => router.push('/progress')} hitSlop={8}>
            <Text style={styles.link}>View full progress →</Text>
          </Pressable>
        </Card>
      </View>

      <Pressable style={styles.recovery} onPress={() => router.push('/recovery')}>
        <Image source={icons.shieldCheck} style={styles.recoveryIcon} contentFit="contain" />
        <View style={styles.recoveryText}>
          <Text style={styles.recoveryTitle}>Right shoulder recovery</Text>
          <Text style={styles.recoverySub}>2 rest days · 3 light days</Text>
        </View>
        <Image source={icons.chevronRight} style={styles.recoveryChevron} contentFit="contain" />
      </Pressable>

      {weightUpdated ? (
        <Text style={styles.footnote}>Demo personal targets · estimates, not medical advice.</Text>
      ) : null}
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
    gap: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: C.textMuted,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: C.accent,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    color: C.text,
    marginTop: -6,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.accentTint,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bannerIcon: {
    width: 14,
    height: 14,
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.text,
  },
  chevron: {
    width: 18,
    height: 18,
  },
  nutritionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  ring: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLayer: {
    position: 'absolute',
    width: 112,
    height: 112,
  },
  ringCenter: {
    alignItems: 'center',
  },
  ringValue: {
    fontSize: 18,
    fontWeight: '700',
    color: C.text,
  },
  ringLabel: {
    fontSize: 9,
    color: C.textMuted,
  },
  macros: {
    flex: 1,
    gap: 10,
  },
  consumedLine: {
    fontSize: 11,
    color: C.textMuted,
  },
  section: {
    gap: 10,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  weightText: {
    gap: 2,
  },
  weightLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  weightValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  weightValue: {
    fontSize: 27,
    fontWeight: '600',
    color: C.text,
  },
  weightUnit: {
    fontSize: 14,
    color: C.textMuted,
  },
  weightSub: {
    fontSize: 11,
    color: C.textMuted,
  },
  weightChart: {
    width: 110,
    height: 56,
  },
  previousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previousChart: {
    width: 44,
    height: 20,
  },
  previousText: {
    flex: 1,
    fontSize: 11,
    color: C.textMuted,
  },
  previousValue: {
    fontSize: 11,
    fontWeight: '600',
    color: C.text,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: C.accent,
  },
  recovery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
  },
  recoveryIcon: {
    width: 21,
    height: 21,
  },
  recoveryText: {
    flex: 1,
    gap: 2,
  },
  recoveryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: C.text,
  },
  recoverySub: {
    fontSize: 11,
    color: C.textMuted,
  },
  recoveryChevron: {
    width: 17,
    height: 17,
  },
  footnote: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: 'center',
  },
});
