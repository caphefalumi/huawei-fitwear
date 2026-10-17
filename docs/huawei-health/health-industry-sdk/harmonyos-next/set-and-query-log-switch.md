<!--
  Title: Setting and Querying the Log Switch State
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-log-switch-0000002342516626
  Updated: 2026-08-05 02:10:11
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-log-switch-0000002342516626
-->
# Setting and Querying the Log Switch State

This section describes how to set and query the log switch state of a wearable. After the log switch is enabled, the wearable proactively collects logs of the Health Industry SDK. After the log switch is disabled, logs of the Health Industry SDK are no longer collected.

> **Note:** The log switch is disabled by default. The log switch state remains unchanged after industry apps or wearables are restarted.

- Import required modules.
- Call the [setLogSwitch](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section191016293374) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to set the log switch. 
```cpp
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Call the setLogSwitch method in industryServiceClient to set the log switch.
industryServiceClient.setLogSwitch(getContext(this), true).then(() => {
  console.info(`Succeeded in setting logSwitch.`);
}).catch((err: BusinessError) => {
  console.error(`Failed to set logSwitch. Code is ${err.code}, message is ${err.message}.`);
})
```

- Call the [isLogEnabled](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section13483104324014) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the log switch state. 
```cpp
import { industryServiceClient, IndustryService } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Call the isLogEnabled method in industryServiceClient to obtain the log switch state.
industryServiceClient.isLogEnabled(getContext(this)).then((result)=>{
  console.info(`Succeeded in isLogEnabled, result is ${result}`);
}).catch((err: BusinessError) => {
  console.error(`Failed to isLogEnabled. Code is ${err.code}, message is ${err.message}.`);
})
```
