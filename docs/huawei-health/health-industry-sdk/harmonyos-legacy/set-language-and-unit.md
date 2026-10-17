<!--
  Title: Setting the Language and Unit System
  Catalog: huaweihealth-Guides
  Document ID: set-language-and-unit-0000002413832940
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-language-and-unit-0000002413832940
-->
# Setting the Language and Unit System

This section describes how to set the display language and workout data unit system of a wearable.

- The setting API of the Health Industry SDK on the wearable and that on the phone may conflict with each other, leading to incorrect results. Avoid using the same setting API on both devices.
- The settings applied via the API of the Health Industry SDK on the wearable will not be synchronized to the SDK on the phone. Ensure that all setting and query operations are performed on the same device.

- When a wearable reconnects to the Huawei Health app after disconnection, the app will send its own language to the wearable.
- If a non-standard language code is passed, the following will occur: The API is successfully called and the status code **0** is returned. The language is set to English in smart mode and Chinese in ultra-long battery life mode by default.

> **Note:** Do not call this API to update the language and unit system during the workout linkage process of [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002478257024#EN-US_TOPIC_0000002647924598__li1717645195615). Otherwise, the linkage will be suspended. After the language is set, your app will restart.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for setting the language and unit system. 
```cpp
{
    "settingKey": "languageAndUnit",
    "settingValue": {
        "language": "zh-CN",
        "unit": 0
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | languageAndUnit | Key of the language and unit system. |
| settingValue | Fields included: **language** and **unit** | Language and unit system. |
| language | • Standard language code. Example: **zh-CN** and **en-US** • No more than 8 characters | Device language. |
| unit | 0 | Unit system of the data displayed on the device: metric system. |
| 1 | Unit system of the data displayed on the device: imperial system. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the language and unit system. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for setting the language and unit system.
ZSONObject zsonObject = new ZSONObject();
ZSONObject valueObject = new ZSONObject();
try {
    zsonObject.put("settingKey", "languageAndUnit");
    valueObject.put("language", "zh-CN");
    valueObject.put("unit", 0);
    zsonObject.put("settingValue", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the set method to set the language and unit system.
deviceManageClient.set(zsonObject.toString(), new ServiceCallback() {
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
