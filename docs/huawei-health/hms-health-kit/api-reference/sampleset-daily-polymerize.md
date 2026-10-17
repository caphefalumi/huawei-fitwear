<!--
  Title: Querying Sampling Data by Day
  Catalog: HMSCore-References-V5
  Document ID: sampleset_daily_polymerize-0000001078113560-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sampleset_daily_polymerize-0000001078113560-V5
-->
# Querying Sampling Data by Day

#### Function

Groups and queries data of a specific type by day using the specified rules.

#### Scenario

Groups and queries sampling data by day.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS POST |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:dailyPolymerize |
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

| Parameter | Type | Mandatory (M)/Optional (O) | Description | Restrictions |
| --- | --- | --- | --- | --- |
| startDay | String | M | Start date of the data to be grouped. Unit: day | The format is yyyyMMdd, and the value cannot be earlier than 20140101. |
| endDay | String | M | End date of the data to be grouped. Unit: day | The format is yyyyMMdd. The value of **endDay** cannot be earlier than that of **startDay**. The interval between **endDay** and **startDay** must not exceed 30 days. |
| dataTypes | List<String> | M | Type of the data to be grouped. At least one data type must be provided. Each data type maps to one grouped sampling dataset. | A maximum of 20 entries are allowed in the list. |
| timeZone | String | M | Sets the time zone. | Format: +0800. |

#### Request Example

```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:dailyPolymerize
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
 "dataTypes": [
   "com.huawei.continuous.steps.delta"
 ],
 "startDay": "20200811",
 "startTime": "20200812",
 "timeZone": "+0800"
}
```

#### Response Parameters

**When the status code is 200:**

**Response Header**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| Content-Type | String | M | Value: **application/json; charset=UTF-8** |
| x-health-app-privacy | int | M | Whether the user has granted authorization in the Health app. The values are as follows: **1**: The user has granted authorization in the Health app. **2**: The user has not granted authorization in the Health app. **3**: The user is not a Health app user (authorization not required). |

**Response Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| group | List<Group> | M | List of the grouped data. For details, see [Group](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1943715915337). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "group": [
        {
            "startTime": 1597075200000,
            "endTime": 1597161600000,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.continuous.steps.total:com.huawei.hms.hihealth.service:polymerized",
                    "samplePoints": [
                        {
                            "startTime": 1597112084570000000,
                            "endTime": 1597112384570000000,
                            "dataTypeName": "com.huawei.continuous.steps.total",
                            "originalDataCollectorId": "raw:com.huawei.continuous.steps.delta:com.huawei.health:Huawei:006S:1000:300000000004929007",
                            "value": [
                                {
                                    "fieldName": "steps",
                                    "integerValue": 9000,
                                    "mapValue": []
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "startTime": 1563244260000,
            "endTime": 1563330660000,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.continuous.steps.total:com.huawei.hms.hihealth.service:polymerized",
                    "samplePoints": []
                }
            ]
        }
    ]
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).

#### Grouped Data Types

For details about the data type mapping, see [Mapping Between Statistical Data Types and Atomic Data Types](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/public-dt-0000001050069714-V5#EN-US_TOPIC_0000001051066438__section1319045413231).
