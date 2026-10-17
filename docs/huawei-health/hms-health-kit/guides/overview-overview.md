<!--
  Title: Overview
  Catalog: HMSCore-Guides-V5
  Document ID: overview-0000001050124241-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/overview-0000001050124241-V5
-->
**
# Overview

Currently, treadmills, walking pads, cross trainers, rowers, and indoor bikes can access the HUAWEI Health app via Gym Profile.

The fitness machine must support the BLE protocol version 4.2 or later.

#### Experience of Using a Fitness Machine Integrated with HiHealth Kit

## Connecting a Phone to a Fitness Machine via a Tap

The following takes the treadmill usage as an example. The experience with a walking pad, cross trainer, rower, or indoor bike is similar.
Figure 1 **Tapping to connect**

- Connect an NFC-enabled phone to the treadmill via a single tap, or use a phone to scan the QR code on the treadmill to establish the connection.
- The NFC-based connection can be established with a single tap while the phone is displaying the home screen. The user does not have to open the Health app. The running screen will automatically be displayed after the connection is established.
- The patented technology that allows a phone to count steps while being placed in the phone holder is adopted, so that the user does not need to hold or wear their phone during workout.
- Multi-device collaboration can be performed with Huawei watches and bands, providing more information such as heart rate measurement (if supported), running form identification, and more.
- The workout status and data can be displayed on both the phone and treadmill in real time.
- Scientific running guidance offers a more comprehensive running experience for users. The provided information includes high heart rate warning, reasonable heart rate range, warm-up reminder, and landing impact reminder.

## Adding a Fitness Machine to HUAWEI Health App

After the user pairs a device with the HUAWEI Health app, measurements can be performed after setting the related configurations. The measurement data will be transmitted to the phone and be displayed on the HUAWEI Health app.

The user can touch Add on the Devices screen of the Health app, touch a device type, and check the device details. The user can also pair an applicable device if they already have one.
Figure 2 **Adding a device**
#### Benefits of Accessing HiHealth Kit

By accessing HiHealth Kit, your fitness machines will become smarter, providing users with more intelligent experience and promote the product sales.

- You do not need to develop any app for your fitness machines, which can be directly paired with the HUAWEI Health app.
- HiHealth Kit will enable your fitness machines to be part of the vast ecosystem. For example, step counts on treadmills can be synced to WeChat for social connection purposes.
- Users will be able to gain access to scientific workout guidance from HUAWEI Health app after linking the fitness machine.
- Huawei watches and bands can collaboratively provide heart rates, step counts, calories burnt, and more, for the information to be displayed on the fitness machine in real time.
- Users can connect their Huawei phones with a fitness machine via a single tap so that the data can be synced in real time, facilitating user operations.

#### Overview to HiHealth Gym Profile
Figure 3 **HiHealth Gym Profile

HUAWEI HiHealth Kit intelligently interconnects with fitness machines via BLE and BLE Fitness Machine Profile (FTMP). HUAWEI HiHealth Kit provides a set of tools and sample code package HiHealth Gym Profile to help manufacturers develop smart fitness machines in a quicker manner. This helps simplify the access of Bluetooth fitness machines via Fitness Machine Profile and ensures a favorable experience of accessing HiHealth Kit.

- Bluetooth protocols: Information related to the Bluetooth protocol interfaces and interaction process is provided.
- Bluetooth sample code: Sample code for implementing Fitness Machine Profile on the Bluetooth module on the device side is provided for manufacturers to refer to during development. The provisioning of the sample code helps accelerate the development based on the Bluetooth module protocols, and ensure the protocol compliance consistency.
- Integration guide: The API descriptions and integration guides are provided for the Bluetooth sample code, to allow manufacturers to better understand the sample code and quickly complete the integration.
- Test tool: After the Bluetooth module is developed, this tool can be used to test the consistency between the module and the protocol requirements.
- Test cases: Test cases are used with test tools in various scenarios to ensure that protocols are correctly implemented in various scenarios.
