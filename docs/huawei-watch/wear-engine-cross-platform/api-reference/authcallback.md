<!--
  Title: AuthCallback
  Catalog: connectivity-References
  Document ID: authcallback-0000001059850647
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/authcallback-0000001059850647
-->
# AuthCallback

| 
```
public interface AuthCallback
```
 |
| --- |

It is the permission callback API.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onCancel](https://developer.huawei.com/consumer/en/doc/connectivity-References/authcallback-0000001059850647#EN-US_TOPIC_0000001874111254__onCancel--)() Callback function for canceling authorization. |
| void | [onOk](https://developer.huawei.com/consumer/en/doc/connectivity-References/authcallback-0000001059850647#EN-US_TOPIC_0000001874111254__onOk-com_huawei_wearengine_auth_Permission:A-)([Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005)[] permissions) Callback function of successful authorization. |

#### Method Detail

## onOk

void onOk([Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005)[] permissions)

It is the callback function of successful authorization.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| permissions | List of permissions that the user has granted. |

**Since:**

API level 0 (SDK 5.0.0.301)

## onCancel

void onCancel()

It is the callback function for canceling authorization.

**Since:**

API level 0 (SDK 5.0.0.301)
