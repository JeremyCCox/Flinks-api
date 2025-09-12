
## Environment Variables & Constructor Configuration

All configuration for `FlinksApi` should be passed **directly to the constructor**. Environment variables are **not automatically read**; you must supply them when creating an instance of the class.

### Required Constructor Parameters

| Parameter       | Type                | Description                                                   |
|-----------------|---------------------|---------------------------------------------------------------|
| `country`       | `CountryShortcode`  | The country code for your API instance (e.g., `CountryShortcode.Canada`). |
| `customerId`    | `string`            | Your Flinks customer ID.                                      |
| `url`           | `string`            | Base URL for the Flinks API.                                  |
| `apiKey`        | `string`            | Your Flinks public API key.                                   |
| `authKey`       | `string`            | Flinks authentication key.                                    |
| `authorization` | `string`            | Authorization token (Bearer token) if required.              |

### Optional Constructor Parameters

| Parameter       | Type                 | Description                                                   |
|-----------------|--------------------|---------------------------------------------------------------|
| `axiosInstance` | `AxiosInstance`     | Custom Axios instance. Required if you want to inject Nest.js `HttpService`. |
| `logger`        | `Logger`           | Custom logger. Defaults to `console.log`, `console.error`, etc. |
_the logger type is custom, and requires that the logger you provide implements 'log' and 'error'_
<details>

<summary><i>
Logger type</i>
</summary>

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

 ## Using Flinks-api as a Nest.js service
You can inject environment variables from a Nest.js ConfigService

```typescript
import {Injectable, Logger} from "@nestjs/common";
import { FlinksApi } from "flinks-api";
import { CountryShortcode } from "flinks-api/dist/index";
import {AppConfigService} from "../app-config/app-config.service";
import {HttpService} from "@nestjs/axios";
import {ModuleRef} from "@nestjs/core";


@Injectable()
export class FlinksApiService {
    constructor(
        protected readonly moduleRef: ModuleRef,
    ) {}
    private readonly countryMap = {
        [CountryShortcode.Canada]: FlinksCaApiService,
        [CountryShortcode['United States']]: FlinksUsApiService,
    } as const;

    /**
     * FlinksApi Factory method.
     *
     * Will return an instance of the FlinksApi class with the specified Countries API requirements.
     *
     * Will throw an error if you manage to provide a non-enumerated Country Code.
     *
     * @param country
     */
    useCountry(country: CountryShortcode):FlinksCaApiService| FlinksUsApiService {
        const service = this.moduleRef.get(this.countryMap[country], { strict: false });
        return service;
    }
}


// And define the Country-Specific Services which we are referencing with moduleRef:


@Injectable()
export class FlinksCaApiService extends FlinksApi {
    constructor(
        protected readonly configService: AppConfigService,
        protected readonly httpService: HttpService,
    ) {

        super({
            country: CountryShortcode["United States"],
            customerId: configService.flinksCaCustomerId,
            url: configService.flinksCaUrl,
            apiKey: configService.flinksCaXApiKey,
            authKey: configService.flinksCaAuthKey,
            bearerToken:configService.flinksCaBearerToken,
            logger : new Logger(FlinksCaApiService.name),    // Using NestJs Logger
            axiosInstance :  httpService.axiosRef            // Using NestJs httpService Axios
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
            bearerToken:configService.flinksUsBearerToken,
            logger : new Logger(FlinksUsApiService.name),   // Using NestJs Logger
            axiosInstance :  httpService.axiosRef           // Using NestJs httpService Axios
        });
    }
}

```