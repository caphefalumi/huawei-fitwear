<!--
  Title: Applying for Health Service Kit
  Catalog: harmonyos-guides
  Document ID: health-apply
  Updated: 2026-10-14 09:29:47
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply
-->
# Applying for Health Service Kit

Before applying for Health Service Kit, set up the development environment and complete basic preparations, such as [creating a project](https://developer.huawei.com/consumer/en/doc/app/agc-help-create-project-0000002242804048), [creating a HarmonyOS app](https://developer.huawei.com/consumer/en/doc/app/agc-help-create-app-0000002247955506), and [adding a public key fingerprint](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/application-dev-overview#conditionally-mandatory-adding-a-public-key-fingerprint), by referring to [Application Development Preparations](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/application-dev-overview). Then proceed with the following development steps.

- Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html#/) and click **Development and services**.
- Select your target project from the project list. In the app list, select the app for which you want to apply for Health Service Kit.
- Go to **Project settings** > **Open capabilities**, and click **Manage** next to **Health Service Kit**. > **Note:** Currently, member accounts under a team account cannot independently use Health Service Kit. For details, please refer to [Team Account](https://developer.huawei.com/consumer/en/doc/start/team-account-guides-0000001053785552).
- Click **Apply for Health Service Kit** and accept the agreement. Then the page for requesting data permissions is displayed.
- Set **Product Type** to **HarmonyOS App**, fill in the request information, and select the data permissions your app requires. > **Note:** When applying for Health Service Kit, comply with the least privilege principle. Data access permissions must align with the business needs. Do not request any permission that exceeds the business scope or is not currently required. After your app or service is released, Huawei will conduct random checks on the use of permissions. The checks include but are not limited to spot checks on the released app or service, monitoring of API calls, and inspection by assigned specialists. You can refer to the agreement signed before applying for Health Service Kit to understand the check criteria and how the results will be handled. For details about the OAuth permissions corresponding to each data type, please refer to [Permission Description](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-permission-description).
- To ensure user privacy and data security, Health Service Kit requires you to provide related materials and information to justify the data permissions requested by your app. > **Note:** Please read the [Common Issues That Lead to Request Rejection](#common-issues-that-lead-to-request-rejection) before submitting materials to avoid similar issues in your request.
- Request the test permissions. Your request needs to be manually reviewed, which takes about 10 working days. The review result will be sent to you by email. If the submitted materials do not meet the requirements, the request will be rejected. Modify your materials based on the rejection reason in the email and resubmit them. The review of your resubmission also takes about 10 working days. If you have any other questions, please contact the [intelligent assistant](https://developer.huawei.com/consumer/en/customerService/#/bot-dev-top/faq-top/faq-talk-top).
- Once the request is approved, your app is granted test permissions and can call the corresponding APIs to obtain the Health Service Kit data for testing and development. > **Note:** After your initial request for the test permissions is approved, the permissions will take effect promptly. If your business scope changes, modify the permissions and submit a new request. Please wait for 1 hour after modifying the test permissions before performing verification tests. The approval at this stage is for development and testing purposes only. During the test phase, the number of users is limited, and only the first 100 users can use Health Service Kit in your app. To remove the limit on the number of users, submit a verification request after your app has completed testing and verification. For details, please refer to [Applying for Formal Permissions](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-verification). [Apply for formal permissions](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-verification) within one year after the test permissions are granted. Otherwise, the granted test permissions will be revoked.

- Manage permissions. If your business scope changes, click **Manage** to modify the permissions accordingly and submit a new request.

#### Common Issues That Lead to Request Rejection

The following are common issues that may lead to request rejection. Please review them before submitting your request to avoid similar issues in your materials. If you have already submitted a request and it is rejected, you may refer to the solutions below to revise your materials and resubmit your request.

## Missing Permission Description

Requirement: Provide a description for each read/write permission you request in the materials.

Solution: Ensure that each permission you request has a corresponding usage description in both Sheet 1 and Sheet 2.

> **Note:** For any changes in the usage scenarios of the data read/write permission you have requested, update the request materials before applying for verification.

## Non-compliant Logo or Icon Usage

Requirement: The use of logos and icons must comply with the [regulations](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-logo-usage-regulations).

Solution: Display the HUAWEI Health logo and icon in the scenarios described in your request compliantly, as required by [regulations](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-logo-usage-regulations).

## Missing Mandatory Content

Requirement: Complete all sheets in the request materials.

Solution: Complete any sheets left empty in your materials. The **Enterprise Introduction** sheet is mandatory for enterprise developers. If you are an individual developer, complete the **Developer Info** sheet and specify your affiliated research institute or university.

## Enterprise Developer Qualification Not Meeting the Requirements

If you have any questions about the qualification requirements, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/) or send an email to **[hihealth@huawei.com](mailto:hihealth@huawei.com)**.

Specify the following information in your email or ticket: the developer site, the country/region where your users reside, an introduction to the enterprise and project scenarios, and the contact information of the project lead.

## Individual Developer Qualification Not Meeting the Requirements

Requirement: For individual developers, if your app has not been released on AppGallery or is not a mobile app, Health Service Kit data will not be available. To apply for accessing user data with the basic openness level, the individual developer must not have any adverse personal credit records. User data with the advanced openness level is currently not open to individual developers. For details about the data openness levels, please refer to [Open Data Overview](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-data-overview).

Solution: Release your mobile app on AppGallery, or re-register as an enterprise developer to apply for Health Service Kit. When applying for Health Service Kit, select only the user data with the basic openness level.

If your request is still rejected, you can [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/) for manual assistance.

- Access the [online ticket system](https://developer.huawei.com/consumer/en/support/feedback/#/) and select **HMS Core**.
- Select **Health Kit**.
- Describe your issue and click **Submit**.

After you submit a ticket, we will get back to you within one to two working days. We may need you to provide further clarification. Please monitor the progress and respond in a timely manner so that we can resolve the issue more effectively.
