<!--
  Title: Querying the Language and Unit System
  Catalog: huaweihealth-Guides
  Document ID: query-language-and-unit-0000002372218961
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-language-and-unit-0000002372218961
-->
# Querying the Language and Unit System

This section describes how to query the display language and unit system of a wearable. After a wearable is connected for the first time, its default language will be the system language of the mobile device (for example, a phone), and the unit system is metric.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the language and unit system. 
```cpp
{
    "item": "languageAndUnit"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the language and unit system. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the language and unit system.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "languageAndUnit");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the language and unit system.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the language and unit system are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The language and unit system are carried in **result** when the query is successful. 
```cpp
result example:
{
    "language":"en-US",
    "unit":0 
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| language | Standard language code. Example: **zh-CN** and **en-US** | Display language of a device. |
| unit | 0 | Metric system. |
| 1 | Imperial system. |  |
