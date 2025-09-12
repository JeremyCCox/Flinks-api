# Flinks API Wrapper for TypeScript / Nest.js

A TypeScript wrapper for the [Flinks API](https://docs.flinks.io/), providing a Flinks API service for Canada and the United States. 
This package does not (yet?) provide a wrapper for each endpoint Flinks provides, but instead lets you manage the Axios configuration for both US and CA instances
along with your secrets and ASYNC response handling. Please see [Examples](#Examples) for usage examples!

Flinks API helps developers access bank account data, financial institution information, and authorization workflows for customers in supported countries.

---

## Environment Variables & Constructor Configuration

All configuration for `FlinksApi` should be passed **directly to the constructor**. **Environment variables are not automatically read**; you must supply them when creating an instance of the class.

### Required Constructor Parameters

| Parameter       | Type               | Description                                                          |
| --------------- | ------------------ |----------------------------------------------------------------------|
| `country`       | `CountryShortcode` | The country code for your API instance (e.g., `CA`,`US`).            |
| `customerId`    | `string`           | Your Flinks customer ID.                                             |
| `url`           | `string`           | Base URL for the Flinks API.                                         |
| `apiKey`        | `string`           | Your Flinks public API key. ( "x-api-key" )                          |
| `authKey`       | `string`           | Flinks authentication key.  ( "flinks-auth-key" )                    |
| `authorization` | `string`           | Authorization token (Bearer token) if required.  ( "Authorization" ) |

### Optional Constructor Parameters

| Parameter       | Type            | Description                                                                                       |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------- |
| `axiosInstance` | `AxiosInstance` | Custom Axios instance. Required if you want to inject Nest.js `HttpService`.                      |
| `logger`        | `Logger`        | Custom logger. Defaults to `console.log`, `console.error`, etc. Must implement `log` and `error`. |

<details>
<summary><i>Logger type</i></summary>

```typescript
export interface Logger {
    log(message: string, ...optionalParams: any[]): void;
    error(message: string, ...optionalParams: any[]): void;
    info?(message: string, ...optionalParams: any[]): void;
    warn?(message: string, ...optionalParams: any[]): void;
    debug?(message: string, ...optionalParams: any[]): void;
}
```

</details>

---

## Available Methods in FlinksApi

The `FlinksApi` class provides methods to interact with the Flinks backend for performing CRUD operations and authorization-related tasks. Users of this package obtain a country-specific instance via `useCountry()` and then call the methods listed below.

### Method Overview

| Method | Description                                                                                                          |
|--------|----------------------------------------------------------------------------------------------------------------------|
| `getFlinksUrl()` | Returns the base URL for the registered Flinks account.                                                              |
| `getAuthorizeToken()` | Generates an authorization token from Flinks, used for subsequent requests.                                          |
| `getRequestId(loginId: string, options?: FlinksAuthorizeOptions)` | Generates an authorize token and returns a request ID associated with the provided login ID.                         |
| `receivePendingData<T>(pendingPackage: PendingPackage)` | Polls the Flinks API for pending data until completion (handling 202 responses).                                     |
| `post<T>(path: string, options: FlinksPostOptions)` | Sends a POST request to the Flinks API and handles pending responses if any.                                         |
| `patch<T>(path: string, options: FlinksPatchOptions)` | Sends a PATCH request to the Flinks API and handles pending responses if any.                                        |
| `get(path: string, options: FlinksGetOptions)` | Sends a GET request to the Flinks API and handles pending responses if any.                                          |
| `delete(path: string, options: FlinksDeleteOptions)` | Sends a DELETE request to the Flinks API and handles pending responses if any.                                       |

### Notes

- All methods automatically manage headers including API key, auth key, and bearer token when requested.
- Methods handle asynchronous 202 responses by polling with `receivePendingData` until the operation completes.
- `useCountry()` must be used first to obtain the correct country-specific instance of `FlinksApi`.

### Examples
These examples come directly from the Nest.js project which I wrote this package for. 
#### Authorize Example:

```typescript
   /**
     * Fetches the GenerateAuthorizeToken endpoint for a Token that is required for all non-user Flinks operations
     * https://docs.flinks.com/reference/generateauthorizetoken
     * GenerateAuthorizeToken serves the same function as the /authorize/ endpoint, although It returns an AuthorizeToken instead of requestId.
     *
     * @Return AuthorizeToken Token string that is valid for 30 minutes.
     * */
    async function getAuthorizeToken(countryShortcode: CountryShortcode): Promise<FlinksAuthorizeToken> {
        const flinksApi = this.flinksApi.useCountry(countryShortcode);
        return flinksApi.getAuthorizeToken();
    }
```

#### GetAccountsDetail Example:

```typescript
     /**
     * Gets account details for a Flinks entity.
     *
     * Returns the failed authorization response if there is an error.
     *
     * @param flinksCredentials
     * @param getCachedDetails
     */
    async function getAccountDetails(
        requestId: string,
        country: CountryShortcode,
        options?:BankInfoOptions,
    ): Promise<IFlinksDetails> {
        const flinksApi = this.flinksApi.useCountry(country);
        const body = {
            requestId: requestId,
            WithBalance: true,
            ...options,
        };
    
        const flinksDetails = await flinksApi.post<IFlinksDetails>(
            "BankingServices/GetAccountsDetail",
            {
                includeHeaders: [FlinksHeaderOptions.ApiKey],
                body,
                customTimeout: 300000, // Timeout set to 5 minutes
            },
        );
        if (!flinksDetails) {
        throw new Error("Flinks Details fetch failed!");
    }
    
    return flinksDetails;
    }
```

---

## Using Flinks-api as a Nest.js service

You can inject environment variables from a Nest.js `ConfigService`:

```typescript
import { Injectable, Logger } from "@nestjs/common";
import { FlinksApi } from "flinks-api";
import { CountryShortcode } from "flinks-api/dist/index";
import { AppConfigService } from "../app-config/app-config.service";
import { HttpService } from "@nestjs/axios";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class FlinksApiService {
    constructor(protected readonly moduleRef: ModuleRef) {}

    private readonly countryMap = {
        [CountryShortcode.Canada]: FlinksCaApiService,
        [CountryShortcode['United States']]: FlinksUsApiService,
    } as const;

    /**
     * FlinksApi Factory method.
     *
     * Returns an instance of the FlinksApi class with the specified country's API service.
     * Throws an error if an unsupported CountryShortcode is provided.
     */
    useCountry(country: CountryShortcode): FlinksCaApiService | FlinksUsApiService {
        const service = this.moduleRef.get(this.countryMap[country], { strict: false });
        if (!service) {
            throw new Error(`Unsupported country: ${country}`);
        }
        return service;
    }
}
```

---

### Country-specific services

```typescript
@Injectable()
export class FlinksCaApiService extends FlinksApi {
    constructor(
        protected readonly configService: AppConfigService,
        protected readonly httpService: HttpService,
    ) {
        super({
            country: CountryShortcode.Canada,
            customerId: configService.flinksCaCustomerId,
            url: configService.flinksCaUrl,
            apiKey: configService.flinksCaXApiKey,
            authKey: configService.flinksCaAuthKey,
            bearerToken: configService.flinksCaBearerToken,
            logger: new Logger(FlinksCaApiService.name),
            axiosInstance: httpService.axiosRef,
        });
    }
}

@Injectable()
export class FlinksUsApiService extends FlinksApi {
    constructor(
        protected readonly configService: AppConfigService,
        protected readonly httpService: HttpService,
    ) {
        super({
            country: CountryShortcode["United States"],
            customerId: configService.flinksUsCustomerId,
            url: configService.flinksUsUrl,
            apiKey: configService.flinksUsXApiKey,
            authKey: configService.flinksUsAuthKey,
            bearerToken: configService.flinksUsBearerToken,
            logger: new Logger(FlinksUsApiService.name),
            axiosInstance: httpService.axiosRef,
        });
    }
}
```

---

### References

* [Flinks](https://www.flinks.com/)
* [Flinks API Documentation](https://docs.flinks.com/reference/flinks-api)
* [Jeremy Cox](https://jcox.ca)
* [Clove Financial](https://helloclove.com)
