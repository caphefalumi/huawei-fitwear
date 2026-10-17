<!--
  Title: Service Introduction
  Catalog: HMSCore-Guides-V5
  Document ID: overview-dev-android-0000001050071671-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/overview-dev-android-0000001050071671-V5
-->
# Service Introduction

Health Kit provides the following key APIs for the Android client:

- Adding, deleting, modifying, and querying of fitness and health data: [DataController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/datacontroller-develop-0000001050071677-V5).
- Creating and managing a single workout or activity: [ActivityRecordsController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/activityrecord-develop-0000001050069730-V5).
- Reading fitness and health data in real time: [AutoRecorderController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/autorecord-develop-0000001050071679-V5).

#### DataController

**Overview**

**DataController** is used to manage fitness and health data. The related operations include adding, deleting, modifying, and querying of the data, as well as querying the data statistics of the current day and past days.
**Application Scenarios**

- Call the **insert **method to save fitness and health data on the Health platform.
- Call the **delete **method to remove fitness and health data from the Health platform.
- Call the **update** method to update fitness and health data on the Health platform.
- Call the **read** method to obtain fitness and health data from the Health platform.
- Call **readTodaySummation** to read the accumulated fitness and health data of the current day (from 00:00 in the system time zone of the device to the current time) from the Health platform.
- Call **readDailySummation** to read the accumulated health and fitness data of multiple days from the Health platform.
- Call **clearAll** to delete all device-side and cloud-side data inserted by the app from the Health platform.

#### ActivityRecordsController

**Overview**

**ActivityRecordsController **is used to mark daily workout behaviors. For example, use **ActivityRecords** to mark a period of time for a specific workout, such as running that has planned from 08:00 to 09:00.

**Application Scenarios**

- Call **addActivityRecord** to add historical activity records to the Health platform.
- Call **getActivityRecord **to read historical activity records from the Health platform.
- Call **beginActivityRecord** to start an activity record.
- Calls **endActivityRecord** to end an activity record.

#### AutoRecorderController

**Overview**

**AutoRecorderController** is used to read sensor data in real time (such as real-time step count).

**Application Scenarios**

- Starts real-time data reading by calling **startRecord**.
- Stops real-time data reading by calling **stopRecord**.
