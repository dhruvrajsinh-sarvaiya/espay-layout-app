const apiAuthorization = 'connect/';
const apiDeviceRegistration = 'api/DeviceRegistration/'
const apiSignIn = 'api/Signin/';
const apiSignUp = 'api/SignUp/';
const apiTransaction = 'api/Transaction/';
const apiTwoFASetting = 'api/TwoFASetting/';
const apiWallet = 'api/Wallet/';
const apiWalletOperation = 'api/WalletOperations/';
const apiLanguages = 'api/private/v1/languages/';
const apiContactus = 'api/private/v1/contactus/';
const apiWalletConfiguration = 'api/WalletConfiguration/';
const apiWalletControlPanel = 'api/WalletControlPanel/';
const apiMarginWallet = 'api/MarginWallet/';
const apiBackOfficeComplain = 'api/BackOfficeComplain/';
const apiReferral = 'api/Referral/';
const apiSocialProfile = 'api/SocialProfile/';
const apiBackOfficeOrganization = 'api/BackOfficeOrganization/';
const apiBackOfficeApplication = 'api/BackOfficeApplication/';

const apiTransactionConfiguration = 'api/TransactionConfiguration/';
const apiTransactionBackOffice = 'api/TransactionBackOffice/';
const apiTransactionBackOfficeCount = 'api/TransactionBackOfficeCount/';
const apiExchangeFeedConfiguration = 'api/ExchangeFeedConfiguration/';
const apiBackOfficeRuleManagement = 'api/BackOfficeRuleManagement/';
const apiProfileConfiguration = 'api/ProfileConfiguration/';
const apiComplaint = 'api/Complaint/';
const apiPasswordPolicy = 'api/PasswordPolicy/';
const apiprivatev1zohocrm = 'api/private/v1/zohocrm/';
const apiBackOffice = 'api/BackOffice/';
const apiManage = 'api/Manage/';
const apiMasterConfiguration = 'api/MasterConfiguration/';
const apiprivatev1 = 'api/private/v1/';
const apichat = 'api/Chat/';
const apiBackOfficeActivityLog = 'api/BackOfficeActivityLog/';
const apiSignUpReport = 'api/SignUpReport/';
const apiKYCConfiguration = 'api/KYCConfiguration/';
const apiBackOfficeRoleManagement = 'api/BackOfficeRoleManagement/';
const apiBackOfficeUser = 'api/BackOfficeUser/';
const apiAffiliateBackOffice = 'api/AffiliateBackOffice/';
const apiMarginWalletControlPanel = 'api/MarginWalletControlPanel/';
const apiArbitrageWalletControlPanel = 'api/ArbitrageWalletControlPanel/';
const apiArbitrageWallet = 'api/ArbitrageWallet/';
const apiGlobalNotification = 'api/GlobalNotification/';
const apiBackOfficeAPIConfiguration = 'api/BackOfficeAPIConfiguration/';
const apiApiConfiguration = 'api/APIConfiguration/';
const apiLocalization = 'api/private/v1/localization/';

const Localization = {
    listCountry: apiLocalization + 'country/listCountry',
    addCountry: apiLocalization + 'country/addCountry',
    updateCountry: apiLocalization + 'country/updateCountry',
    listState: apiLocalization + 'state/listState',
    addState: apiLocalization + 'state/addState',
    updateState: apiLocalization + 'state/updateState',
    listCity: apiLocalization + 'city/listCity',
    addCity: apiLocalization + 'city/addCity',
    updateCity: apiLocalization + 'city/updateCity',
    getStateByCountryId: apiLocalization + 'state/getStateByCountryId',
    listZipcodes: apiLocalization + 'zipcodes/listZipcodes',
    addZipcode: apiLocalization + 'zipcodes/addZipcode',
    updateZipcode: apiLocalization + 'zipcodes/updateZipcode',
    getCityByStateId: apiLocalization + 'city/getCityByStateId',
}

const BackOfficeUser = {
    RegisterUser: apiBackOfficeUser + 'RegisterUser',
}

const contactus = {
    contactUsCount: apiContactus + 'contactUsCount',
}

const MasterConfiguration = {
    // for template
    GetAllTemplate: apiMasterConfiguration + 'GetAllTemplate',
    ListTemplate: apiMasterConfiguration + 'ListTemplate',
    AddTemplate: apiMasterConfiguration + 'AddTemplate',
    UpdateTemplate: apiMasterConfiguration + 'UpdateTemplate',
    GetTemplateById: apiMasterConfiguration + 'GetTemplateById/',
    ChangeTemplateStatus: apiMasterConfiguration + 'ChangeTemplateStatus/',

    GetWalletLedger: apiMasterConfiguration + 'GetWalletLedger',
    WithdrawalReport: apiMasterConfiguration + 'WithdrawalReport',
    WithdrawalReportv2: apiMasterConfiguration + 'WithdrawalReportv2',
    DepositionReport: apiMasterConfiguration + 'DepositionReport',

    GetMessagingQueue: apiMasterConfiguration + 'GetMessagingQueue/',
    GetEmailQueue: apiMasterConfiguration + 'GetEmailQueue/',
    GetCommunicationServiceConfig: apiMasterConfiguration + 'GetCommunicationServiceConfiguration/GetCommunicationServiceConfig/',
    AddCommunicationServiceConfig: apiMasterConfiguration + 'AddCommunicationServiceConfig/AddCommunicationServiceConfig',
    UpdateCommunicationServiceConfig: apiMasterConfiguration + 'UpdateCommunicationServiceConfig/UpdateCommunicationServiceConfig',
    GetAllRequestFormat: apiMasterConfiguration + 'GetAllRequestFormat/GetAllRequestFormat',
    ListTemplateType: apiMasterConfiguration + 'ListTemplateType',
    GetTemplateByCategory: apiMasterConfiguration + 'GetTemplateByCategory',
    UpdateTemplateCategory: apiMasterConfiguration + 'UpdateTemplateCategory',
    AddRequestFormat: apiMasterConfiguration + 'AddRequestFormat/AddRequestFormat',
    UpdateRequestFormat: apiMasterConfiguration + 'UpdateRequestFormat/UpdateRequestFormat',
}

