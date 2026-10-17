<!--
  Title: HiHealthDataQueryOption
  Catalog: HMSCore-References-V5
  Document ID: hihealthdataqueryoption-0000001071859312-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5
-->
# HiHealthDataQueryOption

| java.lang.Object \|---com.huawei.hihealth.HiHealthDataQueryOption 
```
public class HiHealthDataQueryOption
extends java.lang.Object
implements android.os.Parcelable
```
 |
| --- |
 Extended parameter of the query API.
#### Nested Class Summary

| Nested classes/interfaces inherited from interface android.os.Parcelable |
| --- |
| android.os.Parcelable.ClassLoaderCreator<T>, android.os.Parcelable.Creator<T> |

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static android.os.Parcelable.Creator<[HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5)> | [CREATOR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__CREATOR) Static member that needs to be added to the class to implement the serialization. |
   
| Fields inherited from interface android.os.Parcelable |
| --- |
| CONTENTS_FILE_DESCRIPTOR, PARCELABLE_WRITE_RETURN_VALUE |

#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__HiHealthDataQueryOption--)() No-argument constructor. |
| [HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__HiHealthDataQueryOption-int-int-int-)(int limit, int offset, int order) Argument constructor. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| int | [getLimit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__getLimit--)() Obtains the query limit. |
| int | [getOffset](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__getOffset--)() Obtains the query offset value. |
| int | [getOrder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__getOrder--)() Obtains the order. |
| void | [setLimit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__setLimit-int-)(int limit) Sets the query limit. |
| void | [setOffset](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__setOffset-int-)(int offset) Sets the query offset value. |
| void | [setOrder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5#EN-US_TOPIC_0000001137232743__setOrder-int-)(int order) Sets the order. |

#### Field Detail

## CREATOR

public static final android.os.Parcelable.Creator<[HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5)> CREATOR
Adds a static member to the class to implement the serialization.
#### Constructor Detail

## HiHealthDataQueryOption

public HiHealthDataQueryOption()
No-argument constructor.
## HiHealthDataQueryOption

public HiHealthDataQueryOption(int limit, int offset, int order)
Argument constructor.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| limit | Limit of records in the query result. |
| offset | Offset value of the query: number of records to skip from the results. |
| order | Order by which the query results are sorted. |

#### Method Detail

## getLimit

public int getLimit()
Obtains the query limit.
**Returns:**

Limit value.

## setLimit

public void setLimit(int limit)
Sets the query limit.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| limit | Limit value. |

## getOffset

public int getOffset()
Obtains the query offset value.
**Returns:**

Offset value.

## setOffset

public void setOffset(int offset)
Sets the offset value of the query.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| offset | Offset value. |

## getOrder

public int getOrder()
Obtains the order.
**Returns:**

Order. The options are as follows: **0**: ascending order; **1**: descending order.

## setOrder

public void setOrder(int order)
Sets the order.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| order | **0**: ascending order; **1**: descending order |
