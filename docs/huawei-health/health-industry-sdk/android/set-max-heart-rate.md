<!--
  Title: Setting the Maximum Workout Heart Rate
  Catalog: huaweihealth-Guides
  Document ID: set-max-heart-rate-0000002372218949
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-max-heart-rate-0000002372218949
-->
# Setting the Maximum Workout Heart Rate

This section describes how to set the maximum heart rate (beats/min) on a wearable during workout. Heart rate zones will be automatically generated when the maximum workout heart rate is configured. When a user wears a wearable for workout, the wearable automatically identifies the workout intensity.

> **Note:** After you set the maximum workout heart rate, heart rate zones will be automatically generated, and the heart rates constituting these zones are respectively 100%, 90%, 80%, 70%, 60%, and 50% of the maximum workout heart rate (decimals rounded off). Heart rates you set by calling this API and those set in [Setting Heart Rate Zones](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-heart-rate-interval-0000002372259061) will override each other, and the latest ones prevail.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the maximum workout heart rate. 
```cpp
{
    "settingKey": "maxHeartRate",
    "settingValue": 180
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | maxHeartRate | Key of the maximum workout heart rate. |
| settingValue | Integer ranging from max(100, (220 - age) × 85%) to min(220, (220 - age) × 115%) | Maximum workout heart rate. |
 > **Note:** Maximum workout heart rate range: max(100, (220 - age) × 85%) to min(220, (220 - age) × 115%) **age** indicates the user age, which is calculated based on the basic user information. If no basic user information is available, the default value of **age** is **18**. **max(***a***, ***b***)** returns the maximum value between *a* and *b*, and **min(***a***, ***b***)** returns the minimum value between *a* and *b*.
- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the maximum workout heart rate. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the maximum workout heart rate.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "maxHeartRate");
    jsonObject.put("settingValue", 180);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the maximum workout heart rate.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 2, 3, 4, 5, 6, 7 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
