import { HAPTIC_SIGNAL_MS, HAPTIC_TICK_MS, vibrate } from '../common/Haptics';
import { MIN_TARGET, Palette, PillButton, SwipeHint, Type } from '../common/Ui';
import { WorkoutPhase, WorkoutSession, WorkoutStatus } from './WorkoutSession';

/** Changes the rep count with haptics; shared by the buttons and the crown. */
export function adjustReps(session: WorkoutSession, delta: number): void {
  const reachedTarget = session.changeReps(delta, Date.now());
  vibrate(reachedTarget ? HAPTIC_SIGNAL_MS : HAPTIC_TICK_MS);
}

/** W1c: which exercise, which set, which rep. */
@ComponentV2
export struct SetView {
  @Require @Param session: WorkoutSession;
  @Event onViewForm: () => void = () => {};

  @Builder
  stepButton(label: string, delta: number) {
    Button(label, { type: ButtonType.Circle })
      .width(MIN_TARGET)
      .height(MIN_TARGET)
      .fontSize(22)
      .fontColor(Palette.TEXT)
      .backgroundColor(Palette.SURFACE)
      .onClick(() => adjustReps(this.session, delta));
  }

  build() {
    Column({ space: 6 }) {
      Text(`${this.session.exercise.name} · Set ${this.session.setIndex + 1}/${this.session.exercise.sets}`)
        .width('72%')
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
        .maxLines(2);
      Row({ space: 10 }) {
        this.stepButton('−', this.session.exercise.unit === 'seconds' ? -5 : -1);
        Text() {
          Span(`${this.session.reps}`).fontSize(Type.BIG).fontWeight(FontWeight.Bold);
          Span(`/${this.session.exercise.reps}${this.session.exercise.unit === 'seconds' ? 's' : ''}`)
            .fontSize(Type.TITLE);
        }
        .fontColor(Palette.TEXT)
        .constraintSize({ minWidth: 72 })
        .textAlign(TextAlign.Center);
        this.stepButton('+', this.session.exercise.unit === 'seconds' ? 5 : 1);
      }
      PillButton({
        label: 'Done set',
        primary: true,
        pillWidth: 116,
        onTap: () => {
          vibrate(HAPTIC_SIGNAL_MS);
          this.session.doneSet(Date.now());
        },
      });
      Text('View form')
        .fontSize(Type.SMALL)
        .fontColor(Palette.TEXT)
        .decoration({ type: TextDecorationType.Underline, color: Palette.MUTED })
        .padding({ left: 12, right: 12, top: 4, bottom: 4 })
        .responseRegion({ x: 0, y: -4, width: '100%', height: 44 })
        .onClick(() => this.onViewForm());
      SwipeHint();
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}

/** W2: rest countdown. */
@ComponentV2
export struct RestView {
  @Require @Param session: WorkoutSession;

  /** Rest follows the previous set, which may belong to the previous exercise. */
  private restTotal(): number {
    return Math.max(this.session.exercise.rest, Math.ceil(this.session.restLeftMs / 1000), 1);
  }

  private countdown(): string {
    const seconds = Math.ceil(this.session.restLeftMs / 1000);
    const rest = seconds % 60;
    return `${Math.floor(seconds / 60)}:${rest < 10 ? '0' : ''}${rest}`;
  }

  private next(): string {
    // Set 1 after a rest means the previous exercise has just finished.
    return this.session.setIndex === 0
      ? this.session.exercise.name
      : `Set ${this.session.setIndex + 1}/${this.session.exercise.sets}`;
  }

  build() {
    Column({ space: 8 }) {
      Text(`Rest · next: ${this.next()}`)
        .width('72%')
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis });
      Stack() {
        Progress({
          value: Math.min(this.session.restLeftMs / 1000, this.restTotal()),
          total: this.restTotal(),
          type: ProgressType.Ring,
        })
          .width(100)
          .height(100)
          .color(Palette.ACCENT)
          .backgroundColor(Palette.TRACK)
          .style({ strokeWidth: 7 });
        Text(this.countdown()).fontSize(30).fontWeight(FontWeight.Bold).fontColor(Palette.TEXT);
      }
      Row({ space: 8 }) {
        PillButton({ label: 'Skip', pillWidth: 68, onTap: () => this.session.skipRest(Date.now()) });
        PillButton({ label: '+15 s', pillWidth: 68, onTap: () => this.session.extendRest(Date.now()) });
      }
      SwipeHint();
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}

/** W1d: shown while the workout is paused. */
@ComponentV2
export struct ControlsView {
  @Require @Param session: WorkoutSession;
  @Event onContinue: () => void = () => {};
  @Event onSkipExercise: () => void = () => {};
  @Event onEnd: () => void = () => {};

  build() {
    Column({ space: 10 }) {
      SwipeHint({
        up: true,
        label: `Paused · ${this.session.plan.name} ${this.session.exercisesDone}/${this.session.plan.exercises.length}`,
      });
      PillButton({ label: 'Continue', primary: true, pillWidth: 130, onTap: () => this.onContinue() });
      PillButton({ label: 'Skip exercise', pillWidth: 130, onTap: () => this.onSkipExercise() });
      Text('End workout')
        .fontSize(12)
        .fontColor(Palette.MUTED)
        .decoration({ type: TextDecorationType.Underline, color: Palette.MUTED })
        .padding({ left: 12, right: 12, top: 6, bottom: 6 })
        .responseRegion({ x: 0, y: -4, width: '100%', height: 44 })
        .onClick(() => this.onEnd());
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}

/** Two-button question: "End workout?" and "Still training?". */
@ComponentV2
export struct ConfirmView {
  @Require @Param title: string;
  @Require @Param message: string;
  @Require @Param keepLabel: string;
  @Param endLabel: string = 'End';
  @Event onKeep: () => void = () => {};
  @Event onEnd: () => void = () => {};

  build() {
    Column({ space: 10 }) {
      Text(this.title).fontSize(Type.TITLE).fontWeight(FontWeight.Bold).fontColor(Palette.TEXT);
      Text(this.message)
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center);
      PillButton({ label: this.keepLabel, primary: true, pillWidth: 130, onTap: () => this.onKeep() });
      PillButton({ label: this.endLabel, onTap: () => this.onEnd() });
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}

/** W4: totals for the workout. */
@ComponentV2
export struct SummaryView {
  @Require @Param session: WorkoutSession;
  @Param connected: boolean = false;
  @Event onDone: () => void = () => {};
  @Event onContinue: () => void = () => {};

  @Builder
  stat(value: number, label: string) {
    Column() {
      Text(`${value}`).fontSize(26).fontWeight(FontWeight.Bold).fontColor(Palette.TEXT);
      Text(label).fontSize(12).fontColor(Palette.MUTED);
    }
  }

  build() {
    Column({ space: 10 }) {
      Text(this.session.status === WorkoutStatus.ENDED_EARLY
        ? `Ended early · ${this.session.exercisesDone}/${this.session.plan.exercises.length} exercises`
        : 'Workout done')
        .width('72%')
        .fontSize(15)
        .fontWeight(FontWeight.Bold)
        .fontColor(Palette.TEXT)
        .textAlign(TextAlign.Center);
      Row({ space: 18 }) {
        this.stat(this.session.records.length, 'sets');
        this.stat(this.session.totalReps, 'reps');
        this.stat(Math.round(this.session.activeMs / 60000), 'min');
      }
      // The phone saves workouts to the account; the watch cannot.
      Text(this.connected ? 'Save it on your phone' : 'Open phone to save')
        .width('72%')
        .fontSize(12)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center);
      PillButton({ label: 'Done', primary: true, onTap: () => this.onDone() });
      if (this.session.status === WorkoutStatus.ENDED_EARLY) {
        Text('Continue')
          .fontSize(Type.SMALL)
          .fontColor(Palette.TEXT)
          .decoration({ type: TextDecorationType.Underline, color: Palette.MUTED })
          .padding({ left: 12, right: 12, top: 2, bottom: 2 })
          .responseRegion({ x: 0, y: -4, width: '100%', height: 44 })
          .onClick(() => this.onContinue());
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
