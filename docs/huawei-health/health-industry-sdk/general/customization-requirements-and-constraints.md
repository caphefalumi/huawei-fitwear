<!--
  Title: Customization Requirements and Constraints
  Catalog: huaweihealth-Guides
  Document ID: customization_requirements_and_constraints-0000002411989312
  Updated: 2026-08-05 02:10:03
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/customization_requirements_and_constraints-0000002411989312
-->
# Customization Requirements and Constraints

The following table lists the requirements and constraints for each customization item.

| **Platform** **Customization Item** | **VMALL** | **HEM** |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **B5/B9/H3/H5/H9 Series** | **Band Series** | **B5/B9/H3/H5/H9 Series** | **B7/H7 Series** | **Band Series** |  |
| **Startup logo** | Described in the note below the table | Described in the note below the table | Described in the note below the table | Described in the note below the table | Described in the note below the table |
| **Startup animation** | / | / | / | Format: MP4 Size: ≤ 50 MB Duration: 10s (recommended) | / |
| **Watch face** | Format: hwt Size: ≤ 4 MB for a single file Quantity: ≤ 12 File name: < 32 characters, with only letters, digits, and underscores (_) | Format: hwt Size: ≤ 0.8 MB for a single file Quantity: 1 File name: < 32 characters, with only letters, digits, and underscores (_) | Format: hwt Size: ≤ 4 MB for a single file Quantity: ≤ 12 | Format: hwt Size: ≤ 40 MB Quantity: 1 | Format: hwt Size: ≤ 0.8 MB for a single file Quantity: 1 File name: < 32 characters, with only letters, digits, and underscores (_) |
| **HarmonyOS app (automatic startup/keepalive)** | / | / | / | Format: app Size: ≤ 1 GB (total size) Quantity: ≤ 10 | / |
| **Enterprise name** | Length: ≤ 20 characters (For H3/H5/H9 Series, the maximum length is 17 characters due to limitations of the watch-side UI.) | Length: ≤ 20 characters (For HA5A0, the maximum length is 17 characters due to limitations of the watch-side UI.) | Length: ≤ 20 characters (For H3/H5/H9 Series, the maximum length is 17 characters due to limitations of the watch-side UI.) | Length: ≤ 32 characters | Length: ≤ 20 characters |
| **Enterprise address** | / | / | / | Length: ≤ 32 characters | / |
| **Contact information** | / | / | / | Length: ≤ 32 characters | / |
| **Email address** | / | / | / | Length: ≤ 45 characters Constraints: The email address must contain only one at sign (@) and cannot contain spaces. | / |
| **Custom version number** | Length: ≤ 16 characters for Chinese text; ≤ 20 characters for English letters or digits Constraints: Can contain Chinese characters, English letters, digits, periods (.), hyphens (-), and underscores (_). | Length: ≤ 16 characters for Chinese text; ≤ 30 characters for English letters or digits Constraints: Can contain Chinese characters, English letters, digits, periods (.), hyphens (-), and underscores (_). | Length: ≤ 16 characters | Length: ≤ 32 characters Constraints: Can contain Chinese characters, English letters, digits, and special characters. | Length: ≤ 16 characters |

> **Note:** Character count: Each Chinese character, English letter, number, or symbol counts as one character. Specifications of the startup logo image: Upload one BMP image according to the specifications in the tables below. Generate and output the image in BMP format from the source. Watch face file name for HEM: 5 to 32 characters, including English letters, digits, underscores (_), and periods (.) Watch face file name for VMALL: 5 to 32 characters, including English letters, digits, underscores (_), and periods (.) File name of the startup logo for HEM: ≤ 32 characters, including English letters, digits, underscores (_), and periods (.) File name of the startup logo for VMALL: **logo**.

Startup logo customization requirements of each model

| **Device Model** | **B9 Series** |
| --- | --- |
| Format | BMP |
| Size | ≤ 1 MB |
| Bit depth | 32 |
| Resolution | 280 × 456 |
| Width | 280 px |
| Height | 456 px |
   
| **Device Model** | **B5 Series** |
| --- | --- |
| Format | BMP |
| Size | ≤ 1 MB |
| Bit depth | 24 |
| Resolution | 300 × 300 |
| Width | 300 px |
| Height | 300 px |
   
| **Device Model** | **H5 Series** |
| --- | --- |
| Format | BMP |
| Size | ≤ 1 MB |
| Bit depth | 32 |
| Resolution | 466 × 466 |
| Width | 466 px |
| Height | 466 px |
   
| **Device Model** | **B7/H7 Series** |
| --- | --- |
| File name | No constraint |
| Format | BMP |
| Size | ≤ 16 MB |
| Bit depth | 24 |
| Resolution | 466 × 466 |
| Width | 466 px |
| Height | 466 px |
   
| **Device Model** | **Band Series** |
| --- | --- |
| Format | BMP |
| Size | ≤ 0.2 MB |
| Bit depth | 16 |
| Resolution | 194 × 368 |
| Width | 194 px |
| Height | 368 px |
   
| Device Model | H3/H9 Series |
| --- | --- |
| Format | BMP |
| Size | ≤ 1 MB |
| Bit depth | 32 |
| Resolution | 408 × 480 |
| Width | 408 px |
| Height | 480 px |
