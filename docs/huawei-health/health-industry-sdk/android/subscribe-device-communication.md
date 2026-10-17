<!--
  Title: Subscribing to Messages Sent by a Wearable App
  Catalog: huaweihealth-Guides
  Document ID: subscribe-device-communication-0000002376595257
  Updated: 2026-08-05 02:10:20
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/subscribe-device-communication-0000002376595257
-->
# Subscribing to Messages Sent by a Wearable App

This section describes how to subscribe to and unsubscribe from the messages between an industry app and a wearable app. After the subscription, the industry app can receive text messages and files sent by the wearable app.

> **Note:** To use this feature, you need to install the corresponding app on the wearable. For details, please refer to [Wearable App Development](https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/version-change-history-0000001119036892). A maximum of 10 subscriptions to messages sent by different app package names are supported. If the number of subscriptions exceeds 10, cancel some of the existing subscriptions and try again. You are advised to promptly delete the temporary files that have been used.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for subscribing to or unsubscribing from the messages sent by a wearable app. 
```cpp
{
    "item": "p2pMessage",
    "value": {
        "peerPkgName": "com.huawei.aa",
        "peerFingerPrint": "com.huawei.aa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
}
```
 
| Parameter in value | Description |
| --- | --- |
| peerPkgName | [App package name](https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/application-package-name-0000001580840241) on the wearable. |
| peerFingerPrint | [Signing certificate fingerprint of the wearable app](https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/signature-0000001053969657). |

- Call the [subscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__subscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to subscribe to the messages sent by the wearable app. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for subscribing to or unsubscribing from the messages sent by a wearable app.
JSONObject jsonObject = new JSONObject();
JSONObject valueObject = new JSONObject();
try {
    jsonObject.put("item", "p2pMessage");
    valueObject.put("peerPkgName", "com.huawei.aa");
    valueObject.put("peerFingerPrint", "com.huawei.aa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the subscribe method.
manageClient.subscribe(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned subscription information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 26, 30, 207, 208, 209 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. When the wearable app sends a message or file to the industry app, information such as the text message, file receiving progress, and file path is returned. |
 
```cpp
// result example: The wearable app sends a text message to the industry app.
{
    "type": 1,
    "data": "this is a message."
}
```
 
```cpp
// result example: The wearable app sends a file to the industry app.
// Data example of the file receiving process.
{
    "progress": 0
}
...
{
    "progress": 100
}
// Data example when the file receiving is complete.
{
    "type": 2,
    "filePath": "\/data\/data\/com.huawei.health.industry.demo\/files\/commonFileRequest\/demo.txt"
}
```
 
| Parameter | Description |
| --- | --- |
| type | • **1**: message • **2**: file |
| data | Text message sent by the wearable app. |
| progress | File receiving progress when a file is uploaded from the wearable app. |
| filePath | Path on the phone for storing the file uploaded by the wearable app when the receiving is complete. |

- Call the [unSubscribe](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__unSubscribe-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to unsubscribe from the messages sent by the wearable app. 
```cpp
// Call the unSubscribe method to unsubscribe from the messages sent by the wearable app.
manageClient.unSubscribe(deviceId, jsonObject.toString(), serviceCallback);
```
 > **Note:** Conditions for successful unsubscription: The parameters passed for unsubscription must be consistent with those passed for subscription. **ServiceCallback** passed for unsubscription must be the one passed for subscription.