const AffiliateBackOffice = {
    GetAffiateUserRegistered: apiAffiliateBackOffice + 'GetAffiateUserRegistered',
    AddAffiliateScheme: apiAffiliateBackOffice + 'AddAffiliateScheme',
    UpdateAffiliateScheme: apiAffiliateBackOffice + 'UpdateAffiliateScheme',
    ListAffiliateScheme: apiAffiliateBackOffice + 'ListAffiliateScheme',
    ChangeAffiliateSchemeStatus: apiAffiliateBackOffice + 'ChangeAffiliateSchemeStatus',
    GetReferralLinkClick: apiAffiliateBackOffice + 'GetReferralLinkClick',
    GetEmailSent: apiAffiliateBackOffice + 'GetEmailSent',
    GetSMSSent: apiAffiliateBackOffice + 'GetSMSSent',
    UpdateAffiliatePromotion: apiAffiliateBackOffice + 'UpdateAffiliatePromotion',
    ListAffiliatePromotion: apiAffiliateBackOffice + 'ListAffiliatePromotion',
    ChangeAffiliatePromotionStatus: apiAffiliateBackOffice + 'ChangeAffiliatePromotionStatus',
    AddAffiliatePromotion: apiAffiliateBackOffice + 'AddAffiliatePromotion',
    ListAffiliateSchemeType: apiAffiliateBackOffice + 'ListAffiliateSchemeType',
    ChangeAffiliateSchemeTypeStatus: apiAffiliateBackOffice + 'ChangeAffiliateSchemeTypeStatus',
    AddAffiliateSchemeType: apiAffiliateBackOffice + 'AddAffiliateSchemeType',
    UpdateAffiliateSchemeType: apiAffiliateBackOffice + 'UpdateAffiliateSchemeType',
    AddAffiliateShemeDetail: apiAffiliateBackOffice + 'AddAffiliateShemeDetail',
    ListAffiliateSchemeTypeMapping: apiAffiliateBackOffice + 'ListAffiliateSchemeTypeMapping',
    ListAffiliateSchemeDetail: apiAffiliateBackOffice + 'ListAffiliateSchemeDetail',
    ChangeAffiliateShemeDetailStatus: apiAffiliateBackOffice + 'ChangeAffiliateShemeDetailStatus',
    UpdateAffiliateShemeDetail: apiAffiliateBackOffice + 'UpdateAffiliateShemeDetail',
    AddAffiliateSchemeTypeMapping: apiAffiliateBackOffice + 'AddAffiliateSchemeTypeMapping',
    UpdateAffiliateSchemeTypeMapping: apiAffiliateBackOffice + 'UpdateAffiliateSchemeTypeMapping',
    ChangeAffiliateSchemeTypeMappingStatus: apiAffiliateBackOffice + 'ChangeAffiliateSchemeTypeMappingStatus',
    GetAffiliateDashboardCount: apiAffiliateBackOffice + 'GetAffiliateDashboardCount',
    GetAffiliateInvitieChartDetail: apiAffiliateBackOffice + 'GetAffiliateInvitieChartDetail',
    GetMonthWiseCommissionChartDetail: apiAffiliateBackOffice + 'GetMonthWiseCommissionChartDetail',
    GetFacebookLinkClick: apiAffiliateBackOffice + 'GetFacebookLinkClick',
    GetTwitterLinkClick: apiAffiliateBackOffice + 'GetTwitterLinkClick',
    AffiliateCommissionHistoryReport: apiAffiliateBackOffice + 'AffiliateCommissionHistoryReport',
}

const BackOfficeRoleManagement = {
    ListRoleDetails: apiBackOfficeRoleManagement + 'ListRoleDetails',
    ChangeRoleStatus: apiBackOfficeRoleManagement + 'ChangeRoleStatus',
    CreateUserRole: apiBackOfficeRoleManagement + 'CreateUserRole',
    UpdateUserRole: apiBackOfficeRoleManagement + 'UpdateUserRole',
    GetRoleHistory: apiBackOfficeRoleManagement + 'GetRoleHistory',
    ViewUnassignedUsers: apiBackOfficeRoleManagement + 'ViewUnassignedUsers',
    ListUserDetail: apiBackOfficeRoleManagement + 'ListUserDetail',
    ChangeUserStatus: apiBackOfficeRoleManagement + 'ChangeUserStatus',
    GetGroupList: apiBackOfficeRoleManagement + 'GetGroupList',
    CreateUser: apiBackOfficeRoleManagement + 'CreateUser',
    EditUser: apiBackOfficeRoleManagement + 'EditUser',
    AssignRole: apiBackOfficeRoleManagement + 'AssignRole/',
    ViewUsersByRole: apiBackOfficeRoleManagement + 'ViewUsersByRole/',
    RemoveAndAssignRole: apiBackOfficeRoleManagement + 'RemoveAndAssignRole/',
    GetUserDetailById: apiBackOfficeRoleManagement + 'GetUserDetailById',
    ReInviteUser: apiBackOfficeRoleManagement + 'ReInviteUser',
}

const KYCConfiguration = {
    GetKYCList: apiKYCConfiguration + 'GetKYCList',
    KYCStatusUpdate: apiKYCConfiguration + 'KYCStatusUpdate',
    GetKYCLevelDropDownList: apiKYCConfiguration + 'GetKYCLevelDropDownList',
}

const BackOfficeRuleManagement = {
    GetAllFieldData: apiBackOfficeRuleManagement + 'GetAllFieldData',
    AddFieldData: apiBackOfficeRuleManagement + 'AddFieldData',
    UpdateFieldData: apiBackOfficeRuleManagement + 'UpdateFieldData',
    ChangeStatusFieldData: apiBackOfficeRuleManagement + 'ChangeStatusFieldData',
    GetAllSubModuleData: apiBackOfficeRuleManagement + 'GetAllSubModuleData',
    GetAllModuleData1: apiBackOfficeRuleManagement + 'GetAllModuleData',
    ChangeStatusModuleData: apiBackOfficeRuleManagement + 'ChangeStatusModuleData',
    AddModuleData: apiBackOfficeRuleManagement + 'AddModuleData',
    UpdateModuleData: apiBackOfficeRuleManagement + 'UpdateModuleData',
    ChangeStatusSubModuleData: apiBackOfficeRuleManagement + 'ChangeStatusSubModuleData',
    AddSubModuleData: apiBackOfficeRuleManagement + 'AddSubModuleData',
    UpdateSubModuleData: apiBackOfficeRuleManagement + 'UpdateSubModuleData',
    GetAllToolData: apiBackOfficeRuleManagement + 'GetAllToolData',
    AddToolData: apiBackOfficeRuleManagement + 'AddToolData',
    UpdateToolData: apiBackOfficeRuleManagement + 'UpdateToolData',
}

const Authorization = {
    token: apiAuthorization + 'token',
    GenerateNewToken: 'GenerateNewToken', // Not in use
    refreshToken: 'refreshToken', // Not in use
}

const Language = {
    getActiveDefaultLanguages: apiLanguages + 'getActiveDefaultLanguages',
    getActiveLanguagesConfig: apiLanguages + 'getActiveLanguagesConfig',
}

const DeviceRegistration = {
    SubscribePushNotification: apiDeviceRegistration + 'SubscribePushNotification',
    UnsubscribePushNotification: apiDeviceRegistration + 'UnsubscribePushNotification'
}

const MarginWallet = {
    ListMarginWalletMaster: apiMarginWallet + 'ListMarginWalletMaster',
}

