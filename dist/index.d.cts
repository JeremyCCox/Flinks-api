import { AxiosInstance, AxiosRequestConfig } from "axios";

//#region src/types.d.ts
interface Logger {
  log(message: string, ...optionalParams: any[]): void;
  error(message: string, ...optionalParams: any[]): void;
  info?(message: string, ...optionalParams: any[]): void;
  warn?(message: string, ...optionalParams: any[]): void;
  debug?(message: string, ...optionalParams: any[]): void;
}
interface FlinksApiConfiguration {
  country: CountryShortcode;
  customerId: string;
  url: string;
  apiKey: string;
  authKey: string;
  bearerToken: string;
  axiosInstance?: AxiosInstance;
  logger?: Logger;
}
declare enum AllowedCurrencyTypes {
  "cad" = "CAD",
  "usd" = "USD",
}
declare enum ProvincesShortcode {
  "Alberta" = "AB",
  "British Columbia" = "BC",
  "Manitoba" = "MB",
  "New Brunswick" = "NB",
  "Newfoundland and Labrador" = "NL",
  "Northwest Territories" = "NT",
  "Nova Scotia" = "NS",
  "Ontario" = "ON",
  "Prince Edward Island" = "PE",
  "Quebec" = "QC",
  "Saskatchewan" = "SK",
  "Yukon" = "YT",
  "Nunavut" = "NU",
}
declare enum StatesShortcode {
  Alabama = "AL",
  Alaska = "AK",
  Arizona = "AZ",
  Arkansas = "AR",
  California = "CA",
  Colorado = "CO",
  Connecticut = "CT",
  Delaware = "DE",
  Florida = "FL",
  Georgia = "GA",
  Hawaii = "HI",
  Idaho = "ID",
  Illinois = "IL",
  Indiana = "IN",
  Iowa = "IA",
  Kansas = "KS",
  Kentucky = "KY",
  Louisiana = "LA",
  Maine = "ME",
  Maryland = "MD",
  Massachusetts = "MA",
  Michigan = "MI",
  Minnesota = "MN",
  Mississippi = "MS",
  Missouri = "MO",
  Montana = "MT",
  Nebraska = "NE",
  Nevada = "NV",
  NewHampshire = "NH",
  NewJersey = "NJ",
  NewMexico = "NM",
  NewYork = "NY",
  NorthCarolina = "NC",
  NorthDakota = "ND",
  Ohio = "OH",
  Oklahoma = "OK",
  Oregon = "OR",
  Pennsylvania = "PA",
  RhodeIsland = "RI",
  SouthCarolina = "SC",
  SouthDakota = "SD",
  Tennessee = "TN",
  Texas = "TX",
  Utah = "UT",
  Vermont = "VT",
  Virginia = "VA",
  Washington = "WA",
  WestVirginia = "WV",
  Wisconsin = "WI",
  Wyoming = "WY",
}
declare enum CountryShortcode {
  "Canada" = "CA",
  "United States" = "US",
}
type CaAddress = {
  CivicAddress: string;
  City: string;
  Province: ProvincesShortcode;
  PostalCode: string;
  POBox?: string;
  Country: CountryShortcode;
};
interface WordLists {
  adjectives: string[];
  verbs: string[];
  nouns: string[];
}
interface PendingPackage {
  requestId?: string;
  headers: Record<string, string>;
  PathParam: string;
  FlinksCode?: string;
  Body?: string;
  Config?: AxiosRequestConfig;
  Links?: [{
    rel: string;
    href: string;
    example: string;
  }];
  HttpStatusCode: number;
  Message?: string;
  RequestId?: string;
}
interface SecurityChallenge {
  Type: FlinksSecurityType;
  Prompt: string;
  Iterables: string[];
}
interface SecurityResponses {
  [key: string]: string[];
}
declare enum DaysOfTransactionsOptions {
  "Days90" = "Days90",
  "Days365" = "Days365",
}
interface BankInfoOptions {
  /**
   * Contains a valid Authorize Token and represents a successful call to the /Authorize endpoint.
   */
  requestId?: string;
  /**
   * Enable Instant Bank Verification (IBV).
   * Defaults to false.
   */
  WithAccountIdentity?: boolean;
  /**
   * Include customer (KYC) information in account details.
   * Defaults to false.
   */
  WithKYC?: boolean;
  /**
   * Include transactions in account details.
   * Defaults to false.
   */
  WithTransactions?: boolean;
  /**
   * Include balances in account details.
   * Defaults to false.
   */
  WithBalance?: boolean;
  /**
   * Limit the session to specific account IDs.
   */
  AccountsFilter?: string[];
  /**
   * Number of days of transaction history.
   * Defaults to "Days90".
   * - "Days90"
   * - "Days365"
   */
  DaysOfTransactions?: DaysOfTransactionsOptions;
  /**
   * Enable PDF banking statements (Base64).
   * Defaults to false.
   * Must be enabled by Flinks support.
   */
  WithDetailsAndBankingStatements?: boolean;
  /**
   * Number of PDF banking statements to return.
   */
  NumberOfBankingStatements?: number;
}
interface FlinksTransactionDetails {
  transactionId: string;
  AccountID: string;
  Key: string;
  Signature: string;
  FlinksAccountID: string;
  FlinksLoginID: string;
  Amount: number;
}
interface MFAQuestions {
  Question: string;
  Answer?: string;
}
interface Transaction {
  Date: string;
  Code: string | null;
  Description: string;
  Debit: number;
  Credit: number;
  Balance: number;
  Id: string;
}
interface TransactionHistory {
  Accounts: {
    Transactions: Transaction[];
  }[];
}
declare enum NumberOfStatements {
  "Most Recent" = "MostRecent",
  "Months 3" = "Months3",
  "Months 12" = "Months12",
}
type StatementsByAccount = {
  AccountNumber: string;
  Statements: [{
    UniqueId: string;
    FileType: string;
    Base64Bytes: string;
  }];
};
type AccountFromSummary = {
  EftEligibleRatio: number;
  ETransferEligibleRatio: number;
  Title: string;
  AccountNumber: string;
  LastFourDigits?: string;
  Balance: Balance;
  Category: string;
  Type: string;
  Currency: AllowedCurrencyTypes;
  Holder: {
    Name: string;
    Address: CaAddress;
    Email: string;
    Id: string;
  };
};
interface BankAccountDetails {
  FinancialInstitutionNumber: string;
  BranchTransitNumber: string;
  AccountNumber: string;
}
interface FlinksDataOptions {
  includeHeaders?: FlinksHeaderOptions[];
  headers?: Record<string, string>;
  requestId?: string;
  pathParams?: string[];
  queryParams?: Record<string, string>;
  customTimeout?: number;
}
interface FlinksPostOptions extends FlinksDataOptions {
  body?: unknown;
}
interface FlinksPatchOptions extends FlinksDataOptions {
  body?: unknown;
}
interface FlinksGetOptions extends FlinksDataOptions {}
interface FlinksDeleteOptions extends FlinksDataOptions {}
declare enum FlinksHeaderOptions {
  AuthKey = "AuthKey",
  ApiKey = "ApiKey",
  BearerToken = "BearerToken",
}
/**
 * This could probably be extensible, for the different Security Types
 */
