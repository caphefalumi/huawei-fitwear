<!--
  Title: HiHealthDataType
  Catalog: HMSCore-References-V5
  Document ID: hihealthdatatype-0000001072627362-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5
-->
# HiHealthDataType

| java.lang.Object \|---com.huawei.hihealthkit.data.type.HiHealthDataType 
```
public class HiHealthDataType
extends java.lang.Object
```
 |
| --- |
 Parent type for data types.
#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static int | [DATA_POINT_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__DATA_POINT_MIN) Dotting data (minimum workout type). |
| static int | [DATA_SET_MIN](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__DATA_SET_MIN) Data set. |

#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__HiHealthDataType--)() |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| static com.huawei.hihealthkit.data.type.HiHealthDataType.Category | [getCategory](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__getCategory-int-)(int type) Obtains the category. |
| int | [getType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__getType--)() Obtains the data type of the current object. |
| static [HiHealthDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5) | [init](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__init-int-)(int type) Initialization. The object is returned based on the type, which is implemented by the subclass. |
| void | [setType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5#EN-US_TOPIC_0000001137088203__setType-int-)(int typeIdentifier) Sets the data type of the current object. |

#### Field Detail

## DATA_POINT_MIN

public static final int DATA_POINT_MIN
Dotting data (minimum workout type).
**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__aa482f86a67154df89b3fc88b6fb83635)

## DATA_SET_MIN

public static final int DATA_SET_MIN
Data set.
**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/constant-values-0000001052541631-V5#EN-US_TOPIC_0000001136869911__ab7ce374b63be4549b0c66579390c60cb)

#### Constructor Detail

## HiHealthDataType

public HiHealthDataType()

#### Method Detail

## init

public static [HiHealthDataType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatatype-0000001072627362-V5) init(int type)
Initialization. The object is returned based on the type, which is implemented by the subclass.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| type | Type. |

**Returns:**

Object of the type.

## getType

public int getType()
Obtains the data type of the current object.
**Returns:**

Data type.

## setType

public void setType(int typeIdentifier)
Sets the data type of the current object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| typeIdentifier | Data type. |

## getCategory

public static com.huawei.hihealthkit.data.type.HiHealthDataType.Category getCategory(int type)
Obtains the category of the data type.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| type | Type. |

**Returns:**

Category of the data types.
