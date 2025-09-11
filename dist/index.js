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
let AllowedCurrencyTypes = /* @__PURE__ */ function(AllowedCurrencyTypes$1) {
	AllowedCurrencyTypes$1["cad"] = "CAD";
	AllowedCurrencyTypes$1["usd"] = "USD";
	return AllowedCurrencyTypes$1;
}({});
let ProvincesShortcode = /* @__PURE__ */ function(ProvincesShortcode$1) {
	ProvincesShortcode$1["Alberta"] = "AB";
	ProvincesShortcode$1["British Columbia"] = "BC";
	ProvincesShortcode$1["Manitoba"] = "MB";
	ProvincesShortcode$1["New Brunswick"] = "NB";
	ProvincesShortcode$1["Newfoundland and Labrador"] = "NL";
	ProvincesShortcode$1["Northwest Territories"] = "NT";
	ProvincesShortcode$1["Nova Scotia"] = "NS";
	ProvincesShortcode$1["Ontario"] = "ON";
	ProvincesShortcode$1["Prince Edward Island"] = "PE";
	ProvincesShortcode$1["Quebec"] = "QC";
	ProvincesShortcode$1["Saskatchewan"] = "SK";
	ProvincesShortcode$1["Yukon"] = "YT";
	ProvincesShortcode$1["Nunavut"] = "NU";
	return ProvincesShortcode$1;
}({});
let StatesShortcode = /* @__PURE__ */ function(StatesShortcode$1) {
	StatesShortcode$1["Alabama"] = "AL";
	StatesShortcode$1["Alaska"] = "AK";
	StatesShortcode$1["Arizona"] = "AZ";
	StatesShortcode$1["Arkansas"] = "AR";
	StatesShortcode$1["California"] = "CA";
	StatesShortcode$1["Colorado"] = "CO";
	StatesShortcode$1["Connecticut"] = "CT";
	StatesShortcode$1["Delaware"] = "DE";
	StatesShortcode$1["Florida"] = "FL";
	StatesShortcode$1["Georgia"] = "GA";
	StatesShortcode$1["Hawaii"] = "HI";
	StatesShortcode$1["Idaho"] = "ID";
	StatesShortcode$1["Illinois"] = "IL";
	StatesShortcode$1["Indiana"] = "IN";
	StatesShortcode$1["Iowa"] = "IA";
	StatesShortcode$1["Kansas"] = "KS";
	StatesShortcode$1["Kentucky"] = "KY";
	StatesShortcode$1["Louisiana"] = "LA";
	StatesShortcode$1["Maine"] = "ME";
	StatesShortcode$1["Maryland"] = "MD";
	StatesShortcode$1["Massachusetts"] = "MA";
	StatesShortcode$1["Michigan"] = "MI";
	StatesShortcode$1["Minnesota"] = "MN";
	StatesShortcode$1["Mississippi"] = "MS";
	StatesShortcode$1["Missouri"] = "MO";
	StatesShortcode$1["Montana"] = "MT";
	StatesShortcode$1["Nebraska"] = "NE";
	StatesShortcode$1["Nevada"] = "NV";
	StatesShortcode$1["NewHampshire"] = "NH";
	StatesShortcode$1["NewJersey"] = "NJ";
	StatesShortcode$1["NewMexico"] = "NM";
	StatesShortcode$1["NewYork"] = "NY";
	StatesShortcode$1["NorthCarolina"] = "NC";
	StatesShortcode$1["NorthDakota"] = "ND";
	StatesShortcode$1["Ohio"] = "OH";
	StatesShortcode$1["Oklahoma"] = "OK";
	StatesShortcode$1["Oregon"] = "OR";
	StatesShortcode$1["Pennsylvania"] = "PA";
	StatesShortcode$1["RhodeIsland"] = "RI";
	StatesShortcode$1["SouthCarolina"] = "SC";
	StatesShortcode$1["SouthDakota"] = "SD";
	StatesShortcode$1["Tennessee"] = "TN";
	StatesShortcode$1["Texas"] = "TX";
	StatesShortcode$1["Utah"] = "UT";
	StatesShortcode$1["Vermont"] = "VT";
	StatesShortcode$1["Virginia"] = "VA";
	StatesShortcode$1["Washington"] = "WA";
	StatesShortcode$1["WestVirginia"] = "WV";
	StatesShortcode$1["Wisconsin"] = "WI";
	StatesShortcode$1["Wyoming"] = "WY";
	return StatesShortcode$1;
}({});
let CountryShortcode = /* @__PURE__ */ function(CountryShortcode$1) {
	CountryShortcode$1["Canada"] = "CA";
	CountryShortcode$1["United States"] = "US";
	return CountryShortcode$1;
}({});
let DaysOfTransactionsOptions = /* @__PURE__ */ function(DaysOfTransactionsOptions$1) {
	DaysOfTransactionsOptions$1["Days90"] = "Days90";
	DaysOfTransactionsOptions$1["Days365"] = "Days365";
	return DaysOfTransactionsOptions$1;
}({});
let NumberOfStatements = /* @__PURE__ */ function(NumberOfStatements$1) {
	NumberOfStatements$1["Most Recent"] = "MostRecent";
	NumberOfStatements$1["Months 3"] = "Months3";
	NumberOfStatements$1["Months 12"] = "Months12";
	return NumberOfStatements$1;
}({});
let FlinksHeaderOptions = /* @__PURE__ */ function(FlinksHeaderOptions$1) {
	FlinksHeaderOptions$1["AuthKey"] = "AuthKey";
	FlinksHeaderOptions$1["ApiKey"] = "ApiKey";
	FlinksHeaderOptions$1["Authorization"] = "Authorization";
	return FlinksHeaderOptions$1;
}({});
let FlinksSecurityType = /* @__PURE__ */ function(FlinksSecurityType$1) {
	FlinksSecurityType$1["QuestionAndAnswer"] = "QuestionAndAnswer";
	FlinksSecurityType$1["ImageSelection"] = "ImageSelection";
	FlinksSecurityType$1["MultipleChoice"] = "MultipleChoice";
	FlinksSecurityType$1["TextOrCall"] = "TextOrCall";
	FlinksSecurityType$1["WaitUntilEUAccept"] = "WaitUntilEUAccept";
	FlinksSecurityType$1["MultipleChoiceMultipleAnswers"] = "MultipleChoiceMultipleAnswers";
	return FlinksSecurityType$1;
}({});
let EFlinksCodes = /* @__PURE__ */ function(EFlinksCodes$1) {
	EFlinksCodes$1["INVALID_LOGIN"] = "INVALID_LOGIN";
	EFlinksCodes$1["METHOD_NOT_AVAILABLE"] = "METHOD_NOT_AVAILABLE";
	EFlinksCodes$1["INVALID_SECURITY_RESPONSE"] = "INVALID_SECURITY_RESPONSE";
	EFlinksCodes$1["UNKNOWN_CHALLENGE_KEY"] = "UNKNOWN_CHALLENGE_KEY";
	return EFlinksCodes$1;
}({});
let MFAType = /* @__PURE__ */ function(MFAType$1) {
	MFAType$1["Cached"] = "Cached";
	MFAType$1["ActionRequired"] = "ActionRequired";
	return MFAType$1;
}({});
let ResponseType = /* @__PURE__ */ function(ResponseType$1) {
	ResponseType$1["GetAccountsDetail"] = "GetAccountsDetail";
	ResponseType$1["KYC"] = "KYC";
	return ResponseType$1;
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
		this.REQUEST_TIMEOUT = 3e4;
		this.country = config.country;
		this.customerId = config.customerId;
		this.url = config.url;
		this.apiKey = config.apiKey;
		this.authKey = config.authKey;
		this.authorization = config.authorization;
		this.axios = config.axiosInstance ?? axios.default.create({
			baseURL: `${this.url}/${this.customerId}`,
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				...this.authKey ? { "flinks-auth-key": this.authKey } : {}
			}
		});
		this.logger = {
			log: config.logger?.log ?? console.log,
			error: config.logger?.error ?? console.error,
			info: config.logger?.info ?? console.info,
			warn: config.logger?.warn ?? console.warn,
			debug: config.logger?.debug ?? console.debug
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
		const data = await this.post("BankingServices/GenerateAuthorizeToken", { includeHeaders: [FlinksHeaderOptions.AuthKey] });
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
		const headers = {
			...options.headers,
			...options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }
		};
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
			...options.headers,
			...options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }
		};
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
			...options.headers,
			...options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }
		};
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
			...options.headers,
			...options.includeHeaders?.includes(FlinksHeaderOptions.ApiKey) && { "x-api-key": this.apiKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.AuthKey) && { "flinks-auth-key": this.authKey },
			...options.includeHeaders?.includes(FlinksHeaderOptions.Authorization) && { "Authorization": this.authorization }
		};
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
exports.DaysOfTransactionsOptions = DaysOfTransactionsOptions;
exports.EFlinksCodes = EFlinksCodes;
exports.FlinksApi = FlinksApi;
exports.FlinksHeaderOptions = FlinksHeaderOptions;
exports.FlinksSecurityType = FlinksSecurityType;
exports.MFAType = MFAType;
exports.NumberOfStatements = NumberOfStatements;
exports.ProvincesShortcode = ProvincesShortcode;
exports.ResponseType = ResponseType;
exports.StatesShortcode = StatesShortcode;