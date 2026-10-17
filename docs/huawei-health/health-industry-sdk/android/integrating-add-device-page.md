<!--
  Title: Integrating the Device Adding Screen
  Catalog: huaweihealth-Guides
  Document ID: integrating-add-device-page-0000002338138560
  Updated: 2026-08-05 02:10:17
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/integrating-add-device-page-0000002338138560
-->
# Integrating the Device Adding Screen

> **Note:** Do not enable or disable the dark mode on the phone, or stop your app, when your app calls the IndustryConnectionUI SDK for device scanning and connection.

Integrate the screens for scanning devices, pairing devices, and synchronizing personal information, when your app is paired with a device for the first time.

- Create an intent and pass the **ScanActivity** class for the scanning screen.
- (Optional) Pass personal information for subsequent synchronization after the initial pairing is successful. 
| Parameter | Value | Description |
| --- | --- | --- |
| gender | • male • female | Gender. |
| dateOfBirth | • Date in yyyyMMdd format • Not earlier than January 1, 1900 (**19000101**) | Date of birth. |
| height | Integer ranging from 50 to 250 | Height, in centimeters. |
| weight | Integer ranging from 10 to 250 | Weight, in kilograms. |

- Start **ScanActivity**. The following is an example: 
```cpp
// Create the intent for starting the activity.
Intent intent = new Intent(MainActivity.this, ScanDeviceActivity.class);

// (Optional) Pass personal information.
String dateOfBirth = "19890131";
String gender = "male";
String height = "180";
String weight = "65";
intent.putExtra("gender", gender);
intent.putExtra("dateOfBirth", dataOfBirth);
intent.putExtra("height", height);
intent.putExtra("weight", weight);

// Start ScanDeviceActivity.
startActivity(intent);
```
