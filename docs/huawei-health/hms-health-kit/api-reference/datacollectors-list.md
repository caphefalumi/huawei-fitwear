<!--
  Title: Querying All Data Collectors
  Catalog: HMSCore-References-V5
  Document ID: datacollectors_list-0000001050114856-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_list-0000001050114856-V5
-->
# Querying All Data Collectors

#### Function

Queries the list of all **DataCollector**s.

#### Scenario

- Queries the list of all data collectors that are visible to the user (based on the OAuth permission).
- Queries the corresponding data collectors of the specified data type.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors?**dataTypeName**=*****&cursor**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| dataTypeName | String | O | Data type name. If not specified, all data collectors of the user will be returned. Length range: 1 to 300 characters The value can be a [public data type](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5) provided by Huawei, or a customized data type. |
| cursor | String | O | Pagination marker. If the number of returned records exceeds 10,000, the pagination marker will be returned for subsequent queries. Length range: 1 to 1000 characters (lower-case letter or digits) |

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
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors?dataTypeName=com.huawei.continuous.steps.delta
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
| dataCollector | List<DataCollector> | M | A previously created, visible **DataCollector** list (based on the OAuth permission). For details, see [DataCollector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1278159191019). |
| cursor | String | O | Pagination marker. (A maximum of 10,000 data records can be returned each time. If the number of returned records exceeds 10,000, the pagination marker will be returned for subsequent queries.) |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
{
    "dataCollector": [
        {
            "collectorId": "raw:com.huawei.continuous.steps.delta:com.huawei.demo:huawei:ExampleTablet:1000:DataCollectorExample",
            "collectorName": "DataCollectorExample",
            "collectorType": "raw",
            "collectorDataType": {
                "name": "com.huawei.continuous.steps.delta",
                "field": [
                    {
                        "name": "steps_delta",
                        "format": "integer"
                    }
                ]
            },
            "deviceInfo": {
                "uniqueId": "1000",
                "devType": "Phone",
                "version": "1.0",
                "modelNum": "ExampleTablet",
                "manufacturer": "huawei"
            },
            "appInfo": {
                "appName": "Example App",
                "appPackageName": "com.huawei.demo",
                "appVersion": "2",
                "desc": "https://huaweiapi.com",
                "clientId": "101222525"
            },
            "lastUpdateTime": 1604973600000
        }
    ]
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
