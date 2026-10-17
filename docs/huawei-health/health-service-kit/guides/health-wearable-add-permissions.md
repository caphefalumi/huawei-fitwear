<!--
  Title: Managing User Authorization
  Catalog: harmonyos-guides
  Document ID: health-wearable-add-permissions
  Updated: 2026-10-14 09:29:47
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-wearable-add-permissions
-->
# Managing User Authorization

#### Scenario

Your app can only access data upon user authorization on the HUAWEI ID syncing screen and authorization screen. Users can select the data range to be authorized and grant only some data permissions.

The data that your app can access is both approved by Health Service Kit and granted by users.

#### Constraints

This feature is supported since 5.1.1(19) Release.

#### API Description

| API Name | Description |
| --- | --- |
| [requestAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorerequestauthorizations)(context: [common.UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1), request: [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest)): Promise<[AuthorizationResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationresponse)> | Requests user authorization. When calling this API, pass the UIAbility context and [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest). Add the data types to be read and written, display the HUAWEI ID authorization screen, and instruct users to complete the authorization. The scopes matching the list of data types returned are the intersection of [the scopes you have applied for](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and those granted by users. |
| [getAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoregetauthorizations)(request: [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest)): Promise<[AuthorizationResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationresponse)> | Queries user authorization. When calling this API, pass [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest) and add data types to query whether users have granted the authorization for these data types. The scopes matching the list of data types returned are the intersection of [the scopes you have applied for](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and those granted by users. |
| [cancelAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorecancelauthorizations)(): Promise<void> | Cancels all authorization. |

#### Before Getting Started

- Complete [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- An API must be called within the lifecycle of a page or custom component. Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- For details about error codes, refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, see [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

## User Authorization

- Import the Health Service Kit functional module and related public modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create an authorization request. Make sure you have applied for the scopes specified in the authorization parameters during your Health Service Kit application. For details about the scopes, refer to [Scope Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description). 
```typescript
let authorizationParameter: healthStore.AuthorizationRequest = {
  readDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE],
  writeDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE]
}
```

- Call [requestAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorerequestauthorizations) to request sign-in authorization and process the returned result. 
```typescript
try {
  let authorizationResponse = await healthStore.requestAuthorizations(this.getUIContext().getHostContext() as common.UIAbilityContext, authorizationParameter);
  hilog.info(0x0000, 'testTag', 'Succeeded in requesting authorization.');
  authorizationResponse.writeDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedWriteDataType is : ${dataType.name}`);
  });
  authorizationResponse.readDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedReadDataTypes is : ${dataType.name}`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to request authorization. Code: ${err.code}, message: ${err.message}`);
}
```

## Querying Authorization

- Import the Health Service Kit functional module and related public modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create an authorization query request. 
```typescript
let queryAuthorizationRequest: healthStore.AuthorizationRequest = {
  readDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE],
  writeDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE]
}
```

- Call [getAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoregetauthorizations) to query the authorization and process the returned result. 
```typescript
try {
  let queryAuthorizationResponse = await healthStore.getAuthorizations(queryAuthorizationRequest);
  hilog.info(0x0000, 'testTag', 'Succeeded in getting authorization.');
  queryAuthorizationResponse.writeDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedWriteDataType is : ${dataType.name}`);
  });
  queryAuthorizationResponse.readDataTypes.forEach(dataType => {
    hilog.info(0x0000, 'testTag', `grantedReadDataTypes is : ${dataType.name}`);
  });
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to get authorization. Code: ${err.code}, message: ${err.message}`);
}
```

## Canceling Authorization

- Import the Health Service Kit functional module and related public modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Call [cancelAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorecancelauthorizations) to revoke the authorization and process the returned result. 
```typescript
try {
  await healthStore.cancelAuthorizations();
  hilog.info(0x0000, 'testTag', 'Succeeded in canceling authorization.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to cancel authorization. Code: ${err.code}, message: ${err.message}`);
}
```
