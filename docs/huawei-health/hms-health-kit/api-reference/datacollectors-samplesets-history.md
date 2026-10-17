<!--
  Title: Querying the Historical Records of Sampling Data
  Catalog: HMSCore-References-V5
  Document ID: datacollectors_samplesets_history-0000001050116809-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_samplesets_history-0000001050116809-V5
-->
# Querying the Historical Records of Sampling Data

#### Function

Queries the historical records of sampling data of a specified data collector.

#### Scenario

Queries the historical records of sampling data based on dataCollectorId.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/{**dataCollectorId**}/sampleSets/history?**limit**=***&**cursor**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataCollectorId | String | M | Unique identifier of the data collector. For details, please refer to [dataCollectorId restrictions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5#EN-US_TOPIC_0000001053248377__section560162864714). |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| limit | Integer | O | Length of a single paginated query. Value range: 0–1000 |
| cursor | String | O | Pagination marker. Set this parameter to the value of **cursor** from the previous request, for subsequent queries. Length range: 1 to 1000 characters (lower-case letter or digits) |

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

None.

#### Request Example

```cpp
GET
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.distance.delta:300013103:huawei:mp:1234567890661/sampleSets/history?limit=1&cursor=WUxyRjFIWWtMYWFBUldhUnZTTDBOeFRqODhTZlJ1YkNZMjRPS2tFaVN1bEVnSnBmR1o2Mm8zaz0=
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
| insertedSamplePoint | List<SamplePoint> | O | Inserted SamplePoint list. For details, please refer to [SamplePoint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1420111125182). |
| deletedSamplePoint | List<SamplePoint> | O | Deleted SamplePoint list. For details, please refer to [SamplePoint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1420111125182). |
| cursor | String | O | Cursor for the next paginated query. |
| dataCollectorId | String | O | Unique identifier of the data collector. |
| hasMoreData | Boolean | O | Indicates whether there is more data to be queried. • true: There is more data to be queried. Continue the query based on the returned value of cursor. • false: The current query is complete. The default value is **false**. |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "insertedSamplePoint": [
        {
            "startTime": 1577206800000000000,
            "endTime": 1577210400000000000,
            "dataTypeName": "com.huawei.continuous.distance.delta",
            "value": [
                {
                    "fieldName": "distance_delta",
                    "floatValue": 4,
                    "mapValue": []
                }
            ],
            "modifyTime": 1577273949194
        }
    ],
    "deletedSamplePoint": [
        {
            "startTime": 1577206900000000000,
            "endTime": 1577220400000000000,
            "dataTypeName": "com.huawei.continuous.distance.delta",
            "value": [
                {
                    "fieldName": "distance_delta",
                    "floatValue": 4,
                    "mapValue": []
                }
            ],
            "modifyTime": 1577273949594
        }
    ],
    "cursor": "KzNJSEdOTFJUZlFXM3JNUUJOYkxlaWJTUmxYTEJyN3ZxVnVhQ28yS3g2UTY1a2ZmZVl1TUVBaz0=",
    "dataCollectorId": "raw:com.huawei.continuous.distance.delta:300013103:huawei:mp:1234567890661",
    "hasMoreData": true
}
```

#### Result Codes

For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
