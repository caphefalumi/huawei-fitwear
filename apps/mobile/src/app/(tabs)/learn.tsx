import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';
import { useWorkoutStore } from '../../store/workoutStore';
import { Chip, BrandLogo } from '../../components/ui';
import { ExerciseDoc, MuscleGroup } from '../../types/types';

const muscleGroups: { key: string; label: string; group: MuscleGroup | 'All'; color: string; icon: any; count: number }[] = [
  { key: 'all', label: 'All', group: 'All', color: '#005E53', icon: 'apps-outline', count: 18 },
  { key: 'chest', label: 'Chest', group: 'Chest', color: '#C2410C', icon: 'barbell-outline', count: 4 },
  { key: 'back', label: 'Back', group: 'Back', color: '#0F766E', icon: 'shield-outline', count: 4 },
  { key: 'shoulders', label: 'Shoulders', group: 'Shoulders', color: '#B45309', icon: 'triangle-outline', count: 3 },
  { key: 'legs', label: 'Legs', group: 'Legs', color: '#4338CA', icon: 'walk-outline', count: 4 },
  { key: 'arms', label: 'Arms', group: 'Arms', color: '#BE185D', icon: 'fitness-outline', count: 3 },
  { key: 'abs', label: 'Abs', group: 'Abs', color: '#4D7C0F', icon: 'scan-outline', count: 2 }
];

const beginnerTips = [
  {
    id: 'tip_1',
    title: 'Mind-Muscle Intent',
    body: 'Initiate every back pull by retracting your shoulder blades before bending your elbows.',
    tag: 'Back & Posture',
    color: '#0F766E'
  },
  {
    id: 'tip_2',
    title: 'Controlled Eccentric',
    body: 'Lower the weight under a strict 2-3 second count to maximize muscle fiber micro-trauma safely.',
    tag: 'All Movements',
    color: '#C2410C'
  },
  {
    id: 'tip_3',
    title: 'Wrist Neutrality',
    body: 'Keep wrists straight under heavy pressing to protect median nerves and direct load to pectorals.',
    tag: 'Chest & Shoulders',
    color: '#B45309'
  }
];

