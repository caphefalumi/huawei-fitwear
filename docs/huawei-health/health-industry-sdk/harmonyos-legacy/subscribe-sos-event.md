<!--
  Title: Subscribing to SOS Events
  Catalog: huaweihealth-Guides
  Document ID: subscribe-sos-event-0000002414072660
  Updated: 2026-08-05 02:10:11
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-sos-event-0000002414072660
-->
# Subscribing to SOS Events

This section describes how to subscribe to and unsubscribe from SOS events of a wearable. Following a successful subscription, the wearable reports an SOS event when detecting that SOS is triggered. After unsubscription, SOS events are no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from SOS events. 
```cpp
{
    "item": "SOSEvent"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to SOS events. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from SOS events.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "SOSEvent");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to SOS events.
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
| data | - | If the subscription is successful, an empty string is returned. If the subscription fails, an error message is returned. After the subscription is successful, **{"rtnMsg":"event reported."}** is returned when the device generates an SOS event. |

- Process the subscription result and SOS events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When an SOS event is generated, **statusCode** is **10** and **data** is **{"rtnMsg":"event reported."}**.

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from SOS events. 
```cpp
// Call the unSubscribe method to unsubscribe from SOS events.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
deviceManageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
