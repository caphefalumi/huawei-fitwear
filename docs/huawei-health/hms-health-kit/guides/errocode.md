<!--
  Title: Result Codes
  Catalog: HMSCore-Guides-V5
  Document ID: errocode-0000001053256958-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5
-->
# Result Codes

The corresponding API is [HiHealthError](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5).

| **Constant Field** | Value | Data Definition | Typical Scenario |
| --- | --- | --- | --- |
| [SUCCESS](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__SUCCESS) | 0 | Calling succeeded. | The execution is normal. |
| [FAILED](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__FAILED) | 1 | Calling failed. | The HUAWEI Health app is not installed. |
| [PARAM_INVALIED](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__PARAM_INVALIED) | 2 | Parameter error. | The data list is empty when saving the blood pressure data. |
| [ERR_API_EXECEPTION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__ERR_API_EXECEPTION) | 4 | API calling error. | Communication with the HUAWEI Health app is interrupted. |
| [ERR_DEVICE_EXCEPTION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__ERR_DEVICE_EXCEPTION) | 5 | Device exception. | Failed to read the device data or the device does not support the function. |
| [ERR_PERMISSION_EXCEPTION](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__ERR_PERMISSION_EXCEPTION) | 1001 | Permission verification error. | The permission is not yet authorized. A reminder needs to be sent to the user to grant the related permission. |
| [ERR_PRIVACY_USER_DENIED](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealtherror-0000001071707423-V5#EN-US_TOPIC_0000001090250918__ERR_PRIVACY_USER_DENIED) | 1003 | App privacy agreement denied. | The user has not agreed to the privacy agreement in the HUAWEI Health app. |
