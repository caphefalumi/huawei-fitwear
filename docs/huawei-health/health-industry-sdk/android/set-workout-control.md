<!--
  Title: Setting Workout Linkage
  Catalog: huaweihealth-Guides
  Document ID: set-workout-control-0000002338300792
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-workout-control-0000002338300792
-->
# Setting Workout Linkage

This section describes how to set workout linkage with a wearable in your industry app, so the user can pause, resume, and end a workout either in your app or on their wearable. Before setting workout linkage, ensure that the wearable is properly worn. You can use this API together with the API for [subscribing to workout linkage data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-realtime-workout-data-0000002342757102) to obtain real-time linkage data.

> **Note:** To use the workout linkage capability, your app requires the Bluetooth and location permissions on the paired terminal device. For details, please refer to [Adding Permissions](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-permission-0000002338138528). If your app is restarted, certain wearables will not automatically stop workout linkage, which affects the use of the linkage control function. It is recommended that you manually stop linkage on the wearable before using the workout linkage control function again.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting workout linkage. 
```cpp
{
    "settingKey": "workoutControl",
    "settingValue": {
        "workoutType": 1,
        "operateType": 1,
        "operationTime": 1644823557
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | workoutControl | Key of workout linkage. |
| settingValue | Fields included: **workoutType**, **operateType**, and **operationTime** | Workout linkage content. |
| workoutType | • **1**: outdoor running • **2**: outdoor walking • **3**: outdoor cycling • **4**: indoor running (on a treadmill) • **5**: indoor cycling • **255**: other | Workout type. |
| operateType | • **1**: start a workout • **2**: pause a workout • **3**: resume a workout • **4**: end a workout | Operation type. |
| operationTime | UTC time, in seconds. The value is of the long type and indicates the current time (**System.currentTimeMillis()/1000**). | Operation time. Ensure that the time on the paired terminal device is the same as that on the wearable. If the time difference exceeds 5s, a timeout error will be reported. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set workout linkage. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting workout linkage.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "workoutControl");
    JSONObject valueObject = new JSONObject();
    valueObject.put("workoutType", 1);
    valueObject.put("operateType", 1);
    valueObject.put("operationTime", System.currentTimeMillis() / 1000);
    jsonObject.put("settingValue", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set workout linkage.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11, 26 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
 If a user starts a workout in your app and then pauses, resumes, or ends the workout on their wearable, data including **statusCode** and **result** will be reported by the wearable to your app. 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0 | Success. |
| result | Fields included: **workoutType**, **operateType**, and **operationTime** | Workout linkage content reported by the wearable. |
| workoutType | • **1**: outdoor running • **2**: outdoor walking • **3**: outdoor cycling • **4**: indoor running (on a treadmill) • **5**: indoor cycling • **255**: other | Current workout type. |
| operateType | • **2**: pause a workout • **3**: resume a workout • **4**: end a workout | Operation type. |
| operationTime | UTC timestamp, in seconds | Operation time. |
 Example data reported by a wearable: 
```cpp
{
    "workoutType": 4,
    "operateType": 2,
    "operationTime": 1645000795
}
```
