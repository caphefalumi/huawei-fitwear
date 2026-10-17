<!--
  Title: Integrating the Health Industry SDK
  Catalog: huaweihealth-Guides
  Document ID: integrate-health-industrty-sdk-0000002624668847
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/integrate-health-industrty-sdk-0000002624668847
-->
# Integrating the Health Industry SDK

Huawei provides the Health Industry SDK for Xcode development. Before development, you need to integrate the Health Industry SDK into your Xcode.

| SDK Name | SDK Package | Developer | Version Number | Main Function | Personal Information Processing Rule | Compliance Instruction | Verification Code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Health Industry SDK | Huawei provides the Health Industry SDK for Xcode. Refer to the following part of this section for the integration. | Huawei Software Technologies Co., Ltd. | Latest version: 1.1.0.301 More versions: [Version Change Description](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/version-change-history-0000002594269384) | For details about the main functions provided by the Health Industry SDK, please refer to [About the Service](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/introduction-0000002372172841). | For details about how the SDK processes personal information, please refer to [SDK Privacy and Security Statement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-data-security-0000002624668883). | You need to comply with basic requirements for protecting personal information when integrating and using the SDK. For details, please refer to [SDK Compliance Guide](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/sdk-compliance-user-guide-0000002594109520). | 
```cpp
SHA-256 of version 1.1.0.301: 92F6F6C92891DF1EBD934E7058FE0F06C8BD5C4A17C237AEA996B70DDE90CEF5
```
 |

- Start Xcode, copy the **IndustrySDK.xcframework** file from the iOS package to the project folder, and import the file to the project.
- On the **Build Phases** tab page, add the dependency to **Link Binary With Libraries**.
- On the **General** tab page, set **Embed** to **Embed & Sign** in the **Frameworks, Libraries, and Embedded Content** area.
