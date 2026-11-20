import { useQueryClient } from "@tanstack/react-query"
import { Directory, File } from "expo-file-system"
import { router } from "expo-router"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import { Sheet, SheetActions } from "@/components/ui/sheet"
import { useAuth } from "@/features/auth"
import { workoutQueryKeys } from "@/features/workout/hooks/workout-hooks"
import { Palette as C } from "@/theme"

import { exportWorkoutArchive, importWorkoutArchive } from "../workout-portability"

export function AccountDataScreen() {
  const insets = useSafeAreaInsets()
  const { user, deleteAccount, pending } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const [portabilityBusy, setPortabilityBusy] = useState(false)
  const [portabilityMessage, setPortabilityMessage] = useState<string | null>(null)

  const exportWorkouts = async () => {
    if (!user || portabilityBusy) return
    setPortabilityBusy(true)
    setPortabilityMessage(null)
    try {
      const archive = await exportWorkoutArchive(user.id)
      const directory = await Directory.pickDirectoryAsync()
      const file = directory.createFile(
        `voochealth-workouts-${Date.now()}.json`,
        "application/json",
      )
      await file.write(archive.text)
      setPortabilityMessage(
        `Saved ${archive.completed} completed workouts.${archive.unfinished ? ` ${archive.unfinished} unfinished workouts were not included.` : ""}`,
      )
    } catch (error) {
      setPortabilityMessage(
        error instanceof Error ? error.message : "Could not export workouts. Please try again.",
      )
    } finally {
      setPortabilityBusy(false)
    }
  }

  const importWorkouts = async () => {
    if (!user || portabilityBusy) return
    setPortabilityBusy(true)
    setPortabilityMessage(null)
    try {
      const selection = await File.pickFileAsync({ mimeTypes: ["application/json", "text/plain"] })
      if (selection.canceled) return
      const count = await importWorkoutArchive(await selection.result.text(), user.id)
      setPortabilityMessage(
        `Imported ${count} completed workouts. Existing matching workouts were kept.`,
      )
    } catch (error) {
      setPortabilityMessage(
        error instanceof Error ? error.message : "Could not import workouts. Please try again.",
      )
    } finally {
      await queryClient.invalidateQueries({ queryKey: workoutQueryKeys.all(user.id) })
      setPortabilityBusy(false)
    }
  }

  const removeAccount = async () => {
    setDeleteError(null)
    try {
      await deleteAccount()
    } catch {
      setDeleteError("Could not delete your account. Try again.")
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to Profile"
          style={styles.back}
          onPress={() => router.back()}
        >
          <Text style={styles.backLabel}>‹ Profile</Text>
        </Pressable>
        <Text accessibilityRole="header" style={styles.title}>
          Account &amp; data
        </Text>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Account
          </Text>
          <View style={styles.emailRow}>
            <Text style={styles.rowLabel}>Email</Text>
            <Text selectable numberOfLines={1} ellipsizeMode="middle" style={styles.email}>
              {user?.email ?? "—"}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.sectionTitle}>
            Workout history
          </Text>
          <Text style={styles.consequence}>
            Export completed workouts to a JSON file, or import a VoocHealth workout file.
            Unfinished workouts are not included.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Export workout history"
            disabled={portabilityBusy || !user}
            style={styles.emailRow}
            onPress={() => void exportWorkouts()}
          >
            <Text style={styles.rowLabel}>
              {portabilityBusy ? "Working…" : "Export workout history"}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Import workout history"
            disabled={portabilityBusy || !user}
            style={styles.emailRow}
            onPress={() => void importWorkouts()}
          >
            <Text style={styles.rowLabel}>Import workout history</Text>
          </Pressable>
          {portabilityMessage ? (
            <Text accessibilityRole="alert" selectable style={styles.consequence}>
              {portabilityMessage}
            </Text>
          ) : null}
        </View>

        <View style={styles.deleteArea}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            style={styles.deleteCard}
            onPress={() => setConfirming(true)}
          >
            <Text style={styles.deleteLabel}>Delete account</Text>
          </Pressable>
          <Text style={styles.consequence}>
            Permanently deletes your profile, health data, and plan.
          </Text>
        </View>
      </ScrollView>

      <Sheet visible={confirming} title="Delete your account?" onClose={() => setConfirming(false)}>
        <Text style={styles.confirmation}>
          Your profile, health data, and plan will be permanently deleted. This can't be undone.
        </Text>
        {deleteError ? (
          <Text accessibilityRole="alert" style={styles.deleteError}>
            {deleteError}
          </Text>
        ) : null}
        <SheetActions
          primaryLabel="Delete account"
          secondaryLabel="Cancel"
          primaryAccessibilityLabel="Confirm account deletion"
          onPrimary={() => void removeAccount()}
          onSecondary={() => setConfirming(false)}
          primaryDisabled={pending}
          secondaryDisabled={pending}
          busy={pending}
        />
      </Sheet>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    gap: 20,
  },
  back: {
    minHeight: 44,
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  backLabel: {
    color: C.accent,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: C.surface,
  },
  sectionTitle: {
    paddingBottom: 8,
    color: C.text,
    fontSize: 16,
    fontWeight: "600",
  },
  emailRow: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  rowLabel: {
    color: C.text,
    fontSize: 14,
  },
  email: {
    flexShrink: 1,
    color: C.textMuted,
    fontSize: 14,
    textAlign: "right",
  },
  deleteArea: {
    marginTop: "auto",
    gap: 8,
  },
  deleteCard: {
    minHeight: 56,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#8B1E2D",
    backgroundColor: C.surface,
  },
  deleteLabel: {
    color: "#8B1E2D",
    fontSize: 15,
    fontWeight: "600",
  },
  consequence: {
    color: C.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  confirmation: {
    color: C.text,
    fontSize: 15,
    lineHeight: 22,
  },
  deleteError: {
    color: "#8B1E2D",
    fontSize: 14,
  },
})
