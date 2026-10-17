<!--
  Title: Performing App Authentication
  Catalog: huaweihealth-Guides
  Document ID: get-authorization-0000002376514381
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/get-authorization-0000002376514381
-->
# Performing App Authentication

When an industry app attempts to call an API of the Health Industry SDK, the SDK authenticates the app. The API call will succeed only when the authentication is successful. After successful authentication, the Health Industry SDK caches the authentication result locally. This cached result will be cleared when the app is uninstalled or the certificate expires. In this case, authentication needs to be performed again.

> **Note:** Authentication requires network access. Ensure that the wearable is connected to the Internet. (The following network connection modes are supported: 1. The wearable connects to the Internet via Wi-Fi. 2. The wearable is paired with the Huawei Health app to share the mobile phone's network. 3. The wearable enables the eSIM service and uses the eSIM network.) Before setting the certificate path, place the [certificate](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/apply-for-health-industry-sdk-service-0000002342516566#EN-US_TOPIC_0000002648084274__li16905940101212) in the **src/main/resources/rawfile** directory of the app development project. (If this directory does not exist, create one.) The certificate file name extension must be **.cer**. Test certificates have a finite validity period. After an app's test certificate is changed to a commercial certificate, the app must be authenticated again.

- Import required modules.
- Call the [setCertPath](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section1895915139306) method of [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to set the authentication certificate path.
- Call the [getAuthorization](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section15911142324) method of [industryServiceClient](https://developer.huawei.com/consumer/en/doc/health-References/industryservice-0000002441251357#section7749131442313) to initiate authentication. 
```cpp
import { industryServiceClient } from '@huawei-cbg/health-industry-sdk';
import { BusinessError } from '@ohos.base';

// Set the certificate name, which must be consistent with the name of the certificate file in the src/main/resources/rawfile directory.
let certPath: string = "industrycer.cer";
// Call the setCertPath method of industryServiceClient to set the authentication certificate path.
industryServiceClient.setCertPath(getContext(this), certPath).then(() => {
  // The authentication certificate path is successfully set.
  console.info(`Succeeded in setting certPath.`);
}).catch((err: BusinessError) => {
  // The authentication certificate path fails to be set.
  console.error(`Failed to set certPath. Code is ${err.code}, message is ${err.message}.`);
});

// After the authentication certificate path is successfully set, call the getAuthorization method of industryServiceClient for authentication.
industryServiceClient.getAuthorization(getContext(this)).then(() => {
  // The authentication is successful.
  console.info(`Succeeded to getting authorization.`);
}).catch((err: BusinessError) => {
  // The authentication fails.
  console.error(`Failed to get authorization. Code is ${err.code}, message is ${err.message}.`);
});
```
