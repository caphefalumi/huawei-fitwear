<!--
  Title: Integration Process
  Catalog: HMSCore-Guides-V5
  Document ID: process-0000001050155599-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/process-0000001050155599-V5
-->
**
# Integration Process
Figure 1 **Integration process

- Communicate with the Huawei BD personnel about the cooperation intention. After signing the cooperation agreement, [obtain the Gym Profile development suite](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/get-gymprofile-0000001054902790-V5).
- [Develop the Bluetooth module functions](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/bluetooth-protocol-0000001054490011-V5) for the fitness machine by referring to this document and the Gym Profile development suite.
- Design and deploy the QR code and NFC label, which are used for a phone to establish the connection with the fitness machine.
- Prepare and submit the required materials to the HUAWEI Developers for approval. The approval is a must for your fitness machine to be able to be added to the Health app (by going to **Devices** > **Add**).
- Use test tools and test cases to test whether the Bluetooth module of the fitness machine meets the requirements for connecting to the HUAWEI Health app.
- Perform the interconnection test with the HUAWEI Health app:Use the HUAWEI Health app and test cases to test the NFC-based one-tap connection and QR code scanning functions. (Smart jump ropes do not support the NFC-based one-tap connection function, and there is no need to test the function for smart jump ropes.)
- Copy the device resource package to the phone and use the HUAWEI Health app and test cases to test whether the device can be added to the app.

- Deliver a sample machine and submit the test report to HUAWEI Developers for certification tests. Huawei will arrange test resources and provide feedback on test results. (Certification tests for treadmills need to be performed by a third-party certification organization.)
- You need to obtain approval from Huawei before releasing any marketing materials mentioning the Huawei brand.
- The product can be officially released only after it passes the certification and its marketing materials are approved.