const SignIn = {
    VerifyCode: apiSignIn + 'VerifyCode',
    //StandardLogin: apiSignIn + 'StandardLogin',
    StandardLogin: apiSignIn + 'BackOfficeStandardLoginV1',
    //LoginWithEmail: apiSignIn + 'LoginWithEmail',
    LoginWithEmail: apiSignIn + 'LoginWithEmailV1',
    'EmailOtpVerification.SignIn': apiSignIn + 'EmailOtpVerification',
    'ReSendOtpWithEmail.SignIn': apiSignIn + 'ReSendOtpWithEmail',
    //LoginWithMobile: apiSignIn + 'LoginWithMobile',
    LoginWithMobile: apiSignIn + 'LoginWithMobileV1',
    'MobileOtpVerification.SignIn': apiSignIn + 'MobileOtpVerification',
    'ReSendOtpWithMobile.SignIn': apiSignIn + 'ReSendOtpWithMobile',
    ForgotPassword: apiSignIn + 'ForgotPassword',
    ExternalLoginForFacebook: apiSignIn + 'ExternalLoginForFacebook',
    ExternalLoginForGoogle: apiSignIn + 'ExternalLoginForGoogle',
    UnLockUser: apiSignIn + 'UnLockUser',
}

const SignUp = {
    register: apiSignUp + 'register',
    ReSendRegisterlink: apiSignUp + 'ReSendRegisterlink',
    SignUpWithEmail: apiSignUp + 'SignUpWithEmail',
    'EmailOtpVerification.SignUp': apiSignUp + 'EmailOtpVerification',
    'ReSendOtpWithEmail.SignUp': apiSignUp + 'ReSendOtpWithEmail',
    SignUpWithMobile: apiSignUp + 'SignUpWithMobile',
    'MobileOtpVerification.SignUp': apiSignUp + 'MobileOtpVerification',
    'ReSendOtpWithMobile.SignUp': apiSignUp + 'ReSendOtpWithMobile',
}

const Transaction = {
    GetMarketTicker: apiTransaction + 'GetMarketTicker',
}

const WalletControlPanel = {
    //Bo And Front
    ListOrgDetails: apiWalletControlPanel + 'ListOrgDetails',
    ListWalletTypeDetails: apiWalletControlPanel + 'ListWalletTypeDetails',
    ListRoleDetailss: apiWalletControlPanel + 'ListRoleDetails',
    ListWalletTrnType: apiWalletControlPanel + 'ListWalletTrnType',
    AddCurrencyLogo: apiWalletControlPanel + 'AddCurrencyLogo',
    ListMasterLimitConfiguration: apiWalletControlPanel + 'ListMasterLimitConfiguration',
    ChangeMasterLimitConfigStatus: apiWalletControlPanel + 'ChangeMasterLimitConfigStatus',
    ListChargeConfiguration: apiWalletControlPanel + 'ListChargeConfiguration',
    UpdateChargeConfiguration: apiWalletControlPanel + 'UpdateChargeConfiguration',
    AddMasterLimitConfiguration: apiWalletControlPanel + 'AddMasterLimitConfiguration',
    UpdateMasterLimitConfiguration: apiWalletControlPanel + 'UpdateMasterLimitConfiguration',
    InsertUpdateStakingPolicy: apiWalletControlPanel + 'InsertUpdateStakingPolicy',
    ChangeStakingPolicyMasterStatus: apiWalletControlPanel + 'ChangeStakingPolicyMasterStatus',
    ListStakingPolicyMaster: apiWalletControlPanel + 'ListStakingPolicyMaster',
    ListStakingPolicyDetail: apiWalletControlPanel + 'ListStackingPolicyDetail',
    AddStakingPolicy: apiWalletControlPanel + 'AddStakingPolicy',
    UpdateStakingPolicyDetail: apiWalletControlPanel + 'UpdateStakingPolicyDetail',
    ChangeStakingPolicyDetailStatus: apiWalletControlPanel + 'ChangeStakingPolicyDetailStatus',
    AddChargeConfiguration: apiWalletControlPanel + 'AddChargeConfiguration',
    ListChargeConfigurationDetail: apiWalletControlPanel + 'ListChargeConfigurationDetail',
    AddChargeConfigurationDeatil: apiWalletControlPanel + 'AddChargeConfigurationDeatil',
    UpdateChargeConfigurationDetail: apiWalletControlPanel + 'UpdateChargeConfigurationDetail',
    GetServiceProviderBalance: apiWalletControlPanel + 'GetServiceProviderBalance',
    ListDepositionInterval: apiWalletControlPanel + 'ListDepositionInterval',
    AddDepositionInterval: apiWalletControlPanel + 'AddDepositionInterval',
    IncreaseDecreaseTokenSupplyHistory: apiWalletControlPanel + 'IncreaseDecreaseTokenSupplyHistory',
    GetOrgCount: apiWalletControlPanel + 'GetOrgCount',
    GetUserCount: apiWalletControlPanel + 'GetUserCount',
    GetUserCountTypeWise: apiWalletControlPanel + 'GetUserCountTypeWise',
    GetWalletAuthUserCountRoleWise: apiWalletControlPanel + 'GetWalletAuthUserCountRoleWise',
    GetDetailTypeWise: apiWalletControlPanel + 'GetDetailTypeWise',
    GetOrgAllDetail: apiWalletControlPanel + 'GetOrgAllDetail',
    GetWalletCountStatusWise: apiWalletControlPanel + 'GetWalletCountStatusWise',
    GetMonthwiseUserCount: apiWalletControlPanel + 'GetMonthwiseUserCount',
    GetMonthwiseOrgCount: apiWalletControlPanel + 'GetMonthwiseOrgCount',
    IncreaseTokenSupply: apiWalletControlPanel + 'IncreaseTokenSupply',
    DecreaseTokenSupply: apiWalletControlPanel + 'DecreaseTokenSupply',
    DestroyedBlackFundHistory: apiWalletControlPanel + 'DestroyedBlackFundHistory',
    TransferFeeHistory: apiWalletControlPanel + 'TransferFeeHistory',
    SetTransferFee: apiWalletControlPanel + 'SetTransferFee',
    ListTransactionPolicy: apiWalletControlPanel + 'ListTransactionPolicy',
    ChangeTransactionPolicyStatus: apiWalletControlPanel + 'ChangeTransactionPolicyStatus',
    InsertTransactionPolicy: apiWalletControlPanel + 'InsertTransactionPolicy',
    UpdateTransactionPolicy: apiWalletControlPanel + 'UpdateTransactionPolicy',
    AdminAssets: apiWalletControlPanel + 'AdminAssets',
    GetDepositCounter: apiWalletControlPanel + 'GetDepositCounter',
    ChangeDepositCounterStatus: apiWalletControlPanel + 'ChangeDepositCounterStatus',
    InsertUpdateDepositCounter: apiWalletControlPanel + 'InsertUpdateDepositCounter',
    ListOrganizationWallet: apiWalletControlPanel + 'ListOrganizationWallet',
    ListAddressDetails: apiWalletControlPanel + 'ListAddressDetails',
    GetExportAddressDetails: apiWalletControlPanel + 'GetExportAddressDetails',
    ImportAddress: apiWalletControlPanel + 'ImportAddress',
    ConfirmAddExport: apiWalletControlPanel + 'ConfirmAddExport',
    TrnChargeLogReport: apiWalletControlPanel + 'TrnChargeLogReport',
    GetStackingHistory: apiWalletControlPanel + 'GetStackingHistoryv2',
    ListWithdrawalRequest: apiWalletControlPanel + 'ListWithdrawalRequest',
    AcceptRejectWithdrawalRequest: apiWalletControlPanel + 'AcceptRejectWithdrawalRequest',
    ListBlockUnblockUserAddress: apiWalletControlPanel + 'ListBlockUnblockUserAddress',
    DestroyBlackFund: apiWalletControlPanel + 'DestroyBlackFund',
    BlockUnblockUserAddress: apiWalletControlPanel + 'BlockUnblockUserAddress',
    ListUserWalletBlockTrnType: apiWalletControlPanel + 'ListUserWalletBlockTrnType',
    ChangeUserWalletBlockTrnTypeStatus: apiWalletControlPanel + 'ChangeUserWalletBlockTrnTypeStatus',
    InsertUpdateUserWalletBlockTrnType: apiWalletControlPanel + 'InsertUpdateUserWalletBlockTrnType',
    ListAllowTrnTypeRoleWise: apiWalletControlPanel + 'ListAllowTrnTypeRoleWise',
    ChangeAllowTrnTypeRoleStatus: apiWalletControlPanel + 'ChangeAllowTrnTypeRoleStatus',
    InserUpdateAllowTrnTypeRole: apiWalletControlPanel + 'InserUpdateAllowTrnTypeRole',
    ListUnStackingRequest: apiWalletControlPanel + 'ListUnStackingRequest',
    AcceptRejectUnstakingRequest: apiWalletControlPanel + 'AcceptRejectUnstakingRequest',
    DepositionReconProcess: apiWalletControlPanel + 'DepositionReconProcess',
    ListAllWallet: apiWalletControlPanel + 'ListAllWallet',
    GetWalletIdWise: apiWalletControlPanel + 'GetWalletIdWise',
    ListWalletAuthorizeUser: apiWalletControlPanel + 'ListWalletAuthorizeUser',
    GetLPProviderBalance: apiWalletControlPanel + 'GetLPProviderBalance',
    TokenTransfer: apiWalletControlPanel + 'TokenTransfer',
    TokenTransferHistory: apiWalletControlPanel + 'TokenTransferHistory',
    ListAllUserDetails: apiWalletControlPanel + 'ListAllUserDetails',
    ListLPWalletMismatch: apiWalletControlPanel + 'ListLPWalletMismatch',
    LPWalletRecon: apiWalletControlPanel + 'LPWalletRecon',

    //wallet Usage Policy
    ListUsagePolicy: apiWalletControlPanel + 'ListUsagePolicy',
    ChangeWalletUsagePolicyStatus: apiWalletControlPanel + 'ChangeWalletUsagePolicyStatus',
    InsertUpdateWalletUsagePolicy: apiWalletControlPanel + 'InsertUpdateWalletUsagePolicy',
}

