<!--
  Title: Configuring the UI Theme
  Catalog: huaweihealth-Guides
  Document ID: config-ui-theme-0000002338298276
  Updated: 2026-08-05 02:10:15
  Source: https://developer.huawei.com/consumer/en/doc/development/huaweihealth-Guides/config-ui-theme-0000002338298276
-->
**
# Configuring the UI Theme

You need to use the same theme as that of the Health IndustryConnectionUI SDK to ensure that the UI elements are displayed properly.

- Open the AndroidManifest.xml file and change the app theme in application. 
```cpp
<application android:theme="@style/Theme.IndustryConnectionUI">
```
 Figure 1 **Setting the app theme
- Open the Java code file and configure dynamic change of the color of the icon displayed in the status bar to adapt to the common mode or dark mode. The following is an example: 
```cpp
// Configure the color of the icon displayed in the status bar.
int uiMode = this.getResources().getConfiguration().uiMode;
if ((uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_NO) {
    getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
}
```
