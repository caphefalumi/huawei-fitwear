<!--
  Title: Treadmill Data
  Catalog: HMSCore-Guides-V5
  Document ID: td-0000001050147077-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/td-0000001050147077-V5
-->
# Treadmill Data

The Treadmill Data characteristic is used by the treadmill and walking pad to send real-time fitness data to the app. The data format is as follows, which consists of one Flag and multiple parameters. The number of parameters is determined by the value of the Flags field.

The length of the Flags field is 2 octets. The meaning of each bit is as follows:

| **bit** | **Definition (0: Not 1: Present)** | **Value** |
| --- | --- | --- |
| 0 | More Data | Set the bits depending on the fitness machine capabilities. Bit 0 must be 0. Bit 2, bit 7, and bit 10 must be **1** (they are mandatory workout parameters). For treadmill supporting the inclination feature, bit 3 and bit 4 must be present. |
| 1 | Average Speed |  |
| 2 | Total Distance |  |
| 3 | Inclination and Ramp Angle Setting |  |
| 4 | Elevation Gain |  |
| 5 | Instantaneous Pace |  |
| 6 | Average Pace |  |
| 7 | Expended Energy |  |
| 8 | Heart Rate |  |
| 9 | Metabolic Equivalent |  |
| 10 | Elapsed Time |  |
| 11 | Remaining Time |  |
| 12 | Force on Belt and Power Output |  |

The following describes the parameters following the Flags field.

| **Parameter** | **Format** | **Unit** | **Requirement** |
| --- | --- | --- | --- |
| Instantaneous Speed | uint16 | 0.01 Km/h | M |
| Average Speed | uint16 | 0.01 Km/h | O |
| Total Distance | uint24 | metre | M |
| Inclination | sint16 | 0.1 percent | O |
| Ramp Angle Setting | sint16 | 0.1 degree | O |
| Positive Elevation Gain | uint16 | 0.1 Metre | O |
| Negative Elevation Gain | uint16 | 0.1 metre | O |
| Instantaneous Pace | uint8 | 0.1 Km/m | O |
| Average Pace | uint8 | 0.1 Km/m | O |
| Total Energy | uint16 | kcal | M |
| Energy Per Hour | uint16 | kcal | O |
| Energy Per Minute | uint8 | kcal | O |
| Heart Rate | uint8 | Beats/m | O |
| Metabolic Equivalent | uint8 | 0.1 meta | O |
| Elapsed Time | uint16 | second | M |
| Remaining Time | uint16 | second | O |
| Force on Belt | sint16 | newton | O |
| Power Output | sint16 | Watts | O |
