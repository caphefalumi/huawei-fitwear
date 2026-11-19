import { useMutation } from "@tanstack/react-query"
import {
  CameraView,
  useCameraPermissions,
  type BarcodeScanningResult,
  type BarcodeSettings,
} from "expo-camera"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useIsFocused } from "expo-router/react-navigation"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Platform, StyleSheet, Text, TextInput, View } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BackHeader, Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Sheet } from "@/components/ui/sheet"
import { pickImage, prepareMealImage, type PickedImage } from "@/features/camera"
import { captureException, posthog } from "@/lib/analytics/posthog"
import { ApiError, apiErrorMessage } from "@/lib/api/client"
import { Palette as C } from "@/theme"

import { analyzeMeal, lookupBarcodeFood, uploadMealPhoto } from "../api/meals-api"
import { icons } from "../components/meals-ui"
import { useMeals, type FoodEntry } from "../hooks/meals-hooks"

const TUTORIAL_STEPS = [
  { title: "Add a ruler", detail: "Place a 15 cm ruler beside the plate or cup." },
  { title: "Shoot from above", detail: "Keep the whole meal in frame and hold steady." },
]

const barcodeScannerSettings: BarcodeSettings = {
  barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
}

function lookupCode({ data, type }: BarcodeScanningResult) {
  if (!/^(?:[0-9]{8}|[0-9]{12,14})$/.test(data)) return null
  if (type !== "upc_e" || data.length !== 8) return data
  const [system, a, b, c, d, e, last, check] = data
  if (last <= "2") return `${system}${a}${b}${last}0000${c}${d}${e}${check}`
  if (last === "3") return `${system}${a}${b}${c}00000${d}${e}${check}`
  if (last === "4") return `${system}${a}${b}${c}${d}00000${e}${check}`
  return `${system}${a}${b}${c}${d}${e}0000${last}${check}`
}

type BarcodePreview =
  | { kind: "loading" }
  | { kind: "found"; code: string; food: FoodEntry }
  | { kind: "manual"; message: string }

