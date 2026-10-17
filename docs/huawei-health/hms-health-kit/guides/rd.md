<!--
  Title: Rower Data
  Catalog: HMSCore-Guides-V5
  Document ID: rd-0000001050725868-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/rd-0000001050725868-V5
-->
# Rower Data

The Rower Data characteristic is used by the rower to send real-time fitness data to the app. The data format is as follows, which consists of one Flag and multiple parameters. The number of parameters is determined by the value of the Flags field.

The length of the Flags field is 2 octets. The meaning of each bit is as follows:

| **bit** | **Definition (0: Not 1: Present)** | **Value** |
| --- | --- | --- |
| 0 | More Data | Set the bits depending on the device capabilities. |
| 1 | Average Stroke |  |
| 2 | Total Distance |  |
| 3 | Instantaneous Pace |  |
| 4 | Average Pace |  |
| 5 | Instantaneous Power |  |
| 6 | Average Power |  |
| 7 | Resistance Level |  |
| 8 | Expended Energy |  |
| 9 | Heart Rate |  |
| 10 | Metabolic Equivalent |  |
| 11 | Elapsed Time |  |
| 12 | Remaining Time |  |

The following describes the parameters following the Flags field.

| **Parameter** | **Format** | **Unit** |
| --- | --- | --- |
| Stroke Rate | Uint8 | 0.5 stroke/m |
| Stroke Count | uint16 | Unitless |
| Average Stroke Rate | Uint8 | 0.5 stroke/m |
| Total Distance | uint24 | metre |
| Instantaneous Pace | uint16 | Seconds(500m) |
| Average Pace | uint16 | Seconds(500m) |
| Instantaneous Power | sint16 | watt |
| Average Power | sint16 | watt |
| Resistance Level | sint16 | Unitless |
| Total Energy | uint16 | kcal |
| Energy Per Hour | uint16 | kcal |
| Energy Per Minute | uint8 | kcal |
| Heart Rate | uint8 | Beats/m |
| Metabolic Equivalent | uint8 | 0.1 meta |
| Elapsed Time | uint16 | second |
| Remaining Time | uint16 | second |
| Heart Rate | uint8 | Beats/m |
| Metabolic Equivalent | uint8 | 0.1 meta |
| Elapsed Time | uint16 | second |
| Remaining Time | uint16 | second |
