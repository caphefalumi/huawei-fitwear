<!--
  Title: Writing Workout Records
  Catalog: HMSCore-Guides-V5
  Document ID: write-sports-recording-scene-0000001050782024-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/write-sports-recording-scene-0000001050782024-V5
-->
# Writing Workout Records
To insert **ActivityRecord**s with data that has been previously collected to the Health platform, perform the following:

- Create an **ActivityRecord** by specifying a time period and other necessary information.
- Create an **ActivityRecordInsertOptions** using the **ActivityRecord** and optional dataset or grouped sampling point data.
- Use the **ActivityRecordsController.addActivityRecord** method to insert **ActivityRecordInsertOptions**.

The app uses the **ActivityRecordsController.addActivityRecord** method to insert the **ActivityRecord** and associated data to the Health platform.

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
cal.add(Calendar.HOUR_OF_DAY, -1);
long startTime = cal.getTimeInMillis();

// 2. Build the PaceSummary object.
// PaceSummary in ActivitySummary is used to carry pace statistical data.
ActivitySummary activitySummary = new ActivitySummary();
PaceSummary paceSummary = new PaceSummary();
paceSummary.setAvgPace(247.27626);
paceSummary.setBestPace(212.0);
paceSummary.setBritishPaceMap((Map<String, Double>) new HashMap<>().put(50001893, 365));
paceSummary.setPartTimeMap((Map<String, Double>) new HashMap<>().put(1.0, 456));
paceSummary.setPaceMap((Map<String, Double>) new HashMap<>().put(1.0, 263));
paceSummary.setPartTimeMap((Map<String, Double>) new HashMap<>().put(1.0, 263));
paceSummary.setSportHealthPaceMap((Map<String, Double>) new HashMap<>().put(102802480, 535));
activitySummary.setPaceSummary(paceSummary);

// 3. Create a data collector for the step count data.
DataCollector dataCollector2 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("test1")
    .build();
// 4. Build sampling points for statistical data based on the data collector and add the sampling points to the DataSummary object.
SamplePoint samplePoint = new SamplePoint.Builder(dataCollector2).build();
samplePoint.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.FIELD_STEPS).setIntValue(352);
activitySummary.setDataSummary(Arrays.asList(samplePoint));

// 5. Build the activity record and set the ActivitySummary object of the statistical data.
ActivityRecord activityRecord = new ActivityRecord.Builder()
    .setName("AddActivityRecord")
    .setDesc("This is ActivityRecord add test!")
    .setId("MyAddActivityRecordId")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .setActivitySummary(activitySummary)
    .setMetadata("this is a exercise activity test")
    .setTimeZone("+0800")
    .build();

// 6. Create a data collector for detailed data.
DataCollector dataCollector = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("AddActivityRecord")
    .build();
// 7. Build the sampling dataset based on the detailed data collector.
SampleSet sampleSet = SampleSet.create(dataCollector);

// 8. Build a sampling point object for the detailed incremental step count data (DT_CONTINUOUS_STEPS_DELTA) and add it to the detailed sampling dataset sampleSet.
SamplePoint samplePoint1 = sampleSet.createSamplePoint().setTimeInterval(startTime,endTime,TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(1024);
sampleSet.addSample(samplePoint1);

// 9. Build an activity record request and set the activityRecord object and the associated detailed sampling dataset sampleSet.
ActivityRecordInsertOptions insertOption = new ActivityRecordInsertOptions.Builder()
    .setActivityRecord(activityRecord).addSampleSet(sampleSet).build();

// 10. Call the addActivityRecord method to add an activity record.
Task<Void> addTask = activityRecordsController.addActivityRecord(insertOption);
addTask.addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void aVoid) {
        Log.i("ActivityRecords","ActivityRecord add was successful!");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        Log.i("ActivityRecords",errorCode + ": " + errorMsg);
    }
});
```
