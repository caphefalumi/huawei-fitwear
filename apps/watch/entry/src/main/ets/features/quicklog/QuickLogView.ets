import { util } from '@kit.ArkTS';
import { HAPTIC_SIGNAL_MS, vibrate } from '../common/Haptics';
import { ButtonKind, Palette, SymbolBadge, TABULAR, Type, WatchButton } from '../common/Ui';
import { FavoriteMeal } from '../link/SyncProtocol';
import { FoodDay, UNDO_WINDOW_MS } from './FoodDay';

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

  private log(food: FavoriteMeal): void {
    if (!this.day.log(food, util.generateRandomUUID(), Date.now())) {
      return;
    }
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
  macro(label: string, grams: number) {
    Column() {
      Text(`${grams} g`)
        .fontSize(Type.CAPTION)
        .fontWeight(FontWeight.Medium)
        .fontFeature(TABULAR)
        .fontColor(Palette.TEXT)
      Text(label)
        .fontSize(11)
        .fontColor(Palette.MUTED)
    }
    .constraintSize({ minWidth: 40 });
  }

  @Builder
  foodCard(food: FavoriteMeal) {
    Column({ space: 6 }) {
      Column({ space: 2 }) {
        Text('Quick log')
          .fontSize(Type.CAPTION)
          .fontWeight(FontWeight.Medium)
          .fontColor(Palette.ACCENT)
        Text(food.name)
          .width('70%')
          .fontSize(Type.HEADLINE)
          .fontWeight(FontWeight.Bold)
          .fontColor(Palette.TEXT)
          .textAlign(TextAlign.Center)
          .maxLines(2)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      Row({ space: 4 }) {
        Text(`${food.kcal}`)
          .fontSize(Type.METRIC)
          .fontWeight(FontWeight.Bold)
          .fontFeature(TABULAR)
          .fontColor(Palette.TEXT)
        Text('kcal')
          .fontSize(Type.CAPTION)
          .fontColor(Palette.MUTED)
      }.alignItems(VerticalAlign.Bottom)
      Row({ space: 4 }) {
        this.macro('Protein', food.protein)
        this.macro('Carbs', food.carbs)
        this.macro('Fat', food.fat)
      }
      if (this.day.waiting(food) > 0) {
        Row({ space: 4 }) {
          LoadingProgress()
            .width(12)
            .height(12)
            .color(Palette.ACCENT)
          Text('Waiting for phone')
            .fontSize(Type.CAPTION)
            .fontColor(Palette.ACCENT)
          SymbolGlyph($r('sys.symbol.xmark'))
            .fontSize(Type.CAPTION - 3)
            .fontColor([Palette.ACCENT])
          Text(`${this.day.waiting(food)}`)
            .fontSize(Type.CAPTION)
            .fontFeature(TABULAR)
            .fontColor(Palette.ACCENT)
        }
        .accessibilityGroup(true)
        .accessibilityText(`Waiting for phone, ${this.day.waiting(food)} times`);
      }
      WatchButton({
        label: 'Log',
        kind: ButtonKind.PRIMARY,
        icon: $r('sys.symbol.plus'),
        buttonWidth: 120,
        onTap: () => this.log(food),
      })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }

  build() {
    Column() {
      if (this.day.favorites.length === 0) {
        Column({ space: 8 }) {
          SymbolBadge({ icon: $r('sys.symbol.fork_knife') })
          Text('No favorites yet')
            .fontSize(Type.HEADLINE)
            .fontWeight(FontWeight.Bold)
            .fontColor(Palette.TEXT)
          Text(this.day.hasData ? 'Log a meal on your phone first' : 'Open the phone app')
            .width('70%')
            .fontSize(Type.CAPTION)
            .fontColor(Palette.MUTED)
            .textAlign(TextAlign.Center)
        };
      } else if (this.justLogged !== '') {
        Column({ space: 10 }) {
          SymbolBadge({ icon: $r('sys.symbol.checkmark') })
          Text('Logged')
            .fontSize(Type.TITLE)
            .fontWeight(FontWeight.Bold)
            .fontColor(Palette.TEXT)
          Text(this.justLogged)
            .width('70%')
            .fontSize(Type.CAPTION)
            .fontColor(Palette.MUTED)
            .textAlign(TextAlign.Center)
            .maxLines(2)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
          WatchButton({
            label: 'Undo',
            icon: $r('sys.symbol.arrow_counterclockwise'),
            buttonWidth: 110,
            onTap: () => this.undo(),
          })
        };
      } else {
        Stack({ alignContent: Alignment.Bottom }) {
          // No loop: swiping stops at food 1, so the start of the list is always clear.
          Swiper() {
            ForEach(
              this.day.favorites,
              (food: FavoriteMeal) => {
                this.foodCard(food);
              },
              // The card is a builder and keeps the figures it was drawn with, so an edited meal
              // needs a new key to be drawn again.
              (food: FavoriteMeal) =>
                `${food.ref}:${food.name}:${food.kcal}:${food.protein}:${food.carbs}:${food.fat}`,
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
              (food: FavoriteMeal, index: number) => {
                Circle({ width: 5, height: 5 })
                  .fill(index === this.favoriteIndex ? Palette.TEXT : Palette.TRACK);
              },
              (food: FavoriteMeal) => food.ref,
            )
          }
          .margin({ bottom: 14 })
          .accessibilityLevel('no')
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
