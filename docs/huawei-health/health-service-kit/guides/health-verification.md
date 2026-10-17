<!--
  Title: Applying for Formal Scopes
  Catalog: harmonyos-guides
  Document ID: health-verification
  Updated: 2026-10-14 09:29:39
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-verification
-->
# Applying for Formal Scopes

The test scopes granted after you [apply for Health Service Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-apply) limit the number of users to 100. After the app development is complete, remove the restriction on the number of users by submitting a verification application to obtain formal scopes before releasing the app. Once approved, your app can be put into large-scale commercial use.

#### Applying for Verification

- Sign in to [HUAWEI Developers](https://developer.huawei.com/consumer/en/), access **Console**, choose **App services**, and click **Health Service Kit**. If the **Health Service Kit** card cannot be found, click **Customize console** in the upper right corner to add it.
- Click **Get verified**, select the target scopes, and submit the materials for review, which takes about 15 workdays. We will notify you of the verification result (either of the following) via email. Verification successful: Your app can now integrate Health Service Kit.
- Verification rejected: We will notify you of the rejection reason via email. (You can also check the verification status on the Health Service Kit card on HUAWEI Developers.) Please modify your application as instructed and then submit it. It takes also about 15 workdays for us to review your new application. If you have any other questions, please go to [intelligent assistant](https://developer.huawei.com/consumer/en/customerService/#/bot-dev-top/faq-top/faq-talk-top) for consultation.

> **Note:** After the application is approved, the scopes you have applied for will take effect in 24 hours.

#### FAQs About Applications Being Rejected

The following lists typical FAQs about applications being rejected. Please read the following content before your application. If you have submitted an application and the application is rejected, modify the application materials by referring to the following solutions and submit them again.

> **Note:** Fill the self-check results correctly in the checklist. The proof materials for each scenario in the app release checklist you submit must comply with the standards in the checklist. Note that the video demonstrating the handling process in the corresponding scenario must be complete. Check your materials carefully before submitting them, in case that your application is rejected. Once your application is submitted for review, the app status changes to "to be verified". Any suggestions on revising the materials will be sent to you via [hihealth@huawei.com](mailto:hihealth@huawei.com). You can click **Update** to upload the latest materials and reply to the email for us to review the latest materials.

## No Video Showing the Privacy Statement or Incorrect Content in Privacy Statement

- Requirements: In the video, you should show the process of accessing the privacy statement in the app, with the corporation name and app name correctly displayed on the screen.
- Common problems: No video is provided showing the privacy statement.
- Incorrect content in privacy statement: The corporation name and app name displayed on the screen are different from those used for verification.
- The actual app name, app name in the privacy statement, and app name used for verification are inconsistent.

- Solution: Provide a video showing the privacy statement.
- In the privacy statement, clarify the relationship between the actual app name, app name in the privacy statement, and app name used for verification (corporation name included; case-sensitive); or provide official documents, official emails, company seals, and other formal materials.

## Incorrect Use of the Huawei Health Logo and Text

- Requirements: Use the text "HUAWEI Health" if your app needs to display Huawei-related text.
- Common problems: Text like "Huawei Switch", "Huawei Health Data", "HUAWEI Health Service Kit", "Huawei Health Platform", or "Huawei band" is displayed at the entry or in the prompt messages.
- The brand icon in use is not of the latest version, or Huawei icons are incorrectly used.

- Solution: Use "HUAWEI Health" in the text.
- Use the [HUAWEI Health logo](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-logo-usage-regulations) in the app.

## Inconsistent Scopes and Icon on the Authorization Screen

- Requirements: When users open the app for the first time, the authorization screen displayed should list the scopes you have selected for verification, and display the app icon properly.
- Common problems: The scope list displayed on the authorization screen is inconsistent with the scopes selected for verification (all verified scopes and the scopes that have been verified this time).
- The app icon is missing on the authorization screen, or the app icon in use is inconsistent with the one used for applying for verification on the platform.

- Solution: Check whether the test scopes selected for commercial use match your app scopes. (Do not display the test scopes that are not ready for commercial use on the authorization screen.) You can change the app name or icon in either of the following ways: Go to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html#/myApp) > **My apps**, find the target app, and edit the app name and upload app icon in app information. Visit the platform, go to **App services** > **Development** > **HUAWEI ID**, find the target app, and modify the app icon in app information.

## Authorization Cancellation Not Integrated

- Requirements: Allow users to cancel the authorization granted to your app.
- Solution: Integrate the authorization cancellation feature by referring to [Managing User Authorization](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-add-permissions).

## Services Being Unavailable Before Users Grant All Scopes/Lack of Insufficient Authorization Prompt

- Requirements: Granting only a part of the scopes should not affect users' ability of using the app. Users should be able to use basic app features when they grant only a part of the data scopes.
- If the authorization is insufficient, a message should be displayed, or users should be instructed to re-authorize.

- Common problems: The app can be used only after the user grants all scopes.
- The app does not display a message indicating that the authorization is insufficient or instruct the user to re-authorize.

- Solution: Provide reasonable explanations or legal basis if some features are accessible only after all data scopes are authorized.

Example of reasonable explanations: The calculation of stress models depends on data types including heart rate, steps, weight, and sleep. In this case, the stress model calculation feature is accessible only after all of the required data scopes are authorized.

Example of legal basis: Provide evidence of the local law not prohibiting the practice that "apps are not accessible to users unless all data scopes are authorized".

- If the authorization is insufficient, a message should be displayed, or users should be instructed to re-authorize.

## No/Incomplete/Incorrect Proof Materials

- Requirements: Correctly and completely fill in the self-check result in the App Release Checklist, and provide proof materials based on the scenario description and acceptance criteria. You can obtain the App Release Checklist from the **sample** on the page to **submit verification information**.
- Common problems: You have developed a web app that does not provide the manual data synchronization feature, or you do not provide proof materials for such feature.
- Your app involves the subscription mechanism, but no proof is provided.
- A simplified user operation manual is not available.
- The scenario in the proof video is inconsistent with the scenario described in the check item.
- The proof video does not contain all of the elements specified in the acceptance criteria of the corresponding check item.
- No material is provided proving the data consistency between the data types in use in your app and those in the Huawei Health app, or the proof images show that the data is not consistent.

- Solution: Carefully read the scenario description and acceptance criteria in App Release Checklist and provide proof materials as required.
- For check item **4.1 Accuracy of all data types applied for by the app** in the table, if your app needs to obtain data from the Huawei Health app, provide evidence to prove the consistency between each type of data applied for and the data in the Huawei Health app in the corresponding sheet. (If your app obtains the data for further algorithm-based analysis, provide the calculation formula or algorithm, and give an example.)
- If your app uses on-cloud APIs, provide an entry for users to manually synchronize data and provide proof that the manual synchronization feature works properly.
- If your app uses the subscription notification mechanism provided by the Health Service Kit cloud to detect user data changes, provide materials of proof that your app obtains the latest data in real time after the Huawei Health app data changes.
- Provide a simplified user operation manual for the app based on the reference template in the App Release Checklist.

## Confusion of Proof Scenarios

- Requirements: The proof materials you provide must be consistent with the scenario description of each check item.
- Common problems: Proof materials for check item 3.3 Troubleshooting in case of authorization failure are confused with those for other scenarios.
- Solution: For check item 3.3 Troubleshooting in case of authorization failure, cancel the authorization as follows: Method 1: On your phone, go to SettingsHUAWEI IDAccount securityApps using my HUAWEI ID. Select the app for which you want to cancel the authorization, and then cancel the authorization. Method 2: Open the Huawei Health app, go to MePrivacy managementUSER DATA MANAGEMENTData sharing and authorization. Select the app for which you want to cancel the authorization, and then cancel the authorization.
