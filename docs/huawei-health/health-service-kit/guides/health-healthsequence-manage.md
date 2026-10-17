<!--
  Title: Health Records
  Catalog: harmonyos-guides
  Document ID: health-healthsequence-manage
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-healthsequence-manage
-->
# Health Records

#### Use Cases

A health record contains basic information including the record start time, end time, data type, field value, and detailed data. You can write, read, or delete health records. Each health record must be associated with a data source.

#### API Description

| API | Description |
| --- | --- |
| [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresavedata-2)(healthSequence: [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)[] \| [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)): Promise<void> | Saves health records. The input parameter can be a single [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence) or a [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence) array. |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-2)<T extends [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)>(request: [HealthSequenceReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequencereadrequest)): Promise<T[]> | Queries health records. You can use [HealthSequenceReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequencereadrequest) to set query conditions and query data by data type, field, or time range. |
| [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-5)(healthSequence: [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence) \| [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence)[]): Promise<void> | Deletes specific health records based on the input parameter, which can be a single [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence) or a [HealthSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequence) array. |
| [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-2)(request: [HealthSequenceDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequencedeleterequest) \| [HealthSequenceDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequencedeleterequest)[]): Promise<void> | Deletes health records using a [HealthSequenceDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthsequencedeleterequest). You can specify deletion conditions such as data type, time range, or data source. |

#### Before Getting Started

- Complete the operations in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- Make sure that you have obtained users' authorization for your app to access specific data types by calling the API for [requesting user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions#requesting-user-authorization).
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

## Saving Health Records

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Obtain **dataSourceId**. Refer to [Managing Data Sources](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-datasource-manage) to insert a new data source or read an existing data source.
- Create a health record. 
```typescript
let healthSequence: healthStore.healthSequenceHelper.sleepRecord.Model = {
  summaries: {
    fallAsleepTime: 1695740400000, // 2023-09-26 23:00:00
    wakeupTime: 1695769200000, // 2023-09-27 7:00:00
    sleepScore: 80,
    wakeCount: 2,
    sleepType: 1,
    shallowDuration: 14400,
    deepDuration: 7200,
    dreamDuration: 7200,
    wakeDuration: 0,
    duration: 28800
  },
  dataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  // Pass the value of dataSourceId returned when you call insertDataSource to insert a data source, or read the value of dataSourceId of an existing data source.
  dataSourceId: 'xxx',
  localDate: '09/26/2023',
  startTime: 1695740400000,
  endTime: 1695769200000,
  timeZone: '+0800',
  modifiedTime: 1695769200000,
  details: {
    sleepSegment: [
      {
        startTime: 1695740400000, // 2023-09-26 23:00:00
        endTime: 1695747600000, // 2023-09-27 01:00:00
        sleepStatus: 2
      },
      {
        startTime: 1695747600000, // 2023-09-27 01:00:00
        endTime: 1695754800000, // 2023-09-27 03:00:00
        sleepStatus: 1
      },
      {
        startTime: 1695754800000, // 2023-09-27 03:00:00
        endTime: 1695762000000, // 2023-09-27 05:00:00
        sleepStatus: 3
      },
      {
        startTime: 1695762000000, // 2023-09-27 05:00:00
        endTime: 1695769200000, // 2023-09-27 07:00:00
        sleepStatus: 2
      }
    ]
  }
}
```

- Call [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresavedata-2) to save the data and process the returned result. 
```typescript
try {
  await healthStore.saveData(healthSequence);
  hilog.info(0x0000, 'testTag', 'Succeeded in saving data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to save data. Code: ${err.code}, message: ${err.message}`);
}
```

## Reading Health Records

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

## Deleting Specific Health Records

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Query the health record to be deleted. 
```typescript
let healthSequenceReadRequest: healthStore.HealthSequenceReadRequest = {
  healthSequenceDataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  startTime: 1695740400000,
  endTime: 1695769200000
}
const healthSequences = await healthStore.readData(healthSequenceReadRequest);
```

- Call [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-5) to delete the data and process the returned result. 
```typescript
try {
  for (let index = 0; index < healthSequences.length; index++) {
    const healthSequence = healthSequences[index];
    await healthStore.deleteData(healthSequence);
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

## Deleting Health Records as Requested

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create a request for deleting health records. 
```typescript
const healthSequenceDeleteRequest: healthStore.HealthSequenceDeleteRequest= {
  healthSequenceDataType: healthStore.healthSequenceHelper.sleepRecord.DATA_TYPE,
  startTime: 1695740400000,
  endTime: 1695769200000
}
```

- Call [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-2) to delete the data and process the returned result. 
```typescript
try {
  await healthStore.deleteData(healthSequenceDeleteRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```
