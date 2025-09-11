import {
    FlinksGetOptions,
    FlinksResponse,
    FlinksPatchOptions,
    PendingPackage,
    FlinksPostOptions,
    FlinksDataOptions,
    FlinksHeaderOptions,
    FlinksDeleteOptions,
    FlinksAuthorizeOptions,
    SecurityResponses,
    IFlinksAuthorize,
    IFlinksToken,
    IFlinksResponse,
    FlinksAuthorizeToken, CountryShortcode, FlinksApiConfiguration, Logger,
} from "./types";
import axios, {AxiosInstance, AxiosResponse} from "axios";

const MAX_API_ATTEMPTS: number = 20;

/**
 * This is our Flinks API class, which aims to standardize the way we:
 *  - Post
 *  - Patch
 *  - Get
 *  - Delete
 *  Data when integrating with the Flinks Backend.
 *
 *  Calling the API class itself will not work, instead you must call the "useCountry" factory method
 *  to get an Instance of the FlinksApi specific to the provided CountryCode.
 *
 */
export class FlinksApi {
    private static interceptorInstalled = false;

    constructor(config:FlinksApiConfiguration
               ) {
        this.country = config.country;
        this.customerId = config.customerId;
        this.url=config.url;
        this.apiKey = config.apiKey;
        this.authKey = config.authKey;
        this.authorization = config.authorization;
        this.axios = config.axiosInstance ?? axios.create({
            baseURL: `${this.url}/${this.customerId}`,
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                ...(this.authKey ? { "flinks-auth-key": this.authKey } : {}),
            },
        })
        this.logger = {
            log: config.logger?.log ?? console.log,
            error: config.logger?.error ?? console.error,
            info: config.logger?.info ?? console.info,
            warn: config.logger?.warn ?? console.warn,
            debug: config.logger?.debug ?? console.debug,
        };
    }
    protected country: CountryShortcode;
    protected customerId: string;
    protected url: string;
    protected apiKey: string;
    protected authKey: string;
    protected authorization: string;
    protected axios: AxiosInstance;
    protected logger: Required<Logger> ;

    private REQUEST_TIMEOUT = 30000;


    /**
     * Returns a Flinks URL for being registered under a VoPay account,
     * based on the Country this class is registered to return
     */
    public getFlinksUrl(): string {
        return `${this.url}/${this.customerId}`;
    }

    private flinksApiUrlBuilder(
        path: string,
        options?: FlinksDataOptions,
    ): string {
        let pathParams: string = "";
        options?.pathParams?.map((param:string) => {
            pathParams = `${pathParams}/${param}`;
        });
        const queryParams = new URLSearchParams();
        Object.entries(options?.queryParams || []).map((param) => {
            queryParams.append(param[0], param[1]);
        });
        return `${this.url}/${this.customerId}/${path}${pathParams}${queryParams.size > 0 ? `?${queryParams.toString()}` : ""}`;
    }

    public async getAuthorizeToken(): Promise<FlinksAuthorizeToken> {
        const data = await this.post<IFlinksToken>(
            "BankingServices/GenerateAuthorizeToken",
            {
                includeHeaders: [FlinksHeaderOptions.AuthKey],
            },
        );
        if (data.HttpStatusCode !== 200) {
            const err = `Status ${data.HttpStatusCode}: ${data.FlinksCode} | ${data.Message}`;
            throw new Error(`Failed to generate authorize token! \n ${err}`);
        }
        return {
            token: data.Token,
            timestamp: Date.now(),
        };
    }

    /**
     * Generates an Authorize token & turns it into a Request ID
     * associated with the provided Login ID
     *
     * Only returns the RequestID
     *
     * @param loginId
     */
    public async getRequestId(
        loginId: string,
        options?: FlinksAuthorizeOptions,
    ): Promise<IFlinksAuthorize> {
        if (!this.country) {
            throw new Error("No locale provided for flinks!!");
        }

        const securityResponses: SecurityResponses[] |undefined = options?.mfaResponse;
        const params = {
            LoginId: loginId,
            MostRecentCached:
                options?.mostRecentCached === undefined
                    ? true
                    : options?.mostRecentCached,
            Save: options?.save,
            Tag: options?.tag,
            SecurityResponses: securityResponses,
            requestId: options?.requestId,
        };
        const authorizeToken = await this.getAuthorizeToken();

        // if (this.configService.flinksDebug) {
        //     this.logger.debug("Flinks Debug Info:", {
        //         loginId,
        //         authorizeToken,
        //         date: new Date().toISOString(),
        //     });
        // }

        const response = await this.post<IFlinksAuthorize>(
            "BankingServices/Authorize",
            {
                headers: {
                    "flinks-auth-key": authorizeToken.token,
                },
                body: params,
                customTimeout: options?.customTimeout || 180000, // Timeout set to 3 minutes by default
            },
        );

        // TODO: Add debugging to constructor.
        // if (this.configService.flinksDebug) {
        //     this.logger.log(response);
        // }

        if (
            response?.Message ===
            // TODO: this string may change. Find a better way to check if loginId no longer exists
            "Request source is unsupported. (Parameter 'requestSource')\nActual value was Unknown."
        ) {
            this.logger.log(
                `Flinks Account with login ID ${loginId} no longer exists! This account should be disabled!`,
            );
            return response;
        }

        if (!response?.RequestId) {
            throw new Error("Response does not contain RequestId!");
        }

        return response;
    }

    async receivePendingData<T extends IFlinksResponse>(pendingPackage: PendingPackage): Promise<T>{
        const delay = (ms: number) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };
        //Initial delay
        await delay(2000);

        for (let attempts = 1; attempts <= MAX_API_ATTEMPTS; attempts++) {
            // if (this.configService.flinksDebug) {
            //      this.logger.log("attempts", attempts);
            //      this.logger.log("before request", Date.now());
            // }
            let response: AxiosResponse<T>;

            try {
                response = await this.axios.get(
                    `${this.url}/${this.customerId}/${pendingPackage.PathParam}Async/${pendingPackage.requestId}`,
                    {
                        headers: pendingPackage.headers,
                        timeout: this.REQUEST_TIMEOUT,
                    },
                );
            } catch (error) {
                throw new Error("Absolute failure when attempting async fetch.");
            }

            switch (response.status) {
                case 200:
                    return response.data;

                case 202:
                    await delay(10000);
                    this.logger.log("still waiting 202: ", attempts);
                    break;

                default:
                    this.logger.error(
                        `Flinks async request failed with status ${response.status}, Status text: ${response.statusText}`,
                    );
                    if (response.data) {
                        this.logger.error(
                            `Additional information from Flinks: Flinks Code: ${response.data.FlinksCode}, Message: ${response.data.Message}`,
                        );
                    }
                    await delay(10000);
            }
        }

        throw new Error("Failed to retrieve pending data");
    }

    /**
     * This function will create a POST request to flinks, and manage any 202 status responses received.
     *
     *     Additional allowed options:
     *     Body - JSON body object
     *
     *     !! Path should omit the first "/" !!
     *
     *
     * @param path
     * @param body
     */
    async post<T extends IFlinksResponse>(
        path: string,
        options: FlinksPostOptions,
    ): Promise<T> {
        if (!this.country) {
            throw new Error("No locale set for Flinks API!");
        }

        const headers: Record<string, string> = {
            ...options.headers,
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }),
        };

        const response: AxiosResponse<T> =
            await this.axios.post<T>(
                this.flinksApiUrlBuilder(path, options),
                options.body || {},
                // TODO: validate status should eventually actually validate the status
                {
                    headers: headers,
                    timeout: options?.customTimeout || this.REQUEST_TIMEOUT,
                    validateStatus: () => true,
                },
            );

        if (!(response.status >= 200 && response.status < 300)) {
            if (response.data && response.data.Message) {
                this.logger.error(
                    `Flinks Post had status: ${response.status} and returned message ${response.data.Message}`,
                );
            } else {
                throw new Error(
                    `Flinks Post failed with status ${response.status}: ${response.statusText}`,
                );
            }
        }
        if (response.data.HttpStatusCode === 202) {
            const pendingPackage: PendingPackage = {
                PathParam: path,
                requestId: response.data.RequestId,
                HttpStatusCode: 202,
                headers: headers,
            };
            //
            return await this.receivePendingData(pendingPackage);
        }
        return response.data;
    }

    /**
     *  Patch method of the Flinks API.
     *
     *     Additional allowed options:
     *     Body - JSON body object
     *
     *     !! Path should omit the first "/" !!
     *
     * @param path
     * @param options
     */
    async patch<T extends IFlinksResponse>(
        path: string,
        options: FlinksPatchOptions,
    ): Promise<T> {
        if (!this.country) {
            throw new Error("No locale set for Flinks API!");
        }

        const headers: Record<string, string> = {
            ...options.headers,
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }),
        };

        let pathParams: string = "";
        options.pathParams?.map((param) => {
            pathParams = `${pathParams}/${param}`;
        });

        const response: AxiosResponse<T> = await this.axios.patch<T>(
            `${this.url}/${this.customerId}/${path}${pathParams}`,
            options.body || {},
            {
                headers: headers,
                timeout: options?.customTimeout || this.REQUEST_TIMEOUT,
            },
        );

        if (!(response.status >= 200 && response.status < 300)) {
            if (response.data) {
                this.logger.error(
                    `Flinks Patch had status: ${response.status} and returned message ${response.data.Message}`,
                );
            } else {
                throw new Error(
                    `Flinks Patch failed with status ${response.status}: ${response.statusText}`,
                );
            }
        }
        if (response.data.HttpStatusCode === 202) {
            const pendingPackage: PendingPackage = {
                PathParam: path,
                requestId: options.requestId,
                HttpStatusCode: 202,
                headers: headers,
            };

            return await this.receivePendingData(pendingPackage);
        }
        return response.data;
    }

    /**
     * Get method for the Flinks API
     *
     *
     *  !! Path should omit the first "/" !!
     *
     * @param path
     * @param options
     */
    async get(path: string, options: FlinksGetOptions) {
        if (!this.country) {
            throw new Error("No locale set for Flinks API!");
        }

        const headers: Record<string, string> = {
            ...options.headers,
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }),
        };


        const response = await this.axios.get<FlinksResponse>(
            this.flinksApiUrlBuilder(path, options),
            {
                headers: headers,
                timeout: options?.customTimeout || this.REQUEST_TIMEOUT,
            },
        );

        if (!(response.status >= 200 && response.status < 300)) {
            if (response.data) {
                this.logger.error(
                    `Flinks Get had status: ${response.status} and returned message ${response.data.Message}`,
                );
            } else {
                throw new Error(
                    `Flinks Get failed with status ${response.status}: ${response.statusText}`,
                );
            }
        }

        if (response.data.HttpStatusCode === 202) {
            const pendingPackage: PendingPackage = {
                PathParam: path,
                requestId: options.requestId,
                HttpStatusCode: 202,
                headers: headers,
            };

            return await this.receivePendingData(pendingPackage);
        }

        return response.data;
    }

    /**
     *  Delete method for our Flinks API
     *
     *    !! Path should omit the first "/" !!
     *
     * @param path
     * @param options
     */
    async delete(
        path: string,
        options: FlinksDeleteOptions,
    ): Promise<FlinksResponse> {
        if (!this.country) {
            throw new Error("No locale set for Flinks API!");
        }

        const headers: Record<string, string> = {
            ...options.headers,
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey }),
            ...(options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }),
        };

        const response = await this.axios.delete<FlinksResponse>(
            this.flinksApiUrlBuilder(path, options),
            {
                headers: headers,
                timeout: options?.customTimeout || this.REQUEST_TIMEOUT,
            },
        );

        if (!(response.status >= 200 && response.status < 300)) {
            if (response.data) {
                this.logger.error(
                    `Flinks Delete had status: ${response.status} and returned message ${response.data.Message}`,
                );
            } else {
                throw new Error(
                    `Flinks Delete failed with status ${response.status}: ${response.statusText}`,
                );
            }
        }

        if (response.data.HttpStatusCode === 202) {
            const pendingPackage: PendingPackage = {
                PathParam: path,
                requestId: options.requestId,
                HttpStatusCode: 202,
                headers: headers,
            };

            return await this.receivePendingData(pendingPackage);
        }

        return response.data;
    }
}