<!--
  Title: Setting the Continuous Skin Temperature Measurement Switch
  Catalog: huaweihealth-Guides
  Document ID: set-skin-temp-continuous-measurement-switch-0000002527049370
  Updated: 2026-08-05 02:10:24
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-skin-temp-continuous-measurement-switch-0000002527049370
-->
# Setting the Continuous Skin Temperature Measurement Switch

This section describes how to set the continuous skin temperature measurement switch of a wearable. Once enabled, the wearable continuously monitors body temperature. The body temperature data recorded on the wearable can be queried through the [API for querying body temperature data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-temperature-data-0000002342714356).

This switch is only available on wearables released outside the Chinese mainland. If an unsupported wearable is used, error code **30** will be returned.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824#section181164592527) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000002412777824) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073) object.
- Construct input data in JSON format for setting the continuous skin temperature measurement switch. 
```cpp
{
    "settingKey": "skinTempContinuousMeasurementSwitch",
    "settingValue": 0
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | skinTempContinuousMeasurementSwitch | Key for setting the continuous skin temperature measurement switch. |
| settingValue | 0 | Disables continuous skin temperature measurement. |
| 1 | Enables continuous skin temperature measurement. |  |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000002446217073#section447217361429) method to set the continuous skin temperature measurement switch. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient manageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the continuous skin temperature measurement switch.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "skinTempContinuousMeasurementSwitch");
    jsonObject.put("settingValue", 1);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the continuous skin temperature measurement switch.
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
