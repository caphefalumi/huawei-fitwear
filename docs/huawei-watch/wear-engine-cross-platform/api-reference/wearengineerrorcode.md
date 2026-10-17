<!--
  Title: WearEngineErrorCode
  Catalog: connectivity-References
  Document ID: wearengineerrorcode-0000001059980969
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/wearengineerrorcode-0000001059980969
-->
# WearEngineErrorCode

| java.lang.Object \|---com.huawei.wearengine.common.WearEngineErrorCode 
```
public final class WearEngineErrorCode
extends java.lang.Object
```
 |
| --- |

It is the Wear Engine error code constant class.

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static int | [ERROR_CODE_COMM_FAIL](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_COMM_FAIL) Error code indicating communication failure. |
| static int | [ERROR_CODE_COMM_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_COMM_SUCCESS) Error code indicating successful communication. |
| static int | [ERROR_CODE_DEVICE_IS_NOT_CONNECTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_IS_NOT_CONNECTED) Error code indicating that the device is not connected. |
| static int | [ERROR_CODE_DEVICE_UUID_IS_INVALID](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_UUID_IS_INVALID) Error code indicating that the UUID of the device is invalid because the user has paired the device again. In this case, the device should be obtained again. |
| static int | [ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT) Error code indicating that the device version is not supported. |
| static int | [ERROR_CODE_GENERIC](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_GENERIC) General error code. |
| static int | [ERROR_CODE_HEALTH_LOGOUT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_HEALTH_LOGOUT) Error code indicating that the Huawei Health app has been installed on the phone but not logged in to. |
| static int | [ERROR_CODE_HEALTH_NOT_AUTO_START](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_HEALTH_NOT_AUTO_START) Error code indicating that the Huawei Health app process cannot automatically start. |
| static int | [ERROR_CODE_HEALTH_VERSION_IS_LOW](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_HEALTH_VERSION_IS_LOW) Error code indicating that the version of the Huawei Health app is too early and it causes a version mismatch. |
| static int | [ERROR_CODE_INTERFACE_IS_NOT_SUPPORTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INTERFACE_IS_NOT_SUPPORTED) Error code indicating that the API is not supported. |
| static int | [ERROR_CODE_SERVICE_TIMEOUT](#section5100140113416) Error code indicating API calling timeout. |
| static int | [ERROR_CODE_POWER_MODE_CHANGING](#section13919514469) Error code indicating that the device is in the middle of a mode switchover. |
| static int | [ERROR_CODE_INTERNAL_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INTERNAL_ERROR) Internal error code. When it occurs, contact Huawei technical support for assistance. |
| static int | [ERROR_CODE_INVALID_ARGUMENT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INVALID_ARGUMENT) Error code indicating invalid parameters. |
| static int | [ERROR_CODE_INVALID_FILE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INVALID_FILE) Error code indicating invalid files. |
| static int | [ERROR_CODE_OVERMUCH_RECEIVER](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_OVERMUCH_RECEIVER) Error code indicating that too many receivers from the server receive messages from the wearable device. |
| static int | [ERROR_CODE_P2P_OTHER_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_OTHER_ERROR) Other error codes of P2P communication. |
| static int | [ERROR_CODE_P2P_PHONE_APP_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_PHONE_APP_EXIT) Error code indicating that the app has been installed on the phone when the watch pings the phone. |
| static int | [ERROR_CODE_P2P_PHONE_APP_NOT_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_PHONE_APP_NOT_EXIT) Error code indicating that the app has not been installed on the phone when the watch pings the phone. |
| static int | [ERROR_CODE_P2P_WATCH_APP_NOT_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_WATCH_APP_NOT_EXIT) Error code indicating that the app has not been installed on the watch when the phone pings the watch. |
| static int | [ERROR_CODE_P2P_WATCH_APP_NOT_RUNNING](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_WATCH_APP_NOT_RUNNING) Error code indicating that the app has been installed on the watch but is not running when the phone pings the watch. |
| static int | [ERROR_CODE_P2P_WATCH_APP_RUNNING](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_WATCH_APP_RUNNING) Error code indicating that the app is running on the watch when the phone pings the watch. |
| static int | [ERROR_CODE_SCOPE_UNAUTHORIZED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_SCOPE_UNAUTHORIZED) Error code indicating that it has not passed the Scope permission verification. |
| static int | [ERROR_CODE_SERVER_REMOTE_BINDER](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_SERVER_REMOTE_BINDER) Error code indicating that the remote bound object of the server is null. |
| static int | [ERROR_CODE_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_SUCCESS) Error code indicating a successful request. |
| static int | [ERROR_CODE_UNBOUND_DEVICE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_UNBOUND_DEVICE) Error code indicating that the Huawei Health app has not been bound to a device. |
| static int | [ERROR_CODE_UNINSTALL_HEALTH](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_UNINSTALL_HEALTH) Error code indicating that the Huawei Health app has not been installed on the phone. |
| static int | [ERROR_CODE_USER_UNAUTHORIZED_IN_HEALTH](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_USER_UNAUTHORIZED_IN_HEALTH) Error code indicating that the user has not agreed to Huawei Health User Agreement and Statement About Huawei Health and Privacy in the Huawei Health app. |
| static int | [ERROR_CODE_USER_UNAUTHORIZED_IN_WEAR_ENGINE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_USER_UNAUTHORIZED_IN_WEAR_ENGINE) Error code indicating that the basic device information permission, notification permission, or sensor permission verification of Wear Engine fails. |
| static java.lang.String | [ERROR_MSG_COMM_FAIL](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_COMM_FAIL) Error message of communication failure. |
| static java.lang.String | [ERROR_MSG_COMM_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_COMM_SUCCESS) Message indicating successful communication. |
| static java.lang.String | [ERROR_MSG_DEVICE_IS_NOT_CONNECTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_DEVICE_IS_NOT_CONNECTED) Error code indicating that the device is not connected. |
| static java.lang.String | [ERROR_MSG_DEVICE_UUID_IS_INVALID](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_DEVICE_UUID_IS_INVALID) Error code indicating that the UUID of the device is invalid. |
| static java.lang.String | [ERROR_MSG_DEVICE_VERSION_NOT_SUPPORT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_DEVICE_VERSION_NOT_SUPPORT) Error message indicating that the device version is not supported. |
| static java.lang.String | [ERROR_MSG_GENERIC](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_GENERIC) General error message, mainly undefined error messages. |
| static java.lang.String | [ERROR_MSG_HEALTH_LOGOUT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_HEALTH_LOGOUT) Error message indicating that the Huawei Health app has been installed on the phone but not logged in to. |
| static java.lang.String | [ERROR_MSG_HEALTH_NOT_AUTO_START](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_HEALTH_NOT_AUTO_START) Error message indicating that the Huawei Health process cannot automatically start. |
| static java.lang.String | [ERROR_MSG_HEALTH_VERSION_IS_LOW](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_HEALTH_VERSION_IS_LOW) Error message indicating that the version of the Huawei Health app is too early and it causes a version mismatch. |
| static java.lang.String | [ERROR_MSG_INTERFACE_IS_NOT_SUPPORTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_INTERFACE_IS_NOT_SUPPORTED) Error message indicating that the API is not supported. |
| static java.lang.String | [ERROR_MSG_SERVICE_TIMEOUT](#section157281748174917) Error message indicating API calling timeout. |
| static java.lang.String | [ERROR_MSG_POWER_MODE_CHANGING](#section222612111517) Error message indicating that the device is in the middle of a mode switchover. |
| static java.lang.String | [ERROR_MSG_INTERNAL_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_INTERNAL_ERROR) Internal error. When it is displayed, contact Huawei technical support for assistance. |
| static java.lang.String | [ERROR_MSG_INVALID_ARGUMENT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_INVALID_ARGUMENT) Error message of invalid parameters. |
| static java.lang.String | [ERROR_MSG_INVALID_FILE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_INVALID_FILE) Error message of invalid files. |
| static java.lang.String | [ERROR_MSG_OVERMUCH_RECEIVER](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_OVERMUCH_RECEIVER) Error message indicating that too many receivers from the server receive messages from the wearable device. |
| static java.lang.String | [ERROR_MSG_P2P_OTHER_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_P2P_OTHER_ERROR) Other error messages of P2P communication. |
| static java.lang.String | [ERROR_MSG_P2P_PHONE_APP_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_P2P_PHONE_APP_EXIT) Error message indicating that the app has been installed on the phone but is not running when the watch pings the phone. |
| static java.lang.String | [ERROR_MSG_P2P_PHONE_APP_NOT_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_P2P_PHONE_APP_NOT_EXIT) Error message indicating that the app has not been installed on the phone when the watch pings the phone. |
| static java.lang.String | [ERROR_MSG_P2P_WATCH_APP_NOT_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_P2P_WATCH_APP_NOT_EXIT) Error message indicating that the app has not been installed on the watch when the phone pings the watch. |
| static java.lang.String | [ERROR_MSG_P2P_WATCH_APP_NOT_RUNNING](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_P2P_WATCH_APP_NOT_RUNNING) Error code indicating that the app has been installed on the watch but is not running when the phone pings the watch. |
| static java.lang.String | ['ERROR_MSG_P2P_WATCH_APP_RUNNING.](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_P2P_WATCH_APP_RUNNING) Error message indicating that the app is running on the watch when the phone pings the watch. |
| static java.lang.String | [ERROR_MSG_SCOPE_UNAUTHORIZED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_SCOPE_UNAUTHORIZED) Error message for not passing the Scope permission verification. |
| static java.lang.String | [ERROR_MSG_SERVER_REMOTE_BINDER](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_SERVER_REMOTE_BINDER) Error message indicating that the remote bound object of the server is null. |
| static java.lang.String | [ERROR_MSG_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_SUCCESS) Error message of successful request. |
| static java.lang.String | [ERROR_MSG_UNBOUND_DEVICE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_UNBOUND_DEVICE) Error message indicating that the Huawei Health app has not been bound to a device. |
| static java.lang.String | [ERROR_MSG_UNINSTALL_HEALTH](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_UNINSTALL_HEALTH) Error message indicating that the Huawei Health app has not been installed. |
| static java.lang.String | [ERROR_MSG_USER_UNAUTHORIZED_IN_HEALTH](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_USER_UNAUTHORIZED_IN_HEALTH) Error message indicating that the user has not agreed to Huawei Health User Agreement and Statement About Huawei Health and Privacy in the Huawei Health app. |
| static java.lang.String | [ERROR_MSG_USER_UNAUTHORIZED_WEAR_ENGINE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_MSG_USER_UNAUTHORIZED_WEAR_ENGINE) Error code indicating that the basic device information permission, notification permission, or sensor permission verification of Wear Engine fails. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static int | [getErrorCodeFromErrorMsg](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__getErrorCodeFromErrorMsg-java_lang_String-)(java.lang.String message) Obtains the error code of Wear Engine based on the error message of Wear Engine. |
| static java.lang.String | [getErrorMsgFromCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__getErrorMsgFromCode-int-)(int errorCode) Obtains the error message of Wear Engine based on the error code of Wear Engine so that you can obtain the error messages of Wear Engine based on the error codes of Wear Engine. |

#### Field Detail

## ERROR_CODE_SUCCESS

public static final int ERROR_CODE_SUCCESS

It is an error code indicating a successful request.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1101396090184526)

## ERROR_MSG_SUCCESS

public static final java.lang.String ERROR_MSG_SUCCESS

It is a message indicating a request success.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1869522682184526)

## ERROR_CODE_GENERIC

public static final int ERROR_CODE_GENERIC

It is a general error code.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1689375491184526)

## ERROR_MSG_GENERIC

public static final java.lang.String ERROR_MSG_GENERIC

It is a general error message, mainly about undefined error messages.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1712485713184526)

## ERROR_CODE_UNINSTALL_HEALTH

public static final int ERROR_CODE_UNINSTALL_HEALTH

It is an error code indicating that the Huawei Health app has not been installed.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p2133816255184526)

