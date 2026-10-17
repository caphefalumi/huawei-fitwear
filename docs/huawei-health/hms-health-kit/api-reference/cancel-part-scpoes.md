<!--
  Title: Revoking Certain Permissions Granted to an App
  Catalog: HMSCore-References-V5
  Document ID: cancel-part-scpoes-0000001059102201-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/cancel-part-scpoes-0000001059102201-V5
-->
# Revoking Certain Permissions Granted to an App

#### Function

Revokes some of the permissions that the user has granted to an app.

#### Scenario

Revoke some permissions granted to an app.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS DELETE |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/consents/{**appId**}?**scopesUrl**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| appId | String | M | ID of an app. |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| scopesUrl | String | M | List of URLs for permissions to be revoked. Separate the URLs with spaces and encode them. |

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
https://health-api.cloud.huawei.com/healthkit/v1/consents/123456789?lang=zh-cn&scopesUrl=https%3A%2F%2Fwww.huawei.com%2Fhealthkit%2Fbodyfat.read%20https%3A%2F%2Fwww.huawei.com%2Fhealthkit%2Fheightweight.read
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

None.

#### Response Example

```cpp
HTTP/1.1 200 OK
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
