<!--
  Title: FAQs
  Catalog: huaweihealth-Guides
  Document ID: faq-0000002511427352
  Updated: 2026-08-05 02:10:02
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/faq-0000002511427352
-->
# FAQs

#### 1. How Do I Obtain the UDID of a Smart Watch?

- Go to **Settings** > **About** on your smart watch and keep tapping the build number until a message indicating that you have entered the developer mode is displayed.
- Go to **Settings** > **Developer options** and enable **HDC debugging**.
- Connect the smart watch to the PC, start the command line tool on the PC, and go to the HDC directory (usually *HarmonyOS SDK installation directory*/**toolchains**/*{Version number}*). Then run the **hdc shell bm get --udid** command to obtain the UDID.

#### 2. How Do I Query the Charging Status of a Device?

Import the **batteryInfo** module. The **chargingStatus** attribute of **batteryInfo** indicates the charging status of the current device. The following is an example:

```cpp
import batteryInfo from '@ohos.batteryInfo';

let chargingStatusInfo = batteryInfo.chargingStatus;
console.info("The chargingStatusInfo is: " + chargingStatusInfo);
```

#### 3. How Do I Subscribe to or Unsubscribe from the Device Wearing Status?

- Import the **sensor** module and call **sensor.on** to subscribe to the device wearing status. The following is an example: 
```cpp
import sensor from "@ohos.sensor";
import BusinessError from "@ohos.base";

try {
  sensor.on(sensor.SensorId.WEAR_DETECTION, (data: sensor.WearDetectionResponse) => {
    console.info('Succeeded in invoking on. Wear status: ' + data.value);
  }, { interval: 100000000 });
} catch (error) {
  let e: BusinessError.BusinessError = error as BusinessError.BusinessError;
  console.error(`Failed to invoke on. Code: ${e.code}, message: ${e.message}`);
}
```

- Call **sensor.off** to unsubscribe from the device wearing status. The following is an example: 
```cpp
import sensor from "@ohos.sensor";
import BusinessError from "@ohos.base";

try {
  sensor.off(sensor.SensorId.WEAR_DETECTION);
} catch (error) {
  let e: BusinessError.BusinessError = error as BusinessError.BusinessError;
  console.error(`Failed to invoke off. Code: ${e.code}, message: ${e.message}`);
}
```

#### 4. How Do I Subscribe to or Unsubscribe from the Device Battery or Charging Status?

- Create a subscriber object. The following is an example: 
```cpp
import commonEventManager from '@ohos.commonEventManager';
import Base from '@ohos.base';

// Subscriber information.
let subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
  events: [commonEventManager.Support.COMMON_EVENT_BATTERY_CHANGED] // Common event triggered when the battery charging status, level, or other information changes.
};
let subscriber: commonEventManager.CommonEventSubscriber; // Subscriber object, which is used for subsequent subscription and unsubscription.

// Create a subscriber.
try {
  commonEventManager.createSubscriber(subscribeInfo, (err, commonEventSubscriber) => {
    if(!err) {
      console.info("createSubscriber");
      subscriber = commonEventSubscriber;
    } else {
      console.error(`createSubscriber failed, code is ${err.code}, message is ${err.message}`);
    }
  });
} catch (error) {
  let err:Base.BusinessError = error as Base.BusinessError;
  console.error(`createSubscriber failed, code is ${err.code}, message is ${err.message}`);
}
```

- Subscribes to a common event. The following is an example of subscribing to the device battery status. Subscribing to the device charging status is similar. 
```cpp
import commonEventManager from '@ohos.commonEventManager';
import Base from '@ohos.base';
import batteryInfo from '@ohos.batteryInfo';

let subscribeInfo: commonEventManager.CommonEventSubscribeInfo = {
  events: [commonEventManager.Support.COMMON_EVENT_BATTERY_CHANGED]
};
let subscriber: commonEventManager.CommonEventSubscriber;
let curBatteryLevel: number = 0; // Save the current device battery level.

try {
  commonEventManager.createSubscriber(subscribeInfo, (err, commonEventSubscriber) => {
    if(!err) {
      console.info("createSubscriber");
      subscriber = commonEventSubscriber;
      curBatteryLevel = batteryInfo.batterySOC;

      // Subscribe to a common event.
      commonEventManager.subscribe(subscriber, (err, data) => {
        if (err) {
          console.error(`subscribe failed, code is ${err.code}, message is ${err.message}`);
        } else {
          console.info("subscribe");
          let params: Record<string, number> = data?.parameters as Record<string, number>;
          if (params.soc != curBatteryLevel) { // If the device battery level when the event is triggered is different from the current device battery level, the device battery level changes.
            curBatteryLevel = params.soc;
            // Processing logic
          }
        }
      });
    } else {
      console.error(`createSubscriber failed, code is ${err.code}, message is ${err.message}`);
    }
  });
} catch (error) {
  let err:Base.BusinessError = error as Base.BusinessError;
  console.error(`createSubscriber failed, code is ${err.code}, message is ${err.message}`);
}
```

