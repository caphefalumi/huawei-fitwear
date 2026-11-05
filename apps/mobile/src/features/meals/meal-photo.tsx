import { Image, type ImageProps } from "expo-image"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Text, View } from "react-native"
import { Pressable } from "@/components/pressable"
import { Palette as C } from "@/theme"
import { useAuth } from "@/features/auth"
import { mealsQueryKeys } from "@/features/meals/meals-store"
import { apiErrorMessage, apiRequest } from "@/lib/api"
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
    queryFn: async ({ signal }) =>
      (
        await apiRequest<{ imageUrl: string }>(`/meals/${encodeURIComponent(mealId!)}/photo`, {
          signal,
        })
      ).imageUrl,
  })
  const [imageError, setImageError] = useState<string | null>(null)
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
            void photoQuery.refetch()
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
  return (
    <View style={style}>
      <Image
        source={{ uri }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        accessibilityLabel="Logged meal photo"
        onError={() => setImageError("This meal photo could not be displayed. Please try again.")}
      />
      {photoQuery.error && uri ? (
        <Text accessibilityRole="alert" style={{ color: C.textMuted }}>
          Could not refresh. Showing the saved photo.
        </Text>
      ) : null}
    </View>
  )
}
