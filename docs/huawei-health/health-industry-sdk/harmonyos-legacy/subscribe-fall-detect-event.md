<!--
  Title: Subscribing to Fall Events
  Catalog: huaweihealth-Guides
  Document ID: subscribe-fall-detect-event-0000002447471861
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-fall-detect-event-0000002447471861
-->
# Subscribing to Fall Events

This section describes how to subscribe to and unsubscribe from fall events of a wearable. Following a successful subscription, the wearable reports a fall event when determining that a fall has occurred. After unsubscription, fall events are no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from fall events. 
```cpp
{
    "item": "FallDetectEvent"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to fall events. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from fall events.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "FallDetectEvent");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to fall events.
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
| statusCode | 0, 1, 2, 3, 5, 7, 10 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. After the subscription is successful, **{"rtnMsg":"event reported."}** is returned when the device generates a fall event. |

- Process the subscription result and fall events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When a fall event is generated, **statusCode** is **10** and **data** is **{"rtnMsg":"event reported."}**.

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from fall events. 
```cpp
// Call the unSubscribe method to unsubscribe from fall events.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
deviceManageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