const WalletConfiguration = {
    //Bo And Front
    ListAllWalletTypeMaster: apiWalletConfiguration + 'ListAllWalletTypeMaster',
    DeleteWalletTypeMaster: apiWalletConfiguration + 'DeleteWalletTypeMaster',
    AddWalletTypeMaster: apiWalletConfiguration + 'AddWalletTypeMaster',
    UpdateWalletTypeMaster: apiWalletConfiguration + 'UpdateWalletTypeMaster',
    GetTransferIn: apiWalletConfiguration + 'GetTransferIn',
    GetTransferOut: apiWalletConfiguration + 'GetTransferOut',
}

const TwoFASetting = {
    Disable2fa: apiTwoFASetting + 'Disable2fa',
    enableauthenticator: apiTwoFASetting + 'Enableauthenticator',
    Disable2faUserwise: apiTwoFASetting + 'Disable2faUserwise',
}

const Wallet = {
    ListWallet: apiWallet + 'ListWallet',
    GetWalletByType: apiWallet + 'GetWalletByType',
    GetAllBalances: apiWallet + 'GetAllBalances',
    GetServiceLimitChargeValue: apiWallet + 'GetServiceLimitChargeValue',
}

const WalletOperations = {
    GetDefaultWalletAddress: apiWalletOperation + 'GetDefaultWalletAddress',
}

const BackOfficeComplain = {
    GetAllUserData: apiBackOfficeComplain + 'GetAllUserData',
    GetTotalNoCount: apiBackOfficeComplain + 'GetTotalNoCount',
    GetAllComplainReport: apiBackOfficeComplain + 'GetAllComplainReport',
    AddRiseComplain: apiBackOfficeComplain + 'AddRiseComplain',
    GetComplain: apiBackOfficeComplain + 'GetComplain',
}

