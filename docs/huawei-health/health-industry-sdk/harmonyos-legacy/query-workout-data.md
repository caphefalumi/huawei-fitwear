<!--
  Title: Querying Data of a Single Workout
  Catalog: huaweihealth-Guides
  Document ID: query-workout-data-0000002413832964
  Updated: 2026-08-05 02:10:11
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-workout-data-0000002413832964
-->
# Querying Data of a Single Workout

This section describes how to query data of a single workout from a wearable. After a user completes a workout while wearing a wearable with the Workout app launched and a workout record is generated, industry apps can call the corresponding API to query the workout data recorded on the wearable.

> **Note:** Concurrent query of single-workout data is not supported. You must wait for the previous query to complete before initiating a new one. This API can be used together with the API for [subscribing to data updates of a single workout](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-workout-update-event-0000002414072668). When a single-workout data update event is reported, you can call this API to query data of the workout.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for querying data of a single workout. 
```cpp
{
    "item": "workoutData",
    "value": {
        "startTime": 1992342222, // Unit: second
        "endTime": 1992342229 // Unit: second
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Start time for querying data of a single workout. |
| endTime | UTC timestamp, in seconds | End time for querying data of a single workout. Note: The time interval between the start time and end time must be no more than 24 hours. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#EN-US_TOPIC_0000002678004135__getServiceClient-android_content_Context-) method to query data of a single workout. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for querying data of a single workout.
ZSONObject zsonObject = new ZSONObject();
try {
    ZSONObject valueObject= new ZSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    zsonObject.put("item", "workoutData");
    zsonObject.put("value", valueObject);
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the query method to query data of a single workout.
deviceManageClient.query(zsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 6, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, single-workout data is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. If the query succeeds, **data** contains single-workout data. 
```cpp
data example:
{
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [{
        "workoutRecordId": 1,
        "startTime": 1646806879,
        "endTime": 1646806952,
        "workoutType": 2,
        "accumulativeDropHeight": -1,
        "highestAltitude": -1,
        "lowestAltitude": -1,
        "workoutHrABSPeakMax": 114,
        "workoutHrABSPeakMin": 86,
        "workoutClimb": 0,
        "workoutEtrainingEffect": 0,
        "workoutMaxMET": 48,
        "workoutRecoveryTime": 0,
        "workoutExerciseDuration": 69,
        "workoutLoadPeak": 0,
        "workoutRecordCalorie": 7,
        "workoutRecordDistance": 150,
        "workoutRecordSpeed": "7.83",
        "workoutRecordTotalTime": 69,
        "workoutRecordStep": 133,
        "pace": [{
            "distance": 0,
            "unitType": 0,
            "pace": 460,
            "pointIndex": 0,
            "lastLessDistance": 150
        }, {
            "distance": 0,
            "unitType": 1,
            "pace": 740,
            "pointIndex": 0,
            "lastLessDistance": 150
        }]
    }]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataList | - | Data list. Fields vary depending on the data type. |
| workoutRecordId | Data of the int type | Single workout record ID. |
| startTime | UTC time, in seconds | Workout start time, in seconds. |
| endTime | UTC time, in seconds | Workout end time, in seconds. |
| workoutType | • **1**: outdoor running • **2**: outdoor walking • **3**: outdoor cycling • **4**: indoor running (on a treadmill) • **5**: indoor cycling • **255**: other | Workout type. |
| workoutHrABSPeakMax | Data of the int type | Maximum heart rate (beats/min). |
| workoutHrABSPeakMin | Data of the int type | Minimum heart rate (beats/min). |
| workoutClimb | Data of the long type | Total ascent, in decimeters. (This parameter is supported only on watches.) |
| workoutEtrainingEffect | Data of the long type | Training effect. |
| workoutMaxMET | Data of the long type | Maximum oxygen uptake (ml/kg/min). |
| workoutRecoveryTime | Data of the int type | Recovery time, in minutes. |
| workoutExerciseDuration | Data of the long type | Workout duration, in seconds. |
| workoutLoadPeak | Data of the long type | Workout load. |
| workoutRecordCalorie | Data of the long type | Calories burned (kcal). |
| workoutRecordDistance | Data of the long type | Distance, in meters. |
| workoutRecordSpeed | Data of the String type | Average speed (km/h). |
| workoutRecordTotalTime | Data of the long type | Total duration, in seconds. |
| workoutRecordStep | Data of the long type | Step count. |
| accumulativeDropHeight | Data of the long type | Total descent, in decimeters. (This parameter is supported only on watches.) |
| highestAltitude | Data of the long type | Highest altitude, in decimeters. (This parameter is supported only on watches.) |
| lowestAltitude | Data of the long type | Lowest altitude, in decimeters. (This parameter is supported only on watches.) |
| pace | Data of the int type | Pace (s/km or s/mi). |
| distance | Data of the long type | Number of kilometers/miles. The count starts from 0. |
| unitType | Data of the int type | Unit system. • **0**: metric system • **1**: imperial system |
| pointIndex | Data of the int type | Total number of GPS points from the start of the workout to the end of the pace calculation point. |
| lastLessDistance | Data of the long type | Final remaining distance less than a full kilometer/mile, in meters. |
 > **Note:** If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
