<!--
  Title: ArcScrollBar
  Catalog: harmonyos-references
  Document ID: ts-basic-components-arcscrollbar
  Updated: 2026-10-14 09:39:33
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-basic-components-arcscrollbar
-->
# ArcScrollBar

The **ArcScrollBar** component is designed to be used together with scrollable components such as [ArcList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-arclist), [List](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-list), [Grid](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-grid), [Scroll](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-scroll), and [WaterFlow](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-waterflow).

> **Note:** This component is supported since API version 18. Updates will be marked with a superscript to indicate their earliest API version. When the width and height of the **ArcScrollBar** component are not set, the **maxSize** value specified in its parent component [LayoutConstraint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-arkui-framenode#layoutconstraint12) is used as the width and height. If the parent component of the **ArcScrollBar** component contains scrollable components, such as [ArcList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-arclist), [List](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-list), [Grid](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-grid), [Scroll](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-scroll), or [WaterFlow](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-waterflow), you are advised to set the width and height of the **ArcScrollBar** component. Otherwise, the width and height of the component may be infinite. This component can be used on phones, PCs, 2-in-1 devices, tablets, TVs, and wearables. In API version 22 and earlier versions, a compilation warning will be reported when this component is used on phones, PCs, 2-in-1 devices, tablets, and TVs, but the component can still run properly.

#### Child Components

Not supported

#### APIs

ArcScrollBar(options: ArcScrollBarOptions)

A constructor used to create an **ArcScrollBar** instance.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| options | [ArcScrollBarOptions](#arcscrollbaroptions) | Yes | Parameters of the **ArcScrollBar** component. |

#### ArcScrollBarOptions

Represents the parameters used to construct an **ArcScrollBar** component.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| scroller | [Scroller](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-scroll#scroller) | No | No | Scroller, which can be bound to scrollable components for scrolling control. |
| state | [BarState](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-appendix-enums#barstate) | No | Yes | State of the scrollbar. Default value: **BarState.Auto** |

> **Note:** **ArcScrollBar** must be bound to a scrollable component through **scroller** to achieve synchronization. Only a one-to-one binding is allowed between **ArcScrollBar** and a scrollable component.

#### Example

This example demonstrates how to synchronize **ArcScrollBar** with the [Scroll](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-scroll) component to implement an arc scrollbar.

```typescript
import { ArcScrollBar } from '@kit.ArkUI';

@Entry
@Component
struct ArcScrollBarExample {
  private scroller: Scroller = new Scroller();
  private arr: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Scroll(this.scroller) {
        Flex({ direction: FlexDirection.Column }) {
          ForEach(this.arr, (item: number) => {
            Row() {
              Text(item.toString())
                .width('80%')
                .height(60)
                .backgroundColor('#3366CC')
                .borderRadius(15)
                .fontSize(16)
                .textAlign(TextAlign.Center)
                .margin({ top: 5 })
            }
          }, (item: number) => item.toString())
        }.margin({ right: 15 })
      }
      .width('90%')
      .scrollBar(BarState.Off)

      ArcScrollBar({ scroller: this.scroller, state: BarState.Auto })
    }
    .width('100%')
    .height('100%')
  }
}
```
