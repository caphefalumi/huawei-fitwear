import { BottomSheet, RNHostView } from "@expo/ui"
import { SymbolView } from "expo-symbols"
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from "react-native"

import { Button } from "@/components/ui"
import { Pressable } from "@/components/ui/pressable"
import { Colors, Palette as C, tokens } from "@/theme"

import type { BarcodeProduct } from "../api/meals-api"

export type BarcodeResult =
  | { kind: "loading" | "missing" | "error"; code: string }
  | { kind: "found"; code: string; product: BarcodeProduct }

export function BarcodeResultSheet({
  result,
  visible,
  onClose,
  onRetry,
  onReview,
}: {
  result: BarcodeResult | null
  visible: boolean
  onClose: () => void
  onRetry: () => void
  onReview: (useLabelPhoto: boolean) => void
}) {
  const dark = useColorScheme() === "dark"
  const colors = {
    text: dark ? Colors.dark.text : C.text,
    muted: dark ? Colors.dark.textSecondary : C.textMuted,
    surface: dark ? Colors.dark.backgroundElement : C.surface,
    inset: dark ? Colors.dark.backgroundSelected : C.previewTint,
    tint: dark ? Colors.dark.backgroundSelected : C.accentTint,
    icon: dark ? C.accentSoft : C.accent,
  }
  const product = result?.kind === "found" ? result.product : null
  const incomplete =
    product &&
    (product.per100.kcal == null ||
      product.per100.protein == null ||
      product.per100.carbs == null ||
      product.per100.fat == null)
  const loading = result?.kind === "loading"
  const failed = result?.kind === "error"
  const title = product
    ? (product.name ?? "Product found")
    : loading
      ? "Checking barcode…"
      : failed
        ? "Couldn’t check barcode"
        : "Product not found"
  const detail = product
    ? incomplete
      ? "Product found, but some nutrition is missing. Use the package label to fill it in."
      : "Review the portion and nutrition before adding it."
    : loading
      ? "Looking up the product in Open Food Facts."
      : failed
        ? "Try again or use the nutrition facts printed on the package."
        : "Open Food Facts has no match. Use the nutrition facts printed on the package."
  const showFallback = !product || incomplete

  return (
    <BottomSheet isPresented={visible} onDismiss={onClose} containerColor={colors.surface}>
      {result ? (
        <RNHostView matchContents={{ vertical: true }}>
          <View style={styles.content}>
            <View style={styles.top}>
              <View aria-hidden style={[styles.symbol, { backgroundColor: colors.tint }]}>
                <SymbolView
                  name={{
                    ios: "barcode.viewfinder",
                    android: "barcode_scanner",
                    web: "barcode_scanner",
                  }}
                  size={22}
                  tintColor={colors.icon}
                />
              </View>
              <Pressable
                accessibilityLabel="Dismiss barcode result"
                onPress={onClose}
                style={styles.close}
              >
                <SymbolView
                  name={{ ios: "xmark", android: "close", web: "close" }}
                  size={18}
                  tintColor={colors.muted}
                />
              </Pressable>
            </View>
            <View accessibilityLiveRegion="polite" style={styles.copy}>
              <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
              <Text style={[styles.detail, { color: colors.muted }]}>{detail}</Text>
            </View>
            <View style={[styles.summary, { backgroundColor: colors.inset }]}>
              <Text selectable style={[styles.metadata, { color: colors.muted }]}>
                Barcode {result.code}
              </Text>
              {product?.brand ? (
                <Text selectable style={[styles.metadata, { color: colors.muted }]}>
                  {product.brand}
                </Text>
              ) : null}
              {product?.per100.kcal != null ? (
                <Text style={[styles.energy, { color: colors.text }]}>
                  {product.per100.kcal.toLocaleString(undefined, { maximumFractionDigits: 2 })} kcal
                  per 100 {product.servingUnit === "ml" ? "mL" : "g"} · Open Food Facts
                </Text>
              ) : null}
            </View>
            {loading ? (
              <ActivityIndicator accessibilityLabel="Looking up barcode" color={colors.muted} />
            ) : (
              <View style={styles.actions}>
                {showFallback ? (
                  <>
                    <Button label="Scan nutrition label" onPress={() => onReview(true)} />
                    <Button
                      variant="secondary"
                      label="Enter nutrition manually"
                      onPress={() => onReview(false)}
                    />
                    {failed ? (
                      <Pressable
                        accessibilityRole="button"
                        onPress={onRetry}
                        style={styles.secondary}
                      >
                        <Text style={[styles.secondaryLabel, { color: colors.icon }]}>
                          Try again
                        </Text>
                      </Pressable>
                    ) : null}
                  </>
                ) : (
                  <Button label="Review product" onPress={() => onReview(false)} />
                )}
              </View>
            )}
          </View>
        </RNHostView>
      ) : null}
    </BottomSheet>
  )
}

const { spacing, radii } = tokens
const styles = StyleSheet.create({
  content: { gap: spacing.md, paddingBottom: spacing.lg },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  symbol: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  close: { width: 48, height: 48, alignItems: "center", justifyContent: "center" },
  copy: { gap: spacing.sm },
  title: { fontSize: 22, fontWeight: "600" },
  detail: { fontSize: 15 },
  summary: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.md,
    borderCurve: "continuous",
  },
  metadata: { fontSize: 13, fontVariant: ["tabular-nums"] },
  energy: { fontSize: 15, fontWeight: "600", fontVariant: ["tabular-nums"] },
  actions: { gap: spacing.sm },
  secondary: { minHeight: 48, alignItems: "center", justifyContent: "center" },
  secondaryLabel: { fontSize: 15, fontWeight: "600", textAlign: "center" },
})
