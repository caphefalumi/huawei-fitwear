<!--
  Title: Collecting Logs
  Catalog: huaweihealth-Guides
  Document ID: get-log-path-0000002342676430
  Updated: 2026-08-05 02:10:14
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-log-path-0000002342676430
-->
# Collecting Logs

This section describes how to obtain the path for storing the collected log files on a wearable.

> **Note:** The maximum size of SDK component log files is 20 MB. Once the capacity limit is reached, new logs will overwrite the earliest log entries. After log collection completes, the log files in the storage path on the wearable will not be automatically deleted.

- Import required modules.
- Call the [getIndustryLog](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1650163344212) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to trigger log collection and obtain the log file path. 
```cpp
// Import required modules.
import { industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Call the getIndustryLog method in industryServiceClient to obtain the log file path.
industryServiceClient.getIndustryLog(getContext(this)).then((logPath) => {
  // Output the log file path if the log collection is successful.
  console.info(`Succeeded in getting industry log, log path is ${logPath}`);
}).catch((err: BusinessError) => {
  // Output error information if the log collection fails.
  console.error(`Failed to get industry log. Code is ${err.code}, message is ${err.message}.`);
})
```
