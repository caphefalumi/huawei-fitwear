<!--
  Title: Measuring the Step Count of the Current Day
  Catalog: HMSCore-Guides-V5
  Document ID: steps-delta-scene-0000001050822049-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/steps-delta-scene-0000001050822049-V5
-->
# Measuring the Step Count of the Current Day

This section provides an example of reading the daily step count data of a user. You can call **readTodaySummation** to query the **DT_CONTINUOUS_STEPS_DELTA** data type, in order to obtain the step count of the current day.

The sample code is as follows:

```cpp
// 1. Use the specified data type (Incremental step count: DT_CONTINUOUS_STEPS_DELTA) and call readTodaySummation to query the statistics of the data type on the current day.
Task<SampleSet> todaySummationTask = dataController.readTodaySummation(DataType.DT_CONTINUOUS_STEPS_DELTA); 
// 2. Call readTodaySummation to query the statistics of the current day in asynchronous mode. A listener needs to be configured to return the data query result (success or failure).
// Note: This API is used to query the statistics of a certain data type on the current day. The query time range starts from 00:00:00 of the day and ends at the system timestamp when the API is called.
// Calling this API will query all data points with the start time or end time being in the specified time range. The sum value of the queried data points will be returned.
todaySummationTask.addOnSuccessListener(new OnSuccessListener<SampleSet>() { 
    @Override 
    public void onSuccess(SampleSet sampleSet) { 
        logger("Success read today summation from HMS core"); 
        if (sampleSet != null) { 
            showSampleSet(sampleSet); 
        } 
    } 
}); 
todaySummationTask.addOnFailureListener(new OnFailureListener() { 
    @Override 
    public void onFailure(Exception e) { 
        String errorCode = e.getMessage(); 
        String errorMsg = HiHealthStatusCodes.getStatusCodeMessage(Integer.parseInt(errorCode)); 
        logger(errorCode + ": " + errorMsg); 
    } 
});
```

> **Note:** If you directly copy and use the preceding sample code, the three errors will be reported. For detailed information and related solutions, see [readTodaySummation(DataType dataType)](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacontroller-0000001050089472-V5#EN-US_TOPIC_0000001053208304__section9463154045415) in the *API Reference*.
