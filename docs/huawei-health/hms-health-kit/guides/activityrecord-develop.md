<!--
  Title: ActivityRecordsController
  Catalog: HMSCore-Guides-V5
  Document ID: activityrecord-develop-0000001050069730-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activityrecord-develop-0000001050069730-V5
-->
# ActivityRecordsController

> **Note:** When calling the APIs in the Health Kit SDK for Android, make sure that the screen of the phone is unlocked and remains on. Otherwise, the API may fail to be called. For details, see the [result code](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthstatuscodes-0000001050089560-V5#EN-US_TOPIC_0000001053487071__section10673269124) **INTERNAL_ERROR**. If the **Activity** object (called in scenarios where app UIs are included) is passed when **HuaweiHiHealth.getActivityRecordsController()** is used to obtain the **ActivityRecordsController** object, force updating HMS Core is supported. If the **Context** object (called in scenarios where app UIs are not included) is passed, force updating HMS Core is not supported.

#### Inserting ActivityRecord to the Health Platform

You can write activity records into the Health platform via **ActivityRecordController**. The detailed operations are as follows:

The app needs to check whether the **ActivityRecord** data operation permission has been granted.

- https://www.huawei.com/healthkit/activityrecord.read
- https://www.huawei.com/healthkit/activityrecord.write

- Create an **ActivityRecord **with the specified duration, time zone, activity statistics, and other necessary information.
- Create an **ActivityRecordInsertOptions **using **ActivityRecord **and optional dataset or grouped sampling point data.
- Use the **ActivityRecordsController.addActivityRecord** method to insert **ActivityRecordInsertOptions** into the Health platform. The start time and end time of the inserted activity data must be later than the UNIX timestamp corresponding to January 1, 2014.

The sample code for inserting **ActivityRecord **is as follows:

```cpp
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
final ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(getApplicationContext(), signInHuaweiId);

// Build the time range of the request object: start time and end time.
// Note that the start time and end time must be later than the UNIX timestamp corresponding to January 1, 2014.
Calendar cal = Calendar.getInstance();
Date now = new Date();
cal.setTime(now);
long endTime = cal.getTimeInMillis();
cal.add(Calendar.HOUR_OF_DAY, -1);
long startTime = cal.getTimeInMillis();

// Build the PaceSummary object.
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

// Create a data collector for total step count statistics.
DataCollector dataCollector2 = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_TOTAL)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("test1")
    .build();
// Build sampling points for statistical data based on the data collector and add the sampling points to the DataSummary object.
SamplePoint samplePoint = new SamplePoint.Builder(dataCollector2).build();
samplePoint.setTimeInterval(startTime + 1L, startTime + 300000L, TimeUnit.MILLISECONDS);
samplePoint.getFieldValue(Field.FIELD_STEPS).setIntValue(352);
activitySummary.setDataSummary(Arrays.asList(samplePoint));

// Build the activity record and set the ActivitySummary object of the statistical data.
ActivityRecord activityRecord = new ActivityRecord.Builder()
    .setName("AddActivityRecord")
    .setDesc("This is ActivityRecord add test!")
    .setId("MyAddActivityRecordId")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .setEndTime(endTime, TimeUnit.MILLISECONDS)
    .setActivitySummary(activitySummary)
    .setTimeZone("+0800")
    .setMetadata("this is my test") 
    .build();

// Create a data collector for detailed data.
DataCollector dataCollector = new com.huawei.hms.hihealth.data.DataCollector.Builder()
    .setDataType(DataType.DT_CONTINUOUS_STEPS_DELTA)
    .setDataGenerateType(DataCollector.DATA_TYPE_RAW)
    .setPackageName(getApplicationContext())
    .setDataCollectorName("AddActivityRecord")
    .build();
// Build the sampling dataset based on the data collector.
SampleSet sampleSet = SampleSet.create(dataCollector);

// Build a sampling point object for the detailed incremental step count data (DT_CONTINUOUS_STEPS_DELTA) and add it to the detailed sampling dataset sampleSet.
SamplePoint samplePoint1 = sampleSet.createSamplePoint().setTimeInterval(startTime, endTime, TimeUnit.MILLISECONDS);
samplePoint1.getFieldValue(Field.FIELD_STEPS_DELTA).setIntValue(1024);
sampleSet.addSample(samplePoint1);

// Build an activity record request and set the activityRecord object and the associated detailed sampling dataset sampleSet.
ActivityRecordInsertOptions insertOption =
    new ActivityRecordInsertOptions.Builder().setActivityRecord(activityRecord).addSampleSet(sampleSet).build();

// Call addActivityRecord to add an activity record.
Task<Void> addActivityRecordTask = activityRecordsController.addActivityRecord(insertOption);
addActivityRecordTask.addOnSuccessListener(new OnSuccessListener<Void>() {
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

#### Reading ActivityRecords and Associated Data from the Health Platform

The user can obtain a list of **ActivityRecords** and associated data that meets certain criteria from the Health platform, for example, activity records of specific data included in a specific time period, or **ActivityRecord**s created by another app. The **activitySummary** in **ActivityRecord** enables you to obtain the statistical data of the corresponding activity record. You can find the detailed data in **sampleSet** of **ActivityRecordReply**.

- To obtain a list of **ActivityRecord**s that meet the criteria, create an **ActivityRecordReadOptions** instance first. 1. The start time and end time for querying the activity records must be later than the UNIX timestamp corresponding to January 1, 2014. 2. The data type carried in the **read()** parameter of the **ActivityRecordReadOptions** instance can be obtained from [Open Data Types Associated with Workout Records](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/read-sport-health-datatype-0000001059873166-V5#EN-US_TOPIC_0000001059873166__section161381057143611). If the data type is not carried, the activity records in the Health app may fail to be read.
- Use the **ActivityRecordsController.getActivityRecord** method to obtain data.
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
        Log.i("ActivityRecordSample",errorCode + ": " + errorMsg);
    }
});
```

> **Note:** The preceding code snippet uses the auxiliary function **printActivitySummary(ActivitySummary activitySummary)**, which is used by the Health platform to return the **ActivitySummary** data. The sample code of the function is as follows: 
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

#### Creating ActivityRecords in Real Time

Create **ActivityRecord**s for ongoing workout activities. The workout data during an active **ActivityRecord** is implicitly associated with the **ActivityRecord** on the Health platform.

- When the user initiates a workout activity, use the **ActivityRecordsController.beginActivityRecord** method to start an **ActivityRecord**.
- When the user stops a workout activity, use the **ActivityRecordsController.endActivityRecord** method to stop an **ActivityRecord**.

- Start an **ActivityRecord**. The app uses the **ActivityRecordsController.beginActivityRecord** method to start an active **ActivityRecord**. The following is an example: 
```cpp
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
final ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(getApplicationContext(), signInHuaweiId);

// Build the start time of the activity.
long startTime = Calendar.getInstance().getTimeInMillis();
// Build the ActivityRecord object and set the start time of the activity record.
ActivityRecord activityRecord = new ActivityRecord.Builder()
    .setId("MyBeginActivityRecordId")
    .setName("BeginActivityRecord")
    .setDesc("This is ActivityRecord begin test!")
    .setActivityTypeId(HiHealthActivities.RUNNING)
    .setStartTime(startTime, TimeUnit.MILLISECONDS)
    .build();

// Call beginActivityRecord.
Task<Void> task1 = activityRecordsController.beginActivityRecord(activityRecord);
// Add a listener for the ActivityRecord start success.
task1.addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void aVoid) {
        Log.i("ActivityRecords","MyActivityRecord begin success");
    }
// Add a listener for the ActivityRecord start failure.
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        String errorCode = e.getMessage();
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode));
        Log.i("ActivityRecords",errorCode + ": " + errorMsg);
    }
});
```

- Stop the **ActivityRecord**. The app uses the **ActivityRecordsController.endActivityRecord** method to stop a specified **ActivityRecord**. The following is an example: 
```cpp
HiHealthOptions hihealthOptions = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(hihealthOptions);
final ActivityRecordsController activityRecordsController = HuaweiHiHealth.getActivityRecordsController(getApplicationContext(), signInHuaweiId);

// Call endActivityRecord to stop the activity record. The input parameter is the ID string of ActivityRecord or null.
// Stop an activity record of the current app by specifying the ID string as the input parameter.
// Stop activity records of the current app by specifying null as the input parameter.
Task<List<ActivityRecord>> endTask = activityRecordsController.endActivityRecord("MyBeginActivityRecordId");
endTask.addOnSuccessListener(new OnSuccessListener<List<ActivityRecord>>() {
    @Override
    public void onSuccess(List<ActivityRecord> activityRecords) {
        Log.i("ActivityRecords","MyActivityRecord End success");
        // Return the list of activity records that have stopped.
        if (activityRecords.size() > 0) {
            for (ActivityRecord activityRecord : activityRecords) {
                DateFormat dateFormat = DateFormat.getDateInstance();
                DateFormat timeFormat = DateFormat.getTimeInstance();
                Log.i("ActivityRecords", "Returned for ActivityRecord: " + activityRecord.getName() + "\n\tActivityRecord Identifier is "
                    + activityRecord.getId() + "\n\tActivityRecord created by app is " + activityRecord.getPackageName()
                    + "\n\tDescription: " + activityRecord.getDesc() + "\n\tStart: "
                    + dateFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + " "
                    + timeFormat.format(activityRecord.getStartTime(TimeUnit.MILLISECONDS)) + "\n\tEnd: "
                    + dateFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + " "
                    + timeFormat.format(activityRecord.getEndTime(TimeUnit.MILLISECONDS)) + "\n\tActivity:"
                    + activityRecord.getActivityType());
            }
        } else {
            // null will be returned if the activity record hasn't stopped.
            Log.i("ActivityRecords","MyActivityRecord End response is null");
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
```
