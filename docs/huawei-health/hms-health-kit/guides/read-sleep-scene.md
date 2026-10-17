<!--
  Title: Reading Sleep Data
  Catalog: HMSCore-Guides-V5
  Document ID: read-sleep-scene-0000001054485405-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/read-sleep-scene-0000001054485405-V5
-->
# Reading Sleep Data

#### Reading Statistical Sleep Data

Reads the statistical sleep data via **ActivityRecord**. The **activityType** is 65, and the data type of the sleep sampling point is com.huawei.continuous.sleep.statistics.

**HTTP request**. For details, see [Querying Created Activity Records](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecords_list-0000001050114862-V5#EN-US_TOPIC_0000001053847040__section984123664716).

```cpp
GET 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=***&endTime=***&activityType=***
```

**Request example**

```cpp
GET 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=1598904865000&endTime=1599032065000&activityType=65
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
            "id": "HealthSleep1598965200000",
            "name": "HealthSleep1598965200000",
            "desc": "HealthSleep1598965200000",
            "startTime": 1598965200000,
            "endTime": 1598997600000,
            "modifyTime": 1598997600000,
            "activitySummary": {
                "dataSummary": [
                    {
                        "startTime": 1598965200000,
                        "endTime": 1598997600000,
                        "dataTypeName": "com.huawei.continuous.sleep.statistics",
                        "value": [
                            {
                                "fieldName": "fall_asleep_time",
                                "longValue": 1598965800000,
                                "mapValue": []
                            },
                            {
                                "fieldName": "wakeup_time",
                                "longValue": 1598997600000,
                                "mapValue": []
                            },
                            {
                                "fieldName": "light_sleep_time",
                                "integerValue": 120,
                                "mapValue": []
                            },
                            {
                                "fieldName": "deep_sleep_time",
                                "integerValue": 300,
                                "mapValue": []
                            },
                            {
                                "fieldName": "dream_time",
                                "integerValue": 60,
                                "mapValue": []
                            },
                            {
                                "fieldName": "awake_time",
                                "integerValue": 50,
                                "mapValue": []
                            },
                            {
                                "fieldName": "all_sleep_time",
                                "integerValue": 530,
                                "mapValue": []
                            },
                            {
                                "fieldName": "wakeup_count",
                                "integerValue": 1,
                                "mapValue": []
                            },
                            {
                                "fieldName": "deep_sleep_part",
                                "integerValue": 1,
                                "mapValue": []
                            },
                            {
                                "fieldName": "go_bed_time",
                                "longValue": 1598965200000,
                                "mapValue": []
                            }
                        ]
                    }
                ]
            },
            "timeZone": "+0800",
            "appInfo": {
                "appName": "app9",
                "appVersion": "1",
                "desc": "1",
                "clientId": "101278501"
            },
            "activityType": 65,
            "activeTime": 31800000
        }
    ],
    "deletedActivityRecord": []
}
```

#### Reading Detailed Sleep Data

Calls the API for grouping statistical sleep data to obtain the detailed sleep data.

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
            "dataTypeName": "com.huawei.continuous.sleep.fragment"
        }
    ],
    "startTime": 1598965200000,
    "endTime": 1598997600000
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
            "startTime": 1598965200000,
            "endTime": 1598997600000,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.continuous.sleep.fragment:com.huawei.hwid:merged",
                    "samplePoints": [
                        {
                            "startTime": 1598965800000000000,
                            "endTime": 1598973000000000000,
                            "dataTypeName": "com.huawei.continuous.sleep.fragment",
                            "originalDataCollectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
                            "value": [
                                {
                                    "fieldName": "sleep_state",
                                    "integerValue": 1,
                                    "mapValue": []
                                }
                            ]
                        },
                        {
                            "startTime": 1598974000000000000,
                            "endTime": 1598976600000000000,
                            "dataTypeName": "com.huawei.continuous.sleep.fragment",
                            "originalDataCollectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
                            "value": [
                                {
                                    "fieldName": "sleep_state",
                                    "integerValue": 2,
                                    "mapValue": []
                                }
                            ]
                        },
                        {
                            "startTime": 1598976700000000000,
                            "endTime": 1598994600000000000,
                            "dataTypeName": "com.huawei.continuous.sleep.fragment",
                            "originalDataCollectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
                            "value": [
                                {
                                    "fieldName": "sleep_state",
                                    "integerValue": 3,
                                    "mapValue": []
                                }
                            ]
                        },
                        {
                            "startTime": 1598994700000000000,
                            "endTime": 1598997600000000000,
                            "dataTypeName": "com.huawei.continuous.sleep.fragment",
                            "originalDataCollectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
                            "value": [
                                {
                                    "fieldName": "sleep_state",
                                    "integerValue": 4,
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
