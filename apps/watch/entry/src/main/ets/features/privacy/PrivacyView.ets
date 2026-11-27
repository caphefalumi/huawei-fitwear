import { ButtonKind, Palette, SymbolBadge, Type, WatchButton } from '../common/Ui';

/** First-run notice, and later the page where saved data can be cleared. */
@ComponentV2
export struct PrivacyView {
  @Param firstRun: boolean = false;
  @Event onAgree: () => void = () => {};
  @Event onClear: () => void = () => {};
  @Local confirming: boolean = false;

  build() {
    Column({ space: 8 }) {
      SymbolBadge({ icon: $r('sys.symbol.lock_fill'), diameter: 44 })
      Text(this.firstRun ? 'Your data' : 'Privacy')
        .fontSize(Type.TITLE)
        .fontWeight(FontWeight.Bold)
        .fontColor(Palette.TEXT)
      Text('Kept on this watch and shared only with your paired phone.')
        .width('72%')
        .fontSize(Type.CAPTION)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
      if (this.firstRun) {
        WatchButton({ label: 'Agree', kind: ButtonKind.PRIMARY, onTap: () => this.onAgree() });
      } else {
        // Two taps, so one stray touch cannot delete anything.
        WatchButton({
          label: this.confirming ? 'Tap to confirm' : 'Clear data',
          kind: this.confirming ? ButtonKind.PRIMARY : ButtonKind.DESTRUCTIVE,
          icon: $r('sys.symbol.trash'),
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
