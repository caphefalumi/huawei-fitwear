<!--
  Title: DataCollector
  Catalog: HMSCore-References-V5
  Document ID: datacollector_class-0000001050164265-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollector_class-0000001050164265-V5
-->
# DataCollector

| Class Info |
| --- |
| public class DataCollector implements SafeParcelable Defines a unique data collector, which provides the raw data collected from a phone or external device. Data from multiple data collectors can be converted or combined and therefore becomes derived data. Each sampling point must have a corresponding data collector. You can query data whenever they want or obtain data at a fixed interval by registering a listener. When a data collector is created, a unique identifier will be generated for it. The identifier consists of the data collector type, device information, package name of the app, and more. |

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [DataCollector.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollector_builder-0000001050162310-V5) Builder for **DataCollector**. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final int | [DATA_TYPE_INIT](#EN-US_TOPIC_0000001053847026__section1245971722811) Initial data type. (A default initial value has been assigned. You need to set the value as needed.) |
| static final int | [DATA_TYPE_RAW](#EN-US_TOPIC_0000001053847026__section1746111782815) Raw data type. |
| static final int | [DATA_TYPE_DERIVED](#EN-US_TOPIC_0000001053847026__section6457111719288) Derived data type. |
| static final int | [DATA_TYPE_CLEAN](#EN-US_TOPIC_0000001053847026__section345231712820) Clean data type. |
| static final int | [DATA_TYPE_CONVERTED](#EN-US_TOPIC_0000001053847026__section245491712815) Converted data type. |
| static final int | [DATA_TYPE_MERGED](#EN-US_TOPIC_0000001053847026__section12365191717520) Merged data type. |
| static final int | [DATA_TYPE_POLYMERIZED](#EN-US_TOPIC_0000001053847026__section1344817181459) Grouped data type. |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_ESH2002](#EN-US_TOPIC_0000001053847026__section13478161710281) Quality standard for blood pressure monitoring: ESH (2002). |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_ESH2010](#EN-US_TOPIC_0000001053847026__section04801117132814) Quality standard for blood pressure monitoring: ESH (2010). |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_AAMI](#EN-US_TOPIC_0000001053847026__section18469017182812) Quality standard for blood pressure monitoring: AAMI. |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_A_A](#EN-US_TOPIC_0000001053847026__section1647111177282) Quality standard for blood pressure monitoring: BHS (A/A). |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_A_B](#EN-US_TOPIC_0000001053847026__section2047251717288) Quality standard for blood pressure monitoring: BHS (A/B). |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_B_A](#EN-US_TOPIC_0000001053847026__section1547417173289) Quality standard for blood pressure monitoring: BHS (B/A). |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_B_B](#EN-US_TOPIC_0000001053847026__section747691742818) Quality standard for blood pressure monitoring: BHS (B/B). |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_GLUCOSE_ISO151972003](#EN-US_TOPIC_0000001053847026__section64651174285) Quality standard for blood pressure monitoring: ISO 15197:2003. |
| static final int | [HEALTH_DATA_QUALITY_BLOOD_GLUCOSE_ISO151972013](#EN-US_TOPIC_0000001053847026__section746731711289) Quality standard for blood pressure monitoring: ISO 15197:2013. |
| static final String | [EXTRA_DATA_SOURCE](#EN-US_TOPIC_0000001053847026__section8463117122811) Other data collectors. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [getDataCollectorName](#EN-US_TOPIC_0000001053847026__section20600164665219)() Obtains the name of the data collector. |
| int | [getDataGenerateType](#EN-US_TOPIC_0000001053847026__section14343350205319)() Obtains the type of the data collector. |
| String | [getDataStreamId](#EN-US_TOPIC_0000001053847026__section1880142311559)() Obtains the unique identifier of the data collector. |
| String | [getDataStreamName](#EN-US_TOPIC_0000001053847026__section16816161645618)() Obtains the name of the data stream. |
| DataType | [getDataType](#EN-US_TOPIC_0000001053847026__section7990170195719)() Obtains the data type. |
| String | [getDeviceId](#EN-US_TOPIC_0000001053847026__section825217587579)() Obtains the identifier of the device. |
| DeviceInfo | [getDeviceInfo](#EN-US_TOPIC_0000001053847026__section122311547583)() Obtains the device information. |
| String | [getPackageName](#EN-US_TOPIC_0000001053847026__section76025575116)() Obtains the package name of the app. |
| static String | [getStandardByType](#EN-US_TOPIC_0000001053847026__section854215172281)(int type) Obtains the standard type. |
| boolean | [isLocalized](#EN-US_TOPIC_0000001053847026__section76560241317)() Checks whether the data collector is originated from the local device. |

#### Public Fields

## DATA_TYPE_CLEAN

| Field |
| --- |
| public static final int DATA_TYPE_CLEAN Clean data type. Constant value: **2** |

## DATA_TYPE_CONVERTED

| Field |
| --- |
| public static final int DATA_TYPE_CONVERTED Converted data type. Constant value: **3** |

## DATA_TYPE_MERGED

| Field |
| --- |
| public static final int DATA_TYPE_MERGED Merged data type. Constant value: **4** |

## DATA_TYPE_POLYMERIZED

| Field |
| --- |
| public static final int DATA_TYPE_POLYMERIZED Grouped data type. Constant value: **5** |

## DATA_TYPE_DERIVED

| Field |
| --- |
| public static final int DATA_TYPE_DERIVED Derived data type. Constant value: **1** |

## DATA_TYPE_INIT

| Field |
| --- |
| public static final int DATA_TYPE_INIT Initial data type. (A default initial value has been assigned. You need to set the value as needed.) Constant value: **-1** |

## DATA_TYPE_RAW

| Field |
| --- |
| public static final int DATA_TYPE_RAW Raw data type. Constant value: **0** |

## EXTRA_DATA_SOURCE

| Field |
| --- |
| public static final String EXTRA_DATA_SOURCE Other data collectors. Constant value: **vnd.huawei.hihealth.data_collector** |

## HEALTH_DATA_QUALITY_BLOOD_GLUCOSE_ISO151972003

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_GLUCOSE_ISO151972003 Quality standard for blood glucose monitoring: ISO 15197:2003. Constant value: **8** |

## HEALTH_DATA_QUALITY_BLOOD_GLUCOSE_ISO151972013

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_GLUCOSE_ISO151972013 Quality standard for blood pressure monitoring: ISO 15197:2013. Constant value: **9** |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_AAMI

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_AAMI Quality standard for blood pressure monitoring: AAMI. Constant value: **3** |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_A_A

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_A_A Quality standard for blood pressure monitoring: BHS (A/A). Constant value: 4 |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_A_B

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_A_B Quality standard for blood pressure monitoring: BHS (A/B). Constant value: **5** |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_B_A

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_B_A Quality standard for blood pressure monitoring: BHS (B/A). Constant value: **6** |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_B_B

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_BHS_B_B Quality standard for blood pressure monitoring: BHS (B/B). Constant value: **7** |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_ESH2002

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_ESH2002 Quality standard for blood pressure monitoring: ESH (2002). Constant value: **1** |

## HEALTH_DATA_QUALITY_BLOOD_PRESSURE_ESH2010

| Field |
| --- |
| public static final int HEALTH_DATA_QUALITY_BLOOD_PRESSURE_ESH2010 Quality standard for blood pressure monitoring: ESH (2010). Constant value: **2** |

#### Public Methods

## getDataCollectorName()

| Method |
| --- |
| public String getDataCollectorName() Obtains the name of the data collector. |

**Returns**

| Type | Description |
| --- | --- |
| String | Name of the data collector. |

## getDataGenerateType()

| Method |
| --- |
| public int getDataGenerateType() Obtains the type of the data collector. |

**Returns**

| Type | Description |
| --- | --- |
| int | Type of the data collector. |

## getDataStreamId()

| Method |
| --- |
| public String getDataStreamId() Obtains the unique identifier of the data collector. |

**Returns**

| Type | Description |
| --- | --- |
| String | Unique identifier of the data collector. |

## getDataStreamName()

| Method |
| --- |
| public String getDataStreamName() Obtains the name of the data stream. |

**Returns**

| Type | Description |
| --- | --- |
| String | Name of the data stream. |

## getDataType()

| Method |
| --- |
| public DataType getDataType() Obtains the data type. |

**Returns**

| Type | Description |
| --- | --- |
| DataType | Data type. |

## getDeviceId()

| Method |
| --- |
| public String getDeviceId() Obtains the identifier of the device. |

**Returns**

| Type | Description |
| --- | --- |
| String | Identifier of the device. |

## getDeviceInfo()

| Method |
| --- |
| public DeviceInfo getDeviceInfo() Obtains the device information. |

**Returns**

| Type | Description |
| --- | --- |
| DeviceInfo | Device information. |

## getPackageName()

| Method |
| --- |
| public String getPackageName() Obtains the package name of the app. |

**Returns**

| Type | Description |
| --- | --- |
| String | Package name of the app. |

## getStandardByType(int type)

| Method |
| --- |
| public static String getStandardByType(int type) Obtains the standard type. |

**Parameters**

| Name | Description |
| --- | --- |
| type | Data type. |

**Returns**

| Type | Description |
| --- | --- |
| String | Standard type. |

## isLocalized()

| Method |
| --- |
| public boolean isLocalized() Checks whether the data collector is originated from the local device. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether the data collector is originated from the local device. |
