<!--
  Title: Setting the Language and Unit System
  Catalog: huaweihealth-Guides
  Document ID: set-language-and-unit-0000002338300776
  Updated: 2026-08-05 02:10:23
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-language-and-unit-0000002338300776
-->
# Setting the Language and Unit System

This section describes how to set the display language and unit system of a wearable.

> **Note:** Do not call this API to update the language and unit system during the workout linkage process of [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557). Otherwise, the linkage will be suspended.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the language and unit system. 
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
| language | • Standard language code. Example: **zh-CN** and **en-US** • No more than 8 characters | Display language of a device. |
| unit | 0 | Unit system of the data displayed on the device: metric system. |
| 1 | Unit system of the data displayed on the device: imperial system. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the language and unit system. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the language and unit system.
JSONObject jsonObject = new JSONObject();
JSONObject valueObject = new JSONObject();
try {
    jsonObject.put("settingKey", "languageAndUnit");
    valueObject.put("language", "zh-CN");
    valueObject.put("unit", 0);
    jsonObject.put("settingValue", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the language and unit system.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
