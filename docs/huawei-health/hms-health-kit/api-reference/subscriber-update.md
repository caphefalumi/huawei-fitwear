<!--
  Title: Registering or Updating a Subscriber
  Catalog: HMSCore-References-V5
  Document ID: subscriber-update-0000001088731561-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/subscriber-update-0000001088731561-V5
-->
# Registering or Updating a Subscriber

#### Function

Registers or updates a subscriber.

#### Scenario

Apps are subscribers, and when the user data are being updated, Health Kit notifies the server of the callback address for receiving real-time data change notifications.

#### Restrictions

The Health Kit operations management console automatically triggers the subscriber registration process upon automatic or manual approval.

#### API Prototype

| **Protocol** | HTTPS POST |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/subscribers |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

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

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| appId | String | M | App ID. |
| subscriberId | String | O | Subscriber ID. The **subscriberId** parameter needs to be set only when updating a subscriber. |
| url | String | M | The full URL (for example, "https://www.example.com/healthkit/notifications") of the subscriber endpoint that will send the update notifications. |
| preferred | Boolean | O | Indicates whether a subscriber is the default one. • **true**: yes. • **false**: no. If this parameter is not set and there is no default subscriber, the current one is set as default. |

#### Request Example

```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/subscribers
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
  "appId": "101524371",
  "url": "https://lfhealthdev.hwcloudtest.cn/test/healthkit/notifications",
  "preferred": true
}
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
| appId | String | M | App ID. |
| subscriberId | String | M | Subscriber ID. |
| url | String | M | The full URL (for example, "https://www.example.com/healthkit/notifications") of the subscriber endpoint that will send the update notifications. |
| secret | String | M | Subscriber signature verification key. |
| preferred | String | M | Indicates whether a subscriber is the default one. • **true**: yes. • **false**: no. |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "appId": "101524371",
    "subscriberId": "a2613ab0-19d8-4126-b18f-7779405b5992",
    "url": "https://lfhealthdev.hwcloudtest.cn/test/healthkit/notifications",
    "secret": "mBCXS53KJC8DDskgOBH8ry2T0Si8DBV8pGrouoWlaPc=",
    "preferred": true
}
```

#### Result Codes

For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
