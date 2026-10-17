<!--
  Title: Managing User Authorization
  Catalog: harmonyos-guides
  Document ID: health-add-permissions
  Updated: 2026-10-14 09:29:53
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions
-->
# Managing User Authorization

#### Use Cases

Your app can initiate the HUAWEI ID sign-in and authorization screens, where users can grant the required data access permissions. Users can choose which data types to authorize and grant only part of the available data permissions.

The user data that your app can operate on is limited to the intersection of the permissions approved by Health Service Kit and those granted by the user.

#### API Description

| API | Description |
| --- | --- |
| [requestAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorerequestauthorizations)(context: [common.UIAbilityContext](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#uiabilitycontext-1), request: [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest)): Promise<[AuthorizationResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationresponse)> | Requests user authorization. When calling this API, pass the UIAbility context and [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest). Add the data types to be read and written, display the HUAWEI ID authorization screen, and instruct users to complete the authorization. The permissions corresponding to the returned list of data types are the intersection of the permissions [your app has applied for](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and those granted by the user. |
| [getAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoregetauthorizations)(request: [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest)): Promise<[AuthorizationResponse](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationresponse)> | Queries user authorization. When calling this API, pass [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#authorizationrequest) and add data types to query whether users have granted the authorization for these data types. The permissions corresponding to the returned list of data types are the intersection of the permissions [your app has applied for](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and those granted by the user. |
| [cancelAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorecancelauthorizations)(): Promise<void> | Cancels all authorization. |

#### Before Getting Started

- Complete the operations described in [Applying for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) and [Configuring the Client ID](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-configuration-client-id).
- An API must be called within the lifecycle of a page or custom component. Before calling an API for the first time, call the [init](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoreinit) method to perform initialization.
- For details about error codes, please refer to [ArkTS API Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice). For FAQs, please refer to [FAQs About Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs).

#### Development Procedure

## Requesting User Authorization

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { common } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create an authorization request. Ensure that the permissions specified in the authorization parameters have been selected when you applied for Health Service Kit. For details about the permissions, please refer to the [description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description). 
```typescript
let authorizationParameter: healthStore.AuthorizationRequest = {
  readDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE],
  writeDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE]
}
```

- Call [requestAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorerequestauthorizations) to request sign-in authorization and process the returned result. 
```typescript
try {
  // Obtain the context from the component and ensure that the return value of this.getUIContext().getHostContext() is UIAbilityContext.
  let authorizationResponse =
    await healthStore.requestAuthorizations(this.getUIContext().getHostContext() as common.UIAbilityContext,
      authorizationParameter);
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

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Create a permission query request. 
```typescript
let queryAuthorizationRequest: healthStore.AuthorizationRequest = {
  readDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE],
  writeDataTypes: [healthStore.exerciseSequenceHelper.DATA_TYPE, healthStore.samplePointHelper.heartRate.DATA_TYPE]
}
```

- Call [getAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstoregetauthorizations) to query the permissions and process the returned result. 
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

- Import the Health Service Kit functional module and related common modules. 
```typescript
import { healthStore } from '@kit.HealthServiceKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Call [cancelAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore#healthstorecancelauthorizations) to cancel the authorization and process the returned result. 
```typescript
try {
  await healthStore.cancelAuthorizations();
  hilog.info(0x0000, 'testTag', 'Succeeded in canceling authorization.');
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to cancel authorization. Code: ${err.code}, message: ${err.message}`);
}
```
