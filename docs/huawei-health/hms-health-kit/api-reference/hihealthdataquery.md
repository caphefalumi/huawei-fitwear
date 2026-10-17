<!--
  Title: HiHealthDataQuery
  Catalog: HMSCore-References-V5
  Document ID: hihealthdataquery-0000001071549449-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5
-->
# HiHealthDataQuery

| java.lang.Object \|---com.huawei.hihealth.HiHealthDataQuery 
```
public class HiHealthDataQuery
extends java.lang.Object
implements android.os.Parcelable
```
 |
| --- |
 Data query class.
#### Nested Class Summary

| Nested classes/interfaces inherited from interface android.os.Parcelable |
| --- |
| android.os.Parcelable.ClassLoaderCreator<T>, android.os.Parcelable.Creator<T> |

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static android.os.Parcelable.Creator<[HiHealthDataQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5)> | [CREATOR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__CREATOR) Static member that needs to be added to the class to implement the serialization. |
   
| Fields inherited from interface android.os.Parcelable |
| --- |
| CONTENTS_FILE_DESCRIPTOR, PARCELABLE_WRITE_RETURN_VALUE |

#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthDataQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__HiHealthDataQuery--)() No-argument constructor. |
| [HiHealthDataQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__sc05b8fa8ad4c44c3841984a31dfbe474)(com.huawei.hihealthkit.HiHealthDataQuery query) Converts an external HiHealthDataQuery object to an internal serializable object. |
| [HiHealthDataQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__sa1e174be60e54b8ca3c1f17b8085f64e)(int sampleType, long startTime, long endTime, [HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5) hiHealthDataQueryOption) Argument constructor. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| long | [getEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__getEndTime--)() Obtain the query end time. |
| int | [getSampleType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__getSampleType--)() Obtain the queried data type. |
| long | [getStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__getStartTime--)() Obtain the query start time. |
| void | [setEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__setEndTime-long-)(long endTime) Set the query end time. |
| void | [setSampleType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__setSampleType-int-)(int sampleType) Set the data type to query. |
| void | [setStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5#EN-US_TOPIC_0000001136987075__setStartTime-long-)(long startTime) Set the query start time. |

#### Field Detail

## CREATOR

public static final android.os.Parcelable.Creator<[HiHealthDataQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataquery-0000001071549449-V5)> CREATOR
Adds a static member to the class to implement the serialization.
#### Constructor Detail

## HiHealthDataQuery

public HiHealthDataQuery()
No-argument constructor.
## HiHealthDataQuery

public HiHealthDataQuery(int sampleType, long startTime, long endTime, [HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5) hiHealthDataQueryOption)
Argument constructor.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| sampleType | Data type. |
| startTime | Start time. |
| endTime | End time. |
| hiHealthDataQueryOption | Query option. |

## HiHealthDataQuery

public HiHealthDataQuery(com.huawei.hihealthkit.HiHealthDataQuery query)
Converts an external HiHealthDataQuery object to an internal serializable object.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| query | External query body. This parameter cannot be left empty. |

**Throws:**

| Throw Name | Throw Description |
| --- | --- |
| java.lang.NullPointerException | If the input parameter is left empty. |

#### Method Detail

## getSampleType

public int getSampleType()
Obtains the data type.
**Returns:**

Data type.

## setSampleType

public void setSampleType(int sampleType)
Sets the data type for the query.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| sampleType | Data type. |

## getStartTime

public long getStartTime()
Obtains the start time of the query.
**Returns:**

Start time.

## setStartTime

public void setStartTime(long startTime)
Sets the start time of the query.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| startTime | Start time. |

## getEndTime

public long getEndTime()
Obtains the end time of the query.
**Returns:**

End time.

## setEndTime

public void setEndTime(long endTime)
Sets the end time of the query.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| endTime | End time. |
