<!--
  Title: Glossary
  Catalog: harmonyos-guides
  Document ID: health-glossary
  Updated: 2026-10-14 09:28:42
  Source: https://developer.huawei.com/consumer/en/doc/harmonyos-guides/health-glossary
-->
# Glossary

#### D

## Data Source

A data source identifies the app or device from which health and fitness data originates. It includes attributes such as device name, category, manufacturer, and model. Each data record must be associated with a data source to support the save, read, and delete operations. A data source is uniquely identified through a **DataSourceId**.

## Daily Activities

Activity data generated during a user's everyday life. The data is recorded as sampled metrics, including step count, calories burned, distance traveled, moderate-to-vigorous activity status, elevation gain, and standing status. Data may come from multiple device types, such as phones, watches, and bands, and is updated at approximately 10-minute intervals.

#### P

## Permission

An access grant that allows apps to read or write specific health and fitness data. Health Service Kit follows the principle of least privilege, meaning apps may request only the permissions required for their business scenarios. The intersection of the permissions requested by the app and those granted by the user determines the actual data the app can operate on.

## Privacy Authorization

The process in which a user agrees to the Health Service Kit privacy agreement. Users must complete this authorization when first using the service, and the flow is handled within the HUAWEI Health app. If an API call returns an error indicating that privacy authorization has not been granted, the app must guide the user to open the HUAWEI Health app to complete the authorization.

#### U

## User Authorization

The process in which a user actively grants an app access to their health and fitness data. After signing in with a HUAWEI ID, users select the specific data types they wish to authorize, and partial authorization is supported. The intersection of the permissions requested by the app and those granted by the user determines the actual data the app can operate on.
