import { useQuery } from "@tanstack/react-query"
import { Image, type ImageProps } from "expo-image"
import { useEffect, useState } from "react"
import { Modal, StyleSheet, Text, View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"

import { Pressable } from "@/components/ui/pressable"
import { useAuth } from "@/features/auth"
import { apiErrorMessage } from "@/lib/api/client"
import { loadCachedMealPhoto, removeCachedMealPhoto } from "@/lib/storage/meal-photo-cache"
import { Palette as C } from "@/theme"

import { fetchMealPhoto } from "../api/meals-api"
import { mealsQueryKeys } from "../hooks/meals-hooks"
import { icons } from "./meals-ui"
import { ZoomableMealPhoto } from "./zoomable-meal-photo"

export function MealPhoto({
  mealId,
  mealName,
  photoUnavailableOffline,
  imageUrl,
  style,
  compact = false,
  interactive = true,
}: {
  mealId?: string
  mealName: string
  photoUnavailableOffline?: boolean
  imageUrl: string | null
  style: ImageProps["style"]
  compact?: boolean
  /** When false the photo is decorative, so the surrounding row owns the tap. */
  interactive?: boolean
}) {
  const { user } = useAuth()
  const remotePhoto = Boolean(
    mealId && (photoUnavailableOffline || imageUrl?.startsWith("/meals/")),
  )
  const photoQuery = useQuery({
    queryKey: mealsQueryKeys.photo(user?.id ?? "signed-out", mealId ?? "missing"),
    enabled: Boolean(remotePhoto && user?.id),
    queryFn: ({ signal }) =>
      loadCachedMealPhoto(
        user!.id,
        mealId!,
        () => (imageUrl ? fetchMealPhoto(mealId!, signal) : Promise.resolve(null)),
        signal,
      ),
    networkMode: "offlineFirst",
    // Saved photos cannot be replaced. Keep successful reads fresh until eviction.
    staleTime: (query) => (query.state.data ? Infinity : 0),
    gcTime: 30 * 60_000,
  })
  const [imageError, setImageError] = useState<string | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerError, setViewerError] = useState(false)
  useEffect(() => setImageError(null), [imageUrl])
  const error =
    imageError ?? (photoQuery.error ? apiErrorMessage(photoQuery.error, "your meal photo") : null)
  const uri = remotePhoto ? photoQuery.data : imageUrl
  const retryRemote = async () => {
    if (!remotePhoto || !user || !mealId) return
    await removeCachedMealPhoto(user.id, mealId).catch(() => undefined)
    await photoQuery.refetch()
  }
  if (!uri && (photoQuery.isPaused || photoUnavailableOffline))
    return (
      <View style={[style, styles.photoStatus]}>
        <Text style={{ color: C.textMuted, textAlign: "center", fontSize: compact ? 10 : 12 }}>
          Photo unavailable offline
        </Text>
      </View>
    )
  if (!imageUrl && !remotePhoto)
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
            void retryRemote()
          }}
          style={{ padding: 8 }}
        >
          <Text style={{ color: C.accent, fontSize: 12 }}>Retry</Text>
        </Pressable>
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
  if (!interactive)
    return (
      <View style={[style, styles.thumbnail]}>
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          cachePolicy="none"
          accessibilityLabel="Logged meal photo"
          onError={() => setImageError("This meal photo could not be displayed. Please try again.")}
        />
      </View>
    )
  return (
    <View>
      <Pressable
        style={[style, styles.thumbnail]}
        accessibilityRole="button"
        accessibilityLabel={`View photo of ${mealName} full screen`}
        onPress={() => {
          setViewerError(false)
          setViewerOpen(true)
        }}
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
          <GestureHandlerRootView style={styles.fullPhoto}>
            <SafeAreaView style={styles.viewer} accessibilityViewIsModal>
              <Pressable onPress={() => setViewerOpen(false)} style={styles.close}>
                <Text style={styles.closeLabel}>Close</Text>
              </Pressable>
              {viewerError ? (
                <View style={[styles.fullPhoto, styles.photoStatus]}>
                  <Text accessibilityRole="alert" style={styles.closeLabel}>
                    Could not display this photo.
                  </Text>
                  <Pressable
                    accessibilityLabel="Retry full-screen meal photo"
                    onPress={() => {
                      setViewerError(false)
                      void retryRemote()
                    }}
                  >
                    <Text style={styles.closeLabel}>Retry</Text>
                  </Pressable>
                </View>
              ) : (
                <ZoomableMealPhoto key={uri} uri={uri} onError={() => setViewerError(true)} />
              )}
            </SafeAreaView>
          </GestureHandlerRootView>
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
