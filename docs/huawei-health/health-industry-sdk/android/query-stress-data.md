<!--
  Title: Querying Stress Data
  Catalog: huaweihealth-Guides
  Document ID: query-stress-data-0000002383788218
  Updated: 2026-08-05 02:10:30
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-stress-data-0000002383788218
-->
# Querying Stress Data

This section describes how to query the stress data from a wearable. After a user tests their stress, industry apps can call the corresponding API to query the stress data recorded on the wearable.

> **Note:** This API is restricted to wearables that support Emotional wellbeing detection. Currently, HUAWEI WATCH H9D20, HUAWEI WATCH H3540, and HUAWEI WATCH H7556 are supported. Before querying stress data, ensure that the automatic stress test switch has been enabled through the API for [setting the automatic stress test switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-stress-auto-monitor-switch-0000002417316317) and the wearable is worn for more than 30 minutes within the query time frame. Concurrent query of stress data is not supported. You must wait for the previous query to complete before initiating a new one.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying stress data. 
```cpp
{
  "item": "stressData",
  "value": {
    "startTime": 1725193422, // Unit: second
    "endTime": 1725452622 // Unit: second
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying stress data. |
| endTime | UTC timestamp, in seconds | End time for querying stress data. |
 > **Note:** The interval between the query start time and the current time should be no more than 7 days.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query stress data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying stress data.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1725193422);
    valueObject.put("endTime", 1725452622);
    jsonObject.put("item", "stressData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query stress data.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, stress data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The stress data is carried in **result** when the query is successful. 
```cpp
Example data:
{
  "stressData": [
    {
      "stressStartTime": 1680492389,
      "stressEndTime": 1680492445,
      "stressScore": 66,
      "stressGrade": 3
    },
    {
      "stressStartTime": 1680500187,
      "stressEndTime": 1680500244,
      "stressScore": 43,
      "stressGrade": 2
    },
    ...
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| stressData | - | Stress data type. |
| stressStartTime | Data of the long type | Start time (UTC timestamp in seconds). |
| stressEndTime | Data of the long type | End time (UTC timestamp in seconds). |
| stressScore | Data of the int type | Stress score. • 80–99: high • 60–79: medium • 30–59: normal • 1–29: relaxed |
| stressGrade | Data of the int type | Stress level. • **1**: relaxed • **2**: normal • **3**: medium • **4**: high |
