<!--
  Title: Obtaining the System Information of a Mobile Phone
  Catalog: connectivity-Guides
  Document ID: obtain-phone-system-0000001192285154
  Updated: 2025-10-13 02:54:16
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/obtain-phone-system-0000001192285154
-->
# Obtaining the System Information of a Mobile Phone

Your app on the wearable side can obtain system information of the mobile phone by calling the [getPeerDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/phone-system-0000001237277153#section9463195104019) method.

- Create a **PeerDeviceClient** object.
- Call the [getPeerDevice](https://developer.huawei.com/consumer/en/doc/connectivity-References/phone-system-0000001237277153#section9463195104019) method to obtain the phone system information. Currently, only the phone system type can be obtained. The value **1** indicates Android or HarmonyOS, and the value **2** indicates iOS. 
```cpp
//Step 1: Create a peerDeviceClient object.
var peerDeviceClient = new PeerDeviceClient();

//Step 2: Obtain the phone system information.
var flash = this;
peerDeviceClient.getPeerDevice({
    onSuccess:function(data){
//Obtain the phone system type.
        console.log("phone os type " + data.peerDevice.mOsType);
        flash.receiveMessageOK = "getPeerDevice success:" + JSON.stringify(data);
    },
    onFailure: function (data) {
        flash.receiveMessageOK = "getPeerDevice fail:" + JSON.stringify(data);
    },
});
```
