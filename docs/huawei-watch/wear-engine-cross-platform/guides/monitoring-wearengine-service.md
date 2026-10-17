<!--
  Title: Managing the Connection Status Between Your App and Wear Engine
  Catalog: connectivity-Guides
  Document ID: monitoring-wearengine-service-0000001052828059
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/monitoring-wearengine-service-0000001052828059
-->
# Managing the Connection Status Between Your App and Wear Engine

#### Monitoring the Connection Status Between Your App and Wear Engine

If the Huawei Health app stops providing services in the background (for example, due to high power consumption), your app may disconnect from Wear Engine. This API allows you to check the connection status on the condition that you have monitored the connection status using this API before the app is disconnected from Wear Engine.

- Define the connection status listener.
- Call the [getWearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716#EN-US_TOPIC_0000001873951394__getWearEngineClient-android_app_Activity-com_huawei_wearengine_client_ServiceConnectionListener-) method in [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001060938716) to obtain the [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) object.
- Call the [registerServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__registerServiceConnectionListener--) method to monitor the connection status between your app and Wear Engine. 
```cpp
// Step 1: Define the connection status listener.
ServiceConnectionListener serviceConnectionListener = new ServiceConnectionListener() {
    @Override
    public void onServiceConnect() {
        // Handle the successful connection events between your app and Wear Engine.
    }

    @Override
    public void onServiceDisconnect() {
        // Handle the disconnection events between your app and Wear Engine.
    }
};

// Step 2: Obtain the WearEngineClient object.
wearEngineClient = HiWear.getWearEngineClient(this, serviceConnectionListener);

// Step 3: Call the registerServiceConnectionListener method to monitor the connection status between your app and Wear Engine.
wearEngineClient.registerServiceConnectionListener()
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
            // Succeed in calling the API.
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Failed to call the API.
        }
    });
```

- Call the [unregisterServiceConnectionListener](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__unregisterServiceConnectionListener--) method to cancel the monitoring of the connection status between your app and Wear Engine. 
```cpp
// Step 4: Call the unregisterServiceConnectionListener method to cancel the monitoring of the connection status between your app and Wear Engine.
wearEngineClient.unregisterServiceConnectionListener()
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
            // Succeed in calling the API.
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Failed to call the API.
        }
    });
```

#### Disconnecting Your App from Wear Engine

After your app and Wear Engine are disconnected, Wear Engine resources will be released and functions such as device status monitoring, message receiving, and file receiving will be unavailable. To reconnect them, call the corresponding APIs.

- Refer to [Monitoring the Connection Status Between Your App and Wear Engine](#section10962817102613) to obtain the [WearEngineClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904) object.
- Call the [releaseConnection](https://developer.huawei.com/consumer/en/doc/connectivity-References/wearengineclient-0000001060620904#EN-US_TOPIC_0000001874111230__releaseConnection--) method to disconnect your app from Wear Engine. 
```cpp
// Step 2: Call the releaseConnection method to disconnect your app from Wear Engine.
wearEngineClient.releaseConnection()
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void successVoid) {
            // Succeed in calling the API.
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            // Failed to call the API.
        }
    });
```
