import { abilityAccessCtrl, common } from '@kit.AbilityKit';
import { BusinessError, power } from '@kit.BasicServicesKit';
import { util } from '@kit.ArkTS';
import { hilog } from '@kit.PerformanceAnalysisKit';
import BuildProfile from 'BuildProfile';
import { NO_PLAN, SAMPLE_DAY, SAMPLE_PLAN } from '../common/SampleData';
import { LinkState, PhoneLink, PhoneLinkHandlers } from '../link/PhoneLink';
import { DayInfo, mergeSessions, SharedSession, WorkoutPlan } from '../link/SyncProtocol';
import { HAPTIC_ALERT_MS, HAPTIC_SIGNAL_MS, HAPTIC_TICK_MS, vibrate } from '../common/Haptics';
import { pageDots, Palette } from '../common/Ui';
import { PrivacyView } from '../privacy/PrivacyView';
import { FoodDay, isoDay } from '../quicklog/FoodDay';
import { QuickLogView } from '../quicklog/QuickLogView';
import { AutoReps } from '../reps/AutoReps';
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
/** How often unsaved quick logs are offered to the phone again. */
const FOOD_RETRY_MS: number = 60000;

function initialPlan(): WorkoutPlan {
  return BuildProfile.DEBUG ? SAMPLE_PLAN : NO_PLAN;
}

/** Debug builds can be tried without a phone; release builds show only the phone's figures. */
function sampleDay(): DayInfo {
  return {
    date: isoDay(Date.now()),
    owner: SAMPLE_DAY.owner,
    kcalTarget: SAMPLE_DAY.kcalTarget,
    kcalEaten: SAMPLE_DAY.kcalEaten,
    target: SAMPLE_DAY.target,
    eaten: SAMPLE_DAY.eaten,
    favorites: SAMPLE_DAY.favorites,
    applied: [],
  };
}

/** The watch app's single screen: W1 normal and workout states, W2–W4 on top. */
@Entry
@ComponentV2
struct HomePage {
  private readonly store: WatchStore = new WatchStore();
  private readonly homePager: SwiperController = new SwiperController();
  private readonly workoutPager: SwiperController = new SwiperController();
  private readonly link: PhoneLink = new PhoneLink();
  private readonly autoReps: AutoReps = new AutoReps();
  /** The phone's latest plan, held while a different workout is still on screen. */
  private phonePlan: WorkoutPlan | undefined = undefined;
  /** Session id and revision the phone already has. */
  private sentKey: string = '';
  @Local session: WorkoutSession = new WorkoutSession(initialPlan());
  @Local day: FoodDay = new FoodDay();
  /** Quick logs last offered to the phone, and when. */
  private sentFood: string = '';
  private sentFoodAt: number = 0;
  @Local consented: boolean = false;
  @Local visible: boolean = true;
  @Local now: number = Date.now();
  @Local homePage: number = CLOCK_PAGE;
  @Local workoutPage: number = SET_PAGE;
  @Local showingForm: boolean = false;
  @Local confirmingEnd: boolean = false;
  @Local summaryDismissed: boolean = false;
  /** Asking whether to continue a workout the wearer walked away from. */
  @Local interrupted: boolean = false;
  /** The wearer left the app mid-workout (the screen merely sleeping does not count). */
  private exited: boolean = false;
  private ticker: number = -1;
  private crownDegrees: number = 0;
  private today: string = dayKey(Date.now());

  /** Sends a change as it happens instead of at the next tick, which stays as the fallback. */
  @Monitor('session.rev')
  onSessionChange(): void {
    this.publish();
  }

  /** Starts and stops counting reps as sets begin, pause and end. */
  @Monitor('session', 'session.status', 'session.phase', 'session.paused', 'session.position')
  onSetChange(): void {
    this.countReps();
  }

  /** Counts reps from the wrist during a set, unless the wearer has left the app. */
  private countReps(): void {
    const context = this.getUIContext().getHostContext() as common.Context;
    this.autoReps.sync(this.exited ? undefined : this.session, context.resourceManager);
  }

  aboutToAppear(): void {
    this.store.open(this.getUIContext().getHostContext() as common.UIAbilityContext);
    this.consented = this.store.hasConsent();
    if (this.consented) {
      const restored = restoreState(this.store.loadState(), initialPlan(), this.day, Date.now());
      this.session = restored.session;
      this.summaryDismissed = restored.summaryDismissed;
      this.interrupt();
      this.startLink();
    }
    this.useSampleDay();
    this.startTicker();
  }

