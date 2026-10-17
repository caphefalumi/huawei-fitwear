<!--
  Title: What Can I Do If Error Message "App has not applied for the Wear Engine service" is Reported During an API Call?
  Catalog: harmonyos-guides
  Document ID: wearengine_faq-3
  Updated: 2026-10-14 09:34:07
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_faq-3
-->
# What Can I Do If Error Message "App has not applied for the Wear Engine service" is Reported During an API Call?

- Make sure that you have [applied for integrating Wear Engine Kit](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/wearengine_apply) on HUAWEI Developers and the request has been approved.
- If the issue persists, the possible cause is that you have called the API before applying for integrating Wear Engine Kit on HUAWEI Developers. When you call the API again after the request is approved, the local cache records have not been updated (updated automatically every 24 hours). To resolve this, clear the data of the HUAWEI Health app in the app manager or uninstall and re-install the HUAWEI Health app, and then try again.
- If the issue persists, [submit a ticket online](https://developer.huawei.com/consumer/en/support/feedback/#/) on HUAWEI Developers.
