<!--
  Title: Querying the Permissions Granted to an App
  Catalog: HMSCore-References-V5
  Document ID: get-scopes-0000001059712559-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/get-scopes-0000001059712559-V5
-->
# Querying the Permissions Granted to an App

#### Function

Queries the permissions that the user has granted to an app.

#### Scenario

Queries the permissions that the user has granted to a specified app.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/consents/{**appId**}?**lang**=xxx |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Path Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| appId | String | M | ID of an app. |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| lang | String | M | Language, for example, zh-cn. |

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
https://health-api.cloud.huawei.com/healthkit/v1/consents/123456789?lang=zh-cn
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
| items | ScopeLangItem | M | List of permissions granted to the app. For details, see the [ScopeLangItem](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section186758010312) data model. |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "url2Desc": {
        "https://www.huawei.com/healthkit/bodyfat.read": "Views the body fat data (such as body fat rate, BMI, muscle mass, moisture rate, visceral fat, bone salt, protein ratio, and skeletal muscle mass) in Health Kit."
        "https://www.huawei.com/healthkit/sleep.read": "Views sleep data in Health Kit."
    },
    "authTime": "1603528607",
    "appName": "Test02",
    "appIconPath": "https://host***:18445/FileServer/getFile/app/000/618/992/0070086000000618992.20201019220927.54582229149325774705781775442476:50511029133600:2500:ED5EE445AC5E3280687B4B1061A80FA056EC367651B8009578E14C775CD99C32.png"
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
