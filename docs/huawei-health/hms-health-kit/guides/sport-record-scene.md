<!--
  Title: Workout Records
  Catalog: HMSCore-Guides-V5
  Document ID: sport-record-scene-0000001051139038-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/sport-record-scene-0000001051139038-V5
-->
# Workout Records

This section provides examples of how to write and read the user's workout records via the RESTful APIs of the Health Kit server. Workout data that can be written includes the activity record and the related atomic data, such as the speed, step cadence, GPS position, heart rate during workout, and jump. Workout records are stored using **ActivityRecord**. For details about the activity types, see [Activity Type Constants](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activity-types-0000001050071667-V5). Atomic data, such as the speed, step cadence, GPS position, heart rate during workout, and jump, are stored using **SampleSet**.

Common atomic data types are listed in the following table:

| Data Type | Description |
| --- | --- |
| com.huawei.instantaneous.speed | Speed |
| com.huawei.instantaneous.steps.rate | Step cadence |
| com.huawei.instantaneous.location.sample | GPS position |
| com.huawei.instantaneous.exercise_heart_rate | Heart rate during workout |
| com.huawei.continuous.jump | Jump |

#### Writing Workout Records

The following uses a walking activity as an example to describe how to write walking activity data and atomic data through the RESTful API.

## Writing the Statistical Data for a Running Activity

Call **ActivityRecord** to read the activity record list that has been created by the user. An **activityType** of **90** indicates a walking activity, **56** indicates a running activity, **57** indicates a treadmill running activity, and **5** indicates a basketball activity.

**HTTP request**. For details, see [Creating an Activity Record](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecords_update-0000001050116813-V5#EN-US_TOPIC_0000001053727047__section25059172122).

```cpp
PUT
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords/{activityRecordId}
```

**Request example**

```cpp
PUT 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords/1592905552721
```

**Request body**

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "id": "1592905552721",
    "desc": "running",
    "startTime": 1592905552721,
    "endTime": 1592906207222,
    "modifyTime": 1592911122916,
    "activitySummary":{
        "paceSummary": {
            "paceMap": {
                "0.61": 831
            },
            "sportHealthPaceMap": {
                "6100490": 831
            },
            "britishPaceMap": {
                "3800490": 1337
            },
            "partTimeMap": {},
            "britishPartTimeMap": {},
            "avgPace": 831.1475,
            "bestPace": 0
        },
        "dataSummary": [
            {
                "dataTypeName": "com.huawei.continuous.steps.total",
                "value": [
                    {
                        "integerValue": 949,
                        "fieldName": "steps"
                    }
                ]
            },
            {
                "dataTypeName": "com.huawei.continuous.distance.total",
                "value": [
                    {
                        "floatValue": 610,
                        "fieldName": "distance"
                    }
                ]
            },
            {
                "dataTypeName": "com.huawei.continuous.exercise_heart_rate.statistics",
                "value": [
                    {
                        "floatValue": 131,
                        "fieldName": "avg"
                    },
                    {
                        "floatValue": 169,
                        "fieldName": "max"
                    },
                    {
                        "floatValue": 73,
                        "fieldName": "min"
                    }
                ]
            }
        ]
    },
    "appInfo": {
        "appName": "app9",
        "appVersion": "1",
        "desc": "1",
        "clientId": "101278501"
    },
    "activityType": 56, 
    "activeTime": 654501
}
```

**Response body**

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "id": "1592905552721",
    "desc": "running",
    "startTime": 1592905552721,
    "endTime": 1592906207222,
    "modifyTime": 1592911122916,
    "activitySummary": {
        "paceSummary": {
            "paceMap": {
                "0.61": 831
            },
            "sportHealthPaceMap": {
                "6100490": 831
            },
            "britishPaceMap": {
                "3800490": 1337
            },
            "partTimeMap": {},
            "britishPartTimeMap": {},
            "avgPace": 831.1475,
            "bestPace": 0
        },
        "dataSummary": [
            {
                "dataTypeName": "com.huawei.continuous.steps.total",
                "value": [
                    {
                        "fieldName": "steps",
                        "integerValue": 949,
                        "mapValue": []
                    }
                ]
            },
            {
                "dataTypeName": "com.huawei.continuous.distance.total",
                "value": [
                    {
                        "fieldName": "distance",
                        "floatValue": 610,
                        "mapValue": []
                    }
                ]
            },
            {
                "dataTypeName": "com.huawei.continuous.exercise_heart_rate.statistics",
                "value": [
                    {
                        "fieldName": "avg",
                        "floatValue": 131,
                        "mapValue": []
                    },
                    {
                        "fieldName": "max",
                        "floatValue": 169,
                        "mapValue": []
                    },
                    {
                        "fieldName": "min",
                        "floatValue": 73,
                        "mapValue": []
                    }
                ]
            }
        ]
    },
    "appInfo": {
        "appName": "app9",
        "appVersion": "1",
        "desc": "1",
        "clientId": "101278501"
    },
    "activityType": 56,
    "activeTime": 654501
}
```

