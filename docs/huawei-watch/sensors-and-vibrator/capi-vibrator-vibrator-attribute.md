<!--
  Title: Vibrator_Attribute
  Catalog: harmonyos-references
  Document ID: capi-vibrator-vibrator-attribute
  Updated: 2026-10-14 09:43:45
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-vibrator-vibrator-attribute
-->
# Vibrator_Attribute

```cpp
typedef struct Vibrator_Attribute { ... } Vibrator_Attribute
```

#### Overview

The **Vibrator_Attribute** struct is used to describe the attributes of the vibrator. You can use this struct to specify the vibrator ID and vibration scenario. For details about the application scenarios and implementation mechanism, see the [Vibrator](https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-vibrator) module documentation.

**Since**: 11

**Related module**: [Vibrator](https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-vibrator)

**Header file**: [vibrator_type.h](https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-vibrator-type-h)

#### Summary

## Member Variables

| Name | Description |
| --- | --- |
| int32_t vibratorId | Vibrator ID. Its value is obtained through the system API. This is the ID of the vibrator to be operated. Different IDs correspond to different vibrators on the device. The value range is [0, Maximum number of supported vibrators – 1]. |
| [Vibrator_Usage](https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-vibrator-type-h#vibrator_usage) usage | Vibration scenario. This parameter specifies the application scenario of the vibrator. Different scenarios correspond to different vibration modes. For example, notifications, buttons, and alarm clocks have their own vibration effects. For details about the options, see the **Vibrator_Usage** enumeration. |