export default function LearnScreen() {
  const { theme, radii } = useAppTheme();
  const { exercises } = useWorkoutStore();

  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch =
        searchQuery.trim().length === 0 ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesGroup =
        selectedGroup === 'all' || ex.muscleGroup.toLowerCase() === selectedGroup.toLowerCase();

      return matchesSearch && matchesGroup;
    });
  }, [exercises, searchQuery, selectedGroup]);

  const featuredExercise = filteredExercises[0] || exercises[0];

  const getMuscleColor = (group: string) => {
    const g = group.toLowerCase();
    if (g.includes('chest')) return '#C2410C';
    if (g.includes('back')) return '#0F766E';
    if (g.includes('leg')) return '#4338CA';
    if (g.includes('shoulder')) return '#B45309';
    if (g.includes('arm')) return '#BE185D';
    if (g.includes('abs') || g.includes('core')) return '#4D7C0F';
    return theme.primary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.topBar, { borderBottomColor: theme.borderSubtle }]}>
        <View style={styles.topBarBrand}>
          <BrandLogo size={32} />
          <View>
            <Text style={[styles.brandTitle, { color: theme.primary }]}>AI FitWear</Text>
            <View style={styles.watchSyncMiniRow}>
              <View style={[styles.syncDot, { backgroundColor: theme.onTrack }]} />
              <Text style={[styles.syncMiniText, { color: theme.textSecondary }]}>
                Wrist guidance ready
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.offlineBadge, { backgroundColor: theme.primaryContainer }]}>
          <Ionicons name="film-outline" size={14} color={theme.primary} />
          <Text style={[styles.offlineBadgeText, { color: theme.primary }]}>Video & Cues</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={[styles.mainHeadline, { color: theme.text }]}>Action Guidance</Text>
          <Text style={[styles.mainSubtext, { color: theme.textSecondary }]}>
            Master technique with beginner form cues & wrist cues
          </Text>

          <View style={[styles.searchBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search exercise tutorials or form cues..."
              placeholderTextColor={theme.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {muscleGroups.map((m) => (
            <Chip
              key={m.key}
              label={m.label}
              selected={selectedGroup === m.key}
              onPress={() => {
                setSelectedGroup(m.key);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              }}
            />
          ))}
        </ScrollView>

        {featuredExercise && (
          <Pressable
            onPress={() => router.push(`/exercise-detail?id=${featuredExercise.id}`)}
            style={[
              styles.featuredCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.lg,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.featuredVideoWrapper}>
              <Image
                source={{
                  uri:
                    featuredExercise.muscleGroup === 'Chest'
                      ? 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
                      : featuredExercise.muscleGroup === 'Back'
                      ? 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&q=80'
                      : 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80'
                }}
                style={styles.featuredVideoImage}
              />
              <View style={styles.videoGradientOverlay} />

              <View style={styles.playCenterPill}>
                <Ionicons name="play" size={24} color="#FFFFFF" style={{ marginLeft: 3 }} />
              </View>

              <View style={styles.videoDurationPill}>
                <Ionicons name="time-outline" size={12} color="#FFFFFF" />
                <Text style={styles.videoDurationText}>0:45 Loop • Watch Cues</Text>
              </View>
            </View>

            <View style={styles.featuredCardContent}>
              <View style={styles.featuredMetaRow}>
                <View
                  style={[
                    styles.groupPill,
                    { backgroundColor: `${getMuscleColor(featuredExercise.muscleGroup)}18` }
                  ]}
                >
                  <Text
                    style={[
                      styles.groupPillText,
                      { color: getMuscleColor(featuredExercise.muscleGroup) }
                    ]}
                  >
                    {featuredExercise.muscleGroup.toUpperCase()}
                  </Text>
                </View>

                <View style={[styles.equipPill, { backgroundColor: theme.surfaceElevated }]}>
                  <Text style={[styles.equipPillText, { color: theme.textSecondary }]}>
                    {featuredExercise.equipment.toUpperCase()}
                  </Text>
                </View>

                <View style={[styles.equipPill, { backgroundColor: theme.surfaceElevated }]}>
                  <Text style={[styles.equipPillText, { color: theme.primary }]}>
                    {featuredExercise.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={[styles.featuredTitle, { color: theme.text }]}>
                {featuredExercise.name}
              </Text>
              <Text style={[styles.featuredDesc, { color: theme.textSecondary }]} numberOfLines={2}>
                {featuredExercise.description}
              </Text>

              {featuredExercise.formCues && featuredExercise.formCues[0] && (
                <View style={[styles.primeCueBox, { backgroundColor: theme.surfaceElevated }]}>
                  <Ionicons name="checkmark-circle" size={16} color={theme.onTrack} />
                  <Text style={[styles.primeCueText, { color: theme.text }]} numberOfLines={2}>
                    <Text style={{ fontWeight: '700', color: theme.onTrack }}>Key Cue: </Text>
                    {featuredExercise.formCues[0]}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Target Muscle Guides</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Master each compound vector with strict safety rules
          </Text>
        </View>

        <View style={styles.muscleGrid}>
          {muscleGroups
            .filter((m) => m.key !== 'all')
            .map((m) => (
              <Pressable
                key={m.key}
                onPress={() => {
                  setSelectedGroup(m.key);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                }}
                style={[
                  styles.muscleGridCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: selectedGroup === m.key ? m.color : theme.border,
                    borderRadius: radii.md
                  }
                ]}
              >
                <View style={[styles.muscleGridIcon, { backgroundColor: `${m.color}15` }]}>
                  <Ionicons name={m.icon} size={20} color={m.color} />
                </View>
                <Text style={[styles.muscleGridTitle, { color: theme.text }]}>{m.label}</Text>
                <Text style={[styles.muscleGridCount, { color: theme.textSecondary }]}>
                  {m.count} movements
                </Text>
              </Pressable>
            ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Beginner Form Cues</Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Fundamental cues for joint longevity and hypertrophy
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tipsScroll}
        >
          {beginnerTips.map((tip) => (
            <View
              key={tip.id}
              style={[
                styles.tipCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  borderRadius: radii.lg,
                  ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                }
              ]}
            >
              <View style={styles.tipTopRow}>
                <View style={[styles.tipTagBadge, { backgroundColor: `${tip.color}15` }]}>
                  <Text style={[styles.tipTagText, { color: tip.color }]}>{tip.tag}</Text>
                </View>
                <Ionicons name="sparkles" size={16} color={tip.color} />
              </View>
              <Text style={[styles.tipTitle, { color: theme.text }]}>{tip.title}</Text>
              <Text style={[styles.tipBody, { color: theme.textSecondary }]}>{tip.body}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View style={styles.libraryHeaderLeft}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Movement Library</Text>
            <View style={[styles.countBadge, { backgroundColor: theme.surfaceElevated }]}>
              <Text style={[styles.countBadgeText, { color: theme.textSecondary }]}>
                {filteredExercises.length} available
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.exerciseList}>
          {filteredExercises.map((ex: ExerciseDoc) => {
            const muscleColor = getMuscleColor(ex.muscleGroup);

            return (
              <Pressable
                key={ex.id}
                onPress={() => router.push(`/exercise-detail?id=${ex.id}`)}
                style={[
                  styles.exerciseCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    borderRadius: radii.md,
                    ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
                  }
                ]}
              >
                <View style={styles.exerciseCardLeft}>
                  <View style={[styles.exerciseMusclePill, { backgroundColor: `${muscleColor}15` }]}>
                    <Text style={[styles.exerciseMuscleText, { color: muscleColor }]}>
                      {ex.muscleGroup}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={[styles.exerciseName, { color: theme.text }]} numberOfLines={1}>
                      {ex.name}
                    </Text>
                    <Text style={[styles.exerciseDesc, { color: theme.textSecondary }]} numberOfLines={1}>
                      {ex.description}
                    </Text>

                    <View style={styles.exerciseBadgesRow}>
                      <View style={[styles.microBadge, { backgroundColor: theme.surfaceElevated }]}>
                        <Text style={[styles.microBadgeText, { color: theme.textSecondary }]}>
                          {ex.equipment}
                        </Text>
                      </View>
                      <View style={[styles.microBadge, { backgroundColor: theme.surfaceElevated }]}>
                        <Text style={[styles.microBadgeText, { color: theme.textSecondary }]}>
                          {ex.difficulty}
                        </Text>
                      </View>
                      <View style={[styles.microBadge, { backgroundColor: theme.surfaceElevated }]}>
                        <Ionicons name="watch-outline" size={11} color={theme.primary} />
                        <Text style={[styles.microBadgeText, { color: theme.primary, marginLeft: 2 }]}>
                          Wrist loop
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1
  },
  topBarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3
  },
  watchSyncMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  syncMiniText: {
    fontSize: 11,
    fontWeight: '500'
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9999
  },
  offlineBadgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110
  },
  headerSection: {
    marginBottom: 16
  },
  mainHeadline: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5
  },
  mainSubtext: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
    marginBottom: 14
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0
  },
  chipsScroll: {
    gap: 8,
    paddingBottom: 16
  },
  featuredCard: {
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24
  },
  featuredVideoWrapper: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: '#161C1B'
  },
  featuredVideoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  videoGradientOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)'
  },
  playCenterPill: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 94, 83, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)'
  },
  videoDurationPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  videoDurationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  featuredCardContent: {
    padding: 16
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  groupPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  groupPillText: {
    fontSize: 11,
    fontWeight: '800'
  },
  equipPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  equipPillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4
  },
  featuredDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12
  },
  primeCueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 8
  },
  primeCueText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16
  },
  sectionHeader: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700'
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24
  },
  muscleGridCard: {
    width: '31%',
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  },
  muscleGridIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  muscleGridTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center'
  },
  muscleGridCount: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center'
  },
  tipsScroll: {
    gap: 12,
    paddingBottom: 24
  },
  tipCard: {
    width: 250,
    borderWidth: 1,
    padding: 16
  },
  tipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  tipTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  tipTagText: {
    fontSize: 10,
    fontWeight: '800'
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6
  },
  tipBody: {
    fontSize: 12,
    lineHeight: 17
  },
  libraryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '600'
  },
  exerciseList: {
    gap: 10
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1
  },
  exerciseCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  exerciseMusclePill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center'
  },
  exerciseMuscleText: {
    fontSize: 10,
    fontWeight: '800'
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '700'
  },
  exerciseDesc: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 6
  },
  exerciseBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  microBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  microBadgeText: {
    fontSize: 10,
    fontWeight: '600'
  }
});
