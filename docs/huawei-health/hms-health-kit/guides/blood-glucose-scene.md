<!--
  Title: Blood Glucose Data
  Catalog: HMSCore-Guides-V5
  Document ID: blood-glucose-scene-0000001076632804-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/blood-glucose-scene-0000001076632804-V5
-->
# Blood Glucose Data

This section provides examples of how to write and read the user's blood glucose data via the **RESTful** APIs of the Health Kit server. The blood glucose data type **com.huawei.instantaneous.blood_glucose** contains three fields: **level **(blood glucose level), **measure_time** (measurement time), and **sample_source** (source of the blood glucose sample). Each sampling point represents a single instantaneous blood glucose reading. For details, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711).

The OAuth permissions corresponding to the blood glucose data type are as follows:

- https://www.huawei.com/healthkit/bloodglucose.read
- https://www.huawei.com/healthkit/bloodglucose.write

#### Writing Blood Glucose Data

To write blood glucose data through **SampleSet**, you need to create a **DataCollector** and write detailed blood glucose sampling data into **SampleSet**.

- Create a **DataCollector **for blood glucose. **HTTP request**. For details, see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section984123664716). 
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
        "appName": "Example App",
        "desc": "https://huaweiapi.com",
        "appVersion": "1"
    },
    "collectorDataType": {
        "field": [
         {
            "name": "level",
            "format": "float"
          },
	  {
              "name": "measure_time",
              "format": "integer"
           },
	  {
               "name": "sample_source",
               "format": "integer",
	       "optional": true
           }
           ],
           "name": "com.huawei.instantaneous.blood_glucose"
    },
    "deviceInfo": {
        "manufacturer": "sinocare",
        "modelNum": "mp",
        "devType": "Blood glucose monitor",
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
    "collectorId": "raw: com.huawei.instantaneous.blood_glucose:300013102:sinocare:mp:1234567890",
    "appInfo": {
        "appName": "Example App",
        "desc": "https://huaweiapi.com", 
        "appVersion": "1" 
    },
    "collectorDataType": {
        "field": [
         {
            "name": "level",
            "format": "float"
          },
	  {
              "name": "measure_time",
              "format": "integer"
           },
	  {
               "name": "sample_source",
               "format": "integer",
	       "optional": true
           }
           ],
           "name": "com.huawei.instantaneous.blood_glucose"
    },
    "deviceInfo": {
        "manufacturer": "sinocare",
        "modelNum": "mp", 
        "devType": "Blood glucose monitor", 
        "uniqueId": "1234567890", 
        "version": "1.0"
    },
    "collectorType": "raw"
}
```

- Fill in the blood glucose changes to **SampleSet**. **HTTP request**. For details, see [Uploading Sampling Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_patch-0000001050114858-V5#EN-US_TOPIC_0000001053607053__section4148124910217). 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/dataCollectorId/sampleSets/sampleSetId
```
 **Request example** 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw: com.huawei.instantaneous.blood_glucose:300013102:sinocare:mp:1234567890/sampleSets/1592583640000000000-1592619649692000000
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "dataCollectorId": "raw:com.huawei.instantaneous.blood_glucose:300013102:sinocare:mp:1234567890", 
    "startTime": 1600446040000000000,
    "endTime": 1600482049000000000,
    "samplePoints": [
	{
            "dataTypeName": "com.huawei.instantaneous.blood_glucose",
            "startTime": 1600446040000000000,
            "endTime": 1600482049000000000,
            "value": [
                {
		"fieldName": "level",
                "floatValue": 6.7
                },
                {
		"fieldName": "measure_time",
                "integerValue": 1
                },
                {
		"fieldName": "sample_source",
                "integerValue": 1
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
    "startTime": 1600446040000000000,
    "endTime": 1600482049000000000,
    "dataCollectorId": "raw:com.huawei.instantaneous.blood_glucose:300013102:sinocare:mp:1234567890",
    "samplePoints": [
        {
            "dataTypeName": "com.huawei.instantaneous.blood_glucose",
            "endTime": 1600482049000000000,
            "startTime": 1600446040000000000,
            "value": [
                {
		"fieldName": "level",
                "floatValue": 6.7
                },
                {
		"fieldName": "measure_time",
                "integerValue": 1
                },
                {
		"fieldName": "sample_source",
                "integerValue": 1
                }
            ]
        }
    ]
}
```

#### Reading Blood Glucose Data

Read the blood glucose data after the Health app is integrated through the grouping sampling API.

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
            "dataTypeName": "com.huawei.instantaneous.blood_glucose"
        }
    ],
    "startTime": 1600446040000,
    "endTime": 1600482049000
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
            "startTime": 1600446040000,
            "endTime": 1600482049000,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.instantaneous.blood_glucose:com.huawei.hms.hihealth.service:merged",
                    "samplePoints": [
                        {
                            "startTime": 1600471067000000000,
                            "endTime": 1600471067000000000,
                            "dataTypeName": "com.huawei.instantaneous.blood_glucose",
                            "originalDataCollectorId": "raw: com.huawei.instantaneous.blood_glucose:300013102:sinocare:mp:1234567890",
                            "value": [
                                {
                                    "fieldName": "level",
                                    "floatValue": 6.7,
                                    "mapValue": []
                                },
                                {
                                    "fieldName": "measure_time",
                                    "integerValue": 1,
                                    "mapValue": []
                                },
                                {
                                    "fieldName": "sample_source",
                                    "integerValue": 1,
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
