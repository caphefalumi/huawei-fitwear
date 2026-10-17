<!--
  Title: DataCollector.Builder
  Catalog: HMSCore-References-V5
  Document ID: datacollector_builder-0000001050162310-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollector_builder-0000001050162310-V5
-->
# DataCollector.Builder

| Class Info |
| --- |
| public static class Builder Constructs a builder for **DataCollector**. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Builder](#EN-US_TOPIC_0000001053367046__section1707425339)() No-argument constructor for the builder. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| DataCollector | [build](#EN-US_TOPIC_0000001053367046__section12711738942)() Builds the data collector object. |
| Builder | [setDataCollectorName](#EN-US_TOPIC_0000001053367046__section14485171717285)(String dataCollectorName) Sets the name of the data collector. The input parameter can be **null** or a string of 1 to 300 characters. |
| Builder | [setDataGenerateType](#EN-US_TOPIC_0000001053367046__section1990611316152)(int dataGenerateType) Sets the type of the data collector, such as raw and derived. |
| Builder | [setDataStreamName](#EN-US_TOPIC_0000001053367046__section7491217142815)(String dataStreamName) Sets the name of the data stream. The input parameter can be empty or a string of 1 to 300 characters. |
| Builder | [setDataType](#EN-US_TOPIC_0000001053367046__section155754267164)(DataType dataType) Sets the data type. |
| Builder | [setDeviceId](#EN-US_TOPIC_0000001053367046__section0390101881718)(String deviceId) Sets the device ID. |
| Builder | [setDeviceInfo](#EN-US_TOPIC_0000001053367046__section136788311814)(DeviceInfo deviceInfo) Sets the device information. |
| Builder | [setLocalized](#EN-US_TOPIC_0000001053367046__section1084364131814)(boolean isLocal) Sets whether the data collector is originated from the local device. The default value is false (non-local device). |
| Builder | [setPackageName](#EN-US_TOPIC_0000001053367046__section76907207199)(Context context) Sets the package name of the app based on the context. |
| Builder | [setPackageName](#EN-US_TOPIC_0000001053367046__section14977172283)(String packageName) Sets the package name of the app. The input parameter can be an empty string or a string of 1 to 300 characters. |

#### Public Constructors

## Builder()

| Constructor |
| --- |
| public Builder() Constructs a builder for **DataCollector**. |

#### Public Methods

## build()

| Method |
| --- |
| public DataCollector build() Builds the data collector object. |

**Returns**

| Type | Description |
| --- | --- |
| DataCollector | Data collector. |

## setDataCollectorName(String dataCollectorName)

| Method |
| --- |
| public Builder setDataCollectorName(String dataCollectorName) Sets the name of the data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataCollectorName | Name of the data collector. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setDataGenerateType(int dataGenerateType)

| Method |
| --- |
| public Builder setDataGenerateType(int dataGenerateType) Sets the type of the data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataGenerateType | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setDataStreamName(String dataStreamName)

| Method |
| --- |
| public Builder setDataStreamName(String dataStreamName) Sets the name of the data stream. |

**Parameters**

| Name | Description |
| --- | --- |
| dataStreamName | Name of the data stream. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setDataType(DataType dataType)

| Method |
| --- |
| public Builder setDataType(DataType dataType) Sets the data type of the data collector. |

**Parameters**

| Name | Description |
| --- | --- |
| dataType | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setDeviceId(String deviceId)

| Method |
| --- |
| public Builder setDeviceId(String deviceId) Sets the device ID. |

**Parameters**

| Name | Description |
| --- | --- |
| deviceId | Device ID. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setDeviceInfo(DeviceInfo deviceInfo)

| Method |
| --- |
| public Builder setDeviceInfo(DeviceInfo deviceInfo) Sets the device information. |

**Parameters**

| Name | Description |
| --- | --- |
| deviceInfo | Device information. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setLocalized(boolean isLocal)

| Method |
| --- |
| public Builder setLocalized(boolean isLocal) Sets whether the data collector is originated from the local device. The default value is false (indicating that a non-local device). |

**Parameters**

| Name | Description |
| --- | --- |
| isLocal | Indicates whether the data collector is originated from the local device. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setPackageName(Context context)

| Method |
| --- |
| public Builder setPackageName(Context context) Sets the package name of the app based on the context. |

**Parameters**

| Name | Description |
| --- | --- |
| context | Context. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |

## setPackageName(String packageName)

| Method |
| --- |
| public Builder setPackageName(String packageName) Sets the package name of the app. |

**Parameters**

| Name | Description |
| --- | --- |
| packageName | Package name of the app. |

**Returns**

| Type | Description |
| --- | --- |
| Builder | Builder. |
