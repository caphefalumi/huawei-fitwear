<!--
  Title: Setting the Automatic SpO2 Measurement Switch
  Catalog: huaweihealth-Guides
  Document ID: set-blood-oxygen-switch-0000002447392133
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-blood-oxygen-switch-0000002447392133
-->
# Setting the Automatic SpO2 Measurement Switch

This section describes how to set the automatic SpO2 measurement switch of a wearable. After the switch is enabled, the wearable will automatically measure SpO2 every 10 minutes while the user is stationary. After the switch is disabled, the wearable will stop automatic SpO2 measurement.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the automatic SpO2 measurement switch. 
```cpp
{
    "settingKey": "bloodOxygenSwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | bloodOxygenSwitch | Key of the automatic SpO2 measurement switch. |
| settingValue | 0 | Disables the automatic SpO2 measurement switch. |
| 1 | Enables the automatic SpO2 measurement switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the automatic SpO2 measurement switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the automatic SpO2 measurement switch.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "bloodOxygenSwitch");
    zsonObject.put("settingValue", 0);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the automatic SpO2 measurement switch.
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
