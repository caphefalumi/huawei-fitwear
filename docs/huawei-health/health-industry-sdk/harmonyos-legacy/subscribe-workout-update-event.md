<!--
  Title: Subscribing to Data Updates of a Single Workout
  Catalog: huaweihealth-Guides
  Document ID: subscribe-workout-update-event-0000002414072668
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-workout-update-event-0000002414072668
-->
# Subscribing to Data Updates of a Single Workout

This section describes how to subscribe to and unsubscribe from single-workout data update events on a wearable. Following a successful subscription, the wearable reports a single-workout data update event after a single workout completes. After unsubscription, single-workout data update events are no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct parameters in ZSON format for subscribing to or unsubscribing from data updates of a single workout. 
```cpp
{
    "item": "workoutUpdateEvent"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to data updates of a single workout. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct parameters in ZSON format for subscribing to or unsubscribing from data updates of a single workout.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "workoutUpdateEvent");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to data updates of a single workout.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the returned subscription information.
    }
}
manageClient.subscribe(zsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 7, 10 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. When a single-workout data update event is reported, **{"rtnMsg":"event reported."}** is returned. Currently, workout data update events are generated only for the following workout types: • **1**: outdoor running • **2**: outdoor walking • **3**: outdoor cycling • **4**: indoor running (on a treadmill) • **5**: indoor cycling • **255**: other |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and single-workout data update events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When a single-workout data update event is generated, **statusCode** is **10** and **data** is **{"rtnMsg":"event reported."}**.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from single-workout data update events. 
```cpp
// Call the unSubscribe method to unsubscribe from single-workout data update events.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
