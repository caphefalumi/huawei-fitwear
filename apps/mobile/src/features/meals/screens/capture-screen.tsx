import { useMutation } from "@tanstack/react-query"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useIsFocused } from "expo-router/react-navigation"
import { useEffect, useRef, useState } from "react"
import { Platform, StyleSheet, Text, TextInput, View } from "react-native"
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
import { BarcodeResultSheet, type BarcodeResult } from "../components/barcode-result-sheet"
import { icons } from "../components/meals-ui"
import { useMeals } from "../hooks/meals-hooks"
import { useMealCamera } from "./meal-camera"
import { scanMealPhoto } from "./scan-meal-photo"

const TUTORIAL_STEPS = [
  { title: "Add a ruler", detail: "If you have one, place a 15 cm ruler beside the plate or cup." },
  { title: "Shoot from above", detail: "Keep the whole meal in frame and hold steady." },
]

function lookupCode(data: string, compressedUpc: boolean) {
  if (!/^(?:[0-9]{8}|[0-9]{12,14})$/.test(data)) return null
  if (!compressedUpc || data.length !== 8) return data
  const [system, a, b, c, d, e, last, check] = data
  if (last <= "2") return `${system}${a}${b}${last}0000${c}${d}${e}${check}`
  if (last === "3") return `${system}${a}${b}${c}00000${d}${e}${check}`
  if (last === "4") return `${system}${a}${b}${c}${d}00000${e}${check}`
  return `${system}${a}${b}${c}${d}${e}0000${last}${check}`
}

