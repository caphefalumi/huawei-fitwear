<!--
  Title: Creating a Data Collector
  Catalog: HMSCore-References-V5
  Document ID: datacollectors_create-0000001050114852-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5
-->
# Creating a Data Collector

#### Function

A **DataCollector** can be used to collect the raw data from sensors or derived data (after being converted or combined).

This method is used to create a data collector. The ID of the data collector combines certain fields in the request body based on specific rules and is unique among all data collectors of this user.

#### Scenario

A sensor can collect data of one or more dimensions. Multiple **DataCollector**s need to be created for multiple dimensions. Each **DataCollector** corresponds to a single dimension.

#### Restrictions

**DataCollectorId** must meet the following naming rules:

collectorType:collectorDataType.name:appInfo.appPackageName:deviceInfo.manufacturer:deviceInfo.modelNum:deviceInfo.uniqueId:collectorName

When setting this parameter, make sure that its value is the same as the related fields in the request body.

#### API Prototype

| **Protocol** | HTTPS POST |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

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

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| collectorType | String | M | Type of the data collector. The value can be: • **raw**: original data type • **derived**: derived data type |
| appInfo | AppInfo | M | App information of the data collector. For details, see [AppInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section982495714175). |
| collectorDataType | DataType | M | Data type. For details, see [DataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section16473950171714). |
| collectorId | String | O | Unique ID of the data collector. It is generated with certain fields in the request body based on specified rules. |
| collectorName | String | O | Name used to internally identify a data collector created for a certain data type by the user. |
| name | String | O | Data collector's name to display in your app. |
| deviceInfo | DeviceInfo | O | Description of the hardware device that integrates various sensors, such as a watch, a band, or any other wearable devices. For details, see [DeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section135613218188). |

#### Request Example

```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
  "collectorName": "DataCollectorExample",
  "collectorType": "raw",
  "appInfo": {
    "appPackageName": "com.huawei.demo",
    "appName": "Example App",
    "desc": "https://huaweiapi.com",
    "appVersion": "1"
  },
  "collectorDataType": {
    "name": "com.huawei.continuous.steps.delta"
  },
  "deviceInfo": {
    "manufacturer": "huawei",
    "modelNum": "ExampleTablet",
    "devType": "Phone",
    "uniqueId": "1000",
    "version": "1.0"
  }
}
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
| collectorType | String | M | Type of the data collector. The value can be: • **raw**: original data type • **derived**: derived data type |
| appInfo | AppInfo | M | App information of the data collector. For details, see [AppInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section982495714175). |
| collectorDataType | DataType | M | Data type. For details, see [DataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section16473950171714). |
| collectorId | String | O | Unique identifier of the data collector. It is generated with certain fields in the request body based on specified rules. |
| collectorName | String | O | Internal identifier. The name is used to identify a data collector created for a certain data type by the user. |
| name | String | O | Data collector's name to display in your app. |
| deviceInfo | DeviceInfo | O | Description of the hardware device that integrates various sensors, such as a watch, a band, or any other wearable devices. For details, see [DeviceInfo](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section135613218188). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
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
        "appVersion": "1",
        "desc": "https://huaweiapi.com",
        "clientId": "101222525"
    }
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).
