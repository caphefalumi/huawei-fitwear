import { router } from '@kit.ArkUI';

@Entry
@ComponentV2
struct Index {
  build() {
    Column({ space: 12 }) {
      Text($r('app.string.EntryAbility_label'))
        .fontSize(18)
        .fontWeight(FontWeight.Bold)
        .fontColor('#FFFFFF')
        .margin({ top: 20 })

      Text('Watch demos')
        .fontSize(12)
        .fontColor('#94A3B8')

      Button('Bluetooth')
        .width('70%')
        .height(36)
        .fontSize(14)
        .backgroundColor('#2563EB')
        .onClick(() => {
          router.pushUrl({ url: 'features/ble/BlePage' });
        })

      Button('IMU Sensors')
        .width('70%')
        .height(36)
        .fontSize(14)
        .backgroundColor('#0D9488')
        .onClick(() => {
          router.pushUrl({ url: 'features/imu/ImuPage' });
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor('#020617')
  }
}
