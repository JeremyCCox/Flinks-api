import { AxiosInstance } from "axios";

//#region src/types.d.ts

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
declare enum CountryShortcode {
  Canada = "CA",
  UnitedStates = "US",
}
/**
 * Supported currencies.
 */
declare enum AllowedCurrencyTypes {
  CAD = "CAD",
  USD = "USD",
}
/**
 * Security challenge types during authorization (e.g. MFA).
 */
declare enum FlinksSecurityType {
  QuestionAndAnswer = "QuestionAndAnswer",
  Token = "Token",
  Image = "Image",
}
/**
 * Flinks async package statuses.
 * Flinks uses async polling for some endpoints; responses may be "Pending".
 */
declare enum EFlinksCodes {
  Pending = "Pending",
  Done = "Done",
  Error = "Error",
}
/**
 * MFA (Multi-factor Authentication) prompt types.
 */
declare enum MFAType {
  Question = "Question",
  Password = "Password",
  Token = "Token",
}
/**
 * Response types for generic handling.
 */
declare enum ResponseType {
  Authorize = "Authorize",
  Accounts = "Accounts",
  Details = "Details",
  Transactions = "Transactions",
  Summary = "Summary",
  Token = "Token",
}
/**
 * Standard Flinks API response envelope.
 */
interface FlinksResponse {
  RequestId: string;
  Links?: string[];
  Code?: string;
  Message?: string;
  IsPending?: boolean;
}
/**
 * Options for Authorize request.
 * https://docs.flinks.com/reference/post-sandboxauthorize
 */
interface FlinksAuthorizeOptions {
  LoginId?: string;
  Username?: string;
  Password?: string;
  MFAType?: MFAType;
  Answers?: string[];
  Save?: boolean;
}
/**
 * Response returned from Authorize.
 */
interface IFlinksAuthorize extends FlinksResponse {
  Authorization?: string;
  AccountsCount?: number;
  Accounts?: IFlinksAccount[];
  Challenge?: {
    Type: FlinksSecurityType;
    Question?: string;
  };
}
/**
 * Response for Account Details.
 * https://docs.flinks.com/reference/post-sandboxaccounts
 */
interface IFlinksDetails extends FlinksResponse {
  Accounts?: IFlinksAccount[];
}
/**
 * Response for Summary data.
 * https://docs.flinks.com/reference/post-sandboxsummary
 */
interface IFlinksSummary extends FlinksResponse {
  Accounts?: IFlinksAccount[];
  Transactions?: IFlinksTransaction[];
}
/**
 * Response for AuthorizeToken.
 * https://docs.flinks.com/reference/post-sandboxauthorizetoken
 */
interface IFlinksToken extends FlinksResponse {
  LoginId: string;
  AccessToken: string;
}
/**
 * Represents a financial account returned by Flinks.
 */
interface IFlinksAccount {
  Id: string;
  Institution: string;
  InstitutionId: string;
  Name: string;
  Number: string;
  Category: string;
  Type: string;
  Currency: AllowedCurrencyTypes;
  Balance?: IFlinksBalance;
  Transactions?: IFlinksTransaction[];
}
/**
 * Balance object for an account.
 */
interface IFlinksBalance {
  Current: number;
  Available?: number;
  Limit?: number;
  Currency: AllowedCurrencyTypes;
  LastUpdated?: string;
}
/**
 * Transaction object for an account.
 */
interface IFlinksTransaction {
  Id: string;
  AccountId: string;
  Description: string;
  Date: string;
  Amount: number;
  Type: string;
  Currency: AllowedCurrencyTypes;
}
/**
 * Flinks async response wrapper.
 */
interface PendingPackage {
  Code: EFlinksCodes;
  RequestId: string;
  Links: string[];
}
/**
 * Logger interface for injecting a custom logger.
 */
interface Logger {
  debug(message: string, ...meta: any[]): void;
  info(message: string, ...meta: any[]): void;
  warn(message: string, ...meta: any[]): void;
  error(message: string, ...meta: any[]): void;
}
/**
 * Flinks API configuration object.
 */
interface FlinksApiConfiguration {
  /** API base URL (e.g., https://api.flinks.com) */
  baseUrl: string;
  /** Flinks Customer ID (provided by Flinks) */
  customerId: string;
  /** Optional API key (AuthKey) */
  authKey?: string;
  /** Optional custom logger */
  logger?: Logger;
  /** Country context */
  country?: CountryShortcode;
}
/**
 * Supported headers in Flinks requests.
 */
declare enum FlinksHeaderOptions {
  Accept = "accept",
  ContentType = "content-type",
  AuthKey = "authkey",
}
//#endregion
//#region src/FlinksApi.d.ts
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
declare class FlinksApi {
  private static interceptorInstalled;
  constructor(config: FlinksApiConfiguration);
  protected country: CountryShortcode;
  protected customerId: string;
  protected url: string;
  protected "x-api-key": string;
  protected "flinks-auth-key": string;
  protected "Authorization": string;
  protected axios: AxiosInstance;
  protected logger: Required<Logger> | Console;
  private REQUEST_TIMEOUT;
  /**
   * Returns a Flinks URL for being registered under a VoPay account,
   * based on the Country this class is registered to return
   */
  getFlinksUrl(): string;
  private flinksApiUrlBuilder;
  getAuthorizeToken(): Promise<FlinksAuthorizeToken>;
  /**
   * Generates an Authorize token & turns it into a Request ID
   * associated with the provided Login ID
   *
   * Only returns the RequestID
   *
   * @param loginId
   */
  getRequestId(loginId: string, options?: FlinksAuthorizeOptions): Promise<IFlinksAuthorize>;
  receivePendingData<T extends IFlinksResponse>(pendingPackage: PendingPackage): Promise<T>;
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
  post<T extends IFlinksResponse>(path: string, options: FlinksPostOptions): Promise<T>;
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
  patch<T extends IFlinksResponse>(path: string, options: FlinksPatchOptions): Promise<T>;
  /**
   * Get method for the Flinks API
   *
   *
   *  !! Path should omit the first "/" !!
   *
   * @param path
   * @param options
   */
  get(path: string, options: FlinksGetOptions): Promise<any>;
  /**
   *  Delete method for our Flinks API
   *
   *    !! Path should omit the first "/" !!
   *
   * @param path
   * @param options
   */
  delete(path: string, options: FlinksDeleteOptions): Promise<FlinksResponse>;
}
//#endregion
export { AllowedCurrencyTypes, CountryShortcode, EFlinksCodes, FlinksApi, FlinksApiConfiguration, FlinksAuthorizeOptions, FlinksHeaderOptions, FlinksResponse, FlinksSecurityType, IFlinksAccount, IFlinksAuthorize, IFlinksBalance, IFlinksDetails, IFlinksSummary, IFlinksToken, IFlinksTransaction, Logger, MFAType, PendingPackage, ResponseType };