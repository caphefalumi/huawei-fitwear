<!--
  Title: Restoring a Wearable to Factory Settings
  Catalog: huaweihealth-Guides
  Document ID: device-factory-reset-0000002338298264
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/device-factory-reset-0000002338298264
-->
# Restoring a Wearable to Factory Settings

This section describes how an industry app can send an instruction to a wearable to restore the wearable to factory settings.

> **Note:** A [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) cannot be restored to factory settings when it is in the ultra-long battery life mode. After a wearable is restored to factory settings (not through an industry app), delete the wearable from the industry app and add it again. After a factory reset, all data on the wearable is cleared, which will severely affect the use of SDKs.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for restoring the wearable to factory settings. 
```cpp
{
    "mode": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| mode | 1 | Restores the whole device to factory settings. |
| 2 | Restores all settings except the eSIM card to factory settings (supported only on [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557)). |  |

- Call the [factoryReset](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__factoryReset-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to restore the wearable to factory settings. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Create a JSON object for restoring the wearable to factory settings.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("mode", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the factoryReset method to restore the wearable to factory settings.
deviceManageClient.factoryReset(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 6 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
