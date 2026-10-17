<!--
  Title: ArcButton
  Catalog: harmonyos-references
  Document ID: ohos-arkui-advanced-arcbutton
  Updated: 2026-10-14 09:39:21
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/ohos-arkui-advanced-arcbutton
-->
# ArcButton

The **ArcButton** component offers various button styles, such as emphasized, normal, and warning. It is recommended for devices with circular screens.

> **Note:** This component is supported since API version 18. Updates will be marked with a superscript to indicate their earliest API version. This component can be used on phones, PCs, 2-in-1 devices, tablets, TVs, and wearables. In API version 22 and earlier versions, a compilation warning will be reported when this component is used on phones, PCs, 2-in-1 devices, tablets, and TVs, but the component can still run properly.

#### Modules to Import

```typescript
import {
  ArcButton,
  ArcButtonOptions,
  ArcButtonStatus,
  ArcButtonStyleMode,
  ArcButtonPosition,
}  from '@kit.ArkUI';
```

#### Child Components

Not supported

#### Attributes

The [universal attributes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-component-general-attributes) are not supported.

#### Events

Among the universal events, the [click event](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-events-click) and [touch event](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-events-touch) are supported.

#### ArcButton

ArcButton({ options: ArcButtonOptions })

Creates an instance of **ArcButton** with configuration parameters.

**Decorator**: @Component

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

**Parameters**

