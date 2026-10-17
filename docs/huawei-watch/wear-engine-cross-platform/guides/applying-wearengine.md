<!--
  Title: Applying for the Wear Engine Service
  Catalog: connectivity-Guides
  Document ID: applying-wearengine-0000001050777982
  Updated: 2026-04-07 07:42:03
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/applying-wearengine-0000001050777982
-->
**
# Applying for the Wear Engine Service

Before applying for the Wear Engine service, make sure that you have completed the task of [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011).

- Go to App services > Development > Wear Engine. Figure 1 **Wear Engine card > **Note:** If you can't find the **Wear Engine** card, click on the right of **Development** to add a card.

- Click **Apply for Wear Engine** and agree to the agreement. The screen for data permission application will then be displayed. **Figure 2 **Applying for the Wear Engine Service
- Select **Android app** and select a product and the required permissions. (Individual developers can only apply for [basic device information](#EN-US_TOPIC_0000001873951218__p144135716461) and [message notification](#EN-US_TOPIC_0000001873951218__p9640134154416) permissions.) > **Note:** You need to apply for the permissions for the app on the phone. By default, you do not need to apply for permissions for the wearable app. If no selectable apps are shown in the drop-down list box, apply for the HUAWEI ID service as instructed in [Registering a HUAWEI ID and Applying for the HUAWEI ID Service](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/registering-applying-account-0000001050818011). 
| Permission | Open Capability | Function |  |
| --- | --- | --- | --- |
| Basic device information [DEVICE_MANAGER](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__DEVICE_MANAGER) | Wearable device status management | Querying basic wearable device information | Obtains a list of paired wearable devices and selects a device; queries the available space of the wearable device. |
| Querying or subscribing to the wearable device status | Queries the battery level; subscribes to low battery level alerts; queries or subscribes to the connection status, available space, and charging status of wearable devices. |  |  |
| Communications management | Sending P2P messages or files | xxx (your app name) on the phone sends a message or file to xxx (your app name) on the wearable device. |  |
| Receiving P2P messages or files | xxx (your app name) on the phone receives a message or file from xxx (your app name) on the wearable device. |  |  |
| Message notification [NOTIFY](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#EN-US_TOPIC_0000001874111234__NOTIFY) | Message notification management | Sending notifications to the wearable device | Your phone app sends a notification to the wearable device and the notification is displayed on the wearable device according to the template. The message title, content, and button can be configured. |
| Wearable user status [WEAR_USER_STATUS](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#section1423182224014) | Wearable device users' status management | Querying or subscribing to the wearable user status | Queries and subscribes to users' wearing status; subscribes to users' heart rate alerts. |
| Device identifier [DEVICE_SN](https://developer.huawei.com/consumer/en/doc/connectivity-References/permission-0000001059433005#section8848193515365) | Device identifier | Obtaining the device SN | Obtains the SN of paired wearable devices. |

- Upload the data permission, data usage description, and the user authorization path description, select whether to show the HUAWEI logo on the authorization screen, and submit the application. Requirements on describing requested data permissions and their usage Data permission: Provide data permissions to be applied for. Each permission occupies a row.
- Data usage: Describe the requirements, scenarios, and purposes of data usage, and the way you will use the data.
- Data display path: Provide the screenshots of the application scenarios of the permissions to be applied for. (Optional)

- Requirements for filling in the user authorization path description: Provide screenshots of the user authorization screens and the text description of the operation paths.
- If the modification permission comes with your app, provide screenshots of the user authorization modification screens and the text description of the operation paths. (Optional)

> **Note:** Data usage description: [Data Permission and Usage Description for Individual Developers.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/usageDescForIndividual/000/001/062/1000000000000001062.20251215012511.22251586960885594693277341479531:20751203012536:100005355:3D856F62A72D551B60B2A2F43546BDBAA99F3D5B8473FD7E18BEC9AFE07BE52A.xlsx) and [Data Permission and Usage Description for Enterprise Developers.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/usageDescForEnterprise/000/001/062/1000000000000001062.20251215012630.44575375146870557509418085467598:20751203012646:100005355:1AD9975308702F4796276EBDE57B6B36B88487F0906F4FBBE01164EA48F37772.xlsx) User authorization path description: [User Authorization Path Description.xlsx](https://hihealthbase-drcn.things.hicloud.com/healthkit/fileServer/getFile/plain/authDisplayDesc/000/001/062/1000000000000001062.20260228015757.97733284206990746680751047476961:20760216015811:100005355:FDD269B48DC93515B24F00E9228B99A51E2B890ADF51A042D892833779C1C394.xlsx)

- Wait for the approval result. Generally, the approval process may take one to two weeks, depending on the requested permission types and the app release regions. An application won't be approved if the submitted materials do not meet the requirements. Once the application is approved, the development and test phases can start and the app can be released once the related procedures are completed. If your business scope changes and you need to modify the corresponding data permissions, click **Modify** and submit the application again. **Figure 3 **Application approved
