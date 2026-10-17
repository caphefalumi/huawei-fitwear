<!--
  Title: Real-Time Activity Rings Data
  Catalog: harmonyos-guides
  Document ID: health-three-ring-read
  Updated: 2026-10-14 09:30:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-three-ring-read
-->
# Real-Time Activity Rings Data

#### Use Cases

Real-time Activity rings data includes real-time step count, active calories, workout duration, hours active, and workout goals.

> **Note:** This API requires the permission to read daily activity data. For details, please refer to [Permission Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description).

#### OAuth Scope

To apply for the required scope, go to **Activity data** > **Daily activity summary (read)** on the Console of HUAWEI Developers.

#### API Description

| API | Description |
| --- | --- |
| [readActivityReport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice#workoutreadactivityreport)(): Promise<[ActivityReport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice#activityreport)> | Reads real-time Activity rings data. |

#### Before Getting Started

- Complete the operations in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- Make sure that you have obtained users' authorization for your app to read daily activity data by calling the API for [requesting user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions#requesting-user-authorization) before your app can read real-time Activity rings data. For details, please refer to [Permission Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description).
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthService } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Call [readActivityReport](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthservice#workoutreadactivityreport) to read real-time Activity rings data and process the returned result. 
```typescript
try {
  const result: healthService.workout.ActivityReport = await healthService.workout.readActivityReport();
  
  hilog.info(0x0000, 'testTag', 'Succeeded in reading ActivityReport');
  Object.keys(result).forEach(key => {
    hilog.info(0x0000, 'testTag', `the ${key} is ${result[key]}`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to read ActivityReport. Code: ${err.code}, message: ${err.message}`);
}
```
