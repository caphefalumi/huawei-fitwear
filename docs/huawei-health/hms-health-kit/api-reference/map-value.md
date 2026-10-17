<!--
  Title: MapValue
  Catalog: HMSCore-References-V5
  Document ID: map-value-0000001070936824-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/map-value-0000001070936824-V5
-->
# MapValue

| Class Info |
| --- |
| public class MapValue extends EnhanceParcelable Mapped value class. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [MapValue](#EN-US_TOPIC_0000001070936824__section10260122084318)(int format, float floatVar) Constructor for **MapValue** in float format. |
| [MapValue](#EN-US_TOPIC_0000001070936824__section1678468716)(int format, int intVar) Constructor for **MapValue** in int format. |
| [MapValue](#EN-US_TOPIC_0000001070936824__section482211131696)(int format, long longVar) Constructor for **MapValue** in long format. |
| [MapValue](#EN-US_TOPIC_0000001070936824__section382215131297)(int format, String strVar) Constructor for **MapValue** in string format. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| final float | [asFloatValue](#EN-US_TOPIC_0000001070936824__section9908124554516)() Returns the mapped value as a float. |
| final int | [asIntValue](#EN-US_TOPIC_0000001070936824__section1549010565457)() Returns the mapped value as an integer. |
| final long | [asLongValue](#EN-US_TOPIC_0000001070936824__section1352191019462)() Returns the mapped value as a long integer. |
| final String | [asStringValue](#EN-US_TOPIC_0000001070936824__section10410192466)() Returns the mapped value as a string. |
| int | [getFormat](#EN-US_TOPIC_0000001070936824__section18214172313205)() Obtains the type of the mapped value. |

#### Public Constructors

## MapValue(int format, float floatVar)

| Constructor |
| --- |
| public public MapValue(int format, float floatVar) Constructor for **MapValue** in float format. |

## MapValue(int format, int intVar)

| Constructor |
| --- |
| public MapValue(int format, int intVar) Constructor for **MapValue** in int format. |

## MapValue(int format, long longVar)

| Constructor |
| --- |
| public MapValue(int format, long longVar) Constructor for **MapValue** in long format. |

## MapValue(int format, String strVar)

| Constructor |
| --- |
| public MapValue(int format, String strVar) Constructor for **MapValue** in string format. |

#### Public Methods

## asFloatValue()

| Method |
| --- |
| public final float asFloatValue() Returns the mapped value as a float. |

**Returns**

| Type | Description |
| --- | --- |
| float | Mapped value as a float. |

## asIntValue()

| Method |
| --- |
| public final int asIntValue() Returns the mapped value as an integer. |

**Returns**

| Type | Description |
| --- | --- |
| int | Mapped value as an integer. |

## asLongValue()

| Method |
| --- |
| public final long asLongValue() Returns the mapped value as a long integer. |

**Returns**

| Type | Description |
| --- | --- |
| long | Mapped value as a long integer. |

## asStringValue()

| Method |
| --- |
| public final String asStringValue() Returns the mapped value as a string. |

**Returns**

| Type | Description |
| --- | --- |
| String | Mapped value as a string. |

**Returns**

| Type | Description |
| --- | --- |
| long | Mapped value as a long integer. |

## getFormat()

| Method |
| --- |
| public int getFormat() Obtains the format of the mapped value. |

**Returns**

| Type | Description |
| --- | --- |
| int | Format of the mapped value. |
