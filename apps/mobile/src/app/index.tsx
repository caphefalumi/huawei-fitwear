import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  FITWEAR_CHAR_MESSAGE_UUID,
  FITWEAR_SERVICE_UUID,
  useWatchBle,
} from '@/hooks/use-watch-ble';

const PHONE_PRESETS = [
  'Start Set: Bench Press',
  'Rest Timer: 60s',
  'Target: 2,150 kcal left',
];

const WATCH_PRESETS = [
  'Hello from Watch!',
  'Rep 10 | HR 142 bpm',
  'Set Completed ✓',
];

export default function HomeScreen() {
  const {
    mode,
    deviceName,
    errorText,
    messages,
    connectRealBleWatch,
    connectSimulatedWatch,
    disconnect,
    sendTextToWatch,
    simulateWatchNotification,
    clearMessages,
  } = useWatchBle();

  const [phoneDraft, setPhoneDraft] = useState('Hello Watch from Mobile!');
  const [watchDraft, setWatchDraft] = useState('Rep 12 | HR 148 bpm');

  const isConnected = mode === 'ble-hardware' || mode === 'ble-simulated';
  const isBusy = mode === 'scanning' || mode === 'connecting';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.headerBlock}>
            <ThemedText type="subtitle">Fitwear Bluetooth Sync Demo</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Bidirectional BLE GATT text sync with HarmonyOS Watch
            </ThemedText>
          </View>

          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  isConnected ? styles.dotConnected : styles.dotDisconnected,
                ]}
              />
              <ThemedText type="smallBold">
                {mode === 'ble-hardware'
                  ? 'Connected (react-native-ble-plx)'
                  : mode === 'ble-simulated'
                    ? 'Connected (Watch GATT Simulator)'
                    : mode === 'scanning'
                      ? 'Scanning via react-native-ble-plx...'
                      : mode === 'connecting'
                        ? 'Connecting to Watch GATT Server...'
                        : 'Disconnected'}
              </ThemedText>
            </View>

            <ThemedText type="small" themeColor="textSecondary">
              Peer: {deviceName}
            </ThemedText>
            <ThemedText type="code" style={styles.uuidText}>
              Service: {FITWEAR_SERVICE_UUID}
            </ThemedText>
            <ThemedText type="code" style={styles.uuidText}>
              Characteristic: {FITWEAR_CHAR_MESSAGE_UUID}
            </ThemedText>

            <View style={styles.buttonRow}>
              {!isConnected && !isBusy ? (
                <>
                  <Pressable
                    style={[styles.btn, styles.btnPrimary]}
                    onPress={connectRealBleWatch}>
                    <ThemedText type="smallBold" style={styles.btnTextLight}>
                      Scan BLE Watch (ble-plx)
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.btn, styles.btnSecondary]}
                    onPress={connectSimulatedWatch}>
                    <ThemedText type="smallBold" style={styles.btnTextLight}>
                      Connect Watch Simulator
                    </ThemedText>
                  </Pressable>
                </>
              ) : (
                <Pressable style={[styles.btn, styles.btnDanger]} onPress={disconnect}>
                  <ThemedText type="smallBold" style={styles.btnTextLight}>
                    {isBusy ? 'Stop Scan' : `Disconnect (${mode === 'ble-hardware' ? 'BLE' : 'Sim'})`}
                  </ThemedText>
                </Pressable>
              )}
            </View>

            {errorText ? (
              <ThemedText type="small" style={styles.errorBanner}>
                {errorText}
              </ThemedText>
            ) : null}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">
              1. Phone → Watch (GATT Characteristic Write)
            </ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                value={phoneDraft}
                onChangeText={setPhoneDraft}
                placeholder="Type message to send to Huawei Watch..."
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => sendTextToWatch(phoneDraft)}>
                <ThemedText type="smallBold" style={styles.btnTextLight}>
                  Send
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.presetRow}>
              {PHONE_PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  style={styles.chip}
                  onPress={() => sendTextToWatch(preset)}>
                  <ThemedText type="small" style={styles.chipText}>
                    {preset}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="smallBold">
              2. Watch → Phone (GATT Characteristic Notify)
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              On a physical Huawei Watch, tap &ldquo;Send&rdquo; or &ldquo;Rep +1&rdquo; in the watch app to trigger{' '}
              <ThemedText type="code">notifyCharacteristicChanged</ThemedText>, or simulate an incoming watch notification below:
            </ThemedText>
            <View style={styles.inputRow}>
              <TextInput
                value={watchDraft}
                onChangeText={setWatchDraft}
                placeholder="Simulate incoming watch text..."
                placeholderTextColor="#64748B"
                style={styles.textInput}
              />
              <Pressable
                style={[styles.btn, styles.btnAccent]}
                onPress={() => simulateWatchNotification(watchDraft)}>
                <ThemedText type="smallBold" style={styles.btnTextLight}>
                  Notify
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.presetRow}>
              {WATCH_PRESETS.map((preset) => (
                <Pressable
                  key={preset}
                  style={styles.chip}
                  onPress={() => simulateWatchNotification(preset)}>
                  <ThemedText type="small" style={styles.chipText}>
                    {preset}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.logHeader}>
              <ThemedText type="smallBold">
                BLE GATT Packet Log ({messages.length})
              </ThemedText>
              {messages.length > 0 ? (
                <Pressable onPress={clearMessages}>
                  <ThemedText type="small" style={styles.clearLink}>
                    Clear
                  </ThemedText>
                </Pressable>
              ) : null}
            </View>

            {messages.length === 0 ? (
              <ThemedText type="small" themeColor="textSecondary">
                No packets exchanged yet. Connect and send a message above.
              </ThemedText>
            ) : (
              messages.map((msg) => {
                const fromPhone = msg.direction === 'phone-to-watch';
                return (
                  <View
                    key={msg.id}
                    style={[
                      styles.logItem,
                      fromPhone ? styles.logPhone : styles.logWatch,
                    ]}>
                    <View style={styles.logMetaRow}>
                      <ThemedText
                        type="smallBold"
                        style={fromPhone ? styles.dirPhone : styles.dirWatch}>
                        {fromPhone
                          ? 'PHONE → WATCH [WRITE]'
                          : 'WATCH → PHONE [NOTIFY]'}
                      </ThemedText>
                      <ThemedText type="small" themeColor="textSecondary">
                        {msg.timestamp} • {msg.byteLength}B
                      </ThemedText>
                    </View>
                    <ThemedText type="default">{msg.text}</ThemedText>
                  </View>
                );
              })
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  headerBlock: {
    gap: Spacing.one,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotConnected: {
    backgroundColor: '#10B981',
  },
  dotDisconnected: {
    backgroundColor: '#94A3B8',
  },
  uuidText: {
    fontSize: 11,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  btn: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: '#2563EB',
  },
  btnSecondary: {
    backgroundColor: '#0D9488',
  },
  btnAccent: {
    backgroundColor: '#7C3AED',
  },
  btnDanger: {
    backgroundColor: '#DC2626',
  },
  btnTextLight: {
    color: '#FFFFFF',
  },
  errorBanner: {
    color: '#F59E0B',
    marginTop: Spacing.one,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    color: '#3B82F6',
    fontSize: 14,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    backgroundColor: 'rgba(59, 130, 246, 0.14)',
  },
  chipText: {
    color: '#3B82F6',
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearLink: {
    color: '#EF4444',
  },
  logItem: {
    padding: Spacing.two,
    borderRadius: Spacing.two,
    borderLeftWidth: 3,
    gap: 2,
  },
  logPhone: {
    borderLeftColor: '#2563EB',
    backgroundColor: 'rgba(37, 99, 235, 0.08)',
  },
  logWatch: {
    borderLeftColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  logMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dirPhone: {
    color: '#3B82F6',
  },
  dirWatch: {
    color: '#10B981',
  },
});
