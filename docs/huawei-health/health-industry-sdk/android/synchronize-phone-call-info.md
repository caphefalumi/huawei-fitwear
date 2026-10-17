<!--
  Title: Synchronizing Call State from Phone to Wearable
  Catalog: huaweihealth-Guides
  Document ID: synchronize-phone-call-info-0000002383810346
  Updated: 2026-08-05 02:10:25
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/synchronize-phone-call-info-0000002383810346
-->
# Synchronizing Call State from Phone to Wearable

The Health Industry SDK allows you to synchronize the call state from a phone to a wearable. The call state includes incoming, hangup, answering, and outgoing.

> **Note:** Industry apps listen to the call state, including incoming, hangup, answering, and outgoing, and synchronize the call state from a phone to a wearable via the corresponding API. To do this, industry apps need to request the following permissions dynamically: Permission to access the call state (**android.permission.READ_PHONE_STATE**): Industry apps need this permission to call the API for monitoring the call state. Permission to access call logs (**android.permission.READ_CALL_LOG**): Once granted, the API for monitoring the call state returns the mobile number information of incoming calls. Permission to access contacts (**android.permission.READ_CONTACTS**): Once granted, industry apps can query the contact name of an incoming call from the contacts list based on the incoming call number. Outgoing call listening permission (**android.permission.PROCESS_OUTGOING_CALLS**): Once granted, industry apps can listen to the system's outgoing call state by first registering the **Intent.ACTION_NEW_OUTGOING_CALL** broadcast.

- Call the [getDeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524#EN-US_TOPIC_0000002678163945__getDeviceManageClient-android_content_Context-) method in [IndustryWear](https://developer.huawei.com/consumer/en/doc/health-References/industrywear-0000001434945524) to obtain the [DeviceManageClient](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693) object.
- Obtain the list of paired wearables by referring to [Obtaining the Wearable List](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/get-device-list-0000002372216449). Then, select a target wearable from the list and obtain its ID.
- Construct input data in JSON format for synchronizing the phone call state. 
```cpp
{
    "settingKey":"phoneCallInfo",
    "settingValue": {
        "callState": 0,
        "phoneNumber": "18866666666",
        "name": "John",
        "subscriptionId": 1
    }
}
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| settingKey | phoneCallInfo | Key of the phone call state. |
| settingValue | Fields included: **callState**, **phoneNumber**, **name**, and **subscriptionId** | Value of the phone call state. |
| callState | **0**: incoming **1**: hangup **2**: answer **3**: outgoing | Call state. |
| phoneNumber | Data of the String type | Mobile number. The value contains a maximum of 20 characters, including only digits (0–9), parentheses (()), plus signs (+), and minus signs (–). Make sure at least one digit is included. |
| name | Data of the String type | Name, which contains a maximum of 60 characters. |
| subscriptionId | Optional and required only when **callState** is set to **0** (incoming call) | Subscription ID for the SIM card handling the incoming call. For details about how to obtain the value, please refer to [How Do I Obtain the SubscriptionId Parameter When Calling the API for Setting the Incoming Call State?](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/faq-0000002511427352#section18210143714918) in FAQs. |

- Call the [set](https://developer.huawei.com/consumer/en/doc/health-References/devicemanageclient-0000001485104693#EN-US_TOPIC_0000002648084250__set-java_lang_String-java_lang_String-com_huawei_health_industry_client_callback_ServiceCallback-) method to synchronize the phone call state. 
```cpp
// Obtain the DeviceManageClient object.
DeviceManageClient deviceManageClient = IndustryWear.getDeviceManageClient(this);

// Obtain the list of paired wearables by referring to Obtaining the Wearable List, select a target wearable from the list, and obtain its ID.
String deviceId = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Construct input data in JSON format for synchronizing the phone call state.
JSONObject jsonObject = new JSONObject();
try {
    JSONObject settingValue = new JSONObject();
    settingValue.put("callState", 0);
    settingValue.put("phoneNumber", "18811111111");
    settingValue.put("subscriptionId", 1);
    settingValue.put("name", "John");
    jsonObject.put("settingKey", "phoneCallInfo");
    jsonObject.put("settingValue", settingValue);
} catch (JSONException e) {
    e.printStackTrace();
}

// Call the set method to synchronize the phone call state.
deviceManageClient.set(deviceId, jsonObject.toString(), new ServiceCallback() {
    @Override
    public void onResult(int resultCode, String result) {
        // Process the returned information.
    }
});
```
 
| Parameter | Value | Description |
| --- | --- | --- |
| statusCode | 0, 1, 2, 3, 6, 7, 30 | Result code of the API call. For details, please refer to the universal result codes in [Result Codes](https://developer.huawei.com/consumer/en/doc/huaweihealth-Guides/errorcode-0000002372870401). |
| result | - | If the API call succeeds, an empty string is returned. If the API call fails, an error message is returned. |
