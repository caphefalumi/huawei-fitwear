import { useMutation } from "@tanstack/react-query"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Pressable } from "@/components/pressable"
import { Sheet } from "@/components/sheet"
import { BackHeader, Button } from "@/components/ui"
import { pickImage, validatePickedImage } from "@/features/camera"
import { Palette as C } from "@/theme"

import { analyzeMeal } from "./meals-api"
import { useMeals } from "./meals-hooks"
import { icons } from "./meals-ui"

const TUTORIAL_STEPS = [
  { title: "Add a ruler", detail: "Place a 15 cm ruler beside the plate or cup." },
  { title: "Shoot from above", detail: "Keep the whole meal in frame and hold steady." },
]

export function MealCaptureScreen() {
  const insets = useSafeAreaInsets()
  const { tutorialSeen, dismissTutorial, setAnalysis, setDraftPhoto, items } = useMeals()
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<{
    uri: string
    base64: string
    mimeType: "image/jpeg" | "image/png"
  } | null>(null)
  const analyzeMutation = useMutation({
    mutationFn: (body: { image: string; mimeType: string; description?: string }) =>
      analyzeMeal(body),
  })
  const [error, setError] = useState<string | null>(null)
  const active = useRef(true)
  const request = useRef(0)
  const cameraRef = useRef<CameraView>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const busy = analyzeMutation.isPending
  useEffect(() => {
    const activeRef = active
    const requestRef = request
    activeRef.current = true
    return () => {
      activeRef.current = false
      requestRef.current++
    }
  }, [])

  async function selectLibrary() {
    if (busy) return
    setError(null)
    try {
      const picked = await pickImage(false)
      if (picked && active.current) setImage(picked)
    } catch (cause) {
      if (active.current)
        setError(cause instanceof Error ? cause.message : "Could not open image picker.")
    }
  }
  async function takePhoto() {
    if (busy) return
    setError(null)
    try {
      const photo = await cameraRef.current?.takePictureAsync({ base64: true, quality: 0.7 })
      if (!photo) throw new Error("Could not capture photo. Try again.")
      const validated = validatePickedImage(photo.uri, photo.base64)
      if (active.current) setImage(validated)
    } catch (cause) {
      if (active.current)
        setError(cause instanceof Error ? cause.message : "Could not capture photo. Try again.")
    }
  }
  async function analyze() {
    if (!image || busy) return
    if (items.length) {
      setError(
        "Your current meal draft has items. Review or clear that draft before analyzing another meal.",
      )
      return
    }
    const current = ++request.current
    setError(null)
    analyzeMutation.reset()
    try {
      const result = await analyzeMutation.mutateAsync({
        image: image.base64,
        mimeType: image.mimeType,
        ...(description.trim() ? { description: description.trim() } : {}),
      })
      if (!active.current || current !== request.current) return
      if (!result.length)
        throw new Error("No food was identified. Try another photo or enter items manually.")
      setAnalysis(result, image.uri, { data: image.base64, mimeType: image.mimeType })
      router.push("/meal")
    } catch (cause) {
      if (active.current && current === request.current)
        setError(
          cause instanceof Error
            ? cause.message
            : "Photo analysis is unavailable. You can enter nutrition manually.",
        )
    }
  }

  const cameraGranted = permission?.granted ?? false

  return (
    <>
      <View
        style={[styles.screen, { paddingTop: 12 + insets.top, paddingBottom: 16 + insets.bottom }]}
      >
        <BackHeader label="Meals" onPress={() => router.back()} />

        <View style={styles.heading}>
          <Text accessibilityRole="header" style={styles.title}>
            Capture Meal
          </Text>
          <Text style={styles.subtitle}>Capture food or drinks.</Text>
        </View>

        <View style={styles.previewWrap}>
          {image ? (
            <>
              <Image
                accessible
                accessibilityLabel="Selected meal photo"
                source={{ uri: image.uri }}
                style={styles.preview}
                contentFit="cover"
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Retake photo"
                onPress={() => {
                  setImage(null)
                  setError(null)
                }}
                style={styles.retake}
              >
                <Text style={styles.retakeLabel}>Retake</Text>
              </Pressable>
            </>
          ) : !permission ? (
            <View style={styles.preview} />
          ) : !cameraGranted ? (
            <View style={styles.preview}>
              <View style={styles.circle}>
                <Image
                  accessible={false}
                  source={icons.utensils}
                  style={styles.circleIcon}
                  contentFit="contain"
                />
                <Text style={styles.circleTitle}>Camera access needed</Text>
                <Text style={styles.circleNote}>Allow access or pick from library</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Allow camera access"
                onPress={requestPermission}
                style={styles.permissionButton}
              >
                <Text style={styles.permissionLabel}>Allow camera access</Text>
              </Pressable>
              <Text style={styles.circleNote}>or pick a photo from your library below</Text>
            </View>
          ) : (
            <CameraView ref={cameraRef} style={styles.preview} facing="back" />
          )}
        </View>

        <View style={styles.bottom}>
          {error ? (
            <Text accessibilityRole="alert" numberOfLines={2} style={styles.error}>
              {error} Manual entry remains available.
            </Text>
          ) : null}
          <View style={styles.shutterRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Take meal photo"
              disabled={busy || (!image && !cameraGranted)}
              style={styles.shutterRing}
              onPress={image ? () => setImage(null) : takePhoto}
            >
              <View style={styles.shutter} />
            </Pressable>
            <Pressable
              accessibilityLabel="Choose from library"
              disabled={busy}
              onPress={selectLibrary}
              style={styles.libraryChip}
            >
              <Image
                accessible={false}
                source={icons.images}
                style={styles.libraryIcon}
                contentFit="contain"
              />
              <Text style={styles.libraryChipLabel}>Library</Text>
            </Pressable>
          </View>
          <TextInput
            accessibilityLabel="Optional meal description"
            value={description}
            onChangeText={setDescription}
            placeholder="Add details (e.g. ingredients, size)."
            placeholderTextColor={C.textMuted}
            maxLength={120}
            returnKeyType="done"
            style={styles.description}
          />
          <Text numberOfLines={2} style={styles.footnote}>
            Only when you tap Analyze, your selected photo and description are sent to the
            configured cloud model. Estimates must be reviewed; no wearable or medical measurements
            are inferred.
          </Text>
          <Button
            label="Analyze photo"
            disabled={!image || busy}
            busy={busy}
            onPress={analyze}
            style={styles.compactButton}
          />
          <Button
            variant="secondary"
            label="Enter meal manually"
            onPress={() => {
              if (image) setDraftPhoto(image.uri, { data: image.base64, mimeType: image.mimeType })
              router.push("/meal")
            }}
            style={styles.compactButton}
          />
        </View>
      </View>

      <Sheet visible={!tutorialSeen} title="Capture your meal" onClose={dismissTutorial}>
        <View style={styles.tutorialSteps}>
          {TUTORIAL_STEPS.map((step, index) => (
            <View key={step.title} style={styles.tutorialStep}>
              <View style={styles.tutorialMarker}>
                <Text style={styles.tutorialMarkerLabel}>{index + 1}</Text>
              </View>
              <View style={styles.tutorialCopy}>
                <Text style={styles.tutorialTitle}>{step.title}</Text>
                <Text style={styles.tutorialDetail}>{step.detail}</Text>
              </View>
            </View>
          ))}
        </View>
        <Pressable style={styles.primary} onPress={dismissTutorial}>
          <Text style={styles.primaryLabel}>Got it</Text>
        </Pressable>
      </Sheet>
    </>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
    paddingHorizontal: 24,
    gap: 10,
  },
  heading: {
    gap: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
    color: C.text,
  },
  subtitle: {
    fontSize: 12,
    color: C.textMuted,
  },
  previewWrap: {
    flex: 1,
    minHeight: 200,
  },
  preview: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#2B2724",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    overflow: "hidden",
  },
  retake: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  retakeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  circle: {
    minWidth: 160,
    minHeight: 160,
    padding: 16,
    borderRadius: 80,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  circleIcon: {
    width: 26,
    height: 26,
  },
  circleTitle: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
    color: "rgba(255,255,255,0.92)",
  },
  circleNote: {
    fontSize: 10,
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
  },
  permissionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: C.accent,
  },
  permissionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.onAccent,
  },
  bottom: {
    gap: 8,
  },
  error: {
    fontSize: 11,
    lineHeight: 15,
    color: C.accent,
  },
  shutterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  shutterRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "rgba(157,35,50,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  shutter: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: C.accent,
  },
  libraryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  libraryIcon: {
    width: 18,
    height: 18,
  },
  libraryChipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.text,
  },
  description: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: C.text,
  },
  footnote: {
    fontSize: 10,
    lineHeight: 14,
    color: C.textMuted,
  },
  compactButton: {
    minHeight: 46,
    paddingVertical: 12,
  },
  tutorialSteps: {
    gap: 14,
  },
  tutorialStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tutorialMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.accentTint,
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialMarkerLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.accent,
  },
  tutorialCopy: {
    flex: 1,
    gap: 2,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.text,
  },
  tutorialDetail: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
  },
  primary: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: C.onAccent,
  },
})
