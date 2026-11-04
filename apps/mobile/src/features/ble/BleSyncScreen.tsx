import { router } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, ScrollView, StyleSheet, TextInput, useColorScheme, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { BottomTabInset, Spacing } from "@/constants/theme"
import { useWatchBle } from "@/features/ble/use-watch-ble"
import { useTheme } from "@/hooks/use-theme"

// ─── IMU packet type ──────────────────────────────────────────────────────────
interface ImuPacket {
  type: "imu"
  ax: number
  ay: number
  az: number
  mag: number
  gx: number
  gy: number
  gz: number
  ts: number
}

function parseImuPacket(text: string): ImuPacket | null {
  try {
    const obj = JSON.parse(text)
    if (!obj) return null
    if (obj.type === "imu") return obj as ImuPacket
    // Fallback compact format for low-MTU links (< 100B)
    if (obj.t === "i" && Array.isArray(obj.a) && Array.isArray(obj.g)) {
      return {
        type: "imu",
        ax: obj.a[0] ?? 0,
        ay: obj.a[1] ?? 0,
        az: obj.a[2] ?? 0,
        mag: obj.a[3] ?? 0,
        gx: obj.g[0] ?? 0,
        gy: obj.g[1] ?? 0,
        gz: obj.g[2] ?? 0,
        ts: obj.ts ?? Date.now(),
      }
    }
    return null
  } catch {
    return null
  }
}

// ─── Connection status dot ────────────────────────────────────────────────────
function StatusDot({ color }: { color: string }) {
  return (
    <View style={styles.dotWrap}>
      <View style={[styles.dot, { backgroundColor: color }]} />
    </View>
  )
}

// ─── IMU gauge bar ────────────────────────────────────────────────────────────
function GaugeBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(Math.abs(value) / max, 1)
  return (
    <View style={styles.gaugeTrack}>
      <View
        style={[
          styles.gaugeFill,
          { width: `${(pct * 100).toFixed(1)}%` as never, backgroundColor: color },
        ]}
      />
    </View>
  )
}