const TransactionConfiguration = {
    GetAllServiceConfiguration: apiTransactionConfiguration + 'GetAllServiceConfiguration',
    ListCurrency: apiTransactionConfiguration + 'ListCurrency',
    ListPair: apiTransactionConfiguration + 'ListPair',
    GetProviderListArbitrage: apiTransactionConfiguration + 'GetProviderListArbitrage',
    AddServiceProviderArbitrage: apiTransactionConfiguration + 'AddServiceProviderArbitrage',
    UpdateServiceProviderArbitrage: apiTransactionConfiguration + 'UpdateServiceProviderArbitrage',

    //Coin Configuration
    GetAllServiceConfigurationData: apiTransactionConfiguration + 'GetAllServiceConfigurationData',
    AddServiceConfiguration: apiTransactionConfiguration + 'AddServiceConfiguration',
    UpdateServiceConfiguration: apiTransactionConfiguration + 'UpdateServiceConfiguration',

    //Third Party API Response
    GetAllThirdPartyAPIRespose: apiTransactionConfiguration + 'GetAllThirdPartyAPIRespose',
    GetThirdPartyAPIResposeById: apiTransactionConfiguration + 'GetThirdPartyAPIResposeById',
    AddThirdPartyAPIRespose: apiTransactionConfiguration + 'AddThirdPartyAPIRespose',
    UpdateThirdPartyAPIResponse: apiTransactionConfiguration + 'UpdateThirdPartyAPIResponse',

    //Market Cap Ticker
    GetMarketTickerPairData: apiTransactionConfiguration + 'GetMarketTickerPairData',
    UpdateMarketTickerPairData: apiTransactionConfiguration + 'UpdateMarketTickerPairData',

    //Trade Routes
    GetAllTradeRouteConfiguration: apiTransactionConfiguration + 'GetAllTradeRouteConfiguration',
    AddTradeRouteConfiguration: apiTransactionConfiguration + 'AddTradeRouteConfiguration',
    UpdateTradeRouteConfiguration: apiTransactionConfiguration + 'UpdateTradeRouteConfiguration',
    GetOrderType: apiTransactionConfiguration + 'GetOrderType',
    GetAvailableTradeRoute: apiTransactionConfiguration + 'GetAvailableTradeRoute',

    //Pair Configuraiton
    GetBaseMarket: apiTransactionConfiguration + 'GetBaseMarket',
    AddMarketData: apiTransactionConfiguration + 'AddMarketData',
    UpdateMarketData: apiTransactionConfiguration + 'UpdateMarketData',
    GetAllServiceConfigurationByBase: apiTransactionConfiguration + 'GetAllServiceConfigurationByBase',
    GetAllPairConfiguration: apiTransactionConfiguration + 'GetAllPairConfiguration',
    AddPairConfiguration: apiTransactionConfiguration + 'AddPairConfiguration',
    UpdatePairConfiguration: apiTransactionConfiguration + 'UpdatePairConfiguration',

    //Liquidity Manager
    GetAllLiquidityAPIManager: apiTransactionConfiguration + 'GetAllLiquidityAPIManager',
    AddLiquidityAPIManager: apiTransactionConfiguration + 'AddLiquidityAPIManager',
    UpdateLiquidityAPIManager: apiTransactionConfiguration + 'UpdateLiquidityAPIManager',
    GetAllLimitData: apiTransactionConfiguration + 'GetAllLimitData',
    GetProviderList: apiTransactionConfiguration + 'GetProviderList',
    AddServiceProvider: apiTransactionConfiguration + 'AddServiceProvider',
    UpdateServiceProvider: apiTransactionConfiguration + 'UpdateServiceProvider',
    ListDemonConfig: apiTransactionConfiguration + 'ListDemonConfig',
    ListProviderConfiguration: apiTransactionConfiguration + 'ListProviderConfiguration',
    GetServiceProviderType: apiTransactionConfiguration + 'GetServiceProviderType',
    GetAllTransactionType: apiTransactionConfiguration + 'GetAllTransactionType',
    GetAllThirdPartyAPI: apiTransactionConfiguration + 'GetAllThirdPartyAPI',
    AddThirdPartyAPIConfig: apiTransactionConfiguration + 'AddThirdPartyAPIConfig',
    UpdateThirdPartyAPIConfig: apiTransactionConfiguration + 'UpdateThirdPartyAPIConfig',
    GetAppType: apiTransactionConfiguration + 'GetAppType',

    //Daemon Configuration
    GetAllDemonConfig: apiTransactionConfiguration + 'GetAllDemonConfig',
    AddDemonConfiguration: apiTransactionConfiguration + 'AddDemonConfiguration',
    UpdateDemonConfiguration: apiTransactionConfiguration + 'UpdateDemonConfiguration',

    //Provider Configuration
    GetAllProviderConfiguration: apiTransactionConfiguration + 'GetAllProviderConfiguration',
    AddProviderConfiguration: apiTransactionConfiguration + 'AddProviderConfiguration',
    UpdateProviderConfiguration: apiTransactionConfiguration + 'UpdateProviderConfiguration',

    // for site token
    GetAllSiteToken: apiTransactionConfiguration + 'GetAllSiteToken',
    AddSiteToken: apiTransactionConfiguration + 'AddSiteToken',
    UpdateSiteToken: apiTransactionConfiguration + 'UpdateSiteToken',
    GetSiteTokenRateType: apiTransactionConfiguration + 'GetSiteTokenRateType',

    // Address Generation Route
    GetAllRouteConfiguration: apiTransactionConfiguration + 'GetAllRouteConfiguration',
    GetAvailableRoute: apiTransactionConfiguration + 'GetAvailableRoute',
    UpdateWithdrawRouteConfiguration: apiTransactionConfiguration + 'UpdateWithdrawRouteConfiguration',
    AddWithdrawRouteConfiguration: apiTransactionConfiguration + 'AddWithdrawRouteConfiguration',

    //Arbitage
    GetAllProviderConfigurationArbitrage: apiTransactionConfiguration + 'GetAllProviderConfigurationArbitrage',
    AddProviderConfigurationArbitrage: apiTransactionConfiguration + 'AddProviderConfigurationArbitrage',
    UpdateProviderConfigurationArbitrage: apiTransactionConfiguration + 'UpdateProviderConfigurationArbitrage',
    GetAllThirdPartyAPIArbitrage: apiTransactionConfiguration + 'GetAllThirdPartyAPIArbitrage',
    AddThirdPartyAPIConfigArbitrage: apiTransactionConfiguration + 'AddThirdPartyAPIConfigArbitrage',
    UpdateThirdPartyAPIConfigArbitrage: apiTransactionConfiguration + 'UpdateThirdPartyAPIConfigArbitrage',
    GetAllThirdPartyAPIResposeArbitrage: apiTransactionConfiguration + 'GetAllThirdPartyAPIResposeArbitrage',
    AddThirdPartyAPIResposeArbitrage: apiTransactionConfiguration + 'AddThirdPartyAPIResposeArbitrage',
    UpdateThirdPartyAPIResponseArbitrage: apiTransactionConfiguration + 'UpdateThirdPartyAPIResponseArbitrage',
    ListPairArbitrage: apiTransactionConfiguration + 'ListPairArbitrage',
    GetAllPairConfigurationArbitrage: apiTransactionConfiguration + 'GetAllPairConfigurationArbitrage',
    GetAllExchangeConfigurationArbitrage: apiTransactionConfiguration + 'GetAllExchangeConfigurationArbitrage',
    UpdateExchangeConfigurationArbitrage: apiTransactionConfiguration + 'UpdateExchangeConfigurationArbitrage',
    GetBaseMarketArbitrage: apiTransactionConfiguration + 'GetBaseMarketArbitrage',
    UpdateMarketDataArbitrage: apiTransactionConfiguration + 'UpdateMarketDataArbitrage',
    ListCurrencyArbitrage: apiTransactionConfiguration + 'ListCurrencyArbitrage',
    AddMarketDataArbitrage: apiTransactionConfiguration + 'AddMarketDataArbitrage',
    GetAllServiceConfigurationByBaseArbitrage: apiTransactionConfiguration + 'GetAllServiceConfigurationByBaseArbitrage',
    AddPairConfigurationArbitrage: apiTransactionConfiguration + 'AddPairConfigurationArbitrage',
    UpdatePairConfigurationArbitrage: apiTransactionConfiguration + 'UpdatePairConfigurationArbitrage',
    GetAllServiceConfigurationDataArbitrage: apiTransactionConfiguration + 'GetAllServiceConfigurationDataArbitrage',
    AddServiceConfigurationArbitrage: apiTransactionConfiguration + 'AddServiceConfigurationArbitrage',
    UpdateServiceConfigurationArbitrage: apiTransactionConfiguration + 'UpdateServiceConfigurationArbitrage',
}

