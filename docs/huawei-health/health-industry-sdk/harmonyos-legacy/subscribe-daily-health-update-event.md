<!--
  Title: Subscribing to Daily Health Data Updates
  Catalog: huaweihealth-Guides
  Document ID: subscribe-daily-health-update-event-0000002447591805
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-daily-health-update-event-0000002447591805
-->
# Subscribing to Daily Health Data Updates

This section describes how to subscribe to and unsubscribe from daily health data update events on a wearable. Following a successful subscription, the wearable reports a daily health data update event when detecting that the conditions for updating daily health data are met. After unsubscription, the wearable no longer reports daily health data update events.

> **Note:** **Data update events are reported only when the screen is on, but not in AOD mode.** A data update event is reported upon the first standing status change each hour. A data update event is reported and the statistical values of the four conditions are reset to 0 when the wearable detects that any of the following conditions is met: The step count reaches 500. The distance reaches 1000 meters. The activity duration reaches 1 hour. The calories burned reaches 100 kcal.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the daily health data update events. 
```cpp
{
    "item": "dailyHealthUpdateEvent"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to daily health data update events. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the daily health data update events.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "dailyHealthUpdateEvent");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to daily health data update events.
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
| data | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. When a daily health data update event is reported, **{"rtnMsg":"event reported."}** is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and daily health data update events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When a daily health data update event is generated, **statusCode** is **10** and **data** is **{"rtnMsg":"event reported."}**.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from daily health data update events. 
```cpp
// Call the unSubscribe method to unsubscribe from daily health data update events.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