## Writing the Detailed Data for a Running Activity

The details data vary depending on the activities. Pay attention to the reasonableness of the data writing. For details, see [Open Data Types Associated with Workout Records](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/read-sport-health-datatype-0000001059873166-V5#EN-US_TOPIC_0000001059873166__section161381057143611).

For example, jump details exist in basketball activities rather than running activities.

Create a data collector and write atomic data, such as speed, step cadence, GPS position, and heart rate during workout, to the data collector via **SampleSet**.

- Create a data collector for speed. **HTTP request**. For details, see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section984123664716). 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors
```
 **Request example** 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "appInfo": {
        "appName": "app8"
    },
    "collectorDataType": {
        "field": [
            {
                "format": "float",
                "name": "speed"
            }
        ],
        "name": "com.huawei.instantaneous.speed"
    },
    "deviceInfo": {
        "manufacturer": "huawei",
        "modelNum": "mp",
        "devType": "Phone",
        "uniqueId": "1234567890",
        "version": "1.0"
    },
    "collectorType": "raw"
}
```
 **Response body** 
```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "collectorId": "raw:com.huawei.instantaneous.speed:101278501:huawei:mp:1234567890",
    "collectorType": "raw",
    "collectorDataType": {
        "name": "com.huawei.instantaneous.speed",
        "field": [
            {
                "name": "speed",
                "format": "float"
            }
        ]
    },
    "deviceInfo": {
        "uniqueId": "1234567890",
        "devType": "Phone",
        "version": "1.0",
        "modelNum": "mp",
        "manufacturer": "huawei"
    },
    "appInfo": {
        "appName": "app8",
        "clientId": "101278501"
    }
}
```

