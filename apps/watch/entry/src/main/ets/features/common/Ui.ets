/** Same values as the mobile app: apps/mobile/src/theme/tokens.ts. */
export class Palette {
  static readonly BACKGROUND: string = '#FAF9F6';
  static readonly SURFACE: string = '#EFEBE5';
  static readonly TRACK: string = '#D6D0C9';
  static readonly TEXT: string = '#252321';
  static readonly MUTED: string = '#68625C';
  static readonly ACCENT: string = '#9D2332';
  static readonly ON_ACCENT: string = '#FFFFFF';
}

export class Type {
  static readonly SMALL: number = 13;
  static readonly TITLE: number = 18;
  static readonly BIG: number = 46;
}

/** Smallest comfortable touch target on a moving wrist. */
export const MIN_TARGET: number = 48;

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
      // The touch area is taller than the drawn pill.
      .responseRegion({ x: 0, y: this.primary ? -3 : -6, width: '100%', height: MIN_TARGET })
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
