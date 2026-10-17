<!--
  Title: Querying the Heart Rate Zones
  Catalog: huaweihealth-Guides
  Document ID: query-heart-rate-interval-0000002338141048
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-heart-rate-interval-0000002338141048
-->
# Querying the Heart Rate Zones

This section describes how to query the heart rate zones on a wearable. If no heart rate configuration API has been called earlier (to set the basic user information, maximum workout heart rate, or heart rate zones), result code **9** will be returned for the heart rate zone query.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the heart rate zones. 
```cpp
{
    "item": "heartRateInterval"
}
```

- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query the heart rate zones. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the heart rate zones.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "heartRateInterval");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the heart rate zones.
manageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 9 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the heart rate zones are returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query is successful, the returned **result** contains the **heartRateInterval** parameter, which is an integer array consisting of six integers in descending order. The integers represent the following heart rates in sequence: maximum heart rate (also the upper limit of the extreme heart rate), lower limit of the extreme heart rate (also the upper limit of the anaerobic heart rate), lower limit of the anaerobic heart rate (also the upper limit of the aerobic heart rate), lower limit of the aerobic heart rate (also the upper limit of the fat-burning heart rate), lower limit of the fat-burning heart rate (also the upper limit of the warm-up heart rate), and lower limit of the warm-up heart rate. 
```cpp
result example:
{
    "heartRateInterval":[110,100,90,80,70,60]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| heartRatelnterval | For details, please refer to the options of **settingValue** in [Setting Heart Rate Zones](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-heart-rate-interval-0000002372259061). | Heart rate zones. |
