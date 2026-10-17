<!--
  Title: About This Kit
  Catalog: harmonyos-guides
  Document ID: connectivity-kit-intro
  Updated: 2026-10-14 09:33:19
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/connectivity-kit-intro
-->
# About This Kit

#### Overview

Mobile devices have become an integral part of everyday life. Connecting Bluetooth headsets to listen to music, using Wi-Fi for Internet access, and tapping NFC-enabled devices to unlock doors are all common user experiences.

To support these scenarios, Bluetooth provides fundamental connectivity capabilities for music playback, voice calls, and content sharing. Wi-Fi provides basic wireless networking capabilities, while NFC enables tap-to-read and tap-to-card interactions.

Connectivity Kit provides these foundational communication capabilities for you to build connected experiences that integrate seamlessly into users' daily lives.

## Bluetooth

Bluetooth is a wireless communication technology that implements short-range data transmission. The Bluetooth technical specifications are formulated by the Bluetooth Special Interest Group (SIG). It can be used to connect a variety of devices, including smartphones, headsets, speakers, keyboards, mouse devices, and printers. Bluetooth features low power consumption, low cost, and ease of use.

Different Bluetooth modules provide APIs applicable to different scenarios, helping developers develop Bluetooth-related features.

- **ACCESS module** Provides capabilities such as enabling and disabling Bluetooth and obtaining the Bluetooth status. You need to enable Bluetooth through this module before using other Bluetooth functions. For details, see [@ohos.bluetooth.access](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-access).
- **CONNECTION module** Provides capabilities such as discovering and pairing Bluetooth devices, as well as obtaining information about the local and peer devices. For details, see [@ohos.bluetooth.connection](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-connection).
- **BLE module** Provides Bluetooth Low Energy (BLE) capabilities, such as discovering devices, sending advertising packets, discovering services, and transmitting data. For details, see [@ohos.bluetooth.ble](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-ble).
- **SOCKET module** Provides capabilities such as connecting and transmitting data between Bluetooth devices over Serial Port Profile (SPP). For details, see [@ohos.bluetooth.socket](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-socket).
- **A2DP module** Establishes Bluetooth connections between devices and transmits high-quality audio over Advanced Audio Distribution Profile (A2DP). For example, this module enables transmission of audio data streams between a phone and audio peripherals (such as headsets and speakers) for music streaming playback. For details, see [@ohos.bluetooth.a2dp](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-a2dp).
- **HFP module** Establishes connections between Bluetooth devices and enables hands-free calls over the Hands-Free Profile (HFP), supporting functions such as two-way voice call and control. For details, see [@ohos.bluetooth.hfp](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-hfp).
- **HID module** Implements communication, wireless control, and data transmission between Bluetooth devices over Human Interface Device Profile (HID). For example, this module enables low-latency bidirectional communication between devices such as keyboards, mouse devices, and gamepads and hosts (such as phones, tablets, and PCs). For details, see [@ohos.bluetooth.hid](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-hid).
- **PAN module** Implements network sharing between devices over Personal Area Network (PAN). For example, this module supports Internet sharing between a phone and a PC. For details, see [@ohos.bluetooth.pan](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-pan).
- **MAP module** Implements message sharing between devices over Message Access Profile (MAP). For example, this module supports SMS message synchronization between a phone and a head unit. For details, see [@ohos.bluetooth.map](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-map).
- **PBAP module** Implements phone book data sharing between devices over Phone Book Access Profile (PBAP). For example, this module supports synchronization of contact and call log data between a phone and a head unit. For details, see [@ohos.bluetooth.pbap](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bluetooth-pbap).

## WLAN

Wireless Local Area Networks (WLANs) are local area networks that transmit and receive data over wireless technologies such as radio waves, infrared signals, or other wireless media. WLANs enable network communication between nodes without requiring physical connections, making them well suited for mobile devices in workplaces and public environments.

The WLAN system provides users with WLAN access (STA mode), peer-to-peer data transmission (P2P mode), and hotspot sharing (AP mode).

