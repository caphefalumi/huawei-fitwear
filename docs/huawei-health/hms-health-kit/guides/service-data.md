<!--
  Title: Service Data AD Type of Advertising Packets
  Catalog: HMSCore-Guides-V5
  Document ID: service-data-0000001055196076-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/service-data-0000001055196076-V5
-->
# Service Data AD Type of Advertising Packets

| **Field** | **Data Type** | Size | **Description** |
| --- | --- | --- | --- |
| Service Data AD Type | Uint8 | 1 | - |
| Fitness Machine Service UUID | Uint16 | 2 | - |
| Flags | Bit0 | - | Fitness Machine Available: 0: False 1: True |
| Bit1-7 | - | Reserved |  |
| Fitness Machine Type | Bit0 | Depending on the device capabilities. | Treadmill Supported |
| Bit1 | Cross Trainer Supported |  |  |
| Bit2 | Step Climber Supported |  |  |
| Bit3 | Stair Climber Supported |  |  |
| Bit4 | Rower Supported |  |  |
| Bit5 | Indoor Bike Supported |  |  |
| Bit6-15 | Reserved |  |  |