| Name | Type | Mandatory | Decorator | Description |
| --- | --- | --- | --- | --- |
| options | [ArcButtonOptions](#arcbuttonoptions) | Yes | @Require | Text, background color, shadow, and other parameters of the **ArcButton** component. |

#### ArcButtonOptions

Defines the default or custom style parameters for the **ArcButton** component.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

## Properties

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| position | [ArcButtonPosition](#arcbuttonposition) | No | No | Type of the arc button. Default value: **ArcButtonPosition.BOTTOM_EDGE** **Atomic service API**: This API can be used in atomic services since API version 18. |
| styleMode | [ArcButtonStyleMode](#arcbuttonstylemode) | No | No | Style mode for the arc button. This style cannot be used together with the [ArcButtonProgressConfig](#arcbuttonprogressconfig23) style. Default value: **ArcButtonStyleMode.EMPHASIZED_LIGHT** **Atomic service API**: This API can be used in atomic services since API version 18. |
| status | [ArcButtonStatus](#arcbuttonstatus) | No | No | Status of the arc button. Default value: **ArcButtonStatus.NORMAL** **Atomic service API**: This API can be used in atomic services since API version 18. |
| label | [ResourceStr](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#resourcestr) | No | No | Text displayed on the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |
| backgroundBlurStyle | [BlurStyle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-attributes-background#blurstyle9) | No | No | Background blur style of the arc button. Default value: **BlurStyle.NONE** **Atomic service API**: This API can be used in atomic services since API version 18. |
| backgroundColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | No | Background color of the arc button. This property takes effect only when **ArcButtonStyleMode** is set to **CUSTOM**. Default value: **Color.Black** **Atomic service API**: This API can be used in atomic services since API version 18. |
| shadowColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | No | Shadow color of the arc button. Default value: **Color.Black** **Atomic service API**: This API can be used in atomic services since API version 18. |
| shadowEnabled | boolean | No | No | Whether to enable the shadow for the arc button. Default value: **false** The value **true** means to enable the shadow, and **false** means the opposite. **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontSize | [LengthMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#lengthmetrics12) | No | No | Font size of the arc button. Default value: **19fp** **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | No | Font color of the arc button. This property takes effect only when **ArcButtonStyleMode** is set to **CUSTOM**. Default value: **Color.White** **Atomic service API**: This API can be used in atomic services since API version 18. |
| pressedFontColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | No | Font color of the arc button when pressed. This property takes effect only when **ArcButtonStyleMode** is set to **CUSTOM**. Default value: **Color.White** **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontStyle | [FontStyle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-appendix-enums#fontstyle) | No | No | Font style of the arc button. Default value: **FontStyle.Normal** **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontFamily | string \| [Resource](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#resource) | No | No | Font family of the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontMargin | [LocalizedMargin](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#localizedmargin12) | No | No | Margin of the arc button text. Default value: **{start:24vp, top: 10vp,end: 24vp, bottom:16vp }** **Atomic service API**: This API can be used in atomic services since API version 18. |
| progressConfig23+ | [ArcButtonProgressConfig](#arcbuttonprogressconfig23) | No | Yes | Parameters for the progress indicator of the **ArcButton** component. If this property is not set, the **ArcButton** component is displayed as a button (see [Example 1](#example-1-setting-an-arc-button)). If this property is set, the component is displayed as a progress indicator (see [Example 2](#example-2-setting-a-device-progress-indicator-button)). The progress indicator style is not affected by the settings of the [ArcButtonStyleMode](#arcbuttonstylemode) attribute. Default value: default values of all properties of [ArcButtonProgressConfig](#arcbuttonprogressconfig23) **Atomic service API**: This API can be used in atomic services since API version 23. **Model restriction**: This API can be used only in the stage model. |
| onTouch | [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#voidcallback12)< [TouchEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-events-touch#touchevent)> | No | Yes | Callback triggered by touch actions on the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |
| onClick | [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#voidcallback12)<[ClickEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-events-click#clickevent) > | No | Yes | Callback triggered by click actions on the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |

## constructor

constructor(options: CommonArcButtonOptions)

A constructor used to create an **ArcButton** component.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| options | [CommonArcButtonOptions](#commonarcbuttonoptions) | Yes | Text, background color, shadow, and other parameters of the **ArcButton** component. |

#### CommonArcButtonOptions

Defines the default or custom style parameters for the **ArcButton** component.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| position | [ArcButtonPosition](#arcbuttonposition) | No | Yes | Type of the arc button. Default value: **ArcButtonPosition.BOTTOM_EDGE** **Atomic service API**: This API can be used in atomic services since API version 18. |
| styleMode | [ArcButtonStyleMode](#arcbuttonstylemode) | No | Yes | Style mode for the arc button. This style cannot be used together with the [ArcButtonProgressConfig](#arcbuttonprogressconfig23) style. Default value: **ArcButtonStyleMode.EMPHASIZED_LIGHT** **Atomic service API**: This API can be used in atomic services since API version 18. |
| status | [ArcButtonStatus](#arcbuttonstatus) | No | Yes | Status of the arc button. Default value: **ArcButtonStatus.NORMAL** **Atomic service API**: This API can be used in atomic services since API version 18. |
| label | [ResourceStr](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#resourcestr) | No | Yes | Text displayed on the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |
| backgroundBlurStyle | [BlurStyle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-attributes-background#blurstyle9) | No | Yes | Background blur style of the arc button. Default value: **BlurStyle.NONE** **Atomic service API**: This API can be used in atomic services since API version 18. |
| backgroundColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | Yes | Background color of the arc button. This property takes effect only when **ArcButtonStyleMode** is set to **CUSTOM**. Default value: **Color.Black** **Atomic service API**: This API can be used in atomic services since API version 18. |
| shadowColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | Yes | Shadow color of the arc button. Default value: **Color.Black** **Atomic service API**: This API can be used in atomic services since API version 18. |
| shadowEnabled | boolean | No | Yes | Whether to enable the shadow for the arc button. Default value: **false** The value **true** means to enable the shadow, and **false** means the opposite. **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontSize | [LengthMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#lengthmetrics12) | No | Yes | Font size of the arc button. Default value: **19fp** **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | Yes | Font color of the arc button. This property takes effect only when **ArcButtonStyleMode** is set to **CUSTOM**. Default value: **Color.White** **Atomic service API**: This API can be used in atomic services since API version 18. |
| pressedFontColor | [ColorMetrics](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-graphics#colormetrics12) | No | Yes | Font color of the arc button when pressed. This property takes effect only when **ArcButtonStyleMode** is set to **CUSTOM**. Default value: **Color.White** **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontStyle | [FontStyle](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-appendix-enums#fontstyle) | No | Yes | Font style of the arc button. Default value: **FontStyle.Normal** **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontFamily | string \| [Resource](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#resource) | No | Yes | Font family of the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |
| fontMargin | [LocalizedMargin](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#localizedmargin12) | No | Yes | Margin of the arc button text. Default value: **{start:24vp, top: 10vp,end: 24vp, bottom:16vp }** **Atomic service API**: This API can be used in atomic services since API version 18. |
| progressConfig23+ | [ArcButtonProgressConfig](#arcbuttonprogressconfig23) | No | Yes | Parameters for the progress indicator of the **ArcButton** component. If this property is not set, the **ArcButton** component is displayed as a button (see [Example 1](#example-1-setting-an-arc-button)). If this property is set, the component is displayed as a progress indicator (see [Example 2](#example-2-setting-a-device-progress-indicator-button)). The progress indicator style is not affected by the settings of the [ArcButtonStyleMode](#arcbuttonstylemode) attribute. Default value: default values of all properties of [ArcButtonProgressConfig](#arcbuttonprogressconfig23) **Atomic service API**: This API can be used in atomic services since API version 23. **Model restriction**: This API can be used only in the stage model. |
| onTouch | [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#voidcallback12)< [TouchEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-events-touch#touchevent)> | No | Yes | Callback triggered by touch actions on the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |
| onClick | [Callback](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#voidcallback12)<[ClickEvent](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-events-click#clickevent) > | No | Yes | Callback triggered by click actions on the arc button. **Atomic service API**: This API can be used in atomic services since API version 18. |

#### ArcButtonProgressConfig23+

Defines the progress indicator configuration options of the **ArcButton** component.

**Atomic service API**: This API can be used in atomic services since API version 23.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

**Model restriction**: This API can be used only in the stage model.

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| value | number | No | No | Current progress value. Values less than 0 are adjusted to **0**, and values greater than the **total** value are capped at the **total** value. Default value: **0**. Value range: [0, total] |
| total | number | No | Yes | Maximum progress value. Default value: **100** Value range: [0, 2147483647]. If the value is 0 or out of the range, the default value 100 is used. |
| color | [ResourceColor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-types#resourcecolor) | No | Yes | Foreground color of the progress indicator. If the component's background color ([backgroundColor](#arcbuttonoptions)) is set, it is used as the default foreground color of the progress indicator. The foreground color of the progress indicator is not affected by the button style ([ArcButtonStyleMode](#arcbuttonstylemode)). The progress indicator's background color is derived solely from its foreground color, with an opacity value of 25%. Default value: **"#1F71FF"**, which is blue. |

#### ArcButtonPosition

Enumerates the types of arc buttons that can be set for **ArcButton**.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

| Name | Value | Description |
| --- | --- | --- |
| TOP_EDGE | 0 | Upper arc button located at the top of the circular screen. |
| BOTTOM_EDGE | 1 | Lower arc button located at the bottom of the circular screen. |

#### ArcButtonStyleMode

Enumerates the style modes that can be set for **ArcButton**.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

| Name | Value | Description |
| --- | --- | --- |
| EMPHASIZED_LIGHT | 0 | Emphasized style in light color mode. Displayed as a blue background with white text. |
| EMPHASIZED_DARK | 1 | Warning style in dark color mode. Displayed as a red background with white text. |
| NORMAL_LIGHT | 2 | Normal style in light color mode. Displayed as a dark blue background with blue text. |
| NORMAL_DARK | 3 | Normal style in dark color mode. Displayed as a dark gray background with blue text. |
| CUSTOM | 4 | Custom button color and font color. |

#### ArcButtonStatus

Enumerates the states that can be set for **ArcButton**.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

| Name | Value | Description |
| --- | --- | --- |
| NORMAL | 0 | Normal state. |
| PRESSED | 1 | Pressed state. |
| DISABLED | 2 | Disabled state. |

#### Example

## Example 1: Setting an Arc Button

This example demonstrates the basic usage of **ArcButton**. **ArcButton** is added since API version 18. The following is an example configuration:

- **topOptions** defines an upper arc button with the button text "ButtonTop," a font size of 15 fp, and shadow enabled, in the normal state with a light-color emphasized style.
- **bottomOptions** defines a bottom arc button with the button text "ButtonBottom," a font size of 15 fp, shadow enabled, in a light-color emphasized style, with a click event set for the button.

This example is recommended to run on a wearable device for optimal display effects and is also supported on other devices. To run the example on a wearable device, configure **wearable** in the [deviceTypes](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file#devicetypes) tag of the [module.json5](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file) configuration file in the **src/main** directory.

```javascript
// module.json5
{
  "module": {
    // ...
    "deviceTypes": [
      "wearable",
      "phone"
    ]
    // ...
  }
}
```
     
```typescript
// xxx.ets
import {
  LengthMetrics,
  LengthUnit,
  ArcButton,
  ArcButtonOptions,
  ArcButtonStatus,
  ArcButtonStyleMode,
  ArcButtonPosition,
}  from '@kit.ArkUI';

@Entry
@ComponentV2
struct Index {
  @Local topOptions: ArcButtonOptions = new ArcButtonOptions({});
  @Local bottomOptions: ArcButtonOptions = new ArcButtonOptions({});

  aboutToAppear() {
    this.topOptions = new ArcButtonOptions({
      label: 'ButtonTop',
      status: ArcButtonStatus.NORMAL,
      position: ArcButtonPosition.TOP_EDGE,
      styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
      fontSize: new LengthMetrics(15, LengthUnit.FP),
      shadowEnabled: true
    })

    this.bottomOptions = new ArcButtonOptions({
      label: 'ButtonBottom',
      styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
      fontSize: new LengthMetrics(15, LengthUnit.FP),
      shadowEnabled: true,
      onClick: () => {
        console.info('click from ArcButton.');
      }
    })
  }

  build() {
    Stack() {
      Stack() {
        Circle({ width: 233, height: 233 })
          .strokeWidth(0.1)
          .fill(Color.White)

        Column() {
          ArcButton({ options: this.topOptions })
          Blank()
          ArcButton({ options: this.bottomOptions })

        }.width('100%')
        .height('100%')
      }.width(233)
      .height(233)
    }.width('100%')
    .height('100%')
    .alignContent(Alignment.Center)
    .backgroundColor(Color.Gray)
  }
}
```

## Example 2: Setting a Device Progress Indicator Button

This example demonstrates the basic usage of the **ArcButton** component in progress indicator style. The [progressConfig](#arcbuttonoptions) API is supported since API version 23. The following is an example configuration:

- **topOptions** defines an upper arc button with the "Add" button text, a font size of 15 fp, and shadow enabled, in the normal state with a light-color emphasized style. A click event is set for the button. When the button is clicked, the progress indicator's progress increases.
- **bottomOptions** defines a bottom arc button with the button text showing the progress percentage, a font size of 15 fp, state set in progress indicator mode, default style, and shadow enabled.

This example is recommended to run on a wearable device for optimal display effects and is also supported on other devices. To run the example on a wearable device, configure **wearable** in the [deviceTypes](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/module-configuration-file#devicetypes) tag of the [module.json5] configuration file (../../../quick-start/module-configuration-file.md) in the **src/main** directory.

```javascript
// module.json5
{
  "module": {
    // ...
    "deviceTypes": [
      "wearable",
      "phone"
    ]
    // ...
  }
}
```
     
```typescript
// xxx.ets
import {
  LengthMetrics,
  LengthUnit,
  ArcButton,
  ArcButtonOptions,
  ArcButtonStatus,
  ArcButtonStyleMode,
  ArcButtonPosition,
}  from '@kit.ArkUI';

@Entry
@ComponentV2
struct Index {
  @Local topOptions: ArcButtonOptions = new ArcButtonOptions({});
  @Local bottomOptions: ArcButtonOptions = new ArcButtonOptions({});

  aboutToAppear() {
    this.topOptions = new ArcButtonOptions({
      label: 'Add',
      styleMode: ArcButtonStyleMode.EMPHASIZED_LIGHT,
      position: ArcButtonPosition.TOP_EDGE,
      fontSize: new LengthMetrics(15, LengthUnit.FP),
      shadowEnabled: true,
      onClick: () => {
        if(this.bottomOptions.progressConfig && this.bottomOptions.progressConfig.value < 100) {
          this.bottomOptions.progressConfig.value = this.bottomOptions.progressConfig.value + 5
          this.bottomOptions.label = this.bottomOptions.progressConfig.value + "%"
        }
      }
    })

    this.bottomOptions = new ArcButtonOptions({
      label: '0%',
      status: ArcButtonStatus.NORMAL,
      fontSize: new LengthMetrics(15, LengthUnit.FP),
      shadowEnabled: true,
      progressConfig: {value:0, total:100},
    })
  }

  build() {
    Stack() {
      Stack() {
        Circle({ width: 233, height: 233 })
          .strokeWidth(0.1)
          .fill(Color.White)

        Column() {
          ArcButton({ options: this.topOptions })
          Blank()
          ArcButton({ options: this.bottomOptions })

        }.width('100%')
        .height('100%')
      }.width(233)
      .height(233)
    }.width('100%')
    .height('100%')
    .alignContent(Alignment.Center)
    .backgroundColor(Color.Gray)
  }
}
```
