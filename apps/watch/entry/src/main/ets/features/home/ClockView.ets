import { Palette, TABULAR, Type } from '../common/Ui';
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

/** W1a: time first, then the phone link, kcal left and macro bars. */
@ComponentV2
export struct ClockView {
  @Require @Param now: number;
  @Require @Param day: FoodDay;
  @Param connected: boolean = false;
  @Param phoneLabel: string = '';
  /** Looking for a phone: a spinner replaces the status dot. */
  @Param searching: boolean = false;
  @Event onConnect: () => void = () => {};
  @Event onOpenDemos: () => void = () => {};

  @Builder
  macroBar(label: string, eaten: number, target: number) {
    Row({ space: 6 }) {
      Text(label)
        .width(30)
        .fontSize(Type.CAPTION)
        .fontColor(Palette.MUTED)
      Progress({ value: Math.min(eaten, target), total: Math.max(target, 1), type: ProgressType.Linear })
        .width(54)
        .color(Palette.ACCENT)
        .backgroundColor(Palette.TRACK)
        .style({ strokeWidth: 5, strokeRadius: 3 })
    }
    .accessibilityGroup(true)
    .accessibilityText(`${label} ${eaten} of ${target} grams`);
  }

  /** Phone link as a small capsule; tapping it looks for the phone again. */
  @Builder
  phoneChip() {
    Row({ space: 6 }) {
      if (this.searching) {
        LoadingProgress().width(14).height(14).color(Palette.MUTED);
      } else {
        SymbolGlyph($r('sys.symbol.bluetooth'))
          .fontSize(13)
          .fontColor([this.connected ? Palette.ACCENT : Palette.MUTED]);
      }
      Text(this.phoneLabel)
        .constraintSize({ maxWidth: 104 })
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
        .fontSize(Type.CAPTION)
        .fontWeight(FontWeight.Medium)
        .fontColor(this.connected ? Palette.TEXT : Palette.MUTED)
    }
    .height(28)
    .padding({ left: 10, right: 12 })
    .borderRadius(14)
    .backgroundColor(Palette.SURFACE)
    .responseRegion({ x: 0, y: -10, width: '100%', height: 48 })
    .accessibilityGroup(true)
    .accessibilityText(`Phone, ${this.phoneLabel}`)
    .onClick(() => this.onConnect());
  }

  build() {
    Column({ space: 6 }) {
      Column() {
        Text(formatDate(this.now))
          .fontSize(Type.CAPTION)
          .fontWeight(FontWeight.Medium)
          .fontColor(Palette.ACCENT)
        Text(formatTime(this.now))
          .fontSize(Type.HERO)
          .fontWeight(FontWeight.Bold)
          .fontFeature(TABULAR)
          .fontColor(Palette.TEXT)
          .lineHeight(Type.HERO + 4)
      }// Hidden developer entry to the IMU sensor page.
      .gesture(LongPressGesture({ duration: 800 }).onAction(() => this.onOpenDemos()))
      this.phoneChip()
      if (!this.day.hasData) {
        this.note("Open the phone app to see today's food");
      } else if (this.day.kcalTarget === 0) {
        this.note(`${this.day.kcalEaten} kcal eaten\nSet your goals on the phone`);
      } else {
        this.targets();
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }

  @Builder
  note(message: string) {
    Text(message)
      .width('70%')
      .margin({ top: 4 })
      .fontSize(Type.CAPTION)
      .fontColor(Palette.MUTED)
      .textAlign(TextAlign.Center);
  }

  /** Calories left, macro progress and the protein still to eat. */
  @Builder
  targets() {
    Column({ space: 4 }) {
      Row({ space: 10 }) {
        Stack() {
          Progress({
            value: Math.min(this.day.kcalEaten, this.day.kcalTarget),
            total: this.day.kcalTarget,
            type: ProgressType.Ring,
          })
            .width(70)
            .height(70)
            .color(Palette.ACCENT)
            .backgroundColor(Palette.TRACK)
            .style({ strokeWidth: 7 })
          Column() {
            Text(`${Math.abs(this.day.kcalTarget - this.day.kcalEaten)}`)
              .fontSize(Type.HEADLINE)
              .fontWeight(FontWeight.Bold)
              .fontFeature(TABULAR)
              .fontColor(Palette.TEXT)
            Text(this.day.kcalEaten > this.day.kcalTarget ? 'kcal over' : 'kcal left')
              .fontSize(11)
              .fontColor(Palette.MUTED)
          }
        }
        .accessibilityGroup(true)
        Column({ space: 7 }) {
          this.macroBar('Pro', this.day.eaten.protein, this.day.target.protein)
          this.macroBar('Carb', this.day.eaten.carbs, this.day.target.carbs)
          this.macroBar('Fat', this.day.eaten.fat, this.day.target.fat)
        }
      }
      Text(`${Math.max(0, this.day.target.protein - this.day.eaten.protein)} g protein left`)
        .fontSize(Type.CAPTION)
        .fontFeature(TABULAR)
        .fontColor(Palette.MUTED)
    }
    .margin({ top: 4 });
  }
}
