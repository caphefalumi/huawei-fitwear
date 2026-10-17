<!--
  Title: Querying Health Records in a Specified Period
  Catalog: HMSCore-References-V5
  Document ID: get-health-record-by-timspan-0000001096203878-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/get-health-record-by-timspan-0000001096203878-V5
-->
# Querying Health Records in a Specified Period

#### Function

Queries health records in a specified period.

#### Scenario

Specifies the start time and end time to return the health records collected by the specified data collector within the specified time range.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/{**dataCollectorId**}/healthRecords?**startTime=***&endTime=***&limit****=***&****cursor**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataCollectorId | String | M | Unique identifier of the data collector. For details, see [dataCollectorId restrictions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section560162864714). |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| startTime | Long | M | Start time. The unit is nanoseconds. |
| endTime | Long | M | End time. The unit is nanoseconds. |
| limit | Integer | O | Length of a single paginated query. Value range: 0–2000. |
| cursor | String | O | Pagination marker. Set this parameter to the value of cursor from the previous request, for subsequent queries. Length range: 1 to 1000 characters (lower-case letter or digits). |

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
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.ecg_record:300013103:huawei:mp:1234567890/healthRecords?startTime=1609293600000000000&endTime=1609380000000000000
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

**Response Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| healthRecords | List<HealthRecords> | M | Health record list. For details, see the [HealthRecord](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1362316521971) data model. |
| cursor | String | O | Pagination marker. Set this parameter to the value of cursor from the previous request, for subsequent queries. Length range: 1 to 1000 characters (lower-case letter or digits) |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "healthRecords": [
        {
            "startTime": 1609293600000000000,
            "endTime": 1609380000000000000,
            "dataTypeName": "com.huawei.continuous.ecg_record",
            "value": [
                {
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
                }
            ],
            "id": "cmF3OmNvbS5odWF3ZWkuY29udGludW91cy5lY2dfcmVjb3JkOjMwMDAxMzEwMzpodWF3ZWk6bXA6MTIzNDU2Nzg5MC0xNjA5MzgwMDAwMDAwMDAwMDAw",
            "subDataRelation": [
                {
                    "startTime": 1609293600000000000,
                    "endTime": 1609380000000000000,
                    "dataTypeName": "com.huawei.continuous.ecg_detail",
                    "dataCollectorId": "raw:com.huawei.continuous.ecg_detail:300013103:huawei:mp:1234567890"
                }
            ]
        }
    ]
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
