<!--
  Title: Value
  Catalog: HMSCore-References-V5
  Document ID: value-0000001050091052-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/value-0000001050091052-V5
-->
# Value

| Class Info |
| --- |
| public final class Value extends EnhanceParcelable Attribute value. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [Value](#EN-US_TOPIC_0000001052927061__section9599453153510)(int format) Constructor for the attribute value. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [asActivityType](#EN-US_TOPIC_0000001052927061__section860965313355)() Returns the activity type value. |
| double | [asDoubleValue](#EN-US_TOPIC_0000001052927061__section7761202185219)() Returns the value as a double-precision floating-point number. |
| float | [asFloatValue](#EN-US_TOPIC_0000001052927061__section1612105373518)() Returns the value as a float. |
| int | [asIntValue](#EN-US_TOPIC_0000001052927061__section17614253173519)() Returns the value as an integer. |
| long | [asLongValue](#EN-US_TOPIC_0000001052927061__section1218392551320)() Returns the value as a long integer. |
| String | [asStringValue](#EN-US_TOPIC_0000001052927061__section1617125319353)() Returns the value as a string. |
| int | [getFormat](#EN-US_TOPIC_0000001052927061__section926441815523)() Obtains the type of the value. |
| Map<String, MapValue> | [getMap](#EN-US_TOPIC_0000001052927061__section16007483517)() Obtains the map. |
| MapValue | [getMapValue](#EN-US_TOPIC_0000001052927061__section15376181220513)(String key) Obtains the **MapValue** corresponding to the key in the map. |
| boolean | [isSet](#EN-US_TOPIC_0000001052927061__section1866318174498)() Indicates whether the value has been set. |
| void | [removeMapValue](#EN-US_TOPIC_0000001052927061__section1100175312496)(String key) Removes the value corresponding to the key in the map. |
| void | [setActivityIndexValue](#EN-US_TOPIC_0000001052927061__section56371953163510)(String activity) Sets the value of the activity type in the index. |
| void | [setDoubleValue](#EN-US_TOPIC_0000001052927061__section1238914815311)(double valueVar) Sets the value to be a double-precision floating-point number. |
| void | [setFloatValue](#EN-US_TOPIC_0000001052927061__section1311135313549)(float valueVar) Sets the value to be a float. |
| void | [setIntValue](#EN-US_TOPIC_0000001052927061__section259946175518)(int valueVar) Sets the value to be an integer. |
| void | [setLongValue](#EN-US_TOPIC_0000001052927061__section37451623161412)(long longValue) Sets the value to be a long integer. |
| void | [setKeyValue](#EN-US_TOPIC_0000001052927061__section148911314561)(String key, float valueVar) Assigns a float value to a specified key in the map. |
| void | [setKeyValue](#EN-US_TOPIC_0000001052927061__section1229452133115)(String key, int valueVar) Assigns an integer value to a specified key in the map. |
| void | [setKeyValue](#EN-US_TOPIC_0000001052927061__section717751713119)(String key, long valueVar) Assigns a long integer value to a specified key in the map. |
| void | [setKeyValue](#EN-US_TOPIC_0000001052927061__section96144187310)(String key, String valueVar) Assigns a string value to a specified key in the map. |
| void | [setStringValue](#EN-US_TOPIC_0000001052927061__section15330143195713)(String valueVar) Sets the value to be a string. |

#### Public Constructors

## Value(int format)

| Constructor |
| --- |
| public Value(int format) Constructor for the attribute value. |

**Parameters**

| Name | Description |
| --- | --- |
| format | Attribute value type. |

#### Public Methods

## asActivityType()

| Method |
| --- |
| public String asActivityType() Returns the activity type value. |

**Returns**

| type | Description |
| --- | --- |
| String | Activity type as a string. |

## asDoubleValue()

| Method |
| --- |
| public double asDoubleValue() Returns the value as a double-precision floating-point number. |

**Returns**

| Type | Description |
| --- | --- |
| double | Double-precision floating-point value. |

## asFloatValue()

| Method |
| --- |
| public float asFloatValue() Returns the value as a float. |

**Returns**

| Type | Description |
| --- | --- |
| float | Floating point number. |

## asIntValue()

| Method |
| --- |
| public int asIntValue() Returns the value as an integer. |

**Returns**

| Type | Description |
| --- | --- |
| int | Integer. |

## asLongValue()

| Method |
| --- |
| public long asLongValue() Returns the value as a long integer. |

**Returns**

| Type | Description |
| --- | --- |
| long | Long integer. |

## asStringValue()

| Method |
| --- |
| public String asStringValue() Returns the value as a string. |

**Returns**

| Type | Description |
| --- | --- |
| String | String. |

## getFormat()

| Method |
| --- |
| public int getFormat() Obtains the type of the value. |

**Returns**

| Type | Description |
| --- | --- |
| int | Sequence number of the type. |

## getMap()

| Method |
| --- |
| public Map<String, MapValue> getMap() Obtains the map. |

**Returns**

| Type | Description |
| --- | --- |
| Map<String, MapValue> | Map. |

## getMapValue(String key)

| Method |
| --- |
| public MapValue getMapValue(String key) Obtains the **MapValue** corresponding to the key in the map. |

**Parameters**

| Name | Description |
| --- | --- |
| Key | Key in the map. |

**Returns**

| Type | Description |
| --- | --- |
| MapValue | Mapped value. |

## isSet()

| Method |
| --- |
| public boolean isSet() Indicates whether the value has been set. |

**Returns**

| Type | Description |
| --- | --- |
| boolean | Whether a value has been set. |

## removeMapValue(String key)

| Method |
| --- |
| public void removeMapValue(String key) Removes the value corresponding to the key in the map. |

**Parameters**

| Name | Description |
| --- | --- |
| key | Key in the map. |

## setActivityIndexValue(String activity)

| Method |
| --- |
| public void setActivityIndexValue(String activity) Sets the value of the activity type in the index. |

**Parameters**

| Name | Description |
| --- | --- |
| activity | Activity type. |

## setDoubleValue(double valueVar)

| Method |
| --- |
| public void setDoubleValue(double valueVar) Sets the value to be a double-precision floating-point number. |

**Parameters**

| Name | Description |
| --- | --- |
| valueVar | Double-precision floating-point number. |

## setFloatValue(float valueVar)

| Method |
| --- |
| public void setFloatValue(float valueVar) Sets the value to be a float. |

**Parameters**

| Name | Description |
| --- | --- |
| valueVar | Float. |

## setIntValue(int valueVar)

| Method |
| --- |
| public void setIntValue(int valueVar) Sets the value to be an integer. |

**Parameters**

| Name | Description |
| --- | --- |
| valueVar | Integer. |

## setLongValue(long longValue)

| Method |
| --- |
| public void setLongValue(long longValue) Sets the value to be a long integer. |

**Parameters**

| Name | Description |
| --- | --- |
| longValue | Value as a long integer. |

## setKeyValue(String key, float value)

| Method |
| --- |
| public void setKeyValue(String key, float value) Assigns a float value to a specified key in the map. |

**Parameters**

| Name | Description |
| --- | --- |
| key | Key in the map. |
| value | Mapped value as a float. |

## setKeyValue(String key, int valueVar)

| Method |
| --- |
| public void setKeyValue(String key, int valueVar) Assigns an integer value to a specified key in the map. |

**Parameters**

| Name | Description |
| --- | --- |
| key | Key in the map. |
| valueVar | Mapped value as an integer. |

## setKeyValue(String key, long valueVar)

| Method |
| --- |
| public void setKeyValue(String key, long valueVar) Assigns a long integer value to a specified key in the map. |

**Parameters**

| Name | Description |
| --- | --- |
| key | Key in the map. |
| valueVar | Mapped value as a long integer. |

## setKeyValue(String key, String valueVar)

| Method |
| --- |
| public void setKeyValue(String key, String valueVar) Assigns a string value to a specified key in the map. |

**Parameters**

| Name | Description |
| --- | --- |
| key | Key in the map. |
| valueVar | Mapped value as a string. |

## setStringValue(String valueVar)

| Method |
| --- |
| public void setStringValue(String valueVar) Sets the value to be a string. |

**Parameters**

| Name | Description |
| --- | --- |
| valueVar | String. |
