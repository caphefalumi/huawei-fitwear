<!--
  Title: Reading Health Records
  Catalog: harmonyos-guides
  Document ID: health-wearable-healthsequence-manage
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-wearable-healthsequence-manage
-->
# Reading Health Records

#### Use Cases

Starting from version 5.1.1(19) Release, the latest health record can be read.

#### API Description

| API | Description |
| --- | --- |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-2)<T extends [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)>(request: [HealthSequenceReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequencereadrequest)): Promise<T[]> | Queries the latest health record. |

> **Note:** Currently, the time parameters in **HealthSequenceReadRequest** do not take effect. Only the latest data record on the watch can be returned.

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

- Create a request for querying health records. 
```typescript
let healthSequenceReadRequest: healthStore.HealthSequenceReadRequest = {
  healthSequenceDataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  startTime: 1695740400000,
  endTime: 1695769200000,
  readOptions: {
    withDetails: true
  }
}
```

- Call [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-2) to query the data and process the returned result. 
```typescript
try {
  const healthSequences = await healthStore.readData(healthSequenceReadRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in reading data.');
  healthSequences.forEach((healthSequence) => {
    hilog.info(0x0000, 'testTag', `the start time is ${healthSequence.startTime}.`);
    hilog.info(0x0000, 'testTag', `the end time is ${healthSequence.endTime}.`);
    Object.keys(healthSequence.summaries).forEach((key) => {
      hilog.info(0x0000, 'testTag', `the summaries of ${key} is ${healthSequence.summaries[key]}.`);
    });
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```
