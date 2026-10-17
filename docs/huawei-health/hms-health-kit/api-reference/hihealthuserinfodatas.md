<!--
  Title: HiHealthUserInfoDatas
  Catalog: HMSCore-References-V5
  Document ID: hihealthuserinfodatas-0000001071989546-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5
-->
# HiHealthUserInfoDatas

| java.lang.Object \|---[com.huawei.hihealthkit.data.HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) \|---\|---com.huawei.hihealthkit.data.HiHealthUserInfoDatas 
```
public class HiHealthUserInfoDatas
extends HiHealthData
```
 |
| --- |
 User information data object.
#### Constructor Summary

| Constructor and Description |
| --- |
| [HiHealthUserInfoDatas](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__HiHealthUserInfoDatas--)() |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| int | [getBirthday](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__getBirthday--)() Obtains date of birth. |
| int | [getGender](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__getGender--)() Obtains gender data. |
| int | [getHeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__getHeight--)() Obtains height data. |
| float | [getWeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__getWeight--)() Obtains weight data. |
| void | [setBirthday](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__setBirthday-int-)(int birthday) Sets the date of birth. |
| void | [setGender](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__setGender-int-)(int gender) Sets the gender. |
| void | [setHeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__setHeight-int-)(int height) Sets the height. |
| void | [setWeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthuserinfodatas-0000001071989546-V5#EN-US_TOPIC_0000001137088195__setWeight-float-)(float weight) Sets the weight. |
   
| Methods inherited from class com.huawei.hihealthkit.data.[HiHealthData](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5) |
| --- |
| [getEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getEndTime--), [getSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getSourceDevice--), [getStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getStartTime--), [getType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__getType--), [setEndTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setEndTime-long-), [setSourceDevice](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__s53839adbd8ad4492bc74c187fd56c069), [setStartTime](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setStartTime-long-), [setType](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdata-0000001071819173-V5#EN-US_TOPIC_0000001136987083__setType-int-) |

#### Constructor Detail

## HiHealthUserInfoDatas

public HiHealthUserInfoDatas()

#### Method Detail

## getGender

public int getGender()
Obtains the gender.
**Returns:**

Gender. The options are **0** (female), **1** (male), **2** (confidential), and **-1** (not set).

## setGender

public void setGender(int gender)
Sets the gender.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| gender | Gender. |

## getBirthday

public int getBirthday()
Obtains the date of birth.
**Returns:**

Date of birth. For example, 19900801 indicates August 1, 1990.

## setBirthday

public void setBirthday(int birthday)
Sets the date of birth.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| birthday | Date of birth. |

## getHeight

public int getHeight()
Obtains the height.
**Returns:**

Height in cm.

## setHeight

public void setHeight(int height)
Sets the height.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| height | Height. |

## getWeight

public float getWeight()
Obtains the weight.
**Returns:**

Weight in kg.

## setWeight

public void setWeight(float weight)
Sets the weight.
**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| weight | Weight. |
