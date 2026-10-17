<!--
  Title: Subscribing to Heart Rate Alerts
  Catalog: huaweihealth-Guides
  Document ID: subscribe-heart-rate-alarm-0000002447471865
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-heart-rate-alarm-0000002447471865
-->
# Subscribing to Heart Rate Alerts

This section describes how to subscribe to and unsubscribe from the heart rate alerts of a wearable. Following a successful subscription, the heart rate alert information generated on the wearable is reported. After unsubscription, heart rate alert information is no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from heart rate alerts. 
```cpp
{
    "item":"heartRateAlarm"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to heart rate alerts. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from heart rate alerts.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "heartRateAlarm");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to heart rate alerts.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the returned subscription information.
    }
};
manageClient.subscribe(zsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7, 8 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. When a heart rate alert is generated, the alert information is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and heart rate alert information in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **data** is an empty string. When If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When a heart rate alert is generated, **statusCode** is **8** and **data** contains heart rate alert information. 
```cpp
data example:
{
    "heartRateAlarm":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| heartRateAlarm | 1 | Resting heart rate too high. |
| 2 | Resting heart rate too low. |  |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from heart rate alerts. 
```cpp
// Call the unSubscribe method to unsubscribe from heart rate alerts.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
