<!--
  Title: Integrating the Wear Engine SDK
  Catalog: connectivity-Guides
  Document ID: integrating-fitnesstwatch-sdk-0000001052859174
  Updated: 2026-10-08 03:24:01
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/integrating-fitnesstwatch-sdk-0000001052859174
-->
# Integrating the Wear Engine SDK

For details about the DevEco Studio development environment, refer to [DevEco Studio User Guide](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V2/deveco_overview-0000001053582387-V2).

- Download the SDK file to the local host and decompress the **wearengine.js** file. SDK on the lite wearable device: [Wear Engine SDK (Lite Wearable Devices)](https://developer.huawei.com/consumer/en/doc/connectivity-Library/litewearable-sdk-cn-0000001705004353) ([SDK на носимых устройствах версии lite](https://developer.huawei.com/consumer/ru/doc/development/connectivity-Library/litewearable-sdk-0000001100540376) for Russian users)
- SDK on the smart wearable device: [Wear Engine SDK (Smart Wearable Devices)](https://developer.huawei.com/consumer/en/doc/connectivity-Library/wearable-sdk-cn-0000001656684902) ([SDK на умных носимых устройствах-JS](https://developer.huawei.com/consumer/ru/doc/development/connectivity-Library/wearable-sdk-0000001147500149) for Russian users)

- Copy the **wearengine.js** file to the code project directory **\entry\src\main\js\default****\pages** and import it to the code. 
```cpp
import { P2pClient, Message, Builder } from '../wearengine.js'
```

> **Note:** When integrating the [Wear Engine SDK (Lite Wearable Devices)](https://developer.huawei.com/consumer/en/doc/connectivity-Library/litewearable-sdk-cn-0000001705004353) SDK for lite wearable devices, use Compile SDK version 10 in DevEco Studio.
