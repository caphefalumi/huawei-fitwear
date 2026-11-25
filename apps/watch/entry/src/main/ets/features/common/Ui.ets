/** Shared watch colors, type sizes and the pill button. */
export class Palette {
  static readonly BACKGROUND: string = '#000000';
  static readonly TEXT: string = '#FFFFFF';
  static readonly MUTED: string = '#A7B0BE';
  static readonly SURFACE: string = '#2A313C';
  static readonly ACCENT: string = '#F29A9A';
  static readonly ON_ACCENT: string = '#2A0606';
}

export class Type {
  static readonly SMALL: number = 13;
  static readonly TITLE: number = 18;
  static readonly BIG: number = 46;
}

@ComponentV2
export struct PillButton {
  @Require @Param label: string;
  @Param primary: boolean = false;
  @Param pillWidth: number = 96;
  @Event onTap: () => void = () => {};

  build() {
    Button(this.label, { type: ButtonType.Capsule })
      .width(this.pillWidth)
      .height(this.primary ? 42 : 36)
      .padding({ left: 4, right: 4 })
      .fontSize(this.primary ? 16 : 14)
      .fontWeight(FontWeight.Medium)
      .fontColor(this.primary ? Palette.ON_ACCENT : Palette.TEXT)
      .backgroundColor(this.primary ? Palette.ACCENT : Palette.SURFACE)
      .onClick(() => this.onTap());
  }
}

/** Swipe hint. The chevron is drawn because the watch font has no ⌃ or ⌄ glyph. */
@ComponentV2
export struct SwipeHint {
  @Param up: boolean = false;
  @Param label: string = '';

  build() {
    Row({ space: 5 }) {
      Path()
        .width(12)
        .height(6)
        .commands(this.up ? 'M2 10 L12 2 L22 10' : 'M2 2 L12 10 L22 2')
        .fillOpacity(0)
        .stroke(Palette.MUTED)
        .strokeWidth(1.5);
      if (this.label !== '') {
        Text(this.label).fontSize(Type.SMALL).fontColor(Palette.MUTED);
      }
    }
  }
}