const TransactionBackOffice = {
    TradingSummary: apiTransactionBackOffice + 'TradingSummary',
    TradeSettledHistoryBO: apiTransactionBackOffice + 'TradeSettledHistory',
    PairTradeSummary: apiTransactionBackOffice + 'PairTradeSummary',
    GetTopGainerPair: apiTransactionBackOffice + 'GetTopGainerPair',
    GetTopLooserPair: apiTransactionBackOffice + 'GetTopLooserPair',
    GetTopLooserGainerPair: apiTransactionBackOffice + 'GetTopLooserGainerPair',
    GetBackOfficeGraphDetail: apiTransactionBackOffice + 'GetBackOfficeGraphDetail',
    TradingSummaryLPWise: apiTransactionBackOffice + 'TradingSummaryLPWise',
    GetSiteTokenConversionDataBK: apiTransactionBackOffice + 'GetSiteTokenConversionDataBK/',
    GetCopiedLeaderOrders: apiTransactionBackOffice + 'GetCopiedLeaderOrders',
    TradingReconHistoryArbitrage: apiTransactionBackOffice + 'TradingReconHistoryArbitrage',
    ArbitrageTradeReconV1: apiTransactionBackOffice + 'ArbitrageTradeReconV1',
    TradingReconHistory: apiTransactionBackOffice + 'TradingReconHistory',
    TradeReconV1: apiTransactionBackOffice + 'TradeReconV1',
    TradingSummaryLPWiseArbitrage: apiTransactionBackOffice + 'TradingSummaryLPWiseArbitrage',
    TradingConfigurationList: apiTransactionBackOffice + 'TradingConfigurationList',
    ChangeTradingConfigurationStatus: apiTransactionBackOffice + 'ChangeTradingConfigurationStatus',
}

const TransactionBackOfficeCount = {
    GetActiveTradeUserCount: apiTransactionBackOfficeCount + 'GetActiveTradeUserCount',
    GetTradeUserMarketTypeCount: apiTransactionBackOfficeCount + 'GetTradeUserMarketTypeCount',
    GetConfigurationCount: apiTransactionBackOfficeCount + 'GetConfigurationCount',
    GetTradeSummaryCount: apiTransactionBackOfficeCount + 'GetTradeSummaryCount',
    GetLedgerCount: apiTransactionBackOfficeCount + 'GetLedgerCount',
    GetActiveTradeUserCountArbitrage: apiTransactionBackOfficeCount + 'GetActiveTradeUserCountArbitrage',
    GetTradeUserMarketTypeCountArbitrage: apiTransactionBackOfficeCount + 'GetTradeUserMarketTypeCountArbitrage',
    GetReportCount: apiTransactionBackOfficeCount + 'GetReportCount',
}

const ExchangeFeedConfiguration = {
    GetAllFeedConfiguration: apiExchangeFeedConfiguration + 'GetAllFeedConfiguration',
    AddFeedConfiguration: apiExchangeFeedConfiguration + 'AddFeedConfiguration',
    UpdateFeedConfiguration: apiExchangeFeedConfiguration + 'UpdateFeedConfiguration',
    GetSocketMethods: apiExchangeFeedConfiguration + 'GetSocketMethods',
    GetFeedLimitList: apiExchangeFeedConfiguration + 'GetFeedLimitList',
    GetFeedLimitListV2: apiExchangeFeedConfiguration + 'GetFeedLimitListV2',
    AddExchangeFeedLimit: apiExchangeFeedConfiguration + 'AddExchangeFeedLimit',
    UpdateExchangeFeedLimit: apiExchangeFeedConfiguration + 'UpdateExchangeFeedLimit',
    GetExchangeFeedLimitType: apiExchangeFeedConfiguration + 'GetExchangeFeedLimitType',
}

const Referral = {
    AllCountForAdminReferralChannel: apiReferral + 'AllCountForAdminReferralChannel',
    ListAdminReferralRewards: apiReferral + 'ListAdminReferralRewards',
    ListAdminReferralUserClick: apiReferral + 'ListAdminReferralUserClick',
    ListAdminReferralChannelWithChannelType: apiReferral + 'ListAdminReferralChannelWithChannelType',
    DropDownReferralService: apiReferral + 'DropDownReferralService',
    DropDownReferralPayType: apiReferral + 'DropDownReferralPayType',
    DropDownReferralChannelType: apiReferral + 'DropDownReferralChannelType',
    ListReferralService: apiReferral + 'ListReferralService',
    EnableReferralService: apiReferral + 'EnableReferralService',
    DisableReferralService: apiReferral + 'DisableReferralService',
    AddReferralService: apiReferral + 'AddReferralService',
    UpdateReferralService: apiReferral + 'UpdateReferralService',
    DropDownReferralServiceType: apiReferral + 'DropDownReferralServiceType',
    ListAdminReferralChannelInvite: apiReferral + 'ListAdminReferralChannelInvite',

    //for referral channel type
    ListReferralChannelType: apiReferral + 'ListReferralChannelType',
    AddChannelType: apiReferral + 'AddChannelType',
    UpdateReferralChannelType: apiReferral + 'UpdateReferralChannelType',
    EnableReferralChannelType: apiReferral + 'EnableReferralChannelType',
    DisableReferralChannelType: apiReferral + 'DisableReferralChannelType',
    GetReferralChannelType: apiReferral + 'GetReferralChannelType',
    //---

    //for referral service type
    ListReferralServiceType: apiReferral + 'ListReferralServiceType',
    AddServiceType: apiReferral + 'AddServiceType',
    UpdateReferralServiceType: apiReferral + 'UpdateReferralServiceType',
    EnableReferralServiceType: apiReferral + 'EnableReferralServiceType',
    DisableReferralServiceType: apiReferral + 'DisableReferralServiceType',
    GetReferralServiceType: apiReferral + 'GetReferralServiceType',

    //for referral pay type
    ListReferralPayType: apiReferral + 'ListReferralPayType',
    AddPayType: apiReferral + 'AddPayType',
    UpdateReferralPayType: apiReferral + 'UpdateReferralPayType',
    EnableReferralPayType: apiReferral + 'EnableReferralPayType',
    DisableReferralPayType: apiReferral + 'DisableReferralPayType',
    //---

    //for referral participant
    ListAdminParticipateReferralUser: apiReferral + 'ListAdminParticipateReferralUser',
}

const ProfileConfiguration = {
    GetProfileConfiguration: apiProfileConfiguration + 'GetProfileConfiguration',
    DeleteProfileConfiguration: apiProfileConfiguration + 'DeleteProfileConfiguration',
    AddProfileConfiguration: apiProfileConfiguration + 'AddProfileConfiguration',
    UpdatProfileConfiguration: apiProfileConfiguration + 'UpdatProfileConfiguration',
    GetProfilelevelmasterDropDownList: apiProfileConfiguration + 'GetProfilelevelmasterDropDownList',
}

const Complaint = {
    GetTypeMaster: apiComplaint + 'GetTypeMaster',
}

const PasswordPolicy = {
    GetPasswordPolicy: apiPasswordPolicy + 'GetPasswordPolicy',
    PasswordPolicyAdd: apiPasswordPolicy + 'PasswordPolicyAdd',
    PasswordPolicyDelete: apiPasswordPolicy + 'PasswordPolicyDelete',
    PasswordPolicyupdate: apiPasswordPolicy + 'PasswordPolicyupdate',
}

const SocialProfile = {
    GetLeaderProfile: apiSocialProfile + 'GetLeaderProfile',
    SetLeaderProfile: apiSocialProfile + 'SetLeaderProfile',
    GetFollowerProfile: apiSocialProfile + 'GetFollowerProfile',
    SetFollowerProfile: apiSocialProfile + 'SetFollowerProfile',
}

