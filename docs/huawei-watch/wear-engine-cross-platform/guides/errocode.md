<!--
  Title: Result Code
  Catalog: connectivity-Guides
  Document ID: errocode-0000001054450278
  Updated: 2025-10-13 02:54:07
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/errocode-0000001054450278
-->
# Result Code

#### Phone

**com.huawei.wearengine.common.[WearEngineErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969)**

| Scenario | **Meaning** | Constant Field | **Value** |
| --- | --- | --- | --- |
| General | Result code displayed when the request is successful. | [ERROR_CODE_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_SUCCESS) | 0 |
| Common result codes. | [ERROR_CODE_GENERIC](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_GENERIC) | 1 |  |
| Result code displayed when the Huawei Health app has not been installed. | [ERROR_CODE_UNINSTALL_HEALTH](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_UNINSTALL_HEALTH) | 2 |  |
| Result code displayed when the Huawei Health app has been installed but not logged in. | [ERROR_CODE_HEALTH_LOGOUT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_HEALTH_LOGOUT) | 3 |  |
| Result code displayed when no device is connected to the Huawei Health app. | [ERROR_CODE_UNBOUND_DEVICE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_UNBOUND_DEVICE) | 4 |  |
| Result code displayed when the parameter is invalid. | [ERROR_CODE_INVALID_ARGUMENT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INVALID_ARGUMENT) | 5 |  |
| Result code displayed when the remote bound object of the server is **null**. | [ERROR_CODE_SERVER_REMOTE_BINDER](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_SERVER_REMOTE_BINDER) | 6 |  |
| Result code displayed when the user has not agreed to the Huawei Health User Agreement and/or Statement About Huawei Health and Privacy. | [ERROR_CODE_USER_UNAUTHORIZED_IN_HEALTH](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_USER_UNAUTHORIZED_IN_HEALTH) | 7 |  |
| Result code displayed when the scope permission verification fails. | [ERROR_CODE_SCOPE_UNAUTHORIZED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_SCOPE_UNAUTHORIZED) | 8 |  |
| Result code displayed indicating the permission verification failure of user authorization or indicating that you have not called the corresponding authorized API. | [ERROR_CODE_USER_UNAUTHORIZED_IN_WEAR_ENGINE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_USER_UNAUTHORIZED_IN_WEAR_ENGINE) | 9 |  |
| Result code displayed when the file is invalid. | [ERROR_CODE_INVALID_FILE](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INVALID_FILE) | 10 |  |
| Result code displayed when too many receivers from the server receive messages from the device. | [ERROR_CODE_OVERMUCH_RECEIVER](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_OVERMUCH_RECEIVER) | 11 |  |
| Internal result code. Requires Huawei Wear Engine contacts to locate the issue when this result code displays. | [ERROR_CODE_INTERNAL_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INTERNAL_ERROR) | 12 |  |
| Result code displayed when the device version is not supported. | [ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT) | 13 |  |
| Result code displayed when the Huawei Health app runs a version that is too early. | [ERROR_CODE_HEALTH_VERSION_IS_LOW](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_HEALTH_VERSION_IS_LOW) | 14 |  |
| Result code displayed when the Huawei Health app process cannot launch automatically. | [ERROR_CODE_HEALTH_NOT_AUTO_START](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_HEALTH_NOT_AUTO_START) | 15 |  |
| Result code displayed when the device is not connected. | [ERROR_CODE_DEVICE_IS_NOT_CONNECTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_IS_NOT_CONNECTED) | 16 |  |
| Result code displayed when the UUID of the device is invalid. In this case, you need to obtain the device again. | [ERROR_CODE_DEVICE_UUID_IS_INVALID](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_DEVICE_UUID_IS_INVALID) | 17 |  |
| Result code displayed when the API is not supported. | [ERROR_CODE_INTERFACE_IS_NOT_SUPPORTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_INTERFACE_IS_NOT_SUPPORTED) | 18 |  |
| Result code displayed when API calling times out. | [ERROR_CODE_SERVICE_TIMEOUT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#section5100140113416) | 19 |  |
| Result code displayed when the API is called in the middle of a mode switchover. | [ERROR_CODE_POWER_MODE_CHANGING](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#section13919514469) | 20 |  |
| The phone uses the **ping** method to check whether the wearable device is reachable. | Result code displayed when the wearable app has not been installed | [ERROR_CODE_P2P_WATCH_APP_NOT_EXIT](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_WATCH_APP_NOT_EXIT) | 200 |
| Result code displayed when the wearable app has been installed but not opened. | [ERROR_CODE_P2P_WATCH_APP_NOT_RUNNING](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_WATCH_APP_NOT_RUNNING) | 201 |  |
| Result code displayed when the wearable app has been installed and opened. | [ERROR_CODE_P2P_WATCH_APP_RUNNING](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_WATCH_APP_RUNNING) | 202 |  |
| Result code displayed when there is a system error during P2P communications. | [ERROR_CODE_P2P_OTHER_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_P2P_OTHER_ERROR) | 203 |  |
| The wearable device communicates with the phone. | [Result code displayed when the service communications fail](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/faq-0000001050818031#section93836121392). | [ERROR_CODE_COMM_FAIL](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_COMM_FAIL) | 206 |
| Result code displayed when the service communications succeed. | [ERROR_CODE_COMM_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineerrorcode-0000001059980969#EN-US_TOPIC_0000001873951390__ERROR_CODE_COMM_SUCCESS) | 207 |  |
| Internal result code | Result code displayed when there is an internal error. Contact the Huawei technical support for assistance. | - | Ranging from 1990000000 to 2000000000 |

#### iOS phones

| Scenario | **Meaning** | Constant Field | **Value** |
| --- | --- | --- | --- |
| General | Result code displayed when the operation is successful. | WESErrorCodeSuccess | 0 |
| Result code displayed when the user has not logged in to Huawei Health. | WESErrorCodeAPPLogout | 3 |  |
| Result code displayed when no device is bound to Huawei Health. | WESErrorCodeNoBoundDevices | 4 |  |
| Result code displayed when an invalid parameter error occurs. | WESErrorCodeInvalidArgument | 5 |  |
| Result code displayed when the user has not agreed to the Huawei Health User Agreement and/or Statement About Huawei Health and Privacy. | WESErrorCodeUserUnauthorized | 7 |  |
| Result code displayed when the scope permission verification fails. | WESErrorCodeScopeUnauthorized | 8 |  |
| Result code displayed when the user has not granted the device management permissions for Wear Engine. | WESErrorCodeUserUnauthorizedWearEngine | 9 |  |
| Result code displayed when the file is invalid. | WESErrorCodeInvalidFile | 10 |  |
| Result code displayed when too many receivers from the server receive messages from the wearable device. | WESErrorCodeOvermuchReceiver | 11 |  |
| Result code displayed when an internal error occurs. | WESErrorCodeInternalError | 12 |  |
| Result code displayed when the wearable device version is not supported. | WESErrorCodeDeviceVersionLow | 13 |  |
| Result code displayed when the Huawei Health version is not supported. | WESErrorCodeAPPVersionLow | 14 |  |
| Result code displayed when the device is not connected. | WESErrorCodeDeviceDisconnected | 16 |  |
| Result code displayed indicating invalid UUID when the user has relinked the device. | WESErrorCodeUUIDInvalid | 17 |  |
| Result code displayed when the API is not supported. | WESErrorCodeAPINotSupport | 18 |  |
| Result code displayed when system Bluetooth is disabled. | WESErrorCodeDeviceConnectFailed | 21 |  |
| Result code displayed when system Bluetooth is not authorized. | WESErrorCodeSystemBluetoothSwitchOff | 22 |  |
| Result code displayed when the device is disconnected. | WESErrorCodeDeviceStateDisconnected | 23 |  |
| The phone uses the **ping** method to check whether the wearable device is reachable. | Result code displayed when the watch-based app has not been installed. | WESErrorCodeP2PWatchAPPNotExit | 200 |
| Result code displayed when the watch-based app has been installed but not opened. | WESErrorCodeP2PWatchAPPNotRunning | 201 |  |
| Result code displayed when the watch-based app has been installed and opened. | WESErrorCodeP2PWatchAPPRunning | 202 |  |
| Result code displayed indicating other errors during P2P communications. | WESErrorCodeP2POtherError | 203 |  |
| The wearable device uses the **ping** method to check whether the phone is reachable. | Result code displayed when the phone-based app has not been installed. | WESErrorCodeP2PPhoneAPPNotExit | 204 |
| Result code displayed when the phone-based app has been installed. | WESErrorCodeP2PPhoneAPPExit | 205 |  |
| Result code displayed when the message fails to be sent. | WESErrorCodeCommFail | 206 |  |
| Result code displayed when the message is sent successfully. | WESErrorCodeCommSuccess | 207 |  |
| Result code displayed when the offline service communications succeed. | WESErrorCodeOfflineMsgSuccess | 209 |  |
| Authorization code obtaining | Result code displayed when the authorization code is obtained successfully. | WESErrorCodeAuthCodeSucc | 210 |
| Result code displayed when the authorization code fails to be obtained due to device disconnection. | WESErrorCodeAuthCodeNoDevice | 211 |  |
| Result code displayed when the authorization code fails to be obtained because the Huawei Health app is not installed. | WESErrorCodeAuthCodeAppNotInstall | 212 |  |
| Result code displayed when the authorization code fails to be obtained due to URL parsing failure. | WESErrorCodeAuthCodeUrlInvalid | 213 |  |
| Result code displayed when the authorization code fails to be obtained due to the app's failure to pass the MCP verification. | WESErrorCodeAuthCodeMcpError | 214 |  |
| Result code displayed when the authorization code fails to be obtained because the user has not logged in to the Huawei Health app. | WESErrorCodeAuthCodeAppLogout | 215 |  |
| Result code displayed when the authorization code fails to be obtained due to an invalid app signature. | WESErrorCodeAuthCodeSignInvalid | 216 |  |
| Result code displayed when the authorization code fails to be obtained due to the valid permission list being empty. | WESErrorCodeAuthCodePermissionEmpty | 217 |  |
| Result code displayed when the authorization code fails to be obtained due to network request errors. | WESErrorCodeAuthCodeNetworkError | 218 |  |
| Result code displayed when the authorization is canceled. | WESErrorCodeAuthCodeDeauthorize | 219 |  |
| Result code displayed when the authorization is granted and the Huawei Health app has been launched to obtain device information successfully. | WESErrorCodeAuthCodeAppShouldLaunch | 220 |  |
| Result code displayed when the Huawei Health app has been launched, but device information is not obtained. | WESErrorCodeAuthCodeNoDevicesInfo | 221 |  |

#### Lite wearable device

| **Scenario** | **Meaning** | **Constant Field Value** | **Value** |
| --- | --- | --- | --- |
| General | Invalid parameter. | ERROR_CODE_INVALID_ARGUMENT | 5 |
| The device version is not supported. | ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT | 13 |  |
| The device is not connected. | ERROR_CODE_DEVICE_IS_NOT_CONNECTED | 16 |  |
| The watch uses the **ping** commands on the phone. | The app has not been installed on the phone. | MSG_ERROR_PING_PHONE_APP_NOT_EXIST | 204 |
| The app has been installed on the phone. | MSG_ERROR_PING_PHONE_APP_NOT_RUNNING | 205 |  |
| The watch communicates with the phone. | [The message fails to be sent.](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/faq-0000001050818031#section93836121392) | MSG_ERROR_SEND_FAIL | 206 |
| The message has been sent. | MSG_ERROR_SEND_SUCCESS | 207 |  |
| The watch version is too early. (It is recommended that you notify the users who the watch version is too early and they need to use the Huawei Health app to update the watch version.) | MSG_ERROR_CODE_VERSION_TOO_LOW | 208 |  |

#### Smart wearable device

**com.huawei.watch.kit.hiwear.common.[HiWearErrorCode](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345)**

| Scenario | **Meaning** | Constant Field | **Value** |
| --- | --- | --- | --- |
| General | Result code displayed when the request is successful. | [ERROR_CODE_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#EN-US_TOPIC_0000001920110345__ERROR_CODE_SUCCESS) | 0 |
| Internal result code. Requires Huawei Wear Engine contacts to locate the issue when this result code displays. | [ERROR_CODE_INTERNAL_ERROR](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#section1187620511005) | 12 |  |
| Result code displayed when the device version is not supported. | [ERROR_CODE_DEVICE_VERSION_NOT_SUPPORT](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#section11207160606) | 13 |  |
| Result code displayed when the device is not connected. | [ERROR_CODE_DEVICE_IS_NOT_CONNECTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#section179813342542) | 16 |  |
| The wearable device uses the **ping** method to check whether the phone is reachable. | Result code displayed when the phone-based app has not been installed. | [MSG_ERROR_PING_PHONE_APP_NOT_EXIST](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#EN-US_TOPIC_0000001920110345__MSG_ERROR_PING_PHONE_APP_NOT_EXIST) | 204 |
| Result code displayed when the phone-based app has been installed. | [MSG_ERROR_PING_PHONE_APP_EXIST](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#EN-US_TOPIC_0000001920110345__MSG_ERROR_PING_PHONE_APP_NOT_RUNNING) | 205 |  |
| Result code displayed when the message fails to be sent. | [MSG_ERROR_SEND_FAIL](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#EN-US_TOPIC_0000001920110345__MSG_ERROR_SEND_FAIL) | 206 |  |
| Result code displayed when the message is sent successfully. | [MSG_ERROR_SEND_SUCCESS](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwearerrorcode-0000001058717345#EN-US_TOPIC_0000001920110345__MSG_ERROR_SEND_SUCCESS) | 207 |  |
