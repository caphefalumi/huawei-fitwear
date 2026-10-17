<!--
  Title: NotificationTemplate
  Catalog: connectivity-References
  Document ID: notificationtemplate-0000001059433015
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/notificationtemplate-0000001059433015
-->
# NotificationTemplate

| java.lang.Object \|---java.lang.Enum<[NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015)> \|---\|---com.huawei.wearengine.notify.NotificationTemplate 
```
public enum NotificationTemplate
extends java.lang.Enum<NotificationTemplate>
```
 |
| --- |

It indicates the notification template.

#### Enum Constant Summary

| Enum Constant and Description |
| --- |
| [NOTIFICATION_TEMPLATE_NO_BUTTON](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015#EN-US_TOPIC_0000001919950729__NOTIFICATION_TEMPLATE_NO_BUTTON) **50**: There are no buttons. |
| [NOTIFICATION_TEMPLATE_ONE_BUTTON](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015#EN-US_TOPIC_0000001919950729__NOTIFICATION_TEMPLATE_ONE_BUTTON) **51**: There is one button. |
| [NOTIFICATION_TEMPLATE_THREE_BUTTONS](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015#EN-US_TOPIC_0000001919950729__NOTIFICATION_TEMPLATE_THREE_BUTTONS) **53**: There are three buttons. |
| [NOTIFICATION_TEMPLATE_TWO_BUTTONS](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015#EN-US_TOPIC_0000001919950729__NOTIFICATION_TEMPLATE_TWO_BUTTONS) **52**: There are two buttons. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static [NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) | [getTemplateForTemplateId](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015#EN-US_TOPIC_0000001919950729__getTemplateForTemplateId-int-)(int templateId) Obtains the Notification template through **templateId**. |

#### Enum Constant Detail

## NOTIFICATION_TEMPLATE_NO_BUTTON

public static final [NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) NOTIFICATION_TEMPLATE_NO_BUTTON

**50**: There are no buttons.

**Since:**

API level 2 (SDK 5.0.1.300)

## NOTIFICATION_TEMPLATE_ONE_BUTTON

public static final [NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) NOTIFICATION_TEMPLATE_ONE_BUTTON

**51**: There is one button.

**Since:**

API level 2 (SDK 5.0.1.300)

## NOTIFICATION_TEMPLATE_TWO_BUTTONS

public static final [NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) NOTIFICATION_TEMPLATE_TWO_BUTTONS

**52**: There are two buttons.

**Since:**

API level 2 (SDK 5.0.1.300)

## NOTIFICATION_TEMPLATE_THREE_BUTTONS

public static final [NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) NOTIFICATION_TEMPLATE_THREE_BUTTONS

**53**: There are three buttons.

**Since:**

API level 2 (SDK 5.0.1.300)

#### Method Detail

## getTemplateForTemplateId

public static [NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) getTemplateForTemplateId(int templateId)

It is used to obtain the Notification template through **templateId**.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| templateId | Template ID. For details, see NotificationTemplate. |

**Returns:**

Notification template.

**Since:**

API level 2 (SDK 5.0.1.300)
