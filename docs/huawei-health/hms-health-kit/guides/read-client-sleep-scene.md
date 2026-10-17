<!--
  Title: Reading Sleep Data
  Catalog: HMSCore-Guides-V5
  Document ID: read-client-sleep-scene-0000001091427304-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/read-client-sleep-scene-0000001091427304-V5
-->
# Reading Sleep Data

You can call **getActivityRecord** to read activity records of the sleep data type.

```cpp
Log.i(TAG, "Reading a activityRecord for a sleep");
// Build the time range of the request object: start time and end time.
// Note that the start time and end time must be later than the UNIX timestamp corresponding to January 1, 2014.
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.HOUR_OF_DAY, -1);
long startTime = cal.getTimeInMillis();

// Create ActivityRecordReadOptions for querying sleep activity records and set the request time range.
ActivityRecordReadOptions activityRecordReadOptions = 
    new ActivityRecordReadOptions.Builder().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS)
        .readActivityRecordsFromAllApps()
        .setActivityRecordId(HiHealthActivities.SLEEP)
        .build();

HiHealthOptions hiHealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hiHealthOptions);
ActivityRecordsController mActivityRecordController = HuaweiHiHealth.getActivityRecordsController(this, signInHuaweiId);

// Call the getActivityRecord method to query the sleep activity records.
mActivityRecordController.getActivityRecord(activityRecordReadOptions)
    .addOnSuccessListener(new OnSuccessListener<ActivityRecordReply>() {
        @Override
        public void onSuccess(ActivityRecordReply activityRecordReply) {
            Log.i("ActivityRecordSample", "Reading ActivityRecord  response status " + activityRecordReply.getStatus());
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
            Log.i("ActivityRecordSample", errorCode + ": " + errorMsg);
        }
    });
```

> **Note:** In the preceding code snippet, the auxiliary function **printActivitySummary(ActivitySummary activitySummary)** is used to display the data returned by the Health platform. The following is a code example of the function: 
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