- Unsubscribe from the common event. The following is an example: 
```cpp
// Unsubscribe from the common event.
// Note: The subscriber object used here must be the same as that used for common event subscription in step 2.
try {
  commonEventManager.unsubscribe(subscriber, (err) => {
    if (err) {
      console.error(`unsubscribe failed, code is ${err.code}, message is ${err.message}`);
    } else {
      console.info("unsubscribe");
    }
  });
} catch (error) {
  let err:Base.BusinessError = error as Base.BusinessError;
  console.error(`unsubscribe failed, code is ${err.code}, message is ${err.message}`);
}
```

#### 5. How Do I Handle Status Code 5 (Authorization Certificate Verification Failure)?

- Method 1: Check whether your phone can connect to the Internet.
- Method 2: Check whether the development/commercial certificate supports the connected wearable.
- Method 3: Check whether the difference between your phone's system time and the actual time is too large, for example, over 10 minutes.
- Method 4: For an Android and HarmonyOS 3.1/4.0 app, ensure that the package name and SHA-256 signing certificate fingerprint of the app match those recorded during certificate application, and check whether the signing configuration in the **build.gradle** file is correct. For an app running HarmonyOS 5 or later, ensure that the package name of the app is the same as that selected during certificate application. If the issue persists, try calling other APIs 300 ms after calling the authentication API. **To check whether the package name and SHA-256 signing certificate fingerprint of the app are the same as those in the certificate:** **Check the package name of the signed app:** 1. Connect your phone to the computer and open the app to be checked. 2. Open CMD on the computer (with ADB installed), and run the following command: 
```cpp
adb shell dumpsys window | findstr mCurrentFocus
```
 Information in the red box in the following command output is the app package name: **Check the signing certificate fingerprint of the signed app:** Open CMD on the computer and run the following command: 
```cpp
keytool -list -printcert -jarfile Absolute path of the APK
```
 > **Note:** If the app is a HarmonyOS app (.hap), decompress the HAP file and then check the APK signature information. **Check the app package name and fingerprint in the certificate:** Decode the certificate (.cer) using Base64 to view the certificate content. The decoded information includes: **packageName**: app package name in the certificate.

- **appFingerprint**: fingerprint in the certificate.

#### 6. What Can I Do If Device Connection Fails?

- Method 1: Check the wearable version. It is recommended that you update the wearable to the latest version and try again.
- Method 2: Check whether the JDK version of the compilation tool is 1.8 by going to **File** > **Settings** > **Gradle**. Check whether JDK 1.8 is selected for the project by going to **File** > **Project Structure** > **Modules**.

#### 7. Under What Circumstances Will the Wearable Fail to Reconnect to the Phone Automatically via Bluetooth?

- The devices are disconnected by proactive API calling.
- Bluetooth is not enabled on the phone or wearable.
- The devices have been disconnected for more than 5 minutes.
- Location is not enabled on the phone running Android 10 or later.

#### 8. What Can I Do If Heart Rate 0 or 255 Is Returned by the API After I Subscribe to Real-Time Heart Rate Data?

**0** and **255** are transient abnormal data. This may be because the watch is worn improperly or loosely. Please filter out such abnormal data.

#### 9. How Do I Handle Status Code 6 Returned When I Subscribe to the Real-Time Heart Rate and Workout Linkage Data?

Ensure that the wearable is worn before making the subscription.

#### 10. How Do I Obtain Health Industry SDK Logs?

