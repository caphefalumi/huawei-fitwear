<!--
  Title: Real-time Step Count Reading Scenarios
  Catalog: HMSCore-Guides-V5
  Document ID: real-time-steps-data-0000001054876912-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/real-time-steps-data-0000001054876912-V5
-->
# Real-time Step Count Reading Scenarios

This section provides an example of how to read the user's real-time step count via the client API of Health Kit.

To start or stop real-time step count reading, it is recommended that WakeLock be applied for your app and the related client API calling be implemented in a foreground service via Health Kit. The foreground service can be implemented in multiple ways. In this example, the notification panel is bound to implement the foreground service. For details about the related code, see [Sample Code](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Examples-V5/sample-code-client-0000001050983703-V5).

The real-time step count reading capability is as follows:

- Your app calls the API for starting reading the real-time total step count in the foreground service. The step count starts from 0, and the total step count will be called back in real time.
- Your app calls the API for stopping reading the real-time total step count in the foreground service. The API will stop the real-time data reading, and the step count data will not be called back to your app.

Before using the real-time step count reading capability, note the following:

- Recommended: Apply for WakeLock and use the foreground service to call the real-time step count reading API. This ensures that the real-time step count can be called back when the phone screen is off.
- Not recommended: Integrate the real-time step count reading API using the foreground app. In this case, the data can be called back when the device screen is on, but not when the device screen is off.
- Currently, only one listener is supported at any given time for an app to read the real-time step count data.
- Multiple apps on the same device can read the real-time step count data. The callback data will not interfere with each other.
- With real-time step count reading enabled, the real-time step count reading stops if the app crashes.
- Each time an app calls **startRecord**, the number of steps is reset to **0** and the number of steps generated during the start and stop period is returned in real time. Your app needs to store such data on its own.
- Before calling the real-time data read API, check whether the user has granted the Physical activity permission to HMS Core. Huawei phones running Android 10.0 or later: Open HMS Core and go to **Permissions** > **Physical activity permission**.

You can perform the following operations.

Start real-time data reading:

```cpp
HiHealthOptions options = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
final AutoRecorderController controller = HuaweiHiHealth.getAutoRecorderController(getApplicationContext(), signInHuaweiId);
// Create the data callback object onSamplePointListener to print the step count data.
private OnSamplePointListener onSamplePointListener = new OnSamplePointListener() {
    @Override
    public void onSamplePoint(SamplePoint samplePoint) {
        for (Field field : samplePoint.getDataType().getFields()) {
            Log.i("AutoRecorderTest", "Field: " + field.getName() + " Value: " + samplePoint.getFieldValue(field));
        }
    }
};

 // 1. Specify the data type as DT_CONTINUOUS_STEPS_TOTAL for start reading the real-time data.
DataType dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL;
// 2. Start real-time reading of the total number of steps which starts from 0. An updated value will be reported.
// When the phone moves with the user, the total number of steps is returned to the user in real time at a fixed interval until the user finishes reading the data. The callback of total step count will then stop.
controller.startRecord(dataType, onSamplePointListener).addOnCompleteListener(new OnCompleteListener<Void>() {
    @Override
    public void onComplete(Task<Void> taskResult) {
        // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
        if (taskResult.isSuccessful()) {
            Log.i("AutoRecorderTest", "onComplete startRecordByType Successful");
        } else {
            Log.i("AutoRecorderTest", "onComplete startRecordByType Failed");
        }
    }
}).addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void result) {
        Log.i("AutoRecorderTest", "onSuccess startRecordByType Successful");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        Log.i("AutoRecorderTest", "onFailure startRecordByType Failed: " + e.getMessage());
    }
});
```

Stop real-time data reading:

```cpp
HiHealthOptions options = HiHealthOptions.builder().build();
AuthHuaweiId signInHuaweiId = HuaweiIdAuthManager.getExtendedAuthResult(options);
final AutoRecorderController controller = HuaweiHiHealth.getAutoRecorderController(getApplicationContext(), signInHuaweiId);
// Create the callback object onSamplePointListener.
private OnSamplePointListener onSamplePointListener = new OnSamplePointListener() {
    @Override
    public void onSamplePoint(SamplePoint samplePoint) {
    }
};
 // 1. Specify the data type as DT_CONTINUOUS_STEPS_TOTAL for stopping reading the real-time data.
DataType dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL;
// 2. Start real-time reading of the total number of steps which starts from 0. An updated value will be reported.
// When the phone moves with the user, the total number of steps is returned to the user in real time at a fixed interval until the user finishes reading the data. The callback of total step count will then stop.
controller.stopRecord(dataType, onSamplePointListener).addOnCompleteListener(new OnCompleteListener<Void>() {
    @Override
    public void onComplete(Task<Void> taskResult) {
        // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
        if (taskResult.isSuccessful()) {
            Log.i("AutoRecorderTest", "onComplete startRecordByType Successful");
        } else {
            Log.i("AutoRecorderTest", "onComplete startRecordByType Failed");
        }
    }
}).addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void result) {
        Log.i("AutoRecorderTest", "onSuccess startRecordByType Successful");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        Log.i("AutoRecorderTest", "onFailure startRecordByType Failed: " + e.getMessage());
    }
});
```
