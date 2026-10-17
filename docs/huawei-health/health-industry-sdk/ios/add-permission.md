<!--
  Title: Adding Permissions
  Catalog: huaweihealth-Guides
  Document ID: add-permission-0000002594109484
  Updated: 2026-08-05 02:10:09
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/add-permission-0000002594109484
-->
# Adding Permissions

#### Configuring Bluetooth Permissions

This SDK involves the Bluetooth communication function. Therefore, your app must declare the Bluetooth permissions in **Info.plist**. Otherwise, the app will crash when running on iOS 13 or later.

- Open your project in Xcode and select the **Info.plist** file (or choose **Target** > **Info**).
- Add the following two keys and set the user-oriented permission prompt (**Value**) based on the actual app scenario: **Privacy - Bluetooth Always Usage Description**: For example, "This app needs to continuously use Bluetooth to connect to and manage your smart devices." **Privacy - Bluetooth Peripheral Usage Description**: (for compatibility with versions earlier than iOS 13) For example, "This app needs to use Bluetooth to connect to external devices."

#### Configuring the Bluetooth Background Modes

To ensure that the SDK can maintain a stable connection and data communication with the Bluetooth device when the app is switched to the background or the phone screen is locked, you must enable the Bluetooth background permission. Perform the following steps:

- In Xcode, select your app project and click the corresponding app in the **Targets** list.
- Click the **Signing & Capabilities** tab.
- Click the **+ Capability** button in the upper left corner. In the displayed list, double-click **Background Modes**.
- In the displayed **Background Modes** configuration area, select **Uses Bluetooth LE accessories**.
