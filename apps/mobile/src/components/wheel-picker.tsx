/*
 * Picker wheel animation and face geometry adapted from
 * quidone/react-native-wheel-picker (https://github.com/quidone/react-native-wheel-picker).
 * Copyright (c) 2023 Quidone React Native Wheel Picker
 *
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Pressable } from "@/components/pressable";
import { Palette as C } from "@/constants/palette";

const VISIBLE_ROWS = 5;
const MAX_STEP = Math.trunc((VISIBLE_ROWS + 2) / 2);
const STEP_DEGREES = 90 / MAX_STEP;
const DEGREES = Array.from({ length: MAX_STEP }, (_, index) => (index + 1) * STEP_DEGREES);

type WheelPickerProps = {
  values: number[];
  value: number;
  onChange: (next: number) => void;
  format: (value: number) => string;
  label?: string;
  showActions?: boolean;
  style?: StyleProp<ViewStyle>;
  isUnavailable?: (value: number) => boolean;
};

type Face = { index: number; degree: number; offsetY: number; opacity: number };

function createFaces(itemHeight: number): Face[] {
  const heights = DEGREES.map((degree) => itemHeight * Math.cos((degree * Math.PI) / 180));
  const offsets = heights.map((height, index) => {
    const freeSpace = itemHeight - height;
    return heights
      .slice(0, index)
      .reduce((sum, previous) => sum + itemHeight - previous, freeSpace / 2);
  });
  const opacity = (index: number) => [0, 0.2, 0.35, 0.45, 0.5][index] ?? 1;
  const outer = DEGREES.map((degree, index) => ({
    index: -(index + 1),
    degree,
    offsetY: -offsets[index],
    opacity: opacity(DEGREES.length - 1 - index),
  })).reverse();
  return [
    ...outer,
    { index: 0, degree: 0, offsetY: 0, opacity: 1 },
    ...DEGREES.map((degree, index) => ({
      index: index + 1,
      degree: -degree,
      offsetY: offsets[index],
      opacity: opacity(DEGREES.length - 1 - index),
    })),
  ];
}

/** Perspective wheel adapted from Quidone's animated face interpolation. */
export function WheelPicker({
  values,
  value,
  onChange,
  format,
  label = "Value",
  showActions = true,
  style,
  isUnavailable,
}: WheelPickerProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { fontScale } = useWindowDimensions();
  const itemHeight = Math.max(48, Math.ceil(44 * fontScale));
  const pickerHeight = itemHeight * VISIBLE_ROWS;
  const selectedIndex = Math.max(0, values.indexOf(value));
  const scrollY = useRef(new Animated.Value(selectedIndex * itemHeight)).current;
  const faces = useMemo(() => createFaces(itemHeight), [itemHeight]);
  const onScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
      }),
    [scrollY],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false });
  }, [selectedIndex, itemHeight]);

  function indexFrom(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const raw = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    return Math.max(0, Math.min(values.length - 1, raw));
  }

  function commit(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (values.length > 0) onChange(values[indexFrom(event)]);
  }

  function adjust(offset: number) {
    const next = Math.max(0, Math.min(values.length - 1, selectedIndex + offset));
    if (next === selectedIndex || values.length === 0) return;
    scrollRef.current?.scrollTo({ y: next * itemHeight, animated: false });
    onChange(values[next]);
  }

  return (
    <View style={style}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{
          min: 0,
          max: Math.max(0, values.length - 1),
          now: selectedIndex,
          text: `${format(value)}${isUnavailable?.(value) ? ", future date" : ""}`,
        }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={({ nativeEvent }) => {
          if (nativeEvent.actionName === "increment") adjust(1);
          if (nativeEvent.actionName === "decrement") adjust(-1);
        }}
        style={{ height: pickerHeight }}
      >
        <View
          pointerEvents="none"
          style={[styles.band, { top: (pickerHeight - itemHeight) / 2, height: itemHeight }]}
        />
        <Animated.ScrollView
          ref={scrollRef}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingVertical: (pickerHeight - itemHeight) / 2 }}
          onLayout={() =>
            scrollRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false })
          }
          onScroll={onScroll}
          onMomentumScrollEnd={commit}
          onScrollEndDrag={(event) => {
            const index = indexFrom(event);
            if (!event.nativeEvent.velocity?.y || isUnavailable?.(values[index])) commit(event);
          }}
        >
          {values.map((item, index) => {
            const inputRange = faces.map((face) => itemHeight * (index + face.index));
            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: faces.map((face) => face.opacity),
              extrapolate: "clamp",
            });
            const rotateX = scrollY.interpolate({
              inputRange,
              outputRange: faces.map((face) => `${face.degree}deg`),
              extrapolate: "extend",
            });
            const translateY = scrollY.interpolate({
              inputRange,
              outputRange: faces.map((face) => face.offsetY),
              extrapolate: "extend",
            });
            const unavailable = isUnavailable?.(item) ?? false;

            return (
              <Animated.View
                key={item}
                style={[
                  styles.item,
                  {
                    height: itemHeight,
                    opacity,
                    transform: [{ translateY }, { rotateX }, { perspective: 1000 }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.itemLabel,
                    { lineHeight: itemHeight },
                    index === selectedIndex && !unavailable && styles.itemLabelActive,
                    unavailable && styles.itemLabelUnavailable,
                  ]}
                >
                  {format(item)}
                </Text>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
      </View>
      {showActions ? (
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
      ) : null}
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
    right: 0,
    left: 0,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
    backgroundColor: C.accentTint,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: 17,
    color: C.textMuted,
    textAlign: "center",
  },
  itemLabelActive: {
    fontSize: 22,
    fontWeight: "600",
    color: C.accent,
  },
  itemLabelUnavailable: {
    color: C.border,
  },
});
