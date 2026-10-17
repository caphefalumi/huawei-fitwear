<!--
  Title: Changing the Package Name, Importing the Signing Certificate Fingerprint, and Configuring the JDK Compilation Version
  Catalog: HMSCore-Guides-V5
  Document ID: change-0000001050170085-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/change-0000001050170085-V5
-->
# Changing the Package Name, Importing the Signing Certificate Fingerprint, and Configuring the JDK Compilation Version

#### Changing the App Package Name

Note that the package name must be the same as the one filled in when [applying for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-id-0000001050069756-V5). If it is not, change the app package name as instructed.

To rename the app package name to **com.honor.health** for example, perform the following:

- Change **huawei** to **honor**, by following the instructions in the following figures. > **Note:** If the project file is on the local PC and you can find the location of the project file, rename the project folder directly. Extend the folded path in the project and deselect **Compact Middle Packages**. Change the app package name.

- Repeat the preceding steps to change **healthdemoanna** to **health**.
- Open the **AndroidManifest.xml** file and change the value of **package** to the new package name **com.honor.health**.
- Open the **build.gradle** file and change the value of **applicationId** to the new package name **com.honor.health**. Click **Sync Now**.
- To ensure that the new package name is used project wide, go to **Edit** > **Find** > **Replace in Path** to replace the old package name with the new one.
- Go to **Build** > **Clean Project**.

#### Importing the Signing Certificate Fingerprint

For details about how to import the signing certificate fingerprint, see [Signing Certificate Fingerprint](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/signing-fingerprint-0000001059050363-V5). Note that the signing certificate fingerprint must be the same as the one filled in when [applying for the HUAWEI ID service](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/apply-id-0000001050069756-V5).

#### Configuring the JDK Compilation Version

Step 1 Open the **build.gradle** file in the app root directory.

Step 2 Add the **compileOptions** configuration to **android** in the format shown below.
