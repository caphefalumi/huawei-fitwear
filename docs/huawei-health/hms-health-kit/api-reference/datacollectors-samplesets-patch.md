<!--
  Title: Uploading Sampling Data
  Catalog: HMSCore-References-V5
  Document ID: datacollectors_samplesets_patch-0000001050114858-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_patch-0000001050114858-V5
-->
# Uploading Sampling Data

#### Function

Uploads the sampling data collected by the data collector.

#### Scenario

Adds a SamplePoint to a SampleSet under a specified dataCollector. The SampleSet does not need to be created in advance.

#### Restrictions

- A data collector of the corresponding data type needs to be created first.
- Sampling data from a data collector can be uploaded only by the app that created it. Other apps can only read data from the data collector.

#### API Prototype

| **Protocol** | HTTPS PATCH |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/{**dataCollectorId**}/sampleSets/{**sampleSetId**} |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataCollectorId | String | M | Unique identifier of the data collector. For details, please refer to [dataCollectorId restrictions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section560162864714). |
| sampleSetId | String | M | Identifier of the sampling dataset (in nanoseconds). The format must be startTime-endTime, where the startTime/endTime must be a 19-digit integer timestamp, ranging from 2000-01-01 00:00:00 to 2099-12-31 23:59:59. |

#### Input Parameters

**Request Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-type | String | M | Value: **application/json; charset=UTF-8** |
| Authorization | String | M | For details, please refer to [OAuth 2.0-based Authentication](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5). NOTE: A space character must be added between **Bearer** and the value of **access_token**. |
| x-client-id | String | O | App ID allocated by HUAWEI Developers. The server can perform gray routing based on this parameter. It is recommended that this parameter be carried. |
| x-version | String | O | Software version number of the app calling the API, that is, the version number of the current client. The server can perform gray release based on this parameter. It is recommended that this parameter be carried. |
| x-caller-trace-id | String | O | Request tracing ID, which is used to connect the entire request chain between the service calling party and server. It is recommended that this parameter be carried. |

**Request Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataCollectorId | String | M | Unique identifier of the data collector. The dataCollectorId value must be the same in the input parameters and request body. |
| startTime | Long | M | The minimum start time among all SamplePoints (in nanoseconds). |
| endTime | Long | M | The maximum end time among all SamplePoints (in nanoseconds). |
| samplePoints | List<SamplePoint> | M | SamplePoint list. A maximum of 1000 SamplePoints can be uploaded for each patch operation. For details, please refer to [SamplePoint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1420111125182). |

#### Request Example

```cpp
PATCH
https://health-api.cloud.huawei.com /healthkit/v1/dataCollectors/raw:com.huawei.continuous.calories.burnt:300013103:huawei:mp:123456789011/sampleSets/1567267200000000000-1567440000000000000
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
  "dataCollectorId": "raw:com.huawei.continuous.calories.burnt:300013103:huawei:mp:123456789011",
  "startTime": 1567267200000000000,
  "endTime": 1567440000000000000,
  "samplePoints": [
    {
      "dataTypeName": "com.huawei.continuous.calories.burnt",
      "endTime": 1567310400000000000,
      "startTime": 1567267200000000000,
      "value": [
        {
          "fieldName": "calories",
          "floatValue": 3
        }
      ]
    }
  ]
}
```

#### Response Parameters

**When the status code is 200:**

**Response Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-Type | String | M | Value: **application/json; charset=UTF-8** |

**Response Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| startTime | Long | M | The minimum start time among all SamplePoints (in nanoseconds). |
| endTime | Long | M | The maximum end time among all SamplePoints (in nanoseconds). |
| dataCollectorId | String | M | Unique identifier of the data collector. The dataCollectorId value must be the same in the input parameters and request body. |
| samplePoints | List<SamplePoint> | M | SamplePoint list. For details, please refer to [SamplePoint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1420111125182). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "startTime": 1567267200000000000,
    "endTime": 1567440000000000000,
    "dataCollectorId": "raw:com.huawei.continuous.calories.burnt:300013103:huawei:mp:123456789011",
    "samplePoints": [
        {
            "startTime": 1567267200000000000,
            "endTime": 1567310400000000000,
            "dataTypeName": "com.huawei.continuous.calories.burnt",
            "value": [
                {
                    "fieldName": "calories",
                    "floatValue": 3,
                    "mapValue": []
                }
            ]
        }
    ]
}
```

#### Result Codes

For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
