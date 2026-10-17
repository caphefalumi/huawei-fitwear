<!--
  Title: Measuring the Step Count of Multiple Days
  Catalog: HMSCore-Guides-V5
  Document ID: daily-steps-delta-scene-0000001057694804-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/daily-steps-delta-scene-0000001057694804-V5
-->
# Measuring the Step Count of Multiple Days

This section provides an example of how to obtain the user's step count of multiple days via the client API of Health Kit. You can call **readDailySummation** to query the **DT_CONTINUOUS_STEPS_DELTA** data type, in order to obtain the step count of multiple days.

The sample code is as follows:

```cpp
// 1. Initialize the start time and end time, in the format of YYYYMMDD.
// Note that the start time and end time must be later than January 1, 2014.
int startTime = 20200818;
int endTime = 20200827;
 
// 2. Use the specified data type (DT_CONTINUOUS_STEPS_DELTA), start time, and end time to call readDailySummation to query the statistical data of multiple days.
Task<SampleSet> daliySummationTask =
    dataController.readDailySummation(DataType.DT_CONTINUOUS_STEPS_DELTA, startTime, endTime);

daliySummationTask.addOnSuccessListener(new OnSuccessListener<SampleSet>() {
    @Override
    public void onSuccess(SampleSet sampleSet) {
        logger("Success read daily summation from HMS core");
        if (sampleSet != null) {
            showSampleSet(sampleSet);
        }
    }
});
daliySummationTask.addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        logger("readTodaySummation" + e.toString());
    }
});
```

> **Note:** If you directly copy and use the preceding sample code, the three errors will be reported. For detailed information and related solutions, see [readDailySummation(DataType dataType, int startTime, int endTime)](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5#EN-US_TOPIC_0000001053208304__section295981925017) in the API Reference.
