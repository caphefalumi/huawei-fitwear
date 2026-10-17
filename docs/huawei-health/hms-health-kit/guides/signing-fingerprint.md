<!--
  Title: Signing Certificate Fingerprint
  Catalog: HMSCore-Guides-V5
  Document ID: signing-fingerprint-0000001059050363-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/signing-fingerprint-0000001059050363-V5
-->
# Signing Certificate Fingerprint

#### Creating the Signing Certificate Fingerprint for the App

- Open the command line tool and run **keytool** to check whether the command can be executed.
```cpp
keytool
```
 If a message is displayed indicating that the command is neither an internal or external command nor an executable program, verify that the JDK has been installed and environment variables have been configured. If environment variables are not configured, run **keytool** based on the JDK installation path.
- Run the following command:
```cpp
keytool -genkey -alias key -keyalg RSA -keystore d:key.keystore -validity 365
```
 **genkey** indicates that the operation is to generate a key.
- **alias** specifies the alias of the generated key pair, which is **key** in this example.
- **keyalg** specifies the algorithm for generating the key, which is **RSA** in this example.
- **validity** specifies the validity period of the certificate in days, which is 365 in this example.
- **keystore** specifies the storage path of the keystore, which is drive D in this example.

You can modify the description as required.

- Enter the keystore password as prompted, for example, 123456abc. Enter the new password 123456abc again.
- Enter your name, company, organization, and location as prompted.
- Verify your entered information. Enter y to confirm the information. Enter n to re-enter your information.
- Enter the key password, which can be the same as the previous one, for example, 123456abc.

- The signing certificate fingerprint is now created. Find the keystore file in drive D.

#### Obtaining the SHA-256 Fingerprint Corresponding to the Signing Certificate Fingerprint

- Open the command line tool and run the following command:
```cpp
keytool -list -v -keystore d:key.keystore
```

- Enter the keystore password as prompted, which is 123456abc. Obtain the SHA-256 fingerprint from the command output.

#### Importing the Signing Certificate Fingerprint to the App

Import the **key.keystore** file in disk D to the **Store File** directory. Enter the password and alias set when creating the signing certificate fingerprint. After the import is finished, open the **build.gradle** file of the app to view the import result.
