<!--
  Title: Permissions and Data Description for 5.0.1.301 and Earlier Versions
  Catalog: connectivity-Guides
  Document ID: permission-data-earlier-0000001153383793
  Updated: 2025-10-13 02:54:09
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/permission-data-earlier-0000001153383793
-->
# Permissions and Data Description for 5.0.1.301 and Earlier Versions

#### Required Permissions

| Permission | Open Capability | Function | Permission in the New Version |  |
| --- | --- | --- | --- | --- |
| Device management | Wearable device status management | Querying wearable device information | Obtains a list of paired wearable devices and selects a device. | [Basic device information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p144135716461) |
| Querying or subscribing to the wearable device status | Queries the available space of the wearable device. |  |  |  |
| Queries or subscribes to the connection status, available space, battery level, charging status, and wearing status of the wearable device; subscribes to users' heart rate alerts. | [Basic device information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p144135716461) [Wearable user status](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p281553519149) |  |  |  |
| Communications management | Sending P2P messages or files | xxx (your app name) on the phone sends a message or file to xxx (your app name) on the wearable device. | [Basic device information](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p144135716461) |  |
| Receiving P2P messages or files | xxx (your app name) on the phone receives a message or file from xxx (your app name) on the wearable device. |  |  |  |
| Message notification | Message notification management | Sending notifications to the wearable device | Your phone app sends a notification to the wearable device and the notification is displayed on the wearable device according to the template. | [Message notification](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982#EN-US_TOPIC_0000001873951218__p9640134154416) |

#### Collected Data

After obtaining user permissions, the SDK collects the following data:

- **Wearable device information**: Collects device identifiers (device model, device name, and device tag), which are used to scan, pair, and unpair the wearable device, and send instructions specified by users to the wearable device.
- **Wearable device status**: Collects heart rate alerts, wearing status, connection status, battery level, and charging status, for your phone app to query or subscribe to, and provide customized services for users.
-

> **Note:** Related information is anonymized to protect user privacy.