## ERROR_MSG_UNINSTALL_HEALTH

public static final java.lang.String ERROR_MSG_UNINSTALL_HEALTH

It is an error message indicating that the Huawei Health app has not been installed.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1457126743184526)

## ERROR_CODE_HEALTH_LOGOUT

public static final int ERROR_CODE_HEALTH_LOGOUT

It is an error code indicating that the Huawei Health app has been installed but not logged in to.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p861243760184526)

## ERROR_MSG_HEALTH_LOGOUT

public static final java.lang.String ERROR_MSG_HEALTH_LOGOUT

It is an error message indicating that the Huawei Health app has been installed but not logged in to.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1964181494184526)

## ERROR_CODE_UNBOUND_DEVICE

public static final int ERROR_CODE_UNBOUND_DEVICE

It is an error code indicating that the Huawei Health app has not been bound to a device.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p693448513184526)

## ERROR_MSG_UNBOUND_DEVICE

public static final java.lang.String ERROR_MSG_UNBOUND_DEVICE

It is an error message indicating that the Huawei Health app has not been bound to a device.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1953243391184526)

## ERROR_CODE_INVALID_ARGUMENT

public static final int ERROR_CODE_INVALID_ARGUMENT

It is an error code indicating invalid parameters.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p689685761184526)

## ERROR_MSG_INVALID_ARGUMENT

