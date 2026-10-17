<!--
  Title: About the Service
  Catalog: huaweihealth-Guides
  Document ID: introduction-0000002372172841
  Updated: 2026-08-05 02:10:02
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/introduction-0000002372172841
-->
**
# About the Service

The Health Industry SDK provides open capabilities of Huawei industry wearables for you to develop apps and services in the fitness and health industry.

By calling these open capabilities, your apps and services will be able to pair with and connect to Huawei industry wearables, set and query device information and switch states, query and subscribe to health, workout, and daily activity data, subscribe to device status and data updates, as well as SOS and fall events, and start capabilities such as SpO2 and body temperature measurement.

#### SDK Open Capabilities

| Category | Supported Capability |  |
| --- | --- | --- |
| Server API level obtaining | Obtaining the API level of the server |  |
| Management of the connection status between an app and the service | Listening and canceling listening for the connection status between an app and the service |  |
| Certificate configuration | Setting the certificate path |  |
| Querying the certificate path |  |  |
| Deleting the certificate path |  |  |
| Wearable connection | Scanning wearables |  |
| Registering a connection status listener |  |  |
| Adding a wearable |  |  |
| Obtaining the wearable list |  |  |
| Disconnecting a connected wearable |  |  |
| Connecting to a wearable |  |  |
| Deleting a wearable |  |  |
| Device configuration | Querying and subscribing to the device wearing status |  |
| Querying and subscribing to the device battery status |  |  |
| Querying and subscribing to the device charging status |  |  |
| Setting and querying basic user information |  |  |
| Setting and querying the language and unit system |  |  |
| Setting and querying the raise-to-wake switch state |  |  |
| Setting and querying the stand reminder switch state |  |  |
| Setting and querying the Bluetooth disconnection reminder switch state |  |  |
| Setting and querying the notification push switch state |  |  |
| Setting and querying the app trustlist for pushing notifications |  |  |
| Querying the device SN |  |  |
| Restoring a wearable to factory settings |  |  |
| Health data | Heart rate | Setting and querying the maximum workout heart rate |
| Setting and querying the heart rate zones |  |  |
| Setting and querying the continuous heart rate monitoring mode |  |  |
| Setting and querying the high heart rate alert switch state and threshold |  |  |
| Setting and querying the low heart rate alert switch state and threshold |  |  |
| Setting the real-time heart rate linkage switch |  |  |
| Querying heart rate variability (HRV) data |  |  |
| Querying R-R interval (RRI) data |  |  |
| Querying heart rate data |  |  |
| Subscribing to heart rate alerts |  |  |
| Subscribing to real-time heart rates |  |  |
| Sleep | Setting and querying the TruSleep switch state |  |
| Querying sleep data |  |  |
| Querying the sleep status |  |  |
| Subscribing to the sleep status |  |  |
| SpO2 | Setting and querying the automatic SpO2 measurement switch state |  |
| Setting and querying the abnormal SpO2 alert switch state and threshold |  |  |
| Querying SpO2 data |  |  |
| Stress | Setting and querying the automatic stress test switch state |  |
| Querying stress data |  |  |
| Body temperature | Setting and querying the continuous skin temperature measurement switch state |  |
| Setting and querying the elevated body temperature alert switch state |  |  |
| Setting and querying the high body temperature alert switch state |  |  |
| Querying body temperature data |  |  |
| Blood pressure | Setting and querying the periodic blood pressure measurement plan |  |
| Querying and subscribing to the ambulatory blood pressure monitoring status |  |  |
| Querying the ambulatory blood pressure monitoring report |  |  |
| Querying blood pressure data |  |  |
| Subscribing to blood pressure data updates |  |  |
| Sleep apnea | Setting and querying the activation state for sleep apnea detection |  |
| Setting and querying the sleep apnea detection switch state |  |  |
| Querying sleep apnea data |  |  |
| Pulse wave arrhythmia analysis | Setting and querying the arrhythmia detection activation state |  |
| Setting and querying the automatic arrhythmia detection switch state |  |  |
| Setting and querying the arrhythmia alert switch state |  |  |
| Querying pulse wave arrhythmia analysis data |  |  |
| Querying PPG-based pulse wave arrhythmia data |  |  |
| Emotional wellbeing | Querying emotional wellbeing data |  |
| Health Glance | Querying Health Glance reports |  |
| High altitude adaptation | Setting and querying the state of the automatic monitoring switch for High altitude adaptation |  |
| Workout data | Activity records | Querying activity records |
| Step count history | Querying the step count history |  |
| Workout status | Querying the workout status |  |
| Subscribing to the workout status |  |  |
| Workout linkage | Setting workout linkage |  |
| Subscribing to workout linkage data |  |  |
| Single workout | Querying data of a single workout |  |
| Subscribing to data updates of a single workout |  |  |
| Daily activity data | Querying the daily resting calorie consumption target data and the resting calorie consumption data of the current day |  |
| Querying the daily activity status |  |  |
| Querying daily activity data |  |  |
| Querying the daily activity summary data of the current day |  |  |
| Subscribing to daily activity data updates |  |  |
| Sensor data | Subscribing to real-time accelerometer data |  |
| Subscribing to real-time gyroscope data |  |  |
| Subscribing to real-time photoplethysmography (PPG) data |  |  |
| Device event management | Subscribing to SOS events |  |
| Subscribing to fall events |  |  |
| Device control | App control | Starting SpO2 measurement |
| Starting body temperature measurement |  |  |
| Starting the Workout app |  |  |
| System control | Setting network connection persistence in screen-off mode for industry apps |  |
| Setting keep-alive for industry apps |  |  |
| Setting auto-start on boot for industry apps |  |  |
| Enhanced device capabilities | Synchronizing music |  |
| Synchronizing calls |  |  |
| Finding devices |  |  |
| Managing alarms |  |  |
| Setting and querying favorite contacts |  |  |
| Setting, querying, and subscribing to quick SMS replies |  |  |
| Synchronizing calendar events |  |  |
| Obtaining wearable logs |  |  |
| Communication with wearable apps | Sending a template-based notification to a wearable |  |
| Checking whether a wearable app is online |  |  |
| Obtaining the wearable app version |  |  |
| Sending a point-to-point (P2P) message |  |  |
| Sending a file |  |  |
| Canceling file sending |  |  |
| Subscribing to messages sent by a wearable app |  |  |
| Log management | Setting and querying the log switch state |  |
| Collecting logs |  |  |

> **Note:** [Table 1](#EN-US_TOPIC_0000002678004303__table105351335192620) lists open capabilities available on different platforms. Since supported capabilities vary across platforms, refer to the corresponding app development documentation to check whether your target platform supports the capability before calling an open capability.

#### Supported Systems

| System Type | Supported System | App Development Documentation |
| --- | --- | --- |
| HarmonyOS | HarmonyOS 5 or later | [App Development in HarmonyOS 5 or Later](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/harmonyos-next-app-development-0000002372106897) |
| HarmonyOS 3.1, 4.0, or earlier | [App Development in HarmonyOS 3.1, 4.0, or Earlier](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/harmonyos-non-next-app-development-0000002447300101) |  |
| Android | • For Huawei devices: EMUI 4.1 or later, or HarmonyOS 2.0.0, 3.0.0, or 4.0.0 • For non-Huawei devices: Android 7.0 to 15 | [Android App Development](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/android-app-development-0000002338268586) |
| iOS | iOS 13.4 or later | [iOS App Development](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/ios-app-development-0000002594109478) |

#### Technical Architecture
Figure 1 **Technical architecture of the Health Industry SDK

> **Note:** Currently, as for other types of industry devices, only industry-grade mobile devices are supported.
