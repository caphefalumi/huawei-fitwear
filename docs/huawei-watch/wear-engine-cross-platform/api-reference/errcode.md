<!--
  Title: Return Code
  Catalog: connectivity-References
  Document ID: errcode-0000001053075227
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/errcode-0000001053075227
-->
# Return Code

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