public static final java.lang.String ERROR_MSG_INVALID_ARGUMENT

It is an error message indicating invalid parameters.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p782051269184526)

## ERROR_CODE_SERVER_REMOTE_BINDER

public static final int ERROR_CODE_SERVER_REMOTE_BINDER

It is an error code indicating that the remote bound object of the server is null.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p101721835184526)

## ERROR_MSG_SERVER_REMOTE_BINDER

public static final java.lang.String ERROR_MSG_SERVER_REMOTE_BINDER

It is an error message indicating that the remote bound object of the server is null.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1036370678184526)

## ERROR_CODE_USER_UNAUTHORIZED_IN_HEALTH

public static final int ERROR_CODE_USER_UNAUTHORIZED_IN_HEALTH

Error code indicating that the user has not agreed to *Huawei Health User Agreement* and *Statement About huawei Health and Privacy* in the Huawei Health app.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1360500029184526)

## ERROR_MSG_USER_UNAUTHORIZED_IN_HEALTH

public static final java.lang.String ERROR_MSG_USER_UNAUTHORIZED_IN_HEALTH

It is an error message indicating that the user has not agreed to *Huawei Health User Agreement* and *Statement About Huawei Health and Privacy* in the Huawei Health app.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p559529451184526)

## ERROR_CODE_SCOPE_UNAUTHORIZED

