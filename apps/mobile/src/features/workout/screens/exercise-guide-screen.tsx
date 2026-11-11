import { Image } from "expo-image"
import { router, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"

import { BackHeader, Card, PageHeading, Screen, SectionHeading } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { affects, injuryTitle, useActiveInjuries } from "@/features/recovery"
import { useMarkInteractive } from "@/lib/monitoring/observe"
import { Palette as C } from "@/theme"

import { VideoPlaceholder } from "../components/video-placeholder"
import { formatLoad, loadUnit, useLoads } from "../store/training-weights.store"
import { CATALOG, findExercise } from "../utils/catalog"
import { capitalize, EQUIPMENT_LABELS, exercisesIn } from "../utils/muscle-groups"

const icons = {
  shieldCheck: require("@/assets/images/home/shield-check.svg"),
}

const list = (items: string[]) => items.map(capitalize).join(", ")

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  )
}

export function ExerciseGuideScreen() {
  useMarkInteractive()
  const { name } = useLocalSearchParams<{ name?: string }>()
  const exercise = findExercise(name) ?? CATALOG[0]!
  const injury = useActiveInjuries().find((active) => affects(active.area, exercise))
  const load = useLoads().loadFor(exercise)
  const [showAll, setShowAll] = useState(false)

  const [primary = exercise.group, ...secondary] = exercise.muscles
  const siblings = exercisesIn(exercise.group)
  const index = siblings.findIndex((item) => item.key === exercise.key)
  const previous = siblings[index - 1]
  const next = siblings[index + 1]

  return (
    <Screen contentStyle={styles.content}>
      <BackHeader label="Back" onPress={() => router.back()} />

      <VideoPlaceholder title={exercise.name} />

      <PageHeading title={exercise.name} subtitle="Technique guide" />

      <Card style={styles.muscles}>
        <View style={styles.primaryRow}>
          <View style={styles.primaryCopy}>
            <Text style={styles.detailLabel}>Main muscle</Text>
            <Text style={styles.primaryValue}>{capitalize(primary)}</Text>
          </View>
          <Pressable
            hitSlop={10}
            accessibilityState={{ expanded: showAll }}
            onPress={() => setShowAll((value) => !value)}
          >
            <Text style={styles.link}>{showAll ? "Show less" : "Show all"}</Text>
          </Pressable>
        </View>
        {showAll ? (
          <View style={styles.details}>
            {secondary.length ? <DetailRow label="Also works" value={list(secondary)} /> : null}
            <DetailRow label="Joints under load" value={list(exercise.joints)} />
            <DetailRow label="Equipment" value={EQUIPMENT_LABELS[exercise.equipment]} />
            <DetailRow
              label="Type"
              value={
                exercise.compound ? "Compound, works several joints" : "Isolation, works one joint"
              }
            />
          </View>
        ) : null}
      </Card>

      {load ? (
        <Pressable
          style={styles.weight}
          accessibilityLabel={`Your weight ${formatLoad(load.kg)} ${loadUnit(exercise)}. Edit in Profile`}
          onPress={() => router.push(`/training-weights?edit=${exercise.key}`)}
        >
          <View>
            <Text style={styles.detailLabel}>
              {load.custom ? "Your weight" : "Your weight (suggested)"}
            </Text>
            <Text style={styles.weightValue}>
              {formatLoad(load.kg)} <Text style={styles.weightUnit}>{loadUnit(exercise)}</Text>
            </Text>
          </View>
          <Text style={styles.link}>Edit in Profile ›</Text>
        </Pressable>
      ) : (
        <View style={styles.weight}>
          <View>
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.weightValue}>Body weight</Text>
          </View>
        </View>
      )}

      <View style={styles.cues}>
        <SectionHeading title={`${exercise.cues.length} key cues`} />
        {exercise.cues.map((cue, number) => (
          <View key={cue.title} style={styles.cue}>
            <View style={styles.cueMarker}>
              <Text style={styles.cueMarkerLabel}>{number + 1}</Text>
            </View>
            <View style={styles.cueCopy}>
              <Text style={styles.cueTitle}>{cue.title}</Text>
              <Text style={styles.cueDetail}>{cue.detail}</Text>
            </View>
          </View>
        ))}
      </View>

      {injury ? (
        <View style={styles.warning}>
          <Image source={icons.shieldCheck} style={styles.warningIcon} contentFit="contain" />
          <Text style={styles.warningText}>
            {injuryTitle([injury])}: review only, stop if you feel pain.
          </Text>
        </View>
      ) : null}

      <View style={styles.pager}>
        {[
          { item: previous, label: "‹ Previous", align: styles.pageStart },
          { item: next, label: "Next ›", align: styles.pageEnd },
        ].map(({ item, label, align }) => (
          <Pressable
            key={label}
            style={[styles.page, align, !item && styles.pageEmpty]}
            disabled={!item}
            accessibilityLabel={
              item ? `${label.replace(/[‹›]/g, "").trim()}: ${item.name}` : undefined
            }
            onPress={() => item && router.replace(`/exercise-guide?name=${item.key}`)}
          >
            <Text style={styles.pageLabel}>{label}</Text>
            <Text style={styles.pageName} numberOfLines={1}>
              {item?.name ?? "None"}
            </Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: 14,
  },
  muscles: {
    padding: 14,
    gap: 12,
  },
  primaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  primaryCopy: {
    gap: 2,
  },
  primaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: C.text,
  },
  link: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
  details: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  detailValue: {
    fontSize: 13,
    color: C.text,
  },
  weight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 60,
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: "600",
    color: C.text,
  },
  weightUnit: {
    fontSize: 12,
    fontWeight: "400",
    color: C.textMuted,
  },
  cues: {
    gap: 12,
  },
  cue: {
    flexDirection: "row",
    gap: 10,
  },
  cueMarker: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: C.card,
    alignItems: "center",
    justifyContent: "center",
  },
  cueMarkerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: C.text,
  },
  cueCopy: {
    flex: 1,
    gap: 3,
  },
  cueTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  cueDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
  warning: {
    flexDirection: "row",
    alignItems: "center",
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
  pager: {
    flexDirection: "row",
    gap: 8,
  },
  page: {
    flex: 1,
    minHeight: 56,
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  pageStart: {
    alignItems: "flex-start",
  },
  pageEnd: {
    alignItems: "flex-end",
  },
  pageEmpty: {
    opacity: 0.35,
  },
  pageLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  pageName: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
})
