<!--
  Title: Overall Structure of the Bluetooth Protocols
  Catalog: HMSCore-Guides-V5
  Document ID: bluetooth-protocol-0000001054490011-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/bluetooth-protocol-0000001054490011-V5
-->
**
# Overall Structure of the Bluetooth Protocols

Treadmills, walking pads, cross trainers, rowers, and indoor bikes need to be developed according to the Bluetooth protocols.

HUAWEI HiHealth Kit uses the Fitness Machine Profile (FTMP) and its extensions to provide smart experience for connected fitness machines. The following figure shows the overall structure of the Bluetooth protocols.
Figure 1 **Bluetooth profile

| Service | Short Name | UUID | Function |
| --- | --- | --- | --- |
| Fitness Machine Service | FTMS | 0x1826 | Used to synchronize the workout status and workout data of the device with the peer end. |
| Device Information Service | DIS | 0x180A | Used to read device information. |

#### Standard text download

Bluetooth specifications: [https://www.bluetooth.com/specifications/gatt/](https://www.bluetooth.com/specifications/gatt/)

Download the specifications for FTMP V1.0, FTMS V1.0, and DIS V1.1.