public static final int ERROR_CODE_SCOPE_UNAUTHORIZED

It is an error code indicating the Scope permission verification failure.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p948731347184526)

## ERROR_MSG_SCOPE_UNAUTHORIZED

public static final java.lang.String ERROR_MSG_SCOPE_UNAUTHORIZED

It is an error message indicating the Scope permission verification failure.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1063151979184526)

## ERROR_CODE_USER_UNAUTHORIZED_IN_WEAR_ENGINE

public static final int ERROR_CODE_USER_UNAUTHORIZED_IN_WEAR_ENGINE

It is an error code indicating that the basic device information permission, notification permission, or sensor permission verification of Wear Engine fails.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p2073515414184526)

## ERROR_MSG_USER_UNAUTHORIZED_WEAR_ENGINE

public static final java.lang.String ERROR_MSG_USER_UNAUTHORIZED_WEAR_ENGINE

It is an error message indicating that the basic device information permission, notification permission, or sensor permission verification of Wear Engine fails.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p737593953184526)

## ERROR_CODE_INVALID_FILE

public static final int ERROR_CODE_INVALID_FILE

It is an error code indicating invalid files.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p302782591184526)

## ERROR_MSG_INVALID_FILE

public static final java.lang.String ERROR_MSG_INVALID_FILE

It is an error message indicating invalid files.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1974770640184526)

## ERROR_CODE_OVERMUCH_RECEIVER

public static final int ERROR_CODE_OVERMUCH_RECEIVER

It is an error code indicating that too many receivers from the server receive messages from the wearable device.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p285635680184526)

## ERROR_MSG_OVERMUCH_RECEIVER

public static final java.lang.String ERROR_MSG_OVERMUCH_RECEIVER

It is an error message indicating that too many receivers from the server receive messages from the wearable device.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p63537586184526)

## ERROR_CODE_INTERNAL_ERROR