// Backoffice
const BackOfficeOrganization = {
    GetAllCountDomain: apiBackOfficeOrganization + 'GetAllCountDomain',
    AddDomain: apiBackOfficeOrganization + 'AddDomain',
    GetDomainList: apiBackOfficeOrganization + 'GetDomainList',
    GetActiveDomainList: apiBackOfficeOrganization + 'GetActiveDomainList',
    GetDisActiveDomainList: apiBackOfficeOrganization + 'GetDisActiveDomainList',
    ActiveDomain: apiBackOfficeOrganization + 'ActiveDomain',
    InActiveDomain: apiBackOfficeOrganization + 'InActiveDomain',
}

const privatev1zohocrm = {
    addCrmForm: apiprivatev1zohocrm + 'addCrmForm',
}

const BackOffice = {
    GetIpRange: apiBackOffice + 'GetIpRange',
    DeleteIpRange: apiBackOffice + 'DeleteIpRange',
    AllowIpRange: apiBackOffice + 'AllowIpRange',

    GetComplaintPriority: apiBackOffice + 'GetComplaintPriority',
    ComplaintPriorityUpdate: apiBackOffice + 'ComplaintPriorityUpdate',
    ComplaintPriorityDelete: apiBackOffice + 'ComplaintPriorityDelete',
    ComplaintPriorityAdd: apiBackOffice + 'ComplaintPriorityAdd',
}

const cms = {
    //FAQs
    getActiveFaqCategory: apiprivatev1 + 'faqcategory/getActiveFaqCategory',
    getActiveFaqQuestion: apiprivatev1 + 'faqquestion/getActiveFaqQuestion',
    // for chat dashboard history and list
    GetOnlineUserCount: apichat + 'GetOnlineUserCount',
    GetOfflineUserCount: apichat + 'GetOfflineUserCount',
    GetActiveUserCount: apichat + 'GetActiveUserCount',
    GetBlockedUserCount: apichat + 'GetBlockedUserCount',
    GetUserList: apichat + 'GetUserList',
    BlockUser: apichat + 'BlockUser',
    GetUserWiseChat: apichat + 'GetUserWiseChat',
    coinRequestByUser: apiprivatev1 + 'coinListRequest/coinRequestByUser',
    coinListRequest: apiprivatev1 + 'coinListRequest',
    editCoinListField: apiprivatev1 + 'coinListRequest/editCoinListField',
    CoinListCount: apiprivatev1 + 'coinListRequest/CoinListCount',
    GetOnlineUserList: apichat + 'GetOnlineUserList',
    GetOfflineUserList: apichat + 'GetOfflineUserList',
    GetActiveUserList: apichat + 'GetActiveUserList',
    GetBlockedUserList: apichat + 'GetBlockedUserList',
}

const Manage = {
    GetIpHistory: apiManage + 'GetIpHistory',
    GetLoginHistory: apiManage + 'GetLoginHistory',

    GetIpAddress: apiManage + 'GetIpAddress',
    IpAddress: apiManage + 'IpAddress',
    DeleteIpAddress: apiManage + 'DeleteIpAddress',
    DisableIpAddress: apiManage + 'DisableIpAddress',
    EnableIpAddress: apiManage + 'EnableIpAddress',
    userinfo: apiManage + 'userinfo',
    GetDeviceDataForAdmin: apiManage + 'GetDeviceDataForAdmin',
    DeleteDeviceId: apiManage + 'DeleteDeviceId',
    DisableDeviceId: apiManage + 'DisableDeviceId',
    EnableDeviceId: apiManage + 'EnableDeviceId',
    TwoFAVerifyCode: apiManage + 'TwoFAVerifyCode',
    changepassword: apiManage + 'changepassword',
    UpdateLanguagePreference: apiManage + 'UpdateLanguagePreference',
}

const BackOfficeApplication = {
    GetAllCountApplication: apiBackOfficeApplication + 'GetAllCountApplication',
    GetActiveApplicationList: apiBackOfficeApplication + 'GetActiveApplicationList',
    GetDisActiveApplicationList: apiBackOfficeApplication + 'GetDisActiveApplicationList',
    GetApplicationList: apiBackOfficeApplication + 'GetApplicationList',
    ActiveApplication: apiBackOfficeApplication + 'ActiveApplication',
    InActiveApplication: apiBackOfficeApplication + 'InActiveApplication',
    AddApplication: apiBackOfficeApplication + 'AddApplication',
    GetUserWiseApplicationList: apiBackOfficeApplication + 'GetUserWiseApplicationList',
    UserWiseCreateApplication: apiBackOfficeApplication + 'UserWiseCreateApplication',
    UpdateUserWiseApplicationData: apiBackOfficeApplication + 'UpdateUserWiseApplicationData',
    GetUserWiseDomainData: apiBackOfficeApplication + 'GetUserWiseDomainData',
    GetAllApplicationData: apiBackOfficeApplication + 'GetAllApplicationData',
    GetUserWiseApplicationData: apiBackOfficeApplication + 'GetUserWiseApplicationData',
}

const BackOfficeActivityLog = {
    GetAllActivityLog: apiBackOfficeActivityLog + 'GetAllActivityLog',
    GetAllModuleData: apiBackOfficeActivityLog + 'GetAllModuleData',
    GetActivityLogHistoryAdmin: apiBackOfficeActivityLog + 'GetActivityLogHistoryAdmin',
}

const SignUpReport = {
    GetUserSignUpCount: apiSignUpReport + 'GetUserSignUpCount/',
    GetUserSignUPreport: apiSignUpReport + 'GetUserSignUPreport',
}

const MarginWalletControlPanel = {
    LeveragePendingReport: apiMarginWalletControlPanel + 'LeveragePendingReportv2',
    LeverageReport: apiMarginWalletControlPanel + 'LeverageReportv2',
    ListLeverage: apiMarginWalletControlPanel + 'ListLeverage',
    GetMarginWalletByUserId: apiMarginWalletControlPanel + 'GetMarginWalletByUserId',
    GetMarginWalletLedger: apiMarginWalletControlPanel + 'GetMarginWalletLedger',
    ChangeLeverageStatus: apiMarginWalletControlPanel + 'ChangeLeverageStatus',
    InserUpdateLeverage: apiMarginWalletControlPanel + 'InserUpdateLeverage',
    GetProfitNLossReportData: apiMarginWalletControlPanel + 'GetProfitNLossReportData',
    GetOpenPosition: apiMarginWalletControlPanel + 'GetOpenPosition',
}

