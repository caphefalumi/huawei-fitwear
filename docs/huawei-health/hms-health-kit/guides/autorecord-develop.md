<!--
  Title: AutoRecorderController
  Catalog: HMSCore-Guides-V5
  Document ID: autorecord-develop-0000001050071679-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/autorecord-develop-0000001050071679-V5
-->
# AutoRecorderController

#### Starting Real-time Data Reading

When starting real-time data reading, specify the type of data to be read in real time. Currently, only the following data types can be read in real time:

Total number of steps: **DT_CONTINUOUS_STEPS_TOTAL**

> **Note:** For the real-time step count reading to be more accurate, it is recommended that you implement API calling in the foreground service. Before calling the real-time data read API, check whether the user has granted the Physical activity permission to HMS Core. Huawei phones running Android 10.0 or later: Open HMS Core and go to **Permissions** > **Physical activity permission**. If the **Activity** object (called in scenarios where app UIs are included) is passed when **HuaweiHiHealth.AutoRecorderController()** is used to obtain the **AutoRecorderController** object, force updating HMS Core is supported. If the **Context** object (called in scenarios where app UIs are not included) is passed, force updating HMS Core is not supported.
Start reading the real-time step count (**DT_CONTINUOUS_STEPS_TOTAL**).
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
// Take DT_CONTINUOUS_STEPS_TOTAL as an example. Start real-time reading of the total number of steps which starts from 0. An updated value will be reported.
// When the phone moves with the user, the total number of steps is returned to the user in real time at a fixed interval until the user finishes reading the data. The callback of total step count will then stop.
DataType dataType = DataType.DT_CONTINUOUS_STEPS_TOTAL;
controller.startRecord(dataType, onSamplePointListener).addOnCompleteListener(new OnCompleteListener<Void>() {
    @Override
    public void onComplete(Task<Void> taskResult) {
        // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
        if (taskResult.isSuccessful()) {
            Log.i("AutoRecorderTest","onComplete startRecordByType Successful");
        } else {
            Log.i("AutoRecorderTest","onComplete startRecordByType Failed");
        }
    }
}).addOnSuccessListener(new OnSuccessListener<Void>() {
    @Override
    public void onSuccess(Void result) {
        Log.i("AutoRecorderTest","onSuccess startRecordByType Successful");
    }
}).addOnFailureListener(new OnFailureListener() {
    @Override
    public void onFailure(Exception e) {
        Log.i("AutoRecorderTest","onFailure startRecordByType Failed: " + e.getMessage());
    }
});
```

#### Stopping Real-time Data Reading

When stopping real-time data reading, specify the type of data for which real-time reading is to be stopped. Currently, only the following data types are supported:

Total number of steps: **DT_CONTINUOUS_STEPS_TOTAL**
Stop reading the real-time step count (**DT_CONTINUOUS_STEPS_TOTAL**).
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
// Call the API for stopping real-time data reading and pass the type of the data to be stopped (DT_CONTINUOUS_STEPS_TOTAL).
controller.stopRecord(DataType.DT_CONTINUOUS_STEPS_TOTAL, onSamplePointListener)
    .addOnCompleteListener(new OnCompleteListener<Void>() {
        @Override
        public void onComplete(Task<Void> taskResult) {
            // Handling of callback exceptions needs to be added for the case that the calling fails due to the app not being authorized or type not being supported.
            if (taskResult.isSuccessful()) {
                Log.i("AutoRecorderTest","onComplete stopRecordByType Successful");
            } else {
                Log.i("AutoRecorderTest","onComplete stopRecordByType Failed");
            }
        }
    })
    .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void result) {
            Log.i("AutoRecorderTest","onSuccess stopRecordByType Successful");
        }
    })
    .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Log.i("AutoRecorderTest","onFailure stopRecordByType Failed: " + e.getMessage());
        }
    });
```
