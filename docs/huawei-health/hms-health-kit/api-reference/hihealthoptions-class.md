<!--
  Title: HiHealthOptions
  Catalog: HMSCore-References-V5
  Document ID: hihealthoptions_class-0000001050089546-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthoptions_class-0000001050089546-V5
-->
# HiHealthOptions

| Class Info |
| --- |
| public class HiHealthOptions implements HuaweiIdAuthExtendedParams Requests permissions via **HuaweiIdAuthManager.addAuthScopes(Activity, int, HuaweiIdAuthExtendedParams)**. Permissions are defined by **DataType**, which determines the Health Kit scopes authorized to the signed-in HUAWEI ID. |

#### Nested Class Summary

| Qualifier and Type | Class Name and Description |
| --- | --- |
| public static class | [HiHealthOptions.Builder](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthoptions_builder-0000001050091503-V5) Builder for **HiHealthOptions**. |

#### Public Field Summary

| Qualifier and Type | Field and Description |
| --- | --- |
| static final int | [ACCESS_READ](#EN-US_TOPIC_0000001053607037__section16677420202713) Read permission. |
| static final int | [ACCESS_WRITE](#EN-US_TOPIC_0000001053607037__section1767917209271) Write permission. |

#### Public Method Summary

| Qualifier and Type | Method Name and Description |
| --- | --- |
| static HiHealthOptions.Builder | [builder](#EN-US_TOPIC_0000001053607037__section270810262582)() Builder for **HiHealthOptions**. |
| static HiHealthOptions.Builder | [builder](#EN-US_TOPIC_0000001053607037__section194751038386)(AuthHuaweiId huaweiId) Builder for **HiHealthOptions**. |
| Bundle | [getExtendedBundle](#EN-US_TOPIC_0000001053607037__section152428373392)() Obtains the **Bundle** object. |
| int | [getExtendedParamType](#EN-US_TOPIC_0000001053607037__section183822361363)() Obtains the extended authentication parameter of an object. |
| List<Scope> | [getExtendedScopes](#EN-US_TOPIC_0000001053607037__section1998515817712)() Obtains the list of scopes requested. |

#### Public Fields

## ACCESS_READ

| Field |
| --- |
| public static final int ACCESS_READ Read permission. Constant value: **0** |

## ACCESS_WRITE

| Field |
| --- |
| public static final int ACCESS_WRITE Write permission. Constant value: **1** |

#### Public Methods

## builder()

| Method |
| --- |
| public static Builder builder() Builder for **HiHealthOptions**. |

**Return****s**

| Type | Description |
| --- | --- |
| Builder | Builder object for **HiHealthOptions**. |

## builder(AuthHuaweiId huaweiId)

| Method |
| --- |
| public static Builder builder(AuthHuaweiId huaweiId) Builder for **HiHealthOptions**. |

**Parameters**

| Name | Description |
| --- | --- |
| huaweiId | HUAWEI ID information. |

**Return****s**

| Type | Description |
| --- | --- |
| Builder | Builder object for **HiHealthOptions**. |

## getExtendedBundle()

| Method |
| --- |
| public Bundle getExtendedBundle() Obtains the **Bundle** object. |

**Return****s**

| Type | Description |
| --- | --- |
| Bundle | **Bundle** object. |

## getExtendedParamType()

| Method |
| --- |
| public int getExtendedParamType() Obtains the extended authentication parameter of an object. |

**Return****s**

| Type | Description |
| --- | --- |
| int | Extended authentication parameter of an object. |

## getExtendedScopes()

| Method |
| --- |
| public List<Scope> getExtendedScopes() Obtains the list of scopes requested. |

**Return****s**

| Type | Description |
| --- | --- |
| List<Scope> | List of scopes requested. |
