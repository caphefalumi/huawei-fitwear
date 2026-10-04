import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../theme';
import { useUserStore } from '../store/userStore';
import { PrimaryButton, SecondaryButton, Stepper } from '../components/ui';
import type { GoalType, SexType, ActivityLevel } from '../types/types';

export default function OnboardingScreen() {
  const { theme, radii, spacing } = useAppTheme();
  const { user, completeOnboarding } = useUserStore();

  // Step 0: Welcome, Step 1: Sign in, Step 2: Details wizard, Step 3: Targets
  const [step, setStep] = useState<number>(0);
  const [wizardSubStep, setWizardSubStep] = useState<number>(0);

  // Form states
  const [fullName, setFullName] = useState(user.fullName || 'Alex Tran');
  const [email, setEmail] = useState(user.email || 'alex.tran@fitwear.ai');
  const [sex, setSex] = useState<SexType>(user.sex || 'male');
  const [heightCm, setHeightCm] = useState<number>(user.heightCm || 175);
  const [weightKg, setWeightKg] = useState<number>(user.weightKg || 72.5);
  const [goal, setGoal] = useState<GoalType>(user.goal || 'build_muscle');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(
    user.activityLevel || 'moderate'
  );

  // Targets (computed then editable)
  const [calorieTarget, setCalorieTarget] = useState(2200);
  const [proteinTarget, setProteinTarget] = useState(140);
  const [carbsTarget, setCarbsTarget] = useState(250);
  const [fatTarget, setFatTarget] = useState(70);

  // Calculate Mifflin-St Jeor BMR
  const calculateBmr = () => {
    // Men: 10W + 6.25H - 5A + 5
    // Women: 10W + 6.25H - 5A - 161
    const age = 26; // Default demo age
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return Math.round(sex === 'female' ? base - 161 : base + 5);
  };

  const calculateTdee = (bmrVal: number) => {
    const multipliers = { low: 1.2, moderate: 1.55, high: 1.725 };
    return Math.round(bmrVal * multipliers[activityLevel]);
  };

  const handleFinishOnboarding = async () => {
    const bmr = calculateBmr();
    const tdee = calculateTdee(bmr);

    await completeOnboarding({
      fullName,
      email,
      sex,
      heightCm,
      weightKg,
      goal,
      activityLevel,
      bmr,
      tdee,
      dailyCalorieTarget: calorieTarget,
      dailyProteinTarget: proteinTarget,
      dailyCarbsTarget: carbsTarget,
      dailyFatTarget: fatTarget
    });

    router.replace('/(tabs)');
  };

  // ================= 1. WELCOME SCREEN =================
  if (step === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={styles.welcomeContent}>
          <View style={styles.heroSection}>
            <View
              style={[
                styles.logoEmblem,
                { backgroundColor: theme.surfaceElevated, borderColor: theme.border }
              ]}
            >
              <Ionicons name="barbell" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.welcomeBrand, { color: theme.primary }]}>AI FITWEAR</Text>
            <Text style={[styles.welcomeTitle, { color: theme.text }]}>
              Zero typing.{'\n'}Pure execution.
            </Text>
            <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>
              The closed-loop companion uniting your phone and smartwatch.
            </Text>
          </View>

          {/* Three Core Value Props */}
          <View style={styles.cardsContainer}>
            <View
              style={[
                styles.propCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={[styles.propIcon, { backgroundColor: theme.surfaceElevated }]}>
                <Ionicons name="camera" size={24} color={theme.primary} />
              </View>
              <View style={styles.propTextContainer}>
                <Text style={[styles.propTitle, { color: theme.text }]}>Snap & Move On</Text>
                <Text style={[styles.propDesc, { color: theme.textSecondary }]}>
                  Photograph your plate and get instant macro estimation without manual searching.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.propCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={[styles.propIcon, { backgroundColor: theme.surfaceElevated }]}>
                <Ionicons name="watch" size={24} color={theme.protein} />
              </View>
              <View style={styles.propTextContainer}>
                <Text style={[styles.propTitle, { color: theme.text }]}>Watch Rep Coach</Text>
                <Text style={[styles.propDesc, { color: theme.textSecondary }]}>
                  Your watch counts reps and triggers rest automatically—no phone touching mid-set.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.propCard,
                { backgroundColor: theme.card, borderColor: theme.border }
              ]}
            >
              <View style={[styles.propIcon, { backgroundColor: theme.surfaceElevated }]}>
                <Ionicons name="sync" size={24} color={theme.carbs} />
              </View>
              <View style={styles.propTextContainer}>
                <Text style={[styles.propTitle, { color: theme.text }]}>Zero Device Drift</Text>
                <Text style={[styles.propDesc, { color: theme.textSecondary }]}>
                  Calories left and workout progress always match across both devices instantly.
                </Text>
              </View>
            </View>
          </View>

          <PrimaryButton
            label="Get Started"
            size="large"
            onPress={() => setStep(1)}
            style={styles.ctaButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ================= 2. SIGN IN SCREEN =================
  if (step === 1) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.authContent}>
          <Pressable
            style={styles.backButton}
            onPress={() => setStep(0)}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>

          <Text style={[styles.screenTitle, { color: theme.text }]}>Sign In</Text>
          <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
            All workout logs and nutritional records stay stored offline on your device.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
              EMAIL ADDRESS
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.surfaceElevated,
                  borderColor: theme.border,
                  color: theme.text
                }
              ]}
              placeholder="alex.tran@fitwear.ai"
              placeholderTextColor={theme.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <PrimaryButton
            label="Continue with Google"
            icon="logo-google"
            size="large"
            onPress={() => setStep(2)}
            style={{ marginTop: 12 }}
          />

          <SecondaryButton
            label="Continue as Guest (Local Only)"
            size="large"
            onPress={() => setStep(2)}
            style={{ marginTop: 12 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ================= 3. PROFILE WIZARD =================
  if (step === 2) {
    const totalWizardSteps = 5;
    const progressPct = ((wizardSubStep + 1) / totalWizardSteps) * 100;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.wizardHeader}>
          <Pressable
            onPress={() => {
              if (wizardSubStep > 0) setWizardSubStep(wizardSubStep - 1);
              else setStep(1);
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.stepIndicator, { color: theme.textSecondary }]}>
            Step {wizardSubStep + 1} of {totalWizardSteps}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={[styles.progressBarTrack, { backgroundColor: theme.surfaceElevated }]}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPct}%`, backgroundColor: theme.primary }
            ]}
          />
        </View>

        <ScrollView contentContainerStyle={styles.wizardBody}>
          {wizardSubStep === 0 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>What is your name?</Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                We personalize your dashboard and companion greetings.
              </Text>
              <TextInput
                style={[
                  styles.largeInput,
                  {
                    backgroundColor: theme.surfaceElevated,
                    borderColor: theme.border,
                    color: theme.text
                  }
                ]}
                placeholder="Your full name"
                placeholderTextColor={theme.textMuted}
                value={fullName}
                onChangeText={setFullName}
                autoFocus
              />
            </View>
          )}

          {wizardSubStep === 1 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Select your sex</Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Used strictly for baseline BMR and metabolic calculation.
              </Text>

              {(['male', 'female', 'other'] as SexType[]).map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setSex(opt)}
                  style={[
                    styles.optionCard,
                    {
                      backgroundColor: sex === opt ? theme.surfaceElevated : theme.card,
                      borderColor: sex === opt ? theme.primary : theme.border
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: sex === opt ? theme.primary : theme.text }
                    ]}
                  >
                    {opt === 'male' ? 'Male' : opt === 'female' ? 'Female' : 'Other'}
                  </Text>
                  {sex === opt && (
                    <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {wizardSubStep === 2 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Height & Weight</Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Adjust with high-precision steppers.
              </Text>

              <Stepper
                label="HEIGHT (CM)"
                value={heightCm}
                onChange={setHeightCm}
                min={120}
                max={230}
                step={1}
                unit="cm"
              />

              <View style={{ height: 16 }} />

              <Stepper
                label="WEIGHT (KG)"
                value={weightKg}
                onChange={setWeightKg}
                min={35}
                max={200}
                step={0.5}
                unit="kg"
              />
            </View>
          )}

          {wizardSubStep === 3 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>What is your primary goal?</Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                We calibrate your macro targets and workout plan around this objective.
              </Text>

              {[
                { key: 'lose_fat', label: 'Lose Fat', desc: 'Slight caloric deficit preserving lean tissue' },
                { key: 'build_muscle', label: 'Build Muscle', desc: 'High protein with surplus to maximize hypertrophy' },
                { key: 'maintain', label: 'Maintain & Tone', desc: 'Metabolic equilibrium and steady fitness' }
              ].map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setGoal(item.key as GoalType)}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: goal === item.key ? theme.surfaceElevated : theme.card,
                      borderColor: goal === item.key ? theme.primary : theme.border
                    }
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.goalTitle,
                        { color: goal === item.key ? theme.primary : theme.text }
                      ]}
                    >
                      {item.label}
                    </Text>
                    <Text style={[styles.goalDesc, { color: theme.textSecondary }]}>
                      {item.desc}
                    </Text>
                  </View>
                  {goal === item.key && (
                    <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {wizardSubStep === 4 && (
            <View style={styles.stepContainer}>
              <Text style={[styles.stepTitle, { color: theme.text }]}>Daily Activity Level</Text>
              <Text style={[styles.stepDesc, { color: theme.textSecondary }]}>
                Choose your routine outside of the gym.
              </Text>

              {[
                { key: 'low', title: 'Low', desc: 'Sedentary desk work, minimal walking (<5k steps)' },
                { key: 'moderate', title: 'Moderate', desc: '1-3 active days per week, moderate movement' },
                { key: 'high', title: 'High', desc: '4+ intense training sessions or highly physical job' }
              ].map((item) => (
                <Pressable
                  key={item.key}
                  onPress={() => setActivityLevel(item.key as ActivityLevel)}
                  style={[
                    styles.goalCard,
                    {
                      backgroundColor: activityLevel === item.key ? theme.surfaceElevated : theme.card,
                      borderColor: activityLevel === item.key ? theme.primary : theme.border
                    }
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.goalTitle,
                        { color: activityLevel === item.key ? theme.primary : theme.text }
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.goalDesc, { color: theme.textSecondary }]}>
                      {item.desc}
                    </Text>
                  </View>
                  {activityLevel === item.key && (
                    <Ionicons name="checkmark-circle" size={22} color={theme.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.wizardFooter}>
          <PrimaryButton
            label={wizardSubStep < totalWizardSteps - 1 ? 'Continue' : 'Compute Targets'}
            size="large"
            onPress={() => {
              if (wizardSubStep < totalWizardSteps - 1) {
                setWizardSubStep(wizardSubStep + 1);
              } else {
                setStep(3);
              }
            }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ================= 4. TARGETS SCREEN =================
  const bmr = calculateBmr();
  const tdee = calculateTdee(bmr);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.targetsContent}>
        <Text style={[styles.screenTitle, { color: theme.text }]}>Daily Nutrition Targets</Text>
        <Text style={[styles.screenSubtitle, { color: theme.textSecondary }]}>
          Calculated via Mifflin-St Jeor metabolic model. You can fine-tune any target.
        </Text>

        {/* BMR and TDEE Summary Banner */}
        <View
          style={[
            styles.metabolicBanner,
            { backgroundColor: theme.surfaceElevated, borderColor: theme.border }
          ]}
        >
          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>BASE METABOLIC (BMR)</Text>
            <Text style={[styles.metaValue, { color: theme.text }]}>{bmr} kcal</Text>
          </View>
          <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />
          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>EXPENDITURE (TDEE)</Text>
            <Text style={[styles.metaValue, { color: theme.primary }]}>{tdee} kcal</Text>
          </View>
        </View>

        <Text style={[styles.explanationText, { color: theme.textSecondary }]}>
          Target set for {goal === 'build_muscle' ? 'lean hypertrophy (+200 kcal surplus)' : goal === 'lose_fat' ? 'fat reduction (-400 kcal deficit)' : 'weight maintenance'}.
        </Text>

        <View style={styles.stepperList}>
          <Stepper
            label="DAILY CALORIES"
            value={calorieTarget}
            onChange={setCalorieTarget}
            min={1200}
            max={4500}
            step={50}
            unit="kcal"
          />

          <Stepper
            label="PROTEIN (2.0g per kg)"
            value={proteinTarget}
            onChange={setProteinTarget}
            min={50}
            max={300}
            step={5}
            unit="g"
          />

          <Stepper
            label="CARBOHYDRATES"
            value={carbsTarget}
            onChange={setCarbsTarget}
            min={50}
            max={600}
            step={10}
            unit="g"
          />

          <Stepper
            label="DIETARY FAT"
            value={fatTarget}
            onChange={setFatTarget}
            min={30}
            max={150}
            step={5}
            unit="g"
          />
        </View>

        <PrimaryButton
          label="Looks Good — Save & Start"
          size="large"
          onPress={handleFinishOnboarding}
          style={{ marginTop: 24, marginBottom: 32 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcomeContent: {
    padding: 24,
    justifyContent: 'space-between'
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32
  },
  logoEmblem: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  welcomeBrand: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 8
  },
  welcomeSubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300
  },
  cardsContainer: {
    gap: 12,
    marginBottom: 32
  },
  propCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1
  },
  propIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14
  },
  propTextContainer: {
    flex: 1
  },
  propTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  propDesc: {
    fontSize: 13,
    lineHeight: 18
  },
  ctaButton: {
    marginTop: 8
  },
  authContent: {
    flex: 1,
    padding: 24
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24
  },
  inputGroup: {
    marginBottom: 20
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6
  },
  textInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15
  },
  wizardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  stepIndicator: {
    fontSize: 13,
    fontWeight: '600'
  },
  progressBarTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden'
  },
  progressBarFill: {
    height: '100%'
  },
  wizardBody: {
    padding: 24
  },
  stepContainer: {
    marginTop: 8
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6
  },
  stepDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24
  },
  largeInput: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '600'
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700'
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4
  },
  goalDesc: {
    fontSize: 13,
    lineHeight: 18
  },
  wizardFooter: {
    padding: 20
  },
  targetsContent: {
    padding: 24
  },
  metabolicBanner: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 16
  },
  metaCol: {
    flex: 1,
    alignItems: 'center'
  },
  metaDivider: {
    width: 1,
    height: '100%'
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '800'
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: 'italic'
  },
  stepperList: {
    gap: 12
  }
});
