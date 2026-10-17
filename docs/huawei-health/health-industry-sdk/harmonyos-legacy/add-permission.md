<!--
  Title: Adding Permissions
  Catalog: huaweihealth-Guides
  Document ID: add-permission-0000002447309645
  Updated: 2026-08-05 02:10:08
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/add-permission-0000002447309645
-->
# Adding Permissions
Declare the permission to access the Internet in **reqPermissions** in the **config.json** file. For details, please refer to [Permission Development Guidelines](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V3/security-permissions-guidelines-0000000000029886-V3).
```cpp
{
    "module": {
        "reqPermissions": [
            {
                "name": "ohos.permission.INTERNET",
                "reason": "access internet",
                "usedScene": {
                    "ability": [
                        "com.mycamera.MainAbility"
                    ],
                    "when": "always"
                }
            }
        ]
    }
}
```
