<!--
  Title: Huawei-defined Parameters in Advertising Packets
  Catalog: HMSCore-Guides-V5
  Document ID: ad-type-0000001054877484-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ad-type-0000001054877484-V5
-->
# Huawei-defined Parameters in Advertising Packets

When AD Type is 0xFF, it indicates the advertising parameters are manufacturer-defined. The following advertising parameters indicate fitness machines that comply with HiHeath Kit specifications and can be identified by the HUAWEI Health app while scanning.

| 1 byte | 1 byte | 2 bytes | n bytes |
| --- | --- | --- | --- |
| Length | AD Type | Vendor ID | Type-Len-Value (Len and Value are optional.) |

- AD Type = 0xFF
- Vendor ID = 0x7D02
- Type = 0x01
- Len = N/A (Value of **0x01** is of a fixed length.)
- Value = 0x05 0x00 0xFF 0xFF
