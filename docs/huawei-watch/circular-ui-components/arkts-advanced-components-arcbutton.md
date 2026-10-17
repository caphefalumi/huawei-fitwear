<!--
  Title: Arc Button (ArcButton) (Recommended for Circular Screens)
  Catalog: harmonyos-guides
  Document ID: arkts-advanced-components-arcbutton
  Updated: 2026-10-14 09:31:13
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/arkts-advanced-components-arcbutton
-->
# Arc Button (ArcButton) (Recommended for Circular Screens)

Supported since API version 18, the **ArcButton** component represents an arc button. It is recommended for circular screens. It offers various button styles, such as emphasized, normal, and warning, tailored for users. For details, see [ArcButton](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton).

#### Creating a Button

To create an **ArcButton** component, use the following:

```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
    position: ArcButtonPosition.TOP_EDGE,
    styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
  // ···
  })
})
```

[label](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions): sets the text displayed on the button.

[position](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions): sets the position of the button.

[styleMode](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions): sets the style of the button.

#### Setting the Button Type

The **ArcButton** component offers two types: top arc button and bottom arc button. Use the [position](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) attribute to set the position.

- Bottom arc button (default type) Set [position](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) to **ArcButtonPosition.BOTTOM_EDGE**. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
    position: ArcButtonPosition.BOTTOM_EDGE,
    styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
  // ···
  })

})
```

- Top arc button Set [position](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) to **ArcButtonPosition.TOP_EDGE**. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
    position: ArcButtonPosition.TOP_EDGE,
    styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
  // ···
  })
})
```

#### Customizing the Style

- Setting the background color Use the [backgroundColor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) attribute to set the background color of the button. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
    styleMode: ArcButtonStyleMode.CUSTOM,
    backgroundColor: ColorMetrics.resourceColor('#707070')
  })
})
```

- Setting the font color Use the [fontColor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) attribute to set the font color of the button. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
    styleMode: ArcButtonStyleMode.CUSTOM,
    backgroundColor: ColorMetrics.resourceColor('#E84026'),
    fontColor: ColorMetrics.resourceColor('#707070')
  })
})
```

- Setting the shadow color Enable the button shadow using the [shadowEnabled](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) attribute and set the shadow color using the [shadowColor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton#arcbuttonoptions) attribute. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
    shadowEnabled: true,
    shadowColor: ColorMetrics.resourceColor('#ffec1022')
  })
})
```

#### Adding Events

- Bind the **onClick** event to define custom behavior to be executed when the button is clicked. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
  // ···
    onClick: () => {
      hilog.info(DOMAIN, TAG, 'ArcButton onClick');
    },
  })
})
```

- Bind the **onTouch** event to define custom behavior to be executed when the button is touched. 
```typescript
ArcButton({
  options: new ArcButtonOptions({
    label: 'OK',
  // ···
    onTouch: (event: TouchEvent) => {
      hilog.info(DOMAIN, TAG, 'ArcButton onTouch');
    }
  })

})
```

#### Example

This example demonstrates a brightness settings screen where a slider displays the current brightness level at 30%. When the reset button is clicked, the brightness value is reset to the default value of 50%.

You are advised to run this example on a wearable for optimal display effects and it can also run on other devices. To run the example on a wearable, configure **wearable** under the [deviceTypes](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file#devicetypes) tag in the [module.json5](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file) configuration file in the **src/main** directory.

```javascript
"module": {
  // ...
  "deviceTypes": [
    "default",
    "wearable"
  ],
  // ...
}
```
     
```typescript
import { LengthMetrics, LengthUnit, ArcButton, ArcButtonOptions, ArcButtonStyleMode } from '@kit.ArkUI';

const BRIGHT_NESS_VALUE = 30;
const BRIGHT_NESS_VALUE_DEFAULT = 50;

@Entry
@ComponentV2
struct BrightnessPage {
  @Local brightnessValue: number = BRIGHT_NESS_VALUE;
  private defaultBrightnessValue: number = BRIGHT_NESS_VALUE_DEFAULT;

  build() {
    RelativeContainer() {
      // Replace $r('app.string.Brightness') with the actual resource file. In this example, the value in the resource file is "Set brightness."
      Text($r('app.string.Brightness'))
        .fontColor(Color.White)
        .id('id_brightness_set_text')
        .fontSize(24)
        .margin({ top: 16 })
        .alignRules({
          middle: { anchor: '__container__', align: HorizontalAlign.Center }
        })

      Text(`${this.brightnessValue} %`)
        .fontColor(Color.White)
        .id('id_brightness_min_text')
        .margin({ left: 16 })
        .alignRules({
          start: { anchor: '__container__', align: HorizontalAlign.Start },
          center: { anchor: '__container__', align: VerticalAlign.Center }
        })

      Slider({
        value: this.brightnessValue,
        min: 0,
        max: 100,
        style: SliderStyle.InSet
      })
        .blockColor('#191970')
        .trackColor('#ADD8E6')
        .selectedColor('#4169E1')
        .width(150)
        .id('id_brightness_slider')
        .margin({ left: 16, right: 16 })
        .onChange((value: number, mode: SliderChangeMode) => {
          this.brightnessValue = value;
        })
        .alignRules({
          center: { anchor: 'id_brightness_min_text', align: VerticalAlign.Center },
          start: { anchor: 'id_brightness_min_text', align: HorizontalAlign.End }
        })

      ArcButton({
        options: new ArcButtonOptions({
          // Replace $r('app.string.Reset') with the actual resource file. In this example, the value in the resource file is "Reset."
          label: $r('app.string.Reset'),
          styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
          fontSize: new LengthMetrics(19, LengthUnit.FP),
          onClick: () => {
            this.brightnessValue = this.defaultBrightnessValue;
          }
        })
      })
        .alignRules({
          middle: { anchor: '__container__', align: HorizontalAlign.Center },
          bottom: { anchor: '__container__', align: VerticalAlign.Bottom }
        })
    }
    .height('100%')
    .width('100%')
    .backgroundColor(Color.Black)
  }
}
```
