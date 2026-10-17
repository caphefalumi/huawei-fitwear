<!--
  Title: Grouping Sampling Data
  Catalog: HMSCore-References-V5
  Document ID: sampleset_polymerize-0000001050114864-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/sampleset_polymerize-0000001050114864-V5
-->
# Grouping Sampling Data

#### Function

Groups data of a specified data type or data collector using the specified rules.

#### Scenario

Groups sampling data in the following ways:

- Groups sampling data within a specified period of time.
- Groups sampling data by day.
- Groups sampling data by week.
- Groups sampling data by month.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS POST |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:polymerize |
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
| startTime | Long | O | Start time of the duration for data to be grouped. If this parameter is not set, the value starts from 0. The unit is milliseconds. | The value must be a 13-digit integer timestamp. |
| endTime | Long | M | End time of the duration for data to be grouped. The unit is milliseconds. | The value must be a 13-digit integer timestamp. **endTime** must be later than **startTime**. The interval between **endTime** and **startTime** must not exceed 30 days. |
| polymerizeWith | List<PolymerizeWith> | M | Rule for grouping data. At least one rule must be specified. One rule maps to one sampling dataset. | A maximum of 20 entries are allowed in the list. For details, see [PolymerizeWith](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section221511853211). |
| groupByTime | GroupByTime | O | Data grouping by time interval. | For details, see [GroupByTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section156913161345). |

#### Request Example

```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/sampleSet:polymerize
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
 "polymerizeWith": [
   {
     "dataTypeName": "com.huawei.continuous.steps.delta"
   }
 ],
 "endTime": 1563330660000,
 "startTime": 1563157860000,
 "groupByTime": {
   "duration": 86400000
 }
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
| group | List<Group> | M | List of data groups. For details, see [Group](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section1943715915337). |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "group": [
        {
            "startTime": 1563157860000,
            "endTime": 1563244260000,
            "sampleSet": [
                {
                    "dataCollectorId": "derived:com.huawei.continuous.steps.total:com.huawei.hms.hihealth.service:polymerized",
                    "samplePoints": [
                        {
                            "startTime": 1563157860000000000,
                            "endTime": 1563157860000000000,
                            "dataTypeName": "com.huawei.continuous.steps.total",
                            "originalDataCollectorId": "raw:com.huawei.continuous.steps.delta:300013103:huawei:mp:123456789011",
                            "value": [
                                {
                                    "fieldName": "steps",
                                    "integerValue": 56,
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
