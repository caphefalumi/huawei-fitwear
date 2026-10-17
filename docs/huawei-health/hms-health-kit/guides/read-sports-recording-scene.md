<!--
  Title: Reading Workout Records
  Catalog: HMSCore-Guides-V5
  Document ID: read-sports-recording-scene-0000001050782026-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/read-sports-recording-scene-0000001050782026-V5
-->
# Reading Workout Records

The user can obtain a list of **ActivityRecords** and associated data that meets certain criteria from the Health platform, for example, activity records of specific data included in a specific time period, or **ActivityRecord**s created by another app. The **activitySummary** in **ActivityRecord** enables you to obtain the statistical data of the corresponding activity record. You can find the detailed data in **sampleSet** of **ActivityRecordReply**.

- Create an **ActivityRecordReadOptions** instance to obtain an activity record list.
- Call the **ActivityRecordsController.getActivityRecord** method to obtain the data.

```cpp
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
final ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(getApplicationContext(), signInHuaweiId);

// 1. Build the time range of the request object: start time and end time.
// Note that the start time and end time must be later than the UNIX timestamp corresponding to January 1, 2014.
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.DAY_OF_YEAR, -1);
long startTime = cal.getTimeInMillis();

// 2. Build the request body for reading activity records and set the request time range.
ActivityRecordReadOptions readOption =
    new ActivityRecordReadOptions.Builder().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
        .readActivityRecordsFromAllApps()
        .build();

// 3. Call getActivityRecord to obtain the activity records on the Health platform based on the request body.
Task<ActivityRecordReply> getTask = activityRecordsController.getActivityRecord(readOption);
getTask.addOnSuccessListener(new OnSuccessListener<ActivityRecordReply>() {
    @Override
    public void onSuccess(ActivityRecordReply activityRecordReply) {
        Log.i("ActivityRecords","Get ActivityRecord was successful!");
        // Print the obtained activity records.
        List<ActivityRecord> activityRecordList = activityRecordReply.getActivityRecords();
        for (ActivityRecord activityRecord : activityRecordList) {
            if (activityRecord == null) {
                continue;
            }
            DateFormat dateFormat = DateFormat.getDateInstance();
            DateFormat timeFormat = DateFormat.getTimeInstance();
            Log.i("ActivityRecordSample",
                "Returned for ActivityRecord: " + activityRecord.getName() + "\n\tActivityRecord Identifier is "
                + activityRecord.getId() + "\n\tActivityRecord created by app is "
                + activityRecord.getPackageName() + "\n\tDescription: " + activityRecord.getDesc()
                + "\n\tStart: " + dateFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS))
                + " " + timeFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + "\n\tEnd: "
                + dateFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + "\n\tActivity:"
                + activityRecord.getActivityType() + "\n\tTimeZone:" + activityRecord.getTimeZone() 
                + "\n\tmetadata:" + activityRecord.getMetadata());
            // Print ActivitySummary in each activity record. printActivitySummary is a customized output function.
            if (activityRecord.getActivitySummary() != null) {
                printActivitySummary(activityRecord.getActivitySummary());
            }
            // Print the detailed data point corresponding to each activity record.
            for (SampleSet sampleSet : activityRecordReply.getSampleSet(activityRecord)) {
                Log.i("ActivityRecordSample",
                    "Returned for SamplePoint and Data type: " + sampleSet.getDataType().getName());
                for (SamplePoint dp : sampleSet.getSamplePoints()) {
                    Log.i("ActivityRecordSample", "SamplePoint:");
                    Log.i("ActivityRecordSample", "DataCollector:" + dp.getDataCollector().toString());
                    Log.i("ActivityRecordSample", "\tType: " + dp.getDataType().getName());
                    Log.i("ActivityRecordSample",
                        "\tStart: " + dateFormat.format(dp.getStartTime(TimeUnit.MILLISECONDS)));
                    Log.i("ActivityRecordSample",
                        "\tEnd: " + dateFormat.format(dp.getEndTime(TimeUnit.MILLISECONDS)));
                    for (Field field : dp.getDataType().getFields()) {
                        Log.i("ActivityRecordSample",
                            "\tField: " + field.toString() + " Value: " + dp.getFieldValue(field));
                    }
                }
            }
        }
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        Log.i("ActivityRecords",errorCode + ": " + errorMsg);
    }
});
// 4. Call the read method of DataController to obtain the workout data from the Health platform based on the request body.
// Build the condition-based query object.
// Enter the values of the following data types: DT_INSTANTANEOUS_SPEED, DT_INSTANTANEOUS_STEPS_RATE, and DT_INSTANTANEOUS_EXERCISE_HEART_RATE.
// They are used to query the speed, step cadence, and heart rate during workout. For details about the supported data types, see Open Data Types Associated with Workout Records.
ReadOptions readOptions = new ReadOptions.Builder()
    .read(DataType.DT_INSTANTANEOUS_SPEED)
    .read(DataType.DT_INSTANTANEOUS_STEPS_RATE)
    .read(DataType.DT_INSTANTANEOUS_EXERCISE_HEART_RATE)
    .setTimeRange(startTime, endTime, TimeUnit.MILLISECONDS)
    .build();

DataController dataController = HuaweiHiHealth.getDataController(getApplicationContext(), signInHuaweiId);
Task<ReadReply> readReplyTask = dataController.read(readOptions);
// Calling the API for querying sampling dataset is an asynchronous operation. Therefore, a listener needs to be registered to monitor whether the data query is successful or not.
readReplyTask.addOnSuccessListener(new OnSuccessListener<ReadReply>() {
    @Override
    public void onSuccess(ReadReply readReply) {
        Log.i("ActivityRecordSample", "Success read a SampleSets from HMS core");
        for (SampleSet sampleSet : readReply.getSampleSets()) {
            showSampleSet(sampleSet);
        }
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        Log.i("ActivityRecordSample", errorCode + ": " + errorMsg);
    }
});
```

