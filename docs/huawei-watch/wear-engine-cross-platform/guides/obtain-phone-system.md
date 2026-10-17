<!--
  Title: Obtaining the System Information of a Mobile Phone
  Catalog: connectivity-Guides
  Document ID: obtain-phone-system-0000001237204973
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/obtain-phone-system-0000001237204973
-->
# Obtaining the System Information of a Mobile Phone

Wear Engine currently does not support iOS phones. The wearable app can obtain the phone system information using the [getPeerDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/peerdeviceclient-0000001192908020#EN-US_TOPIC_0000001873951294__getPeerDevice-com_huawei_watch_kit_hiwear_peerdevice_PeerDeviceCallback-) method. If the phone system is iOS, you can display a corresponding prompt on the wearable app.

- Call the [getPeerDeviceClient](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001059995060#section4609548162615) method from [HiWear](https://developer.huawei.com/consumer/en/doc/connectivity-References/hiwear-0000001059995060) to obtain the **PeerDeviceClient** object.
- Call the [getPeerDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/peerdeviceclient-0000001192908020#EN-US_TOPIC_0000001873951294__getPeerDevice-com_huawei_watch_kit_hiwear_peerdevice_PeerDeviceCallback-) method to obtain the phone system information. Currently, only the phone system type can be obtained. The value **1** indicates Android or HarmonyOS, and the value **2** indicates iOS. 
```cpp
// Step 1: Obtain the phone information object.
PeerDeviceClient peerDeviceClient = HiWear.getPeerDeviceClient(this);

// Step 2: Obtain the phone system information.
peerDeviceClient.getPeerDevice(new PeerDeviceCallback() {
    @Override
    public void onResult(int i, PeerDevice peerDevice) {
// Callback result, which is used to process the object that contains the phone system information.
    }
});
```
