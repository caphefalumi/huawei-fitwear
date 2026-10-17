<!--
  Title: Applying for Integrating Wear Engine Kit
  Catalog: harmonyos-guides
  Document ID: wearengine_apply
  Updated: 2026-10-14 09:34:17
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply
-->
# Applying for Integrating Wear Engine Kit

Before applying for Wear Engine Kit, [complete basic preparations](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/application-dev-overview), such as setting up the development environment, creating a project, and creating a HarmonyOS app.

- Sign in to [AppGallery Connect](https://developer.huawei.com/consumer/en/service/josp/agc/index.html#/) and click **Development and services**.
- Select your target project from the project list. In the app list, select the app for which you want to apply for Wear Engine Kit.
- Go to **Project settings** > **Manage open capabilities**, and click **Manage** next to **Wear Engine**.
- Visit HUAWEI Developers, go to **Console**, click **Application service**, and click the **Wear Engine** card. > **Note:** If the **Wear Engine** card is not displayed, click **Customize console** in the upper right corner to add it.
- Click **Applying for the Wear Engine Service** and accept the agreement. Then the permission request page is displayed.
- Select **HarmonyOS App**, select a product, and select the required permissions. (Individual developers can request only the basic device information and message notification permissions.) > **Note:** If you select **compatible** next to **Compatible with mobile apps that communicate with older versions of wearable apps**, the local package name and fingerprint will be converted into the package name and fingerprint stored on the cloud for the compatible app. If you select **compatible** next to **Compatible with mobile apps that communicate with older versions of wearable apps**, provide the **compatible app name** and **compatible app package name**. The compatible app must belong to the same developer account as the current app. Permissions related to human body sensors are restricted and available only to qualified research institutions. Do not request these permissions unless you have confirmed with Huawei in advance. The device identifier permission is restricted and available only to qualified partner enterprises. Do not request these permissions unless you have confirmed with Huawei in advance. **Permissions and device capabilities**: **Basic device information** (permission) Wearable status management Basic wearable information query: obtains the list of paired wearables, from which a user can select a target device, and supports querying the available storage space on the selected device.
- Basic wearable status query: supports querying the battery level, subscribing to low-battery alerts, and querying or subscribing to the wearable's connection status, device mode, and charging status.

- Communications management Sending point-to-point messages/files: A phone app XXX (app name) sends messages or files to a wearable app XXX (app name).
- Receiving point-to-point messages/files: A phone app XXX (app name) receives messages or files from a wearable app XXX (app name).

**Message notification** (permission)

- Message notification management Sending notifications to a wearable: A phone app sends notifications to a wearable, where they are displayed using predefined templates. The notification title, content, and buttons can be customized.

**Wearable user status [USER_STATUS](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission)** (permission)

- Wearable user status management Queries and subscribes to the user's wearing status, and subscribes to heart rate alerts.

**Human body sensor [HEALTH_SENSOR](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission)** (permission)

- Human body sensor Obtains the list of sensors on the wearable.
- Reads ECG, PPG, and HR sensor data from the wearable.
- Stops reading human body sensor data from the wearable.

**Motion sensor [MOTION_SENSOR](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission)** (permission)

- Motion sensor Obtains the list of sensors on the wearable.
- Reads ACC, GYRO, and MAG sensor data from the wearable.
- Stops reading motion sensor data from the wearable.

**Device identifier [DEVICE_IDENTIFIER](https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearengine_api#permission)** (permission)

- Device identifier Obtains the serial number of a connected wearable.

- Upload the data permission and usage description, as well as the user authorization path description. Select whether to show the HUAWEI logo on the authorization screen, and then submit the request. **Data permission and usage description** Permission: Provide each requested data permission on a separate line.
- Data usage: Provide the requirements, scenarios, purposes, and methods of using the data permission.
- Data display path: Provide screenshots of the scenarios where you are going to use the permissions. This is optional.

**User authorization path description**

- Provide screenshots of the user authorization screen and describe how users can access the screen.
- If your app allows users to modify the granted permissions, provide screenshots of the permission modification screen and describe how users can access the screen. This is optional.

> **Note:** Data usage description: [Data Permission and Usage Description for Individual Developers.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/usageDescForIndividual/000/001/062/1000000000000001062.20251215012511.22251586960885594693277341479531:20751203012536:100005355:3D856F62A72D551B60B2A2F43546BDBAA99F3D5B8473FD7E18BEC9AFE07BE52A.xlsx) and [Data Permission and Usage Description for Enterprise Developers.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/usageDescForEnterprise/000/001/062/1000000000000001062.20251215012630.44575375146870557509418085467598:20751203012646:100005355:1AD9975308702F4796276EBDE57B6B36B88487F0906F4FBBE01164EA48F37772.xlsx) User authorization path description: [User Authorization Path Description.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/authDisplayDesc/000/001/062/1000000000000001062.20260228015757.97733284206990746680751047476961:20760216015811:100005355:FDD269B48DC93515B24F00E9228B99A51E2B890ADF51A042D892833779C1C394.xlsx)

- Wait for approval. The approval process usually takes one to two weeks, depending on the type of permission requested and the app's release region. We will evaluate the permission availability based on the regulatory requirements of the app's release region. A request will not be approved if the submitted materials do not meet the requirements. After the request is approved, you can proceed to the development, testing, and release phases. If your business scope changes and you need to modify the corresponding data permissions, click **Modify** and submit the request again.
