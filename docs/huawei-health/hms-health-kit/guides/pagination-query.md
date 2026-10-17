<!--
  Title: Pagination
  Catalog: HMSCore-Guides-V5
  Document ID: pagination-query-0000001071262988-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/pagination-query-0000001071262988-V5
-->
# Pagination

Pagination divides a large data into smaller pages. Health Kit provides pagination to improve the query performance of your app, by reducing the amount of data returned from the server in one go. To use pagination for query, perform the following steps:

- Use [getCount](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s249a7a32acd04c629001db9f95e24074) to obtain the total number of data records.
- Use [HiHealthDataQueryOption](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdataqueryoption-0000001071859312-V5) in [execQuery](https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/hihealthdatastore-0000001071549459-V5#EN-US_TOPIC_0000001090410572__s7358cf11ae47431cb3f071a33e54f191) to specify the data start and end points. **Sample code** (for walking data query) 
```cpp
final long endTime = System.currentTimeMillis();
final long startTime = 0; // The start time is 0, meaning that all data can be queried.
HiHealthDataQuery hiHealthDataQuery = new HiHealthDataQuery(HiHealthSetType.DATA_SET_WALK_METADATA, startTime,
    endTime, new HiHealthDataQueryOption());
HiHealthDataStore.getCount(context, hiHealthDataQuery, new ResultCallback() {
    @Override
    public void onResult(final int resultCode, final Object data) {
        if (resultCode == HiHealthError.SUCCESS) {
            final int count = (int) data;
            // Maximum number of pages.
            int pages = 3;
             // limit: Maximum number of total records.
            int limit = count / pages;
            // offset: Number of rows to be skipped from the result set of the query.
            int offset = 0;
            // Sort data in ascending order by the time the data is generated.
            int order = 0;
             // Specify the number of pages.
            for (int i = 0; i < pages; i++) {
                offset = limit * i;
                // Return all the remaining records if this is the last page.
                if (i == pages - 1) {
                    limit = count - offset;
                }
                HiHealthDataQuery hiHealthDataQuery =
                    new HiHealthDataQuery(HiHealthSetType.DATA_SET_WALK_METADATA, startTime, endTime,
                        new HiHealthDataQueryOption(limit, offset, order));
                HiHealthDataStore.execQuery(context, hiHealthDataQuery, 0, new ResultCallback() {
                    @Override
                    public void onResult(int resultCode, Object data) {
                         // Process data.
                        if (resultCode == HiHealthError.SUCCESS && data instanceof List) {
                        
                        }
                    }
                });
            }
        }
    }
});
```
 
| Parameter Name | Parameter Type | Description | Mandatory (M)/Optional (O) |
| --- | --- | --- | --- |
| hiHealthDataQuery | HiHealthDataQuery | Query criteria. | O |
| timeout | int | Timeout interval. | M |
| callback | ResultCallback | Result callback. | M |
 
| Parameter Name | Parameter Type | Description | Mandatory (M)/Optional (O) |
| --- | --- | --- | --- |
| limit | int | Maximum number of records that can be returned. The value must be greater than or equal to 0. When the value is 0, all data is returned. | M |
| offset | int | Offset (the number of records to be skipped from the result set). The value must be greater than or equal to 0. | M |
| order | int | Whether to sort data by time in ascending or descending order. The value can only be 0 (ascending) or 1 (descending). | M |
 
| Parameter Name | Parameter Type | Description |
| --- | --- | --- |
| resultCode | int | Processing result. • 0: success • Others: See [Result Codes](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides-V5/errocode-0000001053256958-V5). |
| data | Object | Data list. Succeeded (data available): List<HiHealthSetData> or List<HiHealthPointData> Succeeded (no data): success information description (String) Other: error description (String) |
