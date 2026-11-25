import { formatTime } from '../home/ClockView';
import { Palette, PillButton, SwipeHint, Type } from '../common/Ui';
import { WorkoutPlan } from '../link/SyncProtocol';
import { REST_DAY_NAME } from './WorkoutSession';

/** W1b: a single question, answered with one tap. */
@ComponentV2
export struct StartView {
  @Require @Param plan: WorkoutPlan;
  @Require @Param now: number;
  @Event onStart: () => void = () => {};

  @Builder
  message(text: string) {
    Text(text)
      .width('70%')
      .fontSize(16)
      .fontColor(Palette.TEXT)
      .textAlign(TextAlign.Center);
  }

  build() {
    Column({ space: 10 }) {
      SwipeHint({ up: true, label: formatTime(this.now) });
      if (this.plan.name === REST_DAY_NAME) {
        this.message('Rest day');
      } else if (this.plan.exercises.length === 0) {
        this.message('Open VoocHealth on your phone');
      } else {
        Text('Start workout?')
          .fontSize(Type.TITLE)
          .fontWeight(FontWeight.Bold)
          .fontColor(Palette.TEXT);
        Text(`${this.plan.name} · ${this.plan.exercises.length} exercises\nabout ${this.plan.minutes} min`)
          .fontSize(Type.SMALL)
          .fontColor(Palette.MUTED)
          .textAlign(TextAlign.Center);
        PillButton({ label: 'Start', primary: true, onTap: () => this.onStart() });
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
