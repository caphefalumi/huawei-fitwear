<!--
  Title: Version Change History
  Catalog: huaweihealth-Guides
  Document ID: version-change-history-0000002338287146
  Updated: 2026-08-05 02:10:03
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/version-change-history-0000002338287146
-->
# Version Change History

#### 2.15.0.107 (2026-06-05)

| **New Features** • Added [continuous skin temperature measurement switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-skin-temp-continuous-measurement-switch-0000002527049370), [elevated body temperature alert switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-elevated-temp-warning-switch-0000002558049215), [high body temperature alert switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-high-temp-alert-switch-0000002526889416), [pulse wave arrhythmia detection activation](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-arrhythmia-active-state-0000002527349470), [automatic pulse wave arrhythmia detection switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-arrhythmia-auto-monitor-switch-0000002558349319), [pulse wave arrhythmia alert switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-arrhythmia-notify-switch-0000002558189339), and [automatic monitoring switch for High altitude adaptation](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-high-land-blood-oxygen-switch-0000002558281563). • Added physiological indicator data collected during sleep to [sleep data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-sleep-data-0000002342554556). • Opened the following health data: [heart rate variability (HRV) data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-hrv-data-0000002558176259), [R-R interval (RRI) data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-rri-data-0000002527336380), [pulse wave arrhythmia detection result data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-arrhythmia-result-data-0000002527189498), [raw pulse wave arrhythmia data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-arrhythmia-ppg-data-0000002560673099), [emotional wellbeing data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-emotion-data-0000002557722765), and [Health Glance reports](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-health-glance-report-0000002527074956). • Opened the following daily activity data: [daily resting calorie consumption target data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-daily-resting-calories-goal-0000002558295467) and [resting calorie consumption data of the current day](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-today-resting-calories-0000002527135670). • Added support for HUAWEI WATCH H7556 Series wearables. (Currently, these wearables do not support [sleep status query](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-sleep-status-0000002376552465), [sleep status subscription](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-sleep-status-0000002342757094), or [workout status query](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-exercise-status-0000002482700877).) |
| --- |

#### Earlier Versions

Below are the version changes of the Health Industry SDK.

## 2.14.0.102 (2025-11-27)

| **Modified Features** • Robustness enhancementSolved the SDK service process crash caused by the exception thrown by a custom callback function. Solved the issue that an exception occurs occasionally when the SDK listens to notification messages. **New Features** • Added compatibility with Android 15 mobile devices. |
| --- |

## 2.13.0.102 (2025-08-30)

| **New Features** • Added user account setting parameters to the [device adding API](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536). • Added the [automatic stress test switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-stress-auto-monitor-switch-0000002417316317), [setting of activation state for sleep apnea detection](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-osa-active-state-0000002417356473), and [sleep apnea detection switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/set-osa-switch-0000002383597172). • Added support for multiple sports types in data of a single workout. • Opened wearable information: [wearable model](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). • Opened workout data: [activity records](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-activity-records-0000002417387525). • Opened health data: [sleep apnea data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-osa-data-0000002383948102), [stress data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-stress-data-0000002383788218), [ambulatory blood pressure monitoring status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-dynamic-blood-pressure-status-0000002418368213), [periodic blood pressure measurement plan](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-blood-pressure-measure-plan-0000002429418641), and [ambulatory blood pressure monitoring report](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-dynamic-blood-pressure-data-0000002429538585). • Added the following enhanced device capabilities: [music synchronization](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/music-synchronization-0000002383970218), [call synchronization](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/call-synchronization-0000002383970226), [device finding](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/device-find-0000002417529481), [alarm management](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/alarm-management-0000002417409625), [favorite contacts](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/favorite-contacts-0000002383810354), [SMS quick reply](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/text-messages-quick-reply-0000002384569096), [calendar event synchronization](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/calendar-schedule-synchronization-0000002384569100), [time synchronization](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/add-device-0000002338138536#EN-US_TOPIC_0000002678163965__li221633153111), and [wearable log collection](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-device-dfx-log-0000002418288389). • Added support for HUAWEI Band HA5A0 and HUAWEI WATCH H3540 Series wearables. |
| --- |

## 2.12.0.103 (2024-09-30)

| **New Features** • Added support for HUAWEI WATCH H5556, HUAWEI WATCH H5756, and HUAWEI WATCH H9D20 Series wearables. |
| --- |

## 2.11.0.109 (2024-03-30)

| **New Features** • Added support for HUAWEI Band HA590 Series wearables. • Added compatibility with HarmonyOS 4.0 mobile devices. • Added the following device control features for HUAWEI WATCH H7546: [Starting SpO2 Measurement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/start-spo2-measurement-0000002376614913) and [Starting Body Temperature Measurement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/start-temperature-measurement-0000002342616972). |
| --- |

## 2.10.0.109 (2023-12-30)

| **New Features** • Added support for HUAWEI WATCH H5546 Series wearables. • Added the following device control features: [Starting SpO2 Measurement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/start-spo2-measurement-0000002376614913) and [Starting Body Temperature Measurement](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/start-temperature-measurement-0000002342616972). • Added the following device event reporting features: [Subscribing to SOS Events](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-sos-event-0000002376595273) and [Subscribing to Fall Events](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-fall-detect-event-0000002342757126). • Added support for the [stand reminder switch](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-sedentary-reminder-switch-0000002372218965) on HUAWEI WATCH H7546. |
| --- |

## 2.9.0.110 (2023-09-30)

| **New Features** • Added support for HUAWEI WATCH H7546 Series wearables. |
| --- |

## 2.8.0.106 (2023-06-30)

| **New Features** • Opened health data: [sleep data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-sleep-data-0000002342554556). • Added support for HUAWEI Band HA580 Series wearables. • Added compatibility with Android 13 mobile devices. |
| --- |

## 2.7.0.105 (2023-03-31)

| **New Features**• Opened health data: [real-time accelerometer data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-realtime-acc-data-0000002342757114), [real-time gyroscope data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-realtime-gyro-data-0000002342597346), and [real-time photoplethysmography data](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/subscribe-realtime-ppg-data-0000002376715133). • Opened workout data: [daily activity status](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/query-fitness-status-0000002376552485). • Opened wearable information: [wearable SN](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). |
| --- |

## 2.6.0.105 (2022-12-31)

| **Modified Features** • Maintainability and testability enhancement: Added the error description of universal error codes to the API callback results, and the SDK version information to logs. **New Features**• Added support for HUAWEI WATCH B5-736 Series wearables. |
| --- |

## 2.5.0.103 (2022-09-30)

| **Modified Features** • Privacy enhancement: Each device must be factory reset before it can be added. **New Features**• Added support for HUAWEI Band BA-570 Series wearables. • Added support for P2P messaging and file transfers between your app and wearable apps. |
| --- |

## 2.3.0.106 (2022-07-30)

| • Added compatibility with Android 12 mobile devices. • Added support for HUAWEI WATCH B9-D10 Series and HUAWEI WATCH B7 Series wearables. • Added the capability of specifying the Bluetooth connection mode when adding a device. • Opened health data, including blood pressure and body temperature. • Added support for querying historical workout, heart rate, SpO2, body temperature, ECG, and blood pressure data. |
| --- |

## 2.1.0.610 (2022-05-20)

| Health Industry SDK 2.1.0.610 is the first official release. It allows your app to connect to Huawei wearables and obtain data from connected wearables. Industry partners are welcome to integrate the SDK. |
| --- |
