<!--
  Title: Notification.Builder
  Catalog: connectivity-References
  Document ID: notification_builder-0000001060099091
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/notification_builder-0000001060099091
-->
# Notification.Builder

| java.lang.Object \|---com.huawei.wearengine.notify.Notification.Builder 
```
public static class Notification.Builder
extends java.lang.Object
```
 |
| --- |

It is the building class in Notification.

#### Constructor Summary

| Constructor and Description |
| --- |
| [Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__Builder--)() |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| [Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) | [build](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__build--)() Indicates the **Notification** constructor. |
| [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) | [setAction](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__setAction-com_huawei_wearengine_notify_Action-)([Action](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918) action) Sets data. |
| [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) | [setButtonContents](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__setButtonContents-java_util_HashMap-)(java.util.HashMap<java.lang.Integer,java.lang.String> buttonContents) Sets the notification button content list. |
| [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) | [setPackageName](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__setPackageName-java_lang_String-)(java.lang.String packageName) Sets the app package name on the wearable device. |
| [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) | [setTemplateId](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__setTemplateId-com_huawei_wearengine_notify_NotificationTemplate-)([NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) template) Sets the notification template. |
| [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) | [setText](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__setText-java_lang_String-)(java.lang.String text) Sets the notification content. |
| [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) | [setTitle](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091#EN-US_TOPIC_0000001919950709__setTitle-java_lang_String-)(java.lang.String title) Sets the notification title. |

#### Constructor Detail

## Builder

public Builder()

**Since:**

API level 2 (SDK 5.0.1.300)

#### Method Detail

## setTemplateId

public [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) setTemplateId([NotificationTemplate](https://developer.huawei.com/consumer/en/doc/connectivity-References/notificationtemplate-0000001059433015) template)

It is used to set a notification template.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| template | Notification template. |

**Returns:**

Builder where notification templates have been set.

**Since:**

API level 2 (SDK 5.0.1.300)

## setPackageName

public [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) setPackageName(java.lang.String packageName)

It is used to set the app package name on the wearable device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| packageName | App package name on the wearable device. |

**Returns:**

Builder where notification app package names have been set.

**Since:**

API level 2 (SDK 5.0.1.300)

## setTitle

public [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) setTitle(java.lang.String title)

It is used to set the notification title.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| title | Notification title. |

**Returns:**

Builder where the notification title has been set.

**Since:**

API level 2 (SDK 5.0.1.300)

## setText

public [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) setText(java.lang.String text)

It is used to set the notification content.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| text | Notification content. |

**Returns:**

Builder where the notification content has been set.

**Since:**

API level 2 (SDK 5.0.1.300)

## setButtonContents

public [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) setButtonContents(java.util.HashMap<java.lang.Integer,java.lang.String> buttonContents)

It is used to set the notification button content list.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| buttonContents | Notification button content list. |

**Returns:**

Builder where the notification button content list has been set.

**Since:**

API level 2 (SDK 5.0.1.300)

## setAction

public [Notification.Builder](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification_builder-0000001060099091) setAction([Action](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918) action)

It is used to set data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| action | Notification feedback action. |

**Returns:**

Builder

**Since:**

API level 2 (SDK 5.0.1.300)

## build

public [Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) build()

**Notification** constructor.

**Returns:**

Notification

**Since:**

API level 2 (SDK 5.0.1.300)
