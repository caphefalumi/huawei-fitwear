<!--
  Title: Registering a Connection Status Listener
  Catalog: huaweihealth-Guides
  Document ID: register-connection-status-listener-0000002338298252
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/register-connection-status-listener-0000002338298252
-->
# Registering a Connection Status Listener

This section describes how to register a listener for an industry app to listen to the connection status of a paired wearable.

- Call the [getDeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceConnectClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceConnectClient](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800) object.
- Call the [registerConnectionStatusListener](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__registerConnectionStatusListener--) method to register a connection status listener. 
```cpp
// Obtain the DeviceConnectClient object.
DeviceConnectClient deviceConnectClient = IndustryWear.getDeviceConnectClient(this); 

// Call the registerConnectionStatusListener() API.
int statusCode = deviceConnectClient.registerConnectionStatusListener();

// Register a broadcast receiver to listen to the connection status.
String action = "com.huawei.health.industry.client.CONNECTION_STATE_CHANGED";
IntentFilter intentFilter = new IntentFilter();
intentFilter.addAction(action);
LocalBroadcastManager.getInstance(this).registerReceiver(new BroadcastReceiver() {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(action)) {
            // Process the return value.
            String deviceId = intent.getStringExtra("deviceId");
            String deviceName = intent.getStringExtra("deviceName");
            String mac = intent.getStringExtra("mac");
            String connectionStatus = intent.getStringExtra("connectionStatus");
        }
    }
}, intentFilter);
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
 
| Parameter | Value | Description |
| --- | --- | --- |
| deviceId | - | ID of a wearable. |
| deviceName | - | Name of a wearable. |
| mac | - | MAC address of a wearable. Example: **10:20:30:40:50:60** |
| connectionStatus | 0, 1, 2, 3, 4, 5 | Wearable connection status code. For details, please refer to the status codes for device connection state broadcasts in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |

- Call the [unregisterConnectionStatusListener](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__unregisterConnectionStatusListener--) method to unregister the connection status listener. 
```cpp
// Call deviceConnectClient.unregisterConnectionStatusListener();.
int statusCode = deviceConnectClient.unregisterConnectionStatusListener();
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
