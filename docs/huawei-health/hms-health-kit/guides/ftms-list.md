<!--
  Title: FTMS Characteristics
  Catalog: HMSCore-Guides-V5
  Document ID: ftms-list-0000001055208574-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ftms-list-0000001055208574-V5
-->
# FTMS Characteristics

| Characteristics | Properties | UUID | Device Type | Description |
| --- | --- | --- | --- | --- |
| [Fitness Machine Feature](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/fmf-0000001050145124-V5) | Read | 0x2ACC | Treadmill, walking pad, cross trainer, rower, and indoor bike. | Describes the capabilities supported by the device. |
| [Treadmill Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/td-0000001050147077-V5) | Notify | 0x2ACD | Treadmill and walking pad only. | Reports real-time workout data. |
| [Cross Trainer Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ctd-0000001050765901-V5) | Notify | 0x2ACE | Cross trainer only. | Reports real-time workout data. |
| [Rower Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/rd-0000001050725868-V5) | Notify | 0x2AD1 | Rower only. | Reports real-time workout data. |
| [Indoor Bike Data](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ibd-0000001051005923-V5) | Notify | 0x2AD2 | Indoor bike only. | Reports real-time workout data. |
| [Training Status](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ts-0000001050147085-V5) | Read/Notify | 0x2AD3 | Treadmill, walking pad, cross trainer, rower, and indoor bike. | Reports the device status data. |
| [Supported Speed Range](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/ssr-0000001050145136-V5) | Read | 0x2AD4 | Treadmill, walking pad, and indoor bike. | Reports the supported speed range. |
| [Supported Inclination Range](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/sir-0000001050147087-V5) | Read | 0x2AD5 | Treadmill and walking pad. | Reports the supported inclination range. |
| [Supported Resistance Level Range](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/srlr-0000001051085842-V5) | Read | 0x2AD6 | Cross trainer. | Reports the supported resistance level range. |
| [Supported Power Range](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/spr-0000001050765945-V5) | Read | 0x2AD8 | Cross trainer, rower, and indoor bike. | Reports the supported power range. |
| [Supported Heart Rate Range](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/shrr-0000001050145138-V5) | Read | 0x2AD7 | Treadmill, walking pad, cross trainer, rower, and indoor bike. | Reports supported heart rate range. |
| [Fitness Machine Control Point](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/fmcp-0000001050147089-V5) | Write, Indicate | 0x2AD9 | Optional support for treadmills and walking pads. Mandatory for cross trainers, rowers, and indoor bikes. | Controls the status (paused or resumed) of fitness machine. |
| [Fitness Machine Status](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/fms-0000001050145140-V5) | Notify | 0x2ADA | Treadmill, walking pad, cross trainer, rower, and indoor bike. | Reports workout status changes of the fitness machine. |
