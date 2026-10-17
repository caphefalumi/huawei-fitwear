<!--
  Title: Subscribing to the Device Charging Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-charge-status-0000002413912828
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-charge-status-0000002413912828
-->
# Subscribing to the Device Charging Status

This section describes how to subscribe to and unsubscribe from the charging status of a wearable. Following a successful subscription, the current charging status is returned when the charging status of a wearable changes. After unsubscription, the charging status is no longer returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the device charging status. 
```cpp
{
    "item":"chargeStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to the device charging status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the device charging status.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "chargeStatus");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the device charging status.
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
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. If the device charging status changes, the charging status is returned. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and device charging status changes in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. If the device charging status changes, **statusCode** is **8** and the current charging status is returned in **data**. 
```cpp
data example:
{
    "chargeStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| chargeStatus | 1 | Charging started. |
| 2 | Charging stopped. |  |
| 3 | Fully charged. |  |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from the device charging status when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the charging status.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
