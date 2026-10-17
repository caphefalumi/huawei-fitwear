<!--
  Title: Setting the Continuous Heart Rate Monitoring Mode
  Catalog: huaweihealth-Guides
  Document ID: set-continue-measure-heart-rate-switch-0000002413673056
  Updated: 2026-08-05 02:10:30
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-continue-measure-heart-rate-switch-0000002413673056
-->
# Setting the Continuous Heart Rate Monitoring Mode

This section describes how to set the continuous heart rate monitoring mode for a wearable. After continuous heart rate monitoring (smart mode) is enabled, the wearable will dynamically adjust the measurement frequency based on users' workout status and provide 24-hour smart heart rate monitoring. After continuous heart rate monitoring (real-time mode) is enabled, the wearable will provide 24-hour real-time heart rate monitoring. After continuous heart rate monitoring is disabled, the wearable will not automatically measure the heart rate.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the continuous heart rate monitoring mode. 
```cpp
{
    "settingKey": "continueMeasureHeartRateSwitch",
    "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | continueMeasureHeartRateSwitch | Key of the continuous heart rate monitoring mode. |
| settingValue | 0 | Disables continuous heart rate monitoring. |
| 1 | Enables continuous heart rate monitoring (smart mode). |  |
| 2 | Enables continuous heart rate monitoring (real-time mode). |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the continuous heart rate monitoring mode. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the continuous heart rate monitoring mode.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "continueMeasureHeartRateSwitch");
    zsonObject.put("settingValue", 1);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the continuous heart rate monitoring mode.
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