export function MealCaptureScreen() {
  const insets = useSafeAreaInsets()
  const focused = useIsFocused()
  const { tutorialSeen, dismissTutorial, setAnalysis, setDraftPhoto, items } = useMeals()
  const [description, setDescription] = useState("")
  const [image, setImage] = useState<PickedImage | null>(null)
  const [barcodePreview, setBarcodePreview] = useState<BarcodeResult | null>(null)
  const [barcodeOpen, setBarcodeOpen] = useState(false)
  const barcodeRequest = useRef<AbortController | null>(null)
  const scannedCodes = useRef(new Set<string>())
  const pickingPhoto = useRef(false)
  const analyzeMutation = useMutation({
    mutationFn: async ({ image, description }: { image: PickedImage; description?: string }) => {
      const photoId =
        uploadedPhoto.current?.image === image
          ? uploadedPhoto.current.photoId
          : await uploadMealPhoto(image.uri)
      uploadedPhoto.current = { image, photoId }
      return {
        photoId,
        items: await analyzeMeal({ photoId, description }),
      }
    },
  })
  const [error, setError] = useState<string | null>(null)
  const active = useRef(true)
  const request = useRef(0)
  const uploadedPhoto = useRef<{ image: PickedImage; photoId: string } | null>(null)
  const [cameraFailed, setCameraFailed] = useState(false)
  const camera = useMealCamera({
    active: focused && !image && !cameraFailed,
    scan: focused && tutorialSeen && !image && !barcodeOpen && !cameraFailed,
    onBarcode: scanBarcode,
    onError: (cause) => {
      captureException(cause)
      setCameraFailed(true)
      setError("Camera unavailable. Choose a photo from your library.")
    },
    style: StyleSheet.absoluteFill,
  })
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
    if (!focused) setBarcodeOpen(false)
    return () => {
      barcodeRequest.current?.abort()
      barcodeRequest.current = null
    }
  }, [focused])

  function dismissBarcode() {
    barcodeRequest.current?.abort()
    barcodeRequest.current = null
    setBarcodeOpen(false)
  }

  function retakePhoto() {
    dismissBarcode()
    setImage(null)
    setError(null)
  }

  async function scanBarcode(data: string, compressedUpc: boolean) {
    if (
      !focused ||
      !tutorialSeen ||
      image ||
      barcodeOpen ||
      pickingPhoto.current ||
      barcodeRequest.current
    )
      return
    const code = lookupCode(data, compressedUpc)
    if (!code || scannedCodes.current.has(code)) return
    scannedCodes.current.add(code)
    await lookupBarcode(code)
  }

  async function lookupBarcode(code: string, lookup = new AbortController()) {
    barcodeRequest.current = lookup
    setBarcodePreview({ kind: "loading", code })
    setBarcodeOpen(true)
    try {
      const product = await lookupBarcodeFood(code, lookup.signal)
      if (!lookup.signal.aborted) {
        setBarcodePreview(product ? { kind: "found", code, product } : { kind: "missing", code })
      }
    } catch {
      if (!lookup.signal.aborted) setBarcodePreview({ kind: "error", code })
    }
  }

  async function scanPhotoBarcode(uri: string) {
    if (!scanMealPhoto) return
    const scan = new AbortController()
    barcodeRequest.current = scan
    try {
      const match = await scanMealPhoto(uri, scan.signal)
      if (!match || scan.signal.aborted) return
      const code = lookupCode(match.value, match.compressedUpc)
      if (code) await lookupBarcode(code, scan)
    } catch (cause) {
      if (!scan.signal.aborted) {
        captureException(cause)
        setError("Could not check this photo for a barcode. Try another photo or use the camera.")
      }
    } finally {
      // Don't clear a newer request that started while the decoder was running.
      if (barcodeRequest.current === scan) barcodeRequest.current = null
    }
  }

  function retryBarcode() {
    if (!barcodeOpen || barcodePreview?.kind !== "error") return
    barcodeRequest.current?.abort()
    void lookupBarcode(barcodePreview.code)
  }

  function openBarcodeItem(useLabelPhoto: boolean) {
    if (!barcodeOpen || !barcodePreview || barcodePreview.kind === "loading") return
    const product = barcodePreview.kind === "found" ? barcodePreview.product : undefined
    const params: Record<string, string> = { barcode: barcodePreview.code }
    if (product) {
      if (product.name) params.name = product.name
      if (product.brand) params.brand = product.brand
      params.unit = product.servingUnit
      for (const [key, value] of Object.entries(product.per100)) {
        if (value != null) params[key] = String(value)
      }
    }
    if (useLabelPhoto) params.labelPhoto = "1"
    dismissBarcode()
    router.push({ pathname: "/review-item", params })
  }

  async function selectLibrary() {
    if (busy || pickingPhoto.current) return
    pickingPhoto.current = true
    dismissBarcode()
    setError(null)
    try {
      const picked = await pickImage(false)
      if (!picked || !active.current) return
      setImage(picked)
      void scanPhotoBarcode(picked.sourceUri)
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
    dismissBarcode()
    setError(null)
    pickingPhoto.current = true
    try {
      const uri = await camera.takePhoto()
      if (!uri) return
      const prepared = await prepareMealImage(uri)
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
    dismissBarcode()
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

  const cameraGranted = camera.cameraGranted && camera.cameraAvailable && !cameraFailed

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
                  onPress={retakePhoto}
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
            ) : !cameraGranted || Platform.OS === "web" ? (
              <View style={styles.preview}>
                <View style={styles.circle}>
                  <Image
                    accessible={false}
                    source={icons.utensils}
                    style={styles.circleIcon}
                    contentFit="contain"
                  />
                  <Text style={styles.circleTitle}>
                    {Platform.OS === "web"
                      ? "Take or choose a photo"
                      : cameraFailed || !camera.cameraAvailable
                        ? "Camera unavailable"
                        : "Camera access needed"}
                  </Text>
                  <Text style={styles.circleNote}>
                    You can also choose a photo from your library.
                  </Text>
                </View>
                {camera.cameraAvailable && !cameraFailed && !camera.cameraGranted ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Allow camera access"
                    onPress={camera.requestPermission}
                    style={styles.permissionButton}
                  >
                    <Text style={styles.permissionLabel}>Allow camera access</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : (
              <View style={styles.preview}>
<<<<<<< HEAD
                {camera.preview}
=======
                {useLidar && MealLidarCamera ? (
                  focused ? (
                    <MealLidarCamera
                      style={StyleSheet.absoluteFill}
                      capture={lidarCapture}
                      scan={tutorialSeen && !barcodeOpen && !lidarCapture}
                      onBarcode={scanBarcode}
                      onCapture={receiveLidarPhoto}
                      onUnavailable={disableLidar}
                    />
                  ) : null
                ) : (
                  camera.preview
                )}
>>>>>>> f72b4a3 (fix(mobile): allow basic functionality in Expo Go)
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
                    <Text style={styles.circleNote}>Take a photo or center a barcode</Text>
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
                onPress={image ? retakePhoto : takePhoto}
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

      <BarcodeResultSheet
        result={barcodePreview}
        visible={barcodeOpen}
        onClose={dismissBarcode}
        onRetry={retryBarcode}
        onReview={openBarcodeItem}
      />

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
