<!--
  Title: Querying Available Wearable Devices
  Catalog: connectivity-Guides
  Document ID: query-available-wearable-0000001054326166
  Updated: 2025-10-13 02:54:10
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/query-available-wearable-0000001054326166
-->
# Querying Available Wearable Devices

Wear Engine provides the API for querying whether users have available wearable devices (wearable devices that are connected to the Huawei Health app and support Wear Engine).

No user authorization is required for calling this API. You are advised to implement this API before using other APIs of Wear Engine.

- Call the [getDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getDeviceClient-android_content_Context-) method of [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [DeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120) object.
- Call the [hasAvailableDevices](https://developer.huawei.com/consumer/en/doc/connectivity-References/deviceclient-0000001060779120#EN-US_TOPIC_0000001919950697__hasAvailableDevices--) method to query whether users have available wearable devices. 
```cpp
// Step 1: Obtain the DeviceClient object.
// "this" indicates the Context object of the app.
DeviceClient deviceClient = HiWear.getDeviceClient(this);

// Step 2: Call the hasAvailableDevices method to query whether users have available wearable devices.
deviceClient.hasAvailableDevices().addOnSuccessListener(new OnSuccessListener<Boolean>() {
    @Override
    public void onSuccess(Boolean result) {
        // Query whether there are available devices having been executed. The result value represents whether there are available devices.
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
       // Query whether there are available devices failing to be executed.
    }
});
```