- Fill in the step count changes to SampleSet. **HTTP request**. For details, see [Uploading Sampling Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_patch-0000001050114858-V5#EN-US_TOPIC_0000001053607053__section4148124910217). 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/dataCollectorId/sampleSets/sampleSetId
```
 **Request example** 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/ raw:com.huawei.instantaneous.speed:300013102:huawei:mp:1234567890/sampleSets/1592905552721000000-1592906207222000000
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "dataCollectorId": "raw:com.huawei.instantaneous.speed:300013102:huawei:mp:1234567890",
    "endTime": 1592906207222000000,
    "startTime": 1592905552721000000,
    "samplePoints": [
        {
            "dataTypeName": "com.huawei.instantaneous.speed",  
            "endTime": 1592906207222000000,
            "startTime": 1592905552721000000,
            "value": [
                {
                    "fieldName": "speed",
                    "floatValue": 3.5  
                }
            ]
        }
    ]
}
```
 **Response body** 
```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "startTime": 1592905552721000000,
    "endTime": 1592906207222000000,
    "dataCollectorId": "raw:com.huawei.instantaneous.speed:300013102:huawei:mp:1234567890",
    "samplePoints": [
        {
            "startTime": 1592905552721000000,
            "endTime": 1592906207222000000,
            "dataTypeName": "com.huawei.instantaneous.speed",
            "value": [
                {
                    "fieldName": "speed",
                    "floatValue": 3.5,
                    "mapValue": []
                }
            ]
        }
    ]
}
```

> **Note:** Follow the steps above to write other atomic data such as step cadence, GPS position, heart rate during workout, and jump. Pay attention to the data type when writing data.

#### Reading Workout Records

Use the RESTful APIs to read workout records, as well as the atomic data such as step cadence, GPS position, heart rate during workout, and jump.

## Reading Statistical Data of Workout Records

Call **ActivityRecord** to read the activity record list that has been created by the user. An **activityType** of **90** indicates a walking activity, **56** indicates a running activity, **57** indicates a treadmill running activity, and **5** indicates a basketball activity. For details, see [Activity Type Constants](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activity-types-0000001050071667-V5). The user can set the query conditions, such as the start time, end time, and activity type.

**HTTP request**. For details, see [Querying Created Activity Records](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecords_list-0000001050114862-V5#EN-US_TOPIC_0000001053847040__section984123664716).

```cpp
GET 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=***&endTime=***&activityType=***
```

**Request example**

```cpp
GET 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=1592934352000&endTime=1592935007000
```

**Request body**

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    // No request body
}
```

**Response body**

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "activityRecord": [
        {
            "id": "1592905552721",
            "desc": "running",
            "startTime": 1592905552721,
            "endTime": 1592906207222,
            "modifyTime": 1599290412916,
            "activitySummary": {
                "paceSummary": {
                    "paceMap": {
                        "0.61": 831
                    },
                    "sportHealthPaceMap": {
                        "6100490": 831
                    },
                    "britishPaceMap": {
                        "3800490": 1337
                    },
                    "partTimeMap": {},
                    "britishPartTimeMap": {},
                    "avgPace": 831.1475,
                    "bestPace": 0
                },
                "dataSummary": [
                    {
                        "dataTypeName": "com.huawei.continuous.steps.total",
                        "value": [
                            {
                                "fieldName": "steps",
                                "integerValue": 949,
                                "mapValue": []
                            }
                        ]
                    },
                    {
                        "dataTypeName": "com.huawei.continuous.distance.total",
                        "value": [
                            {
                                "fieldName": "distance",
                                "floatValue": 610,
                                "mapValue": []
                            }
                        ]
                    },
                    {
                        "dataTypeName": "com.huawei.continuous.exercise_heart_rate.statistics",
                        "value": [
                            {
                                "fieldName": "avg",
                                "floatValue": 131,
                                "mapValue": []
                            },
                            {
                                "fieldName": "max",
                                "floatValue": 169,
                                "mapValue": []
                            },
                            {
                                "fieldName": "min",
                                "floatValue": 73,
                                "mapValue": []
                            }
                        ]
                    }
                ]
            },
            "appInfo": {
                "appName": "app9",
                "appVersion": "1",
                "desc": "1",
                "clientId": "101278501"
            },
            "activityType": 56,
            "activeTime": 654501
        }
    ],
    "deletedActivityRecord": []
}
```

## Reading Statistical Data of Basketball Activity Records

Call **ActivityRecord** to read the basketball activity records. An **activityType** of **5** indicates a basketball activity. Other types of workout records can be read by referring to this example. For details about the values of **activityType**, see [Activity Type Constants](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activity-types-0000001050071667-V5).

**HTTP request**. For details, see [Querying Created Activity Records](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecords_list-0000001050114862-V5#EN-US_TOPIC_0000001053847040__section984123664716).

```cpp
GET 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=***&endTime=***&activityType=***
```

**Request example**

```cpp
GET 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=1615334400000&endTime=1615593600000&activityType=5
```

**Request body**

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    // No request body
}
```

**Response body**

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "activityRecord": [
        {
            "id": "sportHealth1615428710000",
            "name": "sportHealth1615428710000",
            "desc": "sportHealth1615428710000",
            "startTime": 1615428710000,
            "endTime": 1615436897000,
            "modifyTime": 1615436897000,
            "activitySummary": {
                "paceSummary": {
                    "paceMap": {},
                    "sportHealthPaceMap": {},
                    "britishPaceMap": {},
                    "partTimeMap": {},
                    "britishPartTimeMap": {},
                    "avgPace": 2766.154,
                    "bestPace": 0
                },
                "dataSummary": [
                    {
                        "dataTypeName": "com.huawei.continuous.calories.burnt.total",
                        "value": [
                            {
                                "fieldName": "calories_total",
                                "floatValue": 561,
                                "mapValue": []
                            }
                        ]
                    },
                    {
                        "dataTypeName": "com.huawei.continuous.steps.total",
                        "value": [
                            {
                                "fieldName": "steps",
                                "integerValue": 10896,
                                "mapValue": []
                            }
                        ]
                    },
                    {
                        "dataTypeName": "com.huawei.continuous.distance.total",
                        "value": [
                            {
                                "fieldName": "distance",
                                "floatValue": 4225,
                                "mapValue": []
                            }
                        ]
                    },
                    {
                        "dataTypeName": "com.huawei.continuous.steps.rate.statistics",
                        "value": [
                            {
                                "fieldName": "avg",
                                "floatValue": 55,
                                "mapValue": []
                            },
                            {
                                "fieldName": "max",
                                "floatValue": 0,
                                "mapValue": []
                            },
                            {
                                "fieldName": "min",
                                "floatValue": 0,
                                "mapValue": []
                            }
                        ]
                    },
                    {
                        "dataTypeName": "com.huawei.continuous.jump.statistics",
                        "value": [
                            {
                                "fieldName": "jump_times",
                                "integerValue": 39,
                                "mapValue": []
                            },
                            {
                                "fieldName": "max_jump_height",
                                "floatValue": 6.6,
                                "mapValue": []
                            },
                            {
                                "fieldName": "max_passage_duration",
                                "integerValue": 698,
                                "mapValue": []
                            }
                        ]
                    }
                ]
            },
            "timeZone": "+0800",
            "metadata": "{\"burst_score\":72,\"jump_score\":66,\"breakthrough_score\":48,\"sport_intensity_score\":77,\"run_score\":46,\"overall_score\":58}",
            "appInfo": {
                "appPackageName": "com.huawei.health",
                "clientId": "101050500"
            },
            "activityType": 5,
            "activeTime": 3303
        }
    ],
    "deletedActivityRecord": []
}
```

## Reading the Atomic Data Related to the Workout Record

Call the API for grouping sampling data to read the atomic data associated with each workout record. Note that the **startTime** and **endTime** values in the request body of this API must be the same as those in the request body of the API for [reading statistical data of workout records](#EN-US_TOPIC_0000001051139038__section1481282214599).

**HTTP request**. For details, see [Grouping Sampling Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sampleset_polymerize-0000001050114864-V5#EN-US_TOPIC_0000001053248379__section984123664716).

```cpp
POST 
https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:polymerize
```

**Request example**

```cpp
POST 
https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:polymerize
```

**Request body**

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "polymerizeWith": [
        {
          // Speed
          "dataTypeName": "com.huawei.instantaneous.speed"  
        },
        {
          // Step cadence
          "dataTypeName": "com.huawei.instantaneous.steps.rate"  
        },
        {
          // GPS position
          "dataTypeName": "com.huawei.instantaneous.location.sample"  
        },
        {
          // Heart rate during workout
          "dataTypeName": "com.huawei.instantaneous.exercise_heart_rate"  
        }
        ],
        "startTime": 1592905552721,
        "endTime": 1592906207222
}
```

**Response body**

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "group": [
        {
            "startTime": 1592905552721,
            "endTime": 1592906207222,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.instantaneous.speed:com.huawei.hwid:merged",
                    "samplePoints": [
                        {
                            "startTime": 1592905552721000000,
                            "endTime": 1592906207222000000,
                            "dataTypeName": "com.huawei.instantaneous.speed",
                            "originalDataCollectorId": "raw:com.huawei.instantaneous.speed:com.huawei.health:default",
                            "value": [
                                {
                                    "fieldName": "speed",
                                    "floatValue": 3.5,
                                    "mapValue": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "startTime": 1592905552721,
            "endTime": 1592906207222,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.instantaneous.steps.rate:com.huawei.hwid:merged",
                    "samplePoints": [
                        {
                            "startTime": 1592905552721000000,
                            "endTime": 1592906207222000000,
                            "dataTypeName": "com.huawei.instantaneous.steps.rate",
                            "originalDataCollectorId": "raw:com.huawei.instantaneous.steps.rate:com.huawei.health:default",
                            "value": [
                                {
                                    "fieldName": "step_rate",
                                    "floatValue": 187,
                                    "mapValue": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "startTime": 1592905552721,
            "endTime": 1592906207222,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.instantaneous.location.sample:com.huawei.hwid:merged",
                    "samplePoints": [
                        {
                            "startTime": 1592906000000000000,
                            "endTime": 1592906000000000000,
                            "dataTypeName": "com.huawei.instantaneous.location.sample",
                            "originalDataCollectorId": "raw:com.huawei.instantaneous.location.sample:com.huawei.health:default",
                            "value": [
                                {
                                    "fieldName": "latitude",     
                                    "floatValue": 31.134347,
                                    "mapValue": []
                                },
                                {
                                    "fieldName": "longitude",     
                                    "floatValue": 121.366914,
                                    "mapValue": []
                                },
                                {
                                    "fieldName": "precision",     
                                    "floatValue": 0.0,
                                    "mapValue": []
                                },
                                {
                                    "fieldName": "altitude",     
                                    "floatValue": 0.0,
                                    "mapValue": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "startTime": 1592905552721,
            "endTime": 1592906207222,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.instantaneous.exercise_heart_rate:com.huawei.hwid:merged",
                    "samplePoints": [
                        {
                            "startTime": 1592905552721000000,
                            "endTime": 1592906207222000000,
                            "dataTypeName": "com.huawei.instantaneous.exercise_heart_rate",
                            "originalDataCollectorId": "raw:com.huawei.instantaneous.exercise_heart_rate:com.huawei.health:default",
                            "value": [
                                {
                                    "fieldName": "bpm",
                                    "floatValue": 101,
                                    "mapValue": []
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```
