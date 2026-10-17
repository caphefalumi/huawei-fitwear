<!--
  Title: Setting the High Body Temperature Alert Switch
  Catalog: huaweihealth-Guides
  Document ID: set-high-temp-alert-switch-0000002526889416
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-high-temp-alert-switch-0000002526889416
-->
# Setting the High Body Temperature Alert Switch

This section describes how to set the high body temperature alert switch. If a wearable supports this capability, once enabled, the wearable will display a pop-up alert when the detected body temperature exceeds the preset threshold.

This switch is only available on certain wearables released in the Chinese mainland. If an unsupported wearable is used, error code **30** will be returned.

> **Note:** To set the high body temperature alert switch, the Body Temperature Study feature must be activated in the Body temperature app on the wearable. Activation path: Touch **Body temperature** > **Join study**. The API for setting the high body temperature alert switch cannot be used if Body Temperature Study is not enabled, and error code **10** will be returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in JSON format for setting the high body temperature alert switch and the threshold for triggering an alert. 
```cpp
{
    "settingKey": "highTempAlertSwitch",
    "settingValue": {
        "switch": 1,
        "threshold": 37.5
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | highTempAlertSwitch | Key of the high body temperature alert switch and threshold. |
| settingValue | Fields included: **switch** and **threshold** | High body temperature alert switch state and the threshold for triggering an alert. |
| switch | 0 | Disables high body temperature alert. |
| 1 | Enables high body temperature alert. |  |
| threshold | Integer ranging from 37.2 to 38.5 | Threshold for triggering a high body temperature alert. **This parameter is mandatory only when the alert switch is enabled**. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the high body temperature alert switch and the threshold for triggering an alert. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the high body temperature alert switch and the threshold for triggering an alert.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject switchAndThreshold = new JSONObject();
    switchAndThreshold.put("switch", 1);
    switchAndThreshold.put("threshold", 37.5);
    jsonObject.put("settingKey", "highTempAlertSwitch");
    jsonObject.put("settingValue", switchAndThreshold);

} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the high body temperature alert switch and the threshold for triggering an alert.
manageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 4, 5, 7 | Result code of the API call. For details, please refer to [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002447302129). |
| data | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
