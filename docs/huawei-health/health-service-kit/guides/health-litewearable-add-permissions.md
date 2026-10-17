<!--
  Title: Managing User Authorization
  Catalog: harmonyos-guides
  Document ID: health-litewearable-add-permissions
  Updated: 2026-10-14 09:29:47
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-litewearable-add-permissions
-->
# Managing User Authorization

#### Use Cases

Starting from version 6.1.1(24), user authorization management is supported.

Your app can initiate the HUAWEI ID synchronization and authorization screens, where users can grant the required data access permissions. Users can choose which data types to authorize and grant only part of the available data permissions. The user data that your app can operate on is limited to the intersection of the permissions approved by Health Service Kit and those granted by the user.

#### API Description

| API | Description |
| --- | --- |
| [requestAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#healthstorerequestauthorizations)(request: AuthorizationRequest): AuthorizationResponse | Requests user authorization. When calling this API, pass [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#authorizationrequest). Add the data types to be read and written, display the HUAWEI ID authorization screen, and instruct users to complete the authorization. The permissions corresponding to the returned list of data types are the intersection of the permissions [your app has applied for](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description) and those granted by the user. |
| [getAuthorizations](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#healthstoregetauthorizations)(request: AuthorizationRequest): AuthorizationResponse | Queries user authorization. When calling this API, pass [AuthorizationRequest](https://developer.huawei.com/consumer/en/doc/harmonyos-references/health-api-healthstore-lite#authorizationrequest) and add data types to query whether users have granted authorization for these data types. The permissions corresponding to the returned list of data types are the intersection of the permissions [your app has applied for](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description) and those granted by the user. |

#### Before Getting Started

- [Apply for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply).
- Refer to [Health Service Kit FAQs](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-faqs) if needed.

#### Development Procedure

- Import the Health Service Kit functional module. 
```javascript
import healthStore from '@hms.health.store';
```

- Query authorization status. 
```javascript
function getAuthorizations() {
  let queryAuthorizationRequest = {
    readDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
    writeDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
    scopes: ['https://www.huawei.com/healthkit/workout']
  }

  try {
    let queryAuthorizationResponse = healthStore.getAuthorizations(queryAuthorizationRequest);
  } catch (err) {
    // Handle the exception.
  }
}
```

- Initiate a request for user authorization. 
```javascript
function requestAuthorizations() {
  let authorizationParameter = {
    readDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
    writeDataTypes: [healthStore.healthDataTypes.WORKOUT_SUMMARY],
    scopes: ['https://www.huawei.com/healthkit/workout']
  }
  try {
    let authorizationResponse = healthStore.requestAuthorizations(authorizationParameter);
  } catch (err) {
    // Handle the exception.
  }
}
```
