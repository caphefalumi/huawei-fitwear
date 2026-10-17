<!--
  Title: ScopeLangItem
  Catalog: HMSCore-References-V5
  Document ID: scopelangitem-0000001059430984-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/scopelangitem-0000001059430984-V5
-->
# ScopeLangItem

| Class Info |
| --- |
| public class ScopeLangItem extends EnhanceParcelable List of permissions that have been granted to your app. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| String | [getAppIconPath](#EN-US_TOPIC_0000001059430984__section16292171375511)() Obtains the path to the app icon image. |
| String | [getAppName](#EN-US_TOPIC_0000001059430984__section1166314219558)() Obtains the app name. |
| String | [getAuthTime](#EN-US_TOPIC_0000001059430984__section1320703365510)() Obtains the time when the permission is granted. |
| Map<String, String> | [getUrl2Desc](#EN-US_TOPIC_0000001059430984__section94551041155510)() Obtains the mapping between the permission scope URL and description. |
| void | [setAppIconPath](#EN-US_TOPIC_0000001059430984__section104821304564)(String appIconPath) Sets the path to the app icon image. |
| void | [setAppName](#EN-US_TOPIC_0000001059430984__section1310851310568)(String appName) Sets the app name. |
| void | [setAuthTime](#EN-US_TOPIC_0000001059430984__section3572129185620)(String authTime) Sets the time when the permission is granted. |
| void | [setUrl2Desc](#EN-US_TOPIC_0000001059430984__section249853718566)(Map<String, String> url2Desc) Sets the mapping between the permission scope URL and description. |

#### Public Methods

## getAppIconPath()

| Method |
| --- |
| public String getAppIconPath() Obtains the path to the app icon image. |

**Returns**

| Type | Description |
| --- | --- |
| String | Path to the app icon image. |

## getAppName()

| Method |
| --- |
| public String getAppName() Obtains the app name. |

**Returns**

| Type | Description |
| --- | --- |
| String | App name. |

## getAuthTime()

| Method |
| --- |
| public String getAuthTime() Obtains the character string represented by the UNIX timestamp corresponding to the authorization time. |

**Returns**

| Type | Description |
| --- | --- |
| String | Character string represented by the UNIX timestamp corresponding to the authorization time. |

## getUrl2Desc()

| Method |
| --- |
| public Map<String, String> getUrl2Desc() Obtains the mapping between the permission scope URL and description. |

**Returns**

| Type | Description |
| --- | --- |
| Map<String, String> | Mapping between the permission scope URL and description. |

## setAppIconPath(String appIconPath)

| Method |
| --- |
| public void setAppIconPath(String appIconPath) Sets the path to the app icon image. |

**Parameters**

| Name | Description |
| --- | --- |
| appIconPath | Path to the app icon image. |

## setAppName(String appName)

| Method |
| --- |
| public void setAppName(String appName) Sets the app name. |

**Parameters**

| Name | Description |
| --- | --- |
| appName | App name. |

## setAuthTime(String authTime)

| Method |
| --- |
| public void setAuthTime(String authTime) Sets the time when the permission is granted. |

**Parameters**

| Name | Description |
| --- | --- |
| authTime | Time when the permission is granted. |

## setUrl2Desc(Map<String, String> url2Desc)

| Method |
| --- |
| public void setUrl2Desc(Map<String, String> url2Desc) Sets the mapping between the permission scope URL and description. |

**Parameters**

| Name | Description |
| --- | --- |
| url2Desc | Mapping between the permission scope URL and description. |
