<!--
  Title: Class
  Catalog: connectivity-References
  Document ID: we-ios-wesauthclient-class-0000001897943254
  Updated: 2026-07-25 02:34:07
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/we-ios-wesauthclient-class-0000001897943254
-->
# Class

| NSObject \|---WearEngineSDK.WESAuthClient |
| --- |

Client used for permission management. You can use it to perform authorization-related operations for user permissions.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [authWithClientId](#section12194195011300) Starts the Huawei Health app and requests the permission. |
| void | [authWithClientId](#section15405203834110) Starts the Huawei Health app and requests the permission. |
| void | [processAuthResultWith](#section6464173116407) Parses the authorization result. |

## authWithClientId

- (void)authWithClientId:(NSString *)clientId

scheme:(NSString *)scheme

schemeSecret:(NSString *)schemeSecret

clientSecret:(NSString *)clientSecret

srcPkgName:(NSString *)srcPkgName

destPkgName:(NSString *)destPkgName

callback:(WESAuthCallback)callback;

Requests the permission.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| clientId | App ID on HUAWEI Developers. |
| scheme | App scheme. |
| schemeSecret | App schemeSecret on HUAWEI Developers. |
| clientSecret | App clientSecret on HUAWEI Developers. |
| srcPkgName | App package name on the iOS phone. |
| destPkgName | App package name on the wearable device. |
| callback | Callback object of the authorization result. |

#### authWithClientId

- (void)authWithClientId:(NSString *)clientId

scheme:(NSString *)scheme

schemeSecret:(NSString *)schemeSecret

clientSecret:(NSString *)clientSecret

srcPkgName:(NSString *)srcPkgName

destPkgName:(NSString *)destPkgName

ulinkType:(WESULinkType)ulinkType

callback:(WESAuthCallback)callback;

Requests the permission.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| clientId | App ID on HUAWEI Developers. |
| scheme | App scheme. |
| schemeSecret | App schemeSecret on HUAWEI Developers. |
| clientSecret | App clientSecret on HUAWEI Developers. |
| srcPkgName | App package name on the iOS phone. |
| destPkgName | App package name on the wearable device. |
| ulinkType | Universal link type used for redirection. |
| callback | Callback object of the authorization result. |

## processAuthResultWith

- (void)processAuthResultWith:(NSURL *)url;

Parses the authorization result.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| url | URL of the authorization result. |
