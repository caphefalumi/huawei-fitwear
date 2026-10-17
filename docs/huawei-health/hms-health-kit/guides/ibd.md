<!--
  Title: Indoor Bike Data
  Catalog: HMSCore-Guides-V5
  Document ID: ibd-0000001051005923-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ibd-0000001051005923-V5
-->
# Indoor Bike Data

The Indoor Bike Data characteristic is used by the indoor bike to send real-time fitness data to the app. The data format is as follows, which consists of one Flag and multiple parameters. The number of parameters is determined by the value of the Flags field.

The length of the Flags field is 2 octets. The meaning of each bit is as follows:

| **bit** | **Definition (0: Not 1: Present)** | **Value** |
| --- | --- | --- |
| 0 | More Data | Set the bits depending on the fitness machine capabilities. Bit 0 must be 0. Bit 2, bit 7, and bit 10 must be **1** (they are mandatory workout parameters). For treadmill supporting the inclination feature, bit 3 and bit 4 must be present. |
| 1 | Average Speed |  |
| 2 | Instantaneous Cadence |  |
| 3 | Average Cadence |  |
| 4 | Total Distance |  |
| 5 | Resistance Level |  |
| 6 | Instantaneous Power |  |
| 7 | Average Power |  |
| 8 | Expended Energy |  |
| 9 | Heart Rate |  |
| 10 | Metabolic Equivalent |  |
| 11 | Elapsed Time |  |
| 12 | Remaining Time |  |

The following describes the parameters following the Flags field.

| **Parameter** | **Format** | **Unit** |
| --- | --- | --- |
| Instantaneous Speed | uint16 | 0.01 Km/h |
| Average Speed | uint16 | 0.01 Km/h |
| Instantaneous Cadence | uint16 | 0.5 /min |
| Average Cadence | uint16 | 0.5 /min |
| Total Distance | uint24 | metre |
| Resistance Level | Sin16 | 1 unitless |
| Instantaneous Power | sint16 | 1 watt |
| Average Power | sint16 | 1 watt |
| Total Energy | uint16 | kcal |
| Energy Per Hour | uint16 | kcal |
| Energy Per Minute | uint8 | kcal |
| Heart Rate | uint8 | Beats/m |
| Metabolic Equivalent | uint8 | 0.1 meta |
| Elapsed Time | uint16 | second |
| Remaining Time | uint16 | second |
