<!--
  Title: App Package Name
  Catalog: HMSCore-Guides-V5
  Document ID: package-name-0000001059578777-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/package-name-0000001059578777-V5
-->
# App Package Name

#### Overview

When using Android Studio to create a project, you need to enter the app package name. The package name must comply with industry standards. Generally, the level-1 package name is **com**, the level-2 package name is the company or personal domain name or email address, the level-3 package name is the app attribute name, and the level-4 or higher package name is the function module name of the app.

After the project is created, the file structure of the project matches the app package name. As a matter of fact, the name of the software package is defined by the project directory structure. As shown below, the package name is **com.huawei.healthdemoanna**.

#### Changing the App Package Name

To rename the app package name to **com.honor.health** for example, perform the following:

- Change **huawei** to **honor**. > **Note:** If the project file is on the local PC and you can find the location of the project file, rename the project folder directly. Extend the folded path in the project and deselect **Compact Middle Packages**. Change the app package name.

- Repeat the preceding steps to change **healthdemoanna** to **health**.
- Open the **AndroidManifest.xml** file and change the value of **package** to the new package name **com.honor.health**.
- Open the **build.gradle** file and change the value of **applicationId** to the new package name **com.honor.health**. Click **Sync Now**.
- To ensure that the new package name is used project wide, go to **Edit** > **Find** > **Replace in Path** to replace the old package name with the new one.
- Go to **Build** > **Clean Project**.
