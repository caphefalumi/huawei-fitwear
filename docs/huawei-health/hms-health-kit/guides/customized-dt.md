<!--
  Title: Customized Data Types
  Catalog: HMSCore-Guides-V5
  Document ID: customized-dt-0000001050069716-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/customized-dt-0000001050069716-V5
-->
# Customized Data Types

Health Kit allows you to add customized data types.

> **Note:** However, a customized data type cannot use the namespace of Health Kit, that is, com.huawei. A customized data type must start with the app package name. If the package name starts with com.huawei, the customized data type will conflict with the existing data types of Huawei, and therefore can't be created.

**Creating customized data**

- Client: Create a customized data type by calling the [SettingController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5).[addDataType(DataTypeAddOptions options)](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section11286159181819) method, and read the created customized data types by calling the [SettingController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5).[readDataType(String dataTypeName)](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5#EN-US_TOPIC_0000001053248363__section14289189131815) method. For details, see [SettingController](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/settingcontroller-0000001050089660-V5).

- Server: You can create a customized data type, by creating a data collector (see [Creating a Data Collector](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5)) and specifying the name of the data type and field definitions for it. The following is an example: 
```cpp
POST
https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors
Content-Type: application/json
Authorization: Bearer ***

{
  "collectorName": "DataCollectorExample",
  ...
  "collectorDataType": {
    "field": [
      {
        "name": "customizedField1",
        "format": "integer"
      },
     {
        "name": "customizedField2",
        "format": "float"
      }
    ],
    "name": "customized.datatypename"
  },
  ...
}
```
