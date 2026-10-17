<!--
  Title: Querying Activity Records
  Catalog: huaweihealth-Guides
  Document ID: query-activity-record-0000002624549043
  Updated: 2026-08-05 02:10:16
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/query-activity-record-0000002624549043
-->
# Querying Activity Records

This section describes how to query activity records based on the activity recording capability of wearables. After a user engages in activities, industry apps can call the corresponding API to query the activity records on the wearable. Activity data includes active calories, exercise duration, hours active, and their corresponding goals.

- Import the required module.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [queryHistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section2013310181189) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query activity records. 
```cpp
Task {
    do {
        let device = try IndustryService.getDeviceManager().getDevice()
        let data = try await device.queryHistoryData(
            type: .activityRecord,
            startTime: 1778299200,
            endTime: 177829980
        )
        print("Succeeded in querying activityRecord, data is \(data)")
    } catch let err as IndustryError {
        print("Failed to query activityRecord. Code: \(err.code), message: \(err.message)")
    }
}
```
 > **Note:** Parameter requirements of the API for querying activity records: The query start time must be earlier than the query end time. The query end time cannot be later than the current time. The interval between the query start time and current time cannot exceed 7 days (including the current day). If the query succeeds, the API returns [[HistoryData](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section1036173885514)] when activity records exist, or an empty array **[]** when no activity records are available. If the query fails, the API throws [IndustryError](https://developer.huawei.com/consumer/en/doc/health-References/industry_error_ios-0000002594109612). Example of the activity record data returned if the query is successful: 
```cpp
[
    {
        startTime: 1778428800,
        endTime: 1778515199,
        type: .activityRecord,
        fields: [
            "calories": 1560,
            "exerciseDuration": 0,
            "standHours": 1,
            "caloriesGoal": 220000,
            "exerciseDurationGoal": 30,
            "standHoursGoal": 16
        ]
    },
    ...
]
```
 
| Field | Type | Unit | Description |
| --- | --- | --- | --- |
| calories | Int | cal | Active calories. |
| exerciseDuration | Int | Minute | Exercise duration. |
| standHours | Int | Hour | Hours active. |
| caloriesGoal | Int | cal | Active calories goal. |
| exerciseDurationGoal | Int | Minute | Exercise duration goal. |
| standHoursGoal | Int | Hour | Goal of hours active. |
