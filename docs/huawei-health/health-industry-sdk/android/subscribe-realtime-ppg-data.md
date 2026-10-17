<!--
  Title: Subscribing to Real-Time PPG Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-realtime-ppg-data-0000002376715133
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-realtime-ppg-data-0000002376715133
-->
# Subscribing to Real-Time PPG Data

This section describes how to subscribe to and unsubscribe from the real-time photoplethysmography (PPG) data of a connected wearable.

> **Note:** When subscribing to PPG data, industry apps occupy a large number of resources and may be killed by the Android system if the apps are switched to the background. Make sure to keep the apps alive or keep them running in the foreground. Simultaneous data subscriptions for multiple wearables are not allowed. If a data (ACC, GYRO, or PPG data) subscription is active for one wearable, no other wearable can be subscribed. [Smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) support this API only when connected in [auto mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536#EN-US_TOPIC_0000002678163965__li132048191618). Once the wearable is removed or disconnected, data reporting automatically stops. To obtain real-time data again, restore the connection, cancel the previous subscription, and subscribe to the data again.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the real-time PPG data. 
```cpp
{
    "item":"realtimePpgData"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the PPG data of the wearable. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the real-time PPG data.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "realtimePpgData");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the real-time PPG data.
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
| statusCode | 0, 1, 2, 3, 6, 7, 8, 300, 301, 302, 303 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned, and then the real-time PPG data is returned. If the API call fails, an error message is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and real-time PPG data update events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. When real-time PPG data is generated, **statusCode** is **8**, and the PPG data timestamp and data of three channels are returned in **result**. 
```cpp
result example:
{
  "timeStamp": 1678695182449,
  "ppg": [
    {
      "channel": 3,
      "data": "[1783458.0, 1784041.0, 1785281.0, 1786011.0, 1786193.0, 1787470.0, 1787981.0, 1788455.0, 1789367.0, 1790279.0]"
    },
    {
      "channel": 5,
      "data": "[6.192854E7, 6.1930292E7, 6.1930364E7, 6.1932624E7, 6.1934888E7, 6.193496E7, 6.1938536E7, 6.1939048E7, 6.1941452E7, 6.1940724E7]"
    },
    {
      "channel": 7,
      "data": "[6.4321564E7, 6.4323048E7, 6.4324736E7, 6.4326144E7, 6.4327128E7, 6.4328132E7, 6.4329588E7, 6.4331264E7, 6.4332924E7, 6.4334696E7]"
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timeStamp | UTC timestamp, in milliseconds | PPG data time point. |
| ppg | A JSON array of objects with the **channel** and **data** fields | PPG data, including data of three channels. |
| channel | Data of the int type | Three types of data channels, with **3**, **5**, and **7** corresponding to the GREEN, RED, and IR channels, respectively. |
| data | Data of the float[] type | Specific PPG data of each channel. |
 > **Note:** The PPG sensor collects data at an interval of 10 milliseconds, and reports data at an interval of approximately 100 milliseconds. There are three channels of data (GREEN, RED, and IR), and each channel reports 10 floating-point numbers. The volume of reported data is not fixed. The example provided represents typical cases, but the actual reporting interval and data volume may vary depending on the device.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the real-time PPG data when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the real-time PPG data.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