public static final int ERROR_CODE_INTERNAL_ERROR

It is an internal error code. When it is displayed, contact Huawei technical support for assistance.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1765071918184526)

## ERROR_MSG_INTERNAL_ERROR

public static final java.lang.String ERROR_MSG_INTERNAL_ERROR

It is an internal error message. When it is displayed, contact Huawei technical support for assistance.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1718953559184526)

## ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT

public static final int ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT

It is an error code indicating that the device version is not supported.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p865826391184526)

## ERROR_MSG_DEVICE_VERSION_NOT_SUPPORT

public static final java.lang.String ERROR_MSG_DEVICE_VERSION_NOT_SUPPORT

It is an error message indicating that the device version is not supported.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p92759738184526)

## ERROR_CODE_HEALTH_VERSION_IS_LOW

public static final int ERROR_CODE_HEALTH_VERSION_IS_LOW

It is an error code indicating that the version of the Huawei Health app is too early and it causes a version mismatch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p736957083184526)

## ERROR_MSG_HEALTH_VERSION_IS_LOW

public static final java.lang.String ERROR_MSG_HEALTH_VERSION_IS_LOW

It is an error message indicating that the version of the Huawei Health app is too early and it causes a version mismatch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1388250115184526)

## ERROR_CODE_HEALTH_NOT_AUTO_START

public static final int ERROR_CODE_HEALTH_NOT_AUTO_START

It is an error code indicating that the Huawei Health app process cannot automatically start.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p543093147184526)

## ERROR_MSG_HEALTH_NOT_AUTO_START

public static final java.lang.String ERROR_MSG_HEALTH_NOT_AUTO_START

It is an error message indicating that the Huawei Health process cannot automatically start.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p535995935184526)

## ERROR_CODE_DEVICE_IS_NOT_CONNECTED

public static final int ERROR_CODE_DEVICE_IS_NOT_CONNECTED

It is an error code indicating that the device is not connected.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1399137012184526)

## ERROR_MSG_DEVICE_IS_NOT_CONNECTED

public static final java.lang.String ERROR_MSG_DEVICE_IS_NOT_CONNECTED

It is an error message indicating that the device is not connected.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p2106501892184526)

## ERROR_CODE_DEVICE_UUID_IS_INVALID

public static final int ERROR_CODE_DEVICE_UUID_IS_INVALID

It is an error code indicating that the UUID of the device is invalid because the user has paired the device again. In this case, the device should be obtained again.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1183516176184526)

## ERROR_MSG_DEVICE_UUID_IS_INVALID

public static final java.lang.String ERROR_MSG_DEVICE_UUID_IS_INVALID

It is an error message indicating that the UUID of the device is invalid.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1507176993184526)

## ERROR_CODE_INTERFACE_IS_NOT_SUPPORTED

public static final int ERROR_CODE_INTERFACE_IS_NOT_SUPPORTED

It is an error code indicating that the API is not supported.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p369345184184526)

## ERROR_MSG_INTERFACE_IS_NOT_SUPPORTED

public static final java.lang.String ERROR_MSG_INTERFACE_IS_NOT_SUPPORTED

It is an error message indicating that the API is not supported.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p845627862184526)

#### ERROR_CODE_SERVICE_TIMEOUT

public static final int ERROR_CODE_SERVICE_TIMEOUT

It is an error code indicating API calling timeout.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p064511451362)

#### ERROR_MSG_SERVICE_TIMEOUT

public static final java.lang.String ERROR_MSG_SERVICE_TIMEOUT

It is an error message indicating API calling timeout.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p9901059193912)

#### ERROR_CODE_POWER_MODE_CHANGING

public static final int ERROR_CODE_POWER_MODE_CHANGING

It is an error code indicating that the device is in the middle of a mode switchover.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p769575063620)

#### ERROR_MSG_POWER_MODE_CHANGING

public static final java.lang.String ERROR_MSG_POWER_MODE_CHANGING

It is an error message indicating that the device is in the middle of a mode switchover.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p145039411405)

## ERROR_CODE_P2P_WATCH_APP_NOT_EXIT

public static final int ERROR_CODE_P2P_WATCH_APP_NOT_EXIT

