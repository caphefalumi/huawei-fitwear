<!--
  Title: Subscribing to Heart Rate Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-heart-rate-data-0000002413912824
  Updated: 2026-08-05 02:10:35
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-heart-rate-data-0000002413912824
-->
# Subscribing to Heart Rate Data

This section describes how to subscribe to and unsubscribe from wearable users' heart rate data. Following a successful subscription, the wearable returns generated heart rate data. After unsubscription, heart rate data is no longer reported.

> **Note:** When a user removes their wearable device, the device reports **255**. When a wearable is picked up, it automatically starts heart rate measurement. If the wearable detects that it is not being worn or it is worn incorrectly, it reports **255**. In smart heart rate monitoring mode, heart rate data is reported every 10 minutes if the wearable detects low, low-to-moderate, or moderate activity intensity levels. Heart rate data subscription utilizes a power-efficient reporting mechanism. Specifically, after subscription, heart rate data is not reported when the wearable is in AOD mode and is reported only when the screen is on.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from heart rate data. 
```cpp
{
    "item": "heartRate"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to heart rate data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from heart rate data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "heartRate");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to heart rate data.
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
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. After the subscription is successful, the device reports heart rate data every 5 seconds. |

- Process the subscription result and heart rate data in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When heart rate data is generated, **statusCode** is **8** and **data** contains heart rate data. 
```cpp
data example:
{
    "heartRate":80,
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| heartRate | Data of the int type | Current heart rate. The value **255** indicates an invalid value. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from heart rate data when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from heart rate data.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
deviceManageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
