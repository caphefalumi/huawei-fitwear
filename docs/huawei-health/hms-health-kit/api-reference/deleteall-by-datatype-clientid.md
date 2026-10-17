<!--
  Title: Deleting All Data Collectors and Sampling Datasets by Data Type
  Catalog: HMSCore-References-V5
  Document ID: deleteall-by-datatype-clientid-0000001063167930-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/deleteall-by-datatype-clientid-0000001063167930-V5
-->
# Deleting All Data Collectors and Sampling Datasets by Data Type

#### Function

Deletes all data created by the app based on data types.

#### Scenario

Deletes all data collectors and sampling datasets based on data types.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS DELETE |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors?**deleteMode**=**app**&**dataTypeName**=******* |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| deleteMode | String | M | Mode for deleting the data. The value can only be **App**, indicating that all data of an app is deleted. |
| dataTypeName | String | O | Data type based on which you want to delete data collectors and sampling datasets created by the app. |

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
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors?deleteMode=app&dataTypeName=com.huawei.continuous.steps.delta
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