- STA (Station) mode Enables a device to operate as a client in a wireless network. A device operating in this mode can connect to another network, such as a home router, and is typically used to provide upstream network connectivity. For details, see [@ohos.wifiManager (WLAN)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-wifimanager).
- P2P mode Also known as Wi-Fi Direct, is a peer-to-peer connection technology that enables two STA devices to establish a TCP/IP connection directly without requiring an access point (AP). One STA acts as the Group Owner (GO), performing the role of a traditional AP, while the other STA acts as the Group Client (GC) and connects to the GO in the same way it connects to an AP. For details, see [@ohos.wifiManager (WLAN)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-wifimanager).
- AP mode Provides downstream network services for client devices in a WLAN. In this mode, the device serves as the central node of the WLAN. For details, see [@ohos.wifiManager (WLAN)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-wifimanager).

## NFC

The Near Field Communication (NFC) service provides functionalities such as NFC switch control, NFC tag read/write, and NFC card emulation.

- NFC switch control Provides APIs for enabling and disabling NFC. Applications that enable or disable NFC must declare the **ohos.permission.MANAGE_SECURE_SETTINGS** permission. Since only system applications can declare this permission, only system applications can enable or disable NFC. For details, see [@ohos.nfc.controller (Standard NFC)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nfccontroller).
- NFC tag read/write Provides capabilities for discovering NFC tags, dispatching them to applications, and allowing applications to access NFC tags through tag read/write APIs. Applications must declare NFC tag read/write capabilities in the required format before they can receive dispatched NFC tags. For details, see [@ohos.nfc.tag (Standard NFC Tags)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nfctag).
- NFC card emulation Provides card emulation capabilities, allowing electronic devices to complete card interactions by tapping an NFC reader. Applications must declare NFC card emulation capabilities in the required format before they can perform card emulation. For details, see [@ohos.nfc.cardEmulation (Standard NFC Card Emulation)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-cardemulation).

## Converged Short-Range Communication

The converged short-range communication service provides unified management of short-range communication technologies in the HarmonyOS system.

- **PartnerAgent service module** Provides interconnection services between partner devices and HarmonyOS devices. Within the module, interconnection services such as media control, phone call reverse control, and health monitoring can be implemented. For details, see [@ohos.FusionConnectivity.partnerAgent (Device Status Notification Module)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-partneragent).
- **Converged ranging module** Provides the NearLink [HADM](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/fusion-connectivity-terminology#high-accuracy-distance-measurement-hadm) ranging service. Within the module, the NearLink HADM ranging capability can be used. For details, see [@ohos.FusionConnectivity.ranging](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-fusionconnectivity-ranging).

## NearLink Overview

NearLink provides a low-power, high-rate short-range communication service, supporting connections and data exchange between NearLink devices.

NearLink provides a variety of APIs for different scenarios such as device discovery, connection, and data transmission, helping you complete NearLink-related development.

- **manager module** Provides capabilities such as querying the NearLink switch state, querying device information, and managing paired devices. For details, see [@ohos.nearlink.manager (Basic NearLink Management Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-manager).
- **advertising module** Provides capabilities such as sending NearLink advertisements, stopping advertisements, and subscribing to advertisement status changes. For details, see [@ohos.nearlink.advertising (NearLink Advertising Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-advertising).
- **scan module** Provides capabilities such as starting NearLink scanning, stopping scanning, subscribing to scan results, and querying scanned device information. For details, see [@ohos.nearlink.scan (NearLink Scanning Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-scan).
- **remoteDevice module** Provides capabilities such as creating a remote device instance, initiating pairing, querying remote device information, and subscribing to device state changes. For details, see [@ohos.nearlink.remoteDevice (NearLink Remote Device Connection Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-remote-device).
- **ssap module** Provides capabilities such as SSAP server/client connection establishment, property read/write, and notification. For details, see [@ohos.nearlink.ssap (NearLink SSAP Connection Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-ssap).
- **dataTransfer module** Provides data transfer capabilities based on port channels. For details, see [@ohos.nearlink.dataTransfer (NearLink Data Transfer Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-data-transfer-api).
- **cdsm module** Provides capabilities such as querying and subscribing to member device information in a coordinated device set. For details, see [@ohos.nearlink.cdsm (CDSM Capability)](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-nearlink-cdsm).

## Working Principles

Connectivity Kit provides basic communication services for applications. Before a communication service is used by an application, the related feature must be enabled or a connection must be set up. When the service ends, the connection must be closed actively.

## Constraints

Device capabilities can be used only after the related switch is enabled after user authorization. Otherwise, the system does not provide services for third-party applications.
