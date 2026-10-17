<!--
  Title: wearEngineLite (Wearable Capabilities) (Lite)
  Catalog: harmonyos-references
  Document ID: wearenginelite_api
  Updated: 2026-10-14 09:42:34
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-references/wearenginelite_api
-->
# wearEngineLite (Wearable Capabilities) (Lite)

This module allows third-party apps on wearable devices to subscribe to the connection status between the watch and phone.

**Since:** 6.1.1(24)

#### Modules to Import

```javascript
import WearEngineLite from '@hms.health.WearEngineLite';
```

#### onConnectionStateChange

static onConnectionStateChange(callback: MonitorEventCallback): void

Listens for device status changes. This API uses an asynchronous callback to return the result.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Device behavior differences:** This API is supported on wearables and lite wearables, but does not respond on other device types.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | [MonitorEventCallback](#monitoreventcallback) | Yes | Callback used to return the device status change information. |

**Example:**

```javascript
let eventCallback = {
    // Event change callback (triggered when the device connection status changes).
    eventChange: (data) => {
      console.info(`Device connection status event: ${data.event}, device connection status change: ${data.data.data}`);
    },

    success: (code, data) => {
      console.info(`Subscription successful. Code: ${code.code}, data: ${data.data}`);
    },

    fail: (error, errorMessage) => {
      console.error (`Subscription failed. Code: ${error.code}, data: ${errorMessage.data}`);
    }
  };

  WearEngineLite.onConnectionStateChange(eventCallback);
```

#### offConnectionStateChange

static offConnectionStateChange(callback?: MonitorEventCallback): void

Cancels listening for device status changes. This API uses an asynchronous callback to return the result.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Device behavior differences:** This API is supported on wearables and lite wearables, but does not respond on other device types.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| callback | [MonitorEventCallback](#monitoreventcallback) | No | Callback used to return the result. If **success** is returned, the subscription is canceled successfully. If **fail** is returned, the subscription fails to be canceled. |

**Example:**

```javascript
let eventCallback = {
    success: (code, data) => {
      console.info(`Subscription canceled successfully. code: ${code.code}, data: ${data.data}`);
    },

    fail: (error, errorMessage) => {
      console.error ('Failed to cancel the subscription. code: ${error.code}, data: ${errorMessage.data}');
    }
  };

  WearEngineLite.offConnectionStateChange(eventCallback);
```

#### onFileReceive

static onFileReceive(remoteAppInfo: AppInfo, callback: FileReceiverCallback): void

Subscribes to the event that the peer device sends a file and the file transfer progress to the local device.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 26.0.0

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| remoteAppInfo | [AppInfo](#appinfo) | Yes | Parameters of a specified device-side app. |
| callback | [FileReceiverCallback](#filereceivercallback) | Yes | Callback used to return the file object. |

**Example:**

```javascript
// Set the device-side app information, including the bundle name and fingerprint.
 let remoteAppInfo = {
    bundleName: '',
    fingerprint: ''
 };
 // Set the file storage path for receiving files.
 globalThis.__fileDir__ = 'xxxx/xxxx';
 // Set information about the file to be received and the transfer progress.
 let FileReceiverCallback =
 {
    onReceive: (fileName, filePath, progress)=>{
        hilog.info(0,'onFileReceive',`onFileReceive is:  ${fileName}, filePath is: ${filePath}, progress is: ${progress}`);
    },
    success: (code, data) => {
        hilog.info(0,'onFileReceive',`onFileReceive success code is: ${code}, data is ${data}`);
    },
    fail: (code, data) => {
        hilog.error(0,'onFileReceive',`onFileReceive fail code: ${code}, data is ${data}`);
    }
 };
 try {
    WearEngineLite.onFileReceive(remoteAppInfo, FileReceiverCallback);
    } catch (error) {
        hilog.error(0,'onFileReceive',`Failed to onFileReceive. code is ${error.code}, message is ${error.data}.`);
 };
```

#### offFileReceive

static offFileReceive(remoteAppInfo: AppInfo, callback?: FileReceiverCallback): void

Unsubscribes from the event that the peer device sends a file and the file transfer progress to the local device.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 26.0.0

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| remoteAppInfo | [AppInfo](#appinfo) | Yes | Parameters of a specified device-side app. |
| callback | [FileReceiverCallback](#filereceivercallback) | No | Callback used to return the file object. |

**Example:**

```javascript
// Set the device-side app information, including the bundle name and fingerprint.
 let remoteAppInfo = {
    bundleName: '',
    fingerprint: ''
 };
 // Set the callback used to return information about the file to be received.
 let fileReceiverCallback =
    {
        onReceive: (fileName, filePath, progress)=>{
            hilog.info(0,'offFileReceive',`offFileReceive is:  ${fileName}, filePath is: ${filePath}, progress is: ${progress}`);
        },
        success: (code, data) => {
            hilog.info(0,'offFileReceive',`offFileReceive success code is: ${code}, data is ${data}`);
        },
        fail: (code, data) => {
            hilog.error(0,'offFileReceive',`offFileReceive fail code: ${code}, data is ${data}`);
        }
      };

 try {
    WearEngineLite.offFileReceive(remoteAppInfo, fileReceiverCallback);
 } catch (error) {
    hilog.error(0,'offFileReceive',`Failed to offFileReceive. Code is ${error.code}, message is ${error.data}.`);
 };
```

#### MonitorEventCallback

As an input parameter of the [onConnectionStateChange](#onconnectionstatechange) API, this API transfers the changed device status information to the callback function when the subscribed event is triggered. As an input parameter of the [offConnectionStateChange](#offconnectionstatechange) API, this API is used to cancel listening for device connection status changes.

## eventChange

eventChange(data: MonitorEventData): void

Listens for device status change events.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Device behavior differences:** This API is supported on wearables and lite wearables, but does not respond on other device types.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| data | [MonitorEventData](#monitoreventdata) | Yes | Device status information after the change. |

**Example:**

```javascript
let eventCallback = {
    // Event change callback (triggered when the device connection status changes).
    eventChange: (data) => {
      console.info(`Device connection status event: ${data.event}, device connection status change: ${data.data.data}`);
    }
  };

  WearEngineLite.onConnectionStateChange(eventCallback);
```

## success

success(code: number, data?: string): void

Indicates that the subscription or unsubscription is successful.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Device behavior differences:** This API is supported on wearables and lite wearables, but does not respond on other device types.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| code | number | Yes | **0** returned. |
| data | string | No | **success** returned. |

**Example:**

```javascript
let eventCallback = {
    success: (code, data) => {
      console.info(`Subscription successful. Code: ${code.code}, data: ${data.data}`);
    }
  };

  WearEngineLite.onConnectionStateChange(eventCallback);
```

## fail

fail(code: number, data?: string): void

Indicates that the subscription or unsubscription fails.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Device behavior differences:** This API is supported on wearables and lite wearables, but does not respond on other device types.

**Since:** 6.1.1(24)

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| code | number | Yes | Error code 401 returned. |
| data | string | No | **fail** returned. |

**Example:**

```javascript
let eventCallback = {
    fail: (error, errorMessage) => {
      console.error (`Subscription failed. Code: ${error.code}, data: ${errorMessage.data}`);
    }
  };

  WearEngineLite.onConnectionStateChange(eventCallback);
```

#### MonitorData

Device status information.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 6.1.1(24)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| code | number | No | No | Extended field. |
| data | string | No | Yes | Device connection status. The value **2** indicates that the connection is successful, and the value **3** indicates that the connection is interrupted. |

#### MonitorEventData

As a parameter of [eventChange](#eventchange), this API transfers the device status change information to the callback function when the subscribed event is triggered.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 6.1.1(24)

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| event | string | No | No | Subscribed event reported by the callback function. |
| data | [MonitorData](#monitordata) | No | No | Device status information after the change. |

#### FileReceiverCallback

As an input parameter of the [onFileReceive](#onfilereceive) API, this API transfers the changed file transfer progress to the callback function when the file transfer progress changes. As an input parameter of the [offFileReceive](#offfilereceive) API, this API is used to cancel the subscription to the event that the peer app sends files to the local app.

## onReceive

onReceive(fileName: string, filePath: string, progress: number): void

Receives files sent by the peer device and views the receiving progress.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 26.0.0

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| fileName | string | Yes | Name of the file to be received. |
| filePath | string | Yes | Storage path of the file to be received. |
| progress | number | Yes | Transfer progress of the file to be received. |

**Example:**

```javascript
// Set the device-side app information, including the bundle name and fingerprint.
 let remoteAppInfo = {
 bundleName: '',
 fingerprint: ''
    };
// Set the callback used to return information about the file to be received.
 let fileReceiverCallback =
 {
    onReceive: (fileName, filePath, progress)=>{
    hilog.info(0,'onFileReceive',`onFileReceive is:  ${fileName}, filePath is: ${filePath}, progress is: ${progress}`);
 },
 success: (code, data) => {
    hilog.info(0,'onFileReceive',`onFileReceive success code is: ${code}, data is ${data}`);
 },
    fail: (code, data) => {
        hilog.error(0,'onFileReceive',`onFileReceive fail code: ${code}, data is ${data}`);
    }
 };

 try {
    WearEngineLite.onFileReceive(remoteAppInfo, fileReceiverCallback);
 } catch (error) {
    hilog.error(0,'onFileReceive',`Failed to onFileReceive. Code is ${error.code}, message is ${error.data}.`);
 };
```

## success

success(code: number, data?: string): void

Indicates that the subscription or unsubscription is successful.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 26.0.0

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| code | number | Yes | **0** returned. |
| data | string | No | **undefined** returned. |

**Example:**

```javascript
// Set the device-side app information, including the bundle name and fingerprint.
 let remoteAppInfo = {
 bundleName: '',
 fingerprint: ''
 };
 // Set the callback used to return information about the file to be received.
 let fileReceiverCallback =
 {
    onReceive: (fileName, filePath, progress)=>{
        hilog.info(0,'onFileReceive',`onFileReceive is:  ${fileName}, filePath is: ${filePath}, progress is: ${progress}`);
    },
    success: (code, data) => {
        hilog.info(0,'onFileReceive',`onFileReceive success code is: ${code}, data is ${data}`);
    },
    fail: (code, data) => {
        hilog.error(0,'onFileReceive',`onFileReceive fail code: ${code}, data is ${data}`);
    }
 };

 try {
    WearEngineLite.onFileReceive(remoteAppInfo, fileReceiverCallback);
 } catch (error) {
    hilog.error(0,'onFileReceive',`Failed to onFileReceive. Code is ${error.code}, message is ${error.data}.`);
 };
```

## fail

fail(code: number, data?: string): void

Indicates that the subscription or unsubscription fails.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 26.0.0

**Parameters:**

| Parameter | Type | Mandatory | Description |
| --- | --- | --- | --- |
| code | number | Yes | **-1** returned. |
| data | string | No | **undefined** returned. |

**Example:**

```javascript
// Set the device-side app information, including the bundle name and fingerprint.
 let remoteAppInfo = {
    bundleName: '',
    fingerprint: ''
 };
// Set the callback used to return information about the file to be received.
 let fileReceiverCallback =
 {
    onReceive: (fileName, filePath, progress)=>{
        hilog.info(0,'onFileReceive',`onFileReceive is:  ${fileName}, filePath is: ${filePath}, progress is: ${progress}`);
    },
    success: (code, data) => {
        hilog.info(0,'onFileReceive',`onFileReceive success code is: ${code}, data is ${data}`);
    },
    fail: (code, data) => {
        hilog.error(0,'onFileReceive',`onFileReceive fail code: ${code}, data is ${data}`);
    }
 };

 try {
    WearEngineLite.onFileReceive(remoteAppInfo, fileReceiverCallback);
 } catch (error) {
    hilog.error(0,'onFileReceive',`Failed to onFileReceive. Code is ${error.code}, message is ${error.data}.`);
 };
```

#### AppInfo

Device-side app information class.

**Model restriction:** This API can be used only in the FA model.

**System capability:** SystemCapability.Health.WearEngine.Lite

**Since:** 26.0.0

| Name | Type | Read-Only | Optional | Description |
| --- | --- | --- | --- | --- |
| bundleName | string | No | No | App name. |
| fingerprint | string | No | No | [App fingerprint, a unique ID for identifying an app.](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_faq-9) |
