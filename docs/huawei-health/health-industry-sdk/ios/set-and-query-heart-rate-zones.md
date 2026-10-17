<!--
  Title: Setting and Querying Heart Rate Zones
  Catalog: huaweihealth-Guides
  Document ID: set-and-query-heart-rate-zones-0000002624549027
  Updated: 2026-08-05 02:10:31
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/set-and-query-heart-rate-zones-0000002624549027
-->
# Setting and Querying Heart Rate Zones

This section describes how to set and query workout heart rate zones. During workout, the wearable determines the current heart rate zone based on the user's actual heart rate and displays the corresponding workout status.

> **Note:** The heart rate zones are comprised of six descending heart rate values (unit: beats/min), which represent the maximum heart rate (upper limit of extreme zone), lower limit of extreme zone (upper limit of anaerobic zone), lower limit of anaerobic zone (upper limit of aerobic zone), lower limit of aerobic zone (upper limit of fat-burning zone), lower limit of fat-burning zone (upper limit of warm-up zone), and lower limit of warm-up zone, respectively. These six heart rate values together define five heart rate zones, corresponding to the following workout statuses: extreme, anaerobic endurance, aerobic endurance, fat-burning, and warm-up. Heart rate zone value setting rules: Maximum heart rate > lower limit of extreme zone > lower limit of anaerobic zone > lower limit of aerobic zone > lower limit of fat-burning zone > lower limit of warm-up zone Each heart rate zone value must fall within the range of 30% of the maximum heart rate to the maximum heart rate. The valid range of the maximum heart rate is [100, 220].

- Import required modules.
- Obtain the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object by referring to [Obtaining Connected Devices](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-0000002594269394).
- Call the [setHeartRateZones](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section18716241119) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to set heart rate zones. 
```cpp
// Import required modules.
import IndustrySDK

Task {
    do {
        // Obtain the Device object.
        let device = try IndustryService.getDeviceManager().getDevice()

        // Heart rate zone parameters.
        let heartRateZones = [210,180,150,120,90,70]

        // Call the setHeartRateZones method of the Device object to set heart rate zones.
        try await device.setHeartRateZones(heartRateZones: heartRateZones)

        // The heart rate zones are set successfully.
        print("Succeeded in setting heartRateZones")
    } catch let err as IndustryError {
        // Failed to set the heart rate zones.
        print("Failed to set heartRateZones. Code: \(err.code), message: \(err.message)")
    }
}
```

- Call the [getHeartRateZones](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section9858217417) method of the [Device](https://developer.huawei.com/consumer/en/doc/health-References/industry_service_ios-0000002624668977#section15492171716504) object to query heart rate zones. 
```cpp
Task {
    do {
        // Call the getHeartRateZones method of the Device object to query heart rate zones.
        let heartRateZones = try await device.getHeartRateZones()

        // The heart rate zones are queried successfully.
        print("Succeeded in getting heartRateZones, heartRateZones: \(heartRateZones)")
    } catch let err as IndustryError {
        // Failed to query the heart rate zones.
        print("Failed to get heartRateZones. Code: \(err.code), message: \(err.message)")
    }
}
```
