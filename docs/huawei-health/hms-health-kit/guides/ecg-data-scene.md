<!--
  Title: ECG Data
  Catalog: HMSCore-Guides-V5
  Document ID: ecg-data-scene-0000001097873776-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ecg-data-scene-0000001097873776-V5
-->
# ECG Data

This section provides examples of how to write the user's ECG data via the **RESTful** APIs of the Health Kit server. For details about the ECG data type **com.huawei.continuous.ecg_record** and ECG details data type **com.huawei.continuous.ecg_detail**, see [Public Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section59321052711).

The OAuth permission corresponding to the ECG data type is as follows:

- https://www.huawei.com/healthkit/hearthealth.read
- https://www.huawei.com/healthkit/hearthealth.write

#### Writing ECG Data

To write the ECG data, perform the following steps:

- Create a **DataCollector** for the ECG records.
- Create a **DataCollector** for the ECG details.
- Write the ECG details to **SampleSet**.
- Write the ECG records to **HealthRecord** and associate the ECG details.

- Create a **DataCollector** for the ECG records. **HTTP request**. For details, see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section984123664716). 
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
	"name": "com.huawei.continuous.ecg_record",
	"field": [{
	    "name": "ecg_type",
	    "format": "integer"
	},
	{
	    "name": "avg_heart_rate",
	    "format": "integer"
	},
	{
	    "name": "ecg_arrhythmia_type",
	    "format": "long"
	},
	{
	    "name": "user_symptom",
	    "format": "long"
	},
	{
	    "name": "sampling_frequency",
	    "format": "integer"
	},
	{
	    "name": "ecg_algorithm_version",
	    "format": "string"
	}]
    },
    "deviceInfo": {
	"manufacturer": "huawei",
	"modelNum": "mp",
	"devType": "Heart rate monitor",
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
    "collectorId": "raw:com.huawei.continuous.ecg_record:300013102:huawei:mp:1234567890",
    "collectorType": "raw",
    "collectorDataType": {
	"name": "com.huawei.continuous.ecg_record",
	"field": [{
	    "name": "ecg_type",
	    "format": "integer",
	    "optional": false
	},
	{
	    "name": "avg_heart_rate",
	    "format": "integer",
	    "optional": false
	},
	{
	    "name": "ecg_arrhythmia_type",
	    "format": "long",
	    "optional": true
	},
	{
	    "name": "user_symptom",
	    "format": "long",
	    "optional": true
	},
	{
	    "name": "sampling_frequency",
	    "format": "integer",
	    "optional": true
	},
	{
	    "name": "ecg_algorithm_version",
	    "format": "string",
	    "optional": true
	}]
    },
    "deviceInfo": {
	"uniqueId": "1234567890",
	"devType": "Heart rate monitor",
	"version": "1.0",
	"modelNum": "mp",
	"manufacturer": "huawei"
    },
    "appInfo": {
	"appName": "Example App",
	"appVersion": "1",
	"desc": "https://huaweiapi.com",
	"clientId": "300013102"
    },
    "lastUpdateTime": 0
}
```

- Create a **DataCollector** for the ECG details. **HTTP request**. For details, see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section984123664716). 
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
	"name": "com.huawei.continuous.ecg_detail",
	"field": [{
	    "name": "ecg_type",
	    "format": "integer"
	},
	{
	    "name": "voltage_datas",
	    "format": "string"
	}]
    },
    "deviceInfo": {
	"manufacturer": "huawei",
	"modelNum": "mp",
	"devType": "Heart rate monitor",
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
    "collectorId": "raw:com.huawei.continuous.ecg_detail:300013102:huawei:mp:1234567890",
    "collectorType": "raw",
    "collectorDataType": {
	"name": "com.huawei.continuous.ecg_detail",
	"field": [{
	    "name": "ecg_type",
	    "format": "integer",
	    "optional": false
	},
	{
	    "name": "voltage_datas",
	    "format": "string",
	    "optional": true
	}]
    },
    "deviceInfo": {
	"uniqueId": "1234567890",
	"devType": "Heart rate monitor",
	"version": "1.0",
	"modelNum": "mp",
	"manufacturer": "huawei"
    },
    "appInfo": {
	"appName": "Example App",
	"appVersion": "1",
	"desc": "https://huaweiapi.com",
	"clientId": "300013102"
    },
    "lastUpdateTime": 0
}
```

