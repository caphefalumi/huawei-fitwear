<!--
  Title: Customization Capability Set
  Catalog: huaweihealth-Guides
  Document ID: customization_capability_set-0000002445588417
  Updated: 2026-08-05 02:10:03
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/customization_capability_set-0000002445588417
-->
# Customization Capability Set

The HEM and VMALL customization capability sets define input constraints for customization items and outline capability differences across device models. This helps enterprise users quickly understand the customization services, collaborate efficiently, and improve overall efficiency.

The following table describes the customization capabilities supported by different wearables.

| **Platform** **Customization Item** | **VMALL** | **HEM** |  |
| --- | --- | --- | --- |
| **B5/B9/H3/H5/H9/Band Series** | **B5/B9/H3/H5/H9/Band Series** | **B7/H7 Series** |  |
| **Startup logo** | **Optional** | **Optional** | **Optional** |
| **Startup animation** | / | / | **Optional** |
| **Watch face** | **Optional** | **Optional** | **Optional** |
| **HarmonyOS app (automatic startup/keepalive)** | / | / | **Optional** |
| **Enterprise name** | **Mandatory** | **Mandatory** | **Optional** |
| **Enterprise address** | / | / | **Optional** |
| **Contact information** | / | / | **Optional** |
| **Email address** | / | / | **Optional** |
| **Custom version number** | **Mandatory** | **Mandatory** | **Optional** |
| Stay connected while asleep | / | / | **Optional** |
| Remote factory reset | / | / | **Optional** |

> **Note:** "**/**" indicates that the device series does not support this customization item. Among the three customization product types, the enterprise name and custom version number are optional for the wearable series, but mandatory for the other series. For the VMALL-B5/B9/H3/H5/H9/Band Series and HEM-B5/B9/H3/H5/H9/Band Series, at least one of the startup logo or watch face must be customized. The enterprise address, contact information, and email address are mandatory VMALL customization but are not displayed on the device.
