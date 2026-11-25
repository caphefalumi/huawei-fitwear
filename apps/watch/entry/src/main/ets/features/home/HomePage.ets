import { common } from '@kit.AbilityKit';
import BuildProfile from 'BuildProfile';
import { SAMPLE_DAY, SAMPLE_FAVORITES, SAMPLE_PLAN } from '../common/SampleData';
import { HAPTIC_ALERT_MS, HAPTIC_SIGNAL_MS, HAPTIC_TICK_MS, vibrate } from '../common/Haptics';
import { Palette } from '../common/Ui';
import { PrivacyView } from '../privacy/PrivacyView';
import { FoodDay } from '../quicklog/FoodDay';
import { QuickLogView } from '../quicklog/QuickLogView';
import { FormGuideView } from '../workout/FormGuideView';
import { dayKey, encodeState, restoreState } from '../storage/SavedState';
import { WatchStore } from '../storage/WatchStore';
import { StartView } from '../workout/StartView';
import { TickEvent, WorkoutPhase, WorkoutSession, WorkoutStatus } from '../workout/WorkoutSession';
import {
  adjustReps,
  ConfirmView,
  ControlsView,
  RestView,
  SetView,
  SummaryView,
} from '../workout/WorkoutViews';
import { ClockView } from './ClockView';

const QUICK_LOG_PAGE: number = 0;
const CLOCK_PAGE: number = 1;
const PRIVACY_PAGE: number = 3;
const SET_PAGE: number = 0;
const CONTROLS_PAGE: number = 1;
/** Crown rotation per detent. Direction and size need tuning on a real watch. */
const CROWN_STEP_DEGREES: number = 30;
const TICK_MS: number = 500;

/** The watch app's single screen: W1 normal and workout states, W2–W4 on top. */
@Entry
@ComponentV2
struct HomePage {
  private readonly store: WatchStore = new WatchStore();
  private readonly homePager: SwiperController = new SwiperController();
  private readonly workoutPager: SwiperController = new SwiperController();
  @Local session: WorkoutSession = new WorkoutSession(SAMPLE_PLAN);
  @Local day: FoodDay = new FoodDay(SAMPLE_DAY, SAMPLE_FAVORITES);
  @Local consented: boolean = false;
  @Local visible: boolean = true;
  @Local now: number = Date.now();
  @Local homePage: number = CLOCK_PAGE;
  @Local workoutPage: number = SET_PAGE;
  @Local showingForm: boolean = false;
  @Local confirmingEnd: boolean = false;
  @Local summaryDismissed: boolean = false;
  private ticker: number = -1;
  private crownDegrees: number = 0;
  private today: string = dayKey(Date.now());

  aboutToAppear(): void {
    this.store.open(this.getUIContext().getHostContext() as common.UIAbilityContext);
    this.consented = this.store.hasConsent();
    if (this.consented) {
      this.summaryDismissed =
        restoreState(this.store.loadState(), this.session, this.day, Date.now());
    }
    this.startTicker();
  }

  aboutToDisappear(): void {
    this.stopTicker();
  }

  onPageShow(): void {
    this.visible = true;
    this.startTicker();
    this.tick();
  }

  onPageHide(): void {
    this.visible = false;
    this.save();
    // A workout keeps ticking so the end of a rest can still vibrate.
    if (this.session.status !== WorkoutStatus.ACTIVE) {
      this.stopTicker();
    }
  }

  private startTicker(): void {
    if (this.ticker === -1) {
      this.ticker = setInterval(() => this.tick(), TICK_MS);
    }
  }

  private stopTicker(): void {
    clearInterval(this.ticker);
    this.ticker = -1;
  }

  private save(): void {
    this.store.saveState(encodeState(this.session, this.day, this.summaryDismissed, Date.now()));
  }

  private clearData(): void {
    this.store.clear();
    this.session = new WorkoutSession(SAMPLE_PLAN);
    this.day = new FoodDay(SAMPLE_DAY, SAMPLE_FAVORITES);
    this.summaryDismissed = false;
    this.homePage = CLOCK_PAGE;
    this.consented = false;
  }

