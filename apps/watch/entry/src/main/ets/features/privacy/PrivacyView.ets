import { Palette, PillButton, SwipeHint, Type } from '../common/Ui';

/** First-run notice, and later the page where saved data can be cleared. */
@ComponentV2
export struct PrivacyView {
  @Param firstRun: boolean = false;
  @Event onAgree: () => void = () => {};
  @Event onClear: () => void = () => {};
  @Local confirming: boolean = false;

  build() {
    Column({ space: 10 }) {
      if (!this.firstRun) {
        SwipeHint({ up: true });
      }
      Text(this.firstRun ? 'Your data' : 'Privacy')
        .fontSize(Type.TITLE)
        .fontWeight(FontWeight.Bold)
        .fontColor(Palette.TEXT)
      Text('Saved on this watch. Workouts are shared with your paired phone.')
        .width('72%')
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
      if (this.firstRun) {
        PillButton({ label: 'Agree', primary: true, onTap: () => this.onAgree() });
      } else {
        // Two taps, so one stray touch cannot delete anything.
        PillButton({
          label: this.confirming ? 'Tap to confirm' : 'Clear data',
          pillWidth: 130,
          onTap: () => {
            if (this.confirming) {
              this.confirming = false;
              this.onClear();
            } else {
              this.confirming = true;
            }
          },
        });
      }
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .onVisibleAreaChange([0.0], (visible: boolean) => {
      if (!visible) {
        this.confirming = false;
      }
    });
  }
}
