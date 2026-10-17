<!--
  Title: Reading Workout Records
  Catalog: harmonyos-guides
  Document ID: health-wearable-exercisesequence-manage
  Updated: 2026-10-14 09:30:02
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-wearable-exercisesequence-manage
-->
# Reading Workout Records

#### Use Cases

Starting from version 5.1.1(19) Release, the latest workout record can be read.

#### API Description

| API | Description |
| --- | --- |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-1)<T extends [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)>(request: [ExerciseSequenceReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequencereadrequest)): Promise<T[]> | Queries the latest workout record. |

> **Note:** Currently, the time parameters in **ExerciseSequenceReadRequest** do not take effect. Only the latest data record on the watch can be returned.

#### Before Getting Started

- Complete the operations in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- Make sure that you have obtained users' authorization for your app to access specific data types by calling the API for [requesting user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions#requesting-user-authorization).
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create a query request. 
```typescript
// Query the running record.
const sequenceReadRequest:
  healthStore.ExerciseSequenceReadRequest<healthStore.exerciseSequenceHelper.running.DetailFields> = {
  startTime: 1698040800000,
  endTime: 1698042600000,
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE,
  count: 1,
  sortOrder: 1,
  readOptions: {
    withPartialDetails: ['exerciseHeartRate', 'altitude']
 }
};
```

- Call [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-1) to query the data and process the returned result. 
```typescript
try {
  const runningSequences =
    await healthStore.readData<healthStore.exerciseSequenceHelper.running.Model>(sequenceReadRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in reading data.');
  runningSequences.forEach((runningSequence) => {
    hilog.info(0x0000, 'testTag', `the start time is ${runningSequence.startTime}.`);
    hilog.info(0x0000, 'testTag', `the end time is ${runningSequence.endTime}.`);
    Object.keys(runningSequence.summaries).forEach((key) => {
      Object.keys(runningSequence.summaries[key]).forEach((fieldName) => {
        hilog.info(0x0000, 'testTag',
          `the summaries of ${key} field ${fieldName} is ${runningSequence.summaries[key][fieldName]}.`);
      });
    });
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```
