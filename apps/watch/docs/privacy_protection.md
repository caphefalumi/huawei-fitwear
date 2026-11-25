# Privacy Protection for Huawei Smartwatch Apps

Smartwatch apps frequently handle highly sensitive personal data—including continuous heart rate, $\text{SpO}_2$, sleep stages, workout GPS tracks, and notifications—making strict privacy compliance essential.

## 1. Core Privacy Principles
* **Upfront Transparency & Informed Consent**:
  * Present a clear, concise privacy notice before collecting any personal or health data, explaining what is collected, why it is needed, and whether it syncs to a paired phone or cloud.
  * Provide an accessible way to revoke consent or clear local watch data.
* **Data Minimization**:
  * Request only the exact sensors and health metrics required for the active feature (e.g., do not request continuous background heart rate if a one-time spot check suffices).
  * Anonymize or aggregate telemetry before analytics upload.
* **Local-First Processing**:
  * Process sensor streams and workout calculations locally on the smartwatch whenever possible; never upload health or biometric records to external servers without explicit user opt-in.

## 2. Practical Smartwatch Implementation Measures
* **Just-in-Time Dynamic Permissions**:
  * Request sensitive permissions (such as `ohos.permission.READ_HEALTH_DATA`, `ohos.permission.ACTIVITY_MOTION`, or `ohos.permission.LOCATION`) dynamically at the moment the user initiates the feature, rather than on initial app launch.
  * Handle permission denial gracefully with clear fallback UIs instead of blocking the entire app.
* **Approximate Location**:
  * Use `ohos.permission.APPROXIMATELY_LOCATION` for weather or city-level context, reserving `ohos.permission.LOCATION` strictly for active outdoor workout route tracking.
* **Sensitive Screen Protection**:
  * Enable window privacy mode (`setWindowPrivacyMode(true)` with `ohos.permission.PRIVACY_WINDOW`) on screens displaying payment codes, PINs, or private health summaries to prevent screenshots or screen mirroring.