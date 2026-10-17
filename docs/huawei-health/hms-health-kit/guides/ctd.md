<!--
  Title: Cross Trainer Data
  Catalog: HMSCore-Guides-V5
  Document ID: ctd-0000001050765901-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ctd-0000001050765901-V5
-->
# Cross Trainer Data

The Cross Trainer Data characteristic is used by the cross trainer to send real-time fitness data to the app. The data format is as follows, which consists of one Flag and multiple parameters. The number of parameters is determined by the value of the Flags field.

The length of the Flags field is 2 octets. The meaning of each bit is as follows:

| bit | Definition (0: Not 1: Present) | Value |
| --- | --- | --- |
| 0 | More Data | Set the bits depending on the device capabilities. |
| 1 | Average Speed |  |
| 2 | Total Distance |  |
| 3 | Step Count |  |
| 4 | Stride Count |  |
| 5 | Elevation Gain |  |
| 6 | Inclination and Ramp Angle Setting |  |
| 7 | Resistance Level |  |
| 8 | Instantaneous Power |  |
| 9 | Average Power |  |
| 10 | Expended Energy |  |
| 11 | Heart Rate |  |
| 12 | Metabolic Equivalent |  |
| 13 | Elapsed Time |  |
| 14 | Remaining Time |  |
| 15 | Movement Direction |  |

The following describes the parameters following the Flags field.

| **Parameter** | **Format** | **Unit** |
| --- | --- | --- |
| Instantaneous Speed | uint16 | 0.01 Km/h |
| Average Speed | uint16 | 0.01 Km/h |
| Total Distance | uint24 | metre |
| Step Per Minute | uint16 | step_per_minute |
| Average Step Rate | uint16 | step_per_minute |
| Stride Count | uint16 | Unitless |
| Inclination | sint16 | 0.1 percent |
| Ramp Angle Setting | sint16 | 0.1 degree |
| Positive Elevation Gain | uint16 | 1 Metre |
| Negative Elevation Gain | uint16 | 1 metre |
| Resistance Level | sint16 | 0.1 unitless |
| Instantaneous Power | sint16 | Watt |
| Average Power | sint16 | Watt |
| Total Energy | uint16 | kcal |
| Energy Per Hour | uint16 | kcal |
| Energy Per Minute | uint8 | kcal |
| Heart Rate | uint8 | Beats/m |
| Metabolic Equivalent | uint8 | 0.1 meta |
| Elapsed Time | uint16 | second |
| Remaining Time | uint16 | second |
