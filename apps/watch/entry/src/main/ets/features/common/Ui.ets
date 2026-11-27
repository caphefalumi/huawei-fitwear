/**
 * Watch design tokens.
 *
 * Wearables draw on true black: on OLED the black pixels are off, the round
 * glass edge disappears into the bezel and outdoor contrast is highest. The
 * brand crimson from the phone (#9D2332) is too dark to read on black, so the
 * watch uses two tones of the same hue: a lighter one for text and rings and a
 * deeper one behind white button labels. Greys are the phone's warm family.
 */
export class Palette {
  static readonly BACKGROUND: string = '#000000';
  /** Filled controls and grouped content. */
  static readonly SURFACE: string = '#1F1C1A';
  /** Progress tracks and dividers. */
  static readonly TRACK: string = '#3A3532';
  static readonly TEXT: string = '#FFFFFF';
  /** 8:1 on black. */
  static readonly MUTED: string = '#A39B93';
  /** Text, icons and rings on black (6.3:1). */
  static readonly ACCENT: string = '#F2576A';
  /** Behind white labels (5.5:1). */
  static readonly ACCENT_FILL: string = '#C8283C';
  /** Quiet accent background for badges. */
  static readonly ACCENT_TINT: string = '#3A1519';
  static readonly ON_ACCENT: string = '#FFFFFF';
}

/** One type ramp for every screen. Numbers use tabular figures so they do not jitter. */
export class Type {
  static readonly CAPTION: number = 13;
  static readonly BODY: number = 15;
  static readonly HEADLINE: number = 17;
  static readonly TITLE: number = 20;
  static readonly METRIC: number = 30;
  static readonly HERO: number = 52;
}

/** OpenType feature string for tabular numerals. */
export const TABULAR: string = '"tnum" 1';

/** Smallest comfortable touch target on a moving wrist. */
export const MIN_TARGET: number = 48;
/** Drawn height of every capsule button; the touch area is MIN_TARGET. */
export const BUTTON_HEIGHT: number = 44;
/** Width that stays inside the round screen's safe area at button height. */
export const BUTTON_WIDTH: number = 140;

export enum ButtonKind {
  PRIMARY,
  SECONDARY,
  /** Ends or deletes something: accent label on a quiet surface. */
  DESTRUCTIVE,
}

/** Capsule button with an optional leading system symbol. */
@ComponentV2
export struct WatchButton {
  @Require @Param label: string;
  @Param kind: ButtonKind = ButtonKind.SECONDARY;
  @Param icon: Resource | undefined = undefined;
  @Param buttonWidth: number = BUTTON_WIDTH;
  @Event onTap: () => void = () => {};

  private labelColor(): string {
    if (this.kind === ButtonKind.PRIMARY) {
      return Palette.ON_ACCENT;
    }
    return this.kind === ButtonKind.DESTRUCTIVE ? Palette.ACCENT : Palette.TEXT;
  }

  build() {
    Button({ type: ButtonType.Capsule }) {
      Row({ space: 6 }) {
        if (this.icon !== undefined) {
          SymbolGlyph(this.icon).fontSize(18).fontColor([this.labelColor()]);
        }
        Text(this.label)
          .fontSize(Type.BODY)
          .fontWeight(FontWeight.Medium)
          .fontColor(this.labelColor())
          .maxLines(1)
          .textOverflow({ overflow: TextOverflow.Ellipsis })
      }
      .padding({ left: 14, right: 14 })
    }
    .width(this.buttonWidth)
    .height(BUTTON_HEIGHT)
    .backgroundColor(this.kind === ButtonKind.PRIMARY ? Palette.ACCENT_FILL : Palette.SURFACE)
    .accessibilityText(this.label)
    .responseRegion({
      x: 0,
      y: (BUTTON_HEIGHT - MIN_TARGET) / 2,
      width: '100%',
      height: MIN_TARGET,
    })
    .onClick(() => this.onTap());
  }
}

/** Low-emphasis action: accent label with no fill, touch area still MIN_TARGET tall. */
@ComponentV2
export struct LinkButton {
  @Require @Param label: string;
  @Param icon: Resource | undefined = undefined;
  @Param color: string = Palette.ACCENT;
  @Event onTap: () => void = () => {};

  build() {
    Row({ space: 5 }) {
      if (this.icon !== undefined) {
        SymbolGlyph(this.icon).fontSize(15).fontColor([this.color]);
      }
      Text(this.label)
        .fontSize(Type.BODY)
        .fontWeight(FontWeight.Medium)
        .fontColor(this.color)
    }
    .height(32)
    .padding({ left: 12, right: 12 })
    .responseRegion({ x: 0, y: (32 - MIN_TARGET) / 2, width: '100%', height: MIN_TARGET })
    .accessibilityGroup(true)
    .accessibilityText(this.label)
    .onClick(() => this.onTap());
  }
}

/** Round icon-only button, e.g. the rep steppers. */
@ComponentV2
export struct IconButton {
  @Require @Param icon: Resource;
  @Require @Param label: string;
  @Param diameter: number = MIN_TARGET;
  @Event onTap: () => void = () => {};

  build() {
    Button({ type: ButtonType.Circle }) {
      SymbolGlyph(this.icon)
        .fontSize(22)
        .fontColor([Palette.TEXT])
    }
    .width(this.diameter)
    .height(this.diameter)
    .backgroundColor(Palette.SURFACE)
    .accessibilityText(this.label)
    .onClick(() => this.onTap());
  }
}

/** A system symbol in a tinted circle: the visual anchor of a status screen. */
@ComponentV2
export struct SymbolBadge {
  @Require @Param icon: Resource;
  @Param filled: boolean = false;
  @Param diameter: number = 52;

  build() {
    Stack() {
      SymbolGlyph(this.icon)
        .fontSize(this.diameter * 0.5)
        .fontColor([this.filled ? Palette.ON_ACCENT : Palette.ACCENT])
    }
    .width(this.diameter)
    .height(this.diameter)
    .borderRadius(this.diameter / 2)
    .backgroundColor(this.filled ? Palette.ACCENT_FILL : Palette.ACCENT_TINT)
    .accessibilityLevel('no');
  }
}

/** Page dots on the right edge, where HarmonyOS wearables show vertical pages. */
export function pageDots(): DotIndicator {
  return (
    new DotIndicator()
      .right(0)
      .itemWidth(5)
      .itemHeight(5)
      // The indicator is drawn rotated on a vertical Swiper, so width runs along the edge.
      .selectedItemWidth(12)
      .selectedItemHeight(5)
      .color(Palette.TRACK)
      .selectedColor(Palette.TEXT)
  );
}
