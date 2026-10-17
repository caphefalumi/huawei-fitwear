<!--
  Title: Data Subscription
  Catalog: HMSCore-Guides-V5
  Document ID: subscription-scene-0000001077855616-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/subscription-scene-0000001077855616-V5
-->
# Data Subscription

This section provides an example of the data subscription mechanism of the Health Kit server, which notifies the app of user data changes in real time, ensuring that the app can always obtain the latest data.

#### Interaction Process

The process is as follows:

- Register as a subscriber on the Health Kit management page on HUAWEI Developers.
- The Health Kit server stores the app subscriber information.
- The app integrates with Health Kit, subscribes to events, and generates subscription records.
- The Health Kit server stores the subscription records.
- The app is notified of any user data change.
- The app receives the notification and obtains the latest data from the Health Kit server.

#### Procedure

- Register as a subscriber. Apply for the Health Kit service on HUAWEI Developers, select **Registering the Subscription Notification Capability**, and enter the callback URL. Then test the connectivity of the callback URL.
- Register the subscription record. **HTTP request**. For details, see [Adding/Updating a Subscription Record](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/subscriber-records-0000001088575341-V5). 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/subscriptions
```
 **Request example** 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/subscriptions
```
 **Request body** 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/subscriptions
Content-Type: application/json
Authorization: Bearer ***
x-client-id: ***
x-version: ***
x-caller-trace-id: ***
{
  "concernedEvents": [
	"ACTIVITY_RECORD_EVENT$UPDATE",
	"ACTIVITY_RECORD_EVENT$DELETE"
	]
}
```
 **Response body** 
```cpp
HTTP/1.1 200 OK
Content-type: application/json;charset=utf-8
[
    {
        "appId": "101524371",
        "eventType": "ACTIVITY_RECORD_EVENT$UPDATE",
        "subscriberId": "a2613ab0-19d8-4126-b18f-7779405b5992",
        "subscriptionId": "0924d8d1-6d4a-4f81-99b9-b96b1a0c970c",
        "openId": "MDFAMTAxNTI0MzcxQGQ0Y2M3N2UxZTVmNjcxNWFkMWQ5Y2JjYjlmZDZiaNTY3QDVhNmNkY2FiaMTFhYzc4NDk4NDI0MzJiaNjg0MzViaYmUyMGEzZjZkNzUzYWVjM2Q5ZTgwYWM5NTgzNmY"
    },
    {
        "appId": "101524371",
        "eventType": "ACTIVITY_RECORD_EVENT$DELETE",
        "subscriberId": "a2613ab0-19d8-4126-b18f-7779405b5992",
        "subscriptionId": "641eeec8-a9c1-4c4c-9789-4963b92a6c46",
        "openId": "MDFAMTAxNTI0MzcxQGQ0Y2M3N2UxZTVmNjcxNWFkMWQ5Y2JjYjlmZDZiaNTY3QDVhNmNkY2FiaMTFhYzc4NDk4NDI0MzJiaNjg0MzViaYmUyMGEzZjZkNzUzYWVjM2Q5ZTgwYWM5NTgzNmY"
    }
]
```

- Receive event notifications. Notes on event notifications: Signature verification is recommended.
- If the signature verification is successful, **204 No Content** is returned. Otherwise, the result code **404** is returned.
- The HTTPS protocol is recommended for the callback address.
- To handle the notification events, the subscriber obtains data from Health Kit in asynchronously mode, preventing long response delay caused by time-consuming operations.

**HTTP request**. For details, see [Subscribing to Event Notifications](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/subscriber-event-0000001076878214-V5).

```cpp
POST
https://www.example.com/healthkit/notifications
```

**Request example**

```cpp
POST
https://www.example.com/healthkit/notifications
```

**Request body**

```cpp
POST
https://lfhealthdev.hwcloudtest.cn/test/healthkit/notifications
Content-Type: application/json
x-notification-signature: ***
{
    "eventTime":1607514090688,
    "eventType":"ACTIVITY_RECORD_EVENT$UPDATE",
    "metaData":[
        {
            "metaKey":"startTime",
            "metaValue":"1606856007879"
        },
        {
            "metaKey":"endTime",
            "metaValue":"1606916007879"
        },
        {
            "metaKey":"activityType",
            "metaValue":"1"
        }
    ],
    "openId":"MDFAMTAxNTI0MzcxQGQ0Y2M3N2UxZTVmNjcxNWFkMWQ5Y2JjYjlmZDZiaNTY3QDVhNmNkY2FiaMTFhYzc4NDk4NDI0MzJiaNjg0MzViaYmUyMGEzZjZkNzUzYWVjM2Q5ZTgwYWM5NTgzNmY"
}
```

**Response body**

```cpp
HTTP/1.1 204 No Content
Content-type: application/json;charset=utf-8
```
