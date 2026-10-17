<!--
  Title: Device
  Catalog: connectivity-References
  Document ID: device-0000001059980971
  Updated: 2025-01-08 08:25:25
  Source: https://developer.huawei.com/consumer/en/doc/development/connectivity-References/device-0000001059980971
-->
# Device

| java.lang.Object \|---com.huawei.wearengine.device.Device 
```
public class Device
extends java.lang.Object
implements android.os.Parcelable
```
 |
| --- |

It is the data class returned by the wearable device that is integrated with Wear Engine.

#### Field Summary

| Modifier and Type | Field and Description |
| --- | --- |
| static int | [DEVICE_CONNECTED](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__DEVICE_CONNECTED) Indicates that the connection is successful. |
| static int | [DEVICE_CAPABILITY_SUPPORT](#section475318227540) Indicates that the capability is supported. |
| static int | [DEVICE_CAPABILITY_NOT_SUPPORT](#section204551958575) Indicates that the capability is not supported. |
| static int | [DEVICE_CAPABILITY_UNKNOWN](#section76763421578) Indicates that whether the capability is supported or not is unknown. |

#### Method Summary

| Modifier and Type | Method and Description |
| --- | --- |
| java.lang.String | [getModel](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__getModel--)() Obtains the device model. |
| java.lang.String | [getName](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__getName--)() Obtains the device name. |
| int | [getProductType](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__getProductType--)() Obtains the product type. **0**: wearable product. |
| java.lang.String | [getReservedness](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__getReservedness--)() Obtains the value of a reserved field. |
| java.lang.String | [getSoftwareVersion](#section172824191612)() Obtains the wearable device's version. |
| java.lang.String | [getUuid](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__getUuid--)() Obtains the unique device ID: UUID. |
| boolean | [isConnected](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__isConnected--)() Determines whether the device is connected (**true**: connected; **false**: not connected). |
| void | [setConnectState](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__setConnectState-int-)(int connectState) Sets the device connection status. (**2**: The connection is successful; **3**: The connection is disconnected; **4**: The connection fails; **5**: A wearable device has been removed from the Huawei Health app.) |
| void | [setModel](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__setModel-java_lang_String-)(java.lang.String model) Sets the device model. |
| void | [setName](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__setName-java_lang_String-)(java.lang.String name) Sets the device name. |
| void | [setProductType](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__setProductType-int-)(int productType) Sets the product type. **0**: wearable product. |
| void | [setReservedness](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__setReservedness-java_lang_String-)(java.lang.String reservedness) Sets the value of the reserved field. |
| void | [setUuid](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__setUuid-java_lang_String-)(java.lang.String uuid) Sets the UUID of a device. |
| int | [getP2pCapability](#section10259112594716)() Obtains whether the app-to-app message communications capability is supported. |
| int | [getMonitorCapability](#section599145914319)() Obtains whether the status query and subscription capability is supported. |
| int | [getNotifyCapability](#section165631894415)() Obtains whether the template-based notifications on wearable devices capability is supported. |
| java.lang.String | [getDeviceCategory](#EN-US_TOPIC_0000001873951338__section2041011520614)() Obtains the all-scenario category to which the device belongs. |
| int | [getDeviceType](#section1897065074420)() Obtains the device type. |
| java.lang.String | [toString](https://developer.huawei.com/consumer/en/doc/connectivity-References/device-0000001059980971#EN-US_TOPIC_0000001873951338__toString--)() |
   
| Methods inherited from class java.lang.Object |
| --- |
| clone, finalize, getClass, notify, notifyAll, wait, wait, wait |

#### Field Detail

## DEVICE_CONNECTED

public static final int DEVICE_CONNECTED

It indicates successful connection.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p289134343184526)

## DEVICE_CAPABILITY_SUPPORT

public static final int DEVICE_CAPABILITY_SUPPORT

It indicates that the capability is supported.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p289134343184526)

## DEVICE_CAPABILITY_NOT_SUPPORT

public static final int DEVICE_CAPABILITY_NOT_SUPPORT

It indicates that the capability is not supported.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p289134343184526)

## DEVICE_CAPABILITY_UNKNOWN

public static final int DEVICE_CAPABILITY_UNKNOWN

It indicates that whether the capability is supported or not is unknown.

**See Also:**

[Constant Field Values](https://developer.huawei.com/consumer/en/doc/connectivity-References/constant-values-0000001050978245#EN-US_TOPIC_0000001920110425__p289134343184526)

#### Method Detail

## getName

public java.lang.String getName()

It is used to obtain the device name.

**Returns:**

Device name

**Since:**

API level 0 (SDK 5.0.0.301)

## setName

public void setName(java.lang.String name)

It is used to set the device name.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| name | Device name. |

**Since:**

API level 0 (SDK 5.0.0.301)

## getUuid

public java.lang.String getUuid()

It is used to obtain the UUID of a device.

**Returns:**

Unique ID of a device: UUID.

**Since:**

API level 0 (SDK 5.0.0.301)

## setUuid

public void setUuid(java.lang.String uuid)

It is used to set the UUID of a device.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| uuid | Unique ID of a device: UUID. |

**Since:**

API level 0 (SDK 5.0.0.301)

## getModel

public java.lang.String getModel()

It is used to obtain the device model.

**Returns:**

Device model.

**Since:**

API level 0 (SDK 5.0.0.301)

## setModel

public void setModel(java.lang.String model)

It is used to set the device model.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| model | Device model. |

**Since:**

API level 0 (SDK 5.0.0.301)

## getProductType

public int getProductType()

It is used to obtain the product type. **0**: wearable product.

**Returns:**

Product type. **0**: wearable product.

**Since:**

API level 0 (SDK 5.0.0.301)

## setProductType

public void setProductType(int productType)

It is used to set the product type. **0**: wearable product.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| productType | Product type. **0**: wearable product. |

**Since:**

API level 0 (SDK 5.0.0.301)

## setConnectState

public void setConnectState(int connectState)

It is used to set the device connection status. (**1**: Connecting; **2**: Connection successful; **3**: Disconnected; **4**: Connection fails; **5**: Device has been removed from the Huawei Health app.)

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| connectState | Connection status. **1**: Connecting; **2**: Connection successful; **3**: Disconnected; **4**: Connection fails; **5**: Device has been removed from the Huawei Health app. |

**Since:**

API level 0 (SDK 5.0.0.301)

## isConnected

public boolean isConnected()

It is used to determine whether the device is connected (**true**: connected; **false**: not connected).

**Returns:**

Whether the device is connected. **true**: connected; **false**: not connected.

**Since:**

API level 0 (SDK 5.0.0.301)

## getReservedness

public java.lang.String getReservedness()

It is used to obtain the value of a reserved field.

**Returns:**

Value of a reserved field.

**Since:**

API level 0 (SDK 5.0.0.301)

## setReservedness

public void setReservedness(java.lang.String reservedness)

It is used to set the value of the reserved field.

**Parameters:**

| Parameter Name | Parameter Description |
| --- | --- |
| reservedness | Reserved field. |

**Since:**

API level 0 (SDK 5.0.0.301)

## getSoftwareVersion

public java.lang.String getSoftwareVersion()

It is used to obtain the wearable device's version.

**Returns:**

Wearable device's version.

**Since:**

API level 8 (SDK 5.0.2.306)

## getP2pCapability

public int getP2pCapability()

It is used to obtain whether the app-to-app message communications capability is supported.

**Returns:**

[DEVICE_CAPABILITY_SUPPORT](#section475318227540) (0) indicates that the capability is supported; [DEVICE_CAPABILITY_NOT_SUPPORT](#section204551958575) (1) indicates that the capability is not supported. [DEVICE_CAPABILITY_UNKNOWN](#section76763421578) (2) indicates that whether the capability is supported or not is unknown.

**Since:**

API level 8 (SDK 5.0.2.306)

## getMonitorCapability

public int getMonitorCapability()

It is used to obtain whether the status query and subscription capability is supported.

**Returns:**

[DEVICE_CAPABILITY_SUPPORT](#section475318227540) (0) indicates that the capability is supported; [DEVICE_CAPABILITY_NOT_SUPPORT](#section204551958575) (1) indicates that the capability is not supported; [DEVICE_CAPABILITY_UNKNOWN](#section76763421578) (2) indicates that whether the capability is supported or not is unknown.

**Since:**

API level 8 (SDK 5.0.2.306)

## getNotifyCapability

public int getP2pCapability()

It is used to obtain whether the template-based notifications on wearable devices capability is supported.

**Returns:**

[DEVICE_CAPABILITY_SUPPORT](#section475318227540) (0) indicates that the capability is supported; [DEVICE_CAPABILITY_NOT_SUPPORT](#section204551958575) (1) indicates that the capability is not supported; [DEVICE_CAPABILITY_UNKNOWN](#section76763421578) (2) indicates that whether the capability is supported or not is unknown.

**Since:**

API level 8 (SDK 5.0.2.306)

## getDeviceType

public String getDeviceType()

It is used to obtain the device model (**–1**: Huawei Health version too earlier; **0**: Sports watch or band; **1**: smart watch).

**Returns:**

Device type.

**Since:**

API level 12 (SDK 5.0.3.301)

## toString

public java.lang.String toString()

**Overrides:**

toString in class java.lang.Object

**Since:**

API level 0 (SDK 5.0.0.301)
