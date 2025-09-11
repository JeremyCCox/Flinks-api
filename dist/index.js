//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let axios = require("axios");
axios = __toESM(axios);

//#region src/types.ts
/**
* ============================
* Flinks API Types
* ============================
* This file defines request/response types for interacting with the Flinks API.
* Based on: https://docs.flinks.com/reference
*/
/**
* Supported country shortcodes for Flinks API.
*/
let CountryShortcode = /* @__PURE__ */ function(CountryShortcode$1) {
	CountryShortcode$1["Canada"] = "CA";
	CountryShortcode$1["UnitedStates"] = "US";
	return CountryShortcode$1;
}({});
/**
* Supported currencies.
*/
let AllowedCurrencyTypes = /* @__PURE__ */ function(AllowedCurrencyTypes$1) {
	AllowedCurrencyTypes$1["CAD"] = "CAD";
	AllowedCurrencyTypes$1["USD"] = "USD";
	return AllowedCurrencyTypes$1;
}({});
/**
* Security challenge types during authorization (e.g. MFA).
*/
let FlinksSecurityType = /* @__PURE__ */ function(FlinksSecurityType$1) {
	FlinksSecurityType$1["QuestionAndAnswer"] = "QuestionAndAnswer";
	FlinksSecurityType$1["Token"] = "Token";
	FlinksSecurityType$1["Image"] = "Image";
	return FlinksSecurityType$1;
}({});
/**
* Flinks async package statuses.
* Flinks uses async polling for some endpoints; responses may be "Pending".
*/
let EFlinksCodes = /* @__PURE__ */ function(EFlinksCodes$1) {
	EFlinksCodes$1["Pending"] = "Pending";
	EFlinksCodes$1["Done"] = "Done";
	EFlinksCodes$1["Error"] = "Error";
	return EFlinksCodes$1;
}({});
/**
* MFA (Multi-factor Authentication) prompt types.
*/
let MFAType = /* @__PURE__ */ function(MFAType$1) {
	MFAType$1["Question"] = "Question";
	MFAType$1["Password"] = "Password";
	MFAType$1["Token"] = "Token";
	return MFAType$1;
}({});
/**
* Response types for generic handling.
*/
let ResponseType = /* @__PURE__ */ function(ResponseType$1) {
	ResponseType$1["Authorize"] = "Authorize";
	ResponseType$1["Accounts"] = "Accounts";
	ResponseType$1["Details"] = "Details";
	ResponseType$1["Transactions"] = "Transactions";
	ResponseType$1["Summary"] = "Summary";
	ResponseType$1["Token"] = "Token";
	return ResponseType$1;
}({});
/**
* Supported headers in Flinks requests.
*/
let FlinksHeaderOptions = /* @__PURE__ */ function(FlinksHeaderOptions$1) {
	FlinksHeaderOptions$1["Accept"] = "accept";
	FlinksHeaderOptions$1["ContentType"] = "content-type";
	FlinksHeaderOptions$1["AuthKey"] = "authkey";
	return FlinksHeaderOptions$1;
}({});

