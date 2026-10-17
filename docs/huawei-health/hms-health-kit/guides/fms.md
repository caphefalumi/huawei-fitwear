<!--
  Title: Fitness Machine Status
  Catalog: HMSCore-Guides-V5
  Document ID: fms-0000001050145140-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/fms-0000001050145140-V5
-->
# Fitness Machine Status

The Fitness Machine Status characteristic is used by the fitness machine to inform the phone of its status changes, such as when the user adjusts the speed or inclination settings of the machine.

The format of the Fitness Machine Status characteristic is as follows:

| **Parameter** | **Format** | **Size** |
| --- | --- | --- |
| Op Code | 8bits | 1 octet |
| Parameter | Variable | Variable |

The Fitness Machine Status Op Code and the Parameter format are as follows:

| **Op Code** | **Definition** | **Parameter** |
| --- | --- | --- |
| 0x00 | RFU | N/A |
| 0x01 | Reset | N/A |
| 0x02 | Fitness Machine Stopped or Paused by the User | Control Information: unit8 0x01:stop; 0x02:pause |
| 0x03 | Fitness Machine Stopped by Safety Key | N/A |
| 0x04 | Fitness Machine Started or Resumed by the User | N/A |
| 0x05 | Target Speed Changed | New Target Value uint16 |
| 0x06 | Target Incline Changed | New Target Value sint16 |
| 0x07 | Target Resistance Level Changed | New Target Value uint8 |
