<!--
  Title: HiHealthAuth
  Catalog: HMSCore-References-V5
  Document ID: hihealthauth-0000001072149458-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthauth-0000001072149458-V5
-->
# HiHealthAuth

| java.lang.Object \|---com.huawei.hihealthkit.auth.HiHealthAuth 
```
public class HiHealthAuth
extends java.lang.Object
```
 |
| --- |

Authentication performed on your app by the HiHealth platform.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static void | [getDataAuthStatus](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthauth-0000001072149458-V5#EN-US_TOPIC_0000001136987077__s412148d0824a435bb03163b3cf072627)(android.content.Context context, int writeType, [IAuthorizationListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/iauthorizationlistener-0000001071989542-V5) listener) Deprecated. |
| static void | [getDataAuthStatusEx](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthauth-0000001072149458-V5#EN-US_TOPIC_0000001136987077__s70ffe666cded48e2b11236c46adfd394)(android.content.Context context, int[] writeTypes, int[] readTypes, [IDataAuthStatusListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/idataauthstatuslistener-0000001071321473-V5) listener) Queries the permission status. |
| static void | [requestAuthorization](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthauth-0000001072149458-V5#EN-US_TOPIC_0000001136987077__s46736fa98b1e47b8bebd14153123bcc2)(android.content.Context context, int[] userAllowTypesToWrite, int[] userAllowTypesToRead, [IAuthorizationListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/iauthorizationlistener-0000001071989542-V5) listener) Deprecated. Requests read/write permission authentication. |

#### Method Detail

## requestAuthorization

@Deprecated public static void requestAuthorization(android.content.Context context, int[] userAllowTypesToWrite, int[] userAllowTypesToRead, [IAuthorizationListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/iauthorizationlistener-0000001071989542-V5) listener)

Deprecated.

Requests read/write permission authentication.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context information. |
| userAllowTypesToWrite | Types of data that can be written. |
| userAllowTypesToRead | Types of data that can be read. |
| listener | Result callback. |

**Deprecated**

## getDataAuthStatus

@Deprecated public static void getDataAuthStatus(android.content.Context context, int writeType, [IAuthorizationListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/iauthorizationlistener-0000001071989542-V5) listener)

Deprecated.

Queries the write permission status.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context information. |
| writeType | Data type for which the authorization status of the write permission is to be returned. |
| listener | Result callback. |

## getDataAuthStatusEx

public static void getDataAuthStatusEx(android.content.Context context, int[] writeTypes, int[] readTypes, [IDataAuthStatusListener](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/idataauthstatuslistener-0000001071321473-V5) listener)

Queries permission status.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| context | Context information. |
| writeTypes | Data type for which the authorization status of the write permission is to be returned. |
| readTypes | Data type for which the authorization status of the read permission is to be returned. |
| listener | Result callback. |
