import {AxiosInstance, AxiosRequestConfig} from "axios";

export interface Logger {
    log(message: string, ...optionalParams: any[]): void;
    info(message: string, ...optionalParams: any[]): void;
    error(message: string, ...optionalParams: any[]): void;
    warn?(message: string, ...optionalParams: any[]): void;
    debug?(message: string, ...optionalParams: any[]): void;
}

export interface FlinksApiConfiguration {

    country: CountryShortcode,
        customerId:string,
    url:string,
    apiKey: string,
    authKey:string,
    authorization:string,
    axiosInstance?: AxiosInstance,
    logger?:Logger,
}

export enum AllowedCurrencyTypes {
    "cad" = "CAD",
    "usd" = "USD",
}
// Based on: https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/completing-slips-summaries/financial-slips-summaries/return-investment-income-t5/provincial-territorial-codes.html
export enum ProvincesShortcode {
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

export enum StatesShortcode {
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

//Based on: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
export enum CountryShortcode {
    "Canada" = "CA",
    "United States" = "US",
}


export type CaAddress = {
    CivicAddress: string;
    City: string;
    Province: ProvincesShortcode;
    PostalCode: string;
    POBox?: string;
    Country: CountryShortcode;
};

export interface WordLists {
    adjectives: string[];
    verbs: string[]; // gerunds (verb-ing)
    nouns: string[];
}


export interface PendingPackage {
    requestId?: string;
    headers: Record<string, string>;
    PathParam: string;
    FlinksCode?: string;
    Body?: string;
    Config?: AxiosRequestConfig;
    Links?: [
        {
            rel: string;
            href: string;
            example: string;
        },
    ];
    HttpStatusCode: number;
    Message?: string;
    RequestId?: string;
}

export interface SecurityChallenge {
    Type: FlinksSecurityType;
    Prompt: string;
    Iterables: string[];
}

export interface SecurityResponses {
    [key: string]: string[];
}

export enum DaysOfTransactionsOptions {
    "Days90" = "Days90",
    "Days365" = "Days365",
}

export interface BankInfoOptions {
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

export interface FlinksTransactionDetails {
    transactionId: string;
    AccountID: string;
    Key: string;
    Signature: string;
    FlinksAccountID: string;
    FlinksLoginID: string;
    Amount: number;
}

export interface MFAQuestions {
    Question: string;
    Answer?: string;
}

export interface Transaction {
    Date: string;
    Code: string | null;
    Description: string;
    Debit: number;
    Credit: number;
    Balance: number;
    Id: string;
}

export interface TransactionHistory {
    Accounts: {
        Transactions: Transaction[];
    }[];
}

export enum NumberOfStatements {
    "Most Recent" = "MostRecent",
    "Months 3" = "Months3",
    "Months 12" = "Months12",
}

export type StatementsByAccount = {
    AccountNumber: string;
    Statements: [
        { UniqueId: string; FileType: string; Base64Bytes: Base64URLString },
    ];
};

export type AccountFromSummary = {
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

export interface BankAccountDetails {
    FinancialInstitutionNumber: string;
    BranchTransitNumber: string;
    AccountNumber: string;
}

export interface FlinksDataOptions {
    includeHeaders?: FlinksHeaderOptions[];
    headers?: Record<string,string>;
    requestId?: string;
    pathParams?: string[];
    queryParams?: Record<string,string>;
    customTimeout?: number;
}

export interface FlinksPostOptions extends FlinksDataOptions {
    body?: unknown;
}
export interface FlinksPatchOptions extends FlinksDataOptions {
    body?: unknown;
}
export interface FlinksGetOptions extends FlinksDataOptions {}
export interface FlinksDeleteOptions extends FlinksDataOptions {}

export enum FlinksHeaderOptions {
    AuthKey = "AuthKey",
    ApiKey = "ApiKey",
    Authorization = "Authorization",
}

/**
 * This could probably be extensible, for the different Security Types
 */
export interface FlinksAuthorizeOptions extends BankInfoOptions {
    mostRecentCached?: boolean;
    save?: boolean;
    mfaResponse?: SecurityResponses[];
    tag?: string;
    customTimeout?: number;
    requestId?: string;
}

export enum FlinksSecurityType {
    "QuestionAndAnswer" = "QuestionAndAnswer",
    "ImageSelection" = "ImageSelection",
    "MultipleChoice" = "MultipleChoice",
    "TextOrCall" = "TextOrCall",
    "WaitUntilEUAccept" = "WaitUntilEUAccept",
    "MultipleChoiceMultipleAnswers" = "MultipleChoiceMultipleAnswers",
}


export type Balance = {
    Available?: number;
    Current?: number;
    Limit?: number;
};

export interface IFlinksBankAccountDetails {
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
export interface IFlinksHolder {
    Name: string;
    Address: IFlinksAddress;
    Email: string;
    PhoneNumber: string;
}
export interface IFlinksBalance {
    Available?: number;
    Current?: number;
    Limit?: number;
}

export interface IFlinksAddress {
    CivicAddress: string;
    City: string;
    Province: ProvincesShortcode | StatesShortcode;
    PostalCode: string;
    POBox?: string;
    Country: CountryShortcode;
}

export interface IFlinksLogin {
    Username: string;
    IsScheduledRefresh: boolean;
    LastRefresh: string;
    Type: string;
    Id: string;
}

export interface IFlinksTransaction {
    Date: string;
    Code?: string | null;
    Description: string;
    Debit?: number | null;
    Credit?: number | null;
    Balance: number;
    Id: string;
}

export interface IFlinksAccountCredential {
    loginId: string;
    accountId: string;
    institution: string;
    country: CountryShortcode;
    securityType?: FlinksSecurityType;
}

export interface IFlinksLink {
    rel: string;
    href: string;
    example: string;
}
export interface FlinksResponse {
    HttpStatusCode: number;
    StatusCode?: number;
    Message?: string;
    FlinksCode?: string;
    RequestId?: string;
    [key: string]: any;
    PathParam?: string;
    ApiKeyNeeded?: boolean;
}


export interface OnboardEditOrganizationDto {
    organizationId: string;
    organizationName: string;
    organizationCountry: CountryShortcode;
    organizationPlan: string;
}
export interface OnboardEditUserDto {
    userId: string;
    firstName: string;
    lastName?: string;
    email: string;
    country: CountryShortcode;
}
// IFlinksResponse contains all possible returned key-value pairs. It should be extended by specific classes when the types are Known.
export interface IFlinksResponse {
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

export interface IFlinksStatementsByAccount {
    AccountNumber: string;
    Statements: IFlinksStatement[];
}

export interface IFlinksStatement {
    UniqueId: string;
    FileType: string; // FileType Enum?
    Base64Bytes: string;
}

export interface IFlinksToken extends IFlinksResponse {
    Token: string;
}

export interface IFlinksAuthorize extends IFlinksResponse {
    RequestId: string;
    Institution: string;
    Links: IFlinksLink[];
}

export interface IFlinksDetails extends IFlinksResponse {
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

export interface IFlinksSummary extends IFlinksResponse {
    Login: IFlinksLogin;
    Tag: string;
    InstitutionName: string;
    InstitutionId: number;
    Institution: string;
    RequestId: string;
    Accounts: IFlinksBankAccountDetails[];
    Links: IFlinksLink[];
}

export interface FlinksAuthorizeToken {
    token: string;
    timestamp: number;
}

export enum EFlinksCodes {
    "INVALID_LOGIN" = "INVALID_LOGIN",
    "METHOD_NOT_AVAILABLE" = "METHOD_NOT_AVAILABLE",
    "INVALID_SECURITY_RESPONSE" = "INVALID_SECURITY_RESPONSE",
    "UNKNOWN_CHALLENGE_KEY" = "UNKNOWN_CHALLENGE_KEY",
}

export enum MFAType {
    "Cached" = "Cached",
    "ActionRequired" = "ActionRequired",
}

export enum ResponseType {
    GetAccountsDetail = "GetAccountsDetail",
    KYC = "KYC"
}

export interface ICachedFlinksWebhook {
    ResponseType: ResponseType;
    HttpStatusCode: number;
    Accounts?:IFlinksBankAccountDetails[];
    Login:IFlinksLogin;
    Institution:string;
    RequestId:string;
    Tag?:string;
}

export interface IFlinksWebhookTag {
    origin: string;
    [key: string]: string;
}

export interface IUniqueLogin{
    institution: string;
    flinksId:string;
    title?:string;
    lastRefresh:Date;
    authorizedAccountIds:string[];
}