import { formatTime } from '../home/ClockView';
import { ButtonKind, Palette, SymbolBadge, TABULAR, Type, WatchButton } from '../common/Ui';
import { WorkoutPlan } from '../link/SyncProtocol';
import { REST_DAY_NAME } from './WorkoutSession';

/** W1b: today's workout, started with one tap. */
@ComponentV2
export struct StartView {
  @Require @Param plan: WorkoutPlan;
  @Require @Param now: number;
  @Event onStart: () => void = () => {};

  @Builder
  message(icon: Resource, title: string, detail: string) {
    SymbolBadge({ icon: icon });
    Text(title)
      .fontSize(Type.HEADLINE)
      .fontWeight(FontWeight.Bold)
      .fontColor(Palette.TEXT)
      .textAlign(TextAlign.Center);
    Text(detail)
      .width('70%')
      .fontSize(Type.CAPTION)
      .fontColor(Palette.MUTED)
      .textAlign(TextAlign.Center);
  }

  build() {
    Column({ space: 8 }) {
      Text(formatTime(this.now))
        .fontSize(Type.CAPTION)
        .fontWeight(FontWeight.Medium)
        .fontFeature(TABULAR)
        .fontColor(Palette.MUTED)
      if (this.plan.name === REST_DAY_NAME) {
        this.message($r('sys.symbol.figure_walk'), 'Rest day', 'Recovery is part of the plan');
      } else if (this.plan.exercises.length === 0) {
        this.message($r('sys.symbol.phone_fill'), 'No workout yet', 'Open VoocHealth on your phone');
      } else {
        SymbolBadge({ icon: $r('sys.symbol.dumbbell') });
        Column({ space: 2 }) {
          Text('Today')
            .fontSize(Type.CAPTION)
            .fontWeight(FontWeight.Medium)
            .fontColor(Palette.ACCENT);
          Text(this.plan.name)
            .width('72%')
            .fontSize(Type.TITLE)
            .fontWeight(FontWeight.Bold)
            .fontColor(Palette.TEXT)
            .textAlign(TextAlign.Center)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis });
          Text(`${this.plan.exercises.length} exercises, ${this.plan.minutes} min`)
            .fontSize(Type.CAPTION)
            .fontFeature(TABULAR)
            .fontColor(Palette.MUTED);
        }
        .accessibilityGroup(true);
        WatchButton({
          label: 'Start',
          kind: ButtonKind.PRIMARY,
          icon: $r('sys.symbol.play_fill'),
          onTap: () => this.onStart(),
        });
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