// ─── Axis row ────────────────────────────────────────────────────────────────
function AxisRow({
  axis,
  value,
  max,
  color,
}: {
  axis: string
  value: number
  max: number
  color: string
}) {
  return (
    <View style={styles.axisRow}>
      <ThemedText type="code" style={styles.axisLabel}>
        {axis}
      </ThemedText>
      <GaugeBar value={value} max={max} color={color} />
      <ThemedText type="code" style={styles.axisValue}>
        {value >= 0 ? " " : ""}
        {value.toFixed(2)}
      </ThemedText>
    </View>
  )
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export function BleSyncScreen() {
  const theme = useTheme()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const {
    mode,
    deviceName,
    errorText,
    messages,
    connect,
    connectSimulatedWatch,
    simulateWatchNotification,
    sendTextToWatch,
    disconnect,
    clearMessages,
  } = useWatchBle({ enableSimulator: true })

  const [imu, setImu] = useState<ImuPacket | null>(null)
  const [imuAge, setImuAge] = useState(0)
  const [phoneDraft, setPhoneDraft] = useState("Start Set: Bench Press")
  const [sendFeedback, setSendFeedback] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const lastPacketMs = useRef<number>(0)

  // Monitor the latest incoming watch message for IMU data
  useEffect(() => {
    const latest = messages[0]
    if (!latest || latest.direction !== "watch-to-phone") return
    const parsed = parseImuPacket(latest.text)
    if (parsed) {
      setImu(parsed)
      lastPacketMs.current = Date.now()
      setImuAge(0)
    }
  }, [messages])

  // Tick the age counter so the user sees freshness
  useEffect(() => {
    if (!imu) return
    const interval = setInterval(() => {
      if (lastPacketMs.current > 0) {
        setImuAge(Math.round((Date.now() - lastPacketMs.current) / 100) / 10)
      }
    }, 200)
    return () => clearInterval(interval)
  }, [imu])

  const isConnected = mode === "ble-hardware" || mode === "ble-simulated"

  // Status banner styling
  const statusColor = isConnected ? (mode === "ble-hardware" ? "#22C55E" : "#38BDF8") : "#94A3B8"

  const statusLabel = isConnected
    ? mode === "ble-hardware"
      ? `Connected · ${deviceName || "Huawei Watch"}`
      : "Connected · Simulated Watch"
    : "Disconnected"

  // Quick draft buttons
  const sendQuickText = useCallback(
    async (txt: string) => {
      setPhoneDraft(txt)
      setSending(true)
      setSendFeedback(null)
      try {
        const ok = await sendTextToWatch(txt)
        setSendFeedback(ok ? "Sent ✓" : "Failed to send")
      } catch (e) {
        setSendFeedback(`Error: ${e instanceof Error ? e.message : String(e)}`)
      } finally {
        setSending(false)
      }
    },
    [sendTextToWatch],
  )

  const handleSendCustomText = useCallback(async () => {
    if (!phoneDraft.trim()) return
    setSending(true)
    setSendFeedback(null)
    try {
      const ok = await sendTextToWatch(phoneDraft.trim())
      setSendFeedback(ok ? "Sent ✓" : "Failed to send")
    } catch (e) {
      setSendFeedback(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setSending(false)
    }
  }, [phoneDraft, sendTextToWatch])

  // Filter messages to show non-imu lines cleanly, but keep last 20 overall
  const logMessages = messages.slice(0, 15)

  return (
    <ThemedView type="background" style={styles.root}>
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Spacing.four }]}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Top Bar ── */}
          <View style={styles.header}>
            <View style={styles.headerNavRow}>
              {router.canGoBack() && (
                <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
                  <ThemedText style={styles.backArrow}>‹ Back</ThemedText>
                </Pressable>
              )}
            </View>
            <ThemedText type="title" style={styles.headerTitle}>
              BLE Sync Test
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Huawei Watch · IMU Stream & Bidirectional Messaging
            </ThemedText>
          </View>

          {/* ── Status Card ── */}
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.statusRow}>
              <StatusDot color={statusColor} />
              <View style={styles.statusFlex}>
                <ThemedText type="smallBold">{statusLabel}</ThemedText>
                {isConnected && (
                  <ThemedText type="code" themeColor="textSecondary">
                    UUID: F17E0001 · 1.6 Hz live
                  </ThemedText>
                )}
              </View>
            </View>

            {errorText && (
              <View style={styles.errorBanner}>
                <ThemedText type="small" style={{ color: "#EF4444" }}>
                  {errorText}
                </ThemedText>
              </View>
            )}

            {/* Connection Actions */}
            <View style={styles.buttonRow}>
              {!isConnected && (
                <>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      styles.btnPrimary,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={() => connect()}
                  >
                    <ThemedText type="smallBold" style={styles.btnText}>
                      Connect Watch
                    </ThemedText>
                  </Pressable>

                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      styles.btnSecondary,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={connectSimulatedWatch}
                  >
                    <ThemedText type="smallBold" style={styles.btnText}>
                      Simulate Watch
                    </ThemedText>
                  </Pressable>
                </>
              )}

              {isConnected && (
                <>
                  {mode === "ble-simulated" && (
                    <Pressable
                      style={({ pressed }) => [
                        styles.btn,
                        styles.btnSecondary,
                        pressed && styles.btnPressed,
                      ]}
                      onPress={() => simulateWatchNotification?.()}
                    >
                      <ThemedText type="smallBold" style={styles.btnText}>
                        Emit Packet
                      </ThemedText>
                    </Pressable>
                  )}

                  <Pressable
                    style={({ pressed }) => [
                      styles.btn,
                      styles.btnDanger,
                      pressed && styles.btnPressed,
                    ]}
                    onPress={disconnect}
                  >
                    <ThemedText type="smallBold" style={styles.btnText}>
                      Disconnect
                    </ThemedText>
                  </Pressable>
                </>
              )}
            </View>
          </ThemedView>

          {/* ── Bidirectional Text Messaging Card ── */}
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.imuHeader}>
              <ThemedText type="subtitle">Phone → Watch Message</ThemedText>
              {sendFeedback && (
                <ThemedText
                  type="code"
                  style={{
                    color: sendFeedback.includes("✓") ? "#4ADE80" : "#EF4444",
                  }}
                >
                  {sendFeedback}
                </ThemedText>
              )}
            </View>

            <View style={styles.textInputRow}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    color: theme.text,
                    backgroundColor: isDark ? "#1E293B" : "#FFFFFF",
                    borderColor: isDark ? "#334155" : "#CBD5E1",
                  },
                ]}
                value={phoneDraft}
                onChangeText={setPhoneDraft}
                placeholder="Type text for Watch"
                placeholderTextColor="#94A3B8"
                returnKeyType="send"
                onSubmitEditing={() => void handleSendCustomText()}
                editable={isConnected && !sending}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.btnSend,
                  (!isConnected || sending) && styles.btnDisabled,
                  pressed && styles.btnPressed,
                ]}
                disabled={!isConnected || sending}
                onPress={handleSendCustomText}
              >
                <ThemedText type="smallBold" style={styles.btnText}>
                  Send
                </ThemedText>
              </Pressable>
            </View>

            {/* Quick preset chips */}
            <ThemedText type="code" themeColor="textSecondary" style={{ marginTop: 4 }}>
              Quick Presets:
            </ThemedText>
            <View style={styles.presetRow}>
              {[
                "Start Set: Bench Press",
                "Rest Timer: 60s",
                "Next: Incline DB 24kg",
                "Done: Workout Saved",
              ].map((txt) => (
                <Pressable
                  key={txt}
                  disabled={!isConnected}
                  style={({ pressed }) => [
                    styles.presetChip,
                    {
                      backgroundColor: isDark ? "#334155" : "#E2E8F0",
                      opacity: !isConnected ? 0.5 : pressed ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => sendQuickText(txt)}
                >
                  <ThemedText type="small">{txt}</ThemedText>
                </Pressable>
              ))}
            </View>
          </ThemedView>

          {/* ── IMU Visualizer Card ── */}
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.imuHeader}>
              <ThemedText type="subtitle">Live IMU Telemetry</ThemedText>
              {imu && (
                <ThemedText type="code" themeColor="textSecondary">
                  {imuAge < 1 ? "LIVE" : `${imuAge}s ago`}
                </ThemedText>
              )}
            </View>

            {/* Accelerometer */}
            <View style={styles.sensorBlock}>
              <ThemedText type="smallBold" style={styles.sensorTitle}>
                Accelerometer (m/s²)
              </ThemedText>
              <AxisRow axis="X" value={imu?.ax ?? 0} max={20} color="#38BDF8" />
              <AxisRow axis="Y" value={imu?.ay ?? 0} max={20} color="#34D399" />
              <AxisRow axis="Z" value={imu?.az ?? 0} max={20} color="#F472B6" />
              <View style={styles.magRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Magnitude:{" "}
                </ThemedText>
                <ThemedText type="code">{(imu?.mag ?? 0).toFixed(2)} m/s²</ThemedText>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.backgroundSelected }]} />

            {/* Gyroscope */}
            <View style={styles.sensorBlock}>
              <ThemedText type="smallBold" style={styles.sensorTitle}>
                Gyroscope (rad/s)
              </ThemedText>
              <AxisRow axis="X" value={imu?.gx ?? 0} max={10} color="#A78BFA" />
              <AxisRow axis="Y" value={imu?.gy ?? 0} max={10} color="#FB923C" />
              <AxisRow axis="Z" value={imu?.gz ?? 0} max={10} color="#FBBF24" />
            </View>

            {!imu && !isConnected ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.placeholderText}>
                Connect to watch to see live IMU data
              </ThemedText>
            ) : null}
          </ThemedView>

          {/* ── Message log ── */}
          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.logHeader}>
              <ThemedText type="smallBold">Event Log</ThemedText>
              {logMessages.length > 0 && (
                <Pressable onPress={clearMessages} hitSlop={8}>
                  <ThemedText type="small" style={{ color: "#38BDF8" }}>
                    Clear
                  </ThemedText>
                </Pressable>
              )}
            </View>
            {logMessages.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary" style={styles.placeholderText}>
                No events yet
              </ThemedText>
            ) : (
              logMessages.map((m) => (
                <View key={m.id} style={styles.logRow}>
                  <View
                    style={[
                      styles.logDirDot,
                      {
                        backgroundColor: m.direction === "watch-to-phone" ? "#4ADE80" : "#38BDF8",
                      },
                    ]}
                  />
                  <View style={styles.logContent}>
                    <ThemedText type="code" themeColor="textSecondary">
                      {m.timestamp} ·{" "}
                      {m.direction === "watch-to-phone" ? "Watch→Phone" : "Phone→Watch"} ·{" "}
                      {m.byteLength}B
                    </ThemedText>
                    <ThemedText type="small" numberOfLines={2}>
                      {m.text}
                    </ThemedText>
                  </View>
                </View>
              ))
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },

  header: { paddingVertical: Spacing.two },
  headerNavRow: { marginBottom: 6 },
  backButton: { paddingVertical: 4 },
  backArrow: { fontSize: 16, color: "#38BDF8", fontWeight: "600" },
  headerTitle: { fontSize: 28, lineHeight: 36 },

  card: { borderRadius: 16, padding: Spacing.three, gap: Spacing.two },

  statusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  dotWrap: { width: 20, height: 20, alignItems: "center", justifyContent: "center" },
  dot: { width: 10, height: 10, borderRadius: 5, position: "absolute" },
  dotRing: { width: 10, height: 10, borderRadius: 5, position: "absolute" },
  statusFlex: { flex: 1 },

  errorBanner: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderRadius: 8,
    padding: Spacing.two,
  },

  buttonRow: { flexDirection: "row", gap: Spacing.two, flexWrap: "wrap" },
  btn: {
    flex: 1,
    minWidth: 120,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#2563EB" },
  btnSecondary: { backgroundColor: "#334155" },
  btnDanger: { backgroundColor: "#DC2626" },
  btnPressed: { opacity: 0.75 },
  btnText: { color: "#FFFFFF" },

  imuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sensorBlock: { gap: 6 },
  sensorTitle: { marginBottom: 2, fontSize: 12 },
  axisRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  axisLabel: { width: 14, color: "#94A3B8", fontSize: 11 },
  axisValue: { width: 52, textAlign: "right", fontSize: 11 },
  gaugeTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(148,163,184,0.15)",
    overflow: "hidden",
  },
  gaugeFill: { height: "100%", borderRadius: 3 },
  magRow: { flexDirection: "row", alignItems: "center", paddingTop: 2 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 4 },
  placeholderText: {
    textAlign: "center",
    paddingVertical: Spacing.two,
    fontSize: 13,
  },

  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logRow: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  logDirDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
    flexShrink: 0,
  },
  logContent: { flex: 1, gap: 2 },

  // Text message card styles
  textInputRow: { flexDirection: "row", gap: Spacing.two, alignItems: "center" },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  btnSend: {
    backgroundColor: "#10B981",
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    opacity: 0.4,
  },
  presetRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
})