  aboutToDisappear(): void {
    this.stopTicker();
    this.link.stop();
    this.autoReps.stop();
  }

  onPageShow(): void {
    this.visible = true;
    if (this.consented) {
      this.startLink();
    }
    if (this.exited) {
      this.exited = false;
      this.interrupt();
    }
    this.startTicker();
    this.tick();
  }

  onPageHide(): void {
    this.visible = false;
    this.save();
    // As in the BLE demo, the connection stays up; only the app closing ends it.
    if (this.session.status === WorkoutStatus.ACTIVE && power.isActive()) {
      this.exited = true;
      this.countReps();
    }
    if (this.idleInBackground()) {
      this.stopTicker();
    }
  }

  /** Nothing to time and no phone to keep up to date. */
  private idleInBackground(): boolean {
    return (
      !this.visible &&
      this.session.status !== WorkoutStatus.ACTIVE &&
      this.link.state === LinkState.OFF
    );
  }

  /** Pauses an unfinished workout until the wearer says what to do with it. */
  private interrupt(): void {
    if (this.session.status !== WorkoutStatus.ACTIVE) {
      return;
    }
    if (!this.session.hasProgress) {
      this.session.resume(Date.now());
      return;
    }
    this.session.pause(Date.now());
    this.showingForm = false;
    this.confirmingEnd = false;
    this.interrupted = true;
  }

  private continueOldCycle(): void {
    this.interrupted = false;
    if (this.session.status === WorkoutStatus.ACTIVE) {
      this.resetWorkoutScreens();
      this.session.resume(Date.now());
    } else {
      this.reopenWorkout();
    }
  }

  /** Starts the workout over; the unfinished one is discarded. */
  private startNewCycle(): void {
    this.interrupted = false;
    if (this.phonePlan?.name === this.session.plan.name) {
      this.session = new WorkoutSession(this.phonePlan);
    }
    this.startWorkout();
    this.publish();
  }

