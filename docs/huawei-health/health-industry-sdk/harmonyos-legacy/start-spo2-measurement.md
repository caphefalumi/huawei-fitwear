<!--
  Title: Starting SpO2 Measurement
  Catalog: huaweihealth-Guides
  Document ID: start-spo2-measurement-0000002413912836
  Updated: 2026-08-05 02:10:12
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/start-spo2-measurement-0000002413912836
-->
# Starting SpO2 Measurement

A wearable provides the SpO2 measurement capability. You can use the Health Industry SDK to start the SpO2 app on the wearable.

> **Note:** This API is restricted to industry wearables that support the function of starting SpO2 measurement. Currently, HUAWEI WATCH H7546 is supported. The maximum waiting period for a single measurement is 5 minutes. If no measurement is taken within 5 minutes, the measurement timeout status code will be returned. If a new SpO2 or body temperature measurement is initiated during the waiting period, a service conflict status code will be returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in ZSON format for starting an SpO2 measurement. 
```cpp
{
    "item": "spo2Measure"
}
```

- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section162931529126) method to start an SpO2 measurement. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(getContext());

// Construct input data in ZSON format for starting an SpO2 measurement.
ZSONObject zsonObject = new ZSONObject();
try {
    zsonObject.put("item", "spo2Measure");
} catch (ZSONException e) {
    e.printStackTrace();
}

// Call the send method to start an SpO2 measurement.
ServiceCallback serviceCallback = new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String data) {
        // Process the return value.
    }
};
deviceManageClient.send(zsonObject.toString(), serviceCallback);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 6, 7, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410 | Result code of the API call. For details, please refer to the universal result codes and device control and device event status codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
