<!--
  Title: Querying Data of a Single Workout
  Catalog: huaweihealth-Guides
  Document ID: query-workout-data-0000002342714348
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-workout-data-0000002342714348
-->
# Querying Data of a Single Workout

This section describes how to query data of a single workout. Wearables support multiple workout types. After a user completes a workout while wearing a wearable with the Workout app launched and a workout record is generated, industry apps can call the corresponding API to query the workout data recorded on the wearable.

> **Note:** Concurrent query of single-workout data is not supported. You must wait for the previous query to complete before initiating a new one. This API can be used together with the API for [subscribing to data updates of a single workout](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-workout-update-event-0000002342597322). When a single-workout data update event is reported, you can call this API to query data of the workout.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying data of a single workout. 
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
| (Optional) subscribeId | Subscription ID returned by the API for [subscribing to data updates of a single workout](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-workout-update-event-0000002342597322) | Subscription ID. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours. If **subscribeId** is left empty or set to an empty string, data in the time range specified by **startTime** and **endTime** will be queried; if **subscribeId** is set to a valid value, the intersection of the time range specified by the subscription duration (accurate to minutes, for example, **0900**) corresponding to **subscribeId** and that specified by **startTime** and **endTime** will be used for query. If no such intersection exists, the query fails.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to query data of a single workout. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying data of a single workout.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1992342222);
    valueObject.put("endTime", 1992342229);
    jsonObject.put("item", "workoutData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query data of a single workout.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 11 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, data of the single workout is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The data of the single workout is carried in **result** when the query is successful. 
```cpp
result example 1:
{
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [
        {
            "workoutRecordId": 2,
            "startTime": 1722246954,
            "endTime": 1722248741,
            "workoutType": 1,
            "accumulativeDropHeight": -1,
            "highestAltitude": -1,
            "lowestAltitude": -1,
            "workoutHrABSPeakMax": 163,
            "workoutHrABSPeakMin": 86,
            "workoutClimb": 0,
            "workoutEtrainingEffect": 21,
            "workoutMaxMET": 47,
            "workoutRecoveryTime": 1020,
            "workoutExerciseDuration": 1784,
            "workoutLoadPeak": 0,
            "workoutRecordCalorie": 104,
            "workoutRecordDistance": 3010,
            "workoutRecordSpeed": "6.07",
            "workoutRecordTotalTime": 1784,
            "workoutRecordStep": 4036,
            "workoutSkipNum": 4036,
            "workoutLongestStreak": -1,
            "workoutTripped": -1,
            "workoutSwimPoolLength": -1,
            "workoutSwimStrokeType": -1,
            "workoutSwimPullTimes": -1,
            "workoutSwimTripTimes": -1,
            "workoutSwimAvgSwolf": -1,
            "workoutSwimPullRate": -1,
            "workoutAvgStepRate": 135,
            "workoutAvgCadence": 67,
            "workoutPaddles": 4036,
            "workoutPaddlesAvgFrequency": 135,
            "pace": [
                {
                    "distance": 1,
                    "unitType": 0,
                    "pace": 527,
                    "pointIndex": 0,
                    "lastLessDistance": 0
                },
                {
                    "distance": 1,
                    "unitType": 1,
                    "pace": 844,
                    "pointIndex": 0,
                    "lastLessDistance": 0
                },
                {
                    "distance": 2,
                    "unitType": 0,
                    "pace": 569,
                    "pointIndex": 0,
                    "lastLessDistance": 0
                },
                {
                    "distance": 3,
                    "unitType": 0,
                    "pace": 684,
                    "pointIndex": 0,
                    "lastLessDistance": 0
                },
                {
                    "distance": 3,
                    "unitType": 0,
                    "pace": 400,
                    "pointIndex": 0,
                    "lastLessDistance": 10
                },
                {
                    "distance": 1,
                    "unitType": 1,
                    "pace": 1079,
                    "pointIndex": 0,
                    "lastLessDistance": 1401
                }
            ],
            "swimSections": []
        }
    ]
}

result example 2:
{
    "totalCount": 1,
    "index": 0,
    "count": 1,
    "dataList": [
        {
            "workoutRecordId": 3,
            "startTime": 1722653849,
            "endTime": 1722654263,
            "workoutType": 7,
            "accumulativeDropHeight": -1,
            "highestAltitude": -1,
            "lowestAltitude": -1,
            "workoutHrABSPeakMax": 100,
            "workoutHrABSPeakMin": 77,
            "workoutClimb": 0,
            "workoutEtrainingEffect": 0,
            "workoutMaxMET": 0,
            "workoutRecoveryTime": 0,
            "workoutExerciseDuration": 409,
            "workoutLoadPeak": 0,
            "workoutRecordCalorie": 2,
            "workoutRecordDistance": 25,
            "workoutRecordSpeed": "0.22",
            "workoutRecordTotalTime": 409,
            "workoutRecordStep": 0,
            "workoutSkipNum": 0,
            "workoutLongestStreak": -1,
            "workoutTripped": -1,
            "workoutSwimPoolLength": 2500,
            "workoutSwimStrokeType": 1,
            "workoutSwimPullTimes": 8,
            "workoutSwimTripTimes": 1,
            "workoutSwimAvgSwolf": 289,
            "workoutSwimPullRate": 1,
            "workoutAvgStepRate": 0,
            "workoutAvgCadence": 0,
            "workoutPaddles": 0,
            "workoutPaddlesAvgFrequency": 0,
            "pace": [],
            "swimSections": [
                {
                    "distance": 25,
                    "unitType": 0,
                    "pace": 1124,
                    "duration": 281,
                    "pullTimes": 8,
                    "strokeType": 1,
                    "avgSwolf": 289,
                    "sectionIndex": 1
                },
                {
                    "distance": 27,
                    "unitType": 1,
                    "pace": 1040,
                    "duration": 281,
                    "pullTimes": 8,
                    "strokeType": 1,
                    "avgSwolf": 289,
                    "sectionIndex": 1
                }
            ]
        }
    ]
}
```
 
| Data Category | Parameter | Value | Description |
| --- | --- | --- | --- |
| General data | dataList | - | Data list. Fields vary depending on the data type. |
| workoutRecordId | Data of the int type | Single workout record ID. |  |
| startTime | UTC time, in seconds | Workout start time, in seconds. |  |
| endTime | UTC time, in seconds | Workout end time, in seconds. |  |
| workoutType | Data of the int type | Workout type. For details, please refer to [Table 4](#EN-US_TOPIC_0000002648084490__table2253114519479). |  |
| workoutHrABSPeakMax | Data of the int type | Maximum heart rate (beats/min). |  |
| workoutHrABSPeakMin | Data of the int type | Minimum heart rate (beats/min). |  |
| workoutClimb | Data of the long type | Total ascent, in decimeters. (This parameter is supported only on watches.) |  |
| workoutEtrainingEffect | Data of the long type | Training effect. |  |
| workoutMaxMET | Data of the long type | Maximum oxygen uptake (ml/kg/min). |  |
| workoutRecoveryTime | Data of the int type | Recovery time, in minutes. |  |
| workoutExerciseDuration | Data of the long type | Workout duration, in seconds. |  |
| workoutLoadPeak | Data of the long type | Workout load. |  |
| workoutRecordCalorie | Data of the long type | Calories burned (kcal). |  |
| workoutRecordDistance | Data of the long type | Distance, in meters. |  |
| workoutRecordSpeed | Data of the String type | Average speed (km/h). |  |
| workoutRecordTotalTime | Data of the long type | Total duration, in seconds. |  |
| workoutRecordStep | Data of the long type | Step count. |  |
| accumulativeDropHeight | Data of the long type | Total descent, in decimeters. (This parameter is supported only on watches.) |  |
| highestAltitude | Data of the long type | Highest altitude, in decimeters. (This parameter is supported only on watches.) |  |
| lowestAltitude | Data of the long type | Lowest altitude, in decimeters. (This parameter is supported only on watches.) |  |
| Rope jumping | workoutSkipNum | Data of the long type | Number of jumps. |
| workoutLongestStreak | Data of the long type | Maximum number of continuous jumps. |  |
| workoutTripped | Data of the long type | Number of failed jumps. |  |
| Swimming: Pool swimming and open water swimming | workoutSwimStrokeType | Data of the int type | Main swimming stroke. • **1**: breaststroke • **2**: freestyle • **3**: butterfly stroke • **4**: backstroke • **5**: medley |
| workoutSwimPullTimes | Data of the long type | Number of strokes. |  |
| workoutSwimPoolLength | Data of the long type | Swimming pool length, in centimeters. |  |
| workoutSwimTripTimes | Data of the long type | Number of swimming laps. |  |
| workoutSwimAvgSwolf | Data of the long type | Average SWOLF. |  |
| workoutSwimPullRate | Data of the long type | Swimming stroke rate (strokes/min). |  |
| Elliptical | workoutAvgCadence | Data of the long type | Average cadence (rotations/min). |
| workoutAvgStepRate | Data of the long type | Average stride rate (steps/min). |  |
| Rower | workoutPaddles | Data of the long type | Number of rowing strokes. |
| workoutPaddlesAvgFrequency | Data of the long type | Average rowing stroke rate (strokes/min). |  |
| Pace split data | pace | Data of the int type | Pace (s/km or s/mi). |
| distance | Data of the long type | Number of kilometers/miles. The count starts from 0. |  |
| unitType | Data of the int type | Unit system. • **0**: metric system • **1**: imperial system |  |
| pointIndex | Data of the int type | Total number of GPS points from the start of the workout to the end of the pace calculation point. |  |
| lastLessDistance | Data of the long type | Final remaining distance less than a full kilometer/mile. Unit: meter |  |
| Swimming split data | sectionIndex | Data of the long type | Split index. The value starts from 1. |
| distance | Data of the long type | Split distance. The unit depends on the unit system in use. In the split list, the unit is meter if the metric system is used and is yard if the imperial system is used. |  |
| unitType | Data of the int type | Split unit. **0**: metric system **1**: imperial system |  |
| duration | Data of the long type | Split duration, in seconds. |  |
| pace | Data of the long type | Split pace, which is the average pace of the section. The unit depends on the unit system in use. In the split list, the unit is second/100 meters if the metric system is used and is second/100 yards if the imperial system is used. |  |
| pullTimes | Data of the long type | Number of split strokes. |  |
| strokeType | Data of the long type | Main swimming stroke within a split. **1**: breaststroke **2**: freestyle **3**: butterfly stroke **4**: backstroke **5**: medley |  |
| avgSwolf | Data of the long type | Average SWOLF, which is the sum of the time taken (in seconds) and the number of strokes per pool length. |  |
 
| Workout Type | Enumerated Value | Workout Type | Enumerated Value | Workout Type | Enumerated Value | Workout Type | Enumerated Value | Workout Type | Enumerated Value | Workout Type | Enumerated Value |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Outdoor running | 1 | Pilates | 18 | Karate | 35 | Hula hooping | 52 | Rugby | 69 | Skating | 86 |
| Outdoor walking | 2 | Aerobics | 19 | Fencing | 36 | Frisbee | 53 | Beach soccer | 70 | Ice hockey | 87 |
| Outdoor cycling | 3 | Strength training | 20 | Belly dance | 37 | Darts | 54 | Beach volleyball | 71 | Curling | 88 |
| Indoor running (on a treadmill) | 4 | Spinning | 21 | Jazz dance | 38 | Archery | 55 | Gateball | 72 | Bobsleigh | 89 |
| Indoor cycling | 5 | Baseball | 22 | Latin dance | 39 | Horse riding | 56 | Hockey | 73 | Sledding | 90 |
| Track running | 6 | Table tennis | 23 | Ballet | 40 | Laser tag | 57 | Squash | 74 | Biathlon | 91 |
| Indoor walking | 7 | Basketball | 24 | Core training | 41 | Kite flying | 58 | Sepak takraw | 75 | Skateboarding | 92 |
| Pool swimming | 8 | Volleyball | 25 | Body combat | 42 | Tug of war | 59 | Dodgeball | 76 | Rock climbing | 93 |
| Open water swimming | 9 | Air walker | 26 | Kendo | 43 | Swinging | 60 | Sailing | 77 | Bungee jumping | 94 |
| Rope jumping | 10 | HIIT | 27 | Single bar | 44 | Stair climbing | 61 | Surfing | 78 | Parkour | 95 |
| Elliptical | 11 | Group calisthenics | 28 | Parallel bars | 45 | Obstacle race | 62 | Fishing | 79 | BMX cycling | 96 |
| Rower | 12 | Cross-training | 29 | Street dance | 46 | Billiards | 63 | Rafting | 80 | Orienteering | 97 |
| Badminton | 13 | Functional training | 30 | Roller skating | 47 | Bowling | 64 | Dragon boating | 81 | Parachuting | 98 |
| Tennis | 14 | Physical training | 31 | Martial arts | 48 | Shuttlecock | 65 | Canoeing | 82 | Racing | 99 |
| Soccer | 15 | Taekwondo | 32 | Plaza dancing | 49 | Handball | 66 | Rowing | 83 | eSports | 100 |
| Stepper | 16 | Boxing | 33 | Tai Chi | 50 | Softball | 67 | Water scooter | 84 | Padel | 101 |
| Yoga | 17 | Free sparring | 34 | Dance (general) | 51 | Cricket | 68 | Standup paddleboarding (SUP) | 85 | Free training | 255 |
 > **Note:** When querying data of a single workout, you should retrieve only the data corresponding to this workout type. Any unrelated data is considered invalid. If the data to be returned in a single callback exceeds 1 MB, the system automatically paginates it. Each page is then delivered through a separate callback, so you do not need to call the query API again. If the sum of **index** and **count** is equal to the value of **totalCount**, all data of the current type is returned.
