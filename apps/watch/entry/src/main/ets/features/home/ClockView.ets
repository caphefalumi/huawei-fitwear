import { Palette, SwipeHint, Type } from '../common/Ui';
import { FoodDay } from '../quicklog/FoodDay';

const WEEKDAYS: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatTime(now: number): string {
  const date = new Date(now);
  const minutes = date.getMinutes();
  return `${date.getHours()}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function formatDate(now: number): string {
  const date = new Date(now);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

/** W1a: time first, then kcal left and macro bars. */
@ComponentV2
export struct ClockView {
  @Require @Param now: number;
  @Require @Param day: FoodDay;
  @Event onOpenDemos: () => void = () => {};

  @Builder
  macroBar(label: string, eaten: number, target: number) {
    Row({ space: 4 }) {
      Text(label)
        .width(34)
        .fontSize(12)
        .fontColor(Palette.MUTED)
      Progress({ value: Math.min(eaten, target), total: target, type: ProgressType.Linear })
        .width(52)
        .color(Palette.ACCENT)
        .backgroundColor(Palette.TRACK)
        .style({ strokeWidth: 6 })
    };
  }

  build() {
    Column({ space: 8 }) {
      SwipeHint({ up: true, label: 'Quick log' })
      Column() {
        Text(formatDate(this.now))
          .fontSize(Type.SMALL)
          .fontColor(Palette.MUTED)
        Text(formatTime(this.now))
          .fontSize(Type.BIG)
          .fontWeight(FontWeight.Bold)
          .fontColor(Palette.TEXT)
      }// Hidden developer entry to the BLE and IMU demo pages.
      .gesture(LongPressGesture({ duration: 800 }).onAction(() => this.onOpenDemos()))
      Row({ space: 10 }) {
        Stack() {
          Progress({
            value: Math.min(this.day.kcalEaten, this.day.kcalTarget),
            total: this.day.kcalTarget,
            type: ProgressType.Ring,
          })
            .width(78)
            .height(78)
            .color(Palette.ACCENT)
            .backgroundColor(Palette.TRACK)
            .style({ strokeWidth: 7 })
          Column() {
            Text(`${Math.abs(this.day.kcalTarget - this.day.kcalEaten)}`)
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor(Palette.TEXT)
            Text(this.day.kcalEaten > this.day.kcalTarget ? 'kcal over' : 'kcal left')
              .fontSize(12)
              .fontColor(Palette.MUTED)
          }
        }
        Column({ space: 6 }) {
          this.macroBar('Pro', this.day.eaten.protein, this.day.target.protein)
          this.macroBar('Carb', this.day.eaten.carbs, this.day.target.carbs)
          this.macroBar('Fat', this.day.eaten.fat, this.day.target.fat)
        }
      }
      SwipeHint({ label: 'Workout' })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
