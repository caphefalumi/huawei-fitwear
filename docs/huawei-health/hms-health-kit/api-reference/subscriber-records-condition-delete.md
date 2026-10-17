<!--
  Title: Deleting Subscription Records by Condition
  Catalog: HMSCore-References-V5
  Document ID: subscriber-records-condition-delete-0000001076749758-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/subscriber-records-condition-delete-0000001076749758-V5
-->
# Deleting Subscription Records by Condition

#### Function

Deletes subscription records by condition.

#### Scenario

Deletes subscription records by **eventType**.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS DELETE |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/subscriptions?**eventType**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| subscriptionId | String | M | Unique ID of a subscription record. |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| eventType | String | M | Event that is being followed or has been subscribed. |

#### Input Parameters

**Request Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-type | String | M | Value: application/json; charset=UTF-8 |
| Authorization | String | M | For details, please refer to [OAuth 2.0-based Authentication](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/open-platform-oauth-0000001053629189-V5). NOTE: A space character must be added between **Bearer** and the value of **access_token**. |
| x-client-id | String | O | App ID allocated by HUAWEI Developers. The server can perform gray routing based on this parameter. It is recommended that this parameter be carried. |
| x-version | String | O | Software version number of the app calling the API, that is, the version number of the current client. The server can perform gray release based on this parameter. It is recommended that this parameter be carried. |
| x-caller-trace-id | String | O | Request tracing ID, which is used to connect the entire request chain between the service calling party and server. It is recommended that this parameter be carried. |

**Request Body**

None.

#### Request Example

```cpp
DELETE
https://health-api.cloud.huawei.com/healthkit/v1/subscriptions?eventType=ACTIVITY_RECORD_EVENT$DELETE
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
| Content-Type | String | M | Value: application/json; charset=UTF-8 |

**Response Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| subscriptions | List<Subscription> | M | Indicates that the subscription record has been successfully registered. For details, please refer to the Subscription section of [Data Model](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section23291756123419). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
[
    {
        "appId": "101524371",
        "eventType": "ACTIVITY_RECORD_EVENT$DELETE",
        "subscriberId": "a2613ab0-19d8-4126-b18f-7779405b5992",
        "subscriptionId": "641eeec8-a9c1-4c4c-9789-4963b92a6c46",
        "openId": "MDFAMTAxNTI0MzcxQGQ0Y2M3N2UxZTVmNjcxNWFkMWQ5Y2JjYjlmZDZiaNTY3QDVhNmNkY2FiaMTFhYzc4NDk4NDI0MzJiaNjg0MzViaYmUyMGEzZjZkNzUzYWVjM2Q5ZTgwYWM5NTgzNmY"
    }
]
```

#### Result Codes

For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