export function MealCaptureScreen() {
  const insets = useSafeAreaInsets()
  const focused = useIsFocused()
  const { tutorialSeen, dismissTutorial, setAnalysis, setDraftPhoto, items } = useMeals()
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<PickedImage | null>(null)
  const [barcodePreview, setBarcodePreview] = useState<BarcodePreview | null>(null)
  const barcodeRequest = useRef<AbortController | null>(null)
  const scannedCodes = useRef(new Set<string>())
  const pickingPhoto = useRef(false)
  const previewSize = useRef({ width: 0, height: 0 })
  const analyzeMutation = useMutation({
    mutationFn: async ({ image, description }: { image: PickedImage; description?: string }) => {
      const photoId =
        uploadedPhoto.current?.image === image
          ? uploadedPhoto.current.photoId
          : await uploadMealPhoto(image.uri)
      uploadedPhoto.current = { image, photoId }
      return { photoId, items: await analyzeMeal({ photoId, description }) }
    },
  })
  const [error, setError] = useState<string | null>(null)
  const active = useRef(true)
  const request = useRef(0)
  const cameraRef = useRef<CameraView>(null)
  const uploadedPhoto = useRef<{ image: PickedImage; photoId: string } | null>(null)
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

  useEffect(() => {
    if (!focused) setBarcodePreview(null)
    return () => {
      barcodeRequest.current?.abort()
      barcodeRequest.current = null
    }
  }, [focused])

  function dismissBarcode() {
    barcodeRequest.current?.abort()
    barcodeRequest.current = null
    setBarcodePreview(null)
  }

  async function scanBarcode(event: BarcodeScanningResult) {
    if (!focused || !tutorialSeen || image || pickingPhoto.current || barcodeRequest.current) return
    const { width, height } = previewSize.current
    const bounds = event.bounds
    if (bounds?.size.width > 0 && bounds.size.height > 0 && width && height) {
      const x = (bounds.origin.x + bounds.size.width / 2) / width
      const y = (bounds.origin.y + bounds.size.height / 2) / height
      if (x < 0.2 || x > 0.8 || y < 0.2 || y > 0.8) return
    }
    const code = lookupCode(event)
    if (!code || scannedCodes.current.has(code)) return
    scannedCodes.current.add(code)
    const lookup = new AbortController()
    barcodeRequest.current = lookup
    setBarcodePreview({ kind: "loading" })
    try {
      const food = await lookupBarcodeFood(code, lookup.signal)
      if (!lookup.signal.aborted)
        setBarcodePreview(
          food
            ? { kind: "found", code, food }
            : {
                kind: "manual",
                message: "No nutrition data found. Enter it from the package label.",
              },
        )
    } catch {
      if (!lookup.signal.aborted)
        setBarcodePreview({
          kind: "manual",
          message: "Could not look up this barcode. You can still enter nutrition manually.",
        })
    }
  }

  function openBarcodeItem() {
    if (!barcodePreview || barcodePreview.kind === "loading") return
    const match = barcodePreview.kind === "found" ? barcodePreview : null
    dismissBarcode()
    router.push({
      pathname: "/review-item",
      params: match
        ? {
            barcode: match.code,
            name: match.food.name,
            unit: match.food.unit,
            kcal: String(match.food.per100.kcal),
            protein: String(match.food.per100.protein),
            carbs: String(match.food.per100.carbs),
            fat: String(match.food.per100.fat),
          }
        : {},
    })
  }

  async function selectLibrary() {
    if (busy || pickingPhoto.current) return
    pickingPhoto.current = true
    dismissBarcode()
    setError(null)
    try {
      const picked = await pickImage(false)
      if (picked && active.current) setImage(picked)
    } catch (cause) {
      captureException(cause)
      if (active.current) {
        setError(
          cause instanceof ApiError
            ? apiErrorMessage(cause, "your photo library")
            : "Could not open your photo library. Try again.",
        )
      }
    } finally {
      pickingPhoto.current = false
    }
  }
  async function takePhoto() {
    if (busy || pickingPhoto.current) return
    pickingPhoto.current = true
    dismissBarcode()
    setError(null)
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 1 })
      if (!photo) throw new Error("Could not capture photo. Try again.")
      const prepared = await prepareMealImage(photo.uri)
      if (active.current) setImage(prepared)
    } catch (cause) {
      captureException(cause)
      if (active.current) {
        setError(
          cause instanceof ApiError
            ? apiErrorMessage(cause, "the photo")
            : cause instanceof Error
              ? cause.message
              : "Could not capture photo. Try again.",
        )
      }
    } finally {
      pickingPhoto.current = false
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
      const { items: result, photoId } = await analyzeMutation.mutateAsync({
        image,
        ...(description.trim() ? { description: description.trim() } : {}),
      })
      if (!active.current || current !== request.current) return
      if (!result.length)
        throw new Error("No food was identified. Try another photo or enter items manually.")
      setAnalysis(result, image.uri, { photoId })
      posthog?.capture("meal_analysis_completed", {
        item_count: result.length,
        description_provided: Boolean(description.trim()),
      })
      router.push("/meal")
    } catch (cause) {
      captureException(cause)
      if (active.current && current === request.current)
        setError(
          cause instanceof ApiError
            ? apiErrorMessage(cause, "meal analysis")
            : cause instanceof Error
              ? cause.message
              : "Photo analysis is unavailable. You can enter nutrition manually.",
        )
    }
  }

  const cameraGranted = permission?.granted ?? false

  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        {/* Inset padding must not live on KeyboardAvoidingView; its padding behavior overwrites paddingBottom. */}
        <View
          style={[
            styles.screen,
            { paddingTop: 12 + insets.top, paddingBottom: 16 + insets.bottom },
          ]}
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
                  <Image
                    accessible={false}
                    source={icons.switchCamera}
                    style={styles.retakeIcon}
                    contentFit="contain"
                  />
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
              <View
                style={styles.preview}
                onLayout={({ nativeEvent }) => {
                  previewSize.current = nativeEvent.layout
                }}
              >
                {focused ? (
                  <CameraView
                    ref={cameraRef}
                    style={StyleSheet.absoluteFill}
                    facing="back"
                    barcodeScannerSettings={barcodeScannerSettings}
                    onBarcodeScanned={
                      Platform.OS !== "web" && tutorialSeen && !barcodePreview
                        ? scanBarcode
                        : undefined
                    }
                  />
                ) : null}
                <View pointerEvents="none" style={styles.guide}>
                  <View style={[styles.guideCorner, styles.guideTL]} />
                  <View style={[styles.guideCorner, styles.guideTR]} />
                  <View style={[styles.guideCorner, styles.guideBL]} />
                  <View style={[styles.guideCorner, styles.guideBR]} />
                  <View style={styles.guideCircle}>
                    <Image
                      accessible={false}
                      source={icons.utensils}
                      style={styles.circleIcon}
                      contentFit="contain"
                    />
                    <Text style={styles.circleTitle}>Place food or drink here</Text>
                    <Text style={styles.circleNote}>
                      {Platform.OS === "web"
                        ? "Top-down shot · keep steady"
                        : "Take a photo or center a barcode"}
                    </Text>
                  </View>
                  <View style={styles.guideRuler}>
                    <Image
                      accessible={false}
                      source={icons.ruler}
                      style={styles.guideRulerIcon}
                      contentFit="contain"
                    />
                    <Text style={styles.guideRulerText}>Place 15 cm ruler beside plate or cup</Text>
                  </View>
                </View>
                {barcodePreview ? (
                  <View style={styles.barcodeCard}>
                    <View style={styles.barcodeHeader}>
                      <View style={styles.barcodeCopy} accessibilityLiveRegion="polite">
                        <Text style={styles.barcodeTitle} numberOfLines={2}>
                          {barcodePreview.kind === "found"
                            ? barcodePreview.food.name
                            : barcodePreview.kind === "loading"
                              ? "Looking up barcode…"
                              : "Barcode lookup"}
                        </Text>
                        {barcodePreview.kind === "found" ? (
                          <Text style={styles.barcodeDetail}>
                            Open Food Facts · {Math.round(barcodePreview.food.per100.kcal)} kcal per
                            100 {barcodePreview.food.unit}
                          </Text>
                        ) : barcodePreview.kind === "manual" ? (
                          <Text style={styles.barcodeDetail}>{barcodePreview.message}</Text>
                        ) : (
                          <ActivityIndicator color={C.textMuted} />
                        )}
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss barcode result"
                        style={styles.barcodeDismiss}
                        onPress={dismissBarcode}
                      >
                        <Text style={styles.barcodeTitle}>×</Text>
                      </Pressable>
                    </View>
                    {barcodePreview.kind !== "loading" ? (
                      <Button
                        label={
                          barcodePreview.kind === "found"
                            ? "Review product"
                            : "Enter nutrition manually"
                        }
                        onPress={openBarcodeItem}
                      />
                    ) : null}
                  </View>
                ) : null}
              </View>
            )}
          </View>

          <View style={styles.bottom}>
            {error ? (
              <Text accessibilityRole="alert" numberOfLines={2} style={styles.error}>
                {error} Manual entry remains available.
              </Text>
            ) : null}
            <View style={styles.shutterRow}>
              <View style={styles.sideSlot} />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Take meal photo"
                disabled={busy || (!image && !cameraGranted)}
                style={styles.shutterRing}
                onPress={image ? () => setImage(null) : takePhoto}
              >
                <View style={styles.shutter} />
              </Pressable>
              <View style={[styles.sideSlot, styles.sideSlotRight]}>
                <Pressable
                  accessibilityLabel="Choose from library"
                  disabled={busy}
                  onPress={selectLibrary}
                  style={styles.libraryIconButton}
                  hitSlop={8}
                >
                  <Image
                    accessible={false}
                    source={icons.images}
                    style={styles.libraryIcon}
                    contentFit="contain"
                  />
                </Pressable>
              </View>
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
              configured cloud model. Estimates must be reviewed; no wearable or medical
              measurements are inferred.
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
                dismissBarcode()
                if (image) {
                  const photoId =
                    uploadedPhoto.current?.image === image
                      ? uploadedPhoto.current.photoId
                      : undefined
                  setDraftPhoto(image.uri, { photoId })
                }
                router.push("/meal")
              }}
              style={styles.compactButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

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
  keyboard: {
    flex: 1,
    backgroundColor: C.background,
  },
  screen: {
    flex: 1,
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
  barcodeCard: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    padding: 10,
    gap: 6,
    borderRadius: 14,
    backgroundColor: C.surface,
  },
  barcodeHeader: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  barcodeCopy: { flex: 1, alignItems: "flex-start", gap: 2, paddingVertical: 4 },
  barcodeTitle: { color: C.text, fontSize: 15, fontWeight: "600" },
  barcodeDetail: { color: C.textMuted, fontSize: 12 },
  barcodeDismiss: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  retake: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  retakeIcon: {
    width: 20,
    height: 20,
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
    justifyContent: "space-between",
  },
  sideSlot: {
    width: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  sideSlotRight: {
    alignItems: "flex-end",
  },
  libraryIconButton: {
    padding: 10,
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
  libraryIcon: {
    width: 22,
    height: 22,
  },
  guide: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.22)",
    gap: 12,
  },
  guideCircle: {
    minWidth: 192,
    minHeight: 192,
    padding: 16,
    borderRadius: 96,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.6)",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  guideRuler: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  guideRulerIcon: {
    width: 20,
    height: 20,
  },
  guideRulerText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
  },
  guideCorner: {
    position: "absolute",
    width: 26,
    height: 26,
    borderColor: "rgba(255,255,255,0.55)",
  },
  guideTL: {
    top: 14,
    left: 14,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  guideTR: {
    top: 14,
    right: 14,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  guideBL: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  guideBR: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 2,
    borderRightWidth: 2,
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
