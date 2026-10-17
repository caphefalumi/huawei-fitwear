<!--
  Title: Manually Synchronizing Data
  Catalog: harmonyos-guides
  Document ID: health-cloudsync
  Updated: 2026-10-14 09:29:59
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-cloudsync
-->
# Manually Synchronizing Data

#### Use Cases

The HUAWEI Health app may fail to synchronize data to the cloud in a timely manner. As a result, your app may not obtain the user's latest health and fitness data from the Health Service Kit cloud promptly. To address this issue, we allow users to manually trigger data synchronization once your app obtains their authorization.

#### OAuth Scope

To apply for the required scopes, go to **Data Synchronization** > **Manual Data Synchronization** on the Console of HUAWEI Developers.

| Scope | Description |
| --- | --- |
| https://www.huawei.com/healthkit/huaweihealthdata.cloudsync | Allows HUAWEI Health to synchronize personal data to the cloud (based on data synchronization settings in HUAWEI Health). |

> **Note:** This scope is available only to enterprise developer accounts.

#### API Description

| API | Description |
| --- | --- |
| [syncAll](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresyncall)(): Promise<void> | Synchronizes data as proactively triggered by the user. |

#### Before Getting Started

- Complete the operations in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- Use the API for [requesting user authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions#requesting-user-authorization) to guide the user to grant authorization. For details, please refer to the **scopes** parameter in [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest). Call the manual data synchronization API after the user has authorized data synchronization.
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

- Import the Health Service Kit functional module and related public modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Call [syncAll](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoresyncall) to synchronize data and process the returned result. 
```typescript
try {
  await healthStore.syncAll();
  hilog.info(0x0000, 'testTag', 'Succeeded in synchronizing data.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to synchronize data. Code: ${err.code}, message: ${err.message}`);
}
```
