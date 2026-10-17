<!--
  Title: Huawei Extension FTMS Characteristics
  Catalog: HMSCore-Guides-V5
  Document ID: extension-data-0000001050145332-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/extension-data-0000001050145332-V5
-->
# Huawei Extension FTMS Characteristics

| **Characteristic Value** | **Property** | **UUID** | **Description** |
| --- | --- | --- | --- |
| Fitness Extension Data | write | d18d2c10-c44c-11e8-a355-529269fb1459 | Extension FTMS characteristics: • Used as a Bluetooth control channel to unlock the treadmill. Only after the treadmill is unlocked, the app can request the control of a fitness machine via the Fitness Machine Control Point procedure. (Cross trainers, rowers, indoor bikes, and walking pads do not support unlock codes). • Used to transfer the heart rate, step count, and calories burnt to a fitness machine (treadmill, cross trainer, rower, indoor bike, or walking pad) once every second. |

The Huawei extension FMTS characteristics are used to:

- Unlock the control function of the fitness machine. For security purposes, a Bluetooth device is not allowed to control the status of a fitness machine when unlocked, such as to start or stop it, or adjust its speed or inclination level.
- Send the real-time heart rate, step count, and calories burnt data of the phone to the fitness machine for synced display.

| **Parameter** | **Format** | **Size** | **Value** | **Description** |
| --- | --- | --- | --- | --- |
| Flags | 16bits | 2octets | Bit0 | The parameter includes the unlock code. |
| Bit1 | The parameter includes the heart rate. |  |  |  |
| Bit2 | The parameter includes the total calories. |  |  |  |
| Bit3 | The parameter contains the dynamic calories. |  |  |  |
| Bit4 | The parameter contains the step count. |  |  |  |
| Bit5-15 | Reserved. |  |  |  |
| UnlockCode | Octets | 6 | A manufacturer-defined 6-octet unlock code. | This parameter is defined by the manufacturer. The value is a 6-octet unlock code, consisting of six digits ranging from 0 to F. |
| Heart Rate | Unit8 | 1 | Heart rate value | Heart rate value. |
| Total Energy | Unit16 | 2 | Total calories | Total calories. |
| Dynamic Energy | Unit16 | 2 | Dynamic calories | Dynamic calories. |
| Step Count | Unit16 | 2 | Real-time step count | Real-time step count. |
