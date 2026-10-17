<!--
  Title: Subscribing to Real-Time PPG Data
  Catalog: huaweihealth-Guides
  Document ID: subscribe-realtime-ppg-data-0000002413912832
  Updated: 2026-08-05 02:10:11
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-realtime-ppg-data-0000002413912832
-->
# Subscribing to Real-Time PPG Data

This section describes how to subscribe to and unsubscribe from the real-time PPG data of a wearable.

> **Note:** When subscribing to PPG data, industry apps occupy a large number of resources and may be killed by the system if the apps are switched to the background. Make sure to keep the apps alive or running in the foreground. Data reporting automatically stops if a user removes the wearable and will not resume even after the user wears the device again. In this case, you need to subscribe to the data again.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for subscribing to or unsubscribing from the real-time PPG data. 
```cpp
{
    "item":"realtimePpgData"
}
```

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section06031630309) method to subscribe to the real-time PPG data. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for subscribing to or unsubscribing from the real-time PPG data.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "realtimePpgData");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the subscribe method to subscribe to the real-time PPG data.
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
| statusCode | 0, 1, 2, 3, 5, 7, 8, 300, 303 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the subscription succeeds, an empty string is returned. If the subscription fails, an error message is returned. After the subscription is successful, the device reports real-time PPG data. |
 > **Note:** **ServiceCallback** serves two roles: returning the subscription result and subsequently delivering the reported data for the subscribed events.
- Process the subscription result and real-time PPG data update events in the **onResult** method of **ServiceCallback**. If the subscription is successful, **statusCode** is **0** and **data** is an empty string. If the subscription fails, **statusCode** is an error code and **data** is the corresponding error information. When real-time PPG data is generated, **statusCode** is **8**, and the PPG data timestamp and data of three channels are returned in **data**. 
```cpp
data example:
{
  "timeStamp": 1678695182449,
  "ppg": [
    {
      "channel": 3,
      "data": "[1783458.0, 1784041.0, 1785281.0, 1786011.0, 1786193.0, 1787470.0, 1787981.0, 1788455.0, 1789367.0, 1790279.0]"
    },
    {
      "channel": 5,
      "data": "[6.192854E7, 6.1930292E7, 6.1930364E7, 6.1932624E7, 6.1934888E7, 6.193496E7, 6.1938536E7, 6.1939048E7, 6.1941452E7, 6.1940724E7]"
    },
    {
      "channel": 7,
      "data": "[6.4321564E7, 6.4323048E7, 6.4324736E7, 6.4326144E7, 6.4327128E7, 6.4328132E7, 6.4329588E7, 6.4331264E7, 6.4332924E7, 6.4334696E7]"
    }
  ]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| timeStamp | UTC timestamp, in milliseconds | PPG data time point. |
| ppg | A JSON array of objects with the **channel** and **data** fields | PPG data, including data of three channels. |
| channel | Data of the int type | Three types of data channels, with 3, 5, and 7 corresponding to the GREEN, RED, and IR channels, respectively. |
| data | Data of the float[] type | Specific PPG data of each channel. |
 > **Note:** The PPG sensor collects data at an interval of 10 milliseconds, and reports data at an interval of approximately 100 milliseconds. There are three channels of data (GREEN, RED, and IR), and each channel reports 10 floating-point numbers. The volume of reported data is not fixed. The example provided represents typical cases, but the actual reporting interval and data volume may vary depending on the device.
- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section79475211626) method to unsubscribe from the real-time PPG data when necessary. 
```cpp
// Call the unSubscribe method to unsubscribe from the real-time PPG data.
// Note: serviceCallback is the object declared in step 3, and zsonObject is the one used for subscription.
manageClient.unSubscribe(zsonObject.toString(), serviceCallback);
```
