<!--
  Title: Subscribing to the Device Battery Level
  Catalog: huaweihealth-Guides
  Document ID: subscribe-battery-down-reminder-0000002414072664
  Updated: 2026-08-05 02:10:21
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-battery-down-reminder-0000002414072664
-->
# Subscribing to the Device Battery Level

This section describes how to subscribe to and unsubscribe from the battery level of a wearable. Following a successful subscription, the current battery level is returned when the battery level of a wearable decreases. After unsubscription, the battery level is no longer returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the battery level. 
```cpp
{
    "item":"batteryDownReminder"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to the device battery level. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the battery level.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "batteryDownReminder");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the device battery level.
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
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. If the device battery level changes, the battery level is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and battery level changes in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. If the device battery level changes, **statusCode** is **8** and the current battery level is returned in **data**. 
```cpp
data example:
{
    "batteryDownReminder":80
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| batteryDownReminder | 1–99 | Current device battery level. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from the battery level when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the battery level.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
