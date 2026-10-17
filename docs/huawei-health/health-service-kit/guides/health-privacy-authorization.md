<!--
  Title: Launching HUAWEI Health for Users to Agree to the Privacy Statement
  Catalog: harmonyos-guides
  Document ID: health-privacy-authorization
  Updated: 2026-10-14 09:29:47
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-privacy-authorization
-->
# Launching HUAWEI Health for Users to Agree to the Privacy Statement

#### Use Cases

A user needs to agree to the privacy agreement before using Health Service Kit for the first time on their device, which must be done in the HUAWEI Health app. Your app must instruct the user to open HUAWEI Health and agree to the privacy statement.

If error code [1002703001](https://developer.huawei.com/consumer/en/doc/harmonyos-references/errorcode-healthservice#section1002703001-privacy-agreement-not-agreed-to) is returned after you call an API specified in the following sections, refer to this section to instruct the user to open HUAWEI Health and agree to the Health Service Kit privacy statement.

#### Development Procedure

- Add the **querySchemes** field in the **module.json5** file and configure **huaweischeme** in the list. **huaweischeme** is the scheme for redirecting to the HUAWEI Health app home screen, as shown in the following figure.
- Import the required functional modules. 
```typescript
import { bundleManager, common, Want } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { productViewManager } from '@kit.AppGalleryKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
```

- Call [canOpenLink](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-bundlemanager#bundlemanagercanopenlink12) to check whether the HUAWEI Health app has been installed. If the app has been installed, call [openLink](https://developer.huawei.com/consumer/en/doc/harmonyos-references/js-apis-inner-application-uiabilitycontext#openlink12) to start HUAWEI Health.
- If HUAWEI Health has not been installed, call the API in [Recommendation on AppGallery](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/appgallery-productview-loadproduct) to guide the user to download it.

```typescript
try {
 // Obtain the context from the component and ensure that the return value of this.getUIContext().getHostContext() is UIAbilityContext.
  let result = bundleManager.canOpenLink('huaweischeme://healthapp/home/main');
  let context = this.getUIContext().getHostContext() as common.UIAbilityContext;
  if (result) {
    // Launch the HUAWEI Health app home screen for the user to agree to the privacy statement.
    let link: string = 'huaweischeme://healthapp/home/main';
    await context.openLink(link)
  } else {
    // Launch AppGallery to guide the user to download HUAWEI Health and agree to the privacy statement.
    const wantParam: Want = {
      parameters: {
        bundleName: 'com.huawei.hmos.health'
      }
    };
    const callback: productViewManager.ProductViewCallback = {
      onError: (error: BusinessError) => {
        hilog.error(0x0001, 'TAG', `Failed to open AppGallery.Code: ${error.code}, message: ${error.message}`);
      }
    }
    productViewManager.loadProduct(context, wantParam, callback);
  }
} catch (err) {
  hilog.error(0x0000, 'testTag', `Failed to agree user privacy.Code: ${err.code}, message: ${err.message}`);
}
```