  /** At midnight yesterday's food logs and finished workout go away. */
  private startNewDay(today: string): void {
    this.today = today;
    this.day = new FoodDay(SAMPLE_DAY, SAMPLE_FAVORITES);
    if (this.session.status !== WorkoutStatus.ACTIVE) {
      this.session = new WorkoutSession(SAMPLE_PLAN);
      this.summaryDismissed = false;
    }
  }

  /** Back (including a left-to-right swipe) steps out of a layer instead of closing the app. */
  onBackPress(): boolean {
    if (!this.consented) {
      return false;
    }
    if (this.session.status === WorkoutStatus.ACTIVE) {
      if (this.session.askingStillTraining) {
        this.session.stillTraining(Date.now());
      } else if (this.confirmingEnd) {
        this.confirmingEnd = false;
      } else if (this.showingForm) {
        this.closeForm();
      } else if (this.workoutPage === CONTROLS_PAGE) {
        this.continueWorkout();
      }
      return true;
    }
    if (this.session.status !== WorkoutStatus.IDLE && !this.summaryDismissed) {
      this.dismissSummary();
      return true;
    }
    // On Quick log a left-to-right swipe means "previous food", never "exit".
    return this.homePage === QUICK_LOG_PAGE;
  }

  private tick(): void {
    this.now = Date.now();
    const today = dayKey(this.now);
    if (today !== this.today) {
      this.startNewDay(today);
    }
    const event = this.session.tick(this.now);
    if (event === TickEvent.REST_OVER) {
      vibrate(HAPTIC_SIGNAL_MS);
    } else if (event === TickEvent.STILL_TRAINING || event === TickEvent.AUTO_ENDED) {
      vibrate(HAPTIC_ALERT_MS);
    }
    // One place to save: any change is on disk within a tick.
    this.save();
    if (!this.visible && this.session.status !== WorkoutStatus.ACTIVE) {
      this.stopTicker();
    }
  }

  private startWorkout(): void {
    this.resetWorkoutScreens();
    this.session.start(Date.now());
    vibrate(HAPTIC_SIGNAL_MS);
  }

  private reopenWorkout(): void {
    this.resetWorkoutScreens();
    this.session.reopen(Date.now());
  }

  private resetWorkoutScreens(): void {
    this.workoutPage = SET_PAGE;
    this.showingForm = false;
    this.confirmingEnd = false;
    this.summaryDismissed = false;
  }

  private dismissSummary(): void {
    this.summaryDismissed = true;
    this.homePage = CLOCK_PAGE;
  }

  private continueWorkout(): void {
    this.workoutPage = SET_PAGE;
    this.session.resume(Date.now());
  }

  private openForm(): void {
    this.session.pause(Date.now());
    this.showingForm = true;
  }

  private closeForm(): void {
    this.showingForm = false;
    this.session.resume(Date.now());
  }

  private onCrown(event: CrownEvent): void {
    event.stopPropagation();
    if (!this.consented) {
      return;
    }
    if (event.action === CrownAction.END) {
      this.crownDegrees = 0;
      return;
    }
    this.crownDegrees += event.degree;
    if (Math.abs(this.crownDegrees) < CROWN_STEP_DEGREES) {
      return;
    }
    const step = this.crownDegrees > 0 ? 1 : -1;
    this.crownDegrees = 0;

    if (this.session.status === WorkoutStatus.ACTIVE) {
      // In a workout the crown only edits reps; the swipe alone opens controls.
      if (!this.showingForm && !this.confirmingEnd && !this.session.askingStillTraining &&
        this.workoutPage === SET_PAGE && this.session.phase === WorkoutPhase.SET) {
        adjustReps(this.session, step);
      }
      return;
    }
    if (this.session.status !== WorkoutStatus.IDLE && !this.summaryDismissed) {
      return;
    }
    const page = this.homePage + step;
    if (page >= QUICK_LOG_PAGE && page <= PRIVACY_PAGE) {
      this.homePager.changeIndex(page, true);
      vibrate(HAPTIC_TICK_MS);
    }
  }

