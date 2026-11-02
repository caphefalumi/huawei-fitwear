import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from "react-native";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";

const VISIBLE_ROWS = 5;

type WheelPickerProps = {
  values: number[];
  value: number;
  onChange: (next: number) => void;
  format: (value: number) => string;
  label?: string;
};

/** Vertical swipe wheel: the row centered in the highlight band is the selection. */
export function WheelPicker({
  values,
  value,
  onChange,
  format,
  label = "Value",
}: WheelPickerProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { fontScale } = useWindowDimensions();
  const itemHeight = Math.max(48, Math.ceil(44 * fontScale));
  const padding = ((VISIBLE_ROWS - 1) / 2) * itemHeight;
  const selectedIndex = Math.max(0, values.indexOf(value));
  const [index, setIndex] = useState(selectedIndex);

  useEffect(() => {
    setIndex(selectedIndex);
    scrollRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false });
  }, [selectedIndex, itemHeight]);

  function adjust(offset: number) {
    const next = Math.max(0, Math.min(values.length - 1, selectedIndex + offset));
    if (next === selectedIndex || values.length === 0) return;
    setIndex(next);
    scrollRef.current?.scrollTo({ y: next * itemHeight, animated: false });
    onChange(values[next]);
  }

  function indexFrom(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const raw = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    return Math.max(0, Math.min(values.length - 1, raw));
  }

  return (
    <View>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ text: format(value) }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === "increment") adjust(1);
          if (nativeEvent.actionName === "decrement") adjust(-1);
        }}
        style={{ height: itemHeight * VISIBLE_ROWS }}
      >
        <View pointerEvents="none" style={[styles.band, { top: padding, height: itemHeight }]} />
        <ScrollView
          ref={scrollRef}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingVertical: padding }}
          onLayout={() => scrollRef.current?.scrollTo({ y: index * itemHeight, animated: false })}
          onScroll={(event) => setIndex(indexFrom(event))}
          onMomentumScrollEnd={(event) => onChange(values[indexFrom(event)])}
          onScrollEndDrag={(event) => onChange(values[indexFrom(event)])}
        >
          {values.map((item, itemIndex) => {
            const active = itemIndex === index;
            return (
              <View key={item} style={[styles.item, { height: itemHeight }]}>
                <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>
                  {format(item)}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel={`Decrease ${label.toLowerCase()}`}
          disabled={selectedIndex === 0}
          onPress={() => adjust(-1)}
          style={styles.action}
        >
          <Text style={styles.itemLabel}>Decrease</Text>
        </Pressable>
        <Pressable
          accessibilityLabel={`Increase ${label.toLowerCase()}`}
          disabled={selectedIndex >= values.length - 1}
          onPress={() => adjust(1)}
          style={styles.action}
        >
          <Text style={styles.itemLabel}>Increase</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  action: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: C.textMuted,
    borderRadius: 12,
  },
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 17,
    color: C.textMuted,
  },
  itemLabelActive: {
    fontSize: 22,
    fontWeight: "600",
    color: C.accent,
  },
});
