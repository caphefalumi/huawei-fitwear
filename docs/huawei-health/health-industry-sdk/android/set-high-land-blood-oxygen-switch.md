<!--
  Title: Setting the Automatic Monitoring Switch for High Altitude Adaptation
  Catalog: huaweihealth-Guides
  Document ID: set-high-land-blood-oxygen-switch-0000002558281563
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-high-land-blood-oxygen-switch-0000002558281563
-->
# Setting the Automatic Monitoring Switch for High Altitude Adaptation

This section describes how to set the automatic monitoring switch for High altitude adaptation on a wearable. Once enabled, when the wearable detects an altitude of 2500 meters, the High altitude adaptation app on the wearable will provide altitude sickness evaluations and suggestions. Users identified as high risk will receive a reminder based on the SpO2 measurement results within a period of time. After the switch is disabled, the altitude sickness evaluations and suggestions will no longer be provided.

> **Note:** When this API is called to enable the automatic monitoring switch for High altitude adaptation, the SDK will also enable automatic SpO2 measurement. When the [API for setting the automatic SpO2 measurement switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-blood-oxygen-switch-0000002338300788) is called to disable automatic SpO2 measurement, the SDK will not simultaneously disable the automatic monitoring switch for High altitude adaptation.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the automatic monitoring switch for High altitude adaptation. 
```cpp
{
  "settingKey": "highLandBloodOxygenSwitch",
  "settingValue": 1
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | highLandBloodOxygenSwitch | Key of the state of the automatic monitoring switch for High altitude adaptation. |
| settingValue | 0 | Disables the automatic monitoring switch for High altitude adaptation. |
| 1 | Enables the automatic monitoring switch for High altitude adaptation. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the automatic monitoring switch for High altitude adaptation. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the automatic monitoring switch for High altitude adaptation.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "highLandBloodOxygenSwitch");
    jsonObject.put("settingValue", 0);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the automatic monitoring switch for High altitude adaptation.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
