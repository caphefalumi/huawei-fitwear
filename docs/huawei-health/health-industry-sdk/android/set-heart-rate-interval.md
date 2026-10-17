<!--
  Title: Setting Heart Rate Zones
  Catalog: huaweihealth-Guides
  Document ID: set-heart-rate-interval-0000002372259061
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-heart-rate-interval-0000002372259061
-->
# Setting Heart Rate Zones

This section describes how to set workout heart rate zones for a wearable. During workout, the wearable determines the current heart rate zone based on the user's actual heart rate and displays the corresponding workout status.

> **Note:** The heart rate zones are comprised of six descending heart rate values (unit: beats/min), which represent the maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone, respectively. These six heart rate values together define five heart rate zones, corresponding to the following workout statuses: extreme, anaerobic endurance, aerobic endurance, fat-burning, and warm-up. Once the heart rate zones are set, the maximum workout heart rate (the first heart rate value of the heart rate zones) is automatically synchronized to the device. Heart rates you set by calling this API and those set in [Setting the Maximum Workout Heart Rate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-max-heart-rate-0000002372218949) will override each other, and the latest ones prevail.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the heart rate zones. 
```cpp
{
    "settingKey": "heartRateInterval",
    "settingValue": [210,180,150,120,90,70]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | heartRateInterval | Key of heart rate zones. |
| settingValue | Array of six integers in descending order | Heart rate zone values. |
 > **Note:** The value of **settingValue** is an array with six integers in descending order, respectively indicating the maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone. Heart rate zone value setting rules: Maximum heart rate > lower limit of extreme zone > lower limit of anaerobic zone > lower limit of aerobic zone > lower limit of fat-burning zone > lower limit of warm-up zone Each heart rate zone value must fall within the range of 30% of the maximum heart rate to the maximum heart rate. The valid range of the maximum heart rate is [100, 220].
- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the heart rate zones. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the heart rate zones.
JSONObject jsonObject = new JSONObject();
try {
    JSONArray intervalArray = new JSONArray();
    intervalArray.put(210);
    intervalArray.put(180);
    intervalArray.put(150);
    intervalArray.put(120);
    intervalArray.put(90);
    intervalArray.put(70);
    jsonObject.put("settingKey", "heartRateInterval");
    jsonObject.put("settingValue", intervalArray);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the heart rate zones.
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
