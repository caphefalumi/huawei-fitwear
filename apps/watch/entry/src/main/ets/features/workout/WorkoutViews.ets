import { HAPTIC_SIGNAL_MS, HAPTIC_TICK_MS, vibrate } from '../common/Haptics';
import {
  ButtonKind,
  IconButton,
  LinkButton,
  Palette,
  SymbolBadge,
  TABULAR,
  Type,
  WatchButton,
} from '../common/Ui';
import { WorkoutSession, WorkoutStatus } from './WorkoutSession';

/** Changes the rep count with haptics; shared by the buttons and the crown. */
export function adjustReps(session: WorkoutSession, delta: number): void {
  const reachedTarget = session.changeReps(delta, Date.now());
  vibrate(reachedTarget ? HAPTIC_SIGNAL_MS : HAPTIC_TICK_MS);
}

/** More sets than this read better as "Set 3 of 10" alone. */
const MAX_SET_DOTS: number = 8;

function range(count: number): number[] {
  const items: number[] = [];
  for (let i = 0; i < count; i++) {
    items.push(i);
  }
  return items;
}

/** W1c: which exercise, which set, which rep. */
@ComponentV2
export struct SetView {
  @Require @Param session: WorkoutSession;
  @Event onViewForm: () => void = () => {};

  private isTimed(): boolean {
    return this.session.exercise.unit === 'seconds';
  }

  /** Finished sets filled, the current one outlined in accent. */
  @Builder
  setDots() {
    Row({ space: 4 }) {
      ForEach(
        range(this.session.exercise.sets),
        (index: number) => {
          Circle({ width: 7, height: 7 })
            .fill(index < this.session.setIndex ? Palette.ACCENT : Palette.BACKGROUND)
            .stroke(index <= this.session.setIndex ? Palette.ACCENT : Palette.TRACK)
            .strokeWidth(1.5);
        },
        (index: number) => `${index}`,
      )
    }
    .accessibilityLevel('no');
  }

