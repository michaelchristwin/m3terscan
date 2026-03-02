# ProposalApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getProposalProposalTxHashGet**](#getproposalproposaltxhashget) | **GET** /proposal/{tx_hash} | Get Proposal|

# **getProposalProposalTxHashGet**
> Array<ProposalsResponse> getProposalProposalTxHashGet()

Retrieve proposal details by transaction hash.  First checks the database cache. If not found, fetches from Ethereum blockchain, decodes the transaction data, and caches the results.  :param tx_hash: Ethereum transaction hash :type tx_hash: str :return: List of proposal meter readings

### Example

```typescript
import {
    ProposalApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProposalApi(configuration);

let txHash: string; // (default to undefined)

const { status, data } = await apiInstance.getProposalProposalTxHashGet(
    txHash
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **txHash** | [**string**] |  | defaults to undefined|


### Return type

**Array<ProposalsResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successful Response |  -  |
|**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

