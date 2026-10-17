<!--
  Title: AppInfo
  Catalog: HMSCore-References-V5
  Document ID: appinfo-0000001088333871-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/appinfo-0000001088333871-V5
-->
# AppInfo

| Class Info |
| --- |
| public class AppInfo implements Parcelable Describes an app. |

#### Public Constructor Summary

| Constructor Name |
| --- |
| [AppInfo](#EN-US_TOPIC_0000001088333871__section53198467278)(String packageName, String domainName, String version, String detailsUrl) Constructor for **AppInfo**. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [getPackageName](#EN-US_TOPIC_0000001088333871__section669710486318)() Obtains the app package name. |
| String | [getDomainName](#EN-US_TOPIC_0000001088333871__section583345615205)() Obtains the app domain name. |
| String | [getVersion](#EN-US_TOPIC_0000001088333871__section15664115916208)() Obtains the app version. |
| String | [getDetailsUrl](#EN-US_TOPIC_0000001088333871__section93719319216)() Obtains the app URL. |

#### Public Constructors

## AppInfo(String packageName, String domainName, String version, String detailsUrl)

| Constructor |
| --- |
| public AppInfo(String packageName, String domainName, String version, String detailsUrl) Constructor for **AppInfo**. |

**Parameters**

| Name | Description |
| --- | --- |
| packageName | App package name. |
| domainName | App domain name. |
| version | App version. |
| detailsUrl | App URL. |

#### Public Methods

## getPackageName()

| Method |
| --- |
| public String getPackageName() Obtains the app package name. |

**Returns**

| Type | Description |
| --- | --- |
| String | App package name. |

## getDomainName()

| Method |
| --- |
| public String getDomainName() Obtains the app domain name. |

**Returns**

| Type | Description |
| --- | --- |
| String | App domain name. |

## getVersion()

| Method |
| --- |
| public String getVersion() Obtains the app version. |

**Returns**

| Type | Description |
| --- | --- |
| String | App version. |

## getDetailsUrl()

| Method |
| --- |
| public String getDetailsUrl() Obtains the app URL. |

**Returns**

| Type | Description |
| --- | --- |
| String | App URL. |