- Write the ECG details to **SampleSet**. **HTTP request**. For details, see [Uploading Sampling Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_patch-0000001050114858-V5#EN-US_TOPIC_0000001053607053__section4148124910217). 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/dataCollectorId/sampleSets/sampleSetId
```
 **Request example** 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.ecg_detail:300013102:huawei:mp:1234567890/sampleSets/1609293600000000000-1609380000000000000
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "dataCollectorId": "raw:com.huawei.continuous.ecg_detail:300013102:huawei:mp:1234567890",
    "endTime": 1609380000000000000,
    "startTime": 1609293600000000000,
    "samplePoints": [{
        "dataTypeName": "com.huawei.continuous.ecg_detail",
	"endTime": 1609293600000000000,
	"startTime": 1609293600000000000,
	"value": [{
            "fieldName": "ecg_type",
	    "integerValue": 1
	},
	{
            "fieldName": "voltage_datas",
	    "stringValue": "[798403.44, 357466.56, -164880.53, -279694.4]"
	}]
    }]
}
```
 **Response body** 
```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "dataCollectorId": "raw:com.huawei.continuous.ecg_detail:300013102:huawei:mp:1234567890",
    "endTime": 1609380000000000000,
    "startTime": 1609293600000000000,
    "samplePoints": [{
        "dataTypeName": "com.huawei.continuous.ecg_detail",
	"endTime": 1609293600000000000,
	"startTime": 1609293600000000000,
	"value": [{
            "fieldName": "ecg_type",
	    "integerValue": 1
	},
	{
            "fieldName": "voltage_datas",
	    "stringValue": "[798403.44, 357466.56, -164880.53, -279694.4]"
	}]
    }]
}
```

- Write the ECG records to **HealthRecord** and associate the ECG details. **HTTP request**. For details, see the [Upload Health Record](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/health-record-create-0000001096044054-V5#EN-US_TOPIC_0000001096044054__section4148124910217) API. 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/dataCollectorId/healthRecords
```
 **Request example** 
```cpp
PATCH 
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.ecg_record:300013102:huawei:mp:1234567890/healthRecords
```
 **Request body** 
```cpp
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
    "healthRecords": [{
	"startTime": 1609293600000000000,
	"endTime": 1609380000000000000,
	"dataTypeName": "com.huawei.continuous.ecg_record",
	"value": [{
	    "fieldName": "ecg_type",
	    "integerValue": 1,
	    "mapValue": []
	},
	{
	    "fieldName": "avg_heart_rate",
	    "integerValue": 75,
	    "mapValue": []
	},
	{
	    "fieldName": "ecg_arrhythmia_type",
	    "longValue": 0,
	    "mapValue": []
	},
	{
	    "fieldName": "user_symptom",
	    "longValue": 0,
	    "mapValue": []
	},
	{
	    "fieldName": "sampling_frequency",
	    "integerValue": 0,
	    "mapValue": []
	},
	{
	    "fieldName": "ecg_algorithm_version",
	    "stringValue": "1.0",
	    "mapValue": []
	}],
	"subDataRelation": [{
	    "startTime": 1609293600000000000,
	    "endTime": 1609380000000000000,
	    "dataTypeName": "com.huawei.continuous.ecg_detail",
	    "dataCollectorId": "raw:com.huawei.continuous.ecg_detail:300013103:huawei:mp:1234567890"
	}]
    }]
}
```
 **Response body** 
```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "healthRecords": [{
	"startTime": 1609293600000000000,
	"endTime": 1609380000000000000,
	"dataTypeName": "com.huawei.continuous.ecg_record",
	"value": [{
	    "fieldName": "ecg_type",
	    "integerValue": 1,
	    "mapValue": []
	},
	{
	    "fieldName": "avg_heart_rate",
	    "integerValue": 75,
	    "mapValue": []
	},
	{
	    "fieldName": "ecg_arrhythmia_type",
	    "longValue": 0,
	    "mapValue": []
	},
	{
	    "fieldName": "user_symptom",
	    "longValue": 0,
	    "mapValue": []
	},
	{
	    "fieldName": "sampling_frequency",
	    "integerValue": 0,
	    "mapValue": []
	},
	{
	    "fieldName": "ecg_algorithm_version",
	    "stringValue": "1.0",
	    "mapValue": []
	}],
	"id": "cmF3OmNvbS5odWF3ZWkuY29udGludW91cy5lY2dfcmVjb3JkOjMwMDAxMzEwMzpodWF3ZWk6bXA6MTIzNDU2Nzg5MC0xNjA5MzgwMDAwMDAwMDAwMDAw",
	"subDataRelation": [{
	    "startTime": 1609293600000000000,
	    "endTime": 1609380000000000000,
	    "dataTypeName": "com.huawei.continuous.ecg_detail",
	    "dataCollectorId": "raw:com.huawei.continuous.ecg_detail:300013103:huawei:mp:1234567890"
	}]
    }]
}
```
