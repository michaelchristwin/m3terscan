# MeterApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getActivitiesMeterMeterIdActivitiesGet**](#getactivitiesmetermeteridactivitiesget) | **GET** /meter/{meter_id}/activities | Get Activities|
|[**getDailyMeterMeterIdDailyGet**](#getdailymetermeteriddailyget) | **GET** /meter/{meter_id}/daily | Get Daily|
|[**getMonthOfYearMeterMeterIdMonthMonthYearGet**](#getmonthofyearmetermeteridmonthmonthyearget) | **GET** /meter/{meter_id}/month/{month}/{year} | Get Month Of Year|
|[**getWeeklyMeterMeterIdWeeklyGet**](#getweeklymetermeteridweeklyget) | **GET** /meter/{meter_id}/weekly | Get Weekly|
|[**getWeeksOfYearMeterMeterIdWeeksYearGet**](#getweeksofyearmetermeteridweeksyearget) | **GET** /meter/{meter_id}/weeks/{year} | Get Weeks Of Year|

# **getActivitiesMeterMeterIdActivitiesGet**
> ActivitiesResponse getActivitiesMeterMeterIdActivitiesGet()

Get activities of a m3ter   :param m3ter_id: Description  :type m3ter_id: int

### Example

```typescript
import {
    MeterApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeterApi(configuration);

let meterId: number; // (default to undefined)
let after: string; // (optional) (default to undefined)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getActivitiesMeterMeterIdActivitiesGet(
    meterId,
    after,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **meterId** | [**number**] |  | defaults to undefined|
| **after** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**ActivitiesResponse**

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

# **getDailyMeterMeterIdDailyGet**
> Array<DailyResponse> getDailyMeterMeterIdDailyGet()

Get daily energy usage aggregate.

### Example

```typescript
import {
    MeterApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeterApi(configuration);

let meterId: number; // (default to undefined)

const { status, data } = await apiInstance.getDailyMeterMeterIdDailyGet(
    meterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **meterId** | [**number**] |  | defaults to undefined|


### Return type

**Array<DailyResponse>**

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

# **getMonthOfYearMeterMeterIdMonthMonthYearGet**
> Array<MonthlyEnergyRead> getMonthOfYearMeterMeterIdMonthMonthYearGet()

Get daily energy usage for a given month in a specified year.

### Example

```typescript
import {
    MeterApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeterApi(configuration);

let meterId: number; // (default to undefined)
let year: number; // (default to undefined)
let month: number; // (default to undefined)

const { status, data } = await apiInstance.getMonthOfYearMeterMeterIdMonthMonthYearGet(
    meterId,
    year,
    month
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **meterId** | [**number**] |  | defaults to undefined|
| **year** | [**number**] |  | defaults to undefined|
| **month** | [**number**] |  | defaults to undefined|


### Return type

**Array<MonthlyEnergyRead>**

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

# **getWeeklyMeterMeterIdWeeklyGet**
> Array<WeeklyResponse> getWeeklyMeterMeterIdWeeklyGet()

Get weekly energy usage aggregate.

### Example

```typescript
import {
    MeterApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeterApi(configuration);

let meterId: number; // (default to undefined)

const { status, data } = await apiInstance.getWeeklyMeterMeterIdWeeklyGet(
    meterId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **meterId** | [**number**] |  | defaults to undefined|


### Return type

**Array<WeeklyResponse>**

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

# **getWeeksOfYearMeterMeterIdWeeksYearGet**
> Array<WeeksEnergyRead> getWeeksOfYearMeterMeterIdWeeksYearGet()

Get energy usage of all weeks of specified year.

### Example

```typescript
import {
    MeterApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new MeterApi(configuration);

let meterId: number; // (default to undefined)
let year: number; // (default to undefined)

const { status, data } = await apiInstance.getWeeksOfYearMeterMeterIdWeeksYearGet(
    meterId,
    year
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **meterId** | [**number**] |  | defaults to undefined|
| **year** | [**number**] |  | defaults to undefined|


### Return type

**Array<WeeksEnergyRead>**

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

