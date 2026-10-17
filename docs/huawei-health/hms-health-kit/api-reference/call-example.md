<!--
  Title: Call Example
  Catalog: HMSCore-References-V5
  Document ID: call-example-0000001054895229-V5
  Updated: 2021-05-17 07:26:43
  Source: https://developer.huawei.com/consumer/en/doc/development/HMSCore-References-V5/call-example-0000001054895229-V5
-->
# Call Example

#### Obtaining an Access Token for Authentication

Send an HTTPS POST request using the client ID and key obtained from HUAWEI Developers to obtain an access token.

tokenUrl =

"https://oauth-api-at.cloud.huawei.com/rest.php?nsp_fmt=JSON&nsp_svc=huawei.oauth2.user.getTokenInfo".

```cpp
/**
     * Obtain the access token.
     *
     * @return Return the ID token.
     * @throws IOException Exception.
     */
    private static String getOauthToken() throws IOException {
        // Set Content-Type in the packet header.
        PostMethod postMethod = new PostMethod(tokenUrl);
        postMethod.setRequestHeader("Content-Type",
                "application/x-www-form-urlencoded;charset=utf-8");

        // Set the packet body.
        List<NameValuePair> param = new ArrayList<>();
        param.add(new NameValuePair("grant_type", "authorization_code"));
        param.add(new NameValuePair("client_id", clientId));
        param.add(new NameValuePair("client_secret", secret));
        postMethod.setRequestBody(param.toArray(new NameValuePair[param.size()]));

        HttpClient httpClient = new HttpClient();
        int ret = httpClient.executeMethod(postMethod);
        String accessToken = null;
        String tokenResponse = postMethod.getResponseBodyAsString();
        if (ret == 200) {
            JSONObject atJson = JSONObject.parseObject(tokenResponse);
            accessToken = atJson.getString("access_token");
        } else {
            System.out.println("request access token failed " + tokenResponse);
        }
        return accessToken;
    }
```

#### Creating a Data Collector Based on access_token

Send an HTTPS POST request with the obtained access_token to create a data collector.

The Java sample code, where the value of **reportUrl** is **https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors**, is as follows:

```cpp
/**
     * Create a data collector.
     * @param accessToken Token obtained based on the client ID and key.
     * @throws IOException
     */
    private static void callApiUseToken(String accessToken) throws IOException {
        // Set the packet headers Content-Type and Authorization.
        PostMethod postMethod = new PostMethod(reportUrl);
        postMethod.setRequestHeader("Content-Type","application/json;charset=utf-8");
        postMethod.setRequestHeader("Authorization","Bearer " + accessToken);

        // Set the packet body.
        AppInfo appInfo = new AppInfo();
        appInfo.setAppName("testApp");
        List<DataTypeField> fieldList = new ArrayList<>();
        DataTypeField field = new DataTypeField();
        field.setName("body_weight");
        field.setFormat("float");
        fieldList.add(field);
        DataType dataType = new DataType();
        dataType.setName("com.huawei.instantaneous.body_weight");
        dataType.setField(field);

        Map<String, Object> bodyMap = new HashMap<>();
        bodyMap.put("appInfo", appInfo);
        bodyMap.put("collectorDataType", dataType);
        bodyMap.put("collectorType", "raw");

        RequestEntity requestEntity = new StringRequestEntity( JSONObject.toJSONString(bodyMap),
                "application/json" ,"UTF-8");
        postMethod.setRequestEntity(requestEntity);

        HttpClient httpClient = new HttpClient();
        int ret = httpClient.executeMethod(postMethod);
        String rpsContent = postMethod.getResponseBodyAsString();
        if (ret == 200) {
            System.out.println(rpsContent);
        } else {
            System.out.println("callApi failed: ret =" + ret + " rsp=" + rpsContent);
        }
    }
```
