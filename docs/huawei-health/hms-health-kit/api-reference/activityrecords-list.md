<!--
  Title: Querying Created Activity Records
  Catalog: HMSCore-References-V5
  Document ID: activityrecords_list-0000001050114862-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/activityrecords_list-0000001050114862-V5
-->
# Querying Created Activity Records

#### Function

Queries **ActivityRecords** that have been created by a user.

#### Scenario

- Queries activity records in a specified period.
- Queries deleted activity records.
- Queries incremental activity records based on the cursor.

#### Restrictions

None.

#### API Prototype

| **Protocol** | HTTPS GET |
| --- | --- |
| **Direction** | App > Health Kit cloud |
| **URL** | https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?**startTime**=*****&endTime**=*****&activityType**=*** |
| Data Format | Request: Content-Type: application/json Response: Content-Type: application/json |

#### Query Parameters

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| startTime | String | M | Start time. Timestamp of a 13-digit integer, in milliseconds. **startTime** must be earlier than **endTime**. The value of **startTime** will be valid only when **endTime** is also specified, and vice versa. |
| endTime | String | M | End time. Timestamp of a 13-digit integer, in milliseconds. **startTime** must be earlier than **endTime**. The interval between the start and end times cannot exceed 30 days. |
| activityType | List<Integer> | O | List of activity types to be queried. For details, see [Activity Type Constants](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activity-types-0000001050071667-V5). |

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
https://health-api.cloud.huawei.com/healthkit/v1/activityRecords?startTime=1574524800000&endTime=1574784000000&activityType=89&activityType=5
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
| x-health-app-privacy | int | M | Whether the user has granted authorization in the Health app. The values are as follows: **1**: The user has granted authorization in the Health app. **2**: The user has not granted authorization in the Health app. **3**: The user is not a Health app user (authorization not required). |

**Response Body**

| Parameter | Type | Mandatory (M)/Optional (O) | Description |
| --- | --- | --- | --- |
| activityRecord | List<ActivityRecord> | O | List of **ActivityRecords** within the start/end time range. For details, see [ActivityRecord](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section141431025151817). |
| deletedActivityRecord | List<ActivityRecord> | O | List of deleted **ActivityRecords** within the start/end time range, which is valid when **includeDeleted** is set to **true**. For details, see [ActivityRecord](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/data-model-0000001054556973-V5#EN-US_TOPIC_0000001054556973__section141431025151817). |
| hasMoreData | Boolean | O | Indicates whether the server has more data. • **true:** There is more data. • **false**: There is no more data. The default value is **false**. |

#### Response Example

```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
x-health-app-privacy: 1
{
    "activityRecord": [
        {
            "id": "145789654314",
            "name": "app9session",
            "desc": "test",
            "startTime": 1574686124535,
            "endTime": 1574746124535,
            "modifyTime": 1574746244000,
            "appInfo": {
                "appName": "123",
                "appPackageName": "com.huawei.demo",
                "appVersion": "2",
                "desc": "",
                "clientId": "101222525"
            },
            "activityType": 89,
            "activeTime": 1800000
        },
        {
            "id": "1457896543155",
            "name": "app9session",
            "desc": "test",
            "startTime": 1574686124535,
            "endTime": 1574746124535,
            "modifyTime": 1574746304000,
            "appInfo": {
                "appName": "123",
                "appPackageName": "com.huawei.demo",
                "appVersion": "2",
                "desc": "",
                "clientId": "101222525"
            },
            "activityType": 89,
            "activeTime": 1800000
        }
    ],
    "deletedActivityRecord": []
}
```

#### Result Codes

For details, see [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/error-code-0000001054236973-V5).

#### Statistical Data Types Supported by the Activity Record Query API

You can call this API to view the statistical data types of **ActivitySummary** as described in the following table.

| Data Type | Type Name | Atomic Data Type |
| --- | --- | --- |
| Steps | com.huawei.continuous.steps.total | com.huawei.continuous.steps.delta |
| Distance | com.huawei.continuous.distance.total | com.huawei.continuous.distance.delta |
| Calories | com.huawei.continuous.calories.burnt.total | com.huawei.continuous.calories.burnt |
| Heart rate during workout | com.huawei.continuous.exercise_heart_rate.statistics | com.huawei.instantaneous.exercise_heart_rate |
| Step cadence | com.huawei.continuous.steps.rate.statistics | com.huawei.instantaneous.steps.rate |
| Sleep | com.huawei.continuous.sleep.statistics | com.huawei.continuous.sleep.fragment |
| Jump | com.huawei.continuous.jump.statistics | com.huawei.continuous.jump |
