<!--
  Title: Querying Data of a Single Workout
  Catalog: huaweihealth-Guides
  Document ID: query-workout-data-0000002342516602
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-workout-data-0000002342516602
-->
# Querying Data of a Single Workout

This section describes how to query data of a single workout from a wearable. After a user completes a workout while wearing a wearable with the Workout app launched and a workout record is generated, industry apps can call the corresponding API to query the workout data recorded on the wearable.

> **Note:** To successfully retrieve data of a single workout, it is recommended that one or more workouts be completed and workout records be generated within the query time frame. Otherwise, the wearable may return empty data. Concurrent query of single-workout data is not supported. You must wait for the previous query to complete before initiating a new one. This API can be used together with the API for [subscribing to data updates of a single workout](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-workout-update-event-0000002376514421). When a single-workout data update event is reported, you can call this API to query data of the workout.

- Import required modules.
- Call the [getDeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section17822141183313) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object.
- Call the [getDevices](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1558035984613) method of the [DeviceManager](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section2045012381872) object to obtain the wearable list.
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section535119272598) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section4106204316283) object to query data of a single workout. 
```cpp
// Import required modules.
import {IndustryService, industryServiceClient} from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Obtain the DeviceManager object through industryServiceClient, and then obtain the Device object through the DeviceManager object.
industryServiceClient.getDeviceManager(getContext(this)).getDevices().then(devices => devices?.[0])
  .then((device: IndustryService.Device) => {
    // Construct parameters for querying single-workout data.
    let queryParam: IndustryService.QueryOptions = {
      type: IndustryService.DataType.WORKOUT,
      startTime: 1740195486,
      endTime: 1740206286
    }
    // Call the queryHistoryData method of the Device object to query data of a single workout.
    device.queryHistoryData(queryParam).then((result: IndustryService.HistoryData[]) => {
      // Output the returned single-workout data if the query is successful.
      console.info(`Succeeded in querying workout, result: ${JSON.stringify(result)}`);
    }).catch((err: BusinessError) => {
      // Output error information if the query fails.
      console.error(`Failed to query workout. Code is ${err.code}, message is ${err.message}.`);
    });
  }).catch((err: BusinessError) => {
  // Output error information if the wearable list fails to be obtained.
  console.error(`Failed to get devices. Code is ${err.code}, message is ${err.message}.`);
});
```
 > **Note:** Parameter requirements of the API for querying data of a single workout: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and end time must not exceed 24 hours. If the query succeeds, the API returns IndustryService.[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1335151184716)[] when single-workout data exists, or an empty array **[]** when no single-workout data is available. If the query fails, the API throws **BusinessError**. Example of the single-workout data returned if the query is successful: 
```cpp
[{
  "startTime": 1736581230,
  "endTime": 1736581372,
  "type": "workout",
  "fields": {
    "workoutRecordId": 29,
    "startTime": 1736581230,
    "endTime": 1736581372,
    "workoutType": 7,
    "accumulativeDropHeight": 0,
    "highestAltitude": 68,
    "lowestAltitude": 51,
    "workoutHrABSPeakMax": 0,
    "workoutHrABSPeakMin": 0,
    "workoutClimb": 0,
    "workoutEtrainingEffect": 0,
    "workoutMaxMET": 0,
    "workoutRecoveryTime": 0,
    "workoutExerciseDuration": 139,
    "workoutLoadPeak": 0,
    "workoutRecordCalorie": 15,
    "workoutRecordDistance": 240,
    "workoutRecordSpeed": "6.22",
    "workoutRecordTotalTime": 139,
    "workoutRecordStep": 224,
    "workoutSkipNum": 224,
    "workoutAvgStepRate": 96,
    "workoutAvgCadence": 48,
    "workoutPaddles": 224,
    "workoutPaddlesAvgFrequency": 96,
    "pace": [
      {
        "distance": 0,
        "unitType": 0,
        "pace": 579,
        "lastLessDistance": 2400
      },
      {
        "distance": 0,
        "unitType": 1,
        "pace": 931,
        "lastLessDistance": 2400
      }
    ],
    "swimSections": []
  }
},...
]
```
 
