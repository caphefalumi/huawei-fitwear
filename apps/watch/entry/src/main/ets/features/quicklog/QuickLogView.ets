import { HAPTIC_SIGNAL_MS, vibrate } from '../common/Haptics';
import { Palette, PillButton, Type } from '../common/Ui';
import { Food, FoodDay } from './FoodDay';

const UNDO_WINDOW_MS: number = 5000;

/** W1e: one favorite per page, tap to log, 5 seconds to undo. */
@ComponentV2
export struct QuickLogView {
  @Require @Param day: FoodDay;
  @Local favoriteIndex: number = 0;
  @Local justLogged: string = '';
  private undoTimer: number = -1;

  aboutToDisappear(): void {
    clearTimeout(this.undoTimer);
  }

  private log(food: Food): void {
    this.day.log(food);
    this.justLogged = food.name;
    vibrate(HAPTIC_SIGNAL_MS);
    clearTimeout(this.undoTimer);
    this.undoTimer = setTimeout(() => {
      this.justLogged = '';
    }, UNDO_WINDOW_MS);
  }

  private undo(): void {
    clearTimeout(this.undoTimer);
    this.day.undoLast();
    this.justLogged = '';
  }

  @Builder
  macroRow(label: string, grams: number) {
    Row() {
      Text(label)
        .width(36)
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
      Text(`${grams} g`)
        .fontSize(Type.SMALL)
        .fontColor(Palette.TEXT)
    };
  }

  @Builder
  foodCard(food: Food) {
    Column({ space: 6 }) {
      Text('Quick log')
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
      Text(food.name)
        .width('70%')
        .fontSize(16)
        .fontWeight(FontWeight.Bold)
        .fontColor(Palette.TEXT)
        .textAlign(TextAlign.Center)
        .maxLines(2)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
      Row({ space: 12 }) {
        Column() {
          Text(`${food.kcal}`)
            .fontSize(30)
            .fontWeight(FontWeight.Bold)
            .fontColor(Palette.TEXT)
          Text('kcal')
            .fontSize(Type.SMALL)
            .fontColor(Palette.MUTED)
        }
        Divider()
          .vertical(true)
          .height(48)
          .color(Palette.TRACK)
        Column() {
          this.macroRow('Pro', food.macros.protein)
          this.macroRow('Carb', food.macros.carbs)
          this.macroRow('Fat', food.macros.fat)
        }.alignItems(HorizontalAlign.Start)
      }
      if (this.day.timesLogged(food) > 0) {
        Text(`Logged today ×${this.day.timesLogged(food)}`)
          .fontSize(12)
          .fontColor(Palette.ACCENT);
      }
      PillButton({ label: 'Log', primary: true, onTap: () => this.log(food) })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }

  build() {
    Column() {
      if (this.day.favorites.length === 0) {
        Text('Add favorites on your phone')
          .width('70%')
          .fontSize(16)
          .fontColor(Palette.TEXT)
          .textAlign(TextAlign.Center);
      } else if (this.justLogged !== '') {
        Column({ space: 10 }) {
          Text('✓ Logged')
            .fontSize(Type.TITLE)
            .fontWeight(FontWeight.Bold)
            .fontColor(Palette.TEXT)
          Text(this.justLogged)
            .width('70%')
            .fontSize(Type.SMALL)
            .fontColor(Palette.MUTED)
            .textAlign(TextAlign.Center)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
          PillButton({ label: 'Undo', onTap: () => this.undo() })
        };
      } else {
        Stack({ alignContent: Alignment.Bottom }) {
          // No loop: swiping stops at food 1, so the start of the list is always clear.
          Swiper() {
            ForEach(
              this.day.favorites,
              (food: Food) => {
                this.foodCard(food);
              },
              (food: Food) => food.name,
            )
          }
          .index(this.favoriteIndex)
          .loop(false)
          .indicator(false)
          .effectMode(EdgeEffect.None)
          .onChange((index: number) => {
            this.favoriteIndex = index;
          })
          .width('100%')
          .height('100%')
          Row({ space: 5 }) {
            ForEach(
              this.day.favorites,
              (food: Food, index: number) => {
                Circle({ width: 6, height: 6 }).fill(
                  index === this.favoriteIndex ? Palette.ACCENT : Palette.TRACK,
                );
              },
              (food: Food) => food.name,
            )
          }
          .margin({ bottom: 10 })
        }
        .width('100%')
        .height('100%');
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