  /** Asks for Bluetooth the first time, then waits for the phone. */
  private startLink(): void {
    const context = this.getUIContext().getHostContext() as common.UIAbilityContext;
    abilityAccessCtrl
      .createAtManager()
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
        this.sentFood = '';
      },
      onPlan: (plan: WorkoutPlan) => this.receivePlan(plan),
      onSession: (session: SharedSession) => this.receiveSession(session),
      onDay: (info: DayInfo) => {
        this.day.apply(info);
        this.save();
      },
    };
  }

  private receivePlan(plan: WorkoutPlan): void {
    this.phonePlan = plan;
    const same = JSON.stringify(plan) === JSON.stringify(this.session.plan);
    const finished =
      this.session.status === WorkoutStatus.IDLE ||
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
      if (
        this.phonePlan?.name === merged.plan &&
        (merged.id !== target.id || merged.plan !== target.plan.name)
      ) {
        target = new WorkoutSession(this.phonePlan);
      }
      if (!target.applyShared(merged, now)) {
        return;
      }
      this.session = target;
      // Training carried on from the phone, so the wearer did not walk away from it.
      this.exited = false;
      // The phone moved the workout on, so there is nothing left to ask.
      if (this.interrupted) {
        this.interrupted = false;
        target.resume(now);
      }
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

  private publishFood(now: number): void {
    if (this.link.state !== LinkState.CONNECTED) {
      return;
    }
    const logs = this.day.due(now);
    const key = logs.map((log) => log.id).join();
    if (logs.length > 0 && (key !== this.sentFood || now - this.sentFoodAt >= FOOD_RETRY_MS)) {
      this.sentFood = key;
      this.sentFoodAt = now;
      this.link.sendFood(logs);
    }
  }

  private useSampleDay(): void {
    if (BuildProfile.DEBUG && !this.day.hasData) {
      this.day.apply(sampleDay());
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
    this.day = new FoodDay();
    this.useSampleDay();
    this.summaryDismissed = false;
    this.homePage = CLOCK_PAGE;
    this.consented = false;
    this.interrupted = false;
  }

  /** At midnight yesterday's food totals and finished workout go away. */
  private startNewDay(today: string): void {
    this.today = today;
    this.day.today = isoDay(this.now);
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
      if (this.interrupted) {
        this.continueOldCycle();
      } else if (this.session.askingStillTraining) {
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
    // An unanswered resume prompt must not count as idling.
    const event = this.interrupted ? TickEvent.NONE : this.session.tick(this.now);
    if (event === TickEvent.REST_OVER) {
      vibrate(HAPTIC_SIGNAL_MS);
    } else if (event === TickEvent.STILL_TRAINING || event === TickEvent.AUTO_ENDED) {
      vibrate(HAPTIC_ALERT_MS);
    }
    this.countReps();
    // One place to save and send: any change is on disk and on the phone within a tick.
    this.save();
    this.publish();
    this.publishFood(this.now);
    if (this.idleInBackground()) {
      this.stopTicker();
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

  /** Records the set with any rep counted but not shown yet. */
  private doneSet(): void {
    this.autoReps.finish(this.session);
    this.session.doneSet(Date.now());
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
    if (!this.consented || this.interrupted) {
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
      if (
        !this.showingForm &&
        !this.confirmingEnd &&
        !this.session.askingStillTraining &&
        this.workoutPage === SET_PAGE &&
        this.session.phase === WorkoutPhase.SET
      ) {
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

  private phoneLabel(): string {
    if (this.link.state === LinkState.CONNECTED) {
      return this.link.phoneName || 'Phone';
    }
    return this.link.state === LinkState.OFF ? 'Tap to connect' : 'Searching';
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
        endLabel: 'End workout',
        endDestructive: true,
        icon: $r('sys.symbol.timer'),
        onKeep: () => this.session.stillTraining(Date.now()),
        onEnd: () => this.session.end(Date.now()),
      });
    } else if (this.confirmingEnd) {
      ConfirmView({
        title: 'End workout?',
        message: `${this.session.exercisesDone}/${this.session.plan.exercises.length} exercises done\nSets done are saved`,
        keepLabel: 'Keep going',
        endLabel: 'End workout',
        endDestructive: true,
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
            SetView({
              session: this.session,
              autoCounting: this.autoReps.counting,
              onViewForm: () => this.openForm(),
              onDoneSet: () => this.doneSet(),
            });
          }
        }
        .width('100%')
        .height('100%')
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
        })
      }
      .index(this.workoutPage)
      .vertical(true)
      .loop(false)
      .indicator(pageDots())
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
      QuickLogView({ day: this.day })
      ClockView({
        now: this.now,
        day: this.day,
        connected: this.link.state === LinkState.CONNECTED,
        phoneLabel: this.phoneLabel(),
        searching: this.link.state === LinkState.SEARCHING,
        onConnect: () => this.startLink(),
        onOpenDemos: () => {
          // A developer tool: unreachable in release builds.
          if (BuildProfile.DEBUG) {
            this.getUIContext().getRouter().pushUrl({ url: 'features/imu/ImuPage' });
          }
        },
      })
      Column() {
        if (this.session.status === WorkoutStatus.IDLE) {
          StartView({
            plan: this.session.plan,
            now: this.now,
            onStart: () => this.startWorkout(),
          });
        } else if (this.session.status === WorkoutStatus.ENDED_EARLY && !this.session.isClosed) {
          ConfirmView({
            title: 'Resume workout?',
            message: `Sets done: ${this.session.records.length}\nNew cycle starts over`,
            keepLabel: 'Continue',
            endLabel: 'New cycle',
            onKeep: () => this.continueOldCycle(),
            onEnd: () => this.startNewCycle(),
          });
        } else {
          this.summary();
        }
      }
      .width('100%')
      .height('100%')
      PrivacyView({ onClear: () => this.clearData() })
    }
    .index(this.homePage)
    .vertical(true)
    .loop(false)
    .indicator(pageDots())
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
            this.startLink();
          },
        });
      } else if (this.link.state === LinkState.APPROVAL) {
        ConfirmView({
          title: 'Pair phone?',
          icon: $r('sys.symbol.bluetooth'),
          message: `${this.link.phoneName || 'A phone'}\nwants to share workouts`,
          keepLabel: 'Allow',
          endLabel: 'Not now',
          onKeep: () => this.link.allow(),
          onEnd: () => this.link.reject(),
        });
      } else if (this.interrupted && this.session.status === WorkoutStatus.ACTIVE) {
        ConfirmView({
          title: 'Resume workout?',
          message: `Sets done: ${this.session.records.length}\nNew cycle starts over`,
          keepLabel: 'Continue',
          endLabel: 'New cycle',
          onKeep: () => this.continueOldCycle(),
          onEnd: () => this.startNewCycle(),
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
