<!--
  Title: DeviceInfo
  Catalog: HMSCore-References-V5
  Document ID: deviceinfo-0000001050091993-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/deviceinfo-0000001050091993-V5
-->
# DeviceInfo

| Class Info |
| --- |
| public class DeviceInfo implements Parcelable Device information class. The device information will be used when constructing the data collector, which includes the device manufacturer, model, device type, serial number, and platform type. When reading the data collector, call **DataCollector.getDeviceInfo()** to obtain the device information of the data collector. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final int | TYPE_PHONE Mobile phones. Constant value: **1** |
| static final int | TYPE_SCALES Smart scale. Constant value: **2** |
| static final int | TYPE_SMART_WATCH Smart watch. Constant value: **3** |
| static final int | TYPE_SMART_BAND Smart band. Constant value: **4** |
| static final int | TYPE_SMART_EARPHONE Smart earphones. Constant value: **5** |
| static final int | TYPE_BLOOD_GLUCOSE_MONITOR Blood glucose monitor. Constant value: **6** |
| static final int | TYPE_BLOOD_PRESSURE_MONITOR Blood pressure monitor. Constant value: **7** |
| static final int | TYPE_HEART_RATE_MONITOR Heart rate monitor. Constant value: **8** |
| static final int | TYPE_UNKNOWN Unknown device. Constant value: **0** |
| static final int | PLATFORM_DEFAULT Default platform. Constant value: **0** |
| static final int | PLATFORM_OTHER Platform other than the default one. Constant value: **2** |
| static final String | STR_TYPE_PHONE Presentation of the phone as a string. Constant value: **Phone** |
| static final String | STR_TYPE_SCALES Presentation of the smart scale as a string. Constant value: **Scales** |
| static final String | STR_TYPE_SMART_WATCH Presentation of the smart watch as a string. Constant value: **Smart Watch** |
| static final String | STR_TYPE_SMART_BAND Presentation of the smart band as a string. Constant value: **Smart Band** |
| static final String | STR_TYPE_SMART_EARPHONE Presentation of the smart earphones as a string. Constant value: **Smart earphone** |
| static final String | STR_TYPE_BLOOD_GLUCOSE_MONITOR Presentation of the blood glucose monitor as a string. Constant value: **Blood glucose monitor** |
| static final String | STR_TYPE_BLOOD_PRESSURE_MONITOR Presentation of the blood pressure monitor as a string. Constant value: **Blood pressure monitor** |
| static final String | STR_TYPE_HEART_RATE_MONITOR Presentation of the heart rate monitor as a string. Constant value: **Heart rate monitor** |
| static final String | STR_TYPE_UNKNOWN Presentation of the unknown device as a string. Constant value: **Unknown** |
| static final String | STR_TYPE_ERR Presentation of the error type as a string. Constant value: **error** |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [DeviceInfo](#EN-US_TOPIC_0000001053328341__section202521210102912)(String deviceManufacturer, String modelName, String uuid, int deviceType) Constructor for **DeviceInfo**. |
| [DeviceInfo](#EN-US_TOPIC_0000001053328341__section15259111014297)(String deviceManufacturer, String modelName, String uuid, int deviceType, int platformType, boolean isBleDevice) Constructor for **DeviceInfo**. |
| [DeviceInfo](#EN-US_TOPIC_0000001053328341__section1925511108296)(String deviceManufacturer, String modelName, String uuid, int deviceType, int platformType) Constructor for **DeviceInfo**. |

> **Note:** The input parameters **deviceManufacturer**, **modelName**, and **uuid** in the constructor must be a string of 1 to 300 characters.

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| final String | [getDeviceIdentifier](#EN-US_TOPIC_0000001053328341__section11548175471310)() Obtains the identifier of the device. |
| final int | [getDeviceType](#EN-US_TOPIC_0000001053328341__section227016106294)() Obtains the device type. |
| static int | [getDeviceTypeIdByString](#EN-US_TOPIC_0000001053328341__section113141038121415)(String dataType) Obtains the device type based on the data type. |
| static String | [getDeviceTypeStringById](#EN-US_TOPIC_0000001053328341__section598584681515)(int deviceType) Obtains the device type. |
| static DeviceInfo | [getLocalDevice](#EN-US_TOPIC_0000001053328341__section19609165661613)(Context context) Obtains the device information. |
| final String | [getManufacturer](#EN-US_TOPIC_0000001053328341__section16810182811194)() Obtains the manufacturer information of the device. |
| final String | [getModelName](#EN-US_TOPIC_0000001053328341__section63911915207)() Obtains the model of the device. |
| final int | [getPlatformType](#EN-US_TOPIC_0000001053328341__section122736104292)() Obtains the platform type. |
| final String | [getUuid](#EN-US_TOPIC_0000001053328341__section32355662018)() Obtains the serial number of the device. |

#### Public Constructors

## DeviceInfo(String deviceManufacturer, String modelName, String uuid, int deviceType)

| Constructor |
| --- |
| public DeviceInfo(String deviceManufacturer, String modelName, String uuid, int deviceType) Constructor for **DeviceInfo**. |

**Parameters**

| Name | Description |
| --- | --- |
| deviceManufacturer | Device manufacturer. |
| modelName | Device model. |
| uuid | Serial number of the device. |
| deviceType | Device type. |

## DeviceInfo(String deviceManufacturer, String modelName, String uuid, int deviceType, int platformType)

| Constructor |
| --- |
| public DeviceInfo(String deviceManufacturer, String modelName, String uuid, int deviceType, int platformType) Constructor for **DeviceInfo**. |

**Parameters**

| Name | Description |
| --- | --- |
| deviceManufacturer | Device manufacturer. |
| modelName | Device model. |
| uuid | Serial number of the device. |
| deviceType | Device type. |
| platformType | Platform type. |

## DeviceInfo(String deviceManufacturer, String modelName, String uuid, int deviceType, int platformType, boolean isBleDevice)

| Constructor |
| --- |
| public DeviceInfo(String deviceManufacturer, String modelName, String uuid, int deviceType, int platformType, boolean isBleDevice) Constructor for **DeviceInfo**. |

**Parameters**

| Name | Description |
| --- | --- |
| deviceManufacturer | Device manufacturer. |
| modelName | Device model. |
| uuid | Serial number of the device. |
| deviceType | Device type. |
| platformType | Platform type. |
| isBleDevice | Whether the device is a Bluetooth device. |

#### Public Methods

## getDeviceIdentifier()

| Method |
| --- |
| public final String getDeviceIdentifier() Obtains the identifier of the device. |

**Returns**

| Type | Description |
| --- | --- |
| String | Identifier of the device. |

## getDeviceType()

| Method |
| --- |
| public final int getDeviceType() Obtains the device type. |

**Returns**

| Type | Description |
| --- | --- |
| int | Device type. |

## getDeviceTypeIdByString(String dataType)

| Method |
| --- |
| public static int getDeviceTypeIdByString(String dataType) Obtains the device type. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| int | Index of the device type. |

## getDeviceTypeStringById(int deviceType)

| Method |
| --- |
| public static String getDeviceTypeStringById(int deviceType) Obtains the device type. |

**Parameters**

| Name | Description |
| --- | --- |
| deviceType | Device type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Device type as a string. |

## getLocalDevice(Context context)

| Method |
| --- |
| public static DeviceInfo getLocalDevice(Context context) Obtains the information of the current device. |

**Parameters**

| Name | Description |
| --- | --- |
| context | Context. |

**Returns**

| Type | Description |
| --- | --- |
| DeviceInfo | Information about the device. |

## getManufacturer()

| Method |
| --- |
| public final String getManufacturer() Obtains the manufacturer information of the device. |

**Returns**

| Type | Description |
| --- | --- |
| String | Manufacturer information of the device. |

## getModelName()

| Method |
| --- |
| public final String getModelName() Obtains the model of the device. |

**Returns**

| Type | Description |
| --- | --- |
| String | Device model. |

## getPlatformType()

| Method |
| --- |
| public final int getPlatformType() Obtains the platform type. |

**Returns**

| Type | Description |
| --- | --- |
| int | Platform type. |

## getUuid()

| Method |
| --- |
| public final String getUuid() Obtains the serial number of the device. |

**Returns**

| Type | Description |
| --- | --- |
| String | Serial number of the device. |
