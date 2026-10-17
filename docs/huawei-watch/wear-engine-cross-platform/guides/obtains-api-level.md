<!--
  Title: Obtaining the API Level of Wear Engine
  Catalog: connectivity-Guides
  Document ID: obtains-api-level-0000001063993525
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/obtains-api-level-0000001063993525
-->
# Obtaining the API Level of Wear Engine

Each API of Wear Engine has an API level, for example, 0 or 2. For details about the API level of each API on the SDK client, refer to [API Reference](https://developer.huawei.com/consumer/en/doc/connectivity-References/overview-0000001051473926).

The Wear Engine server and client are independent of each other and have their own API levels, which are the highest API levels of all APIs supported by Wear Engine. For example, if the client has 40 APIs and the API levels of these APIs are 0 and 2, the API level of the client is 2.

If the API level of the server is lower than that of the client, some APIs of the client are not supported by the server. In this case, you can advise users to update the Huawei Health app. If the API level of the client is lower than or the same as that of the server, the functions of the client are supported by both the client and server.

#### Obtaining the API Level of the Wear Engine SDK Client

To obtain the API level of the client, call the [getClientApiLevel](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__getClientApiLevel--) method.

- Refer to [Monitoring the Connection Status Between Your App and Wear Engine](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/monitoring-wearengine-service-0000001052828059#section10962817102613) to obtain the [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) object.
- Call the [getClientApiLevel](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__getClientApiLevel--) method to obtain the API level of the client. Sample code 
```cpp
// Step 2: Call the getClientApiLevel method to obtain the API level of the client.
wearEngineClient.getClientApiLevel()
    .addOnSuccessListener(new OnSuccessListener<Integer>() {
        @Override
        public void onSuccess(Integer integer) {
            // The API is called and the integer indicating the API level of the client is returned
            Log.i(TAG,"sdk apiLevel: " + integer.intValue());
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Failed to call the API
            Log.e(TAG,"sdk apiLevel e: " + e.getMessage());
        }
    });
```

#### Obtaining the API Level of the Wear Engine Server

To obtain the API level of the server, call the [getServiceApiLevel](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__getServiceApiLevel--) method.

- Refer to [Monitoring the Connection Status Between Your App and Wear Engine](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/monitoring-wearengine-service-0000001052828059#section10962817102613) to obtain the [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) object.
- Call the [getServiceApiLevel](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__getServiceApiLevel--) method to obtain the API level of the server. Sample code 
```cpp
// Step 2: Call the getServiceApiLevel method to obtain the API level of the server.
wearEngineClient.getServiceApiLevel()
    .addOnSuccessListener(new OnSuccessListener<Integer>() {
        @Override
        public void onSuccess(Integer integer) {
            // The API is called and the integer indicating the API level of the server is returned
            Log.i(TAG,"service apiLevel: " + integer.intValue());
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Failed to call the API
            Log.e(TAG,"service apiLevel e: " + e.getMessage());
        }
    });
```
