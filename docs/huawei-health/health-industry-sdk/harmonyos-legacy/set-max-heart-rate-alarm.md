<!--
  Title: Setting the High Heart Rate Alert Switch and Threshold
  Catalog: huaweihealth-Guides
  Document ID: set-max-heart-rate-alarm-0000002447352061
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-max-heart-rate-alarm-0000002447352061
-->
# Setting the High Heart Rate Alert Switch and Threshold

This section describes how to set the high heart rate alert switch and threshold (unit: beats/min) for non-workout states on a wearable. After the alert switch is enabled, the wearable will generate a high heart rate alert when detecting that the heart rate is higher than the alert threshold for 10 consecutive minutes. After the alert switch is disabled, no high heart rate alert will be generated.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

> **Note:** To enable the high heart rate alert, you need to enable continuous heart rate monitoring first. For details, please refer to [Setting the Continuous Heart Rate Monitoring Mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-continue-measure-heart-rate-switch-0000002413673056).

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the high heart rate alert switch and threshold. 
```cpp
{
    "settingKey": "maxHeartRateAlarm",
    "settingValue": {
        "switch": 1,
        "threshold": 130
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | maxHeartRateAlarm | Key of the high heart rate alert switch and threshold. |
| settingValue | Fields included: **switch** and **threshold** | High heart rate alert switch state and alert threshold. |
| switch | 0 | Disables the high heart rate alert switch for non-workout states. |
| 1 | Enables the high heart rate alert switch for non-workout states. |  |
| threshold | Integer ranging from 100 to 150 | High heart rate alert threshold for non-workout states. **This parameter is mandatory only when the alert switch is enabled.** |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the high heart rate alert switch and threshold. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the high heart rate alert switch and threshold.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject switchAndThreshold = new ZSONObject();
    switchAndThreshold.put("switch", 1);
    switchAndThreshold.put("threshold", 130);
    zsonObject.put("settingKey", "maxHeartRateAlarm");
    zsonObject.put("settingValue", switchAndThreshold);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the high heart rate alert switch and threshold.
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
