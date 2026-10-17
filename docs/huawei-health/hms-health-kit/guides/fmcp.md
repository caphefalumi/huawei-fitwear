<!--
  Title: Fitness Machine Control Point
  Catalog: HMSCore-Guides-V5
  Document ID: fmcp-0000001050147089-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/fmcp-0000001050147089-V5
-->
# Fitness Machine Control Point

The Fitness Machine Control Point characteristic is used to control the device status.

| **Parameter** | **Format** | **Size** |
| --- | --- | --- |
| Op Code | Uint8 | 1 octet |
| Parameter | Variable | 0 to 18 octets |

The Parameter value depends on the Op Code value.

| **Op Code** | **Requirement** | **Definition** | **Parameter** |
| --- | --- | --- | --- |
| 0x00 | Mandatory | Request Control | N/A |
| 0x01 | Mandatory | Reset: | N/A |
| 0x02 | Optional | Set target speed | Target Speed, uint16, 0.01 km/h |
| 0x03 | Optional | Set target inclination | Target Inclination, SINT16, 0.1 percent |
| 0x04 | Optional | Set Target Resistance Level | Target Resistance Level, UINT8, 0.1 unitless |
| 0x05 | Optional | Set Target Power | Target Power, SINT16,Watt |
| 0x07 | Mandatory | Start or resume | N/A |
| 0x08 | Mandatory | Stop or pause | Control Information; 01:stop;02:Pause;Other:RFU |
| 0x80 | Mandatory | Response Code | - |

When the phone request the control of a fitness machine, the fitness machine needs to respond with 0x80. The corresponding response format is as follows:

| **Parameter** | **Format** | **Size** | **Value** | **Description** |
| --- | --- | --- | --- | --- |
| Response Code | Uint8 | 1 | 0x80 | Corresponding value. |
| Request Code | Uint8 | 1 | Request Op Code | Request code for which the response is made. |
| Result Code | Unit8 | 1 | 00 | Reserved. |
| 01 | Succeeded. |  |  |  |
| 02 | Not supported. |  |  |  |
| 03 | Incorrect parameter. |  |  |  |
| 04 | Operation failed. |  |  |  |
| 05 | Control is not allowed. |  |  |  |
| 06-FF | Reserved. |  |  |  |
| Response Parameter | Octets | 0-17 octet | Not supported. | Not supported. |
