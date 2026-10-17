<!--
  Title: Obtaining the API Level
  Catalog: HMSCore-Guides-V5
  Document ID: obtains-apilevel-0000001065048142-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/obtains-apilevel-0000001065048142-V5
-->
# Obtaining the API Level

You can call [getApiLevel](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s948cd57ee22e434dbf32dfb54161a96e) to obtain the API level of the Health Kit server. For the API level of each API in the SDK, check the Since attribute of each API in the **HiHealthDataStore** object in [API Reference](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/overview-0000001052660343-V5).

> **Note:** No authorization is required to call [getApiLevel](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sbe51203587aa4ab29832f69c045f429e). For the HUAWEI Health app, the API level is 1 for 11.0.3.504 and later versions and 0 for versions earlier than 11.0.3.504. [getApiLevel](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__sbe51203587aa4ab29832f69c045f429e) is not available for SDK 5.0.0.300 and earlier versions.

- Call [getApiLevel](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s948cd57ee22e434dbf32dfb54161a96e) of the [HiHealthDataStore](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5) object to obtain the API level of the server.
- The query result will be returned via the [ResultCallback](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/resultcallback-0000001071549451-V5) object defined as an input parameter. **Sample code** 
```cpp
HiHealthDataStore.getApiLevel(context, new ResultCallback() {
    @Override
    public void onResult(int resultCode, Object message) {
        if (resultCode == HiHealthError.SUCCESS) {
	    Log.i(TAG, "getApiLevel success");
            if(message instanceof Integer){
                int apiLevel = (int) message;
                Log.i(TAG," apiLevel:" + apiLevel);
            }
	}
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory (M)/Optional (O) |
| --- | --- | --- | --- |
| getApiLevelcallback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory (M)/Optional (O) |
| --- | --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). | M |
| message | Object | API level (int). | M |
