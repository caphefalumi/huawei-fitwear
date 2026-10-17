<!--
  Title: App Development Example
  Catalog: HMSCore-Guides-V5
  Document ID: restful-deve-example-0000001050069748-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/restful-deve-example-0000001050069748-V5
-->
# App Development Example

This section uses the step count as an example to describe how to create a group of health data via the HTTP RESTful APIs.

For details about the HTTPS request header, see [Accessing Health Kit via the HTTP RESTful API](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/use-restful-api-0000001050071697-V5).

For details about the HTTP RESTful API, see [Health Kit Server API Reference](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5).

#### Creating a Data Collector

In Health Kit, sampling points are collected and stored based on the data collector. Therefore, you must create a data collector before uploading sampling points. The following describes how to create a data collector of the com.huawei.continuous.steps.delta type to collect the step count information.

URL request:

POST https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors

Request body:

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "collectorName": "DataCollectorExample",
    "collectorType": "raw",
    "appInfo": {
        "appName": "Example App",
        "desc": "https://huaweiapi.com",
        "appVersion": "1"
    },
    "collectorDataType": {
        "field": [
            {
                "name": "steps_delta",
                "format": "integer"
            }
        ],
        "name": "com.huawei.continuous.steps.delta"
    },
    "deviceInfo": {
        "manufacturer": "huawei",
        "modelNum": "ExampleTablet",
        "devType": "Phone",
        "uniqueId": "1000",
        "version": "1.0"
    }
}
```

If the data collector is successfully created, the response code **200 OK** will be returned. The response body is as follows:

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "collectorId": "raw:com.huawei.continuous.steps.delta:101272135:huawei:ExampleTablet:1000:DataCollectorExample",
    "collectorName": "DataCollectorExample",
    "collectorType": "raw",
    "collectorDataType": {
        "name": "com.huawei.continuous.steps.delta",
        "field": [
            {
                "name": "steps_delta",
                "format": "integer"
            }
        ]
    },
    "deviceInfo": {
        "uniqueId": "1000",
        "devType": "Phone",
        "version": "1.0",
        "modelNum": "ExampleTablet",
        "manufacturer": "huawei"
    },
    "appInfo": {
        "appName": "Example App",
        "appVersion": "1",
        "desc": "https://huaweiapi.com",
        "clientId": "101272135"
    }
}
```

The **collectorId** returned in the response body will be used later for uploading sampling points, querying sampling data, and other purposes.

#### Uploading Sampling Points

After the data collector is created, sampling points for steps can be uploaded. The upload of sample points depends on the sampling dataset.

URL request:

PATCH https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.steps.delta:101272135:huawei:ExampleTablet:1000:DataCollectorExample/sampleSets/1584460800000000000-1584626400000000000

Request body:

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{ 
    "dataCollectorId": "raw:com.huawei.continuous.steps.delta:101272135:huawei:ExampleTablet:1000:DataCollectorExample", 
    "startTime": 1584460800000000000, 
    "endTime": 1584626400000000000, 
    "samplePoints": [ 
        { 
            "dataTypeName": "com.huawei.continuous.steps.delta", 
            "endTime": 1584500400000000000, 
            "startTime": 1584493200000000000, 
            "value": [ 
                { 
                    "fieldName": "steps_delta",                    
                    "integerValue": 10000
                } 
            ] 
        }, 
        { 
            "dataTypeName": "com.huawei.continuous.steps.delta", 
            "endTime": 1584579600000000000, 
            "startTime": 1584576000000000000, 
            "value": [ 
                { 
                    "fieldName": "steps_delta",
                    "integerValue": 2000 
                } 
            ] 
        }, 
        { 
            "dataTypeName": "com.huawei.continuous.steps.delta", 
            "endTime": 1584590400000000000, 
            "startTime": 1584586800000000000, 
            "value": [ 
                { 
                    "fieldName": "steps_delta",
                    "integerValue": 300 
                } 
            ] 
        } 
    ] 
}
```

If the data is successfully uploaded, the response code **200 OK** will be returned. The response body is as follows:

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "startTime": 1584460800000000000,
    "endTime": 1584626400000000000,
    "dataCollectorId": "raw:com.huawei.continuous.steps.delta:101272135:huawei:ExampleTablet:1000:DataCollectorExample",
    "samplePoints": [
        {
            "startTime": 1584493200000000000,
            "endTime": 1584500400000000000,
            "dataTypeName": "com.huawei.continuous.steps.delta",
            "value": [
                {
                    "fieldName": "steps_delta",
                    "integerValue": 10000,
                    "mapValue": []
                }
            ]
        },
        {
            "startTime": 1584576000000000000,
            "endTime": 1584579600000000000,
            "dataTypeName": "com.huawei.continuous.steps.delta",
            "value": [
                {
                    "fieldName": "steps_delta",
                    "integerValue": 2000,
                    "mapValue": []
                }
            ]
        },
        {
            "startTime": 1584586800000000000,
            "endTime": 1584590400000000000,
            "dataTypeName": "com.huawei.continuous.steps.delta",
            "value": [
                {
                    "fieldName": "steps_delta",
                    "integerValue": 300,
                    "mapValue": []
                }
            ]
        }
    ]
}
```

