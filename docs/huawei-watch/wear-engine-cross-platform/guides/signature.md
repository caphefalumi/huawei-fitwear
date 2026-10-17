<!--
  Title: Obtaining a Signing Certificate Fingerprint on the Wearable Device
  Catalog: connectivity-Guides
  Document ID: signature-0000001053969657
  Updated: 2025-10-13 02:54:08
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/signature-0000001053969657
-->
**
# Obtaining a Signing Certificate Fingerprint on the Wearable Device

- Open [the .cer file](https://developer.huawei.com/consumer/en/doc/harmonyos-guides-V5/ide-signing-V5), and copy information in the last paragraph (from BEGIN CERTIFICATE to END CERTIFICATE) to the new text to create a .cer file. Figure 1 **Creating a cer file (for reference only)**
- Windows: Open the .cer file, and click Details and then Public key to obtain the pubKey. Figure 2 **Windows: obtaining the pubKey (for reference only)** macOS: Run openssl x509 -in test.cer -text -noout in the CLI. Replace test.cer with the name of the new .cer file. Figure 3 **macOS: obtaining the pubKey (for reference only)
- Encode the pubKey to Base64 format. Visit a third-party website (such as [tomeko.net](https://www.tomeko.net/online_tools/hex_to_base64.php?lang=en)) for transferring code, for example, BC5Z9/29Yn93xSa9XkQ2HN5GikugmXjor9se0VwnOENK9t4uFK4VlRpOHv4B3lphjIa7P6Sh61CFRsT0MZNhuV8=.
- Fingerprint information = App package name _base64Encode(pubKey), for example, com.huawei.wearengine_BC5Z9/29Yn93xSa9XkQ2HN5GikugmXjor9se0VwnOENK9t4uFK4VlRpOHv4B3lphjIa7P6Sh61CFRsT0MZNhuV8=. > **Note:** The maximum length of the fingerprint on the lite wearable device is 127 bits.
