<!--
  Title: Obtaining the API Level of the Server
  Catalog: huaweihealth-Guides
  Document ID: get-api-level-0000002342676370
  Updated: 2026-08-05 02:10:06
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-api-level-0000002342676370
-->
# Obtaining the API Level of the Server

This section describes how to obtain the API level of the Industry SDK server.

- Import required modules.
- Call the [getApiLevel](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section921625593319) method in [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to obtain the API level of the server. 
```cpp
// Import required modules.
import { industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Call the getApiLevel method in industryServiceClient to obtain the API level of the server.
industryServiceClient.getApiLevel(getContext(this)).then((value: number) => {
  // Output the returned API level if the API level is successfully obtained.
  console.info(`Succeeded in getting apiLevel, value is ${value}.`);
}).catch((err: BusinessError) => {
  // The API level of the server fails to be obtained.
  console.error(`Failed to get apiLevel. Code is ${err.code}, message is ${err.message}.`);
})
```
