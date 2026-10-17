<!--
  Title: Subscribing to the Workout Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-exercise-status-0000002447591797
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-exercise-status-0000002447591797
-->
# Subscribing to the Workout Status

This section describes how to subscribe to and unsubscribe from the workout status on a wearable. Following a successful subscription, the wearable reports the workout status when entering a specified control states during a workout. After unsubscription, the workout status is no longer reported.

> **Note:** The wearable reports the workout status during control states such as prepare, exit preparation, start, pause, resume, and end.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the workout status. 
```cpp
{
    "item": "exerciseStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to the workout status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the workout status.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "exerciseStatus");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the workout status.
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
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. After the subscription is successful, the wearable reports the workout status when entering a workout mode. |

- Process the subscription result and workout status changes in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. If the workout status changes, **statusCode** is **8** and the workout status is returned in **data**. 
```cpp
data example:
{
    "exerciseStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| exerciseStatus | Data of the int type | Workout status. For details, please refer to [Workout Status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sport-status-enumeration-0000002338268622). |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from the workout status when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the workout status.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
deviceManageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
