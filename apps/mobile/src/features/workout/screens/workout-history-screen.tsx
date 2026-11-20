import { router, useLocalSearchParams, type Href } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BackHeader, Button, PageHeading, Screen } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Palette as C } from "@/theme"

import { useWorkouts, type SessionWithSets } from "../hooks/workout-hooks"

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export function WorkoutHistoryScreen() {
  const { sessions, loading, historyMessage, error, refreshing, refresh, hasMore, loadMore } =
    useWorkouts()
  const insets = useSafeAreaInsets()
  const [loadingMore, setLoadingMore] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const pendingPage = useRef(false)

  const nextPage = async () => {
    if (pendingPage.current || !hasMore) return
    pendingPage.current = true
    setLoadingMore(true)
    setPageError(null)
    try {
      await loadMore()
    } catch {
      setPageError("Could not load more workouts. Please try again.")
    } finally {
      pendingPage.current = false
      setLoadingMore(false)
    }
  }

  const retry = async () => {
    try {
      await refresh()
    } catch {
      /* The workout provider exposes the error. */
    }
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 26 },
      ]}
      contentInsetAdjustmentBehavior="automatic"
      data={sessions}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.header}>
          <BackHeader label="Workout plan" onPress={() => router.back()} />
          <PageHeading title="Workout history" subtitle="Your saved workouts and sets." />
          {sessions.length > 0 && error ? (
            <Text style={styles.message} selectable>
              {error}
            </Text>
          ) : null}
          {sessions.length > 0 && error ? (
            <Button label="Retry" variant="secondary" onPress={() => void retry()} />
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          accessibilityLabel={`View ${item.sessionTitle}, ${formatDate(item.startedAt)}`}
          onPress={() => router.push(`/workout-history/${encodeURIComponent(item.id)}` as Href)}
        >
          <Text style={styles.title}>{item.sessionTitle}</Text>
          <Text style={styles.message}>
            {formatDate(item.startedAt)} · {item.completedAt ? "Completed" : "In progress"}
          </Text>
        </Pressable>
      )}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator accessibilityLabel="Loading workout history" color={C.accent} />
        ) : historyMessage || error ? (
          <View style={styles.card}>
            <Text style={styles.message} selectable>
              {historyMessage || error}
            </Text>
            <Button label="Retry" variant="secondary" onPress={() => void retry()} />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>No workouts yet</Text>
            <Text style={styles.message}>Your saved workouts will appear here.</Text>
          </View>
        )
      }
      ListFooterComponent={
        sessions.length > 0 && hasMore ? (
          <View style={styles.footer}>
            {pageError ? (
              <Text style={styles.message} selectable>
                {pageError}
              </Text>
            ) : null}
            <Button
              label={pageError ? "Retry loading more" : "Load more"}
              variant="secondary"
              busy={loadingMore}
              onPress={() => void nextPage()}
            />
          </View>
        ) : undefined
      }
      refreshing={refreshing && !loadingMore}
      onRefresh={() => void retry()}
    />
  )
}

export function WorkoutHistoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const { loadSession } = useWorkouts()
  const loadSessionRef = useRef(loadSession)
  loadSessionRef.current = loadSession
  const [session, setSession] = useState<SessionWithSets | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    let active = true
    setSession(null)
    setError(null)
    setLoading(true)
    if (!id) {
      setError("This workout could not be found.")
      setLoading(false)
    } else {
      void loadSessionRef
        .current(id)
        .then(
          (result) => {
            if (active) setSession(result)
          },
          () => {
            if (active) setError("Could not load this workout. Please try again.")
          },
        )
        .finally(() => {
          if (active) setLoading(false)
        })
    }
    return () => {
      active = false
    }
  }, [id, attempt])

  return (
    <Screen contentStyle={styles.detailContent}>
      <BackHeader label="Workout history" onPress={() => router.back()} />
      <PageHeading
        title={session?.sessionTitle ?? "Workout details"}
        subtitle={session ? formatDate(session.startedAt) : undefined}
      />
      {loading ? (
        <ActivityIndicator accessibilityLabel="Loading workout details" color={C.accent} />
      ) : null}
      {!loading && error ? (
        <View style={styles.card}>
          <Text style={styles.message} selectable>
            {error}
          </Text>
          {id ? <Button label="Retry" variant="secondary" onPress={retry} /> : null}
        </View>
      ) : null}
      {!loading && session ? (
        <>
          <Text style={styles.message}>
            {session.completedAt ? `Completed ${formatDate(session.completedAt)}` : "In progress"}
          </Text>
          {session.sets.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.message}>No sets saved for this workout.</Text>
            </View>
          ) : (
            session.sets.map((set) => (
              <View key={set.id} style={styles.card}>
                <Text style={styles.title}>{set.exercise?.name ?? "Exercise"}</Text>
                <Text style={styles.message} selectable>
                  Set {set.setIndex} · {set.userConfirmedReps}{" "}
                  {set.exercise?.repetitionUnit ?? "reps"} · {set.weightKg} kg
                </Text>
              </View>
            ))
          )}
        </>
      ) : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 24, gap: 12 },
  detailContent: { gap: 12 },
  header: { gap: 18, paddingBottom: 8 },
  card: { backgroundColor: C.surface, borderRadius: 18, padding: 16, gap: 6 },
  title: { color: C.text, fontSize: 16, fontWeight: "600" },
  message: { color: C.textMuted, fontSize: 14, lineHeight: 20 },
  footer: { gap: 8, paddingTop: 4 },
})
