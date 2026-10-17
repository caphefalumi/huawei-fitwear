<!--
  Title: Setting the Elevated Body Temperature Alert Switch
  Catalog: huaweihealth-Guides
  Document ID: set-elevated-temp-warning-switch-0000002558049215
  Updated: 2026-08-05 02:10:27
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-elevated-temp-warning-switch-0000002558049215
-->
# Setting the Elevated Body Temperature Alert Switch

This section describes how to set the elevated body temperature alert switch. If a wearable supports this capability, once enabled, the wearable will display a pop-up alert when the detected body temperature exceeds 37.2°C.

This switch is only available on certain wearables released in the Chinese mainland. If an unsupported wearable is used, error code **30** will be returned.

> **Note:** To set the elevated body temperature alert switch, the Body Temperature Study feature must be activated in the Body temperature app on the wearable. Activation path: Touch **Body temperature** > **Join study**. The API for setting the elevated body temperature alert switch cannot be used if Body Temperature Study is not enabled, and error code **10** will be returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in JSON format for setting the elevated body temperature alert switch. 
```cpp
{
    "settingKey": "elevatedTempWarningSwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | elevatedTempWarningSwitch | Key for setting the elevated body temperature alert switch. |
| settingValue | 0 | Disables elevated body temperature alert. |
| 1 | Enables elevated body temperature alert. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the elevated body temperature alert switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the elevated body temperature alert switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "elevatedTempWarningSwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the elevated body temperature alert switch.
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
