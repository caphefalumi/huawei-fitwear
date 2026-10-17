<!--
  Title: Health and Fitness Sample Data
  Catalog: harmonyos-guides
  Document ID: health-samplepoint-manage
  Updated: 2026-10-14 09:30:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-samplepoint-manage
-->
# Health and Fitness Sample Data

#### Use Cases

**SamplePoint** indicates specific types of data collected at a particular moment or over a period. Each sample consists of a timestamp, a measured value, and data source, and supports operations such as saving, reading, and deleting.

#### API Description

| API | Description |
| --- | --- |
| [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresavedata)(sampleData: [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)[] \| [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)): Promise<void> | Saves health and fitness sample data. The input parameter can be a single [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint) or a [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint) array. |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata)<T extends [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)>(request: [SamplePointReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepointreadrequest)): Promise<T[]> | Queries health and fitness sample data. You can use [SamplePointReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepointreadrequest) to set query conditions, such as data type, field, or time range. |
| [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-3)(samplePoint: [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint) \| [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)[]): Promise<void> | Deletes health and fitness sample data based on the input parameter, which can be a single [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint) or a [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint) array. |
| [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata)(request: [SamplePointDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepointdeleterequest) \| [SamplePointDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepointdeleterequest)[]): Promise<void> | Deletes health and fitness sample data using a [SamplePointDeleteRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepointdeleterequest). You can specify deletion conditions such as data type, time range, or data source. |
| [aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata)<T extends [AggregateResult](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregateresult)>(request: [AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest) \| [AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest)[]): Promise<T[]> | Performs an aggregation query on the health and fitness sample data. You can set the data types and aggregation metrics by calling [AggregateRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#aggregaterequest). |

> **Note:** There is a delay in data reporting when you call **aggregateData** to read daily activity data. Therefore, you are advised to use the API for [reading real-time Activity rings data](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-three-ring-read) instead to read real-time daily activity data.

#### Before Getting Started

- Complete the operations in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- Make sure that you have obtained users' authorization for your app to access specific data types by calling the API for [requesting user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions#requesting-user-authorization).
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

## Saving Health and Fitness Data

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Obtain **dataSourceId**. Refer to [Managing Data Sources](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-datasource-manage) to insert a new data source or read an existing data source.
- Create health and fitness sample data. 
```typescript
let samplePoint: healthStore.samplePointHelper.bodyTemperature.Model = {
  dataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000,
  localDate: '10/30/2023',
  timeZone: '+0800',
  modifiedTime: 1698633801000,
  // Pass the value of dataSourceId returned when you call insertDataSource to insert a data source, or read the value of dataSourceId of an existing data source.
  dataSourceId: 'xxx',
  fields: {
    bodyTemperature: 39
  }
}
```

- Call [saveData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresavedata) to save the data and process the returned result. 
```typescript
try {
  await healthStore.saveData(samplePoint);
  hilog.info(0x0000, 'testTag', 'Succeeded in saving data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to save data. Code: ${err.code}, message: ${err.message}`);
}
```

## Reading Health and Fitness Data

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create a query request. 
```typescript
let samplePointReadRequest: healthStore.SamplePointReadRequest = {
  samplePointDataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000,
  fields: {
    bodyTemperature: 39
  }
}
```

- Call [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata) to query the data and process the returned result. 
```typescript
try {
  let samplePoints = await healthStore.readData(samplePointReadRequest);
  samplePoints.forEach((samplePoint) => {
    hilog.info(0x0000, 'testTag', `Succeeded in reading data, the bodyTemperature is ${samplePoint.fields.bodyTemperature}.`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```

## Deleting Specific Health and Fitness Sample Data

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Query the health and fitness sample data to be deleted. 
```typescript
let samplePointReadRequest: healthStore.SamplePointReadRequest = {
  samplePointDataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000
}
let samplePoints: healthStore.SamplePoint[] = await healthStore.readData(samplePointReadRequest);
```

- Call [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-3) to delete the data and process the returned result. 
```typescript
try {
  for (let index = 0; index < samplePoints.length; index++) {
    const samplePoint = samplePoints[index];
    await healthStore.deleteData(samplePoint);
  }
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

## Deleting Health and Fitness Data as Requested

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create a deletion request. 
```typescript
let samplePointDeleteRequest: healthStore.SamplePointDeleteRequest = {
  dataType: healthStore.samplePointHelper.bodyTemperature.DATA_TYPE,
  startTime: 1698633801000,
  endTime: 1698633801000
}
```

- Call [deleteData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoredeletedata-3) to delete the data and process the returned result. 
```typescript
try {
  await healthStore.deleteData(samplePointDeleteRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in deleting data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to delete data. Code: ${err.code}, message: ${err.message}`);
}
```

## Performing an Aggregation Query

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create an aggregation query request. 
```typescript
let aggregateRequest: healthStore.AggregateRequest<healthStore.samplePointHelper.dailyActivities.AggregateFields> = {
  dataType: healthStore.samplePointHelper.dailyActivities.DATA_TYPE,
  metrics: {
    step: ['sum'],
    calorie: ['sum'],
    distance: ['sum'],
    climbHighAltitude:['sum'],
    isIntensity: ['sum'],
    isStand: ['sum']
 },
  groupBy: {
    unitType: healthStore.GroupUnitType.DAY
  },
  startLocalDate: '10/30/2023',
  endLocalDate: '10/30/2023'
}
```

- Call [aggregateData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreaggregatedata) to query the data and process the returned result. 
```typescript
try {
  const aggregateResults = await healthStore.aggregateData<healthStore.samplePointHelper.dailyActivities.AggregateResult>(aggregateRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in reading data.');
  aggregateResults.forEach((aggregateResult) => {
    hilog.info(0x0000, 'testTag', `the start time is ${aggregateResult.startTime}.`);
    hilog.info(0x0000, 'testTag', `the end time is ${aggregateResult.endTime}.`);
    Object.keys(aggregateResult.fields).forEach((fieldName) => {
      hilog.info(0x0000, 'testTag', `the sum of ${fieldName} is ${aggregateResult.fields[fieldName].sum}.`);
    });
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read data. Code: ${err.code}, message: ${err.message}`);
}
```
