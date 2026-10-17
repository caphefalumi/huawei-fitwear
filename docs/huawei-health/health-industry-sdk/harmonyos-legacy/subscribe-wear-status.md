<!--
  Title: Subscribing to the Device Wearing Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-wear-status-0000002447591801
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-wear-status-0000002447591801
-->
# Subscribing to the Device Wearing Status

This section describes how to subscribe to and unsubscribe from the wearing status of a wearable. Following a successful subscription, the current wearing status is returned when the wearing status of a wearable changes. After unsubscription, the wearing status is no longer returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the device wearing status. 
```cpp
{
    "item":"wearStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to the device wearing status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the device wearing status.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "wearStatus");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the device wearing status.
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
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. If the device wearing status changes, the wearing status is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and device wearing status changes in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. If the device wearing status changes, **statusCode** is **8** and the current wearing status is returned in **data**. 
```cpp
data example:
{
    "wearStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| wearStatus | 1 | Worn. |
| 2 | Not worn. |  |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from the device wearing status when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the wearing status.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
