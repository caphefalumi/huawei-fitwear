<!--
  Title: Sensor Error Codes
  Catalog: harmonyos-references
  Document ID: errorcode-sensor
  Updated: 2026-10-14 09:42:03
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-sensor
-->
# Sensor Error Codes

> **Note:** This topic describes only module-specific error codes. For details about universal error codes, see [Universal Error Codes](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-universal).

#### 14500101 Service Exception

**Error Message**

Service exception.Possible causes:1. Sensor hdf service exception;2. Sensor service ipc exception;3. Sensor data channel exception.

**Description**

This error code is reported if the HDI service is abnormal when the **on**, **once**, or **off** API of the sensor module is called. This error code indicates that the sensor service is unavailable and the server cannot respond to sensor-related operation requests.

**Possible Causes**

The HDI service is abnormal and cannot respond to requests.

**Solution**

- Retry the operation at a specified interval (1s is recommended) or at an exponential increase interval.
- If the operation fails for three consecutive times, stop the retry. You can also attempt to obtain the sensor list to check for device availability.

#### 14500102 Sensor Not Supported by the Device

**Error Message**

The sensor is not supported by the device.

**Description**

This error code is reported when the [getSingleSensor](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-sensor#sensorgetsinglesensor9) API is called but the device does not support the sensor, causing failure to obtain the sensor information. This error code indicates that the requested sensor type does not exist or is not supported by the device.

**Possible Causes**

The device does not support the sensor because the underlying components are not adaptable to the sensor.

**Solution**

If error code 14500102 is returned, the device does not support the sensor. Check whether the device supports the sensor type, or use the [getSensorList](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-sensor#sensorgetsensorlist9) API to obtain the list of sensors supported by the device and select a sensor type supported by the device.
