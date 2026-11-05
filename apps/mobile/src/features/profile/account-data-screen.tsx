import { useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router } from "expo-router"

import { Pressable } from "@/components/pressable"
import { Sheet, SheetActions } from "@/components/sheet"
import { Palette as C } from "@/theme"
import { useAuth } from "@/features/auth"

export function AccountDataScreen() {
  const insets = useSafeAreaInsets()
  const { user, deleteAccount, pending } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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