> **Note:** In the preceding code snippet, the following auxiliary functions are used: 1. The Health platform returns the display function **printActivitySummary(ActivitySummary activitySummary)** of the **ActivitySummary** data. The sample code of the function is as follows: 
```cpp
// Customize the ActivitySummary output function.
public void printActivitySummary(ActivitySummary activitySummary) {
    List<SamplePoint> dataSummary = activitySummary.getDataSummary();
        Log.i("ActivityRecordSample", "\nPrint statistical data: ");
    Log.i("ActivityRecordSample", "\nActivitySummary\n\t DataSummary: ");
    // Print statistical data points.
    for (SamplePoint samplePoint : dataSummary) {
        Log.i("ActivityRecordSample", "\n\t samplePoint: \n\t DataCollector" + samplePoint.getDataCollector() + "\n\t DataType" 
            + samplePoint.getDataType() + "\n\t StartTime" + samplePoint.getStartTime(TimeUnit.MILLISECONDS) + "\n\t EndTime"
            + samplePoint.getEndTime(TimeUnit.MILLISECONDS) + "\n\t SamplingTime" + samplePoint.getSamplingTime(TimeUnit.MILLISECONDS)
            + "\n\t FieldValues" + samplePoint.getFieldValues());
    }
    // Print the pace information.
    PaceSummary paceSummary = activitySummary.getPaceSummary();
    Log.i("ActivityRecordSample", "\n\t PaceSummary: \n\t AvgPace" + paceSummary.getAvgPace() + "\n\t BestPace" 
        + paceSummary.getBestPace() + "\n\t PaceMap" + paceSummary.getPaceMap() + "\n\t PartTimeMap"
        + paceSummary.getPartTimeMap() + "\n\t BritishPaceMap" + paceSummary.getBritishPaceMap() 
        + "\n\t BritishPartTimeMap" + paceSummary.getBritishPartTimeMap() + "\n\t SportHealthPaceMap"
        + paceSummary.getSportHealthPaceMap());
}
```
 2. The Health platform returns the data display function **showSampleSet(SampleSet sampleSet)**. The sample code of the function is as follows: 
```cpp
// Customize the display function of the returned data.
private void showSampleSet(SampleSet sampleSet) {
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    for (SamplePoint samplePoint : sampleSet.getSamplePoints()) {
        Log.i("ActivityRecordSample", "Sample point type: " + samplePoint.getDataType().getName());
        Log.i("ActivityRecordSample", "Start: " + dateFormat.format(new Date(samplePoint.getStartTime(TimeUnit.MILLISECONDS))));
        Log.i("ActivityRecordSample", "End: " + dateFormat.format(new Date(samplePoint.getEndTime(TimeUnit.MILLISECONDS))));
        for (Field field : samplePoint.getDataType().getFields()) {
            Log.i("ActivityRecordSample", "Field: " + field.getName() + " Value: " + samplePoint.getFieldValue(field));
        }
    }
}
```
