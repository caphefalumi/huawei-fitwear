<!--
  Title: Writing Sleep Data
  Catalog: HMSCore-Guides-V5
  Document ID: write-sleep-scene-0000001055045352-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/write-sleep-scene-0000001055045352-V5
-->
# Writing Sleep Data

#### Writing Statistical Sleep Data

Writes the statistical sleep data into **ActivityRecord**. The **activityType** is 65, and the data type of the sleep sampling point is com.huawei.continuous.sleep.statistics.

- Creates an activity record for the statistical sleep data.**HTTP request**. For details, see [Creating an Activity Record](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecords_update-0000001050116813-V5#EN-US_TOPIC_0000001053727047__section25059172122).
```cpp
PUT
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords/{activityRecordId}
```
 **Request example** 
```cpp
PUT 
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords/HealthSleep1598965200000
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
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
        "desc": "1"
    },
    "activityType": 65,
    "activeTime": 31800000
}
```
 **Response body** 
```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
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
```

#### Writing Detailed Sleep Data

The detailed sleep data is stored in **SampleSet**. The corresponding data type is com.huawei.continuous.sleep.fragment.

- Create a data collector for the detailed sleep data. **HTTP request**. For details, see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section984123664716). 
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
                "format": "integer",
                "name": "sleep_state"
            }
        ],
        "name": "com.huawei.continuous.sleep.fragment"
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
    "collectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
    "collectorType": "raw",
    "collectorDataType": {
        "name": "com.huawei.continuous.sleep.fragment",
        "field": [
            {
                "name": "sleep_state",
                "format": "integer"
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

- Upload the sampling points for the detailed sleep data. **HTTP request**. For details, see [Uploading Sampling Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_patch-0000001050114858-V5#EN-US_TOPIC_0000001053607053__section4148124910217). 
```cpp
PATCH
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/{dataCollectorId}/sampleSets/{sampleSetId}
```
 **Request example** 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890/sampleSets/1598965200000000000-1598997600000000000
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "dataCollectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
    "endTime": 1598997600000000000,
    "startTime": 1598965200000000000,
    "samplePoints": [
        {
            "dataTypeName": "com.huawei.continuous.sleep.fragment",
            "endTime": 1598973000000000000,
            "startTime": 1598965800000000000,
            "value": [
                {
                    "fieldName": "sleep_state",
                    "integerValue": 1
                }
            ]
        },
        {
            "dataTypeName": "com.huawei.continuous.sleep.fragment",
            "endTime": 1598976600000000000,
            "startTime": 1598974000000000000,
            "value": [
                {
                    "fieldName": "sleep_state",
                    "integerValue": 2
                }
            ]
        },
        {
            "dataTypeName": "com.huawei.continuous.sleep.fragment",
            "endTime": 1598994600000000000,
            "startTime": 1598976700000000000,
            "value": [
                {
                    "fieldName": "sleep_state",
                    "integerValue": 3
                }
            ]
        },
        {
            "dataTypeName": "com.huawei.continuous.sleep.fragment",
            "endTime": 1598997600000000000,
            "startTime": 1598994700000000000,
            "value": [
                {
                    "fieldName": "sleep_state",
                    "integerValue": 4
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
    "startTime": 1598965200000000000,
    "endTime": 1598997600000000000,
    "dataCollectorId": "raw:com.huawei.continuous.sleep.fragment:101278501:huawei:mp:1234567890",
    "samplePoints": [
        {
            "startTime": 1598965800000000000,
            "endTime": 1598973000000000000,
            "dataTypeName": "com.huawei.continuous.sleep.fragment",
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
```
