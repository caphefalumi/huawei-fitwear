<!--
  Title: Service Introduction
  Catalog: HMSCore-Guides-V5
  Document ID: overview-restful-api-0000001050071695-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/overview-restful-api-0000001050071695-V5
-->
# Service Introduction

Health Kit allows apps to access the database via the RESTful APIs, so that they can add, delete, modify, and query user data, providing fitness and health data services for users.

See [Health Kit Server API Reference](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/datacollectors_create-0000001050114852-V5) for the REST APIs provided by Health Kit.

#### DataCollector

**Introduction:** Perform CRUD operations on data collectors. Data collectors are used to collect fitness and health data from sensors, which can be the raw data or derived data (after being converted or combined).
**Application scenarios:**

- Call the **create** API to create a data collector and save it to the database.
- Call the **delete** API to delete data collectors from the database.
- Call the **update** API to update the information about existing data collectors to the database.
- Call the **get** API to obtain the information about a data collector from the database.
- Call the **list** API to query the list of all data collectors of the user from the database.

#### DataCollector.SampleSet

**Introduction:** Perform CRUD operations on sampling datasets and sampling points. A sampling point is the sample point data obtained by the data collector, and a sampling dataset is a series of associated sampling points.
**Application scenarios:**

- Call the **patch** API to upload the sampling points collected by the data collector to the database.
- Call the **delete** API to delete all of the sampling points within a specified period from the database.
- Call the **get** API to query all of the sampling points within a specified period from the database.
- Call the **history** API to query the historical records of the sampling points of a specified data collector from the database.

#### ActivityRecord

**Introduction:** Perform CRUD operations on activity records. An activity record is used to record a continuous process of an activity performed by the user within a period of time.

**Application scenarios:**

- Call the **update** API to create or modify an activity record and save it to the database.
- Call the **delete** API to delete the specified activity record data from the database.
- Call the **list** API to query the list of activity records created by the user from the database.

#### SampleSet:polymerize

**Introduction:** Group data of a specific data type or data collector and return the grouping result, for example, when querying the number of steps of a day.

**Application scenarios:**

Call the **sampleSet:polymerize** API to group data of a specified data type or data collector using the specified rules.
