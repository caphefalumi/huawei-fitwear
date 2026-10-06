import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS
} from 'react-native-reanimated';

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

const FULL_TITLE = 'AI FitWear';
const FULL_SUBTITLE = 'SMART FITNESS & NUTRITION';

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationComplete
}) => {
  const [typedTitle, setTypedTitle] = useState<string>('');
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);
  const [isTypingDone, setIsTypingDone] = useState<boolean>(false);

  // Reanimated shared values
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1);

  // 1. Logo spring entrance
  useEffect(() => {
    logoOpacity.set(withTiming(1, { duration: 300 }));
    logoScale.set(
      withSpring(1, {
        damping: 12,
        stiffness: 150
      })
    );
  }, [logoOpacity, logoScale]);

  // 2. Typewriter effect: chữ ghi ra từng ký tự
  useEffect(() => {
    let currentIndex = 0;
    const startTimeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (currentIndex < FULL_TITLE.length) {
          currentIndex += 1;
          setTypedTitle(FULL_TITLE.slice(0, currentIndex));
        } else {
          clearInterval(typeInterval);
          setShowSubtitle(true);
          // Ghi xong: đợi ngắn rồi kích hoạt chuyển cảnh vào Home
          setTimeout(() => {
            setIsTypingDone(true);
          }, 450);
        }
      }, 75); // 75ms mỗi chữ cái

      return () => clearInterval(typeInterval);
    }, 280);

    return () => clearTimeout(startTimeout);
  }, []);

  // 3. Chuyển cảnh mượt mà vào Home sau khi ghi xong
  useEffect(() => {
    if (!isTypingDone) return;

    screenScale.set(
      withTiming(1.03, {
        duration: 420,
        easing: Easing.out(Easing.cubic)
      })
    );

    screenOpacity.set(
      withTiming(
        0,
        {
          duration: 420,
          easing: Easing.out(Easing.cubic)
        },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        }
      )
    );
  }, [isTypingDone, screenOpacity, screenScale, onAnimationComplete]);

  const logoAnimStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.get(),
    transform: [{ scale: logoScale.get() }]
  }));

  const screenAnimStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.get(),
    transform: [{ scale: screenScale.get() }]
  }));

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.fullScreenOverlay,
        screenAnimStyle
      ]}
      pointerEvents="none"
    >
      <View style={styles.centerBox}>
        {/* Brand Logo Icon */}
        <Animated.View style={[styles.logoWrapper, logoAnimStyle]}>
          <Svg viewBox="0 0 100 100" width={92} height={92} fill="none">
            <Rect width="100" height="100" rx="26" fill="#2563EB" />
            <Path
              d="M28 68V32L50 56L72 32V68"
              stroke="#FFFFFF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="50" cy="24" r="5" fill="#60A5FA" />
          </Svg>
        </Animated.View>

        {/* Chữ ghi ra từng ký tự kèm con trỏ */}
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>{typedTitle}</Text>
          {!isTypingDone && <View style={styles.cursor} />}
        </View>

        {/* Dòng Tagline hiển thị sau khi ghi xong */}
        <View style={[styles.subtitleBox, { opacity: showSubtitle ? 1 : 0 }]}>
          <Text style={styles.subtitleText}>{FULL_SUBTITLE}</Text>
        </View>
      </View>

      {/* Dòng trạng thái chân trang */}
      <View style={styles.bottomBrand}>
        <View style={styles.bottomDot} />
        <Text style={styles.bottomText}>Dual-Device Ecosystem</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreenOverlay: {
    backgroundColor: '#FFFFFF',
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoWrapper: {
    marginBottom: 20
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center'
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: '#0F172A'
  },
  cursor: {
    width: 3,
    height: 30,
    backgroundColor: '#2563EB',
    borderRadius: 1.5,
    marginLeft: 3
  },
  subtitleBox: {
    marginTop: 8
  },
  subtitleText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#64748B'
  },
  bottomBrand: {
    position: 'absolute',
    bottom: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  bottomDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB'
  },
  bottomText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8'
  }
});
