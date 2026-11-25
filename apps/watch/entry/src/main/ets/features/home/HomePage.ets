import { abilityAccessCtrl, common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { util } from '@kit.ArkTS';
import { hilog } from '@kit.PerformanceAnalysisKit';
import BuildProfile from 'BuildProfile';
import { NO_PLAN, SAMPLE_DAY, SAMPLE_FAVORITES, SAMPLE_PLAN } from '../common/SampleData';
import { LinkState, PhoneLink, PhoneLinkHandlers } from '../link/PhoneLink';
import { mergeSessions, SharedSession, WorkoutPlan } from '../link/SyncProtocol';
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

function initialPlan(): WorkoutPlan {
  return BuildProfile.DEBUG ? SAMPLE_PLAN : NO_PLAN;
}

/** The watch app's single screen: W1 normal and workout states, W2–W4 on top. */
@Entry
@ComponentV2
struct HomePage {
  private readonly store: WatchStore = new WatchStore();
  private readonly homePager: SwiperController = new SwiperController();
  private readonly workoutPager: SwiperController = new SwiperController();
  private readonly link: PhoneLink = new PhoneLink();
  /** The phone's latest plan, held while a different workout is still on screen. */
  private phonePlan: WorkoutPlan | undefined = undefined;
  /** Session id and revision the phone already has. */
  private sentKey: string = '';
  @Local session: WorkoutSession = new WorkoutSession(initialPlan());
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
      const restored =
        restoreState(this.store.loadState(), initialPlan(), this.day, Date.now());
      this.session = restored.session;
      this.summaryDismissed = restored.summaryDismissed;
      this.startLink();
    }
    this.startTicker();
  }

  aboutToDisappear(): void {
    this.stopTicker();
    this.link.stop();
  }

  onPageShow(): void {
    this.visible = true;
    if (this.consented) {
      this.startLink();
    }
    this.startTicker();
    this.tick();
  }

  onPageHide(): void {
    this.visible = false;
    this.save();
    // A workout keeps ticking so the end of a rest can still vibrate.
    if (this.session.status !== WorkoutStatus.ACTIVE) {
      this.stopTicker();
      this.link.stop();
    }
  }

  /** Asks for Bluetooth the first time, then waits for the phone. */
  private startLink(): void {
    const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
    abilityAccessCtrl.createAtManager()
      .requestPermissionsFromUser(context, ['ohos.permission.ACCESS_BLUETOOTH'])
      .then((result) => {
        if (result.authResults[0] === 0 && this.visible && this.consented) {
          this.link.start(context, this.linkHandlers());
        }
      })
      .catch((err: BusinessError) => {
        hilog.warn(0x0000, 'HomePage', 'Bluetooth permission failed: %{public}d', err.code);
      });
  }

  private linkHandlers(): PhoneLinkHandlers {
    return {
      allowedPhone: () => this.store.allowedPhone(),
      allowPhone: (phone: string) => this.store.allowPhone(phone),
      onReady: () => {
        this.sentKey = '';
      },
      onPlan: (plan: WorkoutPlan) => this.receivePlan(plan),
      onSession: (session: SharedSession) => this.receiveSession(session),
    };
  }

  private receivePlan(plan: WorkoutPlan): void {
    this.phonePlan = plan;
    const same = JSON.stringify(plan) === JSON.stringify(this.session.plan);
    const finished = this.session.status === WorkoutStatus.IDLE ||
      (this.session.status !== WorkoutStatus.ACTIVE && this.summaryDismissed);
    if (!same && finished) {
      this.session = new WorkoutSession(plan);
      this.summaryDismissed = false;
    }
  }

  private receiveSession(remote: SharedSession): void {
    const now = Date.now();
    const result = mergeSessions(this.session.shared(now), remote, true);
    if (result.changed) {
      const merged = result.session;
      const wasActive = this.session.status === WorkoutStatus.ACTIVE;
      let target = this.session;
      // A new workout always uses the phone's latest version of the plan.
      if (this.phonePlan?.name === merged.plan &&
        (merged.id !== target.id || merged.plan !== target.plan.name)) {
        target = new WorkoutSession(this.phonePlan);
      }
      if (!target.applyShared(merged, now)) {
        return;
      }
      this.session = target;
      if (!wasActive && target.status === WorkoutStatus.ACTIVE) {
        this.resetWorkoutScreens();
        vibrate(HAPTIC_SIGNAL_MS);
      } else if (wasActive && target.status !== WorkoutStatus.ACTIVE) {
        this.summaryDismissed = false;
        this.showingForm = false;
        this.confirmingEnd = false;
      }
      if (!result.reply) {
        this.sentKey = `${merged.id}:${merged.rev}`;
      }
    } else if (result.reply) {
      this.sentKey = '';
    }
  }

  /** Sends the workout whenever it has changed since the phone last saw it. */
  private publish(): void {
    const shared = this.session.shared(Date.now());
    if (!shared || this.link.state !== LinkState.CONNECTED) {
      return;
    }
    const key = `${shared.id}:${shared.rev}`;
    if (key !== this.sentKey) {
      this.sentKey = key;
      this.link.sendSession(shared);
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
    this.link.stop();
    this.store.clear();
    this.phonePlan = undefined;
    this.session = new WorkoutSession(initialPlan());
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
      this.session = new WorkoutSession(this.session.plan);
      this.summaryDismissed = false;
    }
  }

  /** Back (including a left-to-right swipe) steps out of a layer instead of closing the app. */
  onBackPress(): boolean {
    if (!this.consented) {
      return false;
    }
    if (this.link.state === LinkState.APPROVAL) {
      this.link.reject();
      return true;
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
    // One place to save and send: any change is on disk and on the phone within a tick.
    this.save();
    this.publish();
    if (!this.visible && this.session.status !== WorkoutStatus.ACTIVE) {
      this.stopTicker();
      this.link.stop();
    }
  }

  private startWorkout(): void {
    this.resetWorkoutScreens();
    this.session.start(Date.now(), util.generateRandomUUID());
    vibrate(HAPTIC_SIGNAL_MS);
  }

  private reopenWorkout(): void {
    this.resetWorkoutScreens();
    this.session.reopen(Date.now());
    this.publish();
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
    if (this.phonePlan) {
      this.receivePlan(this.phonePlan);
    }
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
      connected: this.link.state === LinkState.CONNECTED,
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
        exerciseKey: this.session.exercise.key,
        exerciseName: this.session.exercise.name,
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
        connected: this.link.state === LinkState.CONNECTED,
        onOpenDemos: () => {
          // The BLE and IMU demos are developer tools: unreachable in release builds.
          if (BuildProfile.DEBUG) {
            // The demos run their own GATT server on the same service.
            this.link.stop();
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
      } else if (this.link.state === LinkState.APPROVAL) {
        ConfirmView({
          title: 'Pair phone?',
          message: 'A phone wants to\nshare workouts',
          keepLabel: 'Allow',
          endLabel: 'Not now',
          onKeep: () => this.link.allow(),
          onEnd: () => this.link.reject(),
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
