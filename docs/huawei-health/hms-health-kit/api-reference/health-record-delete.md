<!--
  Title: Deleting Health Records in a Specified Period
  Catalog: HMSCore-References-V5
  Document ID: health-record-delete-0000001142963891-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/health-record-delete-0000001142963891-V5
-->
# Deleting Health Records in a Specified Period

#### Function

Deletes health records in a specified period.

#### Scenario

Specifies the start time and end time to delete the health records collected by the specified data collector within the specified time range.

#### Restrictions

Health records can be deleted from a data collector only by the app that created the records. Other apps can only read data from the data collector.

#### API Prototype

| **Protocol** | HTTPS DELETE |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/{**dataCollectorId**}/healthRecords?**startTime**=***&**endTime**=***&**deleteSubData**=*** |
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
| deleteSubData | Boolean | O | Whether to delete the subdata. • **true**: Delete the subdata. • **false**: Do not delete the subdata. |

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
DELETE
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors/raw:com.huawei.continuous.ecg_record:300013103:huawei:mp:1234567890/healthRecords?startTime=1609293600000000000&endTime=1609380000000000000
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
```

#### Response Parameters

**When the status code is 204:**

**Response Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-Type | String | M | Value: **application/json; charset=UTF-8** |

**Response Body**

None.

#### Response Example

```cpp
HTTP 204 No Content
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).

#### Relationship Between Health Record Subdata Types

For details about the relationships between subdata types, see [Relationship Between Health Record Subdata Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section49731618163411).
