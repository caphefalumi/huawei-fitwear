<!--
  Title: Listening to the Connection Status Between an Industry App and the Industry Service
  Catalog: huaweihealth-Guides
  Document ID: listen-connection-status-0000002342516570
  Updated: 2026-08-05 02:10:04
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/listen-connection-status-0000002342516570
-->
# Listening to the Connection Status Between an Industry App and the Industry Service

The industry service operates as a standalone process. When the system memory is insufficient or the service's power consumption is excessive, the system terminates the industry service. This can cause the industry app to disconnect from the service. For such uncertain disconnection scenarios, you can listen to the connection status between the industry app and industry service, and then perform corresponding restoration actions, for example, re-subscribing to heart rate data.

> **Note:** This API can detect only disconnection events between the industry app and industry service.

- Import required modules.
- Call the [on](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section3953113762210) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to listen to the connection status between the industry app and industry service. 
```cpp
// Import required modules.
import { industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Construct the callback function to be executed when the industry app is disconnected from the industry service.
let callback = () => {
  console.info('The service destruction event.');
}
// Call the on method in industryServiceClient to subscribe to disconnection events between the industry app and industry service.
try {
  industryServiceClient.on('serviceDie', callback);
  // The subscription to the disconnection event between the industry app and industry service is successful.
  console.info('Succeeded in subscribing the service destruction event.');
} catch (error) {
  // The subscription to the disconnection event between the industry app and industry service fails.
  const err: BusinessError = error as BusinessError;
  console.error(`Failed to subscribe the service destruction event. Code is ${err.code}, message is ${err.message}`);
}
```

- Call the [off](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section202781268276) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to cancel listening to the connection status between the industry app and industry service. 
```cpp
// Call the off method in industryServiceClient to cancel listening to the connection status between the industry app and industry service. Note that the callback object here must be the same as that executed when the industry app is disconnected from the industry service.
try {
  industryServiceClient.off('serviceDie', callback);
  // The listening to the disconnection event between the industry app and industry service is successfully canceled.
  console.info('Succeeded in unsubscribing the service destruction event.');
} catch (error) {
  // The listening to the disconnection event between the industry app and industry service fails to be canceled.
  const err: BusinessError = error as BusinessError;
  console.error(`Failed to unsubscribe the service destruction event. Code is ${err.code}, message is ${err.message}`);
}
```
 > **Note:** The callback object passed for unsubscription must be the same as that passed for subscription.
