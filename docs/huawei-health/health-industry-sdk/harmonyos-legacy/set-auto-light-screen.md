<!--
  Title: Setting the Raise-to-Wake Switch
  Catalog: huaweihealth-Guides
  Document ID: set-auto-light-screen-0000002447392125
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-auto-light-screen-0000002447392125
-->
# Setting the Raise-to-Wake Switch

This section describes how to set the raise-to-wake switch of a wearable. After the switch is enabled, the wearable will automatically wake the screen when the user raises their wrist. After the switch is disabled, the wearable will not automatically wake the screen when the user raises their wrist.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the raise-to-wake switch. 
```cpp
{
    "settingKey": "autoLightScreen",
    "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | autoLightScreen | Key of the raise-to-wake switch. |
| settingValue | 0 | Disables the raise-to-wake switch. |
| 1 | Enables the raise-to-wake switch. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the raise-to-wake switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the raise-to-wake switch.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "autoLightScreen");
    zsonObject.put("settingValue", 1);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the raise-to-wake switch.
manageClient.set(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
