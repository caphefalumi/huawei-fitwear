<!--
  Title: Training Status
  Catalog: HMSCore-Guides-V5
  Document ID: ts-0000001050147085-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ts-0000001050147085-V5
-->
# Training Status

The Training Status characteristic indicates the current working status of the fitness machine.

| **Parameter** | **Format** | **Value** | **Description** |
| --- | --- | --- | --- |
| Flags | Bit0 | 1 | Indicates if the Training Status parameter exists. |
| Bit1 | 0 | Indicates if the Training Status String parameter exists. |  |
| Bit2-7 | 0 | Reserved |  |
| Training status | Unit8 | 0x00 | Other |
| 0x01 | Idle |  |  |
| 0x0D | Running |  |  |
| 0x0E | Pre-workout (second counting before the workout starts) |  |  |
| 0x0F | Post-workout (second counting after the workout stops) |  |  |
| 0x10-0xFF | Reserved |  |  |
| Training Status String | Octet | - | Not required |
