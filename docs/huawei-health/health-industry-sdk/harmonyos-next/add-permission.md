<!--
  Title: Adding Permissions
  Catalog: huaweihealth-Guides
  Document ID: add-permission-0000002376394485
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/add-permission-0000002376394485
-->
# Adding Permissions
You need to declare the network access permission in **requestPermissions** of the **module.json5** configuration file. For details, please refer to [Declaring Permissions](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/declare-permissions-V5).
```cpp
{
  "module" : {
    // ...
    "requestPermissions":[
      {
        "name" : "ohos.permission.INTERNET",
        "reason": "$string:reason",
        "usedScene": {
          "abilities": [
            "FormAbility"
          ],
          "when":"always"
        }
      }
    ]
  }
}
```