//#endregion
//#region src/FlinksApi.ts
const MAX_API_ATTEMPTS = 20;
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
var FlinksApi = class {
	static {
		this.interceptorInstalled = false;
	}
	constructor(config) {
		this.logger = console;
		this.REQUEST_TIMEOUT = 3e4;
		this.country = config.country;
		this.customerId = config.customerId;
		this.url = config.url;
		this["x-api-key"] = config["x-api-key"];
		this["flinks-auth-key"] = config["flinks-auth-key"];
		this["Authorization"] = config["Authorization"];
		this.axios = config.axiosInstance ?? axios.default.create();
		this.logger = {
			log: config.loggerInstance?.log ?? console.log,
			error: config.loggerInstance?.error ?? console.error,
			warn: config.loggerInstance?.warn ?? console.warn,
			debug: config.loggerInstance?.debug ?? console.debug
		};
	}
	/**
	* Returns a Flinks URL for being registered under a VoPay account,
	* based on the Country this class is registered to return
	*/
	getFlinksUrl() {
		return `${this.url}/${this.customerId}`;
	}
	flinksApiUrlBuilder(path, options) {
		let pathParams = "";
		options?.pathParams?.map((param) => {
			pathParams = `${pathParams}/${param}`;
		});
		const queryParams = new URLSearchParams();
		Object.entries(options?.queryParams || []).map((param) => {
			queryParams.append(param[0], param[1]);
		});
		return `${this.url}/${this.customerId}/${path}${pathParams}${queryParams.size > 0 ? `?${queryParams.toString()}` : ""}`;
	}
	async getAuthorizeToken() {
		const data = await this.post("BankingServices/GenerateAuthorizeToken", { includeHeaders: [FlinksHeaderOptions.Authkey] });
		if (data.HttpStatusCode !== 200) {
			const err = `Status ${data.HttpStatusCode}: ${data.FlinksCode} | ${data.Message}`;
			throw new Error(`Failed to generate authorize token! \n ${err}`);
		}
		return {
			token: data.Token,
			timestamp: Date.now()
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
	async getRequestId(loginId, options) {
		if (!this.country) throw new Error("No locale provided for flinks!!");
		const securityResponses = options?.mfaResponse;
		const params = {
			LoginId: loginId,
			MostRecentCached: options?.mostRecentCached === void 0 ? true : options?.mostRecentCached,
			Save: options?.save,
			Tag: options?.tag,
			SecurityResponses: securityResponses,
			requestId: options?.requestId
		};
		const authorizeToken = await this.getAuthorizeToken();
		const response = await this.post("BankingServices/Authorize", {
			headers: { "flinks-auth-key": authorizeToken.token },
			body: params,
			customTimeout: options?.customTimeout || 18e4
		});
		if (response?.Message === "Request source is unsupported. (Parameter 'requestSource')\nActual value was Unknown.") {
			this.logger.log(`Flinks Account with login ID ${loginId} no longer exists! This account should be disabled!`);
			return response;
		}
		if (!response?.RequestId) throw new Error("Response does not contain RequestId!");
		return response;
	}
	async receivePendingData(pendingPackage) {
		const delay = (ms) => {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};
		await delay(2e3);
		for (let attempts = 1; attempts <= MAX_API_ATTEMPTS; attempts++) {
			let response;
			try {
				response = await this.axios.get(`${this.url}/${this.customerId}/${pendingPackage.PathParam}Async/${pendingPackage.requestId}`, {
					headers: pendingPackage.headers,
					timeout: this.REQUEST_TIMEOUT
				});
			} catch (error) {
				throw new Error("Absolute failure when attempting async fetch.");
			}
			switch (response.status) {
				case 200: return response.data;
				case 202:
					await delay(1e4);
					this.logger.log("still waiting 202: ", attempts);
					break;
				default:
					this.logger.error(`Flinks async request failed with status ${response.status}, Status text: ${response.statusText}`);
					if (response.data) this.logger.error(`Additional information from Flinks: Flinks Code: ${response.data.FlinksCode}, Message: ${response.data.Message}`);
					await delay(1e4);
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
	async post(path, options) {
		if (!this.country) throw new Error("No locale set for Flinks API!");
		const headers = options.headers || {};
		options.includeHeaders?.map((header) => {
			headers[header] = this[header];
		});
		const response = await this.axios.post(this.flinksApiUrlBuilder(path, options), options.body || {}, {
			headers,
			timeout: options?.customTimeout || this.REQUEST_TIMEOUT,
			validateStatus: () => true
		});
		if (!(response.status >= 200 && response.status < 300)) if (response.data && response.data.Message) this.logger.error(`Flinks Post had status: ${response.status} and returned message ${response.data.Message}`);
		else throw new Error(`Flinks Post failed with status ${response.status}: ${response.statusText}`);
		if (response.data.HttpStatusCode === 202) {
			const pendingPackage = {
				PathParam: path,
				requestId: response.data.RequestId,
				HttpStatusCode: 202,
				headers
			};
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
	async patch(path, options) {
		if (!this.country) throw new Error("No locale set for Flinks API!");
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			...options.headers
		};
		options.includeHeaders?.map((header) => {
			headers[header] = this[header];
		});
		let pathParams = "";
		options.pathParams?.map((param) => {
			pathParams = `${pathParams}/${param}`;
		});
		const response = await this.axios.patch(`${this.url}/${this.customerId}/${path}${pathParams}`, options.body || {}, {
			headers,
			timeout: options?.customTimeout || this.REQUEST_TIMEOUT
		});
		if (!(response.status >= 200 && response.status < 300)) if (response.data) this.logger.error(`Flinks Patch had status: ${response.status} and returned message ${response.data.Message}`);
		else throw new Error(`Flinks Patch failed with status ${response.status}: ${response.statusText}`);
		if (response.data.HttpStatusCode === 202) {
			const pendingPackage = {
				PathParam: path,
				requestId: options.requestId,
				HttpStatusCode: 202,
				headers
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
	async get(path, options) {
		if (!this.country) throw new Error("No locale set for Flinks API!");
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			...options.headers
		};
		options.includeHeaders?.map((header) => {
			headers[header] = this[header];
		});
		const response = await this.axios.get(this.flinksApiUrlBuilder(path, options), {
			headers,
			timeout: options?.customTimeout || this.REQUEST_TIMEOUT
		});
		if (!(response.status >= 200 && response.status < 300)) if (response.data) this.logger.error(`Flinks Get had status: ${response.status} and returned message ${response.data.Message}`);
		else throw new Error(`Flinks Get failed with status ${response.status}: ${response.statusText}`);
		if (response.data.HttpStatusCode === 202) {
			const pendingPackage = {
				PathParam: path,
				requestId: options.requestId,
				HttpStatusCode: 202,
				headers
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
	async delete(path, options) {
		if (!this.country) throw new Error("No locale set for Flinks API!");
		const headers = {
			accept: "application/json",
			"content-type": "application/json",
			...options.headers
		};
		options.includeHeaders?.map((header) => {
			headers[header] = this[header];
		});
		const response = await this.axios.delete(this.flinksApiUrlBuilder(path, options), {
			headers,
			timeout: options?.customTimeout || this.REQUEST_TIMEOUT
		});
		if (!(response.status >= 200 && response.status < 300)) if (response.data) this.logger.error(`Flinks Delete had status: ${response.status} and returned message ${response.data.Message}`);
		else throw new Error(`Flinks Delete failed with status ${response.status}: ${response.statusText}`);
		if (response.data.HttpStatusCode === 202) {
			const pendingPackage = {
				PathParam: path,
				requestId: options.requestId,
				HttpStatusCode: 202,
				headers
			};
			return await this.receivePendingData(pendingPackage);
		}
		return response.data;
	}
};

//#endregion
exports.AllowedCurrencyTypes = AllowedCurrencyTypes;
exports.CountryShortcode = CountryShortcode;
exports.EFlinksCodes = EFlinksCodes;
exports.FlinksApi = FlinksApi;
exports.FlinksHeaderOptions = FlinksHeaderOptions;
exports.FlinksSecurityType = FlinksSecurityType;
exports.MFAType = MFAType;
exports.ResponseType = ResponseType;