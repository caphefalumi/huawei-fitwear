import { Palette, PillButton, Type } from '../common/Ui';

const FRAME_MS: number = 700;

/**
 * W3: two still frames flipped in turn. The figure is a placeholder bench press;
 * per-exercise artwork is not available yet.
 */
@ComponentV2
export struct FormGuideView {
  @Require @Param exerciseName: string;
  /** False while the screen is hidden, which stops the animation timer. */
  @Param active: boolean = true;
  @Event onBack: () => void = () => {};
  @Local raised: boolean = true;
  private frameTimer: number = -1;

  aboutToAppear(): void {
    this.animate();
  }

  aboutToDisappear(): void {
    clearInterval(this.frameTimer);
  }

  @Monitor('active')
  animate(): void {
    clearInterval(this.frameTimer);
    if (this.active) {
      this.frameTimer = setInterval(() => {
        this.raised = !this.raised;
      }, FRAME_MS);
    }
  }

  @Builder
  stroke(x1: number, y1: number, x2: number, y2: number) {
    Line()
      .width(114)
      .height(69)
      .startPoint([x1 * 1.5, y1 * 1.5])
      .endPoint([x2 * 1.5, y2 * 1.5])
      .stroke(Palette.TEXT)
      .strokeWidth(3)
      .strokeLineCap(LineCapStyle.Round);
  }

  build() {
    Column({ space: 10 }) {
      Text(this.exerciseName)
        .width('70%')
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
      Stack({ alignContent: Alignment.TopStart }) {
        this.stroke(6, 34, 70, 34) // bench
        this.stroke(16, 34, 16, 44)
        this.stroke(60, 34, 60, 44)
        Circle({ width: 15, height: 15 })
          .fill(Palette.TEXT)
          .position({ x: 16.5, y: 31.5 })
        this.stroke(22, 28, 50, 28) // body
        this.stroke(50, 28, 64, 40)
        this.stroke(30, 28, 30, this.raised ? 10 : 21) // arm
        this.stroke(22, this.raised ? 10 : 21, 38, this.raised ? 10 : 21) // bar
      }
      .width(114)
      .height(69)
      PillButton({ label: 'Back', onTap: () => this.onBack() })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