  build() {
    Column({ space: 6 }) {
      Column({ space: 3 }) {
        Text(this.session.exercise.name)
          .width('72%')
          .fontSize(Type.HEADLINE)
          .fontWeight(FontWeight.Bold)
          .fontColor(Palette.TEXT)
          .textAlign(TextAlign.Center)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
        Row({ space: 6 }) {
          Text(`Set ${this.session.setIndex + 1} of ${this.session.exercise.sets}`)
            .fontSize(Type.CAPTION)
            .fontWeight(FontWeight.Medium)
            .fontFeature(TABULAR)
            .fontColor(Palette.ACCENT)
          if (this.session.exercise.sets <= MAX_SET_DOTS) {
            this.setDots();
          }
        }
      }
      .accessibilityGroup(true)
      Row({ space: 8 }) {
        IconButton({
          icon: $r('sys.symbol.minus'),
          label: this.isTimed() ? 'Minus 5 seconds' : 'One less rep',
          onTap: () => adjustReps(this.session, this.isTimed() ? -5 : -1),
        })
        Column() {
          Text(`${this.session.reps}`)
            .fontSize(Type.HERO)
            .fontWeight(FontWeight.Bold)
            .fontFeature(TABULAR)
            .fontColor(Palette.TEXT)
            .lineHeight(Type.HERO + 2)
          Text(`of ${this.session.exercise.reps}${this.isTimed() ? ' s' : ' reps'}`)
            .fontSize(Type.CAPTION)
            .fontFeature(TABULAR)
            .fontColor(Palette.MUTED)
        }
        .constraintSize({ minWidth: 76 })
        .accessibilityGroup(true)
        .accessibilityText(
          `${this.session.reps} of ${this.session.exercise.reps} ${this.isTimed() ? 'seconds' : 'reps'}`,
        )
        IconButton({
          icon: $r('sys.symbol.plus'),
          label: this.isTimed() ? 'Plus 5 seconds' : 'One more rep',
          onTap: () => adjustReps(this.session, this.isTimed() ? 5 : 1),
        })
      }
      WatchButton({
        label: 'Done set',
        kind: ButtonKind.PRIMARY,
        icon: $r('sys.symbol.checkmark'),
        onTap: () => {
          vibrate(HAPTIC_SIGNAL_MS);
          this.session.doneSet(Date.now());
        },
      })
      LinkButton({ label: 'Form', icon: $r('sys.symbol.eye'), onTap: () => this.onViewForm() })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}

/**
 * Rest replaces the set screen under the finger that tapped "Done set", so its
 * buttons ignore taps this soon after appearing. A late or bounced touch must
 * not skip the rest the wearer just earned.
 */
const REST_TAP_GUARD_MS: number = 600;

/** W2: rest countdown on a ring that follows the round screen's edge. */
@ComponentV2
export struct RestView {
  @Require @Param session: WorkoutSession;
  private shownAt: number = 0;

  aboutToAppear(): void {
    this.shownAt = Date.now();
  }

  private settled(): boolean {
    return Date.now() - this.shownAt >= REST_TAP_GUARD_MS;
  }

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
      : `Set ${this.session.setIndex + 1} of ${this.session.exercise.sets}`;
  }

  build() {
    Stack() {
      Progress({
        value: Math.min(this.session.restLeftMs / 1000, this.restTotal()),
        total: this.restTotal(),
        type: ProgressType.Ring,
      })
        .width('94%')
        .aspectRatio(1)
        .color(Palette.ACCENT)
        .backgroundColor(Palette.SURFACE)
        .style({ strokeWidth: 8 })
        .accessibilityLevel('no')
      Column({ space: 6 }) {
        Column() {
          Text('Rest')
            .fontSize(Type.CAPTION)
            .fontWeight(FontWeight.Medium)
            .fontColor(Palette.ACCENT)
          Text(this.countdown())
            .fontSize(Type.HERO)
            .fontWeight(FontWeight.Bold)
            .fontFeature(TABULAR)
            .fontColor(Palette.TEXT)
            .lineHeight(Type.HERO + 2)
          Text(`Next: ${this.next()}`)
            .width(140)
            .fontSize(Type.CAPTION)
            .fontColor(Palette.MUTED)
            .textAlign(TextAlign.Center)
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .accessibilityGroup(true)
        Row({ space: 8 }) {
          WatchButton({
            label: 'Skip',
            buttonWidth: 70,
            onTap: () => {
              if (this.settled()) {
                this.session.skipRest(Date.now());
              }
            },
          })
          WatchButton({
            label: '+15 s',
            buttonWidth: 70,
            onTap: () => {
              if (this.settled()) {
                this.session.extendRest(Date.now());
              }
            },
          })
        }
      }
    }
    .width('100%')
    .height('100%')
    .alignContent(Alignment.Center);
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
    Column({ space: 8 }) {
      Column({ space: 2 }) {
        Text('Paused')
          .fontSize(Type.HEADLINE)
          .fontWeight(FontWeight.Bold)
          .fontColor(Palette.TEXT)
        Text(
          `${this.session.plan.name}: ${this.session.exercisesDone}/${this.session.plan.exercises.length}`,
        )
          .width('70%')
          .fontSize(Type.CAPTION)
          .fontFeature(TABULAR)
          .fontColor(Palette.MUTED)
          .textAlign(TextAlign.Center)
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .accessibilityGroup(true)
      .margin({ bottom: 2 })
      WatchButton({
        label: 'Continue',
        kind: ButtonKind.PRIMARY,
        icon: $r('sys.symbol.play_fill'),
        onTap: () => this.onContinue(),
      })
      WatchButton({
        label: 'Skip exercise',
        icon: $r('sys.symbol.forward_end_fill'),
        onTap: () => this.onSkipExercise(),
      })
      WatchButton({
        label: 'End workout',
        kind: ButtonKind.DESTRUCTIVE,
        icon: $r('sys.symbol.xmark'),
        onTap: () => this.onEnd(),
      })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}

/** Two-answer question: "End workout?", "Still training?", "Pair phone?". */
@ComponentV2
export struct ConfirmView {
  @Require @Param title: string;
  @Require @Param message: string;
  @Require @Param keepLabel: string;
  @Param endLabel: string = 'End';
  /** The second answer throws something away. */
  @Param endDestructive: boolean = false;
  @Param icon: Resource | undefined = undefined;
  @Event onKeep: () => void = () => {};
  @Event onEnd: () => void = () => {};

  build() {
    Column({ space: 8 }) {
      if (this.icon !== undefined) {
        SymbolBadge({ icon: this.icon, diameter: 40 });
      }
      Column({ space: 3 }) {
        Text(this.title)
          .fontSize(Type.TITLE)
          .fontWeight(FontWeight.Bold)
          .fontColor(Palette.TEXT)
          .textAlign(TextAlign.Center)
        Text(this.message)
          .width('72%')
          .fontSize(Type.CAPTION)
          .fontColor(Palette.MUTED)
          .textAlign(TextAlign.Center)
      }
      .accessibilityGroup(true)
      .margin({ bottom: 2 })
      WatchButton({
        label: this.keepLabel,
        kind: ButtonKind.PRIMARY,
        onTap: () => this.onKeep(),
      })
      WatchButton({
        label: this.endLabel,
        kind: this.endDestructive ? ButtonKind.DESTRUCTIVE : ButtonKind.SECONDARY,
        onTap: () => this.onEnd(),
      })
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

  private early(): boolean {
    return this.session.status === WorkoutStatus.ENDED_EARLY;
  }

  @Builder
  stat(value: number, label: string) {
    Column() {
      Text(`${value}`)
        .fontSize(Type.METRIC)
        .fontWeight(FontWeight.Bold)
        .fontFeature(TABULAR)
        .fontColor(Palette.TEXT)
      Text(label)
        .fontSize(Type.CAPTION)
        .fontColor(Palette.MUTED)
    }
    .constraintSize({ minWidth: 44 })
    .accessibilityGroup(true)
    .accessibilityText(`${value} ${label}`);
  }

  build() {
    Column({ space: 6 }) {
      Row({ space: 6 }) {
        if (this.early()) {
          SymbolGlyph($r('sys.symbol.stopwatch'))
            .fontSize(Type.HEADLINE)
            .fontColor([Palette.ACCENT]);
        } else {
          SymbolGlyph($r('sys.symbol.checkmark_circle_fill'))
            .fontSize(Type.HEADLINE)
            .fontColor([Palette.ACCENT]);
        }
        Text(
          this.early()
            ? `Ended: ${this.session.exercisesDone}/${this.session.plan.exercises.length}`
            : 'Workout done',
        )
          .fontSize(Type.HEADLINE)
          .fontWeight(FontWeight.Bold)
          .fontFeature(TABULAR)
          .fontColor(Palette.TEXT)
      }
      .accessibilityGroup(true)
      Row({ space: 16 }) {
        this.stat(this.session.records.length, 'sets')
        this.stat(this.session.totalReps, 'reps')
        this.stat(Math.round(this.session.activeMs / 60000), 'min')
      }
      // The phone saves workouts to the account; the watch cannot.
      Text(this.connected ? 'Save it on your phone' : 'Open phone to save')
        .width('72%')
        .fontSize(Type.CAPTION)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
      WatchButton({ label: 'Done', kind: ButtonKind.PRIMARY, onTap: () => this.onDone() })
      if (this.early()) {
        LinkButton({ label: 'Continue', onTap: () => this.onContinue() });
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
