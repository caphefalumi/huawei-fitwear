<!--
  Title: Querying Sampling Datasets Within a Duration
  Catalog: HMSCore-References-V5
  Document ID: datacollectors_samplesets_get-0000001050116811-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_get-0000001050116811-V5
-->
# Querying Sampling Datasets Within a Duration

#### Function

Queries sampling datasets within a specified duration.

#### Scenario

Returns sampling datasets of a specified data collector within a specified duration.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/{**dataCollectorId**}/sampleSets/{**sampleSetId**}?**limit****=***&****cursor**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataCollectorId | String | M | Unique identifier of the data collector. For details, see [dataCollectorId restrictions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section560162864714). |
| sampleSetId | String | M | Identifier of the sampling dataset (in nanoseconds). The format is startTime-endTime. startTime and endTime must be a 19-digit timestamp, and the interval between endTime and startTime cannot exceed 30 days. The value ranges from 2000-01-01 00:00:00 to 2099-12-31 23:59:59. |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| limit | Integer | O | Length of a single paginated query. Value range: [0, 2000] |
| cursor | String | O | Pagination marker. Set this parameter to the value of **cursor** from the previous request, for subsequent queries. Length range: 1 to 1000 characters (lower-case letter or digits) |

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
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.calories.burnt:300013103:huawei:mp:123456789011/sampleSets/1567267200000000000-1567440000000000000
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
| startTime | Long | M | The minimum start time among all SamplePoints (in nanoseconds). |
| endTime | Long | M | The maximum end time among all SamplePoints (in nanoseconds). |
| dataCollectorId | String | M | Unique identifier of the data collector. The dataCollectorId value must be the same in the input parameters and request body. |
| samplePoints | List<SamplePoint> | M | SamplePoint list. For details, see [SamplePoint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1420111125182). |
| cursor | String | O | Pagination marker. Set this parameter to the value of **cursor** from the previous request, for subsequent queries. Length range: 1 to 1000 characters (lower-case letter or digits) |

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
            ],
            "modifyTime": 1577270305311
        }
    ]
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
