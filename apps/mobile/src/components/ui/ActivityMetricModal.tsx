import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform
} from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme, softShadow } from '../../theme';

export type ActivityMetricType = 'move' | 'exercise' | 'stand';

interface ActivityMetricModalProps {
  metric: ActivityMetricType | null;
  visible: boolean;
  onClose: () => void;
  caloriesBurned?: number;
  exerciseMinutes?: number;
  standHours?: number;
}

type TimeRange = 'Day' | 'Week' | 'Month' | 'Year';

export const ActivityMetricModal: React.FC<ActivityMetricModalProps> = ({
  metric,
  visible,
  onClose,
  caloriesBurned = 1537,
  exerciseMinutes = 1,
  standHours = 9
}) => {
  const { theme, radii } = useAppTheme();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('Week');

  if (!metric) return null;

  const metricConfig = {
    move: {
      name: 'Move / Energy',
      color: '#FF4D30',
      icon: 'flame' as const,
      unit: 'kcal',
      todayValue: caloriesBurned,
      goal: 500,
      goalLabel: '500 kcal goal',
      ranges: {
        Day: {
          headline: `${caloriesBurned.toLocaleString()} kcal`,
          sub: 'Today • 307% of 500 kcal goal',
          avg: `${caloriesBurned.toLocaleString()} kcal`,
          peak: '620 kcal (17:30)',
          consistency: '100% target hit',
          bars: [
            { label: '06h', val: 40 },
            { label: '09h', val: 120 },
            { label: '12h', val: 240 },
            { label: '15h', val: 180 },
            { label: '18h', val: 620 },
            { label: '21h', val: 337 }
          ],
          aiTip: 'Great active energy burn today! Your 17:30 training peak pushed you well beyond your 500 kcal baseline.'
        },
        Week: {
          headline: '720 kcal/day',
          sub: 'Daily average • 5,040 kcal total this week',
          avg: '720 kcal',
          peak: '1,537 kcal (Sun)',
          consistency: '6 of 7 days hit goal',
          bars: [
            { label: 'Mon', val: 620 },
            { label: 'Tue', val: 540 },
            { label: 'Wed', val: 810 },
            { label: 'Thu', val: 490 },
            { label: 'Fri', val: 740 },
            { label: 'Sat', val: 920 },
            { label: 'Sun', val: 1537 }
          ],
          aiTip: 'Consistent calorie expenditure across all training days. You are exceeding weekly burn targets by 24%.'
        },
        Month: {
          headline: '685 kcal/day',
          sub: 'Monthly average • 21,235 kcal total',
          avg: '685 kcal',
          peak: '1,537 kcal',
          consistency: '88% goal adherence',
          bars: [
            { label: 'W1', val: 4900 },
            { label: 'W2', val: 5200 },
            { label: 'W3', val: 4850 },
            { label: 'W4', val: 5450 }
          ],
          aiTip: 'Solid monthly output. Metabolic balance remains strong with stable daily volume.'
        },
        Year: {
          headline: '214,500 kcal',
          sub: 'Total energy expenditure this year',
          avg: '665 kcal/day',
          peak: '1,620 kcal (Sep)',
          consistency: '312 active days',
          bars: [
            { label: 'Jan', val: 18200 },
            { label: 'Mar', val: 19400 },
            { label: 'May', val: 20100 },
            { label: 'Jul', val: 19800 },
            { label: 'Sep', val: 21500 },
            { label: 'Nov', val: 20800 }
          ],
          aiTip: 'Long-term cardiovascular and metabolic output is in the top 15% of your age bracket.'
        }
      }
    },
    exercise: {
      name: 'Active Exercise',
      color: '#FFD200',
      icon: 'walk' as const,
      unit: 'min',
      todayValue: exerciseMinutes,
      goal: 30,
      goalLabel: '30 mins goal',
      ranges: {
        Day: {
          headline: `${exerciseMinutes} min`,
          sub: 'Today • Workout scheduled for 17:30',
          avg: '1 min',
          peak: '1 min (Warmup)',
          consistency: 'Scheduled at 17:30',
          bars: [
            { label: '06h', val: 0 },
            { label: '09h', val: 0 },
            { label: '12h', val: 1 },
            { label: '15h', val: 0 },
            { label: '18h', val: 0 },
            { label: '21h', val: 0 }
          ],
          aiTip: 'You have a 45-minute Chest & Pectoral session scheduled for 17:30. Completing it will instantly hit your 30m goal!'
        },
        Week: {
          headline: '38 mins/day',
          sub: 'Weekly average • 266 mins total',
          avg: '38 mins',
          peak: '50 mins (Wed)',
          consistency: '5 of 7 days hit goal',
          bars: [
            { label: 'Mon', val: 45 },
            { label: 'Tue', val: 40 },
            { label: 'Wed', val: 50 },
            { label: 'Thu', val: 0 },
            { label: 'Fri', val: 45 },
            { label: 'Sat', val: 35 },
            { label: 'Sun', val: 1 }
          ],
          aiTip: 'Excellent workout consistency! You reliably hit between 35-50 minutes on scheduled training days.'
        },
        Month: {
          headline: '36 mins/day',
          sub: 'Monthly average • 22 workout sessions',
          avg: '36 mins',
          peak: '60 mins',
          consistency: '82% target hit',
          bars: [
            { label: 'W1', val: 240 },
            { label: 'W2', val: 265 },
            { label: 'W3', val: 210 },
            { label: 'W4', val: 255 }
          ],
          aiTip: 'High adherence to the 6-day split. Rest days are spaced well to support muscular recovery.'
        },
        Year: {
          headline: '142 hours',
          sub: 'Total gym & cardio time this year',
          avg: '34 mins/day',
          peak: '58 mins (Aug)',
          consistency: '218 completed workouts',
          bars: [
            { label: 'Jan', val: 18 },
            { label: 'Mar', val: 21 },
            { label: 'May', val: 24 },
            { label: 'Jul', val: 20 },
            { label: 'Sep', val: 25 },
            { label: 'Nov', val: 22 }
          ],
          aiTip: 'Steady progressive training volume over the year. Hypertrophy stimulus is well maintained.'
        }
      }
    },
    stand: {
      name: 'Stand / Active Hours',
      color: '#00A3FF',
      icon: 'body' as const,
      unit: 'hrs',
      todayValue: standHours,
      goal: 12,
      goalLabel: '12 hrs goal',
      ranges: {
        Day: {
          headline: `${standHours} / 12 hrs`,
          sub: 'Today • 3 more hours to complete ring',
          avg: `${standHours} hrs`,
          peak: '1 standing min/hr',
          consistency: '75% target hit',
          bars: [
            { label: '08h', val: 1 },
            { label: '10h', val: 1 },
            { label: '12h', val: 1 },
            { label: '14h', val: 1 },
            { label: '16h', val: 1 },
            { label: '18h', val: 1 }
          ],
          aiTip: 'You have stood and moved at least 1 minute in 9 different hours today. Stand up once every hour to hit 12h!'
        },
        Week: {
          headline: '11.4 hrs/day',
          sub: 'Weekly average • 80 standing hours',
          avg: '11.4 hrs',
          peak: '13 hrs (Wed)',
          consistency: '6 of 7 days hit goal',
          bars: [
            { label: 'Mon', val: 12 },
            { label: 'Tue', val: 11 },
            { label: 'Wed', val: 13 },
            { label: 'Thu', val: 10 },
            { label: 'Fri', val: 12 },
            { label: 'Sat', val: 11 },
            { label: 'Sun', val: 9 }
          ],
          aiTip: 'Great circulation habits during work hours. You consistently break up long sedentary desk sessions.'
        },
        Month: {
          headline: '11.6 hrs/day',
          sub: 'Monthly average • 348 active hours',
          avg: '11.6 hrs',
          peak: '14 hrs',
          consistency: '92% goal adherence',
          bars: [
            { label: 'W1', val: 82 },
            { label: 'W2', val: 84 },
            { label: 'W3', val: 78 },
            { label: 'W4', val: 81 }
          ],
          aiTip: 'Strong daily postural health. Sedentary fatigue risks remain low.'
        },
        Year: {
          headline: '11.5 hrs/day',
          sub: 'Annual average daily standing duration',
          avg: '11.5 hrs',
          peak: '14 hrs (Jul)',
          consistency: '340 goal days',
          bars: [
            { label: 'Jan', val: 11 },
            { label: 'Mar', val: 12 },
            { label: 'May', val: 12 },
            { label: 'Jul', val: 11 },
            { label: 'Sep', val: 12 },
            { label: 'Nov', val: 11 }
          ],
          aiTip: 'Top-tier standing consistency year-round.'
        }
      }
    }
  }[metric];

  const currentData = metricConfig.ranges[selectedRange];

  // SVG Chart Dimensions
  const chartHeight = 140;
  const chartWidth = 310;
  const maxBarVal = Math.max(...currentData.bars.map((b) => b.val), 1);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header Bar */}
        <View style={[styles.headerBar, { borderBottomColor: theme.borderSubtle }]}>
          <View style={styles.headerLeft}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close metric analytics"
              onPress={onClose}
              style={[styles.closeCircleBtn, { backgroundColor: theme.surfaceElevated }]}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </Pressable>
            <View>
              <Text style={[styles.headerTitle, { color: theme.text }]}>
                {metricConfig.name}
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                Activity Telemetry & Trends
              </Text>
            </View>
          </View>

          <View style={[styles.metricPill, { backgroundColor: `${metricConfig.color}18` }]}>
            <Ionicons name={metricConfig.icon} size={14} color={metricConfig.color} />
            <Text style={[styles.metricPillText, { color: metricConfig.color }]}>
              {metricConfig.todayValue} {metricConfig.unit}
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Time Range Tabs: Day • Week • Month • Year */}
          <View style={[styles.tabBarContainer, { backgroundColor: theme.surfaceElevated }]}>
            {(['Day', 'Week', 'Month', 'Year'] as TimeRange[]).map((range) => {
              const isSelected = selectedRange === range;
              return (
                <Pressable
                  key={range}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                    setSelectedRange(range);
                  }}
                  style={[
                    styles.tabButton,
                    isSelected && [
                      styles.tabButtonActive,
                      {
                        backgroundColor: theme.card,
                        ...Platform.select({
                          web: { boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)' },
                          default: { shadowColor: theme.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }
                        })
                      }
                    ]
                  ]}
                >
                  <Text
                    style={[
                      styles.tabButtonText,
                      {
                        color: isSelected ? theme.primary : theme.textSecondary,
                        fontWeight: isSelected ? '700' : '500'
                      }
                    ]}
                  >
                    {range}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Metric Summary Card */}
          <View
            style={[
              styles.chartCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderRadius: radii.xl,
                ...(!theme.isDark && Platform.OS === 'web' ? softShadow : null)
              }
            ]}
          >
            <View style={styles.chartHeaderRow}>
              <View>
                <Text style={[styles.chartHeadline, { color: theme.text }]}>
                  {currentData.headline}
                </Text>
                <Text style={[styles.chartSub, { color: theme.textSecondary }]}>
                  {currentData.sub}
                </Text>
              </View>

              <View style={[styles.goalPill, { backgroundColor: theme.surfaceElevated }]}>
                <Text style={[styles.goalPillText, { color: theme.textSecondary }]}>
                  Goal: {metricConfig.goalLabel}
                </Text>
              </View>
            </View>

            {/* SVG Bar Chart */}
            <View style={styles.svgWrapper}>
              <Svg width={chartWidth} height={chartHeight + 24}>
                {/* Dotted Grid baseline */}
                <Line
                  x1={0}
                  y1={chartHeight * 0.35}
                  x2={chartWidth}
                  y2={chartHeight * 0.35}
                  stroke={theme.border}
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                <Line
                  x1={0}
                  y1={chartHeight}
                  x2={chartWidth}
                  y2={chartHeight}
                  stroke={theme.border}
                  strokeWidth={1}
                />

                {/* Bars */}
                {currentData.bars.map((bar, i) => {
                  const barCount = currentData.bars.length;
                  const barWidth = Math.min(28, Math.floor((chartWidth - barCount * 12) / barCount));
                  const stepX = chartWidth / barCount;
                  const x = i * stepX + (stepX - barWidth) / 2;
                  const rawH = (bar.val / maxBarVal) * (chartHeight * 0.85);
                  const h = Math.max(rawH, 4);
                  const y = chartHeight - h;

                  return (
                    <React.Fragment key={i}>
                      <Rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={h}
                        rx={barWidth / 2}
                        fill={metricConfig.color}
                        opacity={i === currentData.bars.length - 1 ? 1 : 0.75}
                      />
                      <SvgText
                        x={x + barWidth / 2}
                        y={chartHeight + 16}
                        fontSize={11}
                        fontWeight="600"
                        fill={theme.textSecondary}
                        textAnchor="middle"
                      >
                        {bar.label}
                      </SvgText>
                    </React.Fragment>
                  );
                })}
              </Svg>
            </View>
          </View>

          {/* 3-Tile Telemetry Stats Grid */}
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }
              ]}
            >
              <Text style={[styles.statCardLabel, { color: theme.textSecondary }]}>Average</Text>
              <Text style={[styles.statCardValue, { color: theme.text }]}>
                {currentData.avg}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }
              ]}
            >
              <Text style={[styles.statCardLabel, { color: theme.textSecondary }]}>Peak</Text>
              <Text style={[styles.statCardValue, { color: metricConfig.color }]}>
                {currentData.peak}
              </Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: theme.card, borderColor: theme.border, borderRadius: radii.lg }
              ]}
            >
              <Text style={[styles.statCardLabel, { color: theme.textSecondary }]}>Consistency</Text>
              <Text style={[styles.statCardValue, { color: theme.text }]} numberOfLines={1}>
                {currentData.consistency}
              </Text>
            </View>
          </View>

          {/* AI Coaching Insight Card */}
          <View
            style={[
              styles.aiInsightCard,
              {
                backgroundColor: theme.primaryContainer,
                borderColor: theme.borderSubtle,
                borderRadius: radii.lg
              }
            ]}
          >
            <View style={styles.aiInsightHeader}>
              <Ionicons name="sparkles" size={16} color={theme.primary} />
              <Text style={[styles.aiInsightTitle, { color: theme.primary }]}>
                Coach Analysis
              </Text>
            </View>
            <Text style={[styles.aiInsightBody, { color: theme.text }]}>
              {currentData.aiTip}
            </Text>
          </View>

          {/* Done Button */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Done"
            onPress={onClose}
            style={({ pressed }) => [
              styles.doneBtn,
              {
                backgroundColor: theme.primary,
                borderRadius: radii.full,
                opacity: pressed ? 0.88 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <Text style={[styles.doneBtnText, { color: theme.onPrimary }]}>
              Done
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999
  },
  metricPillText: {
    fontSize: 12,
    fontWeight: '700'
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 14
  },
  tabBarContainer: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12
  },
  tabButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  tabButtonActive: {},
  tabButtonText: {
    fontSize: 13
  },
  chartCard: {
    borderWidth: 1,
    padding: 16,
    gap: 16
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  chartHeadline: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums']
  },
  chartSub: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2
  },
  goalPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  goalPillText: {
    fontSize: 11,
    fontWeight: '600'
  },
  svgWrapper: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    padding: 12,
    gap: 4
  },
  statCardLabel: {
    fontSize: 11,
    fontWeight: '500'
  },
  statCardValue: {
    fontSize: 14,
    fontWeight: '700',
    fontVariant: ['tabular-nums']
  },
  aiInsightCard: {
    borderWidth: 1,
    padding: 14,
    gap: 6
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  aiInsightTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  aiInsightBody: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500'
  },
  doneBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '700'
  }
});
