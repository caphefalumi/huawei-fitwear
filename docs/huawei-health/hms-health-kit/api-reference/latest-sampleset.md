<!--
  Title: Querying the Latest Sampling Data
  Catalog: HMSCore-References-V5
  Document ID: latest-sampleset-0000001078273166-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/latest-sampleset-0000001078273166-V5
-->
# Querying the Latest Sampling Data

#### Function

Queries the latest sampling data point of a specified data type.

#### Scenario

Specifies the data type and queries its latest sampling data point. If no sampling data point is available, no value is returned.

#### Restrictions

Currently, the following data types are supported: heart rate, resting heart rate, blood pressure, blood oxygen, blood glucose, weight, height, and stress. For details, see [Public Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5).

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/sampleSets/latestSamplePoint?**dataType****=***** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataType | List<String> | M | Data type name. This parameter must contain 1 to 20 data types. |

#### Input Parameters

**Request Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-type | String | M | Value: **application/json; charset=UTF-8** |
| Authorization | String | M | For details, see [OAuth 2.0-based Authentication](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5). NOTE: A space character must be added between **Bearer** and the value of **access_token**. |
| x-client-id | String | O | App ID allocated by HUAWEI Developers. The server can perform gray routing based on this parameter. It is recommended that this parameter be carried. |
| x-version | String | O | Software version number of the app calling the API, that is, the version number of the current client. The server can perform gray release based on this parameter. It is recommended that this parameter be carried. |
| x-caller-trace-id | String | O | Request tracing ID, which is used to connect the entire request chain between the service calling party and server. It is recommended that this parameter be carried. |

**Request Body**

None.

#### Request Example

```cpp
GET
https://health-api.cloud.huawei.com/healthkit/v1/sampleSets/latestSamplePoint?dataType=com.huawei.instantaneous.body_weight&
dataType=com.huawei.instantaneous.blood_glucose
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
```

#### Response Parameters

**When the status code is 200:**

**Response Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-Type | String | M | Value: **application/json; charset=UTF-8** |
| x-health-app-privacy | int | M | Whether the user has granted authorization in the Health app. The values are as follows: **1**: The user has granted authorization in the Health app. **2**: The user has not granted authorization in the Health app. **3**: The user is not a Health app user (authorization not required). |

**Response Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| samplePoints | Map<String, SamplePoint> | M | Sampling data point mapping to each data type. For details, see [SamplePoint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1420111125182). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "samplePoints": {
        "com.huawei.instantaneous.body_weight": {
            "startTime": 1611581350203000000,
            "endTime": 1611581350303000000,
            "dataTypeName": "com.huawei.instantaneous.body_weight",
            "originalDataCollectorId": "raw:com.huawei.instantaneous.body_weight:com.huawei.health:Huawei:006S:123456:300000000005047066",
            "value": [
                {
                    "fieldName": "body_weight",
                    "floatValue": 56,
                    "mapValue": []
                },
                {
                    "fieldName": "bmi",
                    "floatValue": 80,
                    "mapValue": []
                },
                {
                    "fieldName": "body_fat",
                    "floatValue": 27,
                    "mapValue": []
                },
                {
                    "fieldName": "body_fat_rate",
                    "floatValue": 25,
                    "mapValue": []
                },
                {
                    "fieldName": "muscle_mass",
                    "floatValue": 35,
                    "mapValue": []
                },
                {
                    "fieldName": "basal_metabolism",
                    "floatValue": 1200,
                    "mapValue": []
                },
                {
                    "fieldName": "moisture",
                    "floatValue": 20,
                    "mapValue": []
                },
                {
                    "fieldName": "moisture_rate",
                    "floatValue": 15,
                    "mapValue": []
                },
                {
                    "fieldName": "visceral_fat_level",
                    "floatValue": 25,
                    "mapValue": []
                },
                {
                    "fieldName": "bone_salt",
                    "floatValue": 1.5,
                    "mapValue": []
                },
                {
                    "fieldName": "protein_rate",
                    "floatValue": 30,
                    "mapValue": []
                },
                {
                    "fieldName": "body_age",
                    "integerValue": 21,
                    "mapValue": []
                },
                {
                    "fieldName": "body_score",
                    "floatValue": 85,
                    "mapValue": []
                },
                {
                    "fieldName": "skeletal_musclel_mass",
                    "floatValue": 70,
                    "mapValue": []
                },
                {
                    "fieldName": "impedance",
                    "floatValue": 30,
                    "mapValue": []
                }
            ]
        },
        "com.huawei.instantaneous.blood_glucose": {
            "startTime": 1582347532821000000,
            "endTime": 1582347532821000000,
            "dataTypeName": "com.huawei.instantaneous.blood_glucose",
            "originalDataCollectorId": "raw:com.huawei.instantaneous.blood_glucose:com.huawei.health:Huawei:006S:1000:300000000004929007",
            "value": [
                {
                    "fieldName": "level",
                    "floatValue": 9.7,
                    "mapValue": []
                },
                {
                    "fieldName": "measure_time",
                    "integerValue": 5,
                    "mapValue": []
                }
            ]
        }
    }
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
