<!--
  Title: Querying the Ambulatory Blood Pressure Monitoring Report
  Catalog: huaweihealth-Guides
  Document ID: query-dynamic-blood-pressure-data-0000002429538585
  Updated: 2026-08-05 02:10:33
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-dynamic-blood-pressure-data-0000002429538585
-->
# Querying the Ambulatory Blood Pressure Monitoring Report

This section describes how to query the ambulatory blood pressure monitoring report of a wearable. Industry apps can call the corresponding API to query the report.

> **Note:** This API is restricted to wearables that support ambulatory blood pressure monitoring. Currently, only HUAWEI WATCH H9D20 is supported.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for querying the ambulatory blood pressure monitoring report. 
```cpp
{
  "item": "dynamicBloodPressureData",
  "value": {
    "startTime": 1744060764, // Unit: second
    "endTime": 1744081459 // Unit: second
  }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| startTime | UTC timestamp, in seconds | Query start time. |
| endTime | UTC timestamp, in seconds | Query end time. |
 > **Note:** The time interval between the start time and end time for data query cannot exceed 24 hours. The start time and end time must be earlier than the current time.
- Call the [query](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__query-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) to query the ambulatory blood pressure monitoring report. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for querying the ambulatory blood pressure monitoring report.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject valueObject= new JSONObject();
    valueObject.put("startTime", 1744060764);
    valueObject.put("endTime", 1744081459);
    jsonObject.put("item", "dynamicBloodPressureData");
    jsonObject.put("value", valueObject);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the query method to query the ambulatory blood pressure monitoring report.
deviceManageClient.query(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int statusCode, String result) {
        // Process the query result.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 5, 7, 11, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, the ambulatory blood pressure monitoring report is returned. If the API call fails, an error message is returned. |

- Process the returned information in the **onResult** method of **ServiceCallback**. The ambulatory blood pressure monitoring report is carried in **result** when the query is successful. 
```cpp
result example:
{
	"dataType": "dynamicBloodPressureData",
	"totalCount": 1,
	"index": 0,
	"count": 1,
	"dataList": [{
		"startTime": 1744081288,
		"summaryData": {
			"loadDiastolicBpSleep": 255,
			"maxDiastolicBpAll": 98,
			"planStatus": 1,
			"midHeartRateAll": 81,
			"stdDiastolicBpSleep": 300,
			"maxHeartRateSleep": 0,
			"stdHeartRateWakeTwo": 300,
			"avgSystolicBpAll": 144,
			"maxSystolicBpWakeTwo": 0,
			"maxSystolicBpAll": 144,
			"avgHeartRateAll": 81,
			"validCntWake": 1,
			"gasBagType": 3,
			"planStartTime": 1744080508,
			"dropSystolicBpAll": 1,
			"stdDiastolicBpAll": 300,
			"loadSystolicBpWake": 1,
			"dropDiastolicBpAll": 1,
			"planID": "V_4:B6_1744080508000",
			"midSystolicBpAll": 144,
			"sleepEndTime": 0,
			"loadDiastolicBpAll": 1,
			"midSystolicBpWakeTwo": 0,
			"midDiastolicBpWakeTwo": 0,
			"avgDiastolicBpWakeTwo": 0,
			"minSystolicBpWakeTwo": 0,
			"minSystolicBpSleep": 0,
			"cntAll": 1,
			"stdHeartRateWake": 300,
			"minDiastolicBpWake": 98,
			"loadSystolicBpAll": 1,
			"loadSystolicBpSleep": 255,
			"cntSleep": 0,
			"loadDiastolicBpWake": 1,
			"stdSystolicBpWake": 300,
			"validCntWakeTwo": 0,
			"minHeartRateWake": 81,
			"planActualTime": 1744081293,
			"coefDiastolicBpWakeTwo": 255,
			"maxSystolicBpSleep": 0,
			"maxSystolicBpWake": 144,
			"minDiastolicBpWakeTwo": 0,
			"stdDiastolicBpWake": 300,
			"maxDiastolicBpWake": 98,
			"stdHeartRateSleep": 300,
			"stdSystolicBpSleep": 300,
			"avgSystolicBpSleep": 0,
			"avgDiastolicBpAll": 98,
			"maxHeartRateWake": 81,
			"midDiastolicBpAll": 98,
			"midHeartRateSleep": 0,
			"validCntAll": 1,
			"avgSystolicBpWake": 144,
			"validCntSleep": 0,
			"avgHeartRateWake": 81,
			"stdHeartRateAll": 300,
			"coefHeartRateSleep": 255,
			"midSystolicBpWake": 144,
			"maxDiastolicBpWakeTwo": 0,
			"midHeartRateWake": 81,
			"avgDiastolicBpWake": 98,
			"midHeartRateWakeTwo": 0,
			"avgHeartRateSleep": 0,
			"coefHeartRateAll": 255,
			"avgHeartRateWakeTwo": 0,
			"avgDiastolicBpSleep": 0,
			"midDiastolicBpSleep": 0,
			"coefSystolicBpAll": 255,
			"minHeartRateSleep": 0,
			"coefSystolicBpWake": 255,
			"maxHeartRateAll": 81,
			"midSystolicBpSleep": 0,
			"minHeartRateWakeTwo": 0,
			"coefHeartRateWake": 255,
			"coefDiastolicBpAll": 255,
			"coefDiastolicBpWake": 255,
			"peakDiastolicBpAll": 300,
			"maxHeartRateWakeTwo": 0,
			"stdSystolicBpAll": 300,
			"minSystolicBpAll": 144,
			"coefSystolicBpWakeTwo": 255,
			"sleepStartTime": 0,
			"avgSystolicBpWakeTwo": 0,
			"coefSystolicBpSleep": 255,
			"minSystolicBpWake": 144,
			"minHeartRateAll": 81,
			"maxDiastolicBpSleep": 0,
			"cntWake": 1,
			"minDiastolicBpSleep": 0,
			"cntWakeTwo": 0,
			"stdSystolicBpWakeTwo": 300,
			"midDiastolicBpWake": 98,
			"stdDiastolicBpWakeTwo": 300,
			"minDiastolicBpAll": 98,
			"planEndTime": 1744166908,
			"coefDiastolicBpSleep": 255,
			"coefHeartRateWakeTwo": 255,
			"peakSystolicBpAll": 300
		},
		"detailData": {
			"systolic": "[144]",
			"diastolic": "[98]",
			"heartRate": "[81]",
			"timestamp": "[1744080632]",
			"label": "[0]"
		}
	}]
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| dataType | dynamicBloodPressureData | Type of the ambulatory blood pressure monitoring report. |
| totalCount | Data of the int type | Total number of data records of the current data type. |
| index | Data of the int type | Index of the first returned data recording point among all data. |
| count | Data of the int type | Number of records returned. |
| dataList | - | Data list. Fields vary depending on the data type. |
| startTime | UTC time, in seconds | Time when the ambulatory blood pressure monitoring report is generated, in seconds. |
| summaryData | - | Summary of the ambulatory blood pressure monitoring report. |
| detailData | - | Details of the ambulatory blood pressure monitoring report. |
 
| Parameter | Value | Description |
| --- | --- | --- |
| planStartTime | Data of the long type | Plan start time (UTC time in seconds). |
| planEndTime | Data of the long type | Plan end time (UTC time in seconds). |
| planActualTime | Data of the long type | Actual plan end time (UTC time in seconds). |
| planStatus | Data of the int type | Plan status. **0**: The plan is started. **1**: The user terminates the plan in advance. **2**: The plan ends as expected with enough measurements taken. **3**: The plan ends as expected but does not have enough valid daytime measurements. **4**: The plan ends as expected but does not have enough valid nighttime measurements. **5**: The plan ends as expected but does not have enough valid daytime and nighttime measurements. |
| planID | Data of the String type | Plan ID, which contains a maximum of 64 bytes. |
| gasBagType | Data of the int type | Cuff specifications. |
| sleepStartTime | Data of the long type | Sleep start time (UTC time in seconds). |
| sleepEndTime | Data of the long type | Sleep end time (UTC time in seconds). |
| validCntAll | Data of the int type | Number of valid blood pressure readings within 24 hours. The value range is [0, 1440]. |
| validCntWake | Data of the int type | Number of valid blood pressure readings when the user is awake. The value range is [0, 1440]. |
| validCntSleep | Data of the int type | Number of valid blood pressure readings when the user is asleep. The value range is [0, 1440]. |
| validCntWakeTwo | Data of the int type | Number of valid blood pressure readings within 2 hours after the user wakes up. The value range is [0, 1440]. |
| cntAll | Data of the int type | Total number of blood pressure readings within 24 hours. The value range is [0, 1440]. |
| cntWake | Data of the int type | Total number of blood pressure readings when the user is awake. The value range is [0, 1440]. |
| cntSleep | Data of the int type | Total number of blood pressure readings when the user is asleep. The value range is [0, 1440]. |
| cntWakeTwo | Data of the int type | Total number of blood pressure readings within 2 hours after the user wakes up. The value range is [0, 1440]. |
| maxSystolicBpAll | Data of the int type | Maximum systolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxDiastolicBpAll | Data of the int type | Maximum diastolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxHeartRateAll | Data of the int type | Maximum heart rate within 24 hours. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| midSystolicBpAll | Data of the int type | Median systolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midDiastolicBpAll | Data of the int type | Median diastolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midHeartRateAll | Data of the int type | Median heart rate within 24 hours. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| minSystolicBpAll | Data of the int type | Minimum systolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minDiastolicBpAll | Data of the int type | Minimum diastolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minHeartRateAll | Data of the int type | Minimum heart rate within 24 hours. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| avgSystolicBpAll | Data of the int type | Average systolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgDiastolicBpAll | Data of the int type | Average diastolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgHeartRateAll | Data of the int type | Average heart rate within 24 hours. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| stdSystolicBpAll | Data of the int type | Standard deviation of systolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdDiastolicBpAll | Data of the int type | Standard deviation of diastolic blood pressure within 24 hours. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdHeartRateAll | Data of the int type | Standard deviation of the heart rate within 24 hours. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| coefSystolicBpAll | Data of the double type | Variation coefficient of systolic blood pressure within 24 hours. The value ranges from 0 to 1. |
| coefDiastolicBpAll | Data of the double type | Variation coefficient of diastolic blood pressure within 24 hours. The value ranges from 0 to 1. |
| coefHeartRateAll | Data of the double type | Variation coefficient of the heart rate within 24 hours. The value ranges from 0 to 1. |
| loadSystolicBpAll | Data of the double type | Systolic blood pressure load within 24 hours. The value ranges from 0 to 1. |
| loadDiastolicBpAll | Data of the double type | Diastolic blood pressure load within 24 hours. The value ranges from 0 to 1. |
| dropSystolicBpAll | Data of the double type | Nocturnal dip of systolic blood pressure within 24 hours. The value range is [-3, 3]. When the plan status field is **3**, **4**, or **5**, this parameter is invalid. |
| dropDiastolicBpAll | Data of the double type | Nocturnal dip of diastolic blood pressure within 24 hours. The value range is [-3, 3]. When the plan status field is **3**, **4**, or **5**, this parameter is invalid. |
| peakSystolicBpAll | Data of the int type | Morning surge of systolic blood pressure within 24 hours. The value ranges from –300 to +300, in mmHg. The value **300** indicates no result. |
| peakDiastolicBpAll | Data of the int type | Morning surge of diastolic blood pressure within 24 hours. The value ranges from -300 to 300, in mmHg. The value **300** indicates no result. |
| maxSystolicBpWake | Data of the int type | Maximum systolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxDiastolicBpWake | Data of the int type | Maximum diastolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxHeartRateWake | Data of the int type | Maximum heart rate when the user is awake. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| midSystolicBpWake | Data of the int type | Median systolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midDiastolicBpWake | Data of the int type | Median diastolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midHeartRateWake | Data of the int type | Median heart rate when the user is awake. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| minSystolicBpWake | Data of the int type | Minimum systolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minDiastolicBpWake | Data of the int type | Minimum diastolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minHeartRateWake | Data of the int type | Minimum heart rate when the user is awake. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| avgSystolicBpWake | Data of the int type | Average systolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgDiastolicBpWake | Data of the int type | Average diastolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgHeartRateWake | Data of the int type | Average heart rate when the user is awake. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| stdSystolicBpWake | Data of the int type | Standard deviation of systolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdDiastolicBpWake | Data of the int type | Standard deviation of diastolic blood pressure when the user is awake. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdHeartRateWake | Data of the int type | Standard deviation of the heart rate when the user is awake. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| coefSystolicBpWake | Data of the double type | Variation coefficient of systolic blood pressure when the user is awake. The value range is [0, 1]. |
| coefDiastolicBpWake | Data of the double type | Variation coefficient of diastolic blood pressure when the user is awake. The value range is [0, 1]. |
| coefHeartRateWake | Data of the double type | Variation coefficient of the heart rate when the user is awake. The value range is [0, 1]. |
| loadSystolicBpWake | Data of the double type | Systolic blood pressure load when the user is awake. The value range is [0, 1]. |
| loadDiastolicBpWake | Data of the double type | Diastolic blood pressure load when the user is awake. The value range is [0, 1]. |
| maxSystolicBpSleep | Data of the int type | Maximum systolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxDiastolicBpSleep | Data of the int type | Maximum diastolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxHeartRateSleep | Data of the int type | Maximum heart rate when the user is asleep. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| midSystolicBpSleep | Data of the int type | Median systolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midDiastolicBpSleep | Data of the int type | Median diastolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midHeartRateSleep | Data of the int type | Median heart rate when the user is asleep. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| minSystolicBpSleep | Data of the int type | Minimum systolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minDiastolicBpSleep | Data of the int type | Minimum diastolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minHeartRateSleep | Data of the int type | Minimum heart rate when the user is asleep. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| avgSystolicBpSleep | Data of the int type | Average systolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgDiastolicBpSleep | Data of the int type | Average diastolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgHeartRateSleep | Data of the int type | Average heart rate when the user is asleep. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| stdSystolicBpSleep | Data of the int type | Standard deviation of systolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdDiastolicBpSleep | Data of the int type | Standard deviation of diastolic blood pressure when the user is asleep. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdHeartRateSleep | Data of the int type | Standard deviation of the heart rate when the user is asleep. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| coefSystolicBpSleep | Data of the double type | Variation coefficient of systolic blood pressure when the user is asleep. The value range is [0, 1]. The value **255** indicates an invalid value. |
| coefDiastolicBpSleep | Data of the double type | Variation coefficient of diastolic blood pressure when the user is asleep. The value range is [0, 1]. The value **255** indicates an invalid value. |
| coefHeartRateSleep | Data of the double type | Variation coefficient of the heart rate when the user is asleep. The value range is [0, 1]. The value **255** indicates an invalid value. |
| loadSystolicBpSleep | Data of the double type | Systolic blood pressure load when the user is asleep. The value range is [0, 1]. The value **255** indicates an invalid value. |
| loadDiastolicBpSleep | Data of the double type | Diastolic blood pressure load when the user is asleep. The value range is [0, 1]. The value **255** indicates an invalid value. |
| maxSystolicBpWakeTwo | Data of the int type | Maximum systolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxDiastolicBpWakeTwo | Data of the int type | Maximum diastolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| maxHeartRateWakeTwo | Data of the int type | Maximum heart rate within 2 hours after the user wakes up. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| midSystolicBpWakeTwo | Data of the int type | Median systolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midDiastolicBpWakeTwo | Data of the int type | Median diastolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| midHeartRateWakeTwo | Data of the int type | Median heart rate within 2 hours after the user wakes up. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| minSystolicBpWakeTwo | Data of the int type | Minimum systolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minDiastolicBpWakeTwo | Data of the int type | Minimum diastolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| minHeartRateWakeTwo | Data of the int type | Minimum heart rate within 2 hours after the user wakes up. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| avgSystolicBpWakeTwo | Data of the int type | Average systolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgDiastolicBpWakeTwo | Data of the int type | Average diastolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| avgHeartRateWakeTwo | Data of the int type | Average heart rate within 2 hours after the user wakes up. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| stdSystolicBpWakeTwo | Data of the int type | Standard deviation of systolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdDiastolicBpWakeTwo | Data of the int type | Standard deviation of diastolic blood pressure within 2 hours after the user wakes up. The value ranges from 0 to 300, in mmHg. The value **0** indicates no result. |
| stdHeartRateWakeTwo | Data of the int type | Standard deviation of the heart rate within 2 hours after the user wakes up. The value ranges from 0 to 300 (unit: beats/min). The value **0** indicates no result. |
| coefSystolicBpWakeTwo | Data of the double type | Variation coefficient of systolic blood pressure within 2 hours after the user wakes up. The value range is [0, 1]. |
| coefDiastolicBpWakeTwo | Data of the double type | Variation coefficient of diastolic blood pressure within 2 hours after the user wakes up. The value range is [0, 1]. |
| coefHeartRateWakeTwo | Data of the double type | Variation coefficient of the heart rate within 2 hours after the user wakes up. The value range is [0, 1]. |
 
| Parameter | Value | Description |
| --- | --- | --- |
| systolic | List of data of the int type | List of systolic blood pressure readings, with each reading expressed in mmHg. |
| diastolic | List of data of the int type | List of diastolic blood pressure readings, with each reading expressed in mmHg. |
| heartRate | List of data of the int type | List of heart rates measured with blood pressure, with each element expressed in beats per minute. |
| timestamp | List of data of the long type | List of blood pressure measurement time points, with each element expressed in seconds (UTC time). |
| label | List of data of the int type | List of blood pressure reading labels. For each element, the value **1** indicates a valid reading, and the value **0** indicates an invalid reading. |
 To obtain the sleep period data in **summaryData**, you need to [enable TruSleep](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-trusleep-switch-0000002338300784) first to record relevant data.
- **detailData** indicates the blood pressure measurement data recorded for each report. A single report may have multiple measurements stored as separate entries. Each entry contains **systolic**, **diastolic**, **heartRate**, **timestamp**, and **label**.
