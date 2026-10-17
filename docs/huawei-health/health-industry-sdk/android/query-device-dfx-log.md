<!--
  Title: Obtaining Wearable Logs
  Catalog: huaweihealth-Guides
  Document ID: query-device-dfx-log-0000002418288389
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-device-dfx-log-0000002418288389
-->
# Obtaining Wearable Logs

The corresponding API can be used to collect wearable logs to assist in troubleshooting or development.

> **Note:** This API can only be used to collect logs of [lite wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li1184517579555) and [smart bands](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li19369195911148). Once logs are collected, they are compressed into a .zip package and stored in a designated directory (the path is returned by the API). The collected wearable logs are encrypted and must be decrypted for viewing. This API supports only one collection task at a time. If a task is in progress, the API returns error code **11** when another request is initiated.

- Before each collection, this API checks the directory for log files older than seven days and deletes any that are found.
- Once all the wearable logs of a specified period are obtained through this API, these logs will then be removed from the wearable.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for obtaining wearable logs. 
```cpp
{
    "item": "dfxLog"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to obtain wearable logs. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for obtaining wearable logs.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "dfxLog");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to obtain wearable logs.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 4, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the log obtaining progress and result are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The log obtaining progress and result are carried in **result** when the API call succeeds. 
```cpp
result example:
{
    "progress": 10,   
    "logPath": ""
}
{
    "progress": 100,   
    "logPath":"\/data\/user\/0\/com.huawei.health.industry.demo\/files\/Luca-B102B_5.0.0.209(C00M04log)_20250715194952_Wearable.zip"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| progress | Data of the int type | Log collection progress, which is updated every 5 seconds. |
| logPath | Data of the String type | Log file path returned when the log collection progress reaches 100%. |
