<!--
  Title: Workout Records
  Catalog: harmonyos-guides
  Document ID: health-exercisesequence-manage
  Updated: 2026-10-14 09:30:02
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-exercisesequence-manage
-->
# Workout Records

#### Use Cases

A workout record contains basic information of a workout, including the start time, end time, workout type, statistics, and details. You can write, read, or delete workout records. Each workout record must be associated with a data source.

#### API Description

| API | Description |
| --- | --- |
| [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresavedata-1)(exerciseSequence: [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)[] \| [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)): Promise<void> | Saves workout records. The input parameter can be a single [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence) or an [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence) array. |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata-1)<T extends [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)>(request: [ExerciseSequenceReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequencereadrequest)): Promise<T[]> | Queries workout records. You can use [ExerciseSequenceReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequencereadrequest) to set query conditions and query data by data type, field, or time range. |
| [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-4)(exerciseSequence: [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence) \| [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence)[]): Promise<void> | Deletes specific workout records based on the input parameter, which can be a single [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence) or an [ExerciseSequence](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequence) array. |
| [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-1)(request: [ExerciseSequenceDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequencedeleterequest) \| [ExerciseSequenceDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequencedeleterequest)[]): Promise<void> | Deletes workout records using an [ExerciseSequenceDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#exercisesequencedeleterequest). You can specify deletion conditions such as data type, time range, or data source. |

#### Before Getting Started

- Complete the operations in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- Make sure that you have obtained users' authorization for your app to access specific data types by calling the API for [requesting user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions#requesting-user-authorization).
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

## Saving Workout Records

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Obtain **dataSourceId**. Refer to [Managing Data Sources](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-datasource-manage) to insert a new data source or read an existing data source.
- Create a workout record. 
```typescript
// Construct a running record.
const startTime = 1698040800000; // 2023-10-23 14:00:00
const endTime = 1698042600000; // 2023-10-23 14:30:00

const runningSequence: healthStore.exerciseSequenceHelper.running.Model = {
  dataType: healthStore.exerciseSequenceHelper.DATA_TYPE,
  // Pass the value of dataSourceId returned when you call insertDataSource to insert a data source, or read the value of dataSourceId of an existing data source.
  dataSourceId: 'xxx',
  startTime: startTime, // 2023-10-23 14:00:00
  endTime: endTime, // 2023-10-23 14:30:00
  localDate: '10/23/2023',
  timeZone: '+0800',
  modifiedTime: new Date().getTime(),
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE,
  duration: 1800,
  summaries: {
    distance: {
      totalDistance: 2000
    },
    calorie: {
      totalCalories: 20
    },
    speed: {
      avg: 5,
      max: 6
    }
  },
  details: {
    exerciseHeartRate: [
      {
        startTime: startTime,
        bpm: 88
      },
      {
        startTime: startTime + 5000,
        bpm: 89
      }
    ],
    speed: [
      {
        startTime: startTime,
        speed: 2.5
      },
      {
        startTime: startTime + 5000,
        speed: 2.3
      }
    ],
    altitude: [
      {
        startTime: startTime,
        altitude: 100
      },
      {
        startTime: startTime + 5000,
        altitude: 101
      }
    ]
  }
};
```

- Call [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresavedata-1) to save the data and process the returned result. 
```typescript
try {
  await healthStore.saveData(runningSequence);
  hilog.info(0x0000, 'testTag', 'Succeeded in saving data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to save data. Code: ${err.code}, message: ${err.message}`);
}
```

## Reading Workout Records

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

## Deleting Specific Workout Records

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Query the workout record to be deleted. 
```typescript
// Query the running record.
const sequenceReadRequest:
  healthStore.ExerciseSequenceReadRequest<healthStore.exerciseSequenceHelper.running.DetailFields> = {
  startTime: 1698040800000,
  endTime: 1698042600000,
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE
};
const runningSequences =
  await healthStore.readData<healthStore.exerciseSequenceHelper.running.Model>(sequenceReadRequest);
```

- Call [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-4) to delete the data and process the returned result. 
```typescript
try {
  for (let index = 0; index < runningSequences.length; index++) {
    const runningSequence = runningSequences[index];
    await healthStore.deleteData(runningSequence);
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

## Deleting Workout Records as Requested

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create a deletion request. 
```typescript
let exerciseSequenceDeleteRequest: healthStore.ExerciseSequenceDeleteRequest = {
  exerciseType: healthStore.exerciseSequenceHelper.running.EXERCISE_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000
}
```

- Call [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-1) to delete the data and process the returned result. 
```typescript
try {
  await healthStore.deleteData(exerciseSequenceDeleteRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```
