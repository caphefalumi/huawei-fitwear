import { useQuery } from "@tanstack/react-query"
import { Image, type ImageProps } from "expo-image"
import { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { apiErrorMessage } from "@/lib/api/client"
import { Palette as C } from "@/theme"

import { fetchMealPhoto } from "../api/meals-api"
import { mealsQueryKeys } from "../hooks/meals-hooks"
import { icons } from "./meals-ui"

export function MealPhoto({
  mealId,
  imageUrl,
  style,
  compact = false,
}: {
  mealId?: string
  imageUrl: string | null
  style: ImageProps["style"]
  compact?: boolean
}) {
  const { user } = useAuth()
  const remotePhoto = Boolean(mealId && imageUrl?.startsWith("/meals/"))
  const photoQuery = useQuery({
    queryKey: mealsQueryKeys.photo(user?.id ?? "signed-out", mealId ?? "missing"),
    enabled: Boolean(remotePhoto && user?.id),
    queryFn: ({ signal }) => fetchMealPhoto(mealId!, signal),
    // Reuse authenticated photo data without writing private images to disk.
    staleTime: 30 * 60_000,
    gcTime: 30 * 60_000,
  })
  const [imageError, setImageError] = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  useEffect(() => setImageError(null), [imageUrl])
  const error =
    imageError ?? (photoQuery.error ? apiErrorMessage(photoQuery.error, "your meal photo") : null)
  const uri = remotePhoto ? photoQuery.data : imageUrl
  if (!imageUrl)
    return compact ? (
      <Image
        source={icons.utensils}
        style={style}
        contentFit="contain"
        accessibilityLabel="Meal without a photo"
      />
    ) : null
  if (imageError || (photoQuery.error && !uri))
    return (
      <View style={[style, { alignItems: "center", justifyContent: "center", padding: 8, gap: 8 }]}>
        <Text
          accessibilityRole="alert"
          numberOfLines={compact ? 2 : undefined}
          style={{ color: C.textMuted, fontSize: compact ? 10 : 12 }}
        >
          {compact ? "Photo unavailable" : error}
        </Text>
        <Pressable
          accessibilityLabel="Retry meal photo"
          onPress={() => {
            setImageError(null)
            if (remotePhoto) void photoQuery.refetch()
          }}
          style={{ padding: 8 }}
        >
          <Text style={{ color: C.accent, fontSize: 12 }}>Retry</Text>
        </Pressable>
      </View>
    )
  if (!uri && photoQuery.isPaused)
    return (
      <View style={[style, styles.photoStatus]}>
        <Text style={{ color: C.textMuted, textAlign: "center", fontSize: compact ? 10 : 12 }}>
          Photo unavailable offline
        </Text>
      </View>
    )
  if (photoQuery.isLoading)
    return (
      <View
        style={[style, { alignItems: "center", justifyContent: "center", padding: 8 }]}
        accessibilityLabel="Loading meal photo"
      >
        <Text style={{ color: C.textMuted }}>Loading photo…</Text>
      </View>
    )
  if (!uri) return null
  return (
    <View>
      <Pressable
        style={[style, styles.thumbnail]}
        accessibilityRole="button"
        accessibilityLabel="View meal photo full screen"
        onPress={() => setViewerOpen(true)}
      >
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          cachePolicy="none"
          accessibilityLabel="Logged meal photo"
          onError={() => setImageError("This meal photo could not be displayed. Please try again.")}
        />
      </Pressable>
      {viewerOpen ? (
        <Modal presentationStyle="fullScreen" onRequestClose={() => setViewerOpen(false)}>
          <SafeAreaView style={styles.viewer} accessibilityViewIsModal>
            <Pressable onPress={() => setViewerOpen(false)} style={styles.close}>
              <Text style={styles.closeLabel}>Close</Text>
            </Pressable>
            <Image
              source={{ uri }}
              style={styles.fullPhoto}
              contentFit="contain"
              cachePolicy="none"
              accessibilityLabel="Full-screen meal photo"
              onError={() => {
                setViewerOpen(false)
                setImageError("This meal photo could not be displayed. Please try again.")
              }}
            />
          </SafeAreaView>
        </Modal>
      ) : null}
      {photoQuery.error && uri ? (
        <Text accessibilityRole="alert" style={{ color: C.textMuted }}>
          Could not refresh. Showing the saved photo.
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  thumbnail: { overflow: "hidden", borderCurve: "continuous" },
  photoStatus: { alignItems: "center", justifyContent: "center", padding: 4 },
  viewer: { flex: 1, backgroundColor: "#000" },
  close: {
    alignSelf: "flex-end",
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  closeLabel: { color: "#fff", fontSize: 16, fontWeight: "600" },
  fullPhoto: { flex: 1, width: "100%" },
})
