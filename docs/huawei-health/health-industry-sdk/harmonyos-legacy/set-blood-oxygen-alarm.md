<!--
  Title: Setting the SpO2 Alert Switch and Threshold
  Catalog: huaweihealth-Guides
  Document ID: set-blood-oxygen-alarm-0000002413673060
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-blood-oxygen-alarm-0000002413673060
-->
# Setting the SpO2 Alert Switch and Threshold

This section describes how to set the SpO2 alert switch and alert threshold (in percentage) of a wearable. After the alert switch is enabled, the wearable will generate an abnormal SpO2 alert when detecting that the SpO2 value is lower than the alert threshold for three consecutive times. After the alert switch is disabled, no abnormal SpO2 alert will be generated.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** If you want to enable the SpO2 alert switch, automatic SpO2 measurement needs to be enabled first. For details, please refer to [Setting the Automatic SpO2 Measurement Switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-blood-oxygen-switch-0000002447392133).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the SpO2 alert switch and the threshold for triggering an alert. 
```cpp
{
    "settingKey": "bloodOxygenAlarm",
    "settingValue": {
        "switch": 1,
        "threshold": 80
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | bloodOxygenAlarm | Key of the SpO2 alert switch and threshold. |
| settingValue | Fields included: **switch** and **threshold** | SpO2 alert switch state and the threshold for triggering an alert. |
| switch | 0 | Disables the SpO2 alert switch. |
| 1 | Enables the SpO2 alert switch. |  |
| threshold | Integer ranging from 75 to 90 | Threshold for triggering an abnormal SpO2 alert. **This parameter is mandatory only when the alert switch is enabled**. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the SpO2 alert switch and the threshold for triggering an alert. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the SpO2 alert switch and the threshold for triggering an alert.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject switchAndThreshold = new ZSONObject();
    switchAndThreshold.put("switch", 1);
    switchAndThreshold.put("threshold", 80);
    zsonObject.put("settingKey", "bloodOxygenAlarm");
    zsonObject.put("settingValue", switchAndThreshold);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the SpO2 alert switch and the threshold for triggering an alert.
manageClient.set(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
