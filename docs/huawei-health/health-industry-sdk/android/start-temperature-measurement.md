<!--
  Title: Starting Body Temperature Measurement
  Catalog: huaweihealth-Guides
  Document ID: start-temperature-measurement-0000002342616972
  Updated: 2026-08-05 02:10:12
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/start-temperature-measurement-0000002342616972
-->
# Starting Body Temperature Measurement

A wearable provides the body temperature measurement capability. Industry apps can call the corresponding API to remotely start the body temperature measurement app on the wearable.

> **Note:** This API is restricted to industry wearables that support remote body temperature measurement launch. Currently, HUAWEI WATCH H5546, HUAWEI WATCH H7546, HUAWEI WATCH H7556, HUAWEI WATCH H5556, HUAWEI WATCH H5756, and HUAWEI WATCH H9D20 are supported. The maximum wait time for a single measurement is 5 minutes. A timeout status code is returned if the user does not measure within 5 minutes or starts measurement when the wearable is disconnected. If a new SpO2 or body temperature measurement is initiated during the waiting period, a service conflict status code will be returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for remotely starting body temperature measurement. 
```cpp
{
    "item": "temperatureMeasure"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| item | temperatureMeasure | Starting body temperature measurement remotely. |

- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__send-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to remotely start body temperature measurement on the wearable. 
```cpp
// Step 1 Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Step 2 Obtain the list of paired wearables by referring to Obtaining the Wearable List. Then, select a target wearable from the list and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Step 3 Create a JSON object for remotely starting body temperature measurement.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "temperatureMeasure");
} catch (JSONException e) {
    e.printStackTrace();
}

// Step 4 Call the send method to remotely start body temperature measurement on the wearable.
deviceManageClient.send(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 30, 401, 402, 403, 404, 405, 406, 407, 408, 409 | Result code of the API call. For details, please refer to the universal result codes and device control and device event status codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
