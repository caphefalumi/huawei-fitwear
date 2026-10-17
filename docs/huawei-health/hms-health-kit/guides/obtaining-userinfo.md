<!--
  Title: Obtaining Personal Information
  Catalog: HMSCore-Guides-V5
  Document ID: obtaining-userinfo-0000001050162034-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/obtaining-userinfo-0000001050162034-V5
-->
**
# Obtaining Personal Information

The following describes how to obtain the user's gender, date of birth, height, and weight defined in Me > Profile in the HUAWEI Health app.

> **Note:** The personal information in Profile is entered by the user. If the user has linked a body fat scale and authorizes the scale to sync data to the personal information, the weight will be the value measured by the body fat scale.
Figure 1 **Profile

Before using any of the following APIs, make sure that you have obtained the related permissions from Huawei. Otherwise, the API calling will fail. If the user has not authorized the related permission, the API calling will also fail.

| Data Openness Type | Query API | Requesting Permissions from User (See [Signing In and Applying for Permissions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/requesting-user-authorization-0000001071733944-V5)) | Scope URL | Requesting Permissions from Huawei (See [Applying for Health Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-kitservice-0000001071254802-V5)) |
| --- | --- | --- | --- | --- |
| Gender | [getGender](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sa000d0a6d20041ec9af5c3c84f3743c0) | [HEALTHKIT_EXTEND_HEALTHBEHAVIOR_READ](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthextendscope-0000001071609519-V5#EN-US_TOPIC_0000001136869919__HEALTHKIT_EXTEND_HEALTHBEHAVIOR_READ) Read permission for health behavior management (including gender, birthdate, height, and weight) | https://www.huawei.com/healthkit/extend/healthbehavior.read Read the health behavior information in the Health app via Health Kit. | Health behavior management |
| Date of birth | [getBirthday](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s37372eca888e4eb39fa301abf2d8480c) |  |  |  |
| Height | [getHeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7981a72568fa4949911e49cec0ab4da8) |  |  |  |
| Weight | [getWeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sc8eabfe062a642418cb4ff4927afe850) |  |  |  |

#### Obtaining Gender Information

- Call the [getGender](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sa000d0a6d20041ec9af5c3c84f3743c0) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to obtain the gender of the user.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter.**Sample code**
```cpp
HiHealthDataStore.getGender(context, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object gender) {
        if (resultCode == HiHealthError.SUCCESS) {
            int value = (int) gender;
        } else {
            String value = (String) gender;
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| genderCallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| gender | Object | • 0: female (int) • 1: male (int) • 2: undisclosed (int) • -1: unspecified (int) • Other: error description (String) |

#### Obtaining Date of Birth

- Call the [getBirthday](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s37372eca888e4eb39fa301abf2d8480c) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to obtain the date of birth of the user.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.getBirthday(context, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object birthday) {
        if (resultCode == HiHealthError.SUCCESS) {
            // For example, 19780520 will be returned if the date of birth is May 20, 1978.
            int value = (int) birthday;
        } else {
            String value = (String) birthday;
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| birthdayCallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| birthday | Object | • YYYYMMDD: success (int). For example, 19900801 indicates August 1, 1990. • Other: error description (String) |

#### Obtaining User's Height

- Call the [getHeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7981a72568fa4949911e49cec0ab4da8) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to obtain the user's height.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.getHeight(context, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object height) {
        if (resultCode == HiHealthError.SUCCESS) {
            int value = (int) height;
        } else {
            String value = (String) height;
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| heightCallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| height | Object | • User height (centimeter): success (int) • Other: error description (String) |

#### Obtaining User's Weight

- Call the [getWeight](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sc8eabfe062a642418cb4ff4927afe850) method of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to obtain the user's weight.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.getWeight(context, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object weight) {
        if (resultCode == HiHealthError.SUCCESS) {
            float value = (float) weight;
        } else {
            String value = (String) weight;
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory/Optional |
| --- | --- | --- | --- |
| weightCallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| weight | Object | • User weight (kg): success (float) • Other: error description (String) |
