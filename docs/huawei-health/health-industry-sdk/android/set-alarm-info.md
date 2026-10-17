<!--
  Title: Setting Alarm Information
  Catalog: huaweihealth-Guides
  Document ID: set-alarm-info-0000002417529485
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-alarm-info-0000002417529485
-->
# Setting Alarm Information

Industry apps can call the corresponding API to set the alarm information on wearables.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for setting the alarm information. 
```cpp
{
    "settingKey": "alarmInfo",
    "settingValue": {
        "alarmsList": [
            {
                "index": 1,
                "enable": 1,
                "time": "0809",
                "cycle": 0,
                "name": "clock1"
            },
            {
                "index": 2,
                "enable": 0,
                "time": "2100",
                "cycle": 7,
                "name": "clock2"
            },
            {
                "index": 3,
                "enable": 0,
                "time": "2300",
                "cycle": 7,
                "name": "clock3"
            },
            {
                "index": 4,
                "enable": 0,
                "time": "2305",
                "cycle": 7,
                "name": "clock4"
            }
        ]
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | alarmInfo | Key of the alarm information. |
| settingValue | Field included: **alarmsList** | Value of the alarm information. |
| alarmsList | List, which includes the following fields: **index**, **enable**, **time**, **cycle**, and **name** | Alarm information list. Its length must be within the maximum number of alarms obtained in [Querying Alarm Information](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-alarm-info-0000002383970234). |
| index | Data of the int type | Alarm index, starting from **1**. |
| enable | Data of the int type | Indicates whether the alarm is enabled. The options are as follows: **0**: no **1**: yes |
| time | Data of the String type | Start time of the alarm. The value is a 24-hour time string in HHmm format, with HH indicating the hour, and mm indicating the minute. The latest time value is **2359**, and the earliest time value is **0000**. Examples: **0800** and **2000** |
| cycle | Data of the int type, ranging from 0 to 127 | Alarm cycle configuration. The bitmask corresponding to this parameter value indicates the alarm cycle mechanism. **0**: one-off 0B0000001: Monday 0B0000010: Tuesday 0B0000100: Wednesday 0B0001000: Thursday 0B0010000: Friday 0B0100000: Saturday 0B1000000: Sunday For example: **5** (0B0000101): The alarm repeats every Monday and Wednesday. **127** (0B1111111): The alarm repeats every day. **0** (0B0000000): The alarm is executed only once. |
| name | Data of the String type | Alarm name, in UTF-8 encoding format. The maximum length is 24 bytes. |
 > **Note:** 1. The number of alarms cannot exceed the maximum number obtained in [Querying Alarm Information](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-alarm-info-0000002383970234). If this limit is exceeded, the setting fails and error code **2** is returned. 2. The alarm information is set in full overwrite mode. The index starts from **1**, and must be assigned sequentially; skipping one will cause the setting to fail and the return of error code **2**. 3. Unless otherwise specified, numeric strings are equivalent to numeric types in alarm information setting.
- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to set the alarm information. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for setting the alarm information.
JSONObject jsonObject = new JSONObject();
try {
    jsonObject.put("settingKey", "alarmInfo");
    JSONArray array = new JSONArray();
    JSONObject clock = new JSONObject();
    clock.put("index",1);
    clock.put("enable",1);
    clock.put("time","0800");
    clock.put("cycle","15");
    clock.put("name","clockName");
    array.put(clock);
    valueObject.put("alarmsList", array);
    JSONObject valueObject = new JSONObject();
    jsonObject.put("settingValue", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to set the alarm information.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the return value.
    }});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | Setting result. An error message is returned if the API call fails. |
