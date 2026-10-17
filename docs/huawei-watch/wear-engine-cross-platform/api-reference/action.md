<!--
  Title: Action
  Catalog: connectivity-References
  Document ID: action-0000001060460918
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/action-0000001060460918
-->
# Action

| 
```
public interface Action
```
 |
| --- |

It indicates the callback of notification feedback, which feeds back the behavior of the user after the user receives the notification on the wearable device.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onError](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918#EN-US_TOPIC_0000001920110421__onError-com_huawei_wearengine_notify_Notification-int-java_lang_String-)([Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) notification, int errorCode, java.lang.String errorMsg) Indicates notification exception feedback. |
| void | [onResult](https://developer.huawei.com/consumer/en/doc/connectivity-References/action-0000001060460918#EN-US_TOPIC_0000001920110421__onResult-com_huawei_wearengine_notify_Notification-int-)([Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) notification, int feedback) Indicates notification feedback. |

#### Method Detail

## onResult

void onResult([Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) notification, int feedback)

Indicates notification feedback.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| notification | Indicates notification. |
| feedback | Indicates notification feedback result. **0**: The physical home button exited or the screen was turned off. **1**: The user deleted the message. **2**: The user touched the first button. **3**: The user touched the second button. **4**: The user touched the third button. |

**Since:**

API level 2 (SDK 5.0.1.300)

## onError

void onError([Notification](https://developer.huawei.com/consumer/en/doc/connectivity-References/notification-0000001060620912) notification, int errorCode, java.lang.String errorMsg)

It indicates notification exception feedback.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| notification | Indicates notification. |
| errorCode | Indicates notification error code. |
| errorMsg | Indicates notification exception description. |

**Since:**

API level 2 (SDK 5.0.1.300)
