<!--
  Title: ArcListItem
  Catalog: harmonyos-references
  Document ID: ts-container-arclistitem
  Updated: 2026-10-14 09:37:58
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-arclistitem
-->
# ArcListItem

The **ArcListItem** component is used to display individual child components in an [ArcList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-arclist) component and must be used in conjunction with **ArcList**.

> **Note:** This component is supported since API version 18. Updates will be marked with a superscript to indicate their earliest API version. This component can be used only as a child of [ArcList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-arclist). When this component is used with [LazyForEach](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/arkts-rendering-control-lazyforeach), its child components are created when it is created. When this component is used with [if/else](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/arkts-rendering-control-ifelse) or [ForEach](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/arkts-rendering-control-foreach), or when the parent component is [ArcList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-arclist), its child components are created when it is laid out. This component can be used on phones, PCs, 2-in-1 devices, tablets, TVs, and wearables. In API version 22 and earlier versions, a compilation warning will be reported when this component is used on phones, PCs, 2-in-1 devices, tablets, and TVs, but the component can still run properly.

#### Modules to Import

> **Note:** **ArcListItemAttribute** is a key API used to configure the attributes of the **ArcListItem** component. In API version 21 and earlier, you must manually import **ArcListItemAttribute** after importing the **ArcListItem** component. Otherwise, a compilation error is reported. However, starting from API version 22, the compilation toolchain automatically imports **ArcListItemAttribute** when it detects the **ArcListItem** component, so manual import is no longer necessary. If you manually import **ArcListItemAttribute**, DevEco Studio shows it as disabled (grayed out). In API version 21 and earlier, removing this import causes a compilation error. But from API version 22 onward, removing it does not affect the functionality.

API version 21 and earlier:

```typescript
import { ArcListItem, ArcListItemAttribute } from '@kit.ArkUI';
```

API version 22 and later:

```typescript
import { ArcListItem } from '@kit.ArkUI';
```

#### Child Components

This component can contain a single child component.

#### APIs

ArcListItem()

Creates an item for the **ArcList** component.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

#### Attributes

In addition to the [universal attributes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-component-general-attributes), the following attributes are supported.

## autoScale

autoScale(enable: Optional<boolean>)

Sets whether to enable auto-scaling for the **ArcListItem** component.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| enable | [Optional](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-attributes-custom-property#optionalt)<boolean> | Yes | Whether to enable auto-scaling. **true**: Enable auto-scaling. **false**: Disable auto-scaling. Default value: **true**. |

## swipeAction

swipeAction(options: Optional<SwipeActionOptions>)

Sets the swipe action item displayed when the **ArcListItem** component is swiped out from the screen edge.

**Atomic service API**: This API can be used in atomic services since API version 18.

**System capability**: SystemCapability.ArkUI.ArkUI.Circle

**Parameters**

| Name | Type | Mandatory | Description |
| --- | --- | --- | --- |
| options | [Optional](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-universal-attributes-custom-property#optionalt)<[SwipeActionOptions](https://developer.huawei.com/consumer/en/doc/harmonyos-references/ts-container-listitem#swipeactionoptions9)> | Yes | Swipe action item displayed when the **ArcListItem** component is swiped out from the screen edge. |

#### Example

This example demonstrates the visual differences when auto-scaling is enabled or disabled for child items in an **ArcList** component.

```typescript
// xxx.ets
import { LengthMetrics, CircleShape } from '@kit.ArkUI';
// Starting from API version 22, you do not need to manually import ArcListAttribute and ArcListItemAttribute. For details, refer to the Modules to Import section of the ArcList and ArcListItem reference documents.
import { ArcList, ArcListItem, ArcListAttribute, ArcListItemAttribute } from '@kit.ArkUI';

@Entry
@Component
struct ArcListItemExample {
  private arr: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  private watchSize: string = '466px'; // Default watch size: 466 x 466
  private itemSize: string = '414px' // Item width

  @Builder
  buildList() {
    Stack() {
      Column() {
      }
      .width(this.watchSize)
      .height(this.watchSize)
      .clipShape(new CircleShape({ width: '100%', height: '100%' }))
      .backgroundColor(0x707070)

      ArcList({ initialIndex: 3}) {
        ForEach(this.arr, (item: number) => {
          ArcListItem() {
            Button('' + item, { type: ButtonType.Capsule })
              .width(this.itemSize)
              .height('70px')
              .fontSize('40px')
              .backgroundColor(0x17A98D)
          }
          .autoScale(item % 3 == 0 || item % 5 == 0)
        }, (item: number) => item.toString())
      }
      .space(LengthMetrics.px(10))
      .borderRadius(this.watchSize)
    }
    .width(this.watchSize)
    .height(this.watchSize)
  }

  build() {
    Column() {
      this.buildList();
    }
    .width('100%')
    .height('100%')
    .alignItems(HorizontalAlign.Center)
    .justifyContent(FlexAlign.Center)
  }
}
```
