<!--
  Title: Sensor_SubscriptionId
  Catalog: harmonyos-references
  Document ID: capi-sensor-sensor-subscriptionid
  Updated: 2026-10-14 09:43:35
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-sensor-sensor-subscriptionid
-->
# Sensor_SubscriptionId

```cpp
typedef struct Sensor_SubscriptionId Sensor_SubscriptionId
```

#### Overview

Defines a struct for the sensor subscription ID, which uniquely identifies a sensor subscription. This struct is used to identify a sensor subscription, including the sensor type and subscription conditions. You can use the sensor subscription ID to manage the lifecycle of a sensor subscription, including activating, deactivating, and querying the subscription status.

When subscribing to sensor data, the sensor subscription ID is used as a parameter in the subscription request to identify the subscription relationship. When querying the subscribed sensor information, the sensor subscription ID is used to obtain the corresponding subscription status and data. When canceling a sensor subscription, the sensor subscription ID is used to specify the subscription to be canceled.

**Since**: 11

**Related module**: [Sensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-sensor)

**Header file**: [oh_sensor_type.h](https://developer.huawei.com/consumer/en/doc/harmonyos-references/capi-oh-sensor-type-h)
