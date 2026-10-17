<!--
  Title: Notification
  Catalog: connectivity-References
  Document ID: notification-0000001060620912
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/notification-0000001060620912
-->
# Notification

| java.lang.Object \|---com.huawei.wearengine.notify.Notification 
```
public class Notification
extends java.lang.Object
```
 |
| --- |

It indicates notification.

#### Nested Class Summary

| Modifier and Type | Class and Description |
| --- | --- |
| static class | [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) Indicates the building class in Notification. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| [Action](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918) | [getAction](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912#EN-US_TOPIC_0000001919950713__getAction--)() Obtains the notification feedback action. |
| java.util.HashMap<java.lang.Integer,java.lang.String> | [getButtonContents](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912#EN-US_TOPIC_0000001919950713__getButtonContents--)() Obtains the notification button content list. |
| java.lang.String | .[getPackageName](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912#EN-US_TOPIC_0000001919950713__getPackageName--)() Obtains the app package name of the notification. |
| int | [getTemplateId](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912#EN-US_TOPIC_0000001919950713__getTemplateId--)() Obtains a notification template ID. |
| java.lang.String | [getText](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912#EN-US_TOPIC_0000001919950713__getText--)() Obtains the notification content. |
| java.lang.String | [getTitle](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912#EN-US_TOPIC_0000001919950713__getTitle--)() Obtains the notification title. |

#### Method Detail

## getTemplateId

public int getTemplateId()

It is used to obtain the notification template ID.

**Returns:**

Notification template.

**Since:**

API level 2 (SDK 5.0.1.300)

## getPackageName

public java.lang.String getPackageName()

It is used to obtain the name of the app package of the notification.

**Returns:**

Name of the app package of the notification.

**Since:**

API level 2 (SDK 5.0.1.300)

## getTitle

public java.lang.String getTitle()

It is used to obtain the notification title.

**Returns:**

Notification title.

**Since:**

API level 2 (SDK 5.0.1.300)

## getText

public java.lang.String getText()

It is used to obtain the notification content.

**Returns:**

Notification content.

**Since:**

API level 2 (SDK 5.0.1.300)

## getButtonContents

public java.util.HashMap<java.lang.Integer,java.lang.String> getButtonContents()

It is used to obtain the notification button content list.

**Returns:**

Notification button content list.

**Since:**

API level 2 (SDK 5.0.1.300)

## getAction

public [Action](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918) getAction()

It is used to obtain the notification feedback action.

**Returns:**

Notification feedback action.

**Since:**

API level 2 (SDK 5.0.1.300)
