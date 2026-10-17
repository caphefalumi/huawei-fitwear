<!--
  Title: Setting the TruSleep Switch
  Catalog: huaweihealth-Guides
  Document ID: set-trusleep-switch-0000002447392129
  Updated: 2026-08-05 02:10:22
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-trusleep-switch-0000002447392129
-->
# Setting the TruSleep Switch

This section describes how to set the TruSleep switch of a wearable. After the switch is enabled, the wearable will continuously monitor users' sleep and breathing quality in real time throughout the sleep period. After the switch is disabled, the wearable will no longer monitor sleep and breathing quality.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the TruSleep switch. 
```cpp
{
    "settingKey": "TRUSleepSwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | TRUSleepSwitch | Key of the TruSleep switch. |
| settingValue | 0 | Disables the TruSleep switch. |
| 1 | Enables the TruSleep switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the TruSleep switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the TruSleep switch.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "TRUSleepSwitch");
    zsonObject.put("settingValue", 1);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the TruSleep switch.
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