#### Querying the Sampling Data

Use the **get** method to obtain the sampling data within a specific period of time.

URL request:

GET https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.steps.delta:101272135:huawei:ExampleTablet:1000:DataCollectorExample/sampleSets/1584460800000000000-1584626400000000000

Request body

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
```

If the data is successfully requested, the response code **200 OK** will be returned. The response body is as follows:

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "startTime": 1584460800000000000,
    "endTime": 1584626400000000000,
    "dataCollectorId": "raw:com.huawei.continuous.steps.delta:101272135:huawei:ExampleTablet:1000:DataCollectorExample",
    "samplePoints": [
        {
            "startTime": 1584493200000000000,
            "endTime": 1584500400000000000,
            "dataTypeName": "com.huawei.continuous.steps.delta",
            "value": [
                {
                    "fieldName": "steps_delta",
                    "integerValue": 10000,
                    "mapValue": []
                }
            ],
            "modifyTime": 1584672141776
        },
        {
            "startTime": 1584576000000000000,
            "endTime": 1584579600000000000,
            "dataTypeName": "com.huawei.continuous.steps.delta",
            "value": [
                {
                    "fieldName": "steps_delta",
                    "integerValue": 2000,
                    "mapValue": []
                }
            ],
            "modifyTime": 1584672141776
        },
        {
            "startTime": 1584586800000000000,
            "endTime": 1584590400000000000,
            "dataTypeName": "com.huawei.continuous.steps.delta",
            "value": [
                {
                    "fieldName": "steps_delta",
                    "integerValue": 300,
                    "mapValue": []
                }
            ],
            "modifyTime": 1584672141776
        }
    ]
}
```

#### Creating an Activity Record

If you want to add information such as the description, type, or active time for an activity within a specified period of time, create an activity record.

URL request:

PUT https://health-api.cloud.huawei.com/healthkit/v1/activityRecords/1599016317911

Request body:

```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "activityType": 97,
    "appInfo": {
        "appName": "app9",
        "appVersion": "1",
        "desc": "1"
    },
    "endTime": 1599076317911,
    "name": "test",
    "id": "1599016317911",
    "desc": "test",
    "modifyTime": 1599076317911,
    "startTime": 1599016317911,
    "activeTime": 13921000,
    "activitySummary": {
        "paceSummary": {
            "paceMap": {
                "0.61": 831
            },
            "britishPaceMap": {
                "3800490": 1337
            },
            "partTimeMap": {},
            "britishPartTimeMap": {},
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
                "dataTypeName": "com.huawei.continuous.heart_rate.statistics",
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
                "dataTypeName": "com.huawei.continuous.steps.rate.statistics",
                "value": [
                    {
                        "fieldName": "avg",
                        "floatValue": 112,
                        "mapValue": []
                    },
                    {
                        "fieldName": "max",
                        "floatValue": 188,
                        "mapValue": []
                    },
                    {
                        "fieldName": "min",
                        "floatValue": 0,
                        "mapValue": []
                    }
                ]
            }
        ]
    },
    "timeZone": "+0800"
}
```

If the request is successful, the response code **200 OK** will be returned. The response body is as follows:

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "id": "1599016317911",
    "name": "test",
    "desc": "test",
    "startTime": 1599016317911,
    "endTime": 1599076317911,
    "modifyTime": 1599076317911,
    "activitySummary": {
        "paceSummary": {
            "paceMap": {
                "0.61": 831
            },
            "britishPaceMap": {
                "3800490": 1337
            },
            "partTimeMap": {},
            "britishPartTimeMap": {},
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
                "dataTypeName": "com.huawei.continuous.heart_rate.statistics",
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
                "dataTypeName": "com.huawei.continuous.steps.rate.statistics",
                "value": [
                    {
                        "fieldName": "avg",
                        "floatValue": 112,
                        "mapValue": []
                    },
                    {
                        "fieldName": "max",
                        "floatValue": 188,
                        "mapValue": []
                    },
                    {
                        "fieldName": "min",
                        "floatValue": 0,
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
    "activityType": 97,
    "activeTime": 13921000
}
```
