<!--
  Title: AuthClient
  Catalog: connectivity-References
  Document ID: authclient-0000001059980967
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/authclient-0000001059980967
-->
# AuthClient

| java.lang.Object \|---com.huawei.wearengine.auth.AuthClient 
```
public class AuthClient
extends java.lang.Object
```
 |
| --- |

It is a client used for permission management. You can use it to perform operations for user permission authorization.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| com.huawei.hmf.tasks.Task<java.lang.Boolean> | [checkPermission](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__checkPermission-com_huawei_wearengine_auth_Permission-)([Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) permission) Queries whether the permission is granted. |
| com.huawei.hmf.tasks.Task<java.lang.Boolean[]> | [checkPermissions](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__checkPermissions-com_huawei_wearengine_auth_Permission:A-)([Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005)[] permissions) Queries whether the permission group is granted. |
| com.huawei.hmf.tasks.Task<java.lang.Void> | [requestPermission](https://developer.huawei.com/consumer/en/doc/connectivity-References/authclient-0000001059980967#EN-US_TOPIC_0000001919950749__requestPermission-com_huawei_wearengine_auth_AuthCallback-com_huawei_wearengine_auth_Permission___-)([AuthCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/authcallback-0000001059850647) authCallback, [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005)... permissions) Request permission. |

#### Method Detail

## requestPermission

public com.huawei.hmf.tasks.Task<java.lang.Void> requestPermission([AuthCallback](https://developer.huawei.com/consumer/en/doc/connectivity-References/authcallback-0000001059850647) authCallback, [Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005)... permissions)

It indicates request permissions.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| authCallback | Callback object of the authorization result. |
| permissions | List of permissions to be applied for. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result. If a requested permission has been granted, the permission will be returned.

**Since:**

API level 0 (SDK 5.0.0.301)

## checkPermission

public com.huawei.hmf.tasks.Task<java.lang.Boolean> checkPermission([Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005) permission)

It queries whether the permission is granted.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| permission | Permission that needs to be queried. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)

## checkPermissions

public com.huawei.hmf.tasks.Task<java.lang.Boolean[]> checkPermissions([Permission](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005)[] permissions)

It queries whether the permission group is granted.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| permissions | Permission group to be queried. |

**Returns:**

A task is returned. Your app can call methods such as **addOnSuccessListener** and **addOnFailureListener** to check the task execution result.

**Since:**

API level 0 (SDK 5.0.0.301)
