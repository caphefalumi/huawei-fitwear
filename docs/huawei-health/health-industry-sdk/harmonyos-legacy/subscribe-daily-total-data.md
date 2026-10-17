<!--
  Title: Subscribing to Daily Activity Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-daily-total-data-0000002447471857
  Updated: 2026-08-05 02:10:26
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-daily-total-data-0000002447471857
-->
# Subscribing to Daily Activity Data

This section describes how to subscribe to and unsubscribe from daily activity data of a wearable. Following a successful subscription, daily activity data is reported when the user's activity data changes. After unsubscription, daily activity data is no longer reported.

> **Note:** Daily activity data subscription utilizes a power-efficient reporting mechanism. Specifically, after subscription, daily activity data is not reported when the wearable is in AOD mode and is reported only when the screen is on. Updates to unexposed data also trigger daily activity data reporting, resulting in submission of repeated data.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the daily activity data. 
```cpp
{
    "item": "dailyTotalData"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to daily activity data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from daily activity data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "dailyTotalData");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to daily activity data.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
};
deviceManageClient.subscribe(zsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7, 8 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. Following a successful subscription, the daily activity data is returned when a change occurs. |

- Process the subscription result and daily activity data in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When daily activity data is generated, **statusCode** is **8** and **data** contains daily activity data. 
```cpp
data example:
{
    "totalStep":194,
    "totalCalorie":245,
    "totalDistance":119,
    "totalStrengthTime":0,
    "totalHeight":200
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| totalStep | Data of the int type | Step count |
| totalCalorie | Data of the double type | Total calorie (unit: cal). |
| totalDistance | Data of the double type | Total distance, in minutes. |
| totalStrengthTime | Data of the int type | Total duration of moderate- and high-intensity activities, in minutes. |
| totalHeight | Data of the double type | Climbing height, in meters. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from daily activity data when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from daily activity data.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
deviceManageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
