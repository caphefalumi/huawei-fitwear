<!--
  Title: Subscribing to the Sleep Status
  Catalog: huaweihealth-Guides
  Document ID: subscribe-sleep-status-0000002414072656
  Updated: 2026-08-05 02:10:32
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-sleep-status-0000002414072656
-->
# Subscribing to the Sleep Status

This section describes how to subscribe to and unsubscribe from wearable user sleep status. Following a successful subscription, the sleep status is reported when the wearable user's sleep status changes. After unsubscription, the sleep status is no longer reported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the sleep status. 
```cpp
{
    "item": "sleepStatus"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to the sleep status. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the sleep status.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "sleepStatus");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the sleep status.
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
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. After the subscription is successful, the sleep status is returned upon changes. |

- Process the subscription result and sleep status in the **onResult** method of **ServiceCallback**. If the subscription succeeds, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. If the sleep status changes, **statusCode** is **8** and the sleep status is returned in **data**. 
```cpp
data example:
{
    "sleepStatus":1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| sleepStatus | 0 | Entering light sleep (LIGHT_SLEEP_STATUS). |
| 1 | Entering deep sleep (DEEP_SLEEP_STATUS). |  |
| 2 | Entering awake state (AWAKE_STATUS). |  |
| 3 | Entering normal sleep (ASLEEP_STATUS). |  |
| 4 | Entering awake state (OTHER_SLEEP_STATUS). |  |
| 5 | Suspected sleep onset (SUSPECTED_SLEEP). |  |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from the sleep status when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the sleep status.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
deviceManageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