| Data Category | Parameter | Type | Unit | Description |
| --- | --- | --- | --- | --- |
| Detailed data | fields | object | - | Object that contains data of a single workout. |
| General data | workoutRecordId | number | - | Single workout record ID. |
| startTime | number | Second | Workout start time (UTC time). |  |
| endTime | number | Second | Workout end time (UTC time). |  |
| workoutType | number | - | Workout type. For details, please refer to [Single Workout Type](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/workout-type-enumeration-0000002381615405). |  |
| workoutHrABSpeakMax | number | beats/min | Maximum heart rate. |  |
| workoutHrABSPeakMin | number | beats/min | Minimum heart rate. |  |
| workoutClimb | number | Decimeter | Total ascent. |  |
| workoutEtrainingEffect | number | - | Training effect. |  |
| workoutMaxMET | number | ml/kg/min | Maximum oxygen uptake. |  |
| workoutRecoveryTime | number | Minute | Full recovery duration. |  |
| workoutExerciseDuration | number | Second | Workout duration. |  |
| workoutLoadPeak | number | - | Workout load. |  |
| workoutRecordCalorie | number | kcal | Calories burned. |  |
| workoutRecordDistance | number | Meter | Distance. |  |
| workoutRecordSpeed | string | km/h | Average speed. |  |
| workoutRecordTotalTime | number | Second | Total duration. |  |
| workoutRecordStep | number | Steps | Step count. |  |
| accumulativeDropHeight | number | Decimeter | Total descent. |  |
| highestAltitude | number | Decimeter | Maximum altitude. |  |
| lowestAltitude | number | Decimeter | Minimum altitude. |  |
| Rope jumping data | workoutSkipNum | number | - | Number of rope jumps. |
| workoutLongestStreak | number | - | Maximum number of consecutive jumps. |  |
| workoutTripped | number | - | Number of times the rope was caught or tripped over. |  |
| Swimming data Pool swimming and open water swimming | workoutSwimStrokeType | number | - | Main swimming stroke type. • **1**: breaststroke • **2**: freestyle • **3**: butterfly • **4**: backstroke • **5**: medley |
| workoutSwimPullTimes | number | - | Stroke count. |  |
| workoutSwimPoolLength | number | Centimeter | Swimming pool length. |  |
| workoutSwimTripTimes | number | - | Swimming lap count. |  |
| workoutSwimAvgSwolf | number | - | Average SWOLF. |  |
| workoutSwimPullRate | number | times/min | Stroke rate. |  |
| Elliptical trainer data | workoutAvgCadence | number | Rotations/min | Average cadence. |
| workoutAvgStepRate | number | Steps/min | Average step rate. |  |
| Rowing machine data | workoutPaddles | number | - | Stroke count. |
| workoutPaddlesAvgFrequency | number | times/min | Average stroke rate. |  |
| Pace split data | pace | number | s/km s/mi | Pace, in s/km or s/mi. The pace unit depends on the unit system: seconds per kilometer (s/km) for metrics and seconds per mile (s/mi) for imperial. |
| distance | number | km or mi | Kilometer/mile index, starting from 0. The unit depends on the unit system: kilometers (km) for metrics and miles (mi) for imperial. |  |
| unitType | number | - | Unit system. • **0**: metric system • **1**: imperial system |  |
| pointIndex | number | - | Total number of GPS points from the start of the workout to the end of the pace calculation point. |  |
| lastLessDistance | number | Decimeter | Final remaining distance less than a full kilometer/mile. |  |
| Swimming split data | sectionIndex | number | - | Split index. The value starts from 1. |
| distance | number | Meter or yard | Split distance. The unit depends on the unit system: meter for metrics and yard for imperial. |  |
| unitType | number | - | Split unit. • **0**: metric system • **1**: imperial system |  |
| duration | number | Second | Split duration. |  |
| pace | number | - | Split pace, which is the average pace of a split. The unit depends on the unit system: seconds per 100 meters for metrics and seconds per 100 yards for imperial. |  |
| pullTimes | number | - | Stoke count within a split. |  |
| strokeType | number | - | Main swimming stroke within a split. • **1**: breaststroke • **2**: freestyle • **3**: butterfly • **4**: backstroke • **5**: medley |  |
| avgSwolf | number | - | Average SWOLF, which is the sum of the time taken (in seconds) and the number of strokes per pool length. |  |
 > **Note:** When querying data of a single workout, you should retrieve only the data corresponding to this workout type. Any unrelated data is considered invalid.