  @Builder
  summary() {
    SummaryView({
      session: this.session,
      onDone: () => this.dismissSummary(),
      onContinue: () => this.reopenWorkout(),
    });
  }

  @Builder
  workout() {
    if (this.session.askingStillTraining) {
      ConfirmView({
        title: 'Still training?',
        message: 'Sets done are saved',
        keepLabel: 'Keep going',
        onKeep: () => this.session.stillTraining(Date.now()),
        onEnd: () => this.session.end(Date.now()),
      });
    } else if (this.confirmingEnd) {
      ConfirmView({
        title: 'End workout?',
        message: `${this.session.exercisesDone}/${this.session.plan.exercises.length} exercises done\nSets done are saved`,
        keepLabel: 'Keep going',
        onKeep: () => {
          this.confirmingEnd = false;
        },
        onEnd: () => {
          this.confirmingEnd = false;
          this.session.end(Date.now());
        },
      });
    } else if (this.showingForm) {
      FormGuideView({
        exerciseName: this.session.exercise.name,
        active: this.visible,
        onBack: () => this.closeForm(),
      });
    } else {
      Swiper(this.workoutPager) {
        Column() {
          if (this.session.phase === WorkoutPhase.REST) {
            RestView({ session: this.session });
          } else {
            SetView({ session: this.session, onViewForm: () => this.openForm() });
          }
        }
        .width('100%')
        .height('100%');

        ControlsView({
          session: this.session,
          onContinue: () => this.continueWorkout(),
          onNewCycle: () => {
            this.workoutPage = SET_PAGE;
            this.session.newCycle(Date.now());
          },
          onSkipExercise: () => {
            this.workoutPage = SET_PAGE;
            this.session.skipExercise(Date.now());
          },
          onEnd: () => {
            this.confirmingEnd = true;
          },
        });
      }
      .index(this.workoutPage)
      .vertical(true)
      .loop(false)
      .indicator(false)
      .onChange((index: number) => {
        this.workoutPage = index;
        if (index === CONTROLS_PAGE) {
          this.session.pause(Date.now());
        } else {
          this.session.resume(Date.now());
        }
      })
      .width('100%')
      .height('100%');
    }
  }

  @Builder
  home() {
    Swiper(this.homePager) {
      QuickLogView({ day: this.day });
      ClockView({
        now: this.now,
        day: this.day,
        onOpenDemos: () => {
          // The BLE and IMU demos are developer tools: unreachable in release builds.
          if (BuildProfile.DEBUG) {
            this.getUIContext().getRouter().pushUrl({ url: 'pages/Index' });
          }
        },
      });
      Column() {
        if (this.session.status === WorkoutStatus.IDLE) {
          StartView({
            plan: this.session.plan,
            now: this.now,
            onStart: () => this.startWorkout(),
          });
        } else {
          this.summary();
        }
      }
      .width('100%')
      .height('100%');

      PrivacyView({ onClear: () => this.clearData() });
    }
    .index(this.homePage)
    .vertical(true)
    .loop(false)
    .indicator(false)
    .onChange((index: number) => {
      this.homePage = index;
    })
    .width('100%')
    .height('100%');
  }

  build() {
    Column() {
      if (!this.consented) {
        PrivacyView({
          firstRun: true,
          onAgree: () => {
            this.store.giveConsent();
            this.consented = true;
          },
        });
      } else if (this.session.status === WorkoutStatus.ACTIVE) {
        this.workout();
      } else if (this.session.status !== WorkoutStatus.IDLE && !this.summaryDismissed) {
        this.summary();
      } else {
        this.home();
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Palette.BACKGROUND)
    .focusable(true)
    .defaultFocus(true)
    .focusOnTouch(true)
    .onDigitalCrown((event: CrownEvent) => this.onCrown(event));
  }
}
