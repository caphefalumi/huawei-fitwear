<!--
  Title: HiSportDataCallback
  Catalog: HMSCore-References-V5
  Document ID: hisportdatacallback-0000001072149462-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5
-->
# HiSportDataCallback

| 
```
public interface HiSportDataCallback
```
 |
| --- |

Workout data callback.

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| void | [onDataChanged](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5#EN-US_TOPIC_0000001090570518__onDataChanged-int-android_os_Bundle-)(int sportState, android.os.Bundle bundle) Reports the real-time workout data. |
| void | [onResult](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hisportdatacallback-0000001072149462-V5#EN-US_TOPIC_0000001090570518__onResult-int-)(int errCode) Callback for control status changes. |

#### Method Detail

## onResult

void onResult(int errCode)

Callback for control status changes.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| errCode | Result code of the control status (registration succeed, failure, or running exception). |

## onDataChanged

void onDataChanged(int sportState, android.os.Bundle bundle)

Reports real-time workout data.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| sportState | Workout status. **0**: Workout starts. **1**: Workout is paused. **2**: Workout in progress. **3**: Workout resumed. **4**: Workout stopped. |
| bundle | Workout data combination, which is an Android Bundle object and contains the following key values: HiHealthKitConstant.BUNDLE_KEY_DISTANCE, HiHealthKitConstant.BUNDLE_KEY_DURATION, HiHealthKitConstant.BUNDLE_KEY_HEARTRATE, and HiHealthKitConstant.BUNDLE_KEY_SPEED. |
