<!--
  Title: Applying for the Wear Engine Service
  Catalog: connectivity-Guides
  Document ID: applying-wearengine-ios-0000001935664117
  Updated: 2026-04-07 07:42:03
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/applying-wearengine-ios-0000001935664117
-->
**
# Applying for the Wear Engine Service

Before applying for Wear Engine, [register a HUAWEI ID and apply for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-ios-0000001893544118).

- Go to App services > Wear Engine. Figure 1 **Wear Engine card
- Click **Apply for Wear Engine** and agree to the agreement. The screen for data permission application will then be displayed. **Figure 2 **Applying for the Wear Engine service
- Select **iOS app** and select a product and the required permissions. (Individual developers can only apply for basic device information and message notification permissions.) Enter the callback scheme URL, which must be defined in your app. When authorizing your app, users will be redirected from your app to the Huawei Health app, and then redirected back to your app after the authorization is complete. This callback scheme URL defined here is used for redirecting users from the Huawei Health app back to your app. > **Note:** You need to apply for the permissions for the app on the phone. By default, you do not need to apply for permissions for the wearable app. **Figure 3 **Entering app info 
| Permission | Open Capability | Function |  |
| --- | --- | --- | --- |
| Basic device information [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) | Wearable device status management | Querying basic wearable device information | Obtains a list of paired wearable devices and selects a device; queries the available space of the wearable device. |
| Querying or subscribing to the wearable device status | Queries or subscribes to the wearable device connection status, available space, charging status, battery level, and low battery alerts. |  |  |
| Communications management | Sending P2P Messages | xxx (your app name) on the phone sends a message to xxx (your app name) on the wearable device. |  |
| Receiving P2P Messages | xxx (your app name) on the phone receives a message from xxx (your app name) on the wearable device. |  |  |

- Upload the data permission, data usage description, and the user authorization path description, select whether to show the HUAWEI logo on the authorization screen, and submit the application. Requirements on describing requested data permissions and their usage Data permission: Provide data permissions to be applied for. Each permission occupies a row.
- Data usage: Describe the requirements, scenarios, and purposes of data usage, and the way you will use the data.
- Data display path: Provide the screenshots of the application scenarios of the permissions to be applied for. (Optional)

- Requirements for filling in the user authorization path description: Provide screenshots of the user authorization screens and the text description of the operation paths.
- If the modification permission comes with your app, provide screenshots of the user authorization modification screens and the text description of the operation paths. (Optional)

> **Note:** Data usage description: [Data Permission and Usage Description for Individual Developers.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/usageDescForIndividual/000/001/062/1000000000000001062.20251215012511.22251586960885594693277341479531:20751203012536:100005355:3D856F62A72D551B60B2A2F43546BDBAA99F3D5B8473FD7E18BEC9AFE07BE52A.xlsx) and [Data Permission and Usage Description for Enterprise Developers.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/usageDescForEnterprise/000/001/062/1000000000000001062.20251215012630.44575375146870557509418085467598:20751203012646:100005355:1AD9975308702F4796276EBDE57B6B36B88487F0906F4FBBE01164EA48F37772.xlsx) User authorization path description: [User Authorization Path Description.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/authDisplayDesc/000/001/062/1000000000000001062.20260228015757.97733284206990746680751047476961:20760216015811:100005355:FDD269B48DC93515B24F00E9228B99A51E2B890ADF51A042D892833779C1C394.xlsx)

- Wait for the approval result. Generally, the approval process may take one to two weeks, depending on the requested permission types and the app release regions. An application won't be approved if the submitted materials do not meet the requirements. Once the application is approved, the development and test phases can start and the app can be released once the related procedures are completed. If your business scope changes and you need to modify the corresponding data permissions, click **Modify** and submit the application again. **Figure 4 **Application approved
- A scheme secret will be generated for your app after the application is approved. The app ID, scheme URL, and scheme secret are required for the operations [Querying Available Wearable Devices](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/check-availabla-dev-ios-0000001921237861). **Figure 5 **App approved