With the log switch enabled, the Health Industry SDK prints only error logs, which are stored locally on phones. To find the logs, open Android Studio and go to the following directory using Device File Explorer: **data/data/*App package name*/files**.

```cpp
Example:
data/data/com.huawei.health.demo/files
```

#### 11. What Can I Do If the Wearable Cannot Be Detected by My App?

- Method 1: Go to **Settings** > **System & updates** > **Connect new phone** on the wearable.
- Method 2: If your app always requires two scan attempts to detect the wearable, the issue may lie with the time required for the system to enable Bluetooth. It is recommended that you wait for 3 to 5 seconds (depending on the phone's hardware capability) after enabling Bluetooth.
- Method 3: The issue may lie with the wearable. Use another wearable and try again.

#### 12. What Is the Recommended Scanning and Pairing Process?

- Register a connection status listener.
- Call [addDevice](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__addDevice-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) to add a wearable.

#### 13. When Will the Certificate Be Loaded?

The certificate will be read and authenticated after your app detects a device and calls [addDevice](https://developer.huawei.com/consumer/en/doc/health-References/deviceconnectclient-0000001435104800#EN-US_TOPIC_0000002648084238__addDevice-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) to add it.

#### 14. What Can I do If No Notification Is Displayed on the Device After the Device Is Detected?

- Case 1: Authentication fails. Troubleshooting: If status code **5** is returned by **addDevice**, authentication fails.
- Case 2: Too many attempts. Try again later.

#### 15. What Can I Do If a Message Indicating Pairing Failure Is Displayed After I Tap the Pairing Button on the Device?

Ensure that the wearable model is in the supported device list. You can go to **Settings** > **About** on the wearable or go to the initial pairing screen to check the device advertising name. The device advertising name should contain information like **B10**, **B20**, **B5**, or **B7**, instead of those like **GT 3** or **WATCH 3** intended for consumers.

#### 16. Which Status Code Indicates a Successful Bluetooth Connection?

**statusCode** returned as **0** indicates only the API call success; **connectionStatus** returned as **2** indicates the connection success.

#### 17. What Can I Do If the Data Reported Is 0?

- If workout linkage data is queried: **0** is reported when the data cannot be directly reported and needs to be calculated using other methods.
- If daily activity data or historical data is queried: **0** may be reported when the end time of the query is the current moment (especially when the end time is accurate to minutes, for example, 14:00:00). This is because there is a delay in data processing on the wearable, and the wearable may not be able to obtain the data at the current moment. It is recommended that the query end time be 1 minute earlier than the current time.

#### 18 What Is deviceId Used for and When Will It Change?

A new **deviceId** (not the device SN) is generated each time **addDevice** is called for device pairing and connection.

**deviceid** remains unchanged when:

- **connectDevice** is called after Bluetooth is disabled and then re-enabled.
- The connection status listener is unregistered and then re-registered.

#### 19. Do I Need to Unregister the Connection Status Listener After the Connection Is Successful?

You are advised not to unregister the connection status listener. If you unregister it, you will not be able to know the device connection status.

#### 20. Why Does the Connection Status Change from 1 to 3, to 1 Again, and Then to 2 If the Device Is Reconnected Immediately After the Device Deletion or Disconnection API Is Called?

There may be a delay when the Android system of an earlier version processes the Bluetooth disconnection state. Therefore, it is recommended that you wait for more than 6s after calling the disconnection API, and then call the connection API.

#### 21. What Can I Do If There Is No Response or Only Some Devices Are Detected When the Device Scanning API Is Called?

Ensure that Bluetooth and GPS are enabled on your phone, and you have applied for the location permission.

Ensure that there are industry wearables nearby and Bluetooth is enabled on them. Wait for 15 seconds and scan for the wearables again.

Ensure that the devices to be scanned have been unpaired.

#### 22. What Can I Do If the Program Terminates Unexpectedly When Calling an API Containing ServiceCallback?

Ensure that **ServiceCallback** is not **null** when calling an API. You can also capture **IllegalArgumentException** to prevent the program from terminating unexpectedly.

#### 23. How Do I Obtain the SubscriptionId Parameter When Calling the API for Setting the Incoming Call State?

Step 1: Dynamically apply for the **READ_PHONE_STATE** permission and call the **SubscriptionManager.getActiveSubscriptionInfoList()** method to obtain **SubscriptionInfo** of the currently activated SIM card.

Step 2: Call **TelephonyManager.getCallState()** or other methods to obtain **SubscriptionId** of the SIM card in the incoming call state.

The following is an example:

```cpp
/**
 * Obtain SubscriptionId of the SIM card in the incoming call state.
 *
 * @return SubId of the SIM card in the incoming call state.
 */
public static int getSubIdForIncomingCall(Context context) {
    List<Integer> simSubIds = getSimSubscriptionIds(context);
    if (simSubIds.isEmpty()) {
        return ERROR_SUBSCRIPTION_ID;
    }

    // Only one SIM card is inserted.
    if (simSubIds.size() == SINGLE_SIM) {
        Log.w(TAG, "getSubscriptionIdForIncomingState single sim subId:" + simSubIds.get(0));
        return simSubIds.get(0);
    }

    // Two SIM cards are inserted.
    Object systemService = BaseApplication.getContext().getSystemService(Context.TELEPHONY_SERVICE);
    if (!(systemService instanceof TelephonyManager)) {
        return ERROR_SUBSCRIPTION_ID;
    }
    TelephonyManager telephonyManager = (TelephonyManager) systemService;
    int subIdForIncomingCall;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        subIdForIncomingCall = getSubIdForIncomingCallForHighVersion(telephonyManager, simSubIds);
    } else {
        subIdForIncomingCall = getSubIdForIncomingCallForLowVersion(telephonyManager, simSubIds);
    }
    return subIdForIncomingCall;
}

/**
 * Obtain SubscriptionId of the SIM card in dual-SIM mode.
 *
 * @return subId list.
 */
private static List<Integer> getSimSubscriptionIds(Context context) {
    List<Integer> subList = new ArrayList<>();
    boolean hasReadCallLogPermission =
        ContextCompat.checkSelfPermission(context, Manifest.permission.READ_PHONE_STATE) == PackageManager.PERMISSION_GRANTED;
    if (!hasReadCallLogPermission) {
        Log.w(TAG, "getSimSubscriptionIds does not have READ_PHONE_STATE permission");
        return subList;
    }
    SubscriptionManager sm = SubscriptionManager.from(BaseApplication.getContext());
    List<SubscriptionInfo> infoList = sm.getActiveSubscriptionInfoList();
    for (SubscriptionInfo subscriptionInfo : infoList) {
        subList.add(subscriptionInfo.getSubscriptionId());
    }
    return subList;
}

/**
 * Obtain SubscriptionId of the SIM card in the incoming call state, for Android 12 or later (SDK 31 or later).
 *
 * @param telephonyManager telephonyManager
 * @param simSubIds subscriptionId list.
 * @return SubscriptionId of the SIM card in the incoming call state.
 */
@RequiresApi(api = Build.VERSION_CODES.S)
private static int getSubIdForIncomingCallForHighVersion(TelephonyManager telephonyManager, List<Integer> simSubIds) {
    for (Integer subId : simSubIds) {
        if (subId == null) {
            continue;
        }
        TelephonyManager telephonyManagerForSubId = telephonyManager.createForSubscriptionId(subId);
        if (ActivityCompat.checkSelfPermission(BaseApplication.getContext(),
            Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
            Log.i(TAG, "getSubIdForIncomingCallForHighVersion does not have READ_phone_STATE permission");
            return ERROR_SUBSCRIPTION_ID;
        }
        int callState = telephonyManagerForSubId.getCallStateForSubscription();
        int subscriptionId = telephonyManagerForSubId.getSubscriptionId();
        Log.i(TAG, "getSubIdForIncomingCallForHighVersion callState: " + callState + ", subId:" + subscriptionId);

        if (callState == TelephonyManager.CALL_STATE_RINGING) {
            return subscriptionId;
        }
    }
    return ERROR_SUBSCRIPTION_ID;
}

/**
 * Obtain SubscriptionId of the SIM card in the incoming call state, for Android versions earlier than 12 (SDK earlier than 31).
 *
 * @param telephonyManager telephonyManager
 * @param simSubIds subscriptionId list.
 * @return SubscriptionId of the SIM card in the incoming call state.
 */
private static int getSubIdForIncomingCallForLowVersion(TelephonyManager telephonyManager, List<Integer> simSubIds) {
    Class<TelephonyManager> clazz = TelephonyManager.class;
    try {
        Method method = clazz.getDeclaredMethod(GET_CALL_STATE, int.class);
        method.setAccessible(true);
        for (Integer simSubId : simSubIds) {
            Object value = method.invoke(telephonyManager, simSubId);
            if (!(value instanceof Integer)) {
                continue;
            }
            int callState = (int) value;
            Log.i(TAG, "getSubIdForIncomingCallForLowVersion callState:" + callState +
                " multiSimSubId:" + simSubId);
            if (callState == TelephonyManager.CALL_STATE_RINGING) {
                return simSubId;
            }
        }
    } catch (SecurityException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
        Log.e(TAG, "getSubIdForIncomingCallForLowVersion han an exception");
    }
    return ERROR_SUBSCRIPTION_ID;
}
```

#### 24. How Do I Call the System API to Send an SMS Message After the Device Reports an Operation of Call Rejection via SMS?

Step 1: Dynamically apply for the **SEND_SMS** permission and call the **SmsManager.getSmsManagerForSubscriptionId()** method to obtain **SmsManager**.

Step 2: Use the **sendTextMessage** method of **SmsManager** to send an SMS message.

The following is an example:

```cpp
SmsManager smsManager = SmsManager.getSmsManagerForSubscriptionId(subscriptionId);
Intent sendIntent = new Intent("device_reject_send_sms_action");
PendingIntent sentPendingIntent = PendingIntent.getBroadcast(context, 0, sendIntent,
    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
String replyContent = "Sorry, I am in a meeting. I will reply to you later.";
smsManager.sendTextMessage(phoneNumber,null, replyContent, sentPendingIntent, null);
```

#### 25. How Do I Obtain Phone Contact Data?

Step 1: Dynamically apply for the **READ_CONTACTS** permission.

Step 2: Create the **ContactInfo** class to save the obtained contact information. The following is an example:

```cpp
public class ContactInfo {
    private String name;
    private String phoneNumber;

    public ContactInfo(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public String toString() {
        return "ContactInfo{" +
                "name='" + name + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                '}';
    }
}
```

Step 3: Query contact data using **ContentResolver** and sort the obtained contact data. The following is an example:

```cpp
private void readContacts() {
    ContentResolver contentResolver = getContentResolver();
    Cursor cursor = contentResolver.query(ContactsContract.Contacts.CONTENT_URI, null, null, null, null);
    if (cursor != null && cursor.moveToFirst()) {
        List<ContactInfo> contactsList = new ArrayList<>();
        do {
            String id = cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.Contacts._ID));
            String displayName = cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.Contacts.DISPLAY_NAME));
            String hasPhone = cursor.getString(cursor.getColumnIndexOrThrow(ContactsContract.Contacts.HAS_PHONE_NUMBER));
            if ("1".equals(hasPhone)) {
                Cursor phoneCursor = contentResolver.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI,
                    null, ContactsContract.CommonDataKinds.Phone.CONTACT_ID + " = ?", new String[]{id}, null);
                if (phoneCursor != null && phoneCursor.moveToFirst()) {
                    String phoneNumber = phoneCursor.getString(phoneCursor.getColumnIndexOrThrow(ContactsContract.CommonDataKinds.Phone.NUMBER));
                    contactsList.add(new ContactInfo(displayName, phoneNumber));
                    phoneCursor.close();
                }
            }
        } while (cursor.moveToNext());
        cursor.close();
        // Sort the contact list in alphabetical order.
        Collections.sort(contactsList, new Comparator<ContactInfo>() {
            final Collator collator = Collator.getInstance(Locale.CHINA);
            @Override
            public int compare(ContactInfo o1, ContactInfo o2) {
                return collator.compare(o1.getName(), o2.getName());
            }
        });
    }
}
```

#### 26. How Do I Handle the Issue Where an Industry App in the Foreground Moves to the Background After Screen-off and Wake-up?

Add metadata to **abilities** in the **module.json5** file. The sample code is as follows:

```cpp
"abilities": [
    {
        ...,
        "metadata": [
            {
                "name": "aodInWatchface",
                "value": "true"
            },
            {
                "name": "alwaysOnTop",
                "value": "true"
            },
        ]
    }
]
```
