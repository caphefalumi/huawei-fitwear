<!--
  Title: Reading Health and Fitness Sample Data
  Catalog: harmonyos-guides
  Document ID: health-wearable-samplepoint-manage
  Updated: 2026-10-14 09:30:00
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-wearable-samplepoint-manage
-->
# Reading Health and Fitness Sample Data

#### Use Cases

Starting from version 5.1.1(19) Release, the latest health and fitness sample data can be read.

#### API Description

| API | Description |
| --- | --- |
| [readData](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorereaddata)<T extends [SamplePoint](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepoint)>(request: [SamplePointReadRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#samplepointreadrequest)): Promise<T[]> | Queries the latest health and fitness sample data. |

> **Note:** Currently, the time parameters in **SamplePointReadRequest** do not take effect. Only the latest data record on the watch can be returned. To read real-time daily activity data, use the API for reading [real-time Activity rings data](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-wearable-three-ring-read).

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
