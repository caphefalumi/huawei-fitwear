<!--
  Title: Subscribing to Real-Time GYRO Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-realtime-gyro-data-0000002342597346
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-realtime-gyro-data-0000002342597346
-->
# Subscribing to Real-Time GYRO Data

This section describes how to subscribe to and unsubscribe from the real-time gyroscope (GYRO) data of a connected wearable.

> **Note:** When subscribing to GYRO data, industry apps occupy a large number of resources and may be killed by the Android system if the apps are switched to the background. Make sure to keep the apps alive or keep them running in the foreground. Simultaneous data subscriptions for multiple wearables are not allowed. If a data (ACC, GYRO, or PPG data) subscription is active for one wearable, no other wearable can be subscribed. [Smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) support this API only when connected in [auto mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536#EN-US_TOPIC_0000002678163965__li132048191618). Once the wearable is disconnected, data reporting automatically stops. To obtain real-time data again, restore the connection, cancel the previous subscription, and subscribe to the data again.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the real-time GYRO data. 
```cpp
{
    "item":"realtimeGyroData"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the GYRO data of the wearable. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the real-time GYRO data.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "realtimeGyroData");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the real-time GYRO data.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
};
manageClient.subscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 8, 300, 301, 302 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned, and then the GYRO data is returned. If the API call fails, an error message is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and real-time GYRO data update events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When real-time GYRO data is generated, **statusCode** is **8**, and the GYRO data timestamp and the specific floating-point data are returned in **result**. 
```cpp
result example:
{
    "timeStamp":1678695232030,
    "gyro":"[-10.0, -19.0, 5.0, -13.0, -19.0, 1.0, -12.0, -16.0, 3.0, -14.0, -10.0, 1.0, -13.0, -2.0, 0.0, -15.0, 6.0, 0.0, -17.0, 12.0, 0.0, -19.0, 18.0, 0.0, -18.0, 20.0, -1.0, -18.0, 17.0, 0.0]"
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timeStamp | UTC timestamp, in milliseconds | GYRO data time point. |
| gyro | Data of the float[] type | GYRO data, with a total of 30 floating-point numbers. The unit is 70 mdps/LSB. |
 > **Note:** The GYRO sensor collects data at an interval of 10 ms, and reports data at an interval of approximately 100 ms. Ten groups of data are reported at a time. Each group contains three pieces of data, indicating the angular velocity along the x, y, and z axes, respectively. The volume of reported data is not fixed. The example provided represents typical cases, but the actual reporting interval and data volume may vary depending on the device.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the real-time GYRO data when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the real-time GYRO data.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
