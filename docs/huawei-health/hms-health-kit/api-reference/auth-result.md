<!--
  Title: HealthKitAuthResult
  Catalog: HMSCore-References-V5
  Document ID: auth-result-0000001098318552-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/auth-result-0000001098318552-V5
-->
# HealthKitAuthResult

| Class Info |
| --- |
| public class HealthKitAuthResult extends Result Result class of the sign-in authorization process. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| HealthKitAuthResult | [fromJson](#EN-US_TOPIC_0000001098318552__section245417341437)(String json) Converts a JSON string to a **HealthKitAuthResult** object. |
| AuthAccount | [getAuthAccount](#EN-US_TOPIC_0000001098318552__section1570723781813)() Obtains the account information from the authorization result. |
| int | [getErrorCode](#EN-US_TOPIC_0000001098318552__section20146174081819)() Obtains the result code of the authorization process. |
| boolean | [isSuccess](#EN-US_TOPIC_0000001098318552__section24841041181814)() Indicates whether the authorization is successful. |
| void | [setAuthAccount](#EN-US_TOPIC_0000001098318552__section847010426182)(AuthAccount authAccount) Sets the account information in the returned result. |
| String | [toJson](#EN-US_TOPIC_0000001098318552__section1531564317182)() Converts a **HealthKitAuthResult** object to a JSON string. |

#### Public Methods

## fromJson(String json)

| Method |
| --- |
| public HealthKitAuthResult fromJson(String json) throws JSONException Converts a JSON string to a **HealthKitAuthResult** object. |

**Parameters**

| Name | Description |
| --- | --- |
| json | Represents the **HealthKitAuthResult** object as a JSON string. |

**Return****s**

| Type | Description |
| --- | --- |
| HealthKitAuthResult | **HealthKitAuthResult** object. |

**Throws**

| Name | Description |
| --- | --- |
| JSONException | JSON parsing exception. |

## getAuthAccount()

| Method |
| --- |
| public AuthAccount getAuthAccount() Obtains the account information from the authorization result. |

**Return****s**

| Type | Description |
| --- | --- |
| AuthAccount | Account information in the authorization result. |

## getErrorCode()

| Method |
| --- |
| public int getErrorCode() Obtains the result code of the authorization process. |

**Return****s**

| Type | Description |
| --- | --- |
| int | Result code of the authorization process. |

## isSuccess()

| Method |
| --- |
| public boolean isSuccess() Indicates whether the authorization is successful. |

**Return****s**

| Type | Description |
| --- | --- |
| boolean | Whether the authorization is successful: • **true**: successful • **false**: failed |

## setAuthAccount(AuthAccount authAccount)

| Method |
| --- |
| public void setAuthAccount(AuthAccount authAccount) Sets the account information in the returned result. |

**Parameters**

| Name | Description |
| --- | --- |
| authAccount | Account information. |

## toJson()

| Method |
| --- |
| public String toJson() throws JSONException Converts a **HealthKitAuthResult** object to a JSON string. |

**Return****s**

| Type | Description |
| --- | --- |
| String | Represents the **HealthKitAuthResult** object as a JSON string. |

**Throws**

| Name | Description |
| --- | --- |
| JSONException | JSON conversion exception. |
