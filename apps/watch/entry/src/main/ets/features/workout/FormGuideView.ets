import { common } from '@kit.AbilityKit';
import { loadAnimation, mediaId } from '../media/ExerciseMedia';
import { Palette, PillButton, Type } from '../common/Ui';

/** W3: the exercise animation from the mobile app. */
@ComponentV2
export struct FormGuideView {
  @Require @Param exerciseKey: string;
  @Require @Param exerciseName: string;
  @Event onBack: () => void = () => {};
  @Local gifUri: string = '';

  aboutToAppear(): void {
    this.load();
  }

  @Monitor('exerciseKey')
  load(): void {
    this.gifUri = '';
    const id = mediaId(this.exerciseKey);
    if (id === '') {
      return;
    }
    loadAnimation(this.getUIContext().getHostContext() as common.Context, id)
      .then((uri: string) => {
        if (id === mediaId(this.exerciseKey)) {
          this.gifUri = uri;
        }
      });
  }

  build() {
    Column({ space: 8 }) {
      Text(this.exerciseName)
        .width('70%')
        .fontSize(Type.SMALL)
        .fontColor(Palette.MUTED)
        .textAlign(TextAlign.Center)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis });
      if (mediaId(this.exerciseKey) === '') {
        Text('No animation for this exercise')
          .width('70%')
          .fontSize(Type.SMALL)
          .fontColor(Palette.TEXT)
          .textAlign(TextAlign.Center);
      } else {
        Image(this.gifUri !== '' ? this.gifUri :
          $rawfile(`exercise-loops/${mediaId(this.exerciseKey)}.webp`))
          .width(124)
          .height(124)
          .borderRadius(18)
          .objectFit(ImageFit.Contain);
      }
      PillButton({ label: 'Back', onTap: () => this.onBack() });
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center);
  }
}