interface FlinksAuthorizeOptions extends BankInfoOptions {
  mostRecentCached?: boolean;
  save?: boolean;
  mfaResponse?: SecurityResponses[];
  tag?: string;
  customTimeout?: number;
  requestId?: string;
}
declare enum FlinksSecurityType {
  "QuestionAndAnswer" = "QuestionAndAnswer",
  "ImageSelection" = "ImageSelection",
  "MultipleChoice" = "MultipleChoice",
  "TextOrCall" = "TextOrCall",
  "WaitUntilEUAccept" = "WaitUntilEUAccept",
  "MultipleChoiceMultipleAnswers" = "MultipleChoiceMultipleAnswers",
}
type Balance = {
  Available?: number;
  Current?: number;
  Limit?: number;
};
interface IFlinksBankAccountDetails {
  Transactions: IFlinksTransaction[];
  TransitNumber: string;
  InstitutionNumber: string;
  OverdraftLimit: number;
  Title: string;
  AccountNumber: string;
  LastFourDigits: string;
  Balance: IFlinksBalance;
  Category: string;
  Type: string;
  Currency: AllowedCurrencyTypes;
  Holder: IFlinksHolder;
  AccountType: string;
  Id: string;
}
interface IFlinksHolder {
  Name: string;
  Address: IFlinksAddress;
  Email: string;
  PhoneNumber: string;
}
interface IFlinksBalance {
  Available?: number;
  Current?: number;
  Limit?: number;
}
interface IFlinksAddress {
  CivicAddress: string;
  City: string;
  Province: ProvincesShortcode | StatesShortcode;
  PostalCode: string;
  POBox?: string;
  Country: CountryShortcode;
}
interface IFlinksLogin {
  Username: string;
  IsScheduledRefresh: boolean;
  LastRefresh: string;
  Type: string;
  Id: string;
}
interface IFlinksTransaction {
  Date: string;
  Code?: string | null;
  Description: string;
  Debit?: number | null;
  Credit?: number | null;
  Balance: number;
  Id: string;
}
interface IFlinksAccountCredential {
  loginId: string;
  accountId: string;
  institution: string;
  country: CountryShortcode;
  securityType?: FlinksSecurityType;
}
interface IFlinksLink {
  rel: string;
  href: string;
  example: string;
}
interface FlinksResponse {
  HttpStatusCode: number;
  StatusCode?: number;
  Message?: string;
  FlinksCode?: string;
  RequestId?: string;
  [key: string]: any;
  PathParam?: string;
  ApiKeyNeeded?: boolean;
}
interface OnboardEditOrganizationDto {
  organizationId: string;
  organizationName: string;
  organizationCountry: CountryShortcode;
  organizationPlan: string;
}
interface OnboardEditUserDto {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
  country: CountryShortcode;
}
interface IFlinksResponse {
  HttpStatusCode: number;
  Links?: IFlinksLink[];
  Login?: {
    Username: string;
    IsScheduledRefresh: boolean;
    LastRefresh: string;
    Type: string;
    Id: string;
  };
  StatementsByAccount?: IFlinksStatementsByAccount[];
  SecurityChallenges?: SecurityChallenge[];
  InstitutionName?: string;
  InstitutionId?: number;
  Institution?: string;
  RequestId?: string;
  Accounts?: IFlinksBankAccountDetails[];
  Message?: string;
  Tag?: string;
  FlinksCode?: EFlinksCodes;
}
interface IFlinksStatementsByAccount {
  AccountNumber: string;
  Statements: IFlinksStatement[];
}
interface IFlinksStatement {
  UniqueId: string;
  FileType: string;
  Base64Bytes: string;
}
interface IFlinksToken extends IFlinksResponse {
  Token: string;
}
interface IFlinksAuthorize extends IFlinksResponse {
  RequestId: string;
  Institution: string;
  Links: IFlinksLink[];
}
interface IFlinksDetails extends IFlinksResponse {
  HttpStatusCode: number;
  Accounts: IFlinksBankAccountDetails[];
  Links: IFlinksLink[];
  Tag: string;
  InstitutionName: string;
  Login: IFlinksLogin;
  InstitutionId: number;
  Institution: string;
  RequestId: string;
}
interface IFlinksSummary extends IFlinksResponse {
  Login: IFlinksLogin;
  Tag: string;
  InstitutionName: string;
  InstitutionId: number;
  Institution: string;
  RequestId: string;
  Accounts: IFlinksBankAccountDetails[];
  Links: IFlinksLink[];
}
interface FlinksAuthorizeToken {
  token: string;
  timestamp: number;
}
declare enum EFlinksCodes {
  "INVALID_LOGIN" = "INVALID_LOGIN",
  "METHOD_NOT_AVAILABLE" = "METHOD_NOT_AVAILABLE",
  "INVALID_SECURITY_RESPONSE" = "INVALID_SECURITY_RESPONSE",
  "UNKNOWN_CHALLENGE_KEY" = "UNKNOWN_CHALLENGE_KEY",
}
declare enum MFAType {
  "Cached" = "Cached",
  "ActionRequired" = "ActionRequired",
}
declare enum ResponseType {
  GetAccountsDetail = "GetAccountsDetail",
  KYC = "KYC",
}
interface ICachedFlinksWebhook {
  ResponseType: ResponseType;
  HttpStatusCode: number;
  Accounts?: IFlinksBankAccountDetails[];
  Login: IFlinksLogin;
  Institution: string;
  RequestId: string;
  Tag?: string;
}
interface IFlinksWebhookTag {
  origin: string;
  [key: string]: string;
}
interface IUniqueLogin {
  institution: string;
  flinksId: string;
  title?: string;
  lastRefresh: Date;
  authorizedAccountIds: string[];
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
  protected apiKey: string;
  protected authKey: string;
  protected bearerToken: string;
  protected axios: AxiosInstance;
  protected logger: Required<Logger>;
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
  get(path: string, options: FlinksGetOptions): Promise<IFlinksResponse | FlinksResponse>;
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
export { AccountFromSummary, AllowedCurrencyTypes, Balance, BankAccountDetails, BankInfoOptions, CaAddress, CountryShortcode, DaysOfTransactionsOptions, EFlinksCodes, FlinksApi, FlinksApiConfiguration, FlinksAuthorizeOptions, FlinksAuthorizeToken, FlinksDataOptions, FlinksDeleteOptions, FlinksGetOptions, FlinksHeaderOptions, FlinksPatchOptions, FlinksPostOptions, FlinksResponse, FlinksSecurityType, FlinksTransactionDetails, ICachedFlinksWebhook, IFlinksAccountCredential, IFlinksAddress, IFlinksAuthorize, IFlinksBalance, IFlinksBankAccountDetails, IFlinksDetails, IFlinksHolder, IFlinksLink, IFlinksLogin, IFlinksResponse, IFlinksStatement, IFlinksStatementsByAccount, IFlinksSummary, IFlinksToken, IFlinksTransaction, IFlinksWebhookTag, IUniqueLogin, Logger, MFAQuestions, MFAType, NumberOfStatements, OnboardEditOrganizationDto, OnboardEditUserDto, PendingPackage, ProvincesShortcode, ResponseType, SecurityChallenge, SecurityResponses, StatementsByAccount, StatesShortcode, Transaction, TransactionHistory, WordLists };