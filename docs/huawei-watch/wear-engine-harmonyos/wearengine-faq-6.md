<!--
  Title: Result code 206 is displayed when the phone is communicating with a lite wearable device
  Catalog: harmonyos-guides
  Document ID: wearengine_faq-6
  Updated: 2026-10-14 09:34:13
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_faq-6
-->
# Result code 206 is displayed when the phone is communicating with a lite wearable device

- The bundle name or certificate fingerprint of the phone does not match that of the wearable device. On the lite wearable device: The bundle name and fingerprint information of the phone need to be added to the trustlist.
- On the phone: The bundle name and fingerprint information of the lite wearable device need to be configured properly.

- The lite wearable device app is not running in the foreground.
- There is no registered message receiver in the lite wearable device app or in the phone app.
- The message sent is empty.
- Bluetooth is not connected.
