import { useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

import { Palette as C } from '@/constants/palette';

const ITEM_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const PADDING = ((VISIBLE_ROWS - 1) / 2) * ITEM_HEIGHT;

type WheelPickerProps = {
  values: number[];
  value: number;
  onChange: (next: number) => void;
  format: (value: number) => string;
};

/** Vertical swipe wheel: the row centered in the highlight band is the selection. */
export function WheelPicker({ values, value, onChange, format }: WheelPickerProps) {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(Math.max(0, values.indexOf(value)));

  function indexFrom(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const raw = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    return Math.max(0, Math.min(values.length - 1, raw));
  }

  return (
    <View style={styles.wrap}>
      <View pointerEvents="none" style={styles.band} />
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: PADDING }}
        onLayout={() => scrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false })}
        onScroll={(event) => setIndex(indexFrom(event))}
        onMomentumScrollEnd={(event) => onChange(values[indexFrom(event)])}
        onScrollEndDrag={(event) => onChange(values[indexFrom(event)])}>
        {values.map((item, itemIndex) => {
          const active = itemIndex === index;
          return (
            <View key={item} style={styles.item}>
              <Text style={[styles.itemLabel, active && styles.itemLabelActive]}>
                {format(item)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: ITEM_HEIGHT * VISIBLE_ROWS,
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: PADDING,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 17,
    color: C.textMuted,
  },
  itemLabelActive: {
    fontSize: 22,
    fontWeight: '600',
    color: C.accent,
  },
});