const ArbitrageWalletControlPanel = {
    ListProviderWallet: apiArbitrageWalletControlPanel + 'ListProviderWallet',
    ArbitrageProviderBalance: apiArbitrageWalletControlPanel + 'ArbitrageProviderBalance',
    GetArbitrageProviderWalletLedger: apiArbitrageWalletControlPanel + 'GetArbitrageProviderWalletLedger',
    ListArbitrageAddress: apiArbitrageWalletControlPanel + 'ListArbitrageAddress',
    InsertUpdateArbitrageAddress: apiArbitrageWalletControlPanel + 'InsertUpdateArbitrageAddress',
    ListAllArbitrageWalletTypeMaster: apiArbitrageWalletControlPanel + 'ListAllArbitrageWalletTypeMaster',
    ListChargeConfigurationMasterArbitrageUser: apiArbitrageWalletControlPanel + 'ListChargeConfigurationMasterArbitrageUser',
    InsertUpdateChargeConfigurationMasterArbitrageUser: apiArbitrageWalletControlPanel + 'InsertUpdateChargeConfigurationMasterArbitrageUser',
    ListChargeConfigurationDetailArbitrageUser: apiArbitrageWalletControlPanel + 'ListChargeConfigurationDetailArbitrageUser',
    UpdateChargeConfigurationDetailArbitrageUser: apiArbitrageWalletControlPanel + 'UpdateChargeConfigurationDetailArbitrageUser',
    AddChargeConfigurationDeatilArbitrageUser: apiArbitrageWalletControlPanel + 'AddChargeConfigurationDeatilArbitrageUser',
    TopUpHistory: apiArbitrageWalletControlPanel + 'TopUpHistory',
    AddDepositFund: apiArbitrageWalletControlPanel + 'AddDepositFund',
    ListArbitrageChargeConfigurationMasterLP: apiArbitrageWalletControlPanel + 'ListArbitrageChargeConfigurationMasterLP',
    InsertUpdateArbitrageChargeConfigurationMasterLP: apiArbitrageWalletControlPanel + 'InsertUpdateArbitrageChargeConfigurationMasterLP',
    ListArbitrageChargeConfigurationDetailLP: apiArbitrageWalletControlPanel + 'ListArbitrageChargeConfigurationDetailLP',
    InsertUpdateArbitrageChargeConfigurationDetailLP: apiArbitrageWalletControlPanel + 'InsertUpdateArbitrageChargeConfigurationDetailLP',
    ProviderBalanceTopupReport: apiArbitrageWalletControlPanel + 'ProviderBalanceTopupReport',
    ArbitrageProviderFundTransafer: apiArbitrageWalletControlPanel + 'ArbitrageProviderFundTransafer',
    ListWalletMaster: apiArbitrageWalletControlPanel + 'ListWalletMaster',
    GetArbitrageWalletLedgerv2: apiArbitrageWalletControlPanel + 'GetArbitrageWalletLedgerv2',
    ListLPArbitrageWalletMismatch: apiArbitrageWalletControlPanel + 'ListLPArbitrageWalletMismatch',
    ArbitrageRecon: apiArbitrageWalletControlPanel + 'ArbitrageRecon',
}

const ArbitrageWallet = {
    ArbitrageListCurrency: apiArbitrageWallet + 'ListCurrency',
}

const GlobalNotification = {
    PushEmail: apiGlobalNotification + 'PushEmail',
    ResendSMS: apiGlobalNotification + 'ResendSMS/',
    ResendEmail: apiGlobalNotification + 'ResendEmail/',
    PushSMS: apiGlobalNotification + 'PushSMS',
}

const BackOfficeAPIConfiguration = {
    APIPlanConfigurationCount: apiBackOfficeAPIConfiguration + 'APIPlanConfigurationCount',
    GetAPIPlan: apiBackOfficeAPIConfiguration + 'GetAPIPlan',
    GetRestMethodsReadOnly: apiBackOfficeAPIConfiguration + 'GetRestMethodsReadOnly',
    GetRestMethodsFullAccess: apiBackOfficeAPIConfiguration + 'GetRestMethodsFullAccess',
    AddAPIPlan: apiBackOfficeAPIConfiguration + 'AddAPIPlan',
    UpdateAPIPlan: apiBackOfficeAPIConfiguration + 'UpdateAPIPlan',
    ViewUserSubscriptionHistory: apiBackOfficeAPIConfiguration + 'ViewUserSubscriptionHistory',
    ViewAPIPlanConfigurationHistory: apiBackOfficeAPIConfiguration + 'ViewAPIPlanConfigurationHistory',
    ViewPublicAPIKeys: apiBackOfficeAPIConfiguration + 'ViewPublicAPIKeys',
    GetIPAddressWiseReport: apiBackOfficeAPIConfiguration + 'GetIPAddressWiseReport',
    GetPublicAPIKeyPolicy: apiBackOfficeAPIConfiguration + 'GetPublicAPIKeyPolicy',
    UpdatePublicAPIKeyPolicy: apiBackOfficeAPIConfiguration + 'UpdatePublicAPIKeyPolicy',
    GetAPIWiseReport: apiBackOfficeAPIConfiguration + 'GetAPIWiseReport',
    GetAPIRequestStatisticsCount: apiBackOfficeAPIConfiguration + 'GetAPIRequestStatisticsCount',
    GetAPIMethods: apiBackOfficeAPIConfiguration + 'GetAPIMethods',
    AddAPIMethod: apiBackOfficeAPIConfiguration + 'AddAPIMethod',
    UpdateAPIMethod: apiBackOfficeAPIConfiguration + 'UpdateAPIMethod',
    GetSystemRestMethods: apiBackOfficeAPIConfiguration + 'GetSystemRestMethods',
    GetHttpErrorCodeReport: apiBackOfficeAPIConfiguration + 'GetHttpErrorCodeReport',
}

const ApiConfiguration = {
    GetFrequentUseAPI: apiApiConfiguration + 'GetFrequentUseAPI',
    MostActiveIPAddress: apiApiConfiguration + 'MostActiveIPAddress',
}

//Define All API Method Here
export const Method = {
    ...Authorization,
    ...Language,
    ...DeviceRegistration,
    ...MarginWallet,
    ...SignIn,
    ...SignUp,
    ...Transaction,
    ...TwoFASetting,
    ...Wallet,
    ...WalletOperations,
    ...WalletControlPanel,
    ...WalletConfiguration,
    ...BackOfficeComplain,
    ...Referral,
    ...SocialProfile,
    ...BackOfficeOrganization,
    ...BackOfficeApplication,

    ...TransactionConfiguration,
    ...TransactionBackOffice,
    ...TransactionBackOfficeCount,
    ...ExchangeFeedConfiguration,
    ...BackOfficeRuleManagement,
    ...ProfileConfiguration,
    ...Complaint,
    ...PasswordPolicy,
    ...privatev1zohocrm,
    ...BackOffice,
    ...cms,
    ...Manage,
    ...BackOfficeActivityLog,
    ...SignUpReport,
    ...KYCConfiguration,
    ...BackOfficeRoleManagement,
    ...BackOfficeUser,
    ...AffiliateBackOffice,
    ...Transaction,
    ...MarginWalletControlPanel,
    ...MasterConfiguration,
    ...ArbitrageWalletControlPanel,
    ...ArbitrageWallet,
    ...GlobalNotification,
    ...BackOfficeAPIConfiguration,
    ...ApiConfiguration,
    ...contactus,
    ...Localization,
}