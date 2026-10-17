<!--
  Title: Querying Subscribers
  Catalog: HMSCore-References-V5
  Document ID: subscriber-list-0000001077197798-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/subscriber-list-0000001077197798-V5
-->
# Querying Subscribers

#### Function

Queries information about all registered subscribers of an app.

#### Scenario

- Queries subscribers using the Health Kit operation management console.
- Queries subscribers using the app.

#### Restrictions

You can query the subscriber information of any app using the Health Kit operation management console. However, using the app, you can only query its own subscriber information.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/subscribers?**appId**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| appId | String | M | App ID. |

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
GET
https://health-api.cloud.huawei.com/healthkit/v1/subscribers?appId=101524371
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
| subscribers | List<Subscriber> | M | List of registered subscribers. For details, please refer to the Subscriber section of [Data Model](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1814572591116). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
[
    {
        "appId": "101524371",
        "subscriberId": "a2613ab0-19d8-4126-b18f-7779405b5992",
        "url": "https://lfhealthdev.hwcloudtest.cn/test/healthkit/notifications",
        "secret": "mBCXS53KJC8DDskgOBH8ry2T0Si8DBV8pGrouoWlaPc=",
        "preferred": true
    }
]
```

#### Result Codes

For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
