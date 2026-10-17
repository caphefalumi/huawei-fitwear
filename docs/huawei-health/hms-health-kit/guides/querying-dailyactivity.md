<!--
  Title: Querying Daily Activities
  Catalog: HMSCore-Guides-V5
  Document ID: querying-dailyactivity-0000001053253403-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/querying-dailyactivity-0000001053253403-V5
-->
**
# Querying Daily Activities

The following describes how to query the daily activity data from the HUAWEI Health app, including your step count statistics, step count details, distance covered, calories burnt, and medium- and high-intensity activity data.

The data is originated from the user's daily activity data recorded by the phone or a Huawei wearable device.

> **Note:** You can obtain both statistics and details data. Statistics include step count, distance, calories, and medium- and high-intensity activity data. If the data of a previous date is queried, the total activity data of the day will be obtained. If the data of the current day is queried, the activity data accumulated from 00:00 to the current time will be obtained. Only the total activity data of the day can be obtained for distance, calories, and medium- and high-intensity activity data. The detailed data includes step count details. You can query data of the current day or a previous date. The returned value is the number of steps per minute. If there is no step details, no value is returned.
Figure 1 **Daily activities

Before querying the data, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

| Data Openness Type | Query API | Requesting Permissions from User (See [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5)) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Step count statistics | [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s491f47becc70431e8a89b2f0dc649715) Queries data by start time, end time, and data type. [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s679e1e2aa392468b92918d2337086104) Queries the number of data items. | [HEALTHKIT_EXTEND_SPORT_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_SPORT_READ) Read permission for basic workout management (including step count statistics, step count details, distance, calories burnt, and medium- and high-intensity activities) | https://www.huawei.com/healthkit/extend/sport.read Read the basic workout information in the Health app via Health Kit. | Basic workout management |
| Step count details |  |  |  |  |
| Distance |  |  |  |  |
| Calories |  |  |  |  |
| Medium- and high-intensity activity data |  |  |  |  |

#### Calling the execQuery Method to Query the Daily Activity Data

- Call the [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s491f47becc70431e8a89b2f0dc649715) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to query the daily activity data of the user.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. > **Note:** When importing the HiHealthDataQuery and HiHealthDataQueryOption packages, select **com.huawei.hihealthkit**. **Sample code** (for step count statistics query) 
```cpp
int timeout = 0;
long endTime = System.currentTimeMillis();
// Query time range: data from 24 hours ago to the current time.
long startTime = endTime - 1000 * 60 * 60 * 24L;
    // Query the step count.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthPointType.DATA_POINT_STEP_SUM, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.execQuery(context, hiHealthDataQuery, timeout, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        Log.i(TAG, "query steps resultCode: " + resultCode);
        if (resultCode == HiHealthError.SUCCESS && data instanceof List){                             
            List dataList = (ArrayList) data;
            for (Object obj : dataList) {
                HiHealthPointData pointData = (HiHealthPointData) obj;
                Log.i(TAG, "start time : " + pointData.getStartTime());
                Log.i(TAG, "query steps : " + String.valueOf(pointData.getValue()));
            }
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthDataQuery | HiHealthDataQuery | Query criteria. | M |
| timeout | int | Timeout. (This is a reserved field, which is not yet in use.) | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| data | Object | Data list. Succeeded (data available): List<HiHealthPointData> Succeeded (no data): success information description (String) Other: error description (String) |

#### Calling the getCount Method to Query the Daily Activity Data Entries

- Call the [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s679e1e2aa392468b92918d2337086104) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to query the daily activity data entries of the user.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** (for step count statistics query) 
```cpp
long endTime = System.currentTimeMillis();
    // The time range for the query is the past 30 days.
long startTime = endTime - 1000 * 60 * 60 * 24 * 30L;
// Query the step count.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthPointType.DATA_POINT_STEP_SUM, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.getCount(context, hiHealthDataQuery, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object data) {
        Log.i(TAG, "query steps count resultCode: " + resultCode);
        if (resultCode == HiHealthError.SUCCESS) {
            if (data != null) {
                int count = (int) data;
                Log.i(TAG, "query steps count: " + count);
            }
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| hiHealthDataQuery | HiHealthDataQuery | Query criteria. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| data | Object | Data entries (int). |

#### Parameters Required for Data Query and Query Results

| Data Openness Type | Parameter for Query | Query Method | Value Type | Result Meaning and Unit |  |
| --- | --- | --- | --- | --- | --- |
| Daily activities | Step count statistics | HiHealthPointType.[DATA_POINT_STEP_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_STEP_SUM) | HiHealthPointData.[getValue](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointdata-0000001071707429-V5#EN-US_TOPIC_0000001136987081__getValue--)() | int | Step count (unit: step). For the current day, the value is updated in real time. For each of the previous days, the value is the total number. |
| Step count details | HiHealthPointType.[DATA_POINT_STEP](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_STEP) | Number of steps per minute (unit: step). |  |  |  |
| Distance | HiHealthPointType.[DATA_POINT_DISTANCE_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_DISTANCE_SUM) | Distance (unit: meter). For the current day, the value is updated in real time. For each of the previous days, the value is the total number. |  |  |  |
| Calories | HiHealthPointType.[DATA_POINT_CALORIES_SUM](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_CALORIES_SUM) | Calories (unit: kcal). For the current day, the value is updated in real time. For each of the previous days, the value is the total number. |  |  |  |
| Medium- and high-intensity activity data | HiHealthPointType.[DATA_POINT_EXERCISE_INTENSITY](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthpointtype-0000001071707433-V5#EN-US_TOPIC_0000001090410576__DATA_POINT_EXERCISE_INTENSITY) | Intensity (unit: minute). For the current day, the value is updated in real time. For each of the previous days, the value is the total number. |  |  |  |