It is an error code indicating that the app has not been installed on the watch when the phone pings the watch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p66615760184526)

## ERROR_MSG_P2P_WATCH_APP_NOT_EXIT

public static final java.lang.String ERROR_MSG_P2P_WATCH_APP_NOT_EXIT

It is an error message indicating that the app has not been installed on the watch when the phone pings the watch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1617963591184526)

## ERROR_CODE_P2P_WATCH_APP_NOT_RUNNING

public static final int ERROR_CODE_P2P_WATCH_APP_NOT_RUNNING

It is an error code indicating that the app has been installed on the watch but is not running when the phone pings the watch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1640279961184526)

## ERROR_MSG_P2P_WATCH_APP_NOT_RUNNING

public static final java.lang.String ERROR_MSG_P2P_WATCH_APP_NOT_RUNNING

It is an error message indicating that the app has been installed on the watch but is not running when the phone pings the watch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p2061438031184526)

## ERROR_CODE_P2P_WATCH_APP_RUNNING

public static final int ERROR_CODE_P2P_WATCH_APP_RUNNING

It is an error code indicating that the app is running on the watch when the phone pings the watch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1697530307184526)

## ERROR_MSG_P2P_WATCH_APP_RUNNING

public static final java.lang.String ERROR_MSG_P2P_WATCH_APP_RUNNING

It is an error message indicating that the app is running on the watch when the phone pings the watch.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1191736266184526)

## ERROR_CODE_P2P_OTHER_ERROR

public static final int ERROR_CODE_P2P_OTHER_ERROR

It indicates other error codes of P2P communication.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p263639244184526)

## ERROR_MSG_P2P_OTHER_ERROR

public static final java.lang.String ERROR_MSG_P2P_OTHER_ERROR

It indicates other error messages of P2P communication.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p450626256184526)

## ERROR_CODE_P2P_PHONE_APP_NOT_EXIT

public static final int ERROR_CODE_P2P_PHONE_APP_NOT_EXIT

It is an error code indicating that the app has not been installed on the phone when the watch pings the phone.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p635807732184526)

## ERROR_MSG_P2P_PHONE_APP_NOT_EXIT

public static final java.lang.String ERROR_MSG_P2P_PHONE_APP_NOT_EXIT

It is an error message indicating that the app has not been installed on the phone when the watch pings the phone.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1236116006184526)

## ERROR_CODE_P2P_PHONE_APP_EXIT

public static final int ERROR_CODE_P2P_PHONE_APP_EXIT

It is an error code indicating that the app has been installed on the phone when the watch pings the phone.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p561854789184526)

## ERROR_MSG_P2P_PHONE_APP_EXIT

public static final java.lang.String ERROR_MSG_P2P_PHONE_APP_EXIT

It is an error message indicating that the app has been installed on the phone when the watch pings the phone.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1125721844184526)

## ERROR_CODE_COMM_FAIL

public static final int ERROR_CODE_COMM_FAIL

It is an error code indicating service communication failure.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p383065835184526)

## ERROR_MSG_COMM_FAIL

public static final java.lang.String ERROR_MSG_COMM_FAIL

It is an error message indicating service communication failure.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p806920709184526)

## ERROR_CODE_COMM_SUCCESS

public static final int ERROR_CODE_COMM_SUCCESS

It is an error code indicating successful service communication.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p647129586184526)

## ERROR_MSG_COMM_SUCCESS

public static final java.lang.String ERROR_MSG_COMM_SUCCESS

It is a message indicating successful communication.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p1154615290184526)

#### Method Detail

## getErrorMsgFromCode

public static java.lang.String getErrorMsgFromCode(int errorCode)

It is used to obtain the error message of Wear Engine based on the error code of Wear Engine so that you can obtain the error messages of Wear Engine based on the error codes of Wear Engine.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errorCode | Error codes |

**Returns:**

Error message.

**Since:**

API level 0 (SDK 5.0.0.301)

## getErrorCodeFromErrorMsg

public static int getErrorCodeFromErrorMsg(java.lang.String message)

It is used to obtain the error code based on the error message.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| message | Error message. |

**Returns:**

Error code.

**Since:**

API level 0 (SDK 5.0.0.301)
