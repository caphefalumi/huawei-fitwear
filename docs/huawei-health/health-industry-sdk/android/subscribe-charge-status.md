<!--
  Title: Subscribing to the Device Charging Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-charge-status-0000002342757078
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-charge-status-0000002342757078
-->
# Subscribing to the Device Charging Status

This section describes how to subscribe to and unsubscribe from the charging status of a wearable. Following a successful subscription, the current charging status is returned when the charging status of a wearable changes. After unsubscription, the charging status is no longer returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the device charging status. 
```cpp
{
    "item":"chargeStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the device charging status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the device charging status.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "chargeStatus");
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the device charging status.
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
| statusCode | 0, 2, 3, 4, 5, 6, 7, 8 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. If the device charging status changes, the charging status is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and device charging status changes in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **result** is an empty string. If the subscription fails, **statusCode** is an error code and **result** is the corresponding error information. If the device charging status changes, **statusCode** is **8** and the current charging status is returned in **result**. 
```cpp
result example:
{
    "chargeStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| chargeStatus | 1 | Charging started. |
| 2 | Charging stopped. |  |
| 3 | Fully charged. |  |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the device charging status when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the charging status.
// Note: serviceCallback is the object declared in step 4, and jsonObject is the one used for subscription.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
