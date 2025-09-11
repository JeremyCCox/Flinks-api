
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
| `loggerInstance` | `Logger`           | Custom logger. Defaults to `console.log`, `console.error`, etc. |

---
#### Using Nest.js ConfigService for environment variables 
You can inject environment variables from Nest.js `ConfigService:`
```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FlinksApi } from "flinks-api";
import { CountryShortcode } from "flinks-api/dist/types"; // adjust path as needed

@Injectable()
export class MyService extends FlinksApi {
    constructor(configService: ConfigService) {
        super({
            country: CountryShortcode.Canada,          // required
            customerId: configService.get<string>("FLINKS_CUSTOMER_ID"), // required
            url: configService.get<string>("FLINKS_API_URL"),            // required
            apiKey: configService.get<string>("FLINKS_API_KEY"),    // required
            authKey: configService.get<string>("FLINKS_AUTH_KEY"), // required
            authorization: configService.get<string>("FLINKS_AUTH_TOKEN"), // required
            axiosInstance: undefined,                  // optional, pass HttpService.axiosRef if desired
            loggerInstance: undefined                  // optional, defaults to console
        });
    }
}

```