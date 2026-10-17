<!--
  Title: Subscribing to Workout Linkage Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-realtime-workout-data-0000002342757102
  Updated: 2026-08-05 02:10:28
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-realtime-workout-data-0000002342757102
-->
# Subscribing to Workout Linkage Data

This section describes how to subscribe to and unsubscribe from workout linkage data on a wearable. Your app can enable workout linkage multiple times with one subscription. Following a successful subscription, the wearable reports real-time workout data once every second during the linkage, and reports the final statistics data after the linkage ends. After unsubscription, workout linkage data is no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from workout linkage data. 
```cpp
{
    "item": "realtimeWorkoutData"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to workout linkage data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Construct input data in JSON format for subscribing to or unsubscribing from workout linkage data.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("item", "realtimeWorkoutData");
} catch (JSONException e) {
    e.printStackTrace();
}
String json = jsonObject.toString();
// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Call the subscribe method to subscribe to workout linkage data.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
};
manageClient.subscribe(deviceId, json, serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 8, 26 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. After [workout linkage is enabled](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-workout-control-0000002338300792), workout information is returned every second. |
 Example of workout data returned during workout linkage: 
```cpp
{
    "reportType": "inProgress",
    "reportData": {
        "timeStamp": 1644979034,
        "heartRate": 83,
        "calorie": 2000,
        "step": 130
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timeStamp | Data of the long type | UTC time when data is generated, in seconds. |
| heartRate | Data of the int type | Heart rate. |
| calorie | Data of the long type | Calories burned (cal). |
| step | Data of the long type | Step count. |
 > **Note:** Once workout linkage is enabled, the heart rate data (**heartRate**) of the first 10 seconds may be reported as 0. This is normal. Callback when workout linkage ends: 
```cpp
{
  "reportType": "finished",
  "reportData": {
    "workoutRecordId": 8,
    "startTime": 1644823544,
    "endTime": 0,
    "workoutType": 1,
    "workoutHrABSpeakMax": 129,
    "workoutHrABSPeakMin": 100,
    "workoutClimb": 14,
    "workoutEtrainingEffect": 0,
    "workoutMaxMET": 0,
    "workoutRecoveryTime": 0,
    "workoutExerciseDuration": 0,
    "workoutLoadPeak": 0,
    "workoutRecordCalorie": 6000,
    "workoutRecordDistance": 0,
    "workoutRecordSpeed": 0,
    "workoutRecordTotalTime": 0,
    "workoutRecordStep": 315
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| workoutRecordId | Data of the int type | Single workout record ID. |
| startTime | Data of the long type | Workout start time. |
| endTime | Data of the long type | Workout end time. |
| workoutType | Data of the int type | Workout type. • **1**: outdoor running • **2**: outdoor walking • **3**: outdoor cycling • **4**: indoor running (on a treadmill) • **5**: indoor cycling • **255**: other |
| workoutHrABSpeakMax | Data of the int type | Maximum heart rate. |
| workoutHrABSPeakMin | Data of the int type | Minimum heart rate. |
| workoutClimb | Data of the long type | Total ascent, in decimeters. (This parameter is supported only on watches.) |
| workoutEtrainingEffect | Data of the long type | Workout effect. |
| workoutMaxMET | Data of the long type | Maximum oxygen uptake (value reported × 3.5/65536, in ml/kg/min). |
| workoutRecoveryTime | Data of the int type | Recovery time, in minutes. |
| workoutExerciseDuration | Data of the long type | Workout duration, in seconds For example, duration of a workout course, diving, and apnea training. |
| workoutLoadPeak | Data of the long type | Workout load. |
| workoutRecordCalorie | Data of the long type | Calories burned (cal). |
| workoutRecordDistance | Data of the long type | Distance. |
| workoutRecordSpeed | Data of the int type | Average speed. |
| workoutRecordTotalTime | Data of the long type | Total duration. |
| workoutRecordStep | Data of the long type | Step count. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from workout linkage data. After the unsubscription, the wearable will stop reporting data to your app. 
```cpp
// Call the unSubscribe method to unsubscribe from workout linkage data.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
