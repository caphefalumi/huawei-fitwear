<!--
  Title: Sending a File
  Catalog: huaweihealth-Guides
  Document ID: send-file-0000002342776776
  Updated: 2026-08-05 02:10:19
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/send-file-0000002342776776
-->
# Sending a File

This section describes how to send a file to a wearable app.

> **Note:** This feature is not supported when a [smart wearable](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) is in the ultra-long battery life mode. To use this feature, you need to install the corresponding app on the wearable. For details, please refer to [Wearable App Development](https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/version-change-history-0000001119036892). This feature is restricted to [smart wearables](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/supported-devices-0000002510376967#EN-US_TOPIC_0000002647924354__li165266350557) connected in [auto mode](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536#EN-US_TOPIC_0000002678163965__li132048191618). Currently, this feature is not available to mining lamps.

If the industry app needs to access external storage, you need to apply for the read and write permissions.

If Android 10 or later is required for accessing external storage, add **android:requestLegacyExternalStorage="true"** to **application** in the **AndroidManifest.xml** file of the main project.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for sending a file to a wearable app. 
```cpp
{
    "item": "p2pSendFile",
    "value": {
        "peerPkgName": "com.huawei.aa",
        "peerFingerPrint": "com.huawei.aa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "filePath": "\/sdcard\/a.png"
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| item | p2pSendFile | Sends a file to a wearable app. |
| peerPkgName | - | [App package name](https://developer.huawei.com/consumer/en/doc/HMSCore-Guides/application-package-name-0000001580840241) on the wearable. |
| peerFingerPrint | - | [Signing certificate fingerprint of the wearable app](https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/signature-0000001053969657). |
| filePath | - | Path where the file to be transferred by the industry app is located. (The file size cannot exceed 4 MB.) |

- Call the [send](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__send-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to send the file to the wearable app. > **Note:** [Check whether the wearable app is online](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/check-app-online-0000002376734761) first. Ensure that the app is online before sending the file. 
```cpp
// Step 1 Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Step 2 Obtain the list of paired wearables by referring to Obtaining the Wearable List. Then, select a target wearable from the list and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Step 3 Create a JSON object for sending a file to a wearable app.
JSONObject jsonObject = new JSONObject();
JSONObject valueObject = new JSONObject();
try {
    valueObject.put("peerPkgName", "com.huawei.aa");
    valueObject.put("peerFingerPrint", "com.huawei.aa_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    valueObject.put("filePath", "\/sdcard\/a.png");
    jsonObject.put("item", "p2pSendFile");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Step 4 Call the send method to send the file to the wearable app.
deviceManageClient.send(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 26, 30, 206, 207, 208, 210 | Result code of the API call. For details, please refer to the universal result codes and inter-device communication status codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the file transfer progress is returned. If the API call fails, an error message is returned. |
 
| Parameter | Description |
| --- | --- |
| progress | File sending progress. |
 The file sending progress is continuously returned. When the progress reaches 100, the file sending is complete. 
```cpp
// Sending the file...
{
    "progress": 0
}
{
    "progress": 1
}
...
// File sending is complete.
{
   "progress": 100
}
```
