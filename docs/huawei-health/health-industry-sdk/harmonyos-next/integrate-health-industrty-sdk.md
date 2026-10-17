<!--
  Title: Integrating the Health Industry SDK
  Catalog: huaweihealth-Guides
  Document ID: integrate-health-industrty-sdk-0000002376514377
  Updated: 2026-08-05 02:10:06
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/integrate-health-industrty-sdk-0000002376514377
-->
# Integrating the Health Industry SDK

Huawei provides the Health Industry SDK for the HUAWEI DevEco Studio. Before development, you need to integrate the Health Industry SDK into your HUAWEI DevEco Studio.

| SDK Name | SDK Package | Developer | Version Number | Main Function | Personal Information Processing Rule | Compliance Instruction | Verification Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Health Industry SDK | Health Industry SDK provided by Huawei for DevEco Studio. Refer to the following part of this section for the integration. | Huawei Software Technologies Co., Ltd. | Latest version: 5.3.0-104 More versions: [Version Change History](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/version-change-history-0000002338108826) | For details about the main functions provided by the Health Industry SDK, please refer to [About the Service](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/introduction-0000002372172841). | For details about how the SDK processes personal information, please refer to [SDK Privacy and Security Statement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-data-security-0000002352145496). | You need to comply with basic requirements for protecting personal information when integrating and using the SDK. For details, please refer to [SDK Compliance Guide](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-compliance-user-guide-0000002352305288). | 
```cpp
SHA-256 of IndustrySdk-5.3.0-104: 79735429f837f454cbadc0f48f7d524557ee90d4e7ea39c6bf263ba02249d485
```
 |

#### Configuring Dependencies

- Enter the **entry** directory of the project and open the **oh-package.json5** file.
- Add the dependency to **dependencies** in the **oh-package.json5** file as follows:
```cpp
"dependencies": {
  "@huawei-cbg/health-industry-sdk": "5.3.0-104"
}
```

- Open the **Terminal** window and run the following command to go to the **entry** directory:
```cpp
cd entry
```

- Run the **ohpm install** command to install the dependency package. The dependency package will be installed in the **oh_modules** directory under **entry**.
```cpp
ohpm install
```
