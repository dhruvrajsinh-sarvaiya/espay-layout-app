using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Microsoft.Extensions.Logging;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Infrastructure.DTOClasses;
using System.Threading.Tasks;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.Entities.Wallet;
using System.Linq;
using CleanArchitecture.Core.ViewModels.WalletConfiguration;
using System.Collections;
using System.Globalization;
using CleanArchitecture.Core.Helpers;
using Microsoft.AspNetCore.Identity;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.ViewModels.WalletOpnAdvanced;
using System.Text.RegularExpressions;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Entities.Charges;
using CleanArchitecture.Core.ViewModels.ControlPanel;

namespace CleanArchitecture.Infrastructure.Services
{
    public class WalletService : BasePage, IWalletService
    {
        #region DI
        List<TransactionProviderResponse> transactionProviderResponses;
        ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
        ThirdPartyAPIRequest thirdPartyAPIRequest;

        private readonly ILogger<WalletService> _log;
        private IProfileConfigurationService _profileConfigurationService;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly ICommonRepository<WalletTrnLimitConfiguration> _walletTrnLimitConfiguration;
        private readonly ICommonRepository<StakingChargeMaster> _StakingChargeCommonRepo;
        private readonly ICommonRepository<StakingPolicyMaster> _StakingPolicyCommonRepo;
        private readonly ICommonRepository<StakingPolicyDetail> _StakingDetailCommonRepo;
        private readonly ICommonRepository<TokenStakingHistory> _TokenStakingHistoryCommonRepo;
        private readonly ICommonRepository<TokenUnStakingHistory> _TokenUnstakingHistoryCommonRepo;
        private readonly ICommonRepository<WalletMaster> _commonRepository;
        private readonly ICommonRepository<UserActivityLog> _UserActivityLogCommonRepo;
        private readonly ICommonRepository<WalletAuthorizeUserMaster> _WalletAuthorizeUserMaster;
        private readonly ICommonRepository<ColdWalletMaster> _ColdWalletMaster;
        //   private readonly ICommonRepository<WalletMaster> _commonRepositoryTest; //ntrivedi to solve method conflict
        //private readonly ICommonRepository<WalletMaster> _commonRepositoryNew; //ntrivedi to solve method conflict
        private readonly IMessageConfiguration _messageConfiguration;
        private readonly ICommonRepository<WalletLimitConfiguration> _LimitcommonRepository;
        private readonly ICommonRepository<OrganizationUserMaster> _OrganizationUserMaster;
        //private readonly ICommonRepository<WalletLimitConfigurationMaster> _WalletLimitConfigurationMasterRepository;
        private readonly ICommonRepository<ThirdPartyAPIConfiguration> _thirdPartyCommonRepository;
        private readonly ICommonRepository<WalletOrder> _walletOrderRepository;
        private readonly ICommonRepository<AddressMaster> _addressMstRepository;
        private readonly ICommonRepository<TrnAcBatch> _trnBatch;
        private readonly ICommonRepository<TradeBitGoDelayAddresses> _bitgoDelayRepository;
        private readonly ICommonRepository<WalletAllowTrn> _WalletAllowTrnRepo;
        private readonly ICommonRepository<BeneficiaryMaster> _BeneficiarycommonRepository;
        private readonly ICommonRepository<UserPreferencesMaster> _UserPreferencescommonRepository;
        private readonly ICommonRepository<WalletLedger> _WalletLedgersRepo;
        private readonly ICommonRepository<MemberShadowBalance> _ShadowBalRepo;
        private readonly ICommonRepository<AddRemoveUserWalletRequest> _AddRemoveUserWalletRequest;
        private readonly ICommonRepository<AllowTrnTypeRoleWise> _AllowTrnTypeRoleWise;
        private readonly ICommonRepository<UserRoleMaster> _UserRoleMaster;
        private readonly ICommonRepository<MemberShadowLimit> _ShadowLimitRepo;
        private readonly ICommonRepository<ActivityTypeHour> _ActivityTypeHour;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ICommonRepository<ConvertFundHistory> _ConvertFundHistory;
        private readonly IMessageService _messageService;
        //readonly ICommonRepository<WalletLedger> _walletLedgerRepository;
        private readonly IWalletRepository _walletRepository1;
        private readonly IWebApiRepository _webApiRepository;
        private readonly IWebApiSendRequest _webApiSendRequest;
        private readonly IGetWebRequest _getWebRequest;
        private readonly WebApiParseResponse _WebApiParseResponse;
        private readonly IGenerateAddressQueue<BGTaskAddressGeneration> _IGenerateAddressQueue;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        //vsolanki 8-10-2018 
        private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        private readonly ICommonRepository<WithdrawHistory> _WithdrawHistoryRepository;
        //readonly IBasePage _BaseObj;
        private static Random random = new Random((int)DateTime.Now.Ticks);
        //vsolanki 10-10-2018 
        private readonly ICommonRepository<WalletAllowTrn> _WalletAllowTrnRepository;
        private readonly ICommonRepository<TransactionAccount> _TransactionAccountsRepository;
        private readonly ICommonRepository<ChargeRuleMaster> _chargeRuleMaster;
        private readonly ICommonRepository<ChargeConfigurationDetail> _ChargeConfigrationDetail;
        private readonly ICommonRepository<ChargeConfigurationMaster> _ChargeConfigurationMaster;
        //private readonly ICommonRepository<LimitRuleMaster> _limitRuleMaster;
        private readonly ISignalRService _signalRService;
        private readonly ICommonWalletFunction _commonWalletFunction;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly IWalletSPRepositories _walletSPRepositories;
        private readonly IWalletTQInsert _WalletTQInsert;

        //private readonly IRepository<WalletTransactionOrder> _WalletAllowTrnRepository;
        //  private readonly ICommonRepository<WalletTransactionQueue> t;
        #endregion

        #region Constructor
        public WalletService(IGenerateAddressQueue<BGTaskAddressGeneration> IgenerateAddressQueue, ILogger<WalletService> log, ICommonRepository<WalletAuthorizeUserMaster> WalletAuthorizeUserMaster, ICommonRepository<UserRoleMaster> UserRoleMaster, ICommonRepository<ColdWalletMaster> ColdWalletMaster, ICommonRepository<ChargeConfigurationDetail> ChargeConfigrationDetail, ICommonRepository<ChargeConfigurationMaster> ChargeConfigurationMaster,
            ICommonRepository<AllowTrnTypeRoleWise> AllowTrnTypeRoleWise,
            ICommonRepository<StakingChargeMaster> StakingChargeCommonRepo,
            ICommonRepository<StakingPolicyMaster> StakingPolicyCommonRepo,
            ICommonRepository<StakingPolicyDetail> StakingDetailCommonRepo,
            ICommonRepository<TokenStakingHistory> TokenStakingHistoryCommonRepo,
            ICommonRepository<ActivityTypeHour> ActivityTypeHour,
            ICommonRepository<TokenUnStakingHistory> TokenUnstakingHistoryCommonRepo, ICommonRepository<WalletTrnLimitConfiguration> walletTrnLimitConfiguration,
            ICommonRepository<WalletMaster> commonRepository, ICommonRepository<WalletMaster> commonRepositoryTest, ICommonRepository<AddRemoveUserWalletRequest> AddRemoveUserWalletRequest, ICommonRepository<OrganizationUserMaster> OrganizationUserMaster,
            WebApiParseResponse WebApiParseResponse, ICommonRepository<TrnAcBatch> BatchLogger, ICommonRepository<WalletOrder> walletOrderRepository,
            IWalletRepository walletRepository, ICommonRepository<WalletMaster> commonRepositoryNew, IWebApiRepository webApiRepository,
            IWebApiSendRequest webApiSendRequest, ICommonRepository<ThirdPartyAPIConfiguration> thirdpartyCommonRepo,
            IGetWebRequest getWebRequest, ICommonRepository<TradeBitGoDelayAddresses> bitgoDelayRepository,
            ICommonRepository<AddressMaster> addressMaster, IMessageConfiguration messageConfiguration,
            ILogger<BasePage> logger, ICommonRepository<WalletTypeMaster> WalletTypeMasterRepository, IProfileConfigurationService profileConfigurationService,
            ICommonRepository<WalletAllowTrn> WalletAllowTrnRepository, ICommonRepository<WalletAllowTrn> WalletAllowTrnRepo,
            ICommonRepository<MemberShadowLimit> ShadowLimitRepo, ICommonRepository<MemberShadowBalance> ShadowBalRepo,
            ICommonRepository<BeneficiaryMaster> BeneficiaryMasterRepo,
            ICommonRepository<UserPreferencesMaster> UserPreferenceRepo, ICommonRepository<WalletLimitConfiguration> WalletLimitConfig,
            ICommonRepository<ChargeRuleMaster> chargeRuleMaster,
            ICommonRepository<TransactionAccount> TransactionAccountsRepository, UserManager<ApplicationUser> userManager,
            IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, ISignalRService signalRService,
            ICommonRepository<UserActivityLog> UserActivityLogCommonRepo, Microsoft.Extensions.Configuration.IConfiguration configuration,
            ICommonWalletFunction commonWalletFunction, ICommonRepository<ConvertFundHistory> ConvertFundHistory,
            ICommonRepository<WithdrawHistory> WithdrawHistoryRepository, IWalletSPRepositories walletSPRepositories, IMessageService messageService, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue,
            IWalletTQInsert WalletTQInsert) : base(logger)
        {
            _ColdWalletMaster = ColdWalletMaster;
            _walletTrnLimitConfiguration = walletTrnLimitConfiguration;
            _AllowTrnTypeRoleWise = AllowTrnTypeRoleWise;
            _profileConfigurationService = profileConfigurationService;
            _configuration = configuration;
            _UserRoleMaster = UserRoleMaster;
            _StakingChargeCommonRepo = StakingChargeCommonRepo;
            _StakingPolicyCommonRepo = StakingPolicyCommonRepo;
            _StakingDetailCommonRepo = StakingDetailCommonRepo;
            _TokenStakingHistoryCommonRepo = TokenStakingHistoryCommonRepo;
            _TokenUnstakingHistoryCommonRepo = TokenUnstakingHistoryCommonRepo;
            _WalletAuthorizeUserMaster = WalletAuthorizeUserMaster;
            _AddRemoveUserWalletRequest = AddRemoveUserWalletRequest;
            _IGenerateAddressQueue = IgenerateAddressQueue;
            _UserActivityLogCommonRepo = UserActivityLogCommonRepo;
            _messageConfiguration = messageConfiguration;
            _log = log;
            _ChargeConfigurationMaster = ChargeConfigurationMaster;
            _ChargeConfigrationDetail = ChargeConfigrationDetail;
            _OrganizationUserMaster = OrganizationUserMaster;
            _userManager = userManager;
            _commonRepository = commonRepository;
            _ActivityTypeHour = ActivityTypeHour;
            //_commonRepositoryTest = commonRepositoryTest;
            //_commonRepositoryNew = commonRepositoryNew;
            _pushNotificationsQueue = pushNotificationsQueue;
            _walletOrderRepository = walletOrderRepository;
            //_walletRepository = repository;
            _bitgoDelayRepository = bitgoDelayRepository;
            _trnBatch = BatchLogger;
            _walletRepository1 = walletRepository;
            _webApiRepository = webApiRepository;
            _webApiSendRequest = webApiSendRequest;
            _thirdPartyCommonRepository = thirdpartyCommonRepo;
            _getWebRequest = getWebRequest;
            _addressMstRepository = addressMaster;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            _WalletAllowTrnRepository = WalletAllowTrnRepository;
            _WebApiParseResponse = WebApiParseResponse;
            //_walletLedgerRepository = walletledgerrepo;
            _WalletAllowTrnRepo = WalletAllowTrnRepo;
            _LimitcommonRepository = WalletLimitConfig;
            _BeneficiarycommonRepository = BeneficiaryMasterRepo;
            _UserPreferencescommonRepository = UserPreferenceRepo;
            //_WalletLimitConfigurationMasterRepository = WalletConfigMasterRepo;
            _ShadowBalRepo = ShadowBalRepo;
            _ShadowLimitRepo = ShadowLimitRepo;
            _chargeRuleMaster = chargeRuleMaster;
            // _limitRuleMaster = limitRuleMaster;
            _TransactionAccountsRepository = TransactionAccountsRepository;
            _signalRService = signalRService;
            _commonWalletFunction = commonWalletFunction;
            _ConvertFundHistory = ConvertFundHistory;
            _WithdrawHistoryRepository = WithdrawHistoryRepository;
            _walletSPRepositories = walletSPRepositories;
            _messageService = messageService;
            _pushSMSQueue = pushSMSQueue;
            _WalletTQInsert = WalletTQInsert;//ntrivedi 22-01-2018
        }


        #endregion
        public decimal GetUserBalance(long walletId)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                //   var obj = _commonRepository.GetById(walletId);
                var obj = _commonRepository.GetSingle(i => i.Id == walletId && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                return obj.Balance;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rushabh 26-10-2018
        public async Task<long> GetWalletID(string AccWalletID)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.AccWalletID == AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                WalletMaster obj = await obj1;
                if (obj != null)//Rita for object ref error
                    return obj.Id;
                else
                    return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        //Rushabh 27-10-2018
        public async Task<string> GetAccWalletID(long WalletID)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.Id == WalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                WalletMaster obj = await obj1;
                if (obj != null)//Rita for object ref error
                    return obj.AccWalletID;
                else
                    return "";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita 9-1-19 need for social trading
        public async Task<string> GetDefaultAccWalletID(string SMSCode, long UserID)
        {
            try
            {
                WalletTypeMaster obj1 = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == SMSCode);
                //2019-2-15 added condi for only used trading wallet
                WalletMaster obj = await _commonRepository.GetSingleAsync(item => item.WalletTypeID == obj1.Id && item.UserID == UserID && item.IsDefaultWallet == 1 && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (obj != null)//Rita for object ref error
                    return obj.AccWalletID;
                else
                    return "";

            }
            catch (Exception ex)
            {
                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                Task.Run(() => HelperForLog.WriteErrorLog("MarkTransactionHold:##SMSCode " + SMSCode, "WalletServicce", ex));
                return "";
            }
        }

        //Rushabh 27-10-2018
        public async Task<enErrorCode> CheckWithdrawalBene(long WalletID, string Name, string DestinationAddress, enWhiteListingBit bit)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var Walletobj = await _commonRepository.GetSingleAsync(item => item.Id == WalletID && item.Status == Convert.ToInt16(ServiceStatus.Active) && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (Walletobj != null)
                {
                    var UserPrefobj = _UserPreferencescommonRepository.GetSingle(item => item.UserID == Walletobj.UserID);
                    if (UserPrefobj != null)
                    {
                        var Beneobj = _BeneficiarycommonRepository.GetSingle(item => item.WalletTypeID == Walletobj.WalletTypeID && item.Address == DestinationAddress && item.Status == Convert.ToInt16(ServiceStatus.Active));
                        if (UserPrefobj.IsWhitelisting == Convert.ToInt16(enWhiteListingBit.ON))
                        {
                            if (Beneobj != null)
                            {
                                if (Beneobj.Address == DestinationAddress && Beneobj.IsWhiteListed == Convert.ToInt16(enWhiteListingBit.ON))
                                {
                                    //-----2019-6-17
                                    DateTime date = Helpers.UTC_To_IST();
                                    TimeSpan difference = date - Beneobj.CreatedDate;
                                    double diffHour = difference.TotalHours;

                                    int ActivityHour = 0;
                                    var activityhourObj = _ActivityTypeHour.GetSingle(i => i.ActivityType == (int)enActivityType.Benificiary);
                                    if (activityhourObj != null)
                                    {
                                        ActivityHour = activityhourObj.ActivityHour;
                                    }
                                    if (ActivityHour >= diffHour)//Convert.ToInt32(_configuration["WithdrawHour"])
                                    {
                                        return enErrorCode.WithdrawNotAllowdBeforehrBene;
                                    }
                                    //-------
                                    return enErrorCode.Success;
                                }
                                else
                                {
                                    return enErrorCode.AddressNotFoundOrWhitelistingBitIsOff;
                                }
                            }
                            return enErrorCode.BeneficiaryNotFound;
                        }
                        else
                        {
                            if (Beneobj != null)
                            {
                                if (Beneobj.Address == DestinationAddress)
                                {
                                    Beneobj.IsWhiteListed = Convert.ToInt16(bit);
                                    Beneobj.UpdatedBy = Walletobj.UserID;
                                    Beneobj.UpdatedDate = UTC_To_IST();
                                    _BeneficiarycommonRepository.Update(Beneobj);
                                    return enErrorCode.Success;
                                }
                                return enErrorCode.AddressNotMatch;
                            }
                            else
                            {
                                BeneficiaryMaster AddNew = new BeneficiaryMaster();
                                AddNew.IsWhiteListed = Convert.ToInt16(bit);
                                AddNew.Status = Convert.ToInt16(ServiceStatus.Active);
                                AddNew.CreatedBy = Walletobj.UserID;
                                AddNew.CreatedDate = UTC_To_IST();
                                AddNew.UserID = Walletobj.UserID;
                                AddNew.Address = DestinationAddress;
                                AddNew.Name = Name;
                                AddNew.WalletTypeID = Walletobj.WalletTypeID;
                                AddNew = _BeneficiarycommonRepository.Add(AddNew);
                                return enErrorCode.Success;
                            }
                        }
                    }
                    //return enErrorCode.GlobalBitNotFound;
                    else
                    {
                        var Beneobj = await _BeneficiarycommonRepository.GetSingleAsync(item => item.WalletTypeID == Walletobj.WalletTypeID && item.Address == DestinationAddress && item.Status == Convert.ToInt16(ServiceStatus.Active));
                        if (Beneobj != null)
                        {
                            return enErrorCode.Success;
                        }
                        else
                        {
                            BeneficiaryMaster AddNew = new BeneficiaryMaster();
                            AddNew.IsWhiteListed = Convert.ToInt16(bit);
                            AddNew.Status = Convert.ToInt16(ServiceStatus.Active);
                            AddNew.CreatedBy = Walletobj.UserID;
                            AddNew.CreatedDate = UTC_To_IST();
                            AddNew.UserID = Walletobj.UserID;
                            AddNew.Address = DestinationAddress;
                            AddNew.Name = Name;
                            AddNew.WalletTypeID = Walletobj.WalletTypeID;
                            AddNew = _BeneficiarycommonRepository.Add(AddNew);
                            return enErrorCode.Success;
                        }
                    }
                }
                return enErrorCode.WalletNotFound;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #region OldCode
        //public enErrorCode CheckShadowLimit(long WalletID, decimal Amount)
        //{
        //    try
        //    {
        //        var Walletobj = _commonRepository.GetSingle(item => item.Id == WalletID);
        //        if (Walletobj != null)
        //        {
        //            var Balobj = _ShadowBalRepo.GetSingle(item => item.WalletID == WalletID);
        //            if (Balobj != null)
        //            {
        //                if ((Balobj.ShadowAmount + Amount) <= Walletobj.Balance)
        //                {
        //                    return enErrorCode.Success;
        //                }
        //                return enErrorCode.InsufficientBalance;
        //            }
        //            else
        //            {
        //                var typeobj = _walletRepository1.GetTypeMappingObj(Walletobj.UserID);
        //                if (typeobj != 0)
        //                {
        //                    var Limitobj = _ShadowLimitRepo.GetSingle(item => item.MemberTypeId == typeobj);
        //                    if (Limitobj != null)
        //                    {
        //                        if ((Limitobj.ShadowLimitAmount + Amount) <= Walletobj.Balance)
        //                        {
        //                            return enErrorCode.Success;
        //                        }
        //                        return enErrorCode.InsufficientBalance;
        //                    }
        //                    return enErrorCode.NotFoundLimit;
        //                }
        //                return enErrorCode.MemberTypeNotFound;
        //            }
        //        }
        //        return enErrorCode.WalletNotFound;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

        //        throw ex;
        //    }
        //}
        #endregion

        public async Task<BizResponseClass> ValidateAddress(string TrnAccountNo, int Length, string StartsWith, string AccNoValidationRegex)
        {
            BizResponseClass Resp = new BizResponseClass();
            try
            {
                Regex NumRegex = new Regex(@"^[0-9]+$", RegexOptions.Compiled);
                Regex AlphaRegex = new Regex(@"^[a-zA-Z]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);
                Regex SpecialCharRegex = new Regex(@"[~`!@#$%^&*()-+=|\{}':;.,<>/?]", RegexOptions.Compiled);
                Regex AddressRegex;


                if (String.IsNullOrEmpty(TrnAccountNo))
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.TrnAccNoRequired;
                    Resp.ErrorCode = enErrorCode.TrnAccNoRequired;
                    return Resp;
                }
                if (NumRegex.IsMatch(TrnAccountNo))
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidTrnAccNo;
                    Resp.ErrorCode = enErrorCode.InvalidTrnAccNoOnlyDigit;
                    return Resp;
                }
                if (AlphaRegex.IsMatch(TrnAccountNo))
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidTrnAccNo;
                    Resp.ErrorCode = enErrorCode.InvalidTrnAccNoOnlyAlphabet;
                    return Resp;
                }
                if (SpecialCharRegex.IsMatch(TrnAccountNo))
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidTrnAccNo;
                    Resp.ErrorCode = enErrorCode.InvalidTrnAccNoOnlySpecialChars;
                    return Resp;
                }
                if (Length > 0)
                {
                    if (TrnAccountNo.Length != Length)
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidTrnAccNo;
                        Resp.ErrorCode = enErrorCode.InvalidTrnAccNoLength;
                        return Resp;
                    }
                }
                if (!String.IsNullOrEmpty(StartsWith))
                {
                    if (!TrnAccountNo.StartsWith(StartsWith))
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidTrnAccNo;
                        Resp.ErrorCode = enErrorCode.InvalidTrnAccNoStartsWithChar;
                        return Resp;
                    }
                }
                if (!String.IsNullOrEmpty(AccNoValidationRegex))
                {
                    AddressRegex = new Regex(AccNoValidationRegex, RegexOptions.Compiled);
                    if (!AddressRegex.IsMatch(TrnAccountNo))
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidTrnAccNo;
                        Resp.ErrorCode = enErrorCode.AddressRegexValidationFail;
                        return Resp;
                    }
                }
                Resp.ReturnCode = enResponseCode.Success;
                Resp.ReturnMsg = EnResponseMessage.ValidTrnAccNo;
                Resp.ErrorCode = enErrorCode.Success;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ValidateAddress", this.GetType().Name, ex);
                throw ex;
            }
        }

        public enValidateWalletLimit ValidateWalletLimit(enTrnType TranType, decimal PerDayAmt, decimal PerHourAmt, decimal PerTranAmt, long WalletID)
        {
            try
            {
                var obj = _LimitcommonRepository.GetSingle(item => item.WalletId == WalletID && item.TrnType == Convert.ToInt16(TranType));
                if ((PerDayAmt <= obj.LimitPerDay) && (PerHourAmt <= obj.LimitPerHour) && (PerTranAmt <= obj.LimitPerTransaction))
                {
                    return enValidateWalletLimit.Success;
                }
                else
                {
                    return enValidateWalletLimit.Fail;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        public bool IsValidWallet(long walletId)
        {
            try
            {
                // return _commonRepository.GetById(walletId).IsValid;
                //2019-2-18 added condi for only used trading wallet
                return _commonRepository.GetSingle(item => item.Id == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)).IsValid;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);

                throw ex;
            }
        }

        public bool WalletBalanceCheck(decimal amount, string walletid)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var obj = _commonRepository.GetSingle(item => item.AccWalletID == walletid && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (obj != null)
                {
                    if (obj.Balance < amount)
                    {
                        return false;
                    }
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public CreateOrderResponse CreateOrder(CreateOrderRequest Order)
        {
            try
            {
                var response = new CreateOrderResponse();

                //WalletService walletServiceObj = WalletBalanceCheck(Order.OrderAmt, Order.OWalletMasterID);

                if (!IsValidWallet(Order.OWalletMasterID) == true)
                {
                    response.OrderID = 0;
                    response.ORemarks = "";
                    response.ReturnMsg = "Invalid Account";
                    response.ReturnCode = enResponseCodeService.Fail;
                    return response;
                }
                var orderItem = new WalletOrder()
                {
                    CreatedBy = 900, // temperory bind member not now
                    DeliveryAmt = Order.OrderAmt,
                    OrderDate = UTC_To_IST(),
                    OrderType = Order.OrderType,
                    OrderAmt = Order.OrderAmt,
                    DWalletMasterID = Order.DWalletMasterID,
                    OWalletMasterID = Order.OWalletMasterID,
                    Status = 0,
                    CreatedDate = UTC_To_IST(),
                    ORemarks = Order.ORemarks
                };
                _walletOrderRepository.Add(orderItem);
                response.OrderID = orderItem.Id;
                response.ORemarks = "Successfully Inserted";
                response.ErrorCode = enErrorCode.Success;
                response.ReturnMsg = "Successfully Inserted";
                response.ReturnCode = 0;
                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponse ProcessOrder(long RefNo, long DWalletID, long OWalletID, decimal amount, string remarks, enWalletTrnType enTrnType, enServiceType serviceType)
        {
            try
            {
                TransactionAccount tansAccObj = new TransactionAccount();
                TransactionAccount tansAccObj1 = new TransactionAccount();
                BizResponse bizResponse = new BizResponse();


                decimal balance;

                balance = GetUserBalance(DWalletID);
                if (amount < 0)
                {
                    //return false;
                    bizResponse.ErrorCode = enErrorCode.InvalidAmount;
                    bizResponse.ReturnMsg = "Invalid Amount";
                    bizResponse.ReturnCode = enResponseCodeService.Fail;
                    return bizResponse;
                }
                if (balance < amount)
                {
                    // return false;
                    bizResponse.ErrorCode = enErrorCode.InsufficientBalance;
                    bizResponse.ReturnMsg = "Insufficient Balance";
                    bizResponse.ReturnCode = enResponseCodeService.Fail;
                    return bizResponse;
                }
                //2019-2-18 added condi for only used trading wallet
                var dWalletobj = _commonRepository.GetSingle(item => item.Id == DWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (dWalletobj == null || dWalletobj.Status != 1)
                {
                    // return false;
                    bizResponse.ErrorCode = enErrorCode.InvalidWallet;
                    bizResponse.ReturnMsg = "Invalid Wallet";
                    bizResponse.ReturnCode = enResponseCodeService.Fail;
                    return bizResponse;
                }
                //2019-2-18 added condi for only used trading wallet
                var oWalletobj = _commonRepository.GetSingle(i => i.Id == OWalletID && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (oWalletobj == null || oWalletobj.Status != 1)
                {
                    bizResponse.ErrorCode = enErrorCode.InvalidWallet;
                    bizResponse.ReturnMsg = "Invalid Wallet";
                    bizResponse.ReturnCode = enResponseCodeService.Fail;

                    return bizResponse;
                }

                TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch());
                tansAccObj.BatchNo = batchObj.Id;
                tansAccObj.CrAmt = amount;
                tansAccObj.CreatedBy = DWalletID;
                tansAccObj.CreatedDate = UTC_To_IST();
                tansAccObj.DrAmt = 0;
                tansAccObj.IsSettled = 1;
                tansAccObj.RefNo = RefNo;
                tansAccObj.Remarks = remarks;
                tansAccObj.Status = 1;
                tansAccObj.TrnDate = UTC_To_IST();
                tansAccObj.UpdatedBy = DWalletID;
                tansAccObj.WalletID = OWalletID;
                //tansAccObj = _trnxAccount.Add(tansAccObj);

                tansAccObj1 = new TransactionAccount();
                tansAccObj1.BatchNo = batchObj.Id;
                tansAccObj1.CrAmt = 0;
                tansAccObj1.CreatedBy = DWalletID;
                tansAccObj1.CreatedDate = UTC_To_IST();
                tansAccObj1.DrAmt = amount;
                tansAccObj1.IsSettled = 1;
                tansAccObj1.RefNo = RefNo;
                tansAccObj1.Remarks = remarks;
                tansAccObj1.Status = 1;
                tansAccObj1.TrnDate = UTC_To_IST();
                tansAccObj1.UpdatedBy = DWalletID;
                tansAccObj1.WalletID = DWalletID;
                //tansAccObj = _trnxAccount.Add(tansAccObj);

                dWalletobj.DebitBalance(amount);
                oWalletobj.CreditBalance(amount);

                //_walletRepository.Update(dWalletobj);
                //_walletRepository.Update(oWalletobj);

                var walletLedger = new WalletLedger();
                walletLedger.ServiceTypeID = serviceType;
                walletLedger.TrnType = enTrnType;
                walletLedger.CrAmt = 0;
                walletLedger.CreatedBy = DWalletID;
                walletLedger.CreatedDate = UTC_To_IST();
                walletLedger.DrAmt = amount;
                walletLedger.TrnNo = RefNo;
                walletLedger.Remarks = remarks;
                walletLedger.Status = 1;
                walletLedger.TrnDate = UTC_To_IST();
                walletLedger.UpdatedBy = DWalletID;
                walletLedger.WalletId = DWalletID;
                walletLedger.ToWalletId = OWalletID;
                walletLedger.PreBal = dWalletobj.Balance;
                walletLedger.PostBal = dWalletobj.Balance - amount;
                //walletLedger = _walletLedgerRepository.Add(walletLedger);

                var walletLedger2 = new WalletLedger();
                walletLedger2.ServiceTypeID = serviceType;
                walletLedger2.TrnType = enTrnType;
                walletLedger2.CrAmt = amount;
                walletLedger2.CreatedBy = DWalletID;
                walletLedger2.CreatedDate = UTC_To_IST();
                walletLedger2.DrAmt = 0;
                walletLedger2.TrnNo = RefNo;
                walletLedger2.Remarks = remarks;
                walletLedger2.Status = 1;
                walletLedger2.TrnDate = UTC_To_IST();
                walletLedger2.UpdatedBy = DWalletID;
                walletLedger2.WalletId = OWalletID;
                walletLedger2.ToWalletId = DWalletID;
                walletLedger2.PreBal = oWalletobj.Balance;
                walletLedger2.PostBal = oWalletobj.Balance - amount;

                _walletRepository1.WalletOperation(walletLedger, walletLedger2, tansAccObj, tansAccObj1, dWalletobj, oWalletobj);
                bizResponse.ErrorCode = enErrorCode.Success;
                bizResponse.ReturnMsg = "Success";
                bizResponse.ReturnCode = enResponseCodeService.Success;
                return bizResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        #region OldCode
        //public CreateWalletAddressRes GenerateAddress(string walletID, string coin, string Token, int GenaratePendingbit = 0, long UseriD = 0)
        //{
        //    try
        //    {
        //        ThirdPartyAPIRequest thirdPartyAPIRequest;
        //        //WebApiParseResponse _WebApiParseResponse;
        //        TradeBitGoDelayAddresses delayAddressesObj, delayGeneratedAddressesObj;
        //        List<TransactionProviderResponse> transactionProviderResponses;
        //        //WalletMaster walletMaster = _commonRepository.GetById(walletID);
        //        WalletMaster walletMaster = _commonRepository.GetSingle(item => item.AccWalletID == walletID && item.Status != Convert.ToInt16(ServiceStatus.Disable));
        //        AddressMaster addressMaster;
        //        string address = "";
        //        string CoinSpecific = null;
        //        string TrnID = null;
        //        string Respaddress = null;

        //        var wallettype = _WalletTypeMasterRepository.GetSingle(t => t.WalletTypeName == coin);
        //        //var user = _userManager.GetUserAsync(HttpContext.User);
        //        //if (user == null)
        //        //{
        //        //    Response.ReturnCode = enResponseCode.Fail;
        //        //    Response.ReturnMsg = EnResponseMessage.StandardLoginfailed;
        //        //    Response.ErrorCode = enErrorCode.StandardLoginfailed;
        //        //}

        //        if (wallettype.Id != walletMaster.WalletTypeID)
        //        {
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
        //        }
        //        if (walletMaster == null)
        //        {
        //            //return false enResponseCodeService.Fail
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
        //        }
        //        else if (walletMaster.Status != Convert.ToInt16(ServiceStatus.Active))
        //        {
        //            //return false
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
        //        }

        //        transactionProviderResponses = _webApiRepository.GetProviderDataList(new TransactionApiConfigurationRequest { SMSCode = coin.ToLower(), amount = 0, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.Generate_Address) });
        //        if (transactionProviderResponses == null || transactionProviderResponses.Count == 0)
        //        {
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.ItemNotFoundForGenerateAddress, ReturnCode = enResponseCode.Fail, ReturnMsg = "Please try after sometime." };
        //        }
        //        if (transactionProviderResponses[0].ThirPartyAPIID == 0)
        //        {
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
        //        }

        //        ThirdPartyAPIConfiguration thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(transactionProviderResponses[0].ThirPartyAPIID);
        //        if (thirdPartyAPIConfiguration == null || transactionProviderResponses.Count == 0)
        //        {
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
        //        }
        //        thirdPartyAPIRequest = _getWebRequest.MakeWebRequest(transactionProviderResponses[0].RouteID, transactionProviderResponses[0].ThirPartyAPIID, transactionProviderResponses[0].SerProDetailID);
        //        string apiResponse = _webApiSendRequest.SendAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.MethodType);
        //        // parse response logic 


        //        WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID);
        //        Respaddress = ParsedResponse.TrnRefNo;
        //        if (!string.IsNullOrEmpty(apiResponse) && thirdPartyAPIRequest.DelayAddress == 1)
        //        {

        //            //WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID);
        //            //Respaddress = ParsedResponse.StatusMsg;
        //            delayAddressesObj = GetTradeBitGoDelayAddresses(0, walletMaster.WalletTypeID, ParsedResponse.StatusMsg, "", thirdPartyAPIRequest.walletID, walletMaster.CreatedBy, ParsedResponse.Param1, 0, 0, coin);
        //            delayAddressesObj = _bitgoDelayRepository.Add(delayAddressesObj);


        //            if (GenaratePendingbit == 0)
        //            {
        //                delayGeneratedAddressesObj = _walletRepository1.GetUnassignedETH();

        //                if (delayGeneratedAddressesObj == null)
        //                {
        //                    return new CreateWalletAddressRes { address = Respaddress, ErrorCode = enErrorCode.UnAssignedAddressFetchFail, ReturnCode = enResponseCode.Fail, ReturnMsg = "please try after some time" };
        //                }
        //                address = delayGeneratedAddressesObj.Address;
        //                Respaddress = delayGeneratedAddressesObj.Address;

        //                delayGeneratedAddressesObj.WalletId = walletMaster.Id;
        //                delayGeneratedAddressesObj.UpdatedBy = walletMaster.UserID;
        //                delayGeneratedAddressesObj.UpdatedDate = UTC_To_IST();
        //                _bitgoDelayRepository.Update(delayGeneratedAddressesObj);

        //            }
        //            else
        //            {

        //                return new CreateWalletAddressRes { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateAddressSuccessMsg };
        //            }
        //        }
        //        // if (!string.IsNullOrEmpty(apiResponse))
        //        // //{
        //        // //    WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID);
        //        // //    Respaddress = ParsedResponse.TrnRefNo;
        //        //// }

        //        if (!string.IsNullOrEmpty(Respaddress))
        //        {
        //            addressMaster = GetAddressObj(walletMaster.Id, transactionProviderResponses[0].ServiceProID, Respaddress, "Self Address", walletMaster.UserID, 0, 1);
        //            addressMaster = _addressMstRepository.Add(addressMaster);
        //            //var msg = EnResponseMessage.GenerateAddressNotification;
        //            //msg = msg.Replace("#WalletName#", walletMaster.Walletname);
        //            //_signalRService.SendActivityNotification(msg, Token);
        //            ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //            ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.GenerateAddressNotification);
        //            ActivityNotification.Param1 = walletMaster.Walletname;
        //            ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //            _signalRService.SendActivityNotificationV2(ActivityNotification, Token);

        //            //2018-12-5
        //            EmailSendAsync(EnTemplateType.ConfirmationMail, UseriD.ToString(), walletMaster.Walletname,
        //     0, 0, coin, walletMaster.AccWalletID, UTC_To_IST().ToString(), walletMaster.Balance, null, null, null, 0, 0, 0, walletMaster.PublicAddress, 0, 0, null);

        //            string responseString = Respaddress;
        //            return new CreateWalletAddressRes { address = Respaddress, ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateAddressSuccessMsg };
        //            //return respObj;
        //        }
        //        else
        //        {
        //            return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
        //        }

        //        // code need to be added
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GenerateAddress ", "WalletService", ex);
        //        //HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Transaction/Withdraw Process Start" + "##TrnNo:" + Req.TrnNo);
        //        throw ex;
        //    }
        //}
        #endregion

        public ListChargesTypeWise ListChargesTypeWise(string WalletTypeName, long? TrnTypeId, long UserId)
        {
            var typeObj = _WalletTypeMasterRepository.GetSingle(i => i.WalletTypeName == WalletTypeName);
            ListChargesTypeWise Resp = new ListChargesTypeWise();
            List<ChargeWalletType> walletTypes = new List<ChargeWalletType>();
            try
            {
                long? Id = null;
                if (typeObj != null)
                {
                    Id = typeObj.Id;
                }
                var res = _walletRepository1.GetChargeWalletType(Id);
                var StakingCharges = _StakingChargeCommonRepo.GetSingle(k => k.UserID == UserId && k.Status == 1);
                for (int i = 0; i <= res.Count - 1; i++)
                {
                    ChargeWalletType a = new ChargeWalletType();
                    a.WalletTypeName = res[i].WalletTypeName;
                    a.WalletTypeId = res[i].WalletTypeId;
                    a.Charges = new List<ChargesTypeWise>();
                    var data = _walletRepository1.ListChargesTypeWise(res[i].WalletTypeId, TrnTypeId);
                    a.Charges = data;
                    if (StakingCharges != null)
                    {
                        a.Charges.ForEach(item =>
                        {
                            if (item.MakerCharge > 0 && item.TakerCharge > 0)
                            {
                                item.MakerCharge = StakingCharges.MakerCharge;
                                item.TakerCharge = StakingCharges.TakerCharge;
                            }
                        });
                    }
                    walletTypes.Add(a);
                }
                if (walletTypes.Count == 0)
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    return Resp;
                }
                Resp.ErrorCode = enErrorCode.Success;
                Resp.ReturnCode = enResponseCode.Success;
                Resp.ReturnMsg = EnResponseMessage.FindRecored;
                Resp.Data = walletTypes;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public async Task<CreateWalletAddressRes> GenerateAddress(string walletID, string coin, string Token, int GenaratePendingbit = 0, long UseriD = 0)
        {
            try
            {
                UserActivityLog activityLog = new UserActivityLog();
                //WebApiParseResponse _WebApiParseResponse;
                TradeBitGoDelayAddresses delayAddressesObj, delayGeneratedAddressesObj;
                //WalletMaster walletMaster = _commonRepository.GetById(walletID);
                //2019-2-18 added condi for only used trading wallet
                var walletMasterobj = _commonRepository.GetSingleAsync(item => item.AccWalletID == walletID && item.Status != Convert.ToInt16(ServiceStatus.Disable) && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));//05-12-2018

                AddressMaster addressMaster;
                string address = "";
                string CoinSpecific = null;
                string TrnID = null;
                string Respaddress = null;

                var wallettype = _WalletTypeMasterRepository.GetSingleAsync(t => t.WalletTypeName == coin);
                WalletTypeMaster walletTypeMaster = await wallettype;
                if (walletTypeMaster.IsLocal == 1)
                {
                    var res = CreateERC20Address(UseriD, coin, walletID, 1);
                    return res;
                }
                if (walletTypeMaster.IsLocal == 2 || walletTypeMaster.IsLocal == 3 || walletTypeMaster.IsLocal == 4 || walletTypeMaster.IsLocal == 6 || walletTypeMaster.IsLocal == 7)//2-TRX,3-TRC 10,4-TRC-20,5=neo,6 =sox ,7-usdx
                {
                    var res = CreateERC20Address(UseriD, coin, walletID, Convert.ToInt16(walletTypeMaster.IsLocal));
                    return res;
                }
                if (walletTypeMaster.IsLocal == 5)//2-TRX,3-TRC 10,4-TRC-20,5=neo
                {
                    var res = CreateNeoAddress(UseriD, coin, walletID, Convert.ToInt16(walletTypeMaster.IsLocal));
                    return res;
                }
                var providerdata = _webApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest { SMSCode = coin.ToLower(), amount = 0, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.Generate_Address) });//05-12-2018
                WalletMaster walletMaster = await walletMasterobj;//05-12-2018

                var addressObj = _addressMstRepository.GetSingle(i => i.WalletId == walletMaster.Id && i.Status == 1);
                if (addressObj != null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AddressExist };
                }
                if (walletTypeMaster.Id != walletMaster.WalletTypeID)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                }
                if (walletMaster == null)
                {
                    //return false enResponseCodeService.Fail
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                }
                else if (walletMaster.Status != Convert.ToInt16(ServiceStatus.Active))
                {
                    //return false
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                }

                transactionProviderResponses = await providerdata;//_webApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest { SMSCode = coin.ToLower(), amount = 0, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.Generate_Address) });
                var apiconfig = _thirdPartyCommonRepository.GetByIdAsync(transactionProviderResponses[0].ThirPartyAPIID);
                if (transactionProviderResponses == null || transactionProviderResponses.Count == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.ItemNotFoundForGenerateAddress, ReturnCode = enResponseCode.Fail, ReturnMsg = "Please try after sometime." };
                }
                if (transactionProviderResponses[0].ThirPartyAPIID == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }

                //05-12-2018 ThirdPartyAPIConfiguration thirdPartyAPIConfiguration = _thirdPartyCommonRepository.GetById(transactionProviderResponses[0].ThirPartyAPIID);
                thirdPartyAPIConfiguration = await apiconfig;
                if (thirdPartyAPIConfiguration == null || transactionProviderResponses.Count == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                thirdPartyAPIRequest = _getWebRequest.MakeWebRequest(transactionProviderResponses[0].RouteID, transactionProviderResponses[0].ThirPartyAPIID, transactionProviderResponses[0].SerProDetailID);
                string apiResponse = _webApiSendRequest.SendAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.MethodType);
                // parse response logic 


                WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID);
                Respaddress = ParsedResponse.TrnRefNo;
                if (!string.IsNullOrEmpty(apiResponse) && thirdPartyAPIRequest.DelayAddress == 1)
                {

                    //WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID);
                    //Respaddress = ParsedResponse.StatusMsg;
                    delayAddressesObj = GetTradeBitGoDelayAddresses(0, walletMaster.WalletTypeID, ParsedResponse.StatusMsg, "", thirdPartyAPIRequest.walletID, walletMaster.CreatedBy, ParsedResponse.Param1, 1, 0, coin);
                    delayAddressesObj = _bitgoDelayRepository.Add(delayAddressesObj);


                    if (GenaratePendingbit == 0)
                    {
                        delayGeneratedAddressesObj = _walletRepository1.GetUnassignedETH();

                        if (delayGeneratedAddressesObj == null)
                        {
                            return new CreateWalletAddressRes { address = Respaddress, ErrorCode = enErrorCode.UnAssignedAddressFetchFail, ReturnCode = enResponseCode.Fail, ReturnMsg = "please try after some time" };
                        }
                        address = delayGeneratedAddressesObj.Address;
                        Respaddress = delayGeneratedAddressesObj.Address;

                        delayGeneratedAddressesObj.WalletId = walletMaster.Id;
                        delayGeneratedAddressesObj.UpdatedBy = walletMaster.UserID;
                        delayGeneratedAddressesObj.UpdatedDate = UTC_To_IST();
                        _bitgoDelayRepository.Update(delayGeneratedAddressesObj);

                    }
                    else
                    {
                        return new CreateWalletAddressRes { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateAddressSuccessMsg };
                    }
                }
                if (!string.IsNullOrEmpty(Respaddress))
                {
                    addressMaster = GetAddressObj(walletMaster.Id, transactionProviderResponses[0].ServiceProID, Respaddress, "Self Address", walletMaster.UserID, 0, 1);
                    //addressMaster = _addressMstRepository.Add(addressMaster);

                    activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.GenerateAddress);
                    activityLog.CreatedBy = UseriD;
                    activityLog.CreatedDate = UTC_To_IST();
                    activityLog.UserID = UseriD;
                    activityLog.WalletID = walletMaster.Id;
                    activityLog.Remarks = "Address Generated For " + coin;

                    BGTaskAddressGeneration obj = new BGTaskAddressGeneration();
                    obj.AccWalletId = walletMaster.AccWalletID;
                    obj.Address = addressMaster;
                    obj.PublicAddress = addressMaster.Address;
                    obj.Amount = walletMaster.Balance;
                    obj.UID = UseriD.ToString();
                    obj.WalletName = walletMaster.Walletname;
                    obj.Coin = coin;
                    obj.Token = UseriD.ToString();
                    obj.Date = UTC_To_IST().ToString();
                    obj.userActivityLog = activityLog;
                    _IGenerateAddressQueue.Enqueue(obj);

                    //var msg = EnResponseMessage.GenerateAddressNotification;
                    //msg = msg.Replace("#WalletName#", walletMaster.Walletname);
                    //_signalRService.SendActivityNotification(msg, Token);

                    #region Moved To BGTaskAddressGeneration
                    //ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                    //ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.GenerateAddressNotification);
                    //ActivityNotification.Param1 = walletMaster.Walletname;
                    //ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                    //_signalRService.SendActivityNotificationV2(ActivityNotification, Token);

                    ////2018-12-5
                    //EmailSendAsync(EnTemplateType.ConfirmationMail, 
                    //UseriD.ToString(), walletMaster.Walletname, 0, 0, coin, walletMaster.AccWalletID, UTC_To_IST().ToString(), 
                    //walletMaster.Balance, null, null, null, 0, 0, 0, walletMaster.PublicAddress, 0, 0, null);
                    #endregion

                    string responseString = Respaddress;
                    return new CreateWalletAddressRes { address = Respaddress, ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateAddressSuccessMsg };
                    //return respObj;
                }
                else
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GenerateAddress ", "WalletService", ex);
                throw ex;
            }
        }

        public AddressMaster GetAddressObj(long walletID, long serproID, string address, string addressName, long createdBy, byte isDefaultAdd, short status)
        {
            try
            {
                AddressMaster addressMaster = new AddressMaster();
                addressMaster.Address = address;
                //Rushabh 15-01-2019 added as entity changed for storing ltc converted address,
                //now onwards the original address would be stored in Original Address column and Converted address would be store in address column,
                //every time the the user will get the converted address.
                addressMaster.OriginalAddress = address;
                // addressMaster.CoinName = coinName;
                addressMaster.AddressLable = addressName;
                addressMaster.CreatedBy = createdBy;
                addressMaster.CreatedDate = UTC_To_IST();
                addressMaster.IsDefaultAddress = isDefaultAdd;
                addressMaster.SerProID = serproID;
                addressMaster.Status = status;
                addressMaster.WalletId = walletID;
                return addressMaster;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TradeBitGoDelayAddresses GetTradeBitGoDelayAddresses(long walletID, long WalletTypeId, string TrnID, string address, string BitgoWalletId, long createdBy, string CoinSpecific, short status, byte generatebit, string coin)
        {
            try
            {
                TradeBitGoDelayAddresses addressMaster = new TradeBitGoDelayAddresses
                {
                    CoinSpecific = CoinSpecific,
                    Address = address,
                    BitgoWalletId = BitgoWalletId,
                    CoinName = coin,
                    CreatedBy = createdBy,
                    CreatedDate = UTC_To_IST(),
                    GenerateBit = generatebit,
                    Status = status,
                    TrnID = TrnID,
                    WalletId = walletID,
                    WalletTypeId = WalletTypeId
                };

                return addressMaster;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public WalletMaster GetWalletMaster(long WalletTypeId, string walletName, bool isValid, short status, long createdBy, string coinname)
        {
            try
            {
                WalletMaster addressMaster = new WalletMaster
                {
                    //CoinName = coinname,
                    CreatedBy = createdBy,
                    CreatedDate = UTC_To_IST(),
                    Status = status,
                    Balance = 0,
                    IsValid = isValid,
                    Walletname = walletName,
                    WalletTypeID = WalletTypeId
                };

                return addressMaster;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public DepositHistory GetDepositHistory(string fromAddress, string toAddress, string coinName, string trnID, long confirmations, decimal amount,
        short status, string statusMsg, string confirmedTime, string UnconfirmedTime, string epochtimePure, byte isProcessing, long serproid, long createdby)
        {
            try
            {
                DepositHistory dh = new DepositHistory
                {
                    Address = toAddress,
                    Confirmations = confirmations,
                    IsProcessing = isProcessing,
                    SerProID = serproid,
                    SMSCode = coinName,
                    TrnID = trnID,
                    CreatedBy = createdby,
                    CreatedDate = UTC_To_IST(),
                    TimeEpoch = confirmedTime,
                    EpochTimePure = epochtimePure,
                    Status = status,
                    StatusMsg = statusMsg

                };
                return dh;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 8-10-2018 get coin list from WalletTypeMaster table
        public IEnumerable<WalletTypeMaster> GetWalletTypeMaster()
        {
            try
            {
                IEnumerable<WalletTypeMaster> coin = new List<WalletTypeMaster>();
                coin = _WalletTypeMasterRepository.FindBy(item => item.Status == Convert.ToInt16(ServiceStatus.Active));

                return coin;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public string RandomGenerateAccWalletId(long userID, byte isDefaultWallet)
        {
            try
            {
                long maxValue = 9999999999;
                long minValue = 1000000000;
                long x = (long)Math.Round(random.NextDouble() * (maxValue - minValue - 1)) + minValue;
                string userIDStr = x.ToString() + userID.ToString().PadLeft(5, '0') + isDefaultWallet.ToString();
                return userIDStr;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 10-10-2018 Insert into WalletMaster table
        public async Task<CreateWalletResponse> InsertIntoWalletMaster(string Walletname, string CoinName, byte IsDefaultWallet, int[] AllowTrnType, long userId, string accessToken = null, int isBaseService = 0, long OrgId = 0, DateTime? ExpiryDate = null)
        {
            bool IsValid = true;
            decimal Balance = 0;
            string PublicAddress = "";
            WalletMaster walletMaster = new WalletMaster();
            CreateWalletResponse createWalletResponse = new CreateWalletResponse();
            try
            {
                var walletMasters = _WalletTypeMasterRepository.GetSingle(item => item.WalletTypeName == CoinName);
                if (walletMasters == null)
                {
                    createWalletResponse.ReturnCode = enResponseCode.Fail;
                    createWalletResponse.ReturnMsg = EnResponseMessage.InvalidCoin;
                    createWalletResponse.ErrorCode = enErrorCode.InvalidCoinName;
                    return createWalletResponse;
                }

                //2019-2-15 added condi for only used trading wallet
                var ISExist = _commonRepository.GetSingle(i => i.UserID == userId && i.WalletTypeID == walletMasters.Id && i.IsDefaultWallet == 1 && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (ISExist != null && IsDefaultWallet == 1)
                {
                    ISExist.IsDefaultWallet = 0;
                    _commonRepository.Update(ISExist);
                }
                //add data in walletmaster tbl
                walletMaster.Walletname = Walletname;
                walletMaster.OrgID = OrgId;
                walletMaster.ExpiryDate = (ExpiryDate == null ? UTC_To_IST().AddYears(1) : ExpiryDate);
                walletMaster.IsValid = IsValid;
                walletMaster.UserID = userId;
                walletMaster.WalletTypeID = walletMasters.Id;
                walletMaster.Balance = Balance;
                walletMaster.PublicAddress = PublicAddress;
                walletMaster.IsDefaultWallet = IsDefaultWallet;
                walletMaster.CreatedBy = userId;
                walletMaster.CreatedDate = UTC_To_IST();
                walletMaster.Status = Convert.ToInt16(ServiceStatus.Active);
                walletMaster.OrgID = 1;
                walletMaster.AccWalletID = RandomGenerateAccWalletId(userId, IsDefaultWallet);
                walletMaster = _commonRepository.Add(walletMaster);

                //add data in WalletAllowTrn tbl
                for (int i = 0; i < AllowTrnType.Length; i++)
                {
                    WalletAllowTrn w = new WalletAllowTrn();
                    w.CreatedDate = UTC_To_IST();
                    w.CreatedBy = userId;
                    w.Status = Convert.ToInt16(ServiceStatus.Active);
                    w.WalletId = walletMaster.Id;
                    w.TrnType = Convert.ToByte(AllowTrnType[i]);
                    _WalletAllowTrnRepository.Add(w);
                }


                WalletAuthorizeUserMaster obj = new WalletAuthorizeUserMaster();
                obj.RoleID = 1;
                obj.UserID = userId;
                obj.Status = 1;
                obj.CreatedBy = userId;
                obj.CreatedDate = UTC_To_IST();
                obj.UpdatedDate = UTC_To_IST();
                obj.WalletID = walletMaster.Id;
                obj.OrgID = Convert.ToInt64(walletMaster.OrgID);
                _WalletAuthorizeUserMaster.Add(obj);//add new enrty


                //genrate address and update in walletmaster
                if (isBaseService == 0)    //uday 25-10-2018 When Service is add create default wallet of org not generate the address
                {
                    var addressClass = await GenerateAddress(walletMaster.AccWalletID, CoinName, accessToken);
                    if (addressClass.address != null)
                    {
                        walletMaster.WalletPublicAddress(addressClass.address);
                    }
                    //walletMaster.PublicAddress = addressClass.address;
                    else
                    {
                        walletMaster.WalletPublicAddress("NotGenerate");
                    }
                    _commonRepository.Update(walletMaster);
                }
                //vsolanki 26-10-2018 insert and limitConfigration
                //_walletRepository1.GetSetLimitConfigurationMaster(AllowTrnType, userId, walletMaster.Id);
                createWalletResponse.AccWalletID = walletMaster.AccWalletID;
                createWalletResponse.PublicAddress = walletMaster.PublicAddress;
                createWalletResponse.Limits = _walletRepository1.GetWalletLimitResponse(walletMaster.AccWalletID);
                createWalletResponse.ReturnCode = enResponseCode.Success;
                createWalletResponse.ReturnMsg = EnResponseMessage.CreateWalletSuccessMsg;
                createWalletResponse.ErrorCode = enErrorCode.Success;

                #region MSG_Email
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.NewCreateWalletSuccessMsg);
                ActivityNotification.Param1 = walletMaster.Walletname;
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, userId.ToString(), 2),
                    () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCreate, userId.ToString(), walletMaster.Walletname),
                  () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCreate, userId.ToString(), walletMaster.Walletname, CoinName, walletMaster.AccWalletID, UTC_To_IST().ToString(), walletMaster.Balance.ToString()));

                #endregion
                return createWalletResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertIntoWalletMaster", "WalletService", ex);
                throw ex;
            }
        }

        #region OldCode

        //public BizResponseClass DebitBalance(long userID, long WalletID, decimal amount, int walletTypeID, enWalletTrnType wtrnType, enTrnType trnType, enServiceType serviceType, long trnNo, string smsCode)
        //{
        //    WalletMaster dWalletobj;
        //    string remarks = "";
        //    try
        //    {
        //        if (WalletID == 0 && (walletTypeID == 0 || userID == 0))
        //        {
        //            return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidAmount };
        //        }
        //        if (WalletID == 0)
        //        {
        //            IEnumerable<WalletMaster> walletMasters = _commonRepository.FindBy(e => e.IsValid == true && e.UserID == userID && e.WalletTypeID == walletTypeID && e.IsDefaultWallet == 1);
        //            if (walletMasters == null)
        //            {
        //                return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.DefaultWallet404, ErrorCode = enErrorCode.DefaultWalletNotFound };
        //            }
        //            List<WalletMaster> list = walletMasters.ToList();
        //            dWalletobj = list[0];
        //        }
        //        else
        //        {
        //            dWalletobj = _commonRepository.GetById(WalletID);
        //            if (dWalletobj == null)
        //            {
        //                return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWalletId };
        //            }
        //            if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
        //            {
        //                return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet };
        //            }
        //        }
        //        if (wtrnType != enWalletTrnType.Dr_Sell_Trade) // currently added code for only sell trade 
        //        {
        //            return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType };
        //        }
        //        if (amount <= 0)
        //        {
        //            return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount };
        //        }
        //        if (dWalletobj.Balance < amount)
        //        {
        //            return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficientBal, ErrorCode = enErrorCode.InsufficientBalance };
        //        }
        //        WalletAllowTrn walletAllowTrn = _WalletAllowTrnRepo.GetSingle(e => e.TrnType == (byte)trnType && e.WalletId == dWalletobj.Id && e.Status == 1);
        //        if (walletAllowTrn == null)
        //        {
        //            return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotAllowedTrnType, ErrorCode = enErrorCode.TrnTypeNotAllowed };
        //        }
        //        TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch(UTC_To_IST()));
        //        if (batchObj == null)
        //        {
        //            return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.BatchNoFailed, ErrorCode = enErrorCode.BatchNoGenerationFailed };
        //        }
        //        if (wtrnType == enWalletTrnType.Dr_Sell_Trade)
        //        {
        //            remarks = "Sell Trade [" + smsCode + "] TrnNo:" + trnNo;
        //        }
        //        else
        //        {
        //            remarks = "Debit of TrnNo:" + trnNo;
        //        }

        //        WalletLedger walletLedger = GetWalletLedger(WalletID, 0, amount, 0, wtrnType, serviceType, trnNo, remarks, dWalletobj.Balance, 1);
        //        TransactionAccount tranxAccount = GetTransactionAccount(WalletID, 1, batchObj.Id, amount, 0, trnNo, remarks, 1);
        //        dWalletobj.DebitBalance(amount);
        //        _walletRepository1.WalletDeduction(walletLedger, tranxAccount, dWalletobj);
        //        return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ErrorCode = enErrorCode.Success };

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}
        #endregion

        public WalletLedger GetWalletLedger(long WalletID, long toWalletID, decimal drAmount, decimal crAmount, enWalletTrnType trnType, enServiceType serviceType, long trnNo, string remarks, decimal currentBalance, byte status)
        {
            try
            {
                var walletLedger2 = new WalletLedger();
                walletLedger2.ServiceTypeID = serviceType;
                walletLedger2.TrnType = trnType;
                walletLedger2.CrAmt = crAmount;
                walletLedger2.CreatedBy = WalletID;
                walletLedger2.CreatedDate = UTC_To_IST();
                walletLedger2.DrAmt = drAmount;
                walletLedger2.TrnNo = trnNo;
                walletLedger2.Remarks = remarks;
                walletLedger2.Status = status;
                walletLedger2.TrnDate = UTC_To_IST();
                walletLedger2.UpdatedBy = WalletID;
                walletLedger2.WalletId = WalletID;
                walletLedger2.ToWalletId = toWalletID;
                if (drAmount > 0)
                {
                    walletLedger2.PreBal = currentBalance;
                    walletLedger2.PostBal = currentBalance - drAmount;
                }
                else
                {
                    walletLedger2.PreBal = currentBalance;
                    walletLedger2.PostBal = currentBalance + crAmount;
                }
                return walletLedger2;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TransactionAccount GetTransactionAccount(long WalletID, short isSettled, long batchNo, decimal drAmount, decimal crAmount, long trnNo, string remarks, byte status, enBalanceType BalType = enBalanceType.AvailableBalance)
        {
            try
            {
                var walletLedger2 = new TransactionAccount();
                walletLedger2.CreatedBy = WalletID;
                walletLedger2.CreatedDate = UTC_To_IST();
                walletLedger2.DrAmt = drAmount;
                walletLedger2.CrAmt = crAmount;
                walletLedger2.RefNo = trnNo;
                walletLedger2.Remarks = remarks;
                walletLedger2.Status = status;
                walletLedger2.TrnDate = UTC_To_IST();
                walletLedger2.UpdatedBy = WalletID;
                walletLedger2.WalletID = WalletID;
                walletLedger2.IsSettled = isSettled;
                walletLedger2.BatchNo = batchNo;
                walletLedger2.Type = BalType;
                return walletLedger2;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 12-10-2018 Select WalletMaster table 
        public ListWalletResponse ListWallet(long userid)
        {
            ListWalletResponse listWalletResponse = new ListWalletResponse();
            try
            {
                var walletResponse = _walletRepository1.ListWalletMasterResponse(userid);
                if (walletResponse.Count == 0)
                {
                    listWalletResponse.ReturnCode = enResponseCode.Fail;
                    listWalletResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    listWalletResponse.Wallets = walletResponse;
                    listWalletResponse.ReturnCode = enResponseCode.Success;
                    listWalletResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    listWalletResponse.ErrorCode = enErrorCode.Success;

                }
                return listWalletResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                listWalletResponse.ReturnCode = enResponseCode.InternalError;
                return listWalletResponse;
            }
        }

        //vsolanki 12-10-2018 Select WalletMaster table ByCoin
        public ListWalletResponse GetWalletByCoin(long userid, string coin)
        {
            ListWalletResponse listWalletResponse = new ListWalletResponse();
            try
            {
                var walletResponse = _walletRepository1.GetWalletMasterResponseByCoin(userid, coin);
                var UserPrefobj = _UserPreferencescommonRepository.FindBy(item => item.UserID == userid && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                if (walletResponse.Count == 0)
                {
                    listWalletResponse.ReturnCode = enResponseCode.Fail;
                    listWalletResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    if (UserPrefobj != null)
                    {
                        listWalletResponse.IsWhitelisting = UserPrefobj.IsWhitelisting;
                    }
                    else
                    {
                        listWalletResponse.IsWhitelisting = 0;
                    }
                    listWalletResponse.Wallets = walletResponse;
                    listWalletResponse.ReturnCode = enResponseCode.Success;
                    listWalletResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    listWalletResponse.ErrorCode = enErrorCode.Success;

                }
                return listWalletResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                listWalletResponse.ReturnCode = enResponseCode.InternalError;
                return listWalletResponse;
            }
        }

        //vsolanki 12-10-2018 Select WalletMaster table ByCoin
        public ListWalletResponse GetWalletById(long userid, string coin, string walletId)
        {
            ListWalletResponse listWalletResponse = new ListWalletResponse();
            try
            {
                var walletResponse = _walletRepository1.GetWalletMasterResponseById(userid, coin, walletId);
                if (walletResponse.Count == 0)
                {
                    listWalletResponse.ReturnCode = enResponseCode.Fail;
                    listWalletResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    listWalletResponse.Wallets = walletResponse;
                    listWalletResponse.ReturnCode = enResponseCode.Success;
                    listWalletResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    listWalletResponse.ErrorCode = enErrorCode.Success;
                }
                return listWalletResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                listWalletResponse.ReturnCode = enResponseCode.InternalError;
                return listWalletResponse;
            }
        }

        public WalletTransactionOrder InsertIntoWalletTransactionOrder(DateTime? UpdatedDate, DateTime TrnDate, long OWalletID, long DWalletID, decimal Amount, string WalletType, long OTrnNo, long DTrnNo, enTransactionStatus Status, string StatusMsg)
        {
            try
            {
                WalletTransactionOrder walletTransactionOrder = new WalletTransactionOrder();
                //walletTransactionOrder.OrderID = OrderID;
                walletTransactionOrder.UpdatedDate = UpdatedDate;
                walletTransactionOrder.TrnDate = TrnDate;
                walletTransactionOrder.OWalletID = OWalletID;
                walletTransactionOrder.DWalletID = DWalletID;
                walletTransactionOrder.Amount = Amount;
                walletTransactionOrder.WalletType = WalletType;
                walletTransactionOrder.OTrnNo = OTrnNo;
                walletTransactionOrder.DTrnNo = DTrnNo;
                walletTransactionOrder.Status = Status;
                walletTransactionOrder.StatusMsg = StatusMsg;
                return walletTransactionOrder;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public WalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
            long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType)
        {
            try
            {
                WalletTransactionQueue walletTransactionQueue = new WalletTransactionQueue();
                // walletTransactionQueue.TrnNo = TrnNo;
                walletTransactionQueue.Guid = Guid;
                walletTransactionQueue.TrnType = TrnType;
                walletTransactionQueue.Amount = Amount;
                walletTransactionQueue.TrnRefNo = TrnRefNo;
                walletTransactionQueue.TrnDate = TrnDate;
                walletTransactionQueue.UpdatedDate = UpdatedDate;
                walletTransactionQueue.WalletID = WalletID;
                walletTransactionQueue.WalletType = WalletType;
                walletTransactionQueue.MemberID = MemberID;
                walletTransactionQueue.TimeStamp = TimeStamp;
                walletTransactionQueue.Status = Status;
                walletTransactionQueue.StatusMsg = StatusMsg;
                walletTransactionQueue.WalletTrnType = enWalletTrnType;
                return walletTransactionQueue;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<WalletDrCrResponse> GetWalletDeductionNew(string coinName, string timestamp, enWalletTranxOrderType orderType, decimal amount, long userID, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, string Token = "")
        {
            try
            {
                WalletMaster dWalletobj;
                string remarks = "";
                WalletTypeMaster walletTypeMaster;
                WalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                long trnno = 0;
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

                //Task<int> countTask = _walletRepository1.CheckTrnRefNoAsync(TrnRefNo, orderType, trnType); //CheckTrnRefNo(TrnRefNo, orderType, trnType);
                Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
                if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty || userID == 0)
                {
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName };
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = timestamp }, "Debit");
                }
                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (orderType != enWalletTranxOrderType.Debit) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTrnType, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                dWalletobj = await dWalletobjTask;
                //Task<bool> flagTask = CheckUserBalanceAsync(dWalletobj.Id);
                bool flagTask = _walletRepository1.CheckUserBalanceV1(dWalletobj.Id);
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = timestamp }, "Debit");
                }
                if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString() + ",TimeStamp=" + timestamp);
                //CheckUserBalanceFlag = await flagTask;
                CheckUserBalanceFlag = flagTask;
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + ",TimeStamp=" + timestamp);

                dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
                // Wallet Limit Check
                //var msg = _commonWalletFunction.CheckWalletLimitAsync(enWalletLimitType.WithdrawLimit, dWalletobj.Id, amount);
                var msg = _commonWalletFunction.CheckWalletLimitAsyncV1(enWalletLimitType.WithdrawLimit, dWalletobj.Id, amount, TrnRefNo);

                if (dWalletobj.Balance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + ",TimeStamp=" + timestamp);
                //var bal = await _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount); ntrivedi 15-02-2019 removed as it is taking time in live if needed need to insert directly to db

                //Wallet Limit Validation
                var limitres = await msg;
                //if (limitres != enErrorCode.Success)
                if (limitres.ErrorCode != enErrorCode.Success)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletLimitExceed, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse
                    {
                        ReturnCode = enResponseCode.Fail,
                        //ReturnMsg = EnResponseMessage.WalletLimitExceed,
                        ReturnMsg = limitres.ReturnMsg,  //Uday 11-02-2019 Give Particular Limit Validation Message
                        //ErrorCode = limitres,
                        ErrorCode = limitres.ErrorCode,
                        TrnNo = objTQ.TrnNo,
                        Status = objTQ.Status,
                        StatusMsg = objTQ.StatusMsg,
                        MinimumAmount = limitres.MinimumAmounts,
                        MaximumAmount = limitres.MaximumAmounts,
                        TimeStamp = timestamp
                    }, "Debit");
                }
                //if (bal != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + ",TimeStamp=" + timestamp);

                //int count = await countTask;
                CheckTrnRefNoRes count1 = await countTask1;
                if (count1.TotalCount != 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + ",TimeStamp=" + timestamp);

                #region Comments
                //objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
                //objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch(UTC_To_IST()));
                //remarks = "Debit for TrnNo:" + objTQ.TrnNo;
                ////dWalletobj = _commonRepository.GetById(dWalletobj.Id);
                //WalletLedger walletLedger = GetWalletLedger(dWalletobj.Id, 0, amount, 0, trnType, serviceType, objTQ.TrnNo, remarks, dWalletobj.Balance, 1);
                //TransactionAccount tranxAccount = GetTransactionAccount(dWalletobj.Id, 1, batchObj.Id, amount, 0, objTQ.TrnNo, remarks, 1);
                ////dWalletobj.DebitBalance(amount); moved this inside function so do not overlap the object while parallet object
                //objTQ.Status = enTransactionStatus.Hold;
                //objTQ.StatusMsg = "Hold";
                //_walletRepository1.WalletDeductionwithTQ(walletLedger, tranxAccount, dWalletobj.Id, objTQ, amount);
                //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletDeductionwithTQ done TrnNo=" + TrnRefNo.ToString());

                #endregion

                BizResponseClass bizResponse = _walletSPRepositories.Callsp_DebitWallet(dWalletobj, timestamp, serviceType, amount, coinName, EnAllowedChannels.Web, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref trnno, enWalletDeductionType.Normal);
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletDeductionwithTQ sp call done TrnNo=" + TrnRefNo.ToString());

                if (bizResponse.ReturnCode != enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = trnno, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "Debit");
                }
                //2019-3-6 find chharge
                decimal charge = 0;
                string DeductWalletType = "";
                long ChargeWalletID = 0;
                try
                {
                    WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                    walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
                    walletMasterObj.Balance = dWalletobj.Balance;
                    walletMasterObj.WalletName = dWalletobj.Walletname;
                    walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
                    walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
                    walletMasterObj.CoinName = coinName;
                    walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

                    WalletMasterResponse ChargeWalletObj = new WalletMasterResponse();

                    charge = _walletRepository1.FindChargeValueDeduct(timestamp, TrnRefNo);
                    DeductWalletType = _walletRepository1.FindChargeCurrencyDeduct(TrnRefNo);
                    ChargeWalletID = _walletRepository1.FindChargeValueWalletId(timestamp, TrnRefNo);

                    HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew before", "Get walletid and currency walletid=" + ChargeWalletID.ToString() + "Currency : " + DeductWalletType.ToString() + "Charge: " + charge.ToString());

                    if (ChargeWalletID > 0 && (DeductWalletType != null || DeductWalletType != ""))
                    {
                        var ChargeWallet = _commonRepository.GetById(ChargeWalletID);
                        if (ChargeWallet != null)
                        {
                            HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew after", "Get walletid and currency walletid=" + ChargeWalletID.ToString() + "Currency : " + DeductWalletType.ToString() + "Charge: " + charge.ToString());
                            ChargeWalletObj.AccWalletID = ChargeWallet.AccWalletID;
                            ChargeWalletObj.Balance = ChargeWallet.Balance;
                            ChargeWalletObj.WalletName = ChargeWallet.Walletname;
                            ChargeWalletObj.PublicAddress = ChargeWallet.PublicAddress;
                            ChargeWalletObj.IsDefaultWallet = ChargeWallet.IsDefaultWallet;
                            ChargeWalletObj.CoinName = DeductWalletType;
                            ChargeWalletObj.OutBoundBalance = ChargeWallet.OutBoundBalance;
                        }
                    }
                    Task.Run(() => WalletDeductionNewNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, userID, Token, trnType.ToString(), walletMasterObj, charge, DeductWalletType, ChargeWalletObj));
                    //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "OnWalletBalChange + SendActivityNotificationV2 Done TrnNo=" + TrnRefNo.ToString());

                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog("GetWalletDeductionNew Charge notification", "WalletService", ex);
                }

                return GetCrDRResponse(new WalletDrCrResponse { ChargeCurrency = DeductWalletType, Charge = charge, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = trnno, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg }, "Debit");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletDeductionNew", "WalletService", ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "Debit");
            }
        }

        public WalletDrCrResponse GetWalletCreditNew(string coinName, string timestamp, enWalletTrnType trnType, decimal TotalAmount, long userID, string crAccWalletID, CreditWalletDrArryTrnID[] arryTrnID, long TrnRefNo, short isFullSettled, enWalletTranxOrderType orderType, enServiceType serviceType, enTrnType routeTrnType, string Token = "")
        {
            WalletTransactionQueue tqObj = new WalletTransactionQueue();
            WalletTransactionOrder woObj = new WalletTransactionOrder();
            try
            {
                WalletMaster cWalletobj;
                string remarks = "";
                WalletTypeMaster walletTypeMaster;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                HelperForLog.WriteLogIntoFile("GetWalletCreditNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + TotalAmount.ToString());

                if (string.IsNullOrEmpty(crAccWalletID) || coinName == string.Empty || userID == 0)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
                }
                //2019-2-18 added condi for only used trading wallet
                cWalletobj = _commonRepository.GetSingle(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == crAccWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (cWalletobj == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.UserIDWalletIDDidNotMatch }, "Credit");
                }
                if (cWalletobj.Status != 1 || cWalletobj.IsValid == false)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet }, "Credit");
                }
                if (orderType != enWalletTranxOrderType.Credit) // buy 
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType }, "Credit");
                }

                //WalletTransactionQueue
                if (TrnRefNo == 0) // buy
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo }, "Credit");
                }
                if (!CheckUserBalance(cWalletobj.Id))
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                if (TotalAmount <= 0)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                int count = CheckTrnRefNoForCredit(TrnRefNo, enWalletTranxOrderType.Debit); // check whether for this refno wallet is pre decuted or not
                if (count == 0)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist }, "Credit");
                }
                bool checkArray = CheckarryTrnID(arryTrnID, coinName);// check whether all array dtrnrefno of same wallet and they are hold (not assigned to other order)
                if (checkArray == true)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    for (int w = 0; w <= arryTrnID.Length - 1; w++)
                    {
                        woObj = InsertIntoWalletTransactionOrder(null, UTC_To_IST(), cWalletobj.Id, arryTrnID[w].dWalletId, arryTrnID[w].Amount, coinName, tqObj.TrnNo, arryTrnID[w].DrTQTrnNo, 0, "Inserted");
                        woObj = _walletRepository1.AddIntoWalletTransactionOrder(woObj, 1);
                        arryTrnID[w].OrderID = woObj.OrderID;
                    }
                }
                else if (checkArray == false)//fail
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch());
                remarks = "Credit for TrnNo:" + TrnRefNo; //tqObj.TrnNo; ntrivedi 31-01-2019 ledger entry wrong 

                WalletLedger walletLedger = GetWalletLedger(cWalletobj.Id, 0, 0, TotalAmount, trnType, serviceType, tqObj.TrnNo, remarks, cWalletobj.Balance, 1);
                TransactionAccount tranxAccount = GetTransactionAccount(cWalletobj.Id, 1, batchObj.Id, 0, TotalAmount, tqObj.TrnNo, remarks, 1);
                //cWalletobj.CreditBalance(TotalAmount);
                //var objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, 1, "Updated");
                tqObj.Status = enTransactionStatus.Success;
                tqObj.StatusMsg = "Success.";
                tqObj.UpdatedDate = UTC_To_IST();
                _walletRepository1.WalletCreditwithTQ(walletLedger, tranxAccount, cWalletobj, tqObj, arryTrnID, TotalAmount);

                try
                {
                    WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                    walletMasterObj.AccWalletID = cWalletobj.AccWalletID;
                    walletMasterObj.Balance = cWalletobj.Balance;
                    walletMasterObj.WalletName = cWalletobj.Walletname;
                    walletMasterObj.PublicAddress = cWalletobj.PublicAddress;
                    walletMasterObj.IsDefaultWallet = cWalletobj.IsDefaultWallet;
                    walletMasterObj.CoinName = coinName;
                    walletMasterObj.OutBoundBalance = cWalletobj.OutBoundBalance;
                    decimal charge = _walletRepository1.FindChargeValueDeduct(timestamp, TrnRefNo);
                    long walletId = _walletRepository1.FindChargeValueWalletId(timestamp, TrnRefNo);
                    string DeductWalletType = _walletRepository1.FindChargeCurrencyDeduct(TrnRefNo);
                    var ChargeWalletObj = _commonRepository.GetById(walletId);

                    Task.Run(() => CreditWalletNotificationSend(timestamp, walletMasterObj, coinName, TotalAmount, TrnRefNo, (byte)routeTrnType, userID, Token, trnType.ToString(), charge, ChargeWalletObj, DeductWalletType));
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "Charge noti TimeStamp:" + timestamp, this.GetType().Name, ex);
                }
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "GetWalletCreditNew");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "" }, "Credit");
            }
        }

        public int CheckTrnRefNoForCredit(long TrnRefNo, enWalletTranxOrderType TrnType)
        {
            try
            {
                var count = _walletRepository1.CheckTrnRefNoForCredit(TrnRefNo, TrnType);
                return count;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public bool CheckarryTrnID(CreditWalletDrArryTrnID[] arryTrnID, string coinName)
        {
            try
            {
                bool obj = _walletRepository1.CheckarryTrnID(arryTrnID, coinName);
                return obj;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rushabh 15-10-2018 List All Addresses Of Specified Wallet
        public Core.ViewModels.WalletOperations.ListWalletAddressResponse ListAddress(string AccWalletID)
        {
            ListWalletAddressResponse AddressResponse = new ListWalletAddressResponse();
            try
            {
                var WalletAddResponse = _walletRepository1.ListAddressMasterResponse(AccWalletID);
                //Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(22556, enWalletTranxOrderType.Debit, enWalletTrnType.Cr_Refund);
                //var temp = _walletRepository1.CheckUserBalanceV1(12);
                if (WalletAddResponse.Count == 0)
                {
                    AddressResponse.ReturnCode = enResponseCode.Fail;
                    AddressResponse.ReturnMsg = EnResponseMessage.NotFound;
                    AddressResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    AddressResponse.AddressList = WalletAddResponse;
                    AddressResponse.ReturnCode = enResponseCode.Success;
                    AddressResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    AddressResponse.ErrorCode = enErrorCode.Success;
                }
                return AddressResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                AddressResponse.ReturnCode = enResponseCode.InternalError;
                return AddressResponse;
            }
        }

        public Core.ViewModels.WalletOperations.ListWalletAddressResponse GetAddress(string AccWalletID)
        {
            ListWalletAddressResponse AddressResponse = new ListWalletAddressResponse();
            try
            {
                var WalletAddResponse = _walletRepository1.GetAddressMasterResponse(AccWalletID);
                if (WalletAddResponse.Count == 0)
                {
                    AddressResponse.ReturnCode = enResponseCode.Fail;
                    AddressResponse.ReturnMsg = EnResponseMessage.NotFound;
                    AddressResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    AddressResponse.AddressList = WalletAddResponse;
                    AddressResponse.ReturnCode = enResponseCode.Success;
                    AddressResponse.ErrorCode = enErrorCode.Success;
                    AddressResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    AddressResponse.ErrorCode = enErrorCode.Success;
                }
                return AddressResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                AddressResponse.ReturnCode = enResponseCode.InternalError;
                return AddressResponse;
            }
        }

        //16-10-2018 vsolanki 
        //RUSHABH 11-12-2018
        public WithdrawHistoryResponse DepositHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, string TrnNo, long Userid, int PageNo)
        {
            try
            {
                DateTime newTodate = ToDate.AddHours(23).AddMinutes(59).AddSeconds(59);
                WithdrawHistoryResponse response = _walletRepository1.DepositHistoy(FromDate, newTodate, Coin, TrnNo, Amount, Status, Userid, PageNo);
                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //16-10-2018 vsolanki 
        //RUSHABH 11-12-2018
        public WithdrawHistoryNewResponse WithdrawalHistoy(DateTime FromDate, DateTime ToDate, string Coin, decimal? Amount, byte? Status, long Userid, int PageNo)
        {
            try
            {
                FromDate = FromDate.AddHours(0).AddMinutes(0).AddSeconds(0);
                DateTime NewTodate = ToDate.AddHours(23);
                NewTodate = NewTodate.AddMinutes(59);
                NewTodate = NewTodate.AddSeconds(59);
                WithdrawHistoryNewResponse response = _walletRepository1.WithdrawalHistoy(FromDate, NewTodate, Coin, Amount, Status, Userid, PageNo);
                return response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<LimitResponse> SetWalletLimitConfig(string accWalletID, WalletLimitConfigurationReq request, long Userid, string Token)
        {
            int type = Convert.ToInt16(request.TrnType);
            if (type == Convert.ToInt32(enWalletLimitType.WithdrawLimit))
            {
                type = Convert.ToInt32(enWalletTrnType.Withdrawal);
            }
            else if (type == Convert.ToInt32(enWalletLimitType.DepositLimit))
            {
                type = Convert.ToInt32(enWalletTrnType.Deposit);
            }
            WalletLimitConfiguration IsExist = new WalletLimitConfiguration();
            //WalletLimitConfigurationMaster MasterConfig = new WalletLimitConfigurationMaster();
            LimitResponse Response = new LimitResponse();
            try
            {
                //var MasterConfigTask = _WalletLimitConfigurationMasterRepository.GetSingleAsync(item => item.TrnType == type);
                //var MasterConfigTask = _walletTrnLimitConfiguration.GetSingleAsync(item => item.TrnType == type);
                //2019-2-18 added condi for only used trading wallet
                var walletMasters = _commonRepository.GetSingle(item => item.AccWalletID == accWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (walletMasters == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.InvalidWallet;
                    Response.ErrorCode = enErrorCode.InvalidWalletId;
                    return Response;
                }
                var MasterConfigTask = _walletTrnLimitConfiguration.GetSingleAsync(item => item.TrnType == type && item.WalletType == walletMasters.WalletTypeID);

                var walletType = _WalletTypeMasterRepository.GetSingle(item => item.Id == walletMasters.WalletTypeID);
                IsExist = _LimitcommonRepository.GetSingle(item => item.TrnType == type && item.WalletId == walletMasters.Id);

                UserActivityLog activityLog = new UserActivityLog();
                activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.SetWalletLimit);
                activityLog.CreatedBy = Userid;
                activityLog.CreatedDate = UTC_To_IST();
                activityLog.UserID = Userid;
                activityLog.WalletID = walletMasters.Id;

                var MasterConfig = await MasterConfigTask;
                if (MasterConfig == null)
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.MasterDataNotFound;
                    Response.ErrorCode = enErrorCode.MasterDataNotFound;
                    return Response;
                }

                if (IsExist == null)
                {
                    if ((request.LimitPerDay <= MasterConfig.DailyTrnAmount) || (MasterConfig.DailyTrnAmount == 0))
                    {
                        if ((request.LimitPerHour <= MasterConfig.HourlyTrnAmount) || (MasterConfig.HourlyTrnAmount == 0))
                        {
                            if ((request.LimitPerTransaction <= MasterConfig.MaxAmount || request.LimitPerTransaction == 0) || (MasterConfig.MaxAmount == 0))
                            {
                                if ((request.LimitPerTransaction > MasterConfig.MinAmount || request.LimitPerTransaction == 0) || (MasterConfig.MinAmount == 0))
                                {
                                    WalletLimitConfiguration newobj = new WalletLimitConfiguration
                                    {
                                        WalletId = walletMasters.Id,
                                        TrnType = type,
                                        LimitPerHour = request.LimitPerHour,
                                        LimitPerDay = request.LimitPerDay,
                                        LimitPerTransaction = request.LimitPerTransaction,
                                        CreatedBy = Userid,
                                        CreatedDate = UTC_To_IST(),
                                        Status = Convert.ToInt16(ServiceStatus.Active),
                                        //obj.UpdatedDate = UTC_To_IST();
                                        StartTimeUnix = (request.StartTimeUnix == null ? 0 : request.StartTimeUnix),
                                        LifeTime = request.LifeTime,
                                        EndTimeUnix = (request.EndTimeUnix == null ? 0 : request.EndTimeUnix)
                                    };
                                    newobj = _LimitcommonRepository.Add(newobj);
                                    activityLog.Remarks = "New Limit Created For " + request.TrnType.ToString();
                                    _UserActivityLogCommonRepo.Add(activityLog);
                                    #region SMS_Email
                                    //var msg = EnResponseMessage.CWalletLimitNotification;
                                    //msg = msg.Replace("#WalletName#", walletMasters.Walletname);
                                    //_signalRService.SendActivityNotification(msg, Token);
                                    ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                                    ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CWalletLimitNotification);
                                    ActivityNotification.Param1 = walletMasters.Walletname;
                                    ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                                    HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "Before : " + Helpers.UTC_To_IST().ToString());
                                    Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Userid.ToString(), 2));
                                    HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "After : " + Helpers.UTC_To_IST().ToString());
                                    Response.ReturnMsg = EnResponseMessage.SetWalletLimitCreateMsg;
                                    Response.ReturnCode = enResponseCode.Success;
                                    Response.ErrorCode = enErrorCode.Success;


                                    DateTime dtMStart = new DateTime();
                                    DateTime dtMEnd = new DateTime();
                                    string startT = "", endT = "";
                                    if (request.StartTimeUnix != null && request.EndTimeUnix != null)
                                    {
                                        dtMStart = dtMStart.AddSeconds(Convert.ToDouble(request.StartTimeUnix)).ToLocalTime();
                                        dtMEnd = dtMEnd.AddSeconds(Convert.ToDouble(request.EndTimeUnix)).ToLocalTime();
                                        TimeSpan MStartTime = dtMStart.TimeOfDay;
                                        TimeSpan MEndTime = dtMEnd.TimeOfDay;

                                        startT = dtMStart.ToString("hh:mm tt");
                                        endT = dtMEnd.ToString("hh:mm tt");
                                    }
                                    else
                                    {
                                        startT = "N/A";
                                        endT = "N/A";
                                    }
                                    EmailSendAsyncV1(EnTemplateType.EMAIL_WalletLimitCreated, Userid.ToString(), walletType.WalletTypeName, walletMasters.Walletname, request.TrnType.ToString(), request.LimitPerHour.ToString(), request.LimitPerDay.ToString(), request.LimitPerTransaction.ToString(), request.LifeTime.ToString(), startT, endT);
                                    SMSSendAsyncV1(EnTemplateType.SMS_WalletLimitCreated, Userid.ToString(), walletMasters.Walletname);

                                    #endregion
                                }
                                else
                                {
                                    Response.ReturnCode = enResponseCode.Fail;
                                    Response.ReturnMsg = EnResponseMessage.LimitPerTransactionMinExceed;
                                    Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.MinAmount.ToString());
                                    Response.ErrorCode = enErrorCode.LimitPerTransactionMinExceed;
                                    #region
                                    ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                                    ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerTransactionMinExceed);
                                    ActivityNotificationErr.Param1 = MasterConfig.MinAmount.ToString();
                                    ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                                    Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                                    #endregion
                                }
                            }
                            else
                            {
                                Response.ReturnCode = enResponseCode.Fail;
                                Response.ReturnMsg = EnResponseMessage.LimitPerTransactionMaxExceed;
                                Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.MaxAmount.ToString());
                                Response.ErrorCode = enErrorCode.LimitPerTransactionMaxExceed;
                                #region
                                ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                                ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerTransactionMaxExceed);
                                ActivityNotificationErr.Param1 = MasterConfig.MaxAmount.ToString();
                                ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                                Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                                #endregion
                            }
                        }
                        else
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ReturnMsg = EnResponseMessage.LimitPerHourMaxExceed;
                            Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.HourlyTrnAmount.ToString());
                            Response.ErrorCode = enErrorCode.LimitPerHourMaxExceed;
                            #region
                            ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                            ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerHourMaxExceed);
                            ActivityNotificationErr.Param1 = MasterConfig.HourlyTrnAmount.ToString();
                            ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                            Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                            #endregion
                        }
                    }
                    else
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.LimitPerDayMaxExceed;
                        Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.DailyTrnAmount.ToString());
                        Response.ErrorCode = enErrorCode.LimitPerDayMaxExceed;
                        #region
                        ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                        ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerDayMaxExceed);
                        ActivityNotificationErr.Param1 = MasterConfig.DailyTrnAmount.ToString();
                        ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                        Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                        #endregion
                    }
                }
                else
                {
                    if ((request.LimitPerDay <= MasterConfig.DailyTrnAmount) || (MasterConfig.DailyTrnAmount == 0))
                    {
                        if ((request.LimitPerHour <= MasterConfig.HourlyTrnAmount) || (MasterConfig.HourlyTrnAmount == 0))
                        {
                            if ((request.LimitPerTransaction <= MasterConfig.MaxAmount || request.LimitPerTransaction == 0) || (MasterConfig.MaxAmount == 0))
                            {
                                if ((request.LimitPerTransaction > MasterConfig.MinAmount || request.LimitPerTransaction == 0) || (MasterConfig.MinAmount == 0))
                                {
                                    IsExist.LimitPerHour = request.LimitPerHour;
                                    IsExist.LimitPerDay = request.LimitPerDay;
                                    IsExist.LifeTime = request.LifeTime;
                                    IsExist.LimitPerTransaction = request.LimitPerTransaction;
                                    IsExist.StartTimeUnix = (request.StartTimeUnix == null ? 0 : request.StartTimeUnix);
                                    IsExist.EndTimeUnix = (request.EndTimeUnix == null ? 0 : request.EndTimeUnix);
                                    IsExist.UpdatedBy = Userid;
                                    IsExist.UpdatedDate = UTC_To_IST();
                                    _LimitcommonRepository.UpdateWithAuditLog(IsExist);
                                    activityLog.Remarks = "New Limit Created For " + request.TrnType.ToString();
                                    _UserActivityLogCommonRepo.Add(activityLog);


                                    Response.ReturnMsg = EnResponseMessage.SetWalletLimitUpdateMsg;
                                    Response.ReturnCode = enResponseCode.Success;
                                    Response.ErrorCode = enErrorCode.Success;
                                    #region
                                    ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                                    ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UWalletLimitNotification);
                                    ActivityNotification.Param1 = walletMasters.Walletname;
                                    ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                                    Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Userid.ToString(), 2));
                                    #endregion
                                }
                                else
                                {
                                    Response.ReturnCode = enResponseCode.Fail;
                                    Response.ReturnMsg = EnResponseMessage.LimitPerTransactionMinExceed;
                                    Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.MinAmount.ToString());
                                    Response.ErrorCode = enErrorCode.MLimitPerTransactionMinExceed;
                                    #region
                                    ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                                    ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerTransactionMinExceed);
                                    ActivityNotificationErr.Param1 = MasterConfig.MinAmount.ToString();
                                    ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                                    Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                                    #endregion
                                }
                            }
                            else
                            {
                                Response.ReturnCode = enResponseCode.Fail;
                                Response.ReturnMsg = EnResponseMessage.LimitPerTransactionMaxExceed;
                                Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.MaxAmount.ToString());
                                Response.ErrorCode = enErrorCode.MLimitPerTransactionMaxExceed;
                                #region
                                ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                                ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerTransactionMaxExceed);
                                ActivityNotificationErr.Param1 = MasterConfig.MaxAmount.ToString();
                                ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                                Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                                #endregion
                            }
                        }
                        else
                        {
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ReturnMsg = EnResponseMessage.LimitPerHourMaxExceed;
                            Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.HourlyTrnAmount.ToString());
                            Response.ErrorCode = enErrorCode.MLimitPerHourMaxExceed;
                            #region
                            ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                            ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerHourMaxExceed);
                            ActivityNotificationErr.Param1 = MasterConfig.HourlyTrnAmount.ToString();
                            ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                            Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                            #endregion
                        }
                    }
                    else
                    {
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.LimitPerDayMaxExceed;
                        Response.ReturnMsg = Response.ReturnMsg.Replace("@Limit", MasterConfig.DailyTrnAmount.ToString());
                        Response.ErrorCode = enErrorCode.MLimitPerDayMaxExceed;
                        #region
                        ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                        ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.SignalR_LimitPerDayMaxExceed);
                        ActivityNotificationErr.Param1 = MasterConfig.DailyTrnAmount.ToString();
                        ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);
                        Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                        #endregion
                    }
                }
                // if (Response.ReturnCode== enResponseCode.Success)
                // {
                //     #region
                //     //var msg = EnResponseMessage.UWalletLimitNotification;
                //     //msg = msg.Replace("#WalletName#", walletMasters.Walletname);
                //     //_signalRService.SendActivityNotification(msg, Token);
                //     ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                //     ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UWalletLimitNotification);
                //     ActivityNotification.Param1 = walletMasters.Walletname;
                //     ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                ////     HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "Before : " + Helpers.UTC_To_IST().ToString());
                //     Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Userid.ToString(), 2));
                //  //   HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "Before : " + Helpers.UTC_To_IST().ToString());
                //     #endregion
                // }
                // else
                // {
                //     #region
                //     //var msg = EnResponseMessage.UWalletLimitNotification;
                //     //msg = msg.Replace("#WalletName#", walletMasters.Walletname);
                //     //_signalRService.SendActivityNotification(msg, Token);
                //     ActivityNotificationMessage ActivityNotificationErr = new ActivityNotificationMessage();
                //     ActivityNotificationErr.MsgCode = Convert.ToInt32(enErrorCode.UWalletLimitNotificationErr);
                //     ActivityNotificationErr.Param1 = Response.ReturnMsg;
                //     ActivityNotificationErr.Type = Convert.ToInt16(EnNotificationType.Info);

                //     //HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "Before : " + Helpers.UTC_To_IST().ToString());
                //     Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotificationErr, Userid.ToString(), 2));
                //   //  HelperForLog.WriteLogIntoFile(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, "Before : " + Helpers.UTC_To_IST().ToString());
                //     #endregion
                // }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //public async Task<LimitResponse> SetWalletLimitConfig(string accWalletID, WalletLimitConfigurationReq request, long Userid, string Token)
        //{
        //    int type = Convert.ToInt16(request.TrnType);
        //    if(type== Convert.ToInt32(enWalletLimitType.WithdrawLimit))
        //    {
        //        type = Convert.ToInt32(enWalletTrnType.Withdrawal);
        //    }
        //    else if (type == Convert.ToInt32(enWalletLimitType.DepositLimit))
        //    {
        //        type = Convert.ToInt32(enWalletTrnType.Deposit);
        //    }
        //    WalletLimitConfiguration IsExist = new WalletLimitConfiguration();
        //    //WalletLimitConfigurationMaster MasterConfig = new WalletLimitConfigurationMaster();
        //    LimitResponse Response = new LimitResponse();
        //    try
        //    {
        //        //var MasterConfigTask = _WalletLimitConfigurationMasterRepository.GetSingleAsync(item => item.TrnType == type);
        //        var MasterConfigTask = _walletTrnLimitConfiguration.GetSingleAsync(item => item.TrnType == type);
        //        var walletMasters = _commonRepository.GetSingle(item => item.AccWalletID == accWalletID);

        //        if (walletMasters == null)
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.InvalidWallet;
        //            Response.ErrorCode = enErrorCode.InvalidWalletId;
        //            return Response;
        //        }
        //        var walletType = _WalletTypeMasterRepository.GetSingle(item => item.Id == walletMasters.WalletTypeID);
        //        IsExist = _LimitcommonRepository.GetSingle(item => item.TrnType == type && item.WalletId == walletMasters.Id);

        //        UserActivityLog activityLog = new UserActivityLog();
        //        activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.SetWalletLimit);
        //        activityLog.CreatedBy = Userid;
        //        activityLog.CreatedDate = UTC_To_IST();
        //        activityLog.UserID = Userid;
        //        activityLog.WalletID = walletMasters.Id;

        //        if (IsExist == null)
        //        {
        //            WalletLimitConfiguration newobj = new WalletLimitConfiguration
        //            {
        //                WalletId = walletMasters.Id,
        //                TrnType = type,
        //                LimitPerHour = request.LimitPerHour,
        //                LimitPerDay = request.LimitPerDay,
        //                LimitPerTransaction = request.LimitPerTransaction,
        //                CreatedBy = Userid,
        //                CreatedDate = UTC_To_IST(),
        //                Status = Convert.ToInt16(ServiceStatus.Active),
        //                //obj.UpdatedDate = UTC_To_IST();
        //                StartTimeUnix = (request.StartTimeUnix == null ? 0 : request.StartTimeUnix),
        //                LifeTime = request.LifeTime,
        //                EndTimeUnix = (request.EndTimeUnix == null ? 0 : request.EndTimeUnix)
        //            };
        //            newobj = _LimitcommonRepository.Add(newobj);
        //            activityLog.Remarks = "New Limit Created For " + request.TrnType.ToString();
        //            _UserActivityLogCommonRepo.Add(activityLog);
        //            #region SMS_Email
        //            //var msg = EnResponseMessage.CWalletLimitNotification;
        //            //msg = msg.Replace("#WalletName#", walletMasters.Walletname);
        //            //_signalRService.SendActivityNotification(msg, Token);
        //            ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //            ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CWalletLimitNotification);
        //            ActivityNotification.Param1 = walletMasters.Walletname;
        //            ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //            Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Userid.ToString(), 2));
        //            Response.ReturnMsg = EnResponseMessage.SetWalletLimitCreateMsg;
        //            Response.ReturnCode = enResponseCode.Success;
        //            Response.ErrorCode = enErrorCode.Success;


        //            DateTime dtMStart = new DateTime();
        //            DateTime dtMEnd = new DateTime();
        //            string startT = "", endT = "";
        //            if (request.StartTimeUnix != null && request.EndTimeUnix != null)
        //            {
        //                dtMStart = dtMStart.AddSeconds(Convert.ToDouble(request.StartTimeUnix)).ToLocalTime();
        //                dtMEnd = dtMEnd.AddSeconds(Convert.ToDouble(request.EndTimeUnix)).ToLocalTime();
        //                TimeSpan MStartTime = dtMStart.TimeOfDay;
        //                TimeSpan MEndTime = dtMEnd.TimeOfDay;

        //                startT = dtMStart.ToString("hh:mm tt");
        //                endT = dtMEnd.ToString("hh:mm tt");
        //            }
        //            else
        //            {
        //                startT = "N/A";
        //                endT = "N/A";
        //            }
        //            Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletLimitCreated, Userid.ToString(), walletType.WalletTypeName, walletMasters.Walletname, request.TrnType.ToString(), request.LimitPerHour.ToString(), request.LimitPerDay.ToString(), request.LimitPerTransaction.ToString(), request.LifeTime.ToString(), startT, endT),
        //             () => SMSSendAsyncV1(EnTemplateType.SMS_WalletLimitCreated, Userid.ToString(), walletMasters.Walletname));

        //            #endregion                 

        //        }
        //        else
        //        {
        //            var MasterConfig = await MasterConfigTask;
        //            if ((request.LimitPerDay <= MasterConfig.DailyTrnAmount) && (request.LimitPerHour <= MasterConfig.HourlyTrnAmount) && (request.LimitPerTransaction <= MasterConfig.MaxAmount))
        //            {
        //                IsExist.LimitPerHour = request.LimitPerHour;
        //                IsExist.LimitPerDay = request.LimitPerDay;
        //                IsExist.LifeTime = request.LifeTime;
        //                IsExist.LimitPerTransaction = request.LimitPerTransaction;
        //                IsExist.StartTimeUnix = (request.StartTimeUnix == null ? 0 : request.StartTimeUnix);
        //                IsExist.EndTimeUnix = (request.EndTimeUnix == null ? 0 : request.EndTimeUnix);
        //                IsExist.UpdatedBy = Userid;
        //                IsExist.UpdatedDate = UTC_To_IST();
        //                _LimitcommonRepository.UpdateWithAuditLog(IsExist);
        //                activityLog.Remarks = "New Limit Created For " + request.TrnType.ToString();
        //                _UserActivityLogCommonRepo.Add(activityLog);
        //                #region
        //                //var msg = EnResponseMessage.UWalletLimitNotification;
        //                //msg = msg.Replace("#WalletName#", walletMasters.Walletname);
        //                //_signalRService.SendActivityNotification(msg, Token);
        //                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UWalletLimitNotification);
        //                ActivityNotification.Param1 = walletMasters.Walletname;
        //                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);


        //                Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Userid.ToString(), 2));
        //                #endregion

        //                Response.ReturnMsg = EnResponseMessage.SetWalletLimitUpdateMsg;
        //                Response.ReturnCode = enResponseCode.Success;
        //                Response.ErrorCode = enErrorCode.Success;
        //            }
        //            else
        //            {
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.InvalidLimit;
        //                Response.ErrorCode = enErrorCode.InvalidLimit;
        //            }
        //        }
        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        public LimitResponse GetWalletLimitConfig(string accWalletID)
        {
            LimitResponse LimitResponse = new LimitResponse();

            try
            {
                var WalletLimitResponse = _walletRepository1.GetWalletLimitResponse(accWalletID);
                if (WalletLimitResponse.Count == 0)
                {
                    LimitResponse.ReturnCode = enResponseCode.Fail;
                    LimitResponse.ReturnMsg = EnResponseMessage.NotFound;
                    LimitResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    #region oldcode
                    //TimeSpan StartTime1, EndTime1;
                    //System.DateTime dateTime1 = new System.DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                    //DateTime istDate = TimeZoneInfo.ConvertTimeFromUtc(dateTime1, TimeZoneInfo.FindSystemTimeZoneById("India Standard Time"));
                    //var data = WalletLimitResponse.FirstOrDefault();
                    //StartTime1 = data.StartTime;
                    //WalletLimitConfigurationRes2 newRes = new WalletLimitConfigurationRes2();
                    //double stime = TimeSpan.Parse(data.StartTime).TotalSeconds;
                    //double etime = TimeSpan.Parse(data.EndTime).TotalSeconds;
                    //newRes.AccWalletID = data.AccWalletID;
                    //newRes.TrnType = data.TrnType;
                    //newRes.LimitPerDay = data.LimitPerDay;
                    //newRes.LimitPerHour = data.LimitPerHour;
                    //newRes.LimitPerTransaction = data.LimitPerTransaction;
                    //newRes.StartTime =
                    #endregion
                    LimitResponse.WalletLimitConfigurationRes = WalletLimitResponse;
                    LimitResponse.ReturnCode = enResponseCode.Success;
                    LimitResponse.ErrorCode = enErrorCode.Success;
                    LimitResponse.ReturnMsg = EnResponseMessage.FindRecored;
                }
                return LimitResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                LimitResponse.ReturnCode = enResponseCode.InternalError;
                return LimitResponse;
            }
        }

        //vsolanki 18-10-2018
        public WithdrawalRes Withdrawl(string coin, string accWalletID, WithdrawalReq Request, long userid)
        {
            WalletTransactionQueue objTQ = new WalletTransactionQueue();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var dWalletobj = _commonRepository.GetSingle(item => item.AccWalletID == accWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (dWalletobj == null)
                {
                    return new WithdrawalRes { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet };
                }
                if (dWalletobj.Balance <= Request.amount)
                {
                    return new WithdrawalRes { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficientBal, ErrorCode = enErrorCode.InsufficantBal };
                }
                return new WithdrawalRes { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, txid = 12345 /*objTQ.TrnNo*/, statusMsg = "Success" /*objTQ.StatusMsg*/ };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListBalanceResponse GetAvailableBalance(long userid, string walletId)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWalletId;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                var response = _walletRepository1.GetAvailableBalance(userid, wallet.Id);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public TotalBalanceRes GetAllAvailableBalance(long userid)
        {
            TotalBalanceRes Response = new TotalBalanceRes();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAllAvailableBalance(userid);
                decimal total = _walletRepository1.GetTotalAvailbleBal(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                Response.TotalBalance = total;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 24-10-2018
        public ListBalanceResponse GetUnSettledBalance(long userid, string walletId)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWalletId;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                var response = _walletRepository1.GetUnSettledBalance(userid, wallet.Id);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListBalanceResponse GetAllUnSettledBalance(long userid)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAllUnSettledBalance(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListBalanceResponse GetUnClearedBalance(long userid, string walletId)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWalletId;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                var response = _walletRepository1.GetUnClearedBalance(userid, wallet.Id);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListBalanceResponse GetAllUnClearedBalance(long userid)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetUnAllClearedBalance(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListStackingBalanceRes GetStackingBalance(long userid, string walletId)
        {
            ListStackingBalanceRes Response = new ListStackingBalanceRes();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWalletId;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                var response = _walletRepository1.GetStackingBalance(userid, wallet.Id);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListStackingBalanceRes GetAllStackingBalance(long userid)
        {
            ListStackingBalanceRes Response = new ListStackingBalanceRes();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAllStackingBalance(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListBalanceResponse GetShadowBalance(long userid, string walletId)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWalletId;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                var response = _walletRepository1.GetShadowBalance(userid, wallet.Id);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public ListBalanceResponse GetAllShadowBalance(long userid)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAllShadowBalance(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 24-10-2018
        public AllBalanceResponse GetAllBalances(long userid, string walletId)
        {

            AllBalanceResponse allBalanceResponse = new AllBalanceResponse();
            allBalanceResponse.BizResponseObj = new BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    allBalanceResponse.BizResponseObj.ErrorCode = enErrorCode.InvalidWallet;
                    allBalanceResponse.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    allBalanceResponse.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return allBalanceResponse;
                }
                var response = _walletRepository1.GetAllBalances(userid, wallet.Id);
                if (response == null)
                {
                    allBalanceResponse.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    allBalanceResponse.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    allBalanceResponse.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return allBalanceResponse;
                }
                allBalanceResponse.BizResponseObj.ReturnCode = enResponseCode.Success;
                allBalanceResponse.BizResponseObj.ErrorCode = enErrorCode.Success;
                allBalanceResponse.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                allBalanceResponse.Balance = response;
                //vsolanki 2018-10-27 //for withdraw limit
                var limit = _LimitcommonRepository.GetSingle(item => item.TrnType == Convert.ToInt64(enWalletTrnType.Withdrawal) && item.WalletId == wallet.Id);
                if (limit == null)
                {
                    allBalanceResponse.WithdrawalDailyLimit = 0;
                }
                else if (limit.LimitPerDay < 0) //ntrivedi 21-11-2018 if limit null then exception so add else if instead of only if
                {
                    allBalanceResponse.WithdrawalDailyLimit = 0;
                }
                else
                {
                    allBalanceResponse.WithdrawalDailyLimit = limit.LimitPerDay;

                }
                // var wallet = _commonRepository.GetById(walletId);
                var walletType = _WalletTypeMasterRepository.GetById(wallet.WalletTypeID);
                allBalanceResponse.WalletType = walletType.WalletTypeName;
                allBalanceResponse.WalletName = wallet.Walletname;
                allBalanceResponse.IsDefaultWallet = wallet.IsDefaultWallet;
                return allBalanceResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BeneficiaryResponse AddBeneficiary(string CoinName, short WhitelistingBit, string Name, string BeneficiaryAddress, long UserId, string Token)
        {
            BeneficiaryMaster IsExist = new BeneficiaryMaster();
            BeneficiaryResponse Response = new BeneficiaryResponse();
            UserActivityLog activityLog = new UserActivityLog();
            try
            {
                var userPreference = _UserPreferencescommonRepository.GetSingle(item => item.UserID == UserId);
                var walletMasters = _WalletTypeMasterRepository.GetSingle(item => item.WalletTypeName == CoinName);
                Response.BizResponse = new BizResponseClass();
                if (walletMasters == null)
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.InvalidWallet;
                    Response.BizResponse.ErrorCode = enErrorCode.InvalidWalletId;
                    return Response;
                }
                IsExist = _BeneficiarycommonRepository.GetSingle(item => item.Address == BeneficiaryAddress && item.WalletTypeID == walletMasters.Id);//&& (item.Status == Convert.ToInt16(ServiceStatus.Active) || item.Status == Convert.ToInt16(ServiceStatus.InActive))

                if (IsExist == null)
                {
                    BeneficiaryMaster AddNew = new BeneficiaryMaster();
                    if (userPreference.IsWhitelisting == 1)
                    {
                        AddNew.IsWhiteListed = 1;
                    }
                    else
                    {
                        AddNew.IsWhiteListed = 0;
                    }
                    AddNew.Status = Convert.ToInt16(ServiceStatus.Active);
                    AddNew.CreatedBy = UserId;
                    AddNew.CreatedDate = UTC_To_IST();
                    AddNew.UserID = UserId;
                    AddNew.Address = BeneficiaryAddress;
                    AddNew.Name = Name;
                    AddNew.IsWhiteListed = WhitelistingBit;
                    AddNew.WalletTypeID = walletMasters.Id;
                    AddNew = _BeneficiarycommonRepository.Add(AddNew);

                    activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.AddBeneficiary);
                    activityLog.CreatedBy = UserId;
                    activityLog.CreatedDate = UTC_To_IST();
                    activityLog.UserID = UserId;
                    activityLog.WalletID = walletMasters.Id;
                    activityLog.Remarks = "New Beneficiary Added For " + CoinName.ToString();
                    _UserActivityLogCommonRepo.Add(activityLog);

                    #region EMAIL_SMS
                    //var msg = EnResponseMessage.AddBeneNotification;
                    //msg = msg.Replace("#WalletName#", walletMasters.WalletTypeName);
                    //_signalRService.SendActivityNotification(msg, Token);
                    ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                    ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.AddBeneNotification);
                    ActivityNotification.Param1 = walletMasters.WalletTypeName;
                    ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                    Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, UserId.ToString(), 2));

                    Response.BizResponse.ReturnMsg = EnResponseMessage.RecordAdded;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                    Response.BizResponse.ReturnCode = enResponseCode.Success;

                    Parallel.Invoke(() => SMSSendAsyncV1(EnTemplateType.SMS_WalletBeneficiaryAdded, UserId.ToString(), walletMasters.WalletTypeName), () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletBeneficiaryAdded, UserId.ToString(), CoinName, Name, (WhitelistingBit == 1 ? "On" : "Off"), BeneficiaryAddress, UTC_To_IST().ToString()));
                    #endregion
                }
                else
                {
                    if (IsExist.Status == 9)
                    {
                        IsExist.UpdatedBy = UserId;
                        IsExist.UpdatedDate = UTC_To_IST();
                        IsExist.Status = Convert.ToInt16(ServiceStatus.Active);
                        IsExist.IsWhiteListed = WhitelistingBit;
                        IsExist.Name = Name;
                        _BeneficiarycommonRepository.UpdateWithAuditLog(IsExist);

                        activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.AddBeneficiary);
                        activityLog.CreatedBy = UserId;
                        activityLog.CreatedDate = UTC_To_IST();
                        activityLog.UserID = UserId;
                        activityLog.WalletID = walletMasters.Id;
                        activityLog.Remarks = "New Beneficiary Added For " + CoinName.ToString();
                        _UserActivityLogCommonRepo.Add(activityLog);

                        #region EMAIL_SMS
                        //var msg = EnResponseMessage.AddBeneNotification;
                        //msg = msg.Replace("#WalletName#", walletMasters.WalletTypeName);
                        //_signalRService.SendActivityNotification(msg, Token);
                        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.AddBeneNotification);
                        ActivityNotification.Param1 = walletMasters.WalletTypeName;
                        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                        Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, UserId.ToString(), 2));

                        Response.BizResponse.ReturnMsg = EnResponseMessage.RecordAdded;
                        Response.BizResponse.ErrorCode = enErrorCode.Success;
                        Response.BizResponse.ReturnCode = enResponseCode.Success;

                        Parallel.Invoke(() => SMSSendAsyncV1(EnTemplateType.SMS_WalletBeneficiaryAdded, UserId.ToString(), walletMasters.WalletTypeName), () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletBeneficiaryAdded, UserId.ToString(), CoinName, Name, (WhitelistingBit == 1 ? "On" : "Off"), BeneficiaryAddress, UTC_To_IST().ToString()));
                        #endregion
                    }
                    else
                    {
                        Response.BizResponse.ReturnMsg = EnResponseMessage.AlredyExist;
                        Response.BizResponse.ErrorCode = enErrorCode.AlredyExist;
                        Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    }
                }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BeneficiaryResponse1 ListWhitelistedBeneficiary(string AccWalletID, long UserId)
        {
            BeneficiaryResponse1 Response = new BeneficiaryResponse1();
            Response.BizResponse = new BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading
                var walletMasters = _commonRepository.GetSingle(item => item.AccWalletID == AccWalletID && item.UserID == UserId && item.Status == Convert.ToInt16(ServiceStatus.Active) && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (walletMasters == null)
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.InvalidWallet;
                    Response.BizResponse.ErrorCode = enErrorCode.InvalidWalletId;
                    return Response;
                }
                var BeneficiaryMasterRes = _walletRepository1.GetAllWhitelistedBeneficiaries(walletMasters.WalletTypeID, walletMasters.UserID);
                if (BeneficiaryMasterRes.Count == 0)
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.NotFound;
                    Response.BizResponse.ErrorCode = enErrorCode.NotFound;
                    return Response;
                }
                else
                {
                    Response.Beneficiaries = BeneficiaryMasterRes;
                    Response.BizResponse.ReturnCode = enResponseCode.Success;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    return Response;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BeneficiaryResponse ListBeneficiary(long UserId)
        {
            BeneficiaryResponse Response = new BeneficiaryResponse();
            Response.BizResponse = new BizResponseClass();
            try
            {
                var BeneficiaryMasterRes = _walletRepository1.GetAllBeneficiaries(UserId);
                if (BeneficiaryMasterRes.Count == 0)
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.NotFound;
                    Response.BizResponse.ErrorCode = enErrorCode.NotFound;
                    return Response;
                }
                else
                {
                    Response.Beneficiaries = BeneficiaryMasterRes;
                    Response.BizResponse.ReturnCode = enResponseCode.Success;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    return Response;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 25-10-2018
        public BalanceResponseWithLimit GetAvailbleBalTypeWise(long userid)
        {
            BalanceResponseWithLimit Response = new BalanceResponseWithLimit();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAvailbleBalTypeWise(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                decimal total = _walletRepository1.NewGetTotalAvailbleBal(userid);
                //vsolanki 26-10-2018
                var walletType = _WalletTypeMasterRepository.GetSingle(item => item.IsDefaultWallet == 1);
                if (walletType == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidCoinName;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidCoin;
                    return Response;
                }
                //2019-2-15 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.IsDefaultWallet == 1 && item.WalletTypeID == walletType.Id && item.UserID == userid && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWallet;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }

                var limit = _LimitcommonRepository.GetSingle(item => item.TrnType == Convert.ToInt32(enWalletLimitType.TradingLimit) && item.WalletId == wallet.Id);//for withdraw

                if (limit == null)
                {
                    // Response.DailyLimit = 0;
                    var masterLimit = _walletTrnLimitConfiguration.GetSingle(item => item.TrnType == Convert.ToInt32(enWalletLimitType.TradingLimit) && item.WalletType == wallet.WalletTypeID);

                    Response.DailyLimit = (masterLimit == null ? 0 : masterLimit.DailyTrnAmount);
                }
                else
                {
                    Response.DailyLimit = limit.LimitPerDay;
                }
                //get amt from  tq
                var amt = _walletRepository1.GetTodayAmountOfTQ(userid, wallet.Id);

                if (response.Count == 0)
                {
                    Response.UsedLimit = 0;
                }
                else
                {
                    Response.UsedLimit = amt;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.Response = response;
                Response.TotalBalance = total;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 25-10-2018
        public ListAllBalanceTypeWiseRes GetAllBalancesTypeWise(long userId, string WalletType)
        {
            try
            {
                ListAllBalanceTypeWiseRes res = new ListAllBalanceTypeWiseRes();

                List<AllBalanceTypeWiseRes> Response = new List<AllBalanceTypeWiseRes>();
                res.BizResponseObj = new Core.ApiModels.BizResponseClass();

                var listWallet = _walletRepository1.GetWalletMasterResponseByCoin(userId, WalletType);
                if (listWallet.Count() == 0)
                {
                    res.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    res.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    res.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    return res;
                }
                for (int i = 0; i <= listWallet.Count - 1; i++)
                {
                    AllBalanceTypeWiseRes a = new AllBalanceTypeWiseRes();
                    a.Wallet = new WalletResponse();
                    a.Wallet.Balance = new Balance();
                    //2019-2-18 added condi for only used trading wallet
                    var wallet = _commonRepository.GetSingle(item => item.AccWalletID == listWallet[i].AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                    var response = _walletRepository1.GetAllBalancesV1(userId, wallet.Id);

                    a.Wallet.AccWalletID = listWallet[i].AccWalletID;
                    a.Wallet.PublicAddress = listWallet[i].PublicAddress;
                    a.Wallet.WalletName = listWallet[i].WalletName;
                    a.Wallet.IsDefaultWallet = listWallet[i].IsDefaultWallet;
                    a.Wallet.TypeName = listWallet[i].CoinName;

                    a.Wallet.Balance = response;
                    Response.Add(a);
                }
                if (Response.Count() == 0)
                {
                    res.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    res.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    res.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    return res;
                }
                res.Wallets = Response;
                res.BizResponseObj.ReturnCode = enResponseCode.Success;
                res.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                res.BizResponseObj.ErrorCode = enErrorCode.Success;
                return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public UserPreferencesRes SetPreferences(long Userid, int GlobalBit, string Token)
        {
            UserPreferencesRes Response = new UserPreferencesRes();
            Response.BizResponse = new BizResponseClass();
            try
            {
                UserPreferencesMaster IsExist = _UserPreferencescommonRepository.GetSingle(item => item.UserID == Userid);
                if (IsExist == null)
                {
                    UserPreferencesMaster newobj = new UserPreferencesMaster();
                    UserActivityLog activityLog = new UserActivityLog();
                    newobj.UserID = Userid;
                    newobj.IsWhitelisting = Convert.ToInt16(GlobalBit);
                    newobj.CreatedBy = Userid;
                    newobj.CreatedDate = UTC_To_IST();
                    newobj.Status = Convert.ToInt16(ServiceStatus.Active);
                    newobj = _UserPreferencescommonRepository.Add(newobj);

                    //UserActivityLog activityLog = new UserActivityLog();
                    activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.AddBeneficiary);
                    activityLog.CreatedBy = Userid;
                    activityLog.CreatedDate = UTC_To_IST();
                    activityLog.UserID = Userid;
                    activityLog.Remarks = "User Preference is set to " + GlobalBit.ToString();
                    _UserActivityLogCommonRepo.Add(activityLog);


                    Response.BizResponse.ReturnCode = enResponseCode.Success;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.SetUserPrefSuccessMsg;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    IsExist.IsWhitelisting = Convert.ToInt16(GlobalBit);
                    IsExist.UpdatedBy = Userid;
                    IsExist.UpdatedDate = UTC_To_IST();
                    _UserPreferencescommonRepository.UpdateWithAuditLog(IsExist);
                    Response.BizResponse.ReturnMsg = EnResponseMessage.SetUserPrefUpdateMsg;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                }
                Response.BizResponse.ReturnCode = enResponseCode.Success;
                #region SMS_Email
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                //var msg = EnResponseMessage.UserPreferencesNotification;
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UserPreferencesNotification);
                if (GlobalBit == 1)
                {
                    ActivityNotification.Param1 = "ON";
                    //msg = msg.Replace("#ONOFF#", "ON");
                }
                else
                {
                    ActivityNotification.Param1 = "OFF";
                    //msg = msg.Replace("#ONOFF#", "OFF");
                }
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Userid.ToString(), 2), () => SMSSendAsyncV1(EnTemplateType.SMS_WhitelistingOnOff, Userid.ToString(), null, null, null, (GlobalBit == 1) ? "On" : "Off"), () => EmailSendAsyncV1(EnTemplateType.EMAIL_WhitelistingOnOff, Userid.ToString(), (GlobalBit == 1) ? "On" : "Off"));
                #endregion
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public UserPreferencesRes GetPreferences(long Userid)
        {
            UserPreferencesRes Response = new UserPreferencesRes();
            Response.BizResponse = new BizResponseClass();
            try
            {
                UserPreferencesMaster IsExist = _UserPreferencescommonRepository.GetSingle(item => item.UserID == Userid);
                if (IsExist == null)
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.NotFound;
                    Response.BizResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    Response.IsWhitelisting = IsExist.IsWhitelisting;
                    Response.UserID = IsExist.UserID;
                    Response.BizResponse.ReturnCode = enResponseCode.Success;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BeneficiaryResponse UpdateBulkBeneficiary(BulkBeneUpdateReq Request, long ID, string Token)
        {
            BeneficiaryResponse Response = new BeneficiaryResponse();
            Response.BizResponse = new BizResponseClass();
            try
            {
                string beneid = string.Join(",", Request.ID);//Request.ID.ToString();
                short WhitelistingBit = Request.WhitelistingBit;
                //bool state = _walletRepository1.BeneficiaryBulkEdit(Request);
                var state = _walletRepository1.BeneficiaryBulkEdit(beneid, WhitelistingBit);
                if (state.AffectedRows > 0)
                {
                    //var msg = EnResponseMessage.UpBeneNotification;
                    ////msg = msg.Replace("#WalletName#", walletMasters.WalletTypeName);
                    //_signalRService.SendActivityNotification(msg, Token);
                    ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                    if (Request.WhitelistingBit == 1)
                    {
                        ActivityNotification.Param1 = "Activated";
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UpdateBeneNotificationActive);
                        Response.BizResponse.ReturnMsg = EnResponseMessage.RecordUpdated;
                    }
                    else if (Request.WhitelistingBit == 9)
                    {
                        ActivityNotification.Param1 = "Deleted";
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UpdateBeneNotificationActive);
                        Response.BizResponse.ReturnMsg = EnResponseMessage.RecordDeleted;
                    }
                    else
                    {
                        ActivityNotification.Param1 = "Inactivated";
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UpdateBeneNotificationActive);
                        Response.BizResponse.ReturnMsg = EnResponseMessage.RecordDisable;
                    }
                    ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                    _signalRService.SendActivityNotificationV2(ActivityNotification, ID.ToString(), 2);

                    Response.BizResponse.ReturnCode = enResponseCode.Success;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.NotFound;
                    Response.BizResponse.ErrorCode = enErrorCode.InvalidBeneficiaryID;
                }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BeneficiaryResponse UpdateBeneficiaryDetails(BeneficiaryUpdateReq request, string AccWalletID, long UserID, string Token)
        {
            BeneficiaryResponse Response = new BeneficiaryResponse();
            BeneficiaryMaster IsExist = new BeneficiaryMaster();
            Response.BizResponse = new BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var walletMasters = _commonRepository.GetSingle(item => item.AccWalletID == AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (walletMasters == null)
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.InvalidWallet;
                    Response.BizResponse.ErrorCode = enErrorCode.InvalidWalletId;
                    return Response;
                }
                //UserActivityLog activityLog = new UserActivityLog();
                IsExist = _BeneficiarycommonRepository.GetSingle(item => item.Id == request.BenefifiaryID && item.WalletTypeID == walletMasters.WalletTypeID && item.UserID == UserID);
                var walletType = _WalletTypeMasterRepository.GetSingle(i => i.Id == walletMasters.WalletTypeID);
                if (IsExist != null)
                {
                    IsExist.Name = request.Name;
                    IsExist.Status = Convert.ToInt16(request.Status);
                    IsExist.IsWhiteListed = Convert.ToInt16(request.WhitelistingBit);
                    IsExist.UpdatedBy = UserID;
                    IsExist.UpdatedDate = UTC_To_IST();
                    _BeneficiarycommonRepository.UpdateWithAuditLog(IsExist);

                    UserActivityLog activityLog = new UserActivityLog();
                    activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.AddBeneficiary);
                    activityLog.CreatedBy = UserID;
                    activityLog.CreatedDate = UTC_To_IST();
                    activityLog.UserID = UserID;
                    activityLog.WalletID = IsExist.Id;
                    activityLog.Remarks = "Beneficiary Updated";
                    _UserActivityLogCommonRepo.Add(activityLog);

                    Response.BizResponse.ReturnMsg = EnResponseMessage.RecordUpdated;
                    Response.BizResponse.ReturnCode = enResponseCode.Success;
                    Response.BizResponse.ErrorCode = enErrorCode.Success;
                    #region SMS_Email               
                    ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                    ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.UpBeneNotification);
                    ActivityNotification.Param1 = walletMasters.Walletname;
                    ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                    Parallel.Invoke(
                        () => _signalRService.SendActivityNotificationV2(ActivityNotification, UserID.ToString(), 2),
                        () => SMSSendAsyncV1(EnTemplateType.SMS_BeneficiaryUpdated, UserID.ToString(), walletType.WalletTypeName),
                        () => EmailSendAsyncV1(EnTemplateType.EMAIL_BeneficiaryUpdated, UserID.ToString(), walletType.WalletTypeName, (request.Name), (request.WhitelistingBit == 1 ? "On" : "Off"), IsExist.Address, UTC_To_IST().ToString()));
                    #endregion

                }
                else
                {
                    Response.BizResponse.ReturnCode = enResponseCode.Fail;
                    Response.BizResponse.ReturnMsg = EnResponseMessage.NotFound;
                    Response.BizResponse.ErrorCode = enErrorCode.NotFound;
                }
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ListWalletLedgerRes GetWalletLedger(DateTime FromDate, DateTime ToDate, string WalletId, int page)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                ListWalletLedgerRes Response = new ListWalletLedgerRes();
                Response.BizResponseObj = new BizResponseClass();
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWallet;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                DateTime newToDate = ToDate.AddHours(23).AddMinutes(59).AddSeconds(59);
                FromDate = FromDate.AddHours(0).AddMinutes(0).AddSeconds(0);
                var wl = _walletRepository1.GetWalletLedger(FromDate, newToDate, wallet.Id, page);
                if (wl.Count() == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.WalletLedgers = wl;
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsoalnki 26-10-2018
        public ListWalletLedgerResv1 GetWalletLedgerV1(DateTime FromDate, DateTime ToDate, string WalletId, int page, int PageSize)
        {
            try
            {
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == WalletId);

                ListWalletLedgerResv1 Response = new ListWalletLedgerResv1();
                Response.PageNo = page;
                Response.PageSize = PageSize;
                if (wallet == null)
                {
                    Response.ErrorCode = enErrorCode.InvalidWallet;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                DateTime newToDate = ToDate.AddHours(23).AddMinutes(59).AddSeconds(59);
                FromDate = FromDate.AddHours(0).AddMinutes(0).AddSeconds(0);
                int TotalCount = 0;
                var wl = _walletRepository1.GetWalletLedgerV1(FromDate, newToDate, wallet.Id, page + 1, PageSize, ref TotalCount);
                Response.TotalCount = TotalCount;
                if (wl.Count() == 0)
                {
                    Response.ErrorCode = enErrorCode.NotFound;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.WalletLedgers = wl;
                Response.ReturnCode = enResponseCode.Success;
                Response.ReturnMsg = EnResponseMessage.FindRecored;
                Response.ErrorCode = enErrorCode.Success;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //vsolanki 27-10-2018
        public async Task<BizResponseClass> CreateDefaulWallet(long UserID, string accessToken = null)
        {
            try
            {
                var res1 = _walletRepository1.CreateDefaulWallet(UserID);
                var res = await res1;
                if (res != 1)
                {
                    return new BizResponseClass
                    {
                        ErrorCode = enErrorCode.InternalError,
                        ReturnMsg = EnResponseMessage.CreateWalletFailMsg,
                        ReturnCode = enResponseCode.Fail
                    };
                }
                AddBizUserTypeMappingReq req = new AddBizUserTypeMappingReq();
                req.UserID = UserID;
                req.UserType = enUserType.User;
                AddBizUserTypeMapping(req);

                UserActivityLog activityLog = new UserActivityLog();
                activityLog.ActivityType = Convert.ToInt16(EnUserActivityType.AddBeneficiary);
                activityLog.CreatedBy = UserID;
                activityLog.CreatedDate = UTC_To_IST();
                activityLog.UserID = UserID;
                activityLog.Remarks = "Default Wallet Creation";
                _UserActivityLogCommonRepo.Add(activityLog);

                #region EMAIL_SMS
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.DefaultCreateWalletSuccessMsg);
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                _signalRService.SendActivityNotificationV2(ActivityNotification, UserID.ToString(), 2);
                SMSSendAsyncV1(EnTemplateType.SMS_DefaultWalletCreate, UserID.ToString());
                EmailSendAsyncV1(EnTemplateType.EMAIL_DefaultWalletCreate, UserID.ToString());
                //Task.Delay(5000);
                #endregion

                return new BizResponseClass
                {
                    ErrorCode = enErrorCode.Success,
                    ReturnMsg = EnResponseMessage.CreateWalletSuccessMsg,
                    ReturnCode = enResponseCode.Success
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return new BizResponseClass
                {
                    ErrorCode = enErrorCode.InternalError,
                    ReturnMsg = EnResponseMessage.CreateWalletFailMsg,
                    ReturnCode = enResponseCode.Fail
                };
            }
        }

        //vsolanki 27-10-2018
        public BizResponseClass CreateWalletForAllUser_NewService(string WalletType)
        {
            try
            {
                var walletType = _WalletTypeMasterRepository.GetSingle(item => item.WalletTypeName == WalletType);
                if (walletType == null)
                {
                    return new BizResponseClass
                    {
                        ErrorCode = enErrorCode.InvalidCoinName,
                        ReturnMsg = EnResponseMessage.InvalidCoin,
                        ReturnCode = enResponseCode.Fail
                    };
                }
                //var wallet = _commonRepository.GetSingle(item=>item.WalletTypeID== walletType.Id && item.IsDefaultWallet==1);
                var res = _walletRepository1.CreateWalletForAllUser_NewService(WalletType);
                if (res != 1)
                {
                    return new BizResponseClass
                    {
                        ErrorCode = enErrorCode.InternalError,
                        ReturnMsg = EnResponseMessage.CreateWalletFailMsg,
                        ReturnCode = enResponseCode.InternalError
                    };
                }
                return new BizResponseClass
                {
                    ErrorCode = enErrorCode.Success,
                    ReturnMsg = EnResponseMessage.CreateWalletSuccessMsg,
                    ReturnCode = enResponseCode.Success
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 2018-10-29
        public BizResponseClass AddBizUserTypeMapping(AddBizUserTypeMappingReq req)
        {
            try
            {
                BizUserTypeMapping bizUser = new BizUserTypeMapping();
                bizUser.UserID = req.UserID;
                bizUser.UserType = Convert.ToInt16(req.UserType);
                var res = _walletRepository1.AddBizUserTypeMapping(bizUser);
                if (res == 0)
                {
                    return new BizResponseClass
                    {
                        ErrorCode = enErrorCode.DuplicateRecord,
                        ReturnMsg = EnResponseMessage.DuplicateRecord,
                        ReturnCode = enResponseCode.Fail
                    };
                }
                return new BizResponseClass
                {
                    ErrorCode = enErrorCode.Success,
                    ReturnMsg = EnResponseMessage.RecordAdded,
                    ReturnCode = enResponseCode.Success
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 2018-10-29
        public ListIncomingTrnRes GetIncomingTransaction(long Userid, string Coin)
        {
            try
            {
                ListIncomingTrnRes Response = new ListIncomingTrnRes();
                Response.BizResponseObj = new BizResponseClass();
                var depositHistories = _walletRepository1.GetIncomingTransaction(Userid, Coin);
                if (depositHistories.Count() == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.IncomingTransactions = depositHistories;
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public WalletLedger GetWalletLedgerObj(long WalletID, long toWalletID, decimal drAmount, decimal crAmount, enWalletTrnType trnType, enServiceType serviceType, long trnNo, string remarks, decimal currentBalance, byte status)
        {
            try
            {
                var walletLedger2 = new WalletLedger();
                walletLedger2.ServiceTypeID = serviceType;
                walletLedger2.TrnType = trnType;
                walletLedger2.CrAmt = crAmount;
                walletLedger2.CreatedBy = WalletID;
                walletLedger2.CreatedDate = UTC_To_IST();
                walletLedger2.DrAmt = drAmount;
                walletLedger2.TrnNo = trnNo;
                walletLedger2.Remarks = remarks;
                walletLedger2.Status = status;
                walletLedger2.TrnDate = UTC_To_IST();
                walletLedger2.UpdatedBy = WalletID;
                walletLedger2.WalletId = WalletID;
                walletLedger2.ToWalletId = toWalletID;
                if (drAmount > 0)
                {
                    walletLedger2.PreBal = currentBalance;
                    walletLedger2.PostBal = currentBalance - drAmount;
                }
                else
                {
                    walletLedger2.PreBal = currentBalance;
                    walletLedger2.PostBal = currentBalance + crAmount;
                }
                return walletLedger2;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public long GetWalletByAddress(string address)
        {
            try
            {
                var addressObj = _addressMstRepository.FindBy(e => e.Address == address).FirstOrDefault();
                if (addressObj == null)
                {
                    return 0;
                }
                else
                {
                    return addressObj.WalletId;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //vsolanki 2018-10-29
        public async Task<bool> CheckUserBalanceAsync(decimal amount, long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {

                decimal crsum, drsum;
                decimal wObjBal;//= GetUserBalance(WalletId);
                WalletMaster walletObject;
                //var TA = _TransactionAccountsRepository.FindBy(item=>item.WalletID== WalletId);

                Task<decimal> crsumTask = _TransactionAccountsRepository.GetSumAsync(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalance, f => f.CrAmt);
                Task<decimal> drsumTask = _TransactionAccountsRepository.GetSumAsync(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalance, f => f.DrAmt);
                //  Task<WalletMaster> walletObjectTask = _commonRepository.GetByIdAsync(WalletId);

                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> walletObjectTask = _commonRepository.GetSingleAsync(item => item.Id == WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                crsum = await crsumTask;
                drsum = await drsumTask;
                walletObject = await walletObjectTask;
                //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
                if (walletObject.WalletUsageType != Convert.ToInt16(enWalletUsageType))
                {
                    HelperForLog.WriteLogIntoFileAsync("CheckUserBalanceAsync", "WalletId=" + WalletId.ToString() + "WalletUsageType Mismatching :" + enWalletUsageType);
                    return false;
                }
                decimal total = crsum - drsum;
                if (enBalance == enBalanceType.AvailableBalance)
                {
                    wObjBal = walletObject.Balance;
                }
                else if (enBalance == enBalanceType.OutBoundBalance)
                {
                    wObjBal = walletObject.OutBoundBalance;
                }
                else if (enBalance == enBalanceType.InBoundBalance)
                {
                    wObjBal = walletObject.InBoundBalance;
                }
                else
                {
                    return false;
                }
                if (wObjBal < 0) //ntrivedi 04-01-2018
                {
                    return false;
                }
                if (total == wObjBal && total >= 0)
                {
                    return true;
                }
                else
                {
                    HelperForLog.WriteLogIntoFileAsync("CheckUserBalance Reload Entity", "WalletId=" + walletObject.Id.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
                    _commonRepository.ReloadEntity(walletObject);
                    if (enBalance == enBalanceType.AvailableBalance)
                    {
                        wObjBal = walletObject.Balance;
                        HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
                    }
                    else if (enBalance == enBalanceType.OutBoundBalance)
                    {
                        wObjBal = walletObject.OutBoundBalance;
                        HelperForLog.WriteLogIntoFileAsync("CheckUserBalance OutBoundBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
                    }
                    else if (enBalance == enBalanceType.InBoundBalance)
                    {
                        wObjBal = walletObject.InBoundBalance;
                        HelperForLog.WriteLogIntoFileAsync("CheckUserBalance InBoundBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
                    }
                    else
                    {
                        return false;
                    }
                    if (total == wObjBal && total >= 0)
                    {
                        return true;
                    }
                    else
                    {
                        if (Math.Abs(total - wObjBal) % amount == 0)
                        {
                            return true;
                        }
                        HelperForLog.WriteLogIntoFileAsync("CheckUserBalance failed.", "Amount: " + amount.ToString() + "  WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CheckUserBalanceAsync", "WalletService", ex);
                throw ex;
            }
        }

        public bool CheckUserBalance(long WalletId, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                //decimal wObjBal = GetUserBalance(WalletId);

                //2019-2-18 added condi for only used trading wallet
                WalletMaster walletObjectTask = _commonRepository.GetSingle(item => item.Id == WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                //var TA = _TransactionAccountsRepository.FindBy(item=>item.WalletID== WalletId);
                var crsum = _TransactionAccountsRepository.GetSum(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalanceType.AvailableBalance, f => f.CrAmt);
                var drsum = _TransactionAccountsRepository.GetSum(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalanceType.AvailableBalance, f => f.DrAmt);
                decimal total = crsum - drsum;
                //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
                if (walletObjectTask.WalletUsageType != Convert.ToInt16(enWalletUsageType))
                {
                    HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + "WalletUsageType Mismatching :" + enWalletUsageType);
                    return false;
                }
                if (walletObjectTask.Balance < 0) //ntrivedi 04-01-2018
                {
                    return false;
                }
                if (total == walletObjectTask.Balance && total >= 0)
                {
                    return true;
                }
                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + walletObjectTask.Balance.ToString());
                return false;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        //Uday 30-10-2018
        //public async Task<ServiceLimitChargeValue> GetServiceLimitChargeValue(enTrnType TrnType, string CoinName)
        //{
        //    try
        //    {
        //        ServiceLimitChargeValue response;
        //        var walletType = await _WalletTypeMasterRepository.GetSingleAsync(x => x.WalletTypeName == CoinName);
        //        if (walletType != null)
        //        {
        //            response = new ServiceLimitChargeValue();
        //            var limitData = _limitRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
        //            var chargeData = _chargeRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
        //            response.CoinName = walletType.WalletTypeName;
        //            if (limitData != null)
        //            {
        //                response.TrnType = limitData.TrnType;
        //                response.MinAmount = limitData.MinAmount;
        //                response.MaxAmount = limitData.MaxAmount;
        //                //response.ChargeType = chargeData.ChargeType;
        //                //response.ChargeValue = chargeData.ChargeValue;
        //            }
        //            else
        //            {
        //                response.TrnType = TrnType;
        //                response.MinAmount = 0;
        //                response.MaxAmount = 0;
        //            }
        //            if (chargeData != null) //ntrivedi 14-12-2018 make individual condition instead of end condition
        //            {
        //                //response.CoinName = walletType.WalletTypeName;
        //                //response.TrnType = limitData.TrnType;
        //                //response.MinAmount = limitData.MinAmount;
        //                //response.MaxAmount = limitData.MaxAmount;
        //                response.ChargeType = chargeData.ChargeType;
        //                response.ChargeValue = chargeData.ChargeValue;
        //            }
        //            else
        //            {
        //                response.ChargeType = enChargeType.Fixed;
        //                response.ChargeValue = 0;
        //            }
        //            return response;
        //        }
        //        else
        //        {
        //            return null;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetServiceLimitChargeValue", "WalletService", ex);
        //        throw ex;
        //    }
        //}

        //vsoalnki 2018-10-31

        public async Task<ServiceLimitChargeValue> GetServiceLimitChargeValue(enWalletTrnType TrnType, string CoinName)
        {
            try
            {
                ServiceLimitChargeValue response;
                WalletLimitConfiguration usrlimitObj = null;
                var walletType = await _WalletTypeMasterRepository.GetSingleAsync(x => x.WalletTypeName == CoinName);
                if (walletType != null)
                {
                    response = new ServiceLimitChargeValue();
                    //var limitData = _limitRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
                    var limitData = _walletTrnLimitConfiguration.GetSingle(x => x.TrnType == Convert.ToInt16(TrnType) && x.WalletType == walletType.Id);

                    //var wallet = _commonRepository.GetSingle(i=>i.WalletTypeID== walletType.Id && i.IsDefaultWallet==1&& i.UserID== UserId&& i.Status==1&&i.WalletUsageType==Convert.ToInt16(EnWalletUsageType.Trading_Wallet)).Id;

                    //if(wallet > 0 && wallet !=null)
                    //{
                    //    usrlimitObj = _LimitcommonRepository.GetSingle(x => x.TrnType == Convert.ToInt16(TrnType) && x.WalletId == wallet);
                    //}

                    var chargeData = _chargeRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);


                    if (chargeData != null) //ntrivedi 14-12-2018 make individual condition instead of end condition
                    {
                        //response.CoinName = walletType.WalletTypeName;
                        //response.TrnType = limitData.TrnType;
                        //response.MinAmount = limitData.MinAmount;
                        //response.MaxAmount = limitData.MaxAmount;
                        response.ChargeType = chargeData.ChargeType;
                        response.ChargeValue = chargeData.ChargeValue;
                    }
                    else
                    {
                        response.ChargeType = enChargeType.Fixed;
                        response.ChargeValue = 0;
                    }
                    response.CoinName = walletType.WalletTypeName;

                    if (limitData != null && usrlimitObj != null)
                    {
                        response.TrnType = (enWalletTrnType)limitData.TrnType;
                        response.MinAmount = limitData.MinAmount;
                        if (limitData.MaxAmount >= usrlimitObj.LimitPerTransaction && usrlimitObj.LimitPerTransaction > 0)
                        {
                            response.MaxAmount = usrlimitObj.LimitPerTransaction;
                        }
                        else
                        {
                            response.MaxAmount = limitData.MaxAmount;
                        }
                    }
                    else if (limitData != null)
                    {
                        response.TrnType = (enWalletTrnType)limitData.TrnType;
                        response.MinAmount = limitData.MinAmount;
                        response.MaxAmount = limitData.MaxAmount;
                        //response.ChargeType = chargeData.ChargeType;
                        //response.ChargeValue = chargeData.ChargeValue;
                    }
                    else
                    {
                        response.TrnType = TrnType;
                        response.MinAmount = 0;
                        response.MaxAmount = 0;
                    }
                    return response;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetServiceLimitChargeValue", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<ServiceLimitChargeValue> GetServiceLimitChargeValueV2(enWalletTrnType TrnType, string CoinName, long UserId)
        {
            try
            {
                ServiceLimitChargeValue response;
                WalletLimitConfiguration usrlimitObj = null;
                var walletType = await _WalletTypeMasterRepository.GetSingleAsync(x => x.WalletTypeName == CoinName);
                if (walletType != null)
                {
                    response = new ServiceLimitChargeValue();
                    //var limitData = _limitRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
                    var limitData = _walletTrnLimitConfiguration.GetSingle(x => x.TrnType == Convert.ToInt16(TrnType) && x.WalletType == walletType.Id);

                    var wallet = _commonRepository.GetSingle(i => i.WalletTypeID == walletType.Id && i.IsDefaultWallet == 1 && i.UserID == UserId && i.Status == 1 && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                    if (wallet != null)
                    {
                        usrlimitObj = _LimitcommonRepository.GetSingle(x => x.TrnType == Convert.ToInt16(TrnType) && x.WalletId == wallet.Id);
                    }
                    // var chargeData = _chargeRuleMaster.GetSingle(x => x.TrnType == TrnType && x.WalletType == walletType.Id);
                    var mstrchargeData = _ChargeConfigurationMaster.GetSingle(x => x.TrnType == Convert.ToInt64(TrnType) && x.WalletTypeID == walletType.Id);
                    if (mstrchargeData != null)
                    {
                        var chargeData = _ChargeConfigrationDetail.GetSingle(x => x.ChargeConfigurationMasterID == mstrchargeData.Id);
                        if (chargeData != null) //ntrivedi 14-12-2018 make individual condition instead of end condition
                        {
                            //response.CoinName = walletType.WalletTypeName;
                            //response.TrnType = limitData.TrnType;
                            //response.MinAmount = limitData.MinAmount;
                            //response.MaxAmount = limitData.MaxAmount;
                            var ChargeWallet = _commonRepository.GetSingle(i => i.WalletTypeID == chargeData.DeductionWalletTypeId && i.IsDefaultWallet == 1 && i.UserID == UserId && i.Status == 1 && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                            if (ChargeWallet != null)
                            {
                                response.ChargeWalletBalance = ChargeWallet.Balance;
                            }
                            else
                            {
                                response.ChargeWalletBalance = 0;
                            }
                            var walletTypeObj = _WalletTypeMasterRepository.GetSingle(i => i.Id == chargeData.DeductionWalletTypeId);
                            if (walletTypeObj != null)
                            {
                                response.DeductWalletTypeName = walletTypeObj.WalletTypeName;
                            }
                            else
                            {
                                response.DeductWalletTypeName = "N/A";
                            }
                            response.ChargeType = (enChargeType)chargeData.ChargeType;
                            response.ChargeValue = chargeData.ChargeValue;
                        }
                        else
                        {
                            response.ChargeType = enChargeType.Fixed;
                            response.ChargeValue = 0;
                        }
                    }
                    response.CoinName = walletType.WalletTypeName;

                    if (limitData != null && usrlimitObj != null)
                    {
                        response.TrnType = (enWalletTrnType)limitData.TrnType;
                        response.MinAmount = limitData.MinAmount;
                        if (limitData.MaxAmount >= usrlimitObj.LimitPerTransaction && usrlimitObj.LimitPerTransaction > 0)
                        {
                            response.MaxAmount = usrlimitObj.LimitPerTransaction;
                        }
                        else
                        {
                            response.MaxAmount = limitData.MaxAmount;
                        }
                    }
                    else if (limitData != null)
                    {
                        response.TrnType = (enWalletTrnType)limitData.TrnType;
                        response.MinAmount = limitData.MinAmount;
                        response.MaxAmount = limitData.MaxAmount;
                        //response.ChargeType = chargeData.ChargeType;
                        //response.ChargeValue = chargeData.ChargeValue;
                    }
                    else
                    {
                        response.TrnType = TrnType;
                        response.MinAmount = 0;
                        response.MaxAmount = 0;
                    }
                    return response;
                }
                else
                {
                    return null;
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetServiceLimitChargeValueV2", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<CreateWalletAddressRes> CreateETHAddress(string Coin, int AddressCount, long UserId, string token)
        {
            try
            {
                CreateWalletAddressRes addr = new CreateWalletAddressRes();
                var orgid = _walletRepository1.getOrgID();
                if (orgid != UserId)
                {
                    //return new CreateWalletAddressRes { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.OrgIDNotFound, ErrorCode = enErrorCode.OrgIDNotFound };
                }
                var type = _WalletTypeMasterRepository.GetSingle(t => t.WalletTypeName == Coin);
                if (type == null)
                {
                    return new CreateWalletAddressRes { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidCoin, ErrorCode = enErrorCode.InvalidCoinName };
                }
                //2019-2-18 added condi for only used trading wallet
                orgid = 588;
                var walletObj = _commonRepository.FindBy(t => t.UserID == orgid && t.IsDefaultWallet == 1 && t.WalletTypeID == type.Id && t.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)).FirstOrDefault();
                if (walletObj == null)
                {
                    return new CreateWalletAddressRes { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet };
                }
                for (int i = 1; i <= AddressCount; i++)
                {
                    addr = await GenerateAddress(walletObj.AccWalletID, Coin, token, 1);
                    //ntrivedi 07-03-2019 no need to return for eth delay address is null so this condition always true
                    //if (addr.address == null)
                    //{
                    //    return addr;
                    //}
                }
                return addr;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateETHAddress", "WalletService", ex);
                throw ex;
                //return false;
            }
        }

        //vsolanki 2018-11-02
        public ListOutgoingTrnRes GetOutGoingTransaction(long Userid, string Coin)
        {
            try
            {
                ListOutgoingTrnRes Response = new ListOutgoingTrnRes();
                Response.BizResponseObj = new BizResponseClass();
                var type = _WalletTypeMasterRepository.GetSingle(i => i.WalletTypeName == Coin);
                if (Coin != null)
                {
                    if (type == null)
                    {
                        Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                        Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidCoin;
                        Response.BizResponseObj.ErrorCode = enErrorCode.InvalidCoinName;
                        return Response;
                    }
                }
                var Histories = _walletRepository1.GetOutGoingTransaction(Userid, Coin);
                if (Histories.Count() == 0 || Histories == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.OutGoingTransactions = Histories;
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
                //return false;
            }

        }

        //vsolanki 2018-11-03
        public ListTokenConvertHistoryRes ConvertFundHistory(long Userid, DateTime FromDate, DateTime ToDate, string Coin)
        {
            try
            {
                ListTokenConvertHistoryRes Response = new ListTokenConvertHistoryRes();
                Response.BizResponseObj = new BizResponseClass();
                if (Coin != null)
                {
                    var type = _WalletTypeMasterRepository.GetSingle(i => i.WalletTypeName == Coin);
                    if (type == null)
                    {
                        Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                        Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidCoin;
                        Response.BizResponseObj.ErrorCode = enErrorCode.InvalidCoinName;
                        return Response;
                    }
                }
                DateTime newTodate = ToDate.AddHours(23).AddMinutes(59).AddSeconds(59);
                var Histories = _walletRepository1.ConvertFundHistory(Userid, FromDate, newTodate, Coin);
                if (Histories.Count() == 0 || Histories == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.HistoryRes = Histories;
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        //vsolanki 2018-11-03
        public decimal ConvertFund(decimal SourcePrice)
        {
            try
            {
                if (SourcePrice > 0)
                {
                    decimal total = (SourcePrice * 10) / 100;
                    return total;
                }
                else
                {
                    return 0;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BizResponseClass AddIntoConvertFund(ConvertTockenReq Request, long userid, string accessToken = null)
        {
            try
            {
                ConvertFundHistory h = new ConvertFundHistory();
                h.CreatedBy = userid;
                h.CreatedDate = UTC_To_IST();
                h.UpdatedBy = userid;
                h.UpdatedDate = UTC_To_IST();
                h.Status = Convert.ToInt16(ServiceStatus.InActive);
                h.SourcePrice = Request.SourcePrice;
                h.DestinationPrice = Request.DestinationPrice;
                h.FromWalletId = Request.SourceWalletId;
                h.ToWalletId = Request.DestinationWalletId;
                h.Price = 10;
                h.TrnDate = UTC_To_IST();
                _ConvertFundHistory.Add(h);
                #region EMAIL_SMS
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.ConvertFund);
                ActivityNotification.Param1 = h.SourcePrice.ToString();
                ActivityNotification.Param1 = h.DestinationPrice.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                Task.Run(() => _signalRService.SendActivityNotificationV2(ActivityNotification, userid.ToString(), 2));
                //2018-12-6 for SMS sending
                //Task.Run(() => SMSSendAsyncV1(EnTemplateType.SMS_ConvertFund, userid.ToString(), null, h.SourcePrice.ToString(), h.DestinationPrice.ToString()));
                SMSSendAsyncV1(EnTemplateType.SMS_ConvertFund, userid.ToString(), null, h.SourcePrice.ToString(), h.DestinationPrice.ToString());

                #endregion

                return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordAdded, ErrorCode = enErrorCode.Success };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public bool InsertIntoWithdrawHistory(WithdrawHistory req)
        {
            try
            {
                if (req != null)
                {
                    _WithdrawHistoryRepository.Add(req);
                    return true;
                }
                else
                {
                    return false;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                //throw ex;
                return false;
            }
        }

        public WalletDrCrResponse GetCrDRResponse(WalletDrCrResponse obj, string extras)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(extras, "WalletService", "timestamp:" + obj.TimeStamp + ",ReturnCode=" + obj.ReturnCode + ",ErrorCode=" + obj.ErrorCode + ", ReturnMsg=" + obj.ReturnMsg + ",StatusMsg=" + obj.StatusMsg + ",TrnNo=" + obj.TrnNo));
                return obj;
            }
            catch (Exception ex)
            {
                return obj;
            }
        }

        public async Task<WalletDrCrResponse> GetWalletHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                WalletMaster dWalletobj;
                string remarks = "";
                WalletTypeMaster walletTypeMaster;
                WalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

                Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
                if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty)
                {
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = timestamp };
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = timestamp }, "Debit");
                }
                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                dWalletobj = await dWalletobjTask;
                //var msg = _commonWalletFunction.CheckWalletLimitAsync(enWalletLimitType.TradingLimit, dWalletobj.Id, amount);
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = timestamp }, "Debit");
                }
                userID = dWalletobj.UserID;
                //ntrivedi 15-02-2019 removed and moved to stored procedure
                //var errorCode = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);
                //Task<bool> flagTask = CheckUserBalanceAsync(dWalletobj.Id);
                var flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }

                HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                //CheckUserBalanceFlag = await flagTask;
                CheckUserBalanceFlag = await flagTask;

                HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
                if (dWalletobj.Balance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }

                //Wallet Limit Validation
                //var limitres = await msg;
                //if (limitres != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletLimitExceed, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse
                //    {
                //        ReturnCode = enResponseCode.Fail,
                //        ReturnMsg = EnResponseMessage.WalletLimitExceed,
                //        ErrorCode = limitres,
                //        TrnNo = objTQ.TrnNo,
                //        Status = objTQ.Status,
                //        StatusMsg = objTQ.StatusMsg
                //    }, "DebitForHold");
                //}

                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                //HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                #region Commented Code
                //vsolanki 208-11-1 ntrivedi at transaction time transaction limit is checked so duplicate so remove for time 
                //var charge = GetServiceLimitChargeValue(routeTrnType, coinName);
                //if (charge.MaxAmount < amount && charge.MinAmount > amount && charge.MaxAmount != 0 && charge.MinAmount != 0)
                //{
                //    var msg1 = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg;
                //    msg1 = msg1.Replace("@MIN", charge.MinAmount.ToString());
                //    msg1 = msg1.Replace("@MAX", charge.MaxAmount.ToString());
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, msg1, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = msg1, ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax }, "Debit");
                //}


                #endregion
                //int count = await countTask;
                CheckTrnRefNoRes count1 = await countTask1;
                if (count1.TotalCount != 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                //if (count != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

                #region Commented Code
                //TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch(UTC_To_IST()));
                //remarks = "Debit for TrnNo:" + objTQ.TrnNo;
                ////dWalletobj = _commonRepository.GetById(dWalletobj.Id);
                //WalletLedger walletLedger = GetWalletLedger(dWalletobj.Id, 0, amount, 0, trnType, serviceType, objTQ.TrnNo, remarks, dWalletobj.Balance, 1);
                //TransactionAccount tranxAccount = GetTransactionAccount(dWalletobj.Id, 1, batchObj.Id, amount, 0, objTQ.TrnNo, remarks, 1);
                ////dWalletobj.DebitBalance(amount); moved this inside function so do not overlap the object while parallet object
                //objTQ.Status = enTransactionStatus.Hold;
                //objTQ.StatusMsg = "Hold";
                //_walletRepository1.WalletDeductionwithTQ(walletLedger, tranxAccount, dWalletobj.Id, objTQ, amount);
                //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletDeductionwithTQ done TrnNo=" + TrnRefNo.ToString());

                ////vsolanki 2018-11-1---------------socket method   --------------------------
                //WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                //walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
                //walletMasterObj.Balance = dWalletobj.Balance;
                //walletMasterObj.WalletName = dWalletobj.Walletname;
                //walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
                //walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
                //walletMasterObj.CoinName = coinName;

                ////Task.Run(() => _signalRService.OnWalletBalChange(walletMasterObj, coinName, Token));
                ////_signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2); //ntrivedi 21-11-2018 as per discussion with khushali send userid instead of token due to referesh token issue

                ////var msg = EnResponseMessage.DebitWalletMsgNotification;
                ////msg = msg.Replace("#Coin#", coinName);
                ////msg = msg.Replace("#TrnType#", routeTrnType.ToString());
                ////msg = msg.Replace("#TrnNo#", TrnRefNo.ToString());
                ////_signalRService.SendActivityNotification(msg, Token);
                //ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                //ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
                //ActivityNotification.Param1 = coinName;
                //ActivityNotification.Param2 = routeTrnType.ToString();
                //ActivityNotification.Param3 = TrnRefNo.ToString();
                //ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "OnWalletBalChange + SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());

                ////ntrivedi 21-11-2018 as per discussion with khushali send userid instead of token due to referesh token issue
                //Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
                //    () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2));
                //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "OnWalletBalChange + SendActivityNotificationV2 Done TrnNo=" + TrnRefNo.ToString());
                // HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());
                //_signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2);
                //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "SendActivityNotificationV2 post TrnNo=" + TrnRefNo.ToString());

                //-------------------------------

                //26-11-2018 
                //enErrorCode1 = await _commonWalletFunction.InsertUpdateShadowAsync(dWalletobj.Id, amount, "Inserted", dWalletobj.WalletTypeID);
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = "Fail", ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "Fail" }, "Fail");
                //}
                //objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
                //objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                #endregion

                BizResponseClass bizResponse = _walletSPRepositories.Callsp_HoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo, enWalletDeductionType);

                decimal charge = 0;
                WalletTypeMaster ChargewalletType = null;
                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    try
                    {
                        charge = _walletRepository1.FindChargeValueHold(timestamp, TrnRefNo);
                        long walletId = _walletRepository1.FindChargeValueWalletId(timestamp, TrnRefNo);
                        WalletMaster ChargeWalletObj = null;

                        //charge = 0;
                        if (charge > 0 && walletId > 0)
                        {
                            ChargeWalletObj = _commonRepository.GetById(walletId);
                            ChargewalletType = _WalletTypeMasterRepository.GetSingle(i => i.Id == ChargeWalletObj.WalletTypeID);
                        }
                        Task.Run(() => WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, charge, walletId, ChargeWalletObj, ChargewalletType));
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "Timestamp:" + timestamp, this.GetType().Name, ex);
                    }
                    return GetCrDRResponse(new WalletDrCrResponse { Charge = charge, ChargeCurrency = (ChargewalletType == null ? "" : ChargewalletType.WalletTypeName), ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "DebitForHold");

                }
                else
                {
                    // ntrivedi 12-02-2018 status message changed
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "DebitForHold");
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = EnResponseMessage.InternalError, TimeStamp = timestamp }, "DebitForHold");
                //throw ex;
            }
        }

        #region Old CODE
        //public async Task<WalletDrCrResponse> GetWalletCreditDrForHoldNewAsync(string coinName, string timestamp, enWalletTrnType trnType, decimal TotalAmount, long userID, string crAccWalletID, CreditWalletDrArryTrnID arryTrnID, long TrnRefNo, short isFullSettled, enWalletTranxOrderType orderType, enServiceType serviceType, enTrnType routeTrnType, string Token = "")
        //{
        //    WalletTransactionQueue tqObj = new WalletTransactionQueue();
        //    WalletTransactionOrder woObj = new WalletTransactionOrder();
        //    WalletLedger walletLedgerCr, walletLedgerDr;
        //    TransactionAccount tranxAccountCr, tranxAccountDr;
        //    bool checkDebitRefNo;
        //    try
        //    {
        //        WalletMaster cWalletobj,dWalletobj;
        //        string remarks = "";
        //        WalletTypeMaster walletTypeMaster;
        //        bool CheckUserCrBalanceFlag = false;
        //        bool CheckUserDrBalanceFlag = false;

        //        //long walletTypeID;
        //        WalletDrCrResponse resp = new WalletDrCrResponse();
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletCreditNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + TotalAmount.ToString());
        //        Task<WalletTypeMaster> walletTypeMasterTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == coinName);
        //        Task<int> refNoDebitCount = _walletRepository1.CheckTrnRefNoForCreditAsync(TrnRefNo, enWalletTranxOrderType.Debit);
        //        if (string.IsNullOrEmpty(crAccWalletID) || coinName == string.Empty || userID == 0)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
        //        }
        //        if(TotalAmount != arryTrnID.Amount)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidTrnType }, "Credit");
        //        }
        //        if (orderType != enWalletTranxOrderType.Credit) // buy 
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType }, "Credit");
        //        }
        //        if (TrnRefNo == 0) // buy
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo }, "Credit");
        //        }
        //        Task<WalletMaster> dWalletobjTask = _commonRepository.GetByIdAsync(arryTrnID.dWalletId);
        //        walletTypeMaster = await walletTypeMasterTask;
        //        if (walletTypeMaster == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
        //        }
        //        Task<WalletMaster> cWalletobjTask = _commonRepository.GetSingleAsync(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == crAccWalletID);
        //        if (TotalAmount <= 0)
        //        {
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        cWalletobj = await cWalletobjTask;

        //        if (cWalletobj == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.UserIDWalletIDDidNotMatch }, "Credit");
        //        }
        //        if (cWalletobj.Status != 1 || cWalletobj.IsValid == false)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet }, "Credit");
        //        }
        //        Task<bool> CheckUserDrBalanceFlagTask = CheckUserBalanceAsync(arryTrnID.dWalletId);
        //        dWalletobj = await dWalletobjTask;               
        //        Task<bool> CheckUserCrBalanceFlagTask = CheckUserBalanceAsync(cWalletobj.Id);
        //        //WalletTransactionQueue
        //        CheckUserCrBalanceFlag = await CheckUserCrBalanceFlagTask;
        //        if (!CheckUserCrBalanceFlag)
        //        {
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        CheckUserDrBalanceFlag = await CheckUserDrBalanceFlagTask;
        //        if (!CheckUserDrBalanceFlag)
        //        {
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        //int count = CheckTrnRefNoForCredit(TrnRefNo, enWalletTranxOrderType.Debit); // check whether for this refno wallet is pre decuted or not
        //        int count = await refNoDebitCount; // whether hold for same transaction No is count not 0
        //        if (count == 0)
        //        {
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist }, "Credit");
        //        }
        //        Task<bool> checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForHoldAsync(arryTrnID, coinName);
        //        checkDebitRefNo = await checkDebitRefNoTask;
        //        //bool checkArray = CheckarryTrnID(arryTrnID, coinName);// check whether all array dtrnrefno of same wallet and they are hold (not assigned to other order)
        //        if (checkDebitRefNo == true)
        //        {
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

        //            woObj = InsertIntoWalletTransactionOrder(null, UTC_To_IST(), cWalletobj.Id, arryTrnID.dWalletId, arryTrnID.Amount, coinName, tqObj.TrnNo, arryTrnID.DrTQTrnNo, 0, "Inserted");
        //            woObj = _walletRepository1.AddIntoWalletTransactionOrder(woObj, 1);
        //            arryTrnID.OrderID = woObj.OrderID;

        //        }
        //        else if (checkDebitRefNo == false)//fail
        //        {
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        dWalletobj = _commonRepository.GetById(arryTrnID.dWalletId); // fresh call
        //        Task<enErrorCode> enErrorCodeTask = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, TotalAmount);
        //        if (dWalletobj.Balance < TotalAmount)
        //        {
        //            // insert with status=2 system failed
        //            tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }



        //        TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch(UTC_To_IST()));
        //        remarks = "Credit for TrnNo:" + tqObj.TrnNo;

        //        //WalletLedger walletLedger = GetWalletLedger(cWalletobj.Id, 0, 0, TotalAmount, trnType, serviceType, tqObj.TrnNo, remarks, cWalletobj.Balance, 1);
        //        //TransactionAccount tranxAccount = GetTransactionAccount(cWalletobj.Id, 1, batchObj.Id, 0, TotalAmount, tqObj.TrnNo, remarks, 1);

        //        Task<WalletLedger> walletLedgerTask = GetWalletLedgerAsync(cWalletobj.Id, 0, 0, TotalAmount, trnType, serviceType, tqObj.TrnNo, remarks, cWalletobj.Balance, 1);
        //        Task<TransactionAccount> tranxAccountTask = GetTransactionAccountAsync(cWalletobj.Id, 1, batchObj.Id, 0, TotalAmount, tqObj.TrnNo, remarks, 1);

        //        Task<WalletLedger> walletLedgerTaskDr = GetWalletLedgerAsync(dWalletobj.Id, 0, TotalAmount, 0, trnType, serviceType, arryTrnID.DrTQTrnNo, remarks, dWalletobj.Balance, 1);
        //        Task<TransactionAccount> tranxAccountTaskDr = GetTransactionAccountAsync(dWalletobj.Id, 1, batchObj.Id, TotalAmount, 0, arryTrnID.DrTQTrnNo, remarks, 1);

        //        //cWalletobj.CreditBalance(TotalAmount);
        //        //var objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, 1, "Updated");
        //        tqObj.Status = enTransactionStatus.Success;
        //        tqObj.StatusMsg = "Success.";
        //        tqObj.UpdatedDate = UTC_To_IST();
        //        walletLedgerCr = await walletLedgerTask;
        //        tranxAccountCr = await tranxAccountTask;
        //       // _walletRepository1.WalletCreditwithTQ(walletLedgerCr, tranxAccountCr, cWalletobj, tqObj, arryTrnID, TotalAmount);

        //        //vsolanki 2018-11-1---------------socket method   --------------------------
        //        WalletMasterResponse walletMasterObj = new WalletMasterResponse();
        //        walletMasterObj.AccWalletID = cWalletobj.AccWalletID;
        //        walletMasterObj.Balance = cWalletobj.Balance;
        //        walletMasterObj.WalletName = cWalletobj.Walletname;
        //        walletMasterObj.PublicAddress = cWalletobj.PublicAddress;
        //        walletMasterObj.IsDefaultWallet = cWalletobj.IsDefaultWallet;
        //        walletMasterObj.CoinName = coinName;

        //        //_signalRService.OnWalletBalChange(walletMasterObj, coinName, Token);
        //        // ntrivedi 03-11-2018
        //        //var msg = EnResponseMessage.CreditWalletMsgNotification;
        //        //msg = msg.Replace("#Coin#", coinName);
        //        //msg = msg.Replace("#TrnType#", routeTrnType.ToString());
        //        //msg = msg.Replace("#TrnNo#", TrnRefNo.ToString());
        //        //Khushali 15-11-2018 send message code in message
        //        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
        //        ActivityNotification.Param1 = coinName;
        //        ActivityNotification.Param2 = routeTrnType.ToString();
        //        ActivityNotification.Param3 = TrnRefNo.ToString();
        //        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //        if (!string.IsNullOrEmpty(Token))
        //        {
        //            HelperForLog.WriteLogIntoFile("GetWalletCreditNew Activity:With Token", "WalletService", "msg=" + ActivityNotification.MsgCode.ToString() + ",Token=" + Token + "WalletID" + walletMasterObj.AccWalletID + ",Balance" + walletMasterObj.Balance.ToString());
        //            //_signalRService.SendActivityNotification(msg, Token);
        //            // _signalRService.SendActivityNotificationV2(ActivityNotification, Token);
        //            //  _signalRService.OnWalletBalChange(walletMasterObj, coinName, Token);
        //            Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, Token),
        //                () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, Token));
        //            HelperForLog.WriteLogIntoFile("GetWalletCreditNew:With Token", "WalletService", "msg=" + ActivityNotification.MsgCode.ToString() + ",Token=" + Token + "WalletID" + walletMasterObj.AccWalletID + ",Balance" + walletMasterObj.Balance.ToString());

        //        }
        //        else
        //        {
        //            HelperForLog.WriteLogIntoFile("GetWalletCreditNew Activity:Without Token", "WalletService", "msg=" + ActivityNotification.MsgCode.ToString() + ",Token=" + Token + "WalletID" + walletMasterObj.AccWalletID + ",Balance" + walletMasterObj.Balance.ToString());
        //            //_signalRService.SendActivityNotification(msg, cWalletobj.UserID.ToString(), 2);
        //            //_signalRService.SendActivityNotificationV2(ActivityNotification, cWalletobj.UserID.ToString(), 2);
        //            //_signalRService.OnWalletBalChange(walletMasterObj, coinName, cWalletobj.UserID.ToString(), 2);
        //            Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, cWalletobj.UserID.ToString(), 2),
        //               () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, cWalletobj.UserID.ToString(), 2));
        //            HelperForLog.WriteLogIntoFile("GetWalletCreditNew:Without Token", "WalletService", "msg=" + ActivityNotification.MsgCode.ToString() + ",UserID =" + cWalletobj.UserID.ToString() + "WalletID" + walletMasterObj.AccWalletID + ",Balance" + walletMasterObj.Balance.ToString());
        //        }

        //        //-------------------------------
        //        var errorCode= await _commonWalletFunction.UpdateShadowAsync(dWalletobj.Id, TotalAmount);
        //        if (errorCode != enErrorCode.Success)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = "Fail", ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "Fail" }, "Fail");
        //        }
        //        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
        //        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "GetWalletCreditNew");

        //        //tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 2);

        //        //for (int o = 0; o <= arryTrnID.Length - 1; o++)
        //        //{
        //        //    //woObj = InsertIntoWalletTransactionOrder(UTC_To_IST(), UTC_To_IST(), cWalletobj.Id, arryTrnID[0].dWalletId, arryTrnID[0].Amount, coinName, arryTrnID[0].DrTrnRefNo, tqObj.TrnNo, 1, "Updated");
        //        //    //woObj = _walletRepository1.AddIntoWalletTransactionOrder(woObj, 2);
        //        //}
        //        //return resp;

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "" }, "CreditDebitForHold");
        //        //throw ex;
        //    }
        //}
        #endregion
        public async Task<WalletLedger> GetWalletLedgerAsync(long WalletID, long toWalletID, decimal drAmount, decimal crAmount, enWalletTrnType trnType, enServiceType serviceType, long trnNo, string remarks, decimal currentBalance, byte status)
        {
            try
            {
                var walletLedger2 = new WalletLedger();
                walletLedger2.ServiceTypeID = serviceType;
                walletLedger2.TrnType = trnType;
                walletLedger2.CrAmt = crAmount;
                walletLedger2.CreatedBy = WalletID;
                walletLedger2.CreatedDate = UTC_To_IST();
                walletLedger2.DrAmt = drAmount;
                walletLedger2.TrnNo = trnNo;
                walletLedger2.Remarks = remarks;
                walletLedger2.Status = status;
                walletLedger2.TrnDate = UTC_To_IST();
                walletLedger2.UpdatedBy = WalletID;
                walletLedger2.WalletId = WalletID;
                walletLedger2.ToWalletId = toWalletID;
                if (drAmount > 0)
                {
                    walletLedger2.PreBal = currentBalance;
                    walletLedger2.PostBal = currentBalance - drAmount;
                }
                else
                {
                    walletLedger2.PreBal = currentBalance;
                    walletLedger2.PostBal = currentBalance + crAmount;
                }
                return await Task.FromResult(walletLedger2);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<TransactionAccount> GetTransactionAccountAsync(long WalletID, short isSettled, long batchNo, decimal drAmount, decimal crAmount, long trnNo, string remarks, byte status, enBalanceType BalType = enBalanceType.AvailableBalance)
        {
            try
            {
                var walletLedger2 = new TransactionAccount();
                walletLedger2.CreatedBy = WalletID;
                walletLedger2.CreatedDate = UTC_To_IST();
                walletLedger2.DrAmt = drAmount;
                walletLedger2.CrAmt = crAmount;
                walletLedger2.RefNo = trnNo;
                walletLedger2.Remarks = remarks;
                walletLedger2.Status = status;
                walletLedger2.TrnDate = UTC_To_IST();
                walletLedger2.UpdatedBy = WalletID;
                walletLedger2.WalletID = WalletID;
                walletLedger2.IsSettled = isSettled;
                walletLedger2.BatchNo = batchNo;
                walletLedger2.Type = BalType;
                return await Task.FromResult(walletLedger2);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<WalletDrCrResponse> GetWalletCreditDrForHoldNewAsyncFinal(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                WalletTransactionQueue tqObj;
                //WalletTransactionQueue firstCurrObjTQDr, secondCurrObjTQDr, tqObj;
                //WalletTransactionQueue firstCurrObjTQ, secondCurrObjTQ;
                //WalletTransactionOrder firstCurrObjTO, secondCurrObjTO;
                // TransactionAccount firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA;
                // WalletLedger firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL;
                WalletMaster firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjDrWM;
                // string remarksFirstDr, remarksFirstCr, remarksSecondDr, remarksSecondCr;
                WalletTypeMaster walletTypeFirstCurr, walletTypeSecondCurr;
                bool CheckUserCrBalanceFlag = false;
                bool CheckUserDrBalanceFlag = false;
                bool CheckUserCrBalanceFlag1 = false;
                bool CheckUserDrBalanceFlag1 = false;
                // enErrorCode enErrorCodefirst, enErrorCodeSecond;
                bool checkDebitRefNo, checkDebitRefNo1;
                //MemberShadowBalance FirstDebitShadowWallet, SecondDebitShadowWallet;
                Task<bool> checkDebitRefNoTask;
                Task<bool> checkDebitRefNoTask1;
                BizResponseClass bizResponseClassFC, bizResponseClassSC;

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal first currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + firstCurrObj.Amount + ",Coin=" + firstCurrObj.Coin + ", CR WalletID=" + firstCurrObj.creditObject.WalletId + ",Dr WalletID=" + firstCurrObj.debitObject.WalletId + " cr full settled=" + firstCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + firstCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + firstCurrObj.debitObject.isMarketTrade));
                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal second currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + secondCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + secondCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + secondCurrObj.Amount + ",Coin=" + secondCurrObj.Coin + ", CR WalletID=" + secondCurrObj.creditObject.WalletId + ",Dr WalletID=" + secondCurrObj.debitObject.WalletId + " cr full settled=" + secondCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + secondCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + secondCurrObj.debitObject.isMarketTrade));

                //secondCurrObj.debitObject.IsMaker = 1; // ntrivedi temperory 23-01-2019
                //secondCurrObj.creditObject.IsMaker = 2; // ntrivedi temperory 23-01-2019


                // check amount for both object
                // check coin name for both object
                // check refno for all 4 object
                // check walletid for all 4 object

                // call CheckTrnIDDrForHoldAsync for both debit trn object

                // check shadow balance for both debit walletid and amount
                //having sufficient balance for debit walletid both
                //wallet status for all walletid should be enable 

                //var firstCurrObjCrWMTask = _commonRepository.GetByIdAsync(firstCurrObj.creditObject.WalletId);
                //2019-2-18 added condi for only used trading wallet
                var firstCurrObjCrWMTask = _commonRepository.GetSingleAsync(item => item.Id == firstCurrObj.creditObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (firstCurrObj.debitObject.isMarketTrade == 1)
                {
                    checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForMarketAsync(firstCurrObj);
                }
                else
                {
                    checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForHoldAsync(firstCurrObj);
                }
                //2019-2-18 added condi for only used trading wallet
                var firstCurrObjDrWMTask = _commonRepository.GetSingleAsync(item => item.Id == firstCurrObj.debitObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                // to solve second operation started error solving 04-03-2019 ntrivedi await before query in same repository
                checkDebitRefNo = await checkDebitRefNoTask;
                if (checkDebitRefNo == false)//fail
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                if (secondCurrObj.debitObject.isMarketTrade == 1)
                {
                    checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForMarketAsync(secondCurrObj);
                }
                else
                {
                    checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForHoldAsync(secondCurrObj);
                }
                //2019-2-18 added condi for only used trading wallet
                var secondCurrObjCrWMTask = _commonRepository.GetSingleAsync(item => item.Id == secondCurrObj.creditObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                Task<MemberShadowBalance> FirstDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == firstCurrObj.creditObject.WalletId);
                //2019-2-18 added condi for only used trading wallet
                var secondCurrObjDrWMTask = _commonRepository.GetSingleAsync(item => item.Id == secondCurrObj.debitObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                Task<MemberShadowBalance> SecondDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == secondCurrObj.creditObject.WalletId);

                Task<bool> CheckUserCrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.creditObject.WalletId);
                Task<WalletTypeMaster> walletTypeFirstCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == firstCurrObj.Coin);
                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                CheckUserCrBalanceFlag = await CheckUserCrBalanceFlagTask;
                if (!CheckUserCrBalanceFlag)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.creditObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                Task<bool> CheckUserDrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                Task<WalletTypeMaster> walletTypeSecondCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == secondCurrObj.Coin);
                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                CheckUserDrBalanceFlag = await CheckUserDrBalanceFlagTask;
                if (!CheckUserDrBalanceFlag)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.debitObject.WalletId, firstCurrObj.Coin, firstCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //Task<bool> CheckUserCrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                //Task<bool> CheckUserCrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);

                Task<bool> CheckUserCrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.creditObject.WalletId);

                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                CheckUserCrBalanceFlag1 = await CheckUserCrBalanceFlagTask1;
                if (!CheckUserCrBalanceFlag1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.debitObject.WalletId, secondCurrObj.Coin, secondCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                Task<bool> CheckUserDrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);


                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetWalletCreditDrForHoldNewAsyncFinal before await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                if (firstCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjCrWM.Id, secondCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                if (firstCurrObjDrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, secondCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                secondCurrObjCrWM = await secondCurrObjCrWMTask;
                if (secondCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                secondCurrObj.creditObject.UserID = secondCurrObjCrWM.UserID;

                secondCurrObjDrWM = await secondCurrObjDrWMTask;
                if (secondCurrObjDrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                secondCurrObj.debitObject.UserID = secondCurrObjDrWM.UserID;

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                //checkDebitRefNo = await checkDebitRefNoTask;
                //if (checkDebitRefNo == false)//fail
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                checkDebitRefNo1 = await checkDebitRefNoTask1;
                if (checkDebitRefNo1 == false)//fail
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", secondCurrObj.creditObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }

                if (firstCurrObj.debitObject.isMarketTrade == 1 && firstCurrObj.debitObject.differenceAmount > 0)
                {
                    if (firstCurrObjDrWM.Balance < firstCurrObj.debitObject.differenceAmount)
                    {
                        // insert with status=2 system failed
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                    bizResponseClassFC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(firstCurrObjDrWM, timestamp, serviceType, firstCurrObj.debitObject.differenceAmount, firstCurrObj.Coin, allowedChannels, firstCurrObjDrWM.WalletTypeID, firstCurrObj.debitObject.WTQTrnNo, firstCurrObj.debitObject.WalletId, firstCurrObj.debitObject.UserID, enTrnType.Buy_Trade, firstCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                    if (bizResponseClassFC.ReturnCode != enResponseCode.Success)
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.FirstCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                if (secondCurrObj.debitObject.isMarketTrade == 1 && secondCurrObj.debitObject.differenceAmount > 0)
                {
                    if (secondCurrObjDrWM.Balance < secondCurrObj.debitObject.differenceAmount)
                    {
                        // insert with status=2 system failed
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                    bizResponseClassSC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(secondCurrObjDrWM, timestamp, serviceType, secondCurrObj.debitObject.differenceAmount, secondCurrObj.Coin, allowedChannels, secondCurrObjDrWM.WalletTypeID, secondCurrObj.debitObject.WTQTrnNo, secondCurrObj.debitObject.WalletId, secondCurrObj.debitObject.UserID, enTrnType.Buy_Trade, secondCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                    if (bizResponseClassSC.ReturnCode != enResponseCode.Success)
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.SecondCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                //Task<WalletTransactionQueue> firstCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(firstCurrObj.debitObject.WTQTrnNo);
                //Task<WalletTransactionQueue> secondCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(secondCurrObj.debitObject.WTQTrnNo);

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                if (firstCurrObj.Coin == string.Empty || secondCurrObj.Coin == string.Empty)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
                }
                if (firstCurrObj.Amount <= 0 || secondCurrObj.Amount <= 0) // ntrivedi amount -ve check
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmt }, "Credit");
                }
                if (firstCurrObj.creditObject.TrnRefNo == 0 || secondCurrObj.creditObject.TrnRefNo == 0)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNoCr, ErrorCode = enErrorCode.InvalidTradeRefNoCr }, "Credit");
                }
                if (firstCurrObj.debitObject.TrnRefNo == 0 || secondCurrObj.debitObject.TrnRefNo == 0)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNoDr, ErrorCode = enErrorCode.InvalidTradeRefNoDr }, "Debit");
                }
                walletTypeFirstCurr = await walletTypeFirstCurrTask;
                walletTypeSecondCurr = await walletTypeSecondCurrTask;

                if (walletTypeFirstCurr == null || walletTypeSecondCurr == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
                }

                //bool flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.creditObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.debitObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.creditObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.debitObject.WalletId);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetWalletCreditDrForHoldNewAsyncFinal before await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                //Task<enErrorCode> enErrorCodeTaskfirst = _commonWalletFunction.CheckShadowLimitAsync(firstCurrObjDrWM.Id, firstCurrObj.Amount);
                //enErrorCodefirst = await enErrorCodeTaskfirst;
                //if (enErrorCodefirst != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                if (firstCurrObjDrWM.OutBoundBalance < firstCurrObj.Amount) // ntrivedi checking outbound balance
                {
                    // insert with status=2 system failed
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutgoingBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                //Task<enErrorCode> enErrorCodeTaskSecond = _commonWalletFunction.CheckShadowLimitAsync(secondCurrObjDrWM.Id, secondCurrObj.Amount);
                //enErrorCodeSecond = await enErrorCodeTaskSecond;
                //if (enErrorCodeSecond != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}

                if (secondCurrObjDrWM.OutBoundBalance < secondCurrObj.Amount)// ntrivedi checking outbound balance
                {
                    // insert with status=2 system failed
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficietOutgoingBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                if (firstCurrObjDrWM.Status != 1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                if (secondCurrObjDrWM.Status != 1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }


                CheckUserDrBalanceFlag1 = await CheckUserDrBalanceFlagTask1;
                if (!CheckUserDrBalanceFlag1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.creditObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWalletSecDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));



                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                //bool flag = await _walletRepository1.WalletCreditDebitwithTQTestFinal(firstCurrObjTQ, secondCurrObjTQ, secondCurrObjTO, firstCurrObjTO, FirstDebitShadowWallet, SecondDebitShadowWallet, firstCurrObjTQDr, secondCurrObjTQDr, firstCurrObj, secondCurrObj, firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL, firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA);
                BizResponseClass bizResponse = _walletSPRepositories.Callsp_CrDrWalletForHold(firstCurrObj, secondCurrObj, timestamp, serviceType, walletTypeFirstCurr.Id, walletTypeSecondCurr.Id, (long)allowedChannels);

                _walletRepository1.ReloadEntity(firstCurrObjCrWM, secondCurrObjCrWM, firstCurrObjDrWM, secondCurrObjDrWM);

                if (bizResponse.ReturnCode != enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = 0, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Credit");
                }
                decimal ChargefirstCur = 0, ChargesecondCur = 0;
                //ntrivedi added for try catch 05-03-2019
                try
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before WaitAll", "WalletService", "timestamp:" + timestamp));
                    Task.WaitAll();
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after WaitAll", "WalletService", "timestamp:" + timestamp));
                    ChargefirstCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.creditObject.TrnRefNo);
                    ChargesecondCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.debitObject.TrnRefNo);
                    secondCurrObj.debitObject.Charge = ChargesecondCur;
                    firstCurrObj.debitObject.Charge = ChargefirstCur;
                }
                catch (Exception ex1)
                {
                    HelperForLog.WriteErrorLog("GetWalletCreditDrForHoldNewAsyncFinal charge exception  Timestamp" + timestamp, this.GetType().Name, ex1);
                }

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                Task.Run(() => CreditDebitNotificationSend(timestamp, firstCurrObj, secondCurrObj, firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjCrWM, ChargefirstCur, ChargesecondCur));

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal:Without Token done", "WalletService", ",timestamp =" + timestamp));
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletCreditDrForHoldNewAsyncFinal Timestamp" + timestamp, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
                //throw ex;
            }
        }

        public async Task<WalletTransactionQueue> InsertIntoWalletTransactionQueueAsync(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
          long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType)
        {
            try
            {
                WalletTransactionQueue walletTransactionQueue = new WalletTransactionQueue();
                await Task.Run(() =>
                {
                    // walletTransactionQueue.TrnNo = TrnNo;
                    walletTransactionQueue.Guid = Guid;
                    walletTransactionQueue.TrnType = TrnType;
                    walletTransactionQueue.Amount = Amount;
                    walletTransactionQueue.TrnRefNo = TrnRefNo;
                    walletTransactionQueue.TrnDate = TrnDate;
                    walletTransactionQueue.UpdatedDate = UpdatedDate;
                    walletTransactionQueue.WalletID = WalletID;
                    walletTransactionQueue.WalletType = WalletType;
                    walletTransactionQueue.MemberID = MemberID;
                    walletTransactionQueue.TimeStamp = TimeStamp;
                    walletTransactionQueue.Status = Status;
                    walletTransactionQueue.StatusMsg = StatusMsg;
                    walletTransactionQueue.WalletTrnType = enWalletTrnType;
                });
                return walletTransactionQueue;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertIntoWalletTransactionQueueAsync", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<WalletTransactionOrder> InsertIntoWalletTransactionOrderAsync(DateTime? UpdatedDate, DateTime TrnDate, long OWalletID, long DWalletID, decimal Amount, string WalletType, long OTrnNo, long DTrnNo, enTransactionStatus Status, string StatusMsg)
        {
            try
            {
                WalletTransactionOrder walletTransactionOrder = new WalletTransactionOrder();
                await Task.Run(() =>
                {
                    walletTransactionOrder = new WalletTransactionOrder();
                    //walletTransactionOrder.OrderID = OrderID;
                    walletTransactionOrder.UpdatedDate = UpdatedDate;
                    walletTransactionOrder.TrnDate = TrnDate;
                    walletTransactionOrder.OWalletID = OWalletID;
                    walletTransactionOrder.DWalletID = DWalletID;
                    walletTransactionOrder.Amount = Amount;
                    walletTransactionOrder.WalletType = WalletType;
                    walletTransactionOrder.OTrnNo = OTrnNo;
                    walletTransactionOrder.DTrnNo = DTrnNo;
                    walletTransactionOrder.Status = Status;
                    walletTransactionOrder.StatusMsg = StatusMsg;
                });
                return await Task.FromResult(walletTransactionOrder);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertIntoWalletTransactionOrderAsync", "WalletService", ex);
                throw ex;
            }
        }
        //2018-12-6
        public async Task SMSSendAsyncV1(EnTemplateType templateType, string UserID, string WalletName = null, string SourcePrice = null, string DestinationPrice = null, string ONOFF = null, string Coin = null, string TrnType = null, string TrnNo = null)
        {
            try
            {
                //HelperForLog.WriteLogIntoFile("WalletService", "0 SMSSendAsyncV1", " -Data- " + templateType.ToString());
                CommunicationParamater communicationParamater = new CommunicationParamater();
                ApplicationUser User = new ApplicationUser();
                User = await _userManager.FindByIdAsync(UserID);
                //HelperForLog.WriteLogIntoFile("WalletService", "0 SMSSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
                //User.Mobile = ""; //for testing
                if (!string.IsNullOrEmpty(UserID))
                {
                    if (!string.IsNullOrEmpty(User.Mobile) && Convert.ToInt16(templateType) != 0)
                    {
                        if (!string.IsNullOrEmpty(WalletName))
                        {
                            communicationParamater.Param1 = WalletName;  //1.WalletName for CreateWallet and address 2.WalletType for Beneficiary method                                               
                        }
                        if (!string.IsNullOrEmpty(SourcePrice) && !string.IsNullOrEmpty(DestinationPrice))
                        {
                            communicationParamater.Param1 = SourcePrice;
                            communicationParamater.Param2 = DestinationPrice;
                        }
                        if (!string.IsNullOrEmpty(ONOFF))// for whitelisted bit
                        {
                            communicationParamater.Param1 = ONOFF;
                        }
                        if (!string.IsNullOrEmpty(Coin) && !string.IsNullOrEmpty(TrnType) && !string.IsNullOrEmpty(TrnNo))//for credit or debit
                        {
                            communicationParamater.Param1 = Coin;
                            communicationParamater.Param2 = TrnType;
                            communicationParamater.Param3 = TrnNo;
                        }

                        var SmsData = _messageService.ReplaceTemplateMasterData(templateType, communicationParamater, enCommunicationServiceType.SMS).Result;
                        if (SmsData != null)
                        {
                            if (SmsData.IsOnOff == 1)
                            {
                                //SmsData.Content
                                SendSMSRequest Request = new SendSMSRequest();
                                Request.Message = SmsData.Content;
                                Request.MobileNo = Convert.ToInt64(User.Mobile);
                                //HelperForLog.WriteLogIntoFile("WalletService", "0 SMSSendAsyncV1", " -Data- " + SmsData.Content);
                                _pushSMSQueue.Enqueue(Request);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("SMSSendAsyncV1" + " - Data- " + templateType.ToString(), "WalletService", ex);
            }
        }

        //2018-12-6
        public async Task EmailSendAsyncV1(EnTemplateType templateType, string UserID, string Param1 = "", string Param2 = "", string Param3 = "", string Param4 = "", string Param5 = "", string Param6 = "", string Param7 = "", string Param8 = "", string Param9 = "")
        {
            try
            {
                //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + templateType.ToString() + "Parameters" + Param1 + Param2 + Param3 + Param4 + Param5 + Param6 + Param7 + Param8 + Param9);
                CommunicationParamater communicationParamater = new CommunicationParamater();
                SendEmailRequest Request = new SendEmailRequest();
                ApplicationUser User = new ApplicationUser();
                User = await _userManager.FindByIdAsync(UserID);
                //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
                if (!string.IsNullOrEmpty(UserID))
                {
                    if (!string.IsNullOrEmpty(User.Email) && Convert.ToInt16(templateType) != 0)
                    {
                        communicationParamater.Param1 = User.UserName;
                        if (!string.IsNullOrEmpty(Param1))
                        {
                            communicationParamater.Param2 = Param1;
                            communicationParamater.Param3 = Param2;
                            communicationParamater.Param4 = Param3;
                            communicationParamater.Param5 = Param4;
                            communicationParamater.Param6 = Param5;
                            communicationParamater.Param7 = Param6;
                            communicationParamater.Param8 = Param7;
                            communicationParamater.Param9 = Param8;
                            communicationParamater.Param10 = Param9;
                        }
                        //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + "Parameters" + Param1 + Param2 + Param3 + Param4 + Param5 + Param6 + Param7 + Param8 + Param9);
                        var EmailData = _messageService.ReplaceTemplateMasterData(templateType, communicationParamater, enCommunicationServiceType.Email).Result;
                        //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
                        if (EmailData != null)
                        {
                            Request.Body = EmailData.Content;
                            Request.Subject = EmailData.AdditionalInfo;
                            Request.EmailType = Convert.ToInt16(EnEmailType.Template);
                            //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
                            Request.Recepient = User.Email;
                            //HelperForLog.WriteLogForSocket("WalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData);
                            _pushNotificationsQueue.Enqueue(Request);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " -Data- " + templateType.ToString(), "WalletService", ex);
            }
        }

        public async Task<WalletDrCrResponse> GetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "")
        {
            try
            {
                WalletMaster dWalletobj;
                string remarks = "";
                WalletTypeMaster walletTypeMaster;
                WalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit; //ntrivedi release is credit process (reverse hold)
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

                //Task<int> countTask = _walletRepository1.CheckTrnRefNoAsync(TrnRefNo, orderType, trnType); //CheckTrnRefNo(TrnRefNo, orderType, trnType);
                if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }

                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                dWalletobj = await dWalletobjTask;
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                userID = dWalletobj.UserID;
                //var errorCode = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);
                Task<bool> flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                //Task<bool> flagTask1 = CheckUserBalanceAsync(dWalletobj.Id, enBalanceType.OutBoundBalance);

                if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }

                HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString());
                CheckUserBalanceFlag = await flagTask;

                HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString());
                dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 

                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                Task<bool> flagTask1 = CheckUserBalanceAsync(amount, dWalletobj.Id, enBalanceType.OutBoundBalance);
                CheckUserBalanceFlag = await flagTask1;
                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedOutgoingBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString());
                //ntrivedi no need to check shadow limit at cancellation 23-02-2019
                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString());

                //int count = await countTask;
                //if (count != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                if (dWalletobj.OutBoundBalance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutboundBalance, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
                HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString());

                BizResponseClass bizResponse = _walletSPRepositories.Callsp_ReleaseHoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo);

                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    try
                    {
                        WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                        walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
                        walletMasterObj.Balance = dWalletobj.Balance;
                        walletMasterObj.WalletName = dWalletobj.Walletname;
                        walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
                        walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
                        walletMasterObj.CoinName = coinName;
                        walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

                        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceReleaseNotification);
                        ActivityNotification.Param1 = coinName;
                        ActivityNotification.Param2 = amount.ToString();
                        ActivityNotification.Param3 = TrnRefNo.ToString();
                        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "OnWalletBalChange + SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());

                        Task.Run(() => Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
                            () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2)
                           ));

                        decimal charge = _walletRepository1.FindChargeValueDeduct(timestamp, TrnRefNo);
                        var ChargewalletId = _walletRepository1.FindChargeValueReleaseWalletId(timestamp, TrnRefNo);
                        WalletMaster ChargeWalletObj = null;
                        if (charge > 0 && ChargewalletId > 0)
                        {
                            ChargeWalletObj = _commonRepository.GetById(ChargewalletId);
                            if (ChargeWalletObj != null)
                            {
                                var ChargewalletType = _WalletTypeMasterRepository.GetSingle(i => i.Id == ChargeWalletObj.WalletTypeID);
                                if (ChargewalletType != null)
                                {
                                    ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                                    ActivityNotificationCharge.MsgCode = Convert.ToInt32(enErrorCode.ChargeReleasedWallet);
                                    ActivityNotificationCharge.Param1 = ChargewalletType.WalletTypeName;
                                    ActivityNotificationCharge.Param2 = charge.ToString();
                                    ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                                    ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                                    WalletMasterResponse walletMasterChargeObj = new WalletMasterResponse();
                                    walletMasterObj.AccWalletID = ChargeWalletObj.AccWalletID;
                                    walletMasterObj.Balance = ChargeWalletObj.Balance;
                                    walletMasterObj.WalletName = ChargeWalletObj.Walletname;
                                    walletMasterObj.PublicAddress = ChargeWalletObj.PublicAddress;
                                    walletMasterObj.IsDefaultWallet = ChargeWalletObj.IsDefaultWallet;
                                    walletMasterObj.CoinName = coinName;
                                    walletMasterObj.OutBoundBalance = ChargeWalletObj.OutBoundBalance;

                                    Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, dWalletobj.UserID.ToString(), charge.ToString(), ChargewalletType.WalletTypeName, UTC_To_IST().ToString(), TrnRefNo.ToString(), "released"),
                                  () => _signalRService.SendActivityNotificationV2(ActivityNotificationCharge, dWalletobj.UserID.ToString(), 2),
                                 () => _signalRService.OnWalletBalChange(walletMasterChargeObj, coinName, dWalletobj.UserID.ToString(), 2));
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog("GetReleaseHoldNew Charge Noti Timestamp:" + timestamp, "WalletService", ex);
                    }
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");

                }
                else
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "GetReleaseHoldNew");
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetReleaseHoldNew Timestamp:" + timestamp, "WalletService", ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetReleaseHoldNew");
                //throw ex;
            }
        }


        public async Task CreditDebitNotificationSend(string timestamp, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, WalletMaster firstCurrObjCrWM, WalletMaster firstCurrObjDrWM, WalletMaster secondCurrObjCrWM, WalletMaster secondCurrObjDrWM, decimal ChargefirstCur, decimal ChargesecondCur)
        {
            try
            {
                #region SMS_Email
                WalletMasterResponse walletMasterObjCr = new WalletMasterResponse();
                walletMasterObjCr.AccWalletID = firstCurrObjCrWM.AccWalletID;
                walletMasterObjCr.Balance = firstCurrObjCrWM.Balance;
                walletMasterObjCr.WalletName = firstCurrObjCrWM.Walletname;
                walletMasterObjCr.PublicAddress = firstCurrObjCrWM.PublicAddress;
                walletMasterObjCr.IsDefaultWallet = firstCurrObjCrWM.IsDefaultWallet;
                walletMasterObjCr.CoinName = firstCurrObj.Coin;
                walletMasterObjCr.OutBoundBalance = firstCurrObjCrWM.OutBoundBalance;

                WalletMasterResponse walletMasterObjCr1 = new WalletMasterResponse();
                walletMasterObjCr1.AccWalletID = secondCurrObjCrWM.AccWalletID;
                walletMasterObjCr1.Balance = secondCurrObjCrWM.Balance;
                walletMasterObjCr1.WalletName = secondCurrObjCrWM.Walletname;
                walletMasterObjCr1.PublicAddress = secondCurrObjCrWM.PublicAddress;
                walletMasterObjCr1.IsDefaultWallet = secondCurrObjCrWM.IsDefaultWallet;
                walletMasterObjCr1.CoinName = secondCurrObj.Coin;
                walletMasterObjCr1.OutBoundBalance = secondCurrObjCrWM.OutBoundBalance;


                ActivityNotificationMessage ActivityNotificationCr = new ActivityNotificationMessage();
                ActivityNotificationCr.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
                ActivityNotificationCr.Param1 = firstCurrObj.Coin;
                ActivityNotificationCr.Param2 = firstCurrObj.creditObject.trnType.ToString();
                ActivityNotificationCr.Param3 = firstCurrObj.creditObject.TrnRefNo.ToString();
                ActivityNotificationCr.Type = Convert.ToInt16(EnNotificationType.Info);

                ActivityNotificationMessage ActivityNotificationCr1 = new ActivityNotificationMessage();
                ActivityNotificationCr1.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
                ActivityNotificationCr1.Param1 = secondCurrObj.Coin;
                ActivityNotificationCr1.Param2 = secondCurrObj.creditObject.trnType.ToString();
                ActivityNotificationCr1.Param3 = secondCurrObj.creditObject.TrnRefNo.ToString();
                ActivityNotificationCr1.Type = Convert.ToInt16(EnNotificationType.Info);


                WalletMasterResponse walletMasterObjDr = new WalletMasterResponse();
                walletMasterObjDr.AccWalletID = firstCurrObjDrWM.AccWalletID;
                walletMasterObjDr.Balance = firstCurrObjDrWM.Balance;
                walletMasterObjDr.WalletName = firstCurrObjDrWM.Walletname;
                walletMasterObjDr.PublicAddress = firstCurrObjDrWM.PublicAddress;
                walletMasterObjDr.IsDefaultWallet = firstCurrObjDrWM.IsDefaultWallet;
                walletMasterObjDr.CoinName = firstCurrObj.Coin;
                walletMasterObjDr.OutBoundBalance = firstCurrObjDrWM.OutBoundBalance;


                WalletMasterResponse walletMasterObjDr1 = new WalletMasterResponse();
                walletMasterObjDr1.AccWalletID = secondCurrObjDrWM.AccWalletID;
                walletMasterObjDr1.Balance = secondCurrObjDrWM.Balance;
                walletMasterObjDr1.WalletName = secondCurrObjDrWM.Walletname;
                walletMasterObjDr1.PublicAddress = secondCurrObjDrWM.PublicAddress;
                walletMasterObjDr1.IsDefaultWallet = secondCurrObjDrWM.IsDefaultWallet;
                walletMasterObjDr1.CoinName = secondCurrObj.Coin;
                walletMasterObjDr1.OutBoundBalance = secondCurrObjDrWM.OutBoundBalance;



                ActivityNotificationMessage ActivityNotificationdr = new ActivityNotificationMessage();
                ActivityNotificationdr.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
                ActivityNotificationdr.Param1 = firstCurrObj.Coin;
                ActivityNotificationdr.Param2 = firstCurrObj.debitObject.trnType.ToString();
                ActivityNotificationdr.Param3 = firstCurrObj.debitObject.TrnRefNo.ToString();
                ActivityNotificationdr.Type = Convert.ToInt16(EnNotificationType.Info);

                ActivityNotificationMessage ActivityNotificationdr1 = new ActivityNotificationMessage();
                ActivityNotificationdr1.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
                ActivityNotificationdr1.Param1 = secondCurrObj.Coin;
                ActivityNotificationdr1.Param2 = secondCurrObj.debitObject.trnType.ToString();
                ActivityNotificationdr1.Param3 = secondCurrObj.debitObject.TrnRefNo.ToString();
                ActivityNotificationdr1.Type = Convert.ToInt16(EnNotificationType.Info);

                //decimal ChargefirstCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.creditObject.TrnRefNo);
                //decimal ChargesecondCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.debitObject.TrnRefNo);

                Task.Run(() => HelperForLog.WriteLogIntoFile("CreditNotificationSend Activity:Without Token", "WalletService", "msg=" + ActivityNotificationdr.MsgCode.ToString() + ",User=" + firstCurrObjCrWM.UserID.ToString() + "WalletID" + firstCurrObjCrWM.AccWalletID + ",Balance" + firstCurrObjCrWM.Balance.ToString()));

                var firstCurrObjCrType = firstCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
                var firstCurrObjDrType = firstCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");
                var secCurrObjCrType = secondCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
                var secCurrObjDrType = secondCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotificationCr, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr, firstCurrObj.Coin, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.SendActivityNotificationV2(ActivityNotificationCr1, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr1, secondCurrObj.Coin, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.SendActivityNotificationV2(ActivityNotificationdr, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjDr, firstCurrObj.Coin, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.SendActivityNotificationV2(ActivityNotificationdr1, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjDr1, secondCurrObj.Coin, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, firstCurrObjCrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjCrType, firstCurrObj.creditObject.TrnRefNo.ToString()),
                                           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, secondCurrObjCrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjCrType, secondCurrObj.creditObject.TrnRefNo.ToString()),
                                            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, firstCurrObjDrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjDrType, firstCurrObj.debitObject.TrnRefNo.ToString()),
                                            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, secondCurrObjDrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjDrType, secondCurrObj.debitObject.TrnRefNo.ToString()),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, secondCurrObjCrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, UTC_To_IST().ToString(), secondCurrObj.creditObject.TrnRefNo.ToString(), secCurrObjCrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, firstCurrObjCrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, UTC_To_IST().ToString(), firstCurrObj.creditObject.TrnRefNo.ToString(), firstCurrObjCrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, secondCurrObjDrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), secCurrObjDrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, firstCurrObjDrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), firstCurrObjDrType)
                                           );

                if (ChargefirstCur > 0 && ChargesecondCur > 0)
                {
                    ActivityNotificationMessage ActivityNotificationCrChargeSec = new ActivityNotificationMessage();
                    ActivityNotificationCrChargeSec.MsgCode = Convert.ToInt32(enErrorCode.ChargeDeductedWallet);
                    ActivityNotificationCrChargeSec.Param1 = secondCurrObj.Coin;
                    ActivityNotificationCrChargeSec.Param2 = ChargefirstCur.ToString();
                    ActivityNotificationCrChargeSec.Param3 = secondCurrObj.creditObject.TrnRefNo.ToString();
                    ActivityNotificationCrChargeSec.Type = Convert.ToInt16(EnNotificationType.Info);

                    ActivityNotificationMessage ActivityNotificationDrChargeSec = new ActivityNotificationMessage();
                    ActivityNotificationDrChargeSec.MsgCode = Convert.ToInt32(enErrorCode.ChargeDeductedWallet);
                    ActivityNotificationDrChargeSec.Param1 = secondCurrObj.Coin;
                    ActivityNotificationDrChargeSec.Param2 = ChargesecondCur.ToString();
                    ActivityNotificationDrChargeSec.Param3 = secondCurrObj.debitObject.TrnRefNo.ToString();
                    ActivityNotificationDrChargeSec.Type = Convert.ToInt16(EnNotificationType.Info);

                    Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, firstCurrObjDrWM.UserID.ToString(), ChargefirstCur.ToString(), firstCurrObj.Coin, UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, secondCurrObjDrWM.UserID.ToString(), ChargesecondCur.ToString(), secondCurrObj.Coin, UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                  () => _signalRService.SendActivityNotificationV2(ActivityNotificationCrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2),
                    () => _signalRService.SendActivityNotificationV2(ActivityNotificationDrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2));
                }
                #endregion

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreditNotificationSend" + "TimeStamp:" + timestamp, "WalletService", ex);

                //throw ex;
            }
        }

        public async Task WalletHoldNotificationSend(string timestamp, WalletMaster dWalletobj, string coinName, decimal amount, long TrnRefNo, byte routeTrnType, decimal charge, long walletId, WalletMaster WalletlogObj, WalletTypeMaster DeductCoinName)
        {
            try
            {
                #region EMAIL_SMS
                WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
                walletMasterObj.Balance = dWalletobj.Balance;
                walletMasterObj.WalletName = dWalletobj.Walletname;
                walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
                walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
                walletMasterObj.CoinName = coinName;
                walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceNotification);
                ActivityNotification.Param1 = coinName;
                ActivityNotification.Param2 = amount.ToString();
                ActivityNotification.Param3 = TrnRefNo.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                HelperForLog.WriteLogIntoFileAsync("WalletHoldNotificationSend", "OnWalletBalChange + SendActivityNotificationV2 pre timestamp=" + timestamp.ToString());

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
                    () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2),

                    () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, dWalletobj.UserID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString()),
                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, dWalletobj.UserID.ToString(), amount.ToString(), coinName, UTC_To_IST().ToString(), TrnRefNo.ToString()));

                if (charge > 0 && walletId > 0 && WalletlogObj != null && (DeductCoinName != null))
                {
                    ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                    ActivityNotificationCharge.MsgCode = Convert.ToInt32(enErrorCode.ChargeHoldWallet);
                    ActivityNotificationCharge.Param1 = DeductCoinName.WalletTypeName;
                    ActivityNotificationCharge.Param2 = charge.ToString();
                    ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                    ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                    WalletMasterResponse walletMasterObjCharge = new WalletMasterResponse();
                    walletMasterObjCharge.AccWalletID = WalletlogObj.AccWalletID;
                    walletMasterObjCharge.Balance = WalletlogObj.Balance;
                    walletMasterObjCharge.WalletName = WalletlogObj.Walletname;
                    walletMasterObjCharge.PublicAddress = WalletlogObj.PublicAddress;
                    walletMasterObjCharge.IsDefaultWallet = WalletlogObj.IsDefaultWallet;
                    walletMasterObjCharge.CoinName = DeductCoinName.WalletTypeName;
                    walletMasterObjCharge.OutBoundBalance = WalletlogObj.OutBoundBalance;

                    Parallel.Invoke(
                      () => _signalRService.SendActivityNotificationV2(ActivityNotificationCharge, dWalletobj.UserID.ToString(), 2),
                      () => _signalRService.OnWalletBalChange(walletMasterObjCharge, DeductCoinName.WalletTypeName, dWalletobj.UserID.ToString(), 2),
                      () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, dWalletobj.UserID.ToString(), charge.ToString(), DeductCoinName.WalletTypeName, UTC_To_IST().ToString(), TrnRefNo.ToString(), "hold"));
                }
                #endregion
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, "WalletService", ex);
                //throw ex;
            }
        }

        public async Task CreditWalletNotificationSend(string timestamp, WalletMasterResponse walletMasterObj, string coinName, decimal TotalAmount, long TrnRefNo, byte routeTrnType, long userID, string Token, string Wtrntype, decimal charge, WalletMaster ChargeWalletObj, string DeductWalletType)
        {
            try
            {
                #region SMS_EMail     
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
                ActivityNotification.Param1 = coinName;
                ActivityNotification.Param2 = routeTrnType.ToString();
                ActivityNotification.Param3 = TrnRefNo.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                HelperForLog.WriteLogIntoFile("GetWalletCreditNew Activity:With Token", "WalletService", "msg=" + ActivityNotification.MsgCode.ToString() + "," + "WalletID" + walletMasterObj.AccWalletID + ",Balance" + walletMasterObj.Balance.ToString());

                var trnType = Wtrntype.Contains("Cr_") ? Wtrntype.Replace("Cr_", "") : Wtrntype.Replace("Dr_", "");

                Parallel.Invoke(
                  () => _signalRService.SendActivityNotificationV2(ActivityNotification, userID.ToString(), 2),

                   () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, userID.ToString(), 2),

                   () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, userID.ToString(), null, null, null, null, coinName, trnType, TrnRefNo.ToString()),
                   () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, userID.ToString(), TotalAmount.ToString(), coinName, UTC_To_IST().ToString(), TrnRefNo.ToString(), trnType));

                if (charge > 0 && ChargeWalletObj != null && (DeductWalletType != null))
                {
                    ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                    ActivityNotificationCharge.MsgCode = Convert.ToInt32(enErrorCode.ChargeRefundedWallet);
                    ActivityNotificationCharge.Param1 = DeductWalletType;
                    ActivityNotificationCharge.Param2 = charge.ToString();
                    ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                    ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                    WalletMasterResponse walletMasterObjCharge = new WalletMasterResponse();
                    walletMasterObjCharge.AccWalletID = ChargeWalletObj.AccWalletID;
                    walletMasterObjCharge.Balance = ChargeWalletObj.Balance;
                    walletMasterObjCharge.WalletName = ChargeWalletObj.Walletname;
                    walletMasterObjCharge.PublicAddress = ChargeWalletObj.PublicAddress;
                    walletMasterObjCharge.IsDefaultWallet = ChargeWalletObj.IsDefaultWallet;
                    walletMasterObjCharge.CoinName = DeductWalletType;
                    walletMasterObjCharge.OutBoundBalance = ChargeWalletObj.OutBoundBalance;

                    Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApplyrefund, userID.ToString(), charge.ToString(), DeductWalletType, UTC_To_IST().ToString(), TrnRefNo.ToString(), "refunded"),
                  () => _signalRService.SendActivityNotificationV2(ActivityNotificationCharge, userID.ToString(), 2),
                 () => _signalRService.OnWalletBalChange(walletMasterObjCharge, DeductWalletType, userID.ToString(), 2));
                }
                #endregion
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, "WalletService", ex);
                //throw ex;
            }
        }

        public async Task WalletDeductionNewNotificationSend(string timestamp, WalletMaster dWalletobj, string coinName, decimal amount, long TrnRefNo, byte routeTrnType, long userID, string Token, string Wtrntype, WalletMasterResponse walletMasterObj, decimal charge, string DeductWalletType, WalletMasterResponse ChargeWallet)
        {
            try
            {
                var trnType = Wtrntype.Contains("Cr_") ? Wtrntype.Replace("Cr_", "") : Wtrntype.Replace("Dr_", "");
                #region SMS_Email             
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
                ActivityNotification.Param1 = coinName;
                ActivityNotification.Param2 = trnType; //ntrivedi 08-02-20019 "6" instead of Withdrawal in notification
                ActivityNotification.Param3 = TrnRefNo.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "OnWalletBalChange + SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());

                Parallel.Invoke(
                   () => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
                   () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2),
                   () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, userID.ToString(), null, null, null, null, coinName, trnType, TrnRefNo.ToString()),
                   () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, userID.ToString(), amount.ToString(), coinName, UTC_To_IST().ToString(), TrnRefNo.ToString(), trnType));
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew twice", "WalletNewTest");

                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew mail before", "Get walletid and currency walletid=" + ChargeWallet.AccWalletID.ToString() + "Currency : " + DeductWalletType.ToString() + "Charge: " + charge.ToString());

                if (charge > 0 && (DeductWalletType != null) && ChargeWallet != null)
                {
                    HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew mail after", "Get walletid and currency walletid=" + ChargeWallet.AccWalletID.ToString() + "Currency : " + DeductWalletType.ToString() + "Charge: " + charge.ToString());

                    ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                    ActivityNotificationCharge.MsgCode = Convert.ToInt32(enErrorCode.ChargeDeductedWallet);
                    ActivityNotificationCharge.Param1 = DeductWalletType;
                    ActivityNotificationCharge.Param2 = charge.ToString();
                    ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                    ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                    Parallel.Invoke(
                         () => _signalRService.OnWalletBalChange(ChargeWallet, DeductWalletType, dWalletobj.UserID.ToString(), 2),
                         () => _signalRService.SendActivityNotificationV2(ActivityNotificationCharge, dWalletobj.UserID.ToString(), 2),
                         //6.Action(1.Hold 2.Released 3.Deduct)
                         () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, userID.ToString(), charge.ToString(), DeductWalletType, UTC_To_IST().ToString(), TrnRefNo.ToString(), "deducted"));
                }
                #endregion
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, "WalletService", ex);
                //throw ex;
            }
        }

        public async Task<BizResponseClass> UpdateWalletDetail(string AccWalletID, string walletName, short? status, byte? isDefaultWallet, long UserID)
        {
            try
            {
                BizResponseClass Resp = new BizResponseClass();
                bool flag = false;

                //2019-2-18 added condi for only used trading wallet
                var IsExist = await _commonRepository.GetSingleAsync(item => item.AccWalletID == AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (IsExist != null)
                {
                    IsExist.Walletname = (walletName == null ? IsExist.Walletname : walletName);
                    IsExist.Status = Convert.ToInt16(status == null ? IsExist.Status : status);
                    IsExist.UpdatedBy = UserID;
                    IsExist.UpdatedDate = UTC_To_IST();
                    IsExist.IsDefaultWallet = Convert.ToByte(isDefaultWallet == null ? IsExist.IsDefaultWallet : isDefaultWallet);

                    if (isDefaultWallet != null && isDefaultWallet > 0)
                    {
                        var DefaultWallets = _walletRepository1.UpdateDefaultWallets(IsExist.WalletTypeID, UserID);
                        if (DefaultWallets.AffectedRows > 0)
                        {
                            flag = true;
                        }
                        else
                        {
                            flag = false;
                        }
                    }
                    else
                    {
                        flag = true;
                    }
                    if (flag)
                    {
                        _commonRepository.UpdateWithAuditLog(IsExist);
                        Resp.ReturnCode = enResponseCode.Success;
                        Resp.ErrorCode = enErrorCode.Success;
                        Resp.ReturnMsg = EnResponseMessage.RecordUpdated;
                    }
                    else
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ErrorCode = enErrorCode.InternalError;
                        Resp.ReturnMsg = EnResponseMessage.InternalError;
                    }
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("UpdateWalletDetail", "WalletService", ex);
                throw ex;
            }
        }


        //public string FindChargeCurrencyDeduct(long TrnRefNo)
        //{
        //    try
        //    {
        //        return FindChargeCurrencyDeduct(TrnRefNo);
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("FindChargeValue", "WalletRepository", ex);
        //        throw ex;
        //    }
        //}
        //#region oldcode
        ////public async Task<WalletDrCrResponse> GetWalletDeductionNewAsync(string coinName, string timestamp, enWalletTranxOrderType orderType, decimal amount, long userID, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, string Token = "")
        ////{
        ////    try
        ////    {
        ////        WalletMaster dWalletobj;
        ////        string remarks = "";
        ////        WalletTypeMaster walletTypeMaster;
        ////        WalletTransactionQueue objTQ;
        ////        //long walletTypeID;
        ////        WalletDrCrResponse resp = new WalletDrCrResponse();
        ////        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());
        ////        if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty || userID == 0)
        ////        {
        ////            return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName };
        ////        }
        ////        walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
        ////        if (walletTypeMaster == null)
        ////        {
        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Debit");
        ////        }
        ////        dWalletobj = _commonRepository.GetSingle(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID);
        ////        if (dWalletobj == null)
        ////        {
        ////            //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet }, "Debit");
        ////        }
        ////        if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
        ////        {
        ////            // insert with status=2 system failed
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }
        ////        if (orderType != enWalletTranxOrderType.Debit) // sell 13-10-2018
        ////        {
        ////            // insert with status=2 system failed
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTrnType, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }
        ////        if (TrnRefNo == 0) // sell 13-10-2018
        ////        {
        ////            // insert with status=2 system failed
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }
        ////        if (amount <= 0)
        ////        {
        ////            // insert with status=2 system failed
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }

        ////        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString());

        ////        if (!CheckUserBalance(dWalletobj.Id))
        ////        {
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }
        ////        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString());
        ////        dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
        ////        if (dWalletobj.Balance < amount)
        ////        {
        ////            // insert with status=2 system failed
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }

        ////        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString());
        ////        if (_commonWalletFunction.CheckShadowLimit(dWalletobj.Id, amount) != enErrorCode.Success)
        ////        {
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }
        ////        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString());

        ////        //vsolanki 208-11-1 ntrivedi at transaction time transaction limit is checked so duplicate so remove for time 
        ////        //var charge = GetServiceLimitChargeValue(routeTrnType, coinName);
        ////        //if (charge.MaxAmount < amount && charge.MinAmount > amount && charge.MaxAmount != 0 && charge.MinAmount != 0)
        ////        //{
        ////        //    var msg1 = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg;
        ////        //    msg1 = msg1.Replace("@MIN", charge.MinAmount.ToString());
        ////        //    msg1 = msg1.Replace("@MAX", charge.MaxAmount.ToString());
        ////        //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, msg1, trnType);
        ////        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        ////        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = msg1, ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax }, "Debit");
        ////        //}

        ////        int count = CheckTrnRefNo(TrnRefNo, orderType, trnType);
        ////        if (count != 0)
        ////        {
        ////            // insert with status=2 system failed
        ////            objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
        ////            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        ////            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        ////        }

        ////        objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
        ////        objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        ////        TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch(UTC_To_IST()));
        ////        remarks = "Debit for TrnNo:" + objTQ.TrnNo;
        ////        dWalletobj = _commonRepository.GetById(dWalletobj.Id);
        ////        WalletLedger walletLedger = GetWalletLedger(dWalletobj.Id, 0, amount, 0, trnType, serviceType, objTQ.TrnNo, remarks, dWalletobj.Balance, 1);
        ////        TransactionAccount tranxAccount = GetTransactionAccount(dWalletobj.Id, 1, batchObj.Id, amount, 0, objTQ.TrnNo, remarks, 1);
        ////        dWalletobj.DebitBalance(amount);
        ////        objTQ.Status = enTransactionStatus.Hold;
        ////        objTQ.StatusMsg = "Hold";
        ////        _walletRepository1.WalletDeductionwithTQ(walletLedger, tranxAccount, dWalletobj, objTQ);
        ////        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletDeductionwithTQ done TrnNo=" + TrnRefNo.ToString());

        ////        //vsolanki 2018-11-1---------------socket method   --------------------------
        ////        WalletMasterResponse walletMasterObj = new WalletMasterResponse();
        ////        walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
        ////        walletMasterObj.Balance = dWalletobj.Balance;
        ////        walletMasterObj.WalletName = dWalletobj.Walletname;
        ////        walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
        ////        walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
        ////        walletMasterObj.CoinName = coinName;

        ////        _signalRService.OnWalletBalChange(walletMasterObj, coinName, Token);
        ////        var msg = EnResponseMessage.DebitWalletMsg;
        ////        msg = msg.Replace("#Coin#", coinName);
        ////        msg = msg.Replace("#TrnType#", routeTrnType.ToString());
        ////        msg = msg.Replace("#TrnNo#", TrnRefNo.ToString());
        ////        _signalRService.SendActivityNotification(msg, Token);
        ////        //-------------------------------
        ////        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");

        ////    }
        ////    catch (Exception ex)
        ////    {
        ////        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        ////        throw ex;
        ////    }
        ////}
        //#endregion

        #region AddUserWalletRequest

        //2018-12-20
        public ListAddWalletRequest ListAddUserWalletRequest(long UserID)
        {
            try
            {
                ListAddWalletRequest Resp = new ListAddWalletRequest();
                var data = _walletRepository1.ListAddUserWalletRequest(UserID);
                Resp.Data = data;
                if (data.Count > 0)
                {
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public async Task<BizResponseClass> InsertUserWalletPendingRequest(InsertWalletRequest request, long UserId)
        {
            try
            {

                //2019-2-18 added condi for only used trading wallet
                var walletObj1 = _commonRepository.GetSingleAsync(i => i.AccWalletID == request.WalletID && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                var roleObj1 = _UserRoleMaster.GetSingleAsync(i => i.Id == request.RoleId);
                var userObj1 = _userManager.FindByEmailAsync(request.Email);
                var userObj = await userObj1;
                if (userObj == null)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.EmailNotExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.EmailNotExist };
                }
                if (userObj.Id == UserId)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.NotShareWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotShareWallet };
                }
                var walletObj = await walletObj1;

                var authoriseObj = _WalletAuthorizeUserMaster.GetSingle(i => i.WalletID == walletObj.Id && i.UserID == userObj.Id);
                var roleObj = await roleObj1;
                if (authoriseObj != null)
                {
                    if (authoriseObj.Status == 1 && request.RequestType == 1)
                    {
                        string Msg = EnResponseMessage.AlredyExistWithRole + roleObj.RoleType + "!!";
                        return new BizResponseClass { ErrorCode = enErrorCode.AlredyExistWithRole, ReturnCode = enResponseCode.Fail, ReturnMsg = Msg };
                    }
                }

                if (authoriseObj == null && request.RequestType == 2)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.NotRemoveUser, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotRemoveUser };
                }
                //var walletReqObj = _AddRemoveUserWalletRequest.GetSingle(i => i.WalletID == walletObj.Id && (i.WalletOwnerUserID == UserId || i.ToUserId == UserId));

                var IsExist1 = _AddRemoveUserWalletRequest.GetSingleAsync(i => i.WalletID == walletObj.Id && i.ToUserId == userObj.Id && i.FromUserId == UserId && i.Type == request.RequestType && i.Status != 9);
                var walletTypeObj1 = _WalletTypeMasterRepository.GetSingleAsync(i => i.Id == walletObj.WalletTypeID);
                var FromUser1 = _userManager.FindByIdAsync(UserId.ToString());

                var FromUser = await FromUser1;
                var walletTypeObj = await walletTypeObj1;
                var IsExist = await IsExist1;

                //call sp
                BizResponseClass BizResponseClassObj = _walletSPRepositories.Callsp_IsValidWalletTransaction(walletObj.Id, UserId, walletTypeObj.Id, request.ChannelId, Convert.ToInt64(enWalletTrnType.AddUser));

                #region OldCode
                // var mappingObj = _OrganizationUserMaster.GetSingle(i => i.UserID == UserId);
                //var trntypeRoleObj = _AllowTrnTypeRoleWise.GetSingle(i => i.RoleId == mappingObj.RoleID && i.TrnTypeId == Convert.ToInt64(enWalletTrnType.AddUser));

                //if (trntypeRoleObj == null)
                //{
                //    return new BizResponseClass { ErrorCode = enErrorCode.NotAddUser, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotAddUser };
                //}

                //if (walletObj == null)
                //{
                //    return new BizResponseClass { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                //}
                //if (walletReqObj == null)
                //{
                //    if (walletObj.UserID != UserId)
                //    {
                //        return new BizResponseClass { ErrorCode = enErrorCode.NotAddUser, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotAddUser };
                //    }
                //}
                //if (roleObj == null)
                //{
                //    return new BizResponseClass { ErrorCode = enErrorCode.InvalidRole, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidRole };
                //}
                #endregion

                if (BizResponseClassObj.ReturnCode == 0)
                {
                    if (IsExist != null)
                    {
                        string Msg = (roleObj == null) ? EnResponseMessage.AlredyExistWithRole : EnResponseMessage.AlredyExistWithRole + roleObj.RoleType + "!!";
                        if (IsExist.Status == 1)
                        {
                            return new BizResponseClass { ErrorCode = enErrorCode.AlredyExistWithRole, ReturnCode = enResponseCode.Fail, ReturnMsg = Msg };
                        }
                        if (IsExist.Status == 0)
                        {
                            return new BizResponseClass { ErrorCode = enErrorCode.RequestPending, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.RequestPending };
                        }
                    }
                    AddRemoveUserWalletRequest Obj = new AddRemoveUserWalletRequest();
                    Obj.Status = 0;//pending
                    Obj.CreatedBy = UserId;
                    Obj.CreatedDate = UTC_To_IST();
                    Obj.UpdatedDate = UTC_To_IST();
                    Obj.RecieverApproveBy = userObj.Id;
                    Obj.RecieverApproveDate = UTC_To_IST();
                    Obj.WalletID = walletObj.Id;
                    Obj.ToUserId = userObj.Id;
                    Obj.WalletOwnerUserID = Convert.ToInt64(walletObj.UserID);
                    Obj.RoleId = request.RoleId;
                    Obj.Message = request.Message;
                    Obj.ReceiverEmail = request.Email;
                    Obj.OwnerApprovalDate = UTC_To_IST();
                    Obj.OwnerApprovalBy = (walletObj.UserID == UserId) ? UserId : walletObj.UserID;
                    Obj.OwnerApprovalStatus = walletObj.UserID == UserId ? Convert.ToInt16(1) : Convert.ToInt16(0);
                    Obj.Type = request.RequestType;
                    Obj.FromUserId = UserId;
                    _AddRemoveUserWalletRequest.Add(Obj);

                    if (walletObj.UserID != UserId)
                    {
                        //first sent mail to owner-> after verification sent to other
                        EmailSendAsyncV1(EnTemplateType.Email_AddUserOwnerApproval, walletObj.UserID.ToString(), walletObj.Walletname, walletTypeObj.WalletTypeName, "https://www.google.com/", (request.RequestType == 1 ? "addition" : "removal"));
                    }
                    else
                    {
                        //for sender
                        EmailSendAsyncV1(EnTemplateType.Email_Sender, UserId.ToString(), userObj.Email, roleObj.RoleType, walletTypeObj.WalletTypeName, walletObj.Walletname, "https://www.google.com/", (request.RequestType == 1 ? "addition" : "removal"));

                        //send notification

                        var listActivity = ListAddUserWalletRequest(userObj.Id);
                        _signalRService.SendWalletActivityList(listActivity, userObj.Id.ToString());
                        //for reciever  
                        EmailSendAsyncV1(EnTemplateType.Email_Reciever, userObj.Id.ToString(), FromUser.Email, roleObj.RoleType, walletTypeObj.WalletTypeName, walletObj.Walletname, "https://www.google.com/", (request.RequestType == 1 ? "addition" : "removal"));
                    }
                    return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RequestAdded };
                }

                return BizResponseClassObj;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertUserWalletPendingRequest", "WalletService", ex);
                throw;
            }
        }

        //2018-12-20
        public async Task<BizResponseClass> UpdateUserWalletPendingRequest(short Status, long RequestId, long UserId)
        {
            try
            {
                var requestObj = _AddRemoveUserWalletRequest.GetSingle(i => i.Id == RequestId && i.Status == 0);
                if (requestObj == null)
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.NotFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound };
                }

                //2019-2-18 added condi for only used trading wallet
                var walletObj1 = _commonRepository.GetSingleAsync(i => i.Id == requestObj.WalletID && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                var roleObjs1 = _UserRoleMaster.GetSingleAsync(i => i.Id == requestObj.RoleId);
                var walletObj = await walletObj1;
                var typeObj1 = _WalletTypeMasterRepository.GetSingleAsync(i => i.Id == walletObj.WalletTypeID);
                var userObj1 = _userManager.FindByEmailAsync(requestObj.ReceiverEmail);
                var FromUser1 = _userManager.FindByIdAsync(requestObj.FromUserId.ToString());
                var ownerUser1 = _userManager.FindByIdAsync(requestObj.WalletOwnerUserID.ToString());

                var roleObjs = await roleObjs1;
                var typeObj = await typeObj1;
                var userObj = await userObj1;
                var FromUser = await FromUser1;
                var ownerUser = await ownerUser1;

                if (requestObj.WalletOwnerUserID == UserId)//for owner approval
                {
                    if (requestObj.OwnerApprovalStatus == 0)
                    {
                        requestObj.UpdatedBy = UserId;
                        requestObj.UpdatedDate = UTC_To_IST();
                        requestObj.OwnerApprovalStatus = Status;
                        requestObj.OwnerApprovalDate = UTC_To_IST();
                        requestObj.OwnerApprovalBy = UserId;
                        if (requestObj.Type == 2)
                        {
                            requestObj.Status = Status;
                            requestObj.RecieverApproveDate = UTC_To_IST();
                            requestObj.RecieverApproveBy = UserId;

                            var WalletAuthorizeUserMasterObj = _WalletAuthorizeUserMaster.GetSingle(i => i.WalletID == requestObj.WalletID && i.UserID == UserId);
                            if (Status == 1)
                            {
                                WalletAuthorizeUserMasterObj.Status = 9;
                                WalletAuthorizeUserMasterObj.UpdatedDate = UTC_To_IST();
                                WalletAuthorizeUserMasterObj.UpdatedBy = UserId;
                                _WalletAuthorizeUserMaster.UpdateWithAuditLog(WalletAuthorizeUserMasterObj);
                            }
                        }
                        _AddRemoveUserWalletRequest.Update(requestObj);//update AddRemoveUserWalletRequest entity

                        if (Status == 1)
                        {
                            //for reciever  to adding/removing req
                            EmailSendAsyncV1(EnTemplateType.Email_Reciever, userObj.Id.ToString(), FromUser.Email, roleObjs.RoleType, typeObj.WalletTypeName, walletObj.Walletname, "https://www.google.com/", (requestObj.Type == 1 ? "addition" : "removal"));
                        }

                        //send mail to owner for suucess approval to add/remove user
                        EmailSendAsyncV1(EnTemplateType.Email_OwnerApproval, requestObj.WalletOwnerUserID.ToString(), requestObj.ReceiverEmail, roleObjs.RoleType, typeObj.WalletTypeName, walletObj.Walletname, (requestObj.Type == 1 ? "addition" : "removal"), (Status == 1 ? "accepted" : "rejected"), FromUser.Email);

                        //for sender
                        EmailSendAsyncV1(EnTemplateType.Email_RequestApproval, requestObj.FromUserId.ToString(), requestObj.ReceiverEmail, roleObjs.RoleType, typeObj.WalletTypeName, walletObj.Walletname, (requestObj.Type == 1 ? "addition" : "removal"), (Status == 1 ? "Accepted By Owner" : "Rejected By Owner") + (ownerUser.Email));

                        return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordUpdated };
                    }
                    else
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.AlredyApproved, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyApproved };
                    }
                }

                else if (requestObj.ToUserId == UserId && requestObj.Type == 1)
                {
                    if (requestObj.OwnerApprovalStatus == 1)//must approved by owner
                    {
                        requestObj.UpdatedBy = UserId;
                        requestObj.UpdatedDate = UTC_To_IST();
                        requestObj.Status = Status;
                        requestObj.RecieverApproveDate = UTC_To_IST();
                        requestObj.RecieverApproveBy = UserId;

                        var WalletAuthorizeUserMasterObj = _WalletAuthorizeUserMaster.GetSingle(i => i.WalletID == requestObj.WalletID && i.UserID == UserId);
                        if (Status == 1 && requestObj.Type == 1)
                        {
                            //add entry in authorised tbl
                            if (WalletAuthorizeUserMasterObj == null)
                            {
                                WalletAuthorizeUserMaster obj = new WalletAuthorizeUserMaster();
                                obj.RoleID = requestObj.RoleId;
                                obj.UserID = UserId;
                                obj.Status = 1;
                                obj.CreatedBy = UserId;
                                obj.CreatedDate = UTC_To_IST();
                                obj.UpdatedDate = UTC_To_IST();
                                obj.WalletID = requestObj.WalletID;
                                obj.OrgID = Convert.ToInt64(walletObj.OrgID);
                                _WalletAuthorizeUserMaster.Add(obj);//add new enrty
                            }
                            else
                            {
                                WalletAuthorizeUserMasterObj.Status = 1;
                                WalletAuthorizeUserMasterObj.UpdatedDate = UTC_To_IST();
                                WalletAuthorizeUserMasterObj.UpdatedBy = UserId;
                                _WalletAuthorizeUserMaster.Add(WalletAuthorizeUserMasterObj);//update enrty
                            }
                        }
                        else if (Status == 1 && requestObj.Type == 2)
                        {
                            WalletAuthorizeUserMasterObj.Status = 9;
                            WalletAuthorizeUserMasterObj.UpdatedDate = UTC_To_IST();
                            WalletAuthorizeUserMasterObj.UpdatedBy = UserId;
                            _WalletAuthorizeUserMaster.Add(WalletAuthorizeUserMasterObj);//update enrty
                        }

                        _AddRemoveUserWalletRequest.Update(requestObj);//update AddRemoveUserWalletRequest entity

                        //send mail to both From and To user
                        EmailSendAsyncV1(EnTemplateType.Email_RequestApproval, requestObj.FromUserId.ToString(), requestObj.ReceiverEmail, roleObjs.RoleType, typeObj.WalletTypeName, walletObj.Walletname, (requestObj.Type == 1 ? "addition" : "removal"), (Status == 1 ? "Accepted" : "Rejected"));

                        EmailSendAsyncV1(EnTemplateType.Email_RequestApproval, UserId.ToString(), requestObj.ReceiverEmail, roleObjs.RoleType, typeObj.WalletTypeName, walletObj.Walletname, (requestObj.Type == 1 ? "addition" : "removal"), (Status == 1 ? "Accepted" : "Rejected"));

                        return new BizResponseClass { ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.RecordUpdated };
                    }
                    else
                    {
                        return new BizResponseClass { ErrorCode = enErrorCode.ApprovedByOwner, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ApprovedByOwner };
                    }
                }
                else
                {
                    return new BizResponseClass { ErrorCode = enErrorCode.NotRequestApproved, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotRequestApproved };
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("UpdateUserWalletPendingRequest", "WalletService", ex);
                throw;
            }
        }

        public async Task<ListUserWalletWise> ListUserWalletWise(string WalletId)
        {
            try
            {
                ListUserWalletWise Resp = new ListUserWalletWise();
                //2019-2-18 added condi for only used trading wallet
                var walletObj = _commonRepository.GetSingle(i => i.AccWalletID == WalletId && i.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (walletObj == null)
                {
                    Resp.ErrorCode = enErrorCode.InvalidWallet;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidWallet;
                }
                #region oldcode
                //if(RoleId!=null)
                //{
                //    var roleObj = _UserRoleMaster.GetSingle(i => i.Id == RoleId);
                //    if (roleObj == null)
                //    {
                //        Resp.ErrorCode = enErrorCode.InvalidRole;
                //        Resp.ReturnCode = enResponseCode.Fail;
                //        Resp.ReturnMsg = EnResponseMessage.InvalidRole;
                //    }
                //}
                #endregion
                var data = await _walletRepository1.ListUserWalletWise(walletObj.Id);
                Resp.Data = data;
                if (data.Count > 0)
                {
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }
        #endregion

        #region Staking

        public async Task<ListStakingPolicyDetailRes> GetStakingPolicy(short statkingTypeID, short currencyTypeID)
        {
            try
            {
                ListStakingPolicyDetailRes Resp = new ListStakingPolicyDetailRes();
                var data = _walletRepository1.GetStakingPolicyData(statkingTypeID, currencyTypeID);
                if (data.Count > 0)
                {
                    Resp.Details = data;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ListStakingPolicy", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<ListPreStackingConfirmationRes> GetPreStackingData(PreStackingConfirmationReq Req, long Userid)
        {
            try
            {
                ListPreStackingConfirmationRes Resp = new ListPreStackingConfirmationRes();
                PreStackingConfirmationRes1 MaturityDetails = new PreStackingConfirmationRes1();
                var data = _walletRepository1.GetPreStackingData(Req.PolicyDetailID);
                bool UpgradeFlag = false; decimal OldStakAmount = 0;
                if (data != null)
                {
                    decimal MaturityAmount = 0, InterestAmount = 0, historyAmount = 0;
                    DateTime MaturityDate = UTC_To_IST().AddDays(data.DurationWeek * 7).AddMonths(data.DurationMonth);

                    if (data.StakingType == 1)//Fixed Deposit
                    {
                        if (data.SlabType == 1)//Fixed
                        {
                            if (Req.Amount != data.MinAmount)
                            {
                                Resp.ReturnCode = enResponseCode.Fail;
                                Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                                Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                                return Resp;
                            }
                        }
                        else
                        {
                            if (Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount)
                            {
                                Resp.ReturnCode = enResponseCode.Fail;
                                Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                                Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                                return Resp;
                            }
                        }
                        if (data.InterestType == 1)//Fixed
                        {
                            InterestAmount = data.InterestValue;
                            if (data.InterestWalletTypeID == data.WalletTypeID)
                            {
                                MaturityAmount = Req.Amount + InterestAmount;
                            }
                            else
                            {
                                MaturityAmount = Req.Amount;
                            }
                        }
                        else//Percentage
                        {
                            InterestAmount = ((Req.Amount * data.InterestValue) / 100);
                            if (data.InterestWalletTypeID == data.WalletTypeID)
                            {
                                MaturityAmount = Req.Amount + InterestAmount;
                            }
                            else
                            {
                                MaturityAmount = Req.Amount;
                            }
                        }
                    }
                    else//Charge Type
                    {
                        var detailData = _StakingDetailCommonRepo.GetSingle(i => i.Id == Req.PolicyDetailID);
                        var masterData = _StakingPolicyCommonRepo.GetSingle(i => i.Id == detailData.StakingPolicyID);
                        var historydata = _TokenStakingHistoryCommonRepo.GetSingle(i => i.StakingType == masterData.StakingType && i.UserID == Userid && i.WalletTypeID == masterData.WalletTypeID && i.Status == 1);
                        if (historydata != null)
                        {
                            historyAmount = historydata.MinAmount;
                            OldStakAmount = historydata.StakingAmount;
                        }
                        //var maxamt = MAX(MinAmount) from[TokenStakingHistory] where WalletOwnerID = @UserID and WalletTypeID = @WalletTypeID and Status = 1  and StakingType = @StakingType
                        if (historyAmount > 0)
                        {
                            UpgradeFlag = true;
                            //if ((masterData.SlabType == 1 && detailData.MinAmount != Req.Amount + historyAmount) || (masterData.SlabType == 2 && detailData.MinAmount > Req.Amount + historyAmount))
                            //if (masterData.SlabType == 2 && (detailData.MinAmount > Req.Amount + historyAmount))
                            //{
                            //    Resp.ReturnCode = enResponseCode.Fail;
                            //    Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                            //    Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                            //    return Resp;
                            //}
                        }
                        //Fresh Request
                        //if ((data.SlabType == 1 && Req.Amount != data.MinAmount) || (data.SlabType == 2 && Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount))
                        if (data.SlabType == 2 && Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount)
                        {
                            Resp.ReturnCode = enResponseCode.Fail;
                            Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                            Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                            return Resp;
                        }
                        //else
                        //{
                        //    if (Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount)
                        //    {
                        //        Resp.ReturnCode = enResponseCode.Fail;
                        //        Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                        //        Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                        //        return Resp;
                        //    }
                        //}
                        if (data.InterestType == 1)
                        {
                            InterestAmount = data.EnableStakingBeforeMaturityCharge;
                            if (data.InterestWalletTypeID == data.WalletTypeID)
                            {
                                MaturityAmount = Req.Amount - InterestAmount;
                            }
                            else
                            {
                                MaturityAmount = Req.Amount;
                            }
                        }
                        else
                        {
                            if (data.EnableStakingBeforeMaturityCharge > 0)
                            {
                                InterestAmount = ((Req.Amount * data.EnableStakingBeforeMaturityCharge) / 100);
                            }
                            if (data.InterestWalletTypeID == data.WalletTypeID)
                            {
                                MaturityAmount = Req.Amount - InterestAmount;
                            }
                            else
                            {
                                MaturityAmount = Req.Amount;
                            }
                        }
                    }
                    if (UpgradeFlag)
                    {
                        MaturityDetails.DeductionAmount = Req.Amount - OldStakAmount;
                    }
                    else
                    {
                        MaturityDetails.DeductionAmount = Req.Amount;
                    }
                    if (MaturityDetails.DeductionAmount <= 0)
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidSlabSelection;
                        Resp.ErrorCode = enErrorCode.InvalidSlabSelection;
                        Resp.MaturityDetail = null;
                        Resp.StakingDetails = null;
                        return Resp;
                    }
                    MaturityDetails.IsUpgrade = UpgradeFlag;
                    MaturityDetails.Amount = Req.Amount;
                    MaturityDetails.InterestAmount = InterestAmount;
                    MaturityDetails.MaturityAmount = MaturityAmount;
                    MaturityDetails.MaturityDate = MaturityDate.Date;

                    Resp.StakingDetails = data;
                    Resp.MaturityDetail = MaturityDetails;

                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetPreStackingData", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<ListPreStackingConfirmationRes> GetPreStackingDataForDegrade(PreStackingConfirmationReq Req, long Userid)
        {
            try
            {
                ListPreStackingConfirmationRes Resp = new ListPreStackingConfirmationRes();
                PreStackingConfirmationRes1 MaturityDetails = new PreStackingConfirmationRes1();
                var data = _walletRepository1.GetPreStackingData(Req.PolicyDetailID);
                bool UpgradeFlag = false; decimal OldStakAmount = 0;
                if (data != null)
                {
                    decimal MaturityAmount = 0, InterestAmount = 0, historyAmount = 0;
                    DateTime MaturityDate = UTC_To_IST().AddDays((data.DurationWeek * 7) + 1).AddMonths(data.DurationMonth);

                    if (data.StakingType == 1)
                    {
                        if (data.SlabType == 1)
                        {
                            if (Req.Amount != data.MinAmount)
                            {
                                Resp.ReturnCode = enResponseCode.Fail;
                                Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                                Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                                return Resp;
                            }
                        }
                        else
                        {
                            if (Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount)
                            {
                                Resp.ReturnCode = enResponseCode.Fail;
                                Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                                Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                                return Resp;
                            }
                        }
                        if (data.InterestType == 1)
                        {
                            InterestAmount = data.InterestValue;
                            MaturityAmount = Req.Amount + InterestAmount;
                        }
                        else
                        {
                            InterestAmount = ((Req.Amount * data.InterestValue) / 100);
                            MaturityAmount = Req.Amount + InterestAmount;
                        }
                    }
                    else
                    {
                        var detailData = _StakingDetailCommonRepo.GetSingle(i => i.Id == Req.PolicyDetailID);
                        var masterData = _StakingPolicyCommonRepo.GetSingle(i => i.Id == detailData.StakingPolicyID && i.Status == 1);
                        var historydata = _TokenStakingHistoryCommonRepo.GetSingle(i => i.StakingType == masterData.StakingType && i.UserID == Userid && i.WalletTypeID == masterData.WalletTypeID && i.Status == 1);
                        if (historydata != null)
                        {
                            historyAmount = historydata.MinAmount;
                            OldStakAmount = historydata.StakingAmount;
                        }
                        //var maxamt = MAX(MinAmount) from[TokenStakingHistory] where WalletOwnerID = @UserID and WalletTypeID = @WalletTypeID and Status = 1  and StakingType = @StakingType
                        //if (historyAmount > 0)
                        //{
                        //    UpgradeFlag = true;
                        //    //if ((masterData.SlabType == 1 && detailData.MinAmount != Req.Amount + historyAmount) || (masterData.SlabType == 2 && detailData.MinAmount > Req.Amount + historyAmount))
                        //    //if (masterData.SlabType == 2 && (detailData.MinAmount > Req.Amount + historyAmount))
                        //    //{
                        //    //    Resp.ReturnCode = enResponseCode.Fail;
                        //    //    Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                        //    //    Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                        //    //    return Resp;
                        //    //}
                        //}
                        //Fresh Request
                        //if ((data.SlabType == 1 && Req.Amount != data.MinAmount) || (data.SlabType == 2 && Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount))
                        if (data.SlabType == 2 && Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount)
                        {
                            Resp.ReturnCode = enResponseCode.Fail;
                            Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                            Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                            return Resp;
                        }
                        //else
                        //{
                        //    if (Req.Amount < data.MinAmount || Req.Amount > data.MaxAmount)
                        //    {
                        //        Resp.ReturnCode = enResponseCode.Fail;
                        //        Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                        //        Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                        //        return Resp;
                        //    }
                        //}
                        if (data.InterestType == 1)
                        {
                            InterestAmount = data.EnableStakingBeforeMaturityCharge;
                            MaturityAmount = Req.Amount - InterestAmount;
                        }
                        else
                        {
                            if (data.EnableStakingBeforeMaturityCharge > 0)
                            {
                                InterestAmount = ((Req.Amount * data.EnableStakingBeforeMaturityCharge) / 100);
                            }
                            MaturityAmount = Req.Amount - InterestAmount;
                        }
                    }
                    //if (UpgradeFlag)
                    //{
                    //    MaturityDetails.DeductionAmount = Req.Amount - OldStakAmount;
                    //}
                    //else
                    //{
                    MaturityDetails.DeductionAmount = 0;
                    //}
                    //if (MaturityDetails.DeductionAmount <= 0)
                    //{
                    //    Resp.ReturnCode = enResponseCode.Fail;
                    //    Resp.ReturnMsg = EnResponseMessage.InvalidSlabSelection;
                    //    Resp.ErrorCode = enErrorCode.InvalidSlabSelection;
                    //    Resp.MaturityDetail = null;
                    //    Resp.StakingDetails = null;
                    //    return Resp;
                    //}
                    MaturityDetails.IsUpgrade = UpgradeFlag;
                    MaturityDetails.Amount = Req.Amount;
                    MaturityDetails.InterestAmount = InterestAmount;
                    MaturityDetails.MaturityAmount = MaturityAmount;
                    MaturityDetails.MaturityDate = MaturityDate.Date;

                    Resp.StakingDetails = data;
                    Resp.MaturityDetail = MaturityDetails;

                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetPreStackingData", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<BizResponseClass> UserStackingRequest(StakingHistoryReq stakingHistoryReq, long UserID)
        {
            try
            {
                BizResponseClass Resp = new BizResponseClass();
                //2019-2-18 added condi for only used trading wallet
                var WalletObj = await _commonRepository.GetSingleAsync(item => item.AccWalletID == stakingHistoryReq.AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (WalletObj != null)
                {
                    var data = _walletSPRepositories.Callsp_StakingSchemeRequest(stakingHistoryReq, UserID, WalletObj.Id, WalletObj.WalletTypeID);
                    if (data != null)
                    {
                        Resp.ReturnCode = data.ReturnCode;
                        Resp.ReturnMsg = data.ReturnMsg;
                        Resp.ErrorCode = data.ErrorCode;
                    }
                    else
                    {
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InternalError;
                        Resp.ErrorCode = enErrorCode.InternalError;
                    }
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.WalletNotFound;
                    Resp.ErrorCode = enErrorCode.WalletNotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("UserStackingRequest", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<ListStakingHistoryRes> GetStackingHistoryData(DateTime? FromDate, DateTime? ToDate, EnStakeUnStake? Type, int PageSize, int PageNo, EnStakingSlabType? Slab, EnStakingType? StakingType, long UserID)
        {
            try
            {
                ListStakingHistoryRes Resp = new ListStakingHistoryRes();
                Resp.PageNo = PageNo;
                PageNo = PageNo + 1;
                if (PageNo <= 0 || PageSize <= 0)
                {
                    Resp.ErrorCode = enErrorCode.InValidPage;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InValidPage;
                    return Resp;
                }
                int TotalCount = 0;
                var obj = _walletRepository1.GetStackingHistoryData(FromDate, ToDate, Type, PageSize, PageNo, Slab, StakingType, UserID, ref TotalCount);
                Resp.Stakings = obj;
                Resp.TotalCount = TotalCount;

                Resp.PageSize = PageSize;

                if (obj.Count > 0)
                {
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetStackingHistoryData", "WalletService", ex);
                throw ex;
            }
        }

        //public async Task<UnstakingDetailRes> GetPreUnstackingData(PreUnstackingConfirmationReq Request, long UserID)
        //{
        //    try
        //    {
        //        UnstakingDetailRes Resp = new UnstakingDetailRes();
        //        PreUnstackingConfirmationRes data = new PreUnstackingConfirmationRes();

        //        //PreUnstackingConfirmationRes UnstakingDetail = new PreUnstackingConfirmationRes();
        //        PreStackingConfirmationRes1 MaturityDetails = new PreStackingConfirmationRes1();
        //        PreStackingConfirmationRes StakingDetail = new PreStackingConfirmationRes();

        //        var HistoryData = await _TokenStakingHistoryCommonRepo.GetByIdAsync(Request.StakingHistoryId);
        //        if (HistoryData == null)
        //        {
        //            Resp.ErrorCode = enErrorCode.NotFound;
        //            Resp.ReturnCode = enResponseCode.Fail;
        //            Resp.ReturnMsg = EnResponseMessage.NotFound;
        //            return Resp;
        //        }
        //        if (Request.UnstakingType == EnUnstakeType.Full)
        //        {
        //            if (HistoryData.EnableStakingBeforeMaturity == 1)
        //            {
        //                if (UTC_To_IST() < HistoryData.MaturityDate)
        //                {
        //                    data.CreditAmount = HistoryData.StakingAmount - HistoryData.EnableStakingBeforeMaturityCharge;
        //                }
        //                else
        //                {
        //                    data.CreditAmount = HistoryData.StakingAmount;
        //                }
        //                data.BeforeMaturityChargeDeduction = HistoryData.EnableStakingBeforeMaturityCharge;
        //                data.StakingAmount = HistoryData.StakingAmount;
        //                data.StakingHistoryId = HistoryData.Id;
        //                Resp.UnstakingDetail = data;

        //                Resp.ReturnCode = enResponseCode.Success;
        //                Resp.ReturnMsg = EnResponseMessage.FindRecored;
        //                Resp.ErrorCode = enErrorCode.Success;
        //                return Resp;
        //            }
        //            else
        //            {
        //                Resp.ErrorCode = enErrorCode.UnstakingNotAllowed;
        //                Resp.ReturnCode = enResponseCode.Fail;
        //                Resp.ReturnMsg = EnResponseMessage.UnstakingNotAllowed;
        //                return Resp;
        //            }
        //        }
        //        else
        //        {
        //            if (Request.DegradePolicyDetailID <= 0)
        //            {
        //                Resp.ErrorCode = enErrorCode.DegradePolicyDetailIDrequired;
        //                Resp.ReturnCode = enResponseCode.Fail;
        //                Resp.ReturnMsg = EnResponseMessage.InvalidStakingPolicyDetailID;
        //                return Resp;
        //            }
        //            if (Request.Amount <= 0)
        //            {
        //                Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
        //                Resp.ReturnCode = enResponseCode.Fail;
        //                Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
        //                return Resp;
        //            }
        //            if (Request.ChannelId <= 0)
        //            {
        //                Resp.ErrorCode = enErrorCode.ChannelIDRequired;
        //                Resp.ReturnCode = enResponseCode.Fail;
        //                Resp.ReturnMsg = EnResponseMessage.InvalidChannel;
        //                return Resp;
        //            }

        //            var NewPolicyData = await _StakingPolicyCommonRepo.GetByIdAsync(Request.DegradePolicyDetailID);
        //            PreStackingConfirmationReq req = new PreStackingConfirmationReq();

        //            if (NewPolicyData == null)
        //            {
        //                Resp.ErrorCode = enErrorCode.NoDataFound;
        //                Resp.ReturnCode = enResponseCode.Fail;
        //                Resp.ReturnMsg = EnResponseMessage.NotFound;
        //                return Resp;
        //            }
        //            else
        //            {
        //                req.Amount = Request.Amount;
        //                req.PolicyDetailID = NewPolicyData.Id;
        //                var PreStakeRes = await GetPreStackingData(req, UserID);

        //                if (PreStakeRes.ErrorCode != enErrorCode.Success)
        //                {
        //                    Resp.ErrorCode = PreStakeRes.ErrorCode;
        //                    Resp.ReturnCode = PreStakeRes.ReturnCode;
        //                    Resp.ReturnMsg = PreStakeRes.ReturnMsg;
        //                    return Resp;
        //                }

        //                StakingDetail = PreStakeRes.StakingDetails;
        //                MaturityDetails = PreStakeRes.MaturityDetail;

        //                if (HistoryData.EnableStakingBeforeMaturity == 1)
        //                {
        //                    if (UTC_To_IST() < HistoryData.MaturityDate)
        //                    {
        //                        data.NewStakingAmountDeduction = Request.Amount;
        //                        data.CreditAmount = (HistoryData.StakingAmount - (HistoryData.EnableStakingBeforeMaturityCharge + MaturityDetails.Amount));
        //                    }
        //                    data.BeforeMaturityChargeDeduction = HistoryData.EnableStakingBeforeMaturityCharge;
        //                    data.StakingAmount = HistoryData.StakingAmount;
        //                    data.StakingHistoryId = HistoryData.Id;

        //                    Resp.UnstakingDetail = data;
        //                    Resp.NewMaturityDetail = MaturityDetails;
        //                    Resp.NewStakingDetails = StakingDetail;

        //                    Resp.ReturnCode = enResponseCode.Success;
        //                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
        //                    Resp.ErrorCode = enErrorCode.Success;
        //                    return Resp;
        //                }
        //                else
        //                {
        //                    Resp.ErrorCode = enErrorCode.UnstakingNotAllowed;
        //                    Resp.ReturnCode = enResponseCode.Fail;
        //                    Resp.ReturnMsg = EnResponseMessage.UnstakingNotAllowed;
        //                    return Resp;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetPreUnstackingData", "WalletService", ex);
        //        throw ex;
        //    }
        //}

        public async Task<UnstakingDetailRes> GetPreUnstackingData(PreUnstackingConfirmationReq Request, long UserID)
        {
            try
            {
                UnstakingDetailRes Resp = new UnstakingDetailRes();
                PreUnstackingConfirmationRes data = new PreUnstackingConfirmationRes();

                //PreUnstackingConfirmationRes UnstakingDetail = new PreUnstackingConfirmationRes();
                PreStackingConfirmationRes1 MaturityDetails = new PreStackingConfirmationRes1();
                PreStackingConfirmationRes StakingDetail = new PreStackingConfirmationRes();

                var HistoryData = await _TokenStakingHistoryCommonRepo.GetSingleAsync(item => item.Id == Request.StakingHistoryId && item.Status == 1);//status always 1
                if (HistoryData == null)
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    return Resp;
                }
                if (HistoryData.StakingType == 1)//fd
                {
                    if (Request.UnstakingType != EnUnstakeType.Full)
                    {
                        Resp.ErrorCode = enErrorCode.InvalidUnstakeType;
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.OnlyFullUnstakeAvailable;
                        return Resp;
                    }
                }
                if (Request.UnstakingType == EnUnstakeType.Full)
                {
                    if (HistoryData.EnableAutoUnstaking != 1)
                    {
                        Resp.ErrorCode = enErrorCode.FullUnstakingNotAvailable;
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.UnstakingNotAvailable;
                        return Resp;
                    }
                    if (UTC_To_IST() < HistoryData.MaturityDate)
                    {
                        data.CreditAmount = HistoryData.StakingAmount - HistoryData.EnableStakingBeforeMaturityCharge;
                    }
                    else
                    {
                        data.CreditAmount = HistoryData.StakingAmount;
                    }
                    data.BeforeMaturityChargeDeduction = HistoryData.EnableStakingBeforeMaturityCharge;
                    data.StakingAmount = HistoryData.StakingAmount;
                    data.StakingHistoryId = HistoryData.Id;
                    Resp.UnstakingDetail = data;

                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                    if (HistoryData.EnableStakingBeforeMaturity == 1)
                    {
                        return Resp;
                    }
                    else
                    {
                        Resp.ErrorCode = enErrorCode.UnstakingNotAllowed;
                        Resp.ReturnCode = enResponseCode.Success;
                        Resp.ReturnMsg = EnResponseMessage.UnstakingNotAllowed;
                        return Resp;
                    }
                }
                else
                {
                    if (Request.DegradePolicyDetailID <= 0)
                    {
                        Resp.ErrorCode = enErrorCode.DegradePolicyDetailIDrequired;
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidStakingPolicyDetailID;
                        return Resp;
                    }
                    if (Request.Amount <= 0)
                    {
                        Resp.ErrorCode = enErrorCode.InvalidStakingAmount;
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                        return Resp;
                    }
                    if (Request.ChannelId <= 0)
                    {
                        Resp.ErrorCode = enErrorCode.ChannelIDRequired;
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.InvalidChannel;
                        return Resp;
                    }

                    var NewPolicyData = await _StakingDetailCommonRepo.GetSingleAsync(i => i.Id == Request.DegradePolicyDetailID && i.Status == 1);
                    //var IsChargeType = await _StakingPolicyCommonRepo.GetByIdAsync(NewPolicyData.StakingPolicyID);
                    //if(IsChargeType.StakingType == 2)
                    //{
                    //    if(Request.Amount < HistoryData.StakingAmount)
                    //    {
                    //        Resp.ErrorCode = enErrorCode.ChannelIDRequired;
                    //        Resp.ReturnCode = enResponseCode.Fail;
                    //        Resp.ReturnMsg = EnResponseMessage.InvalidChannel;
                    //        return Resp;
                    //    }
                    //}
                    PreStackingConfirmationReq req = new PreStackingConfirmationReq();

                    if (NewPolicyData == null)
                    {
                        Resp.ErrorCode = enErrorCode.NoDataFound;
                        Resp.ReturnCode = enResponseCode.Fail;
                        Resp.ReturnMsg = EnResponseMessage.NotFound;
                        return Resp;
                    }
                    else
                    {
                        req.Amount = Request.Amount;
                        req.PolicyDetailID = NewPolicyData.Id;
                        var PreStakeRes = await GetPreStackingDataForDegrade(req, UserID);

                        if (PreStakeRes.ErrorCode != enErrorCode.Success)
                        {
                            Resp.ErrorCode = PreStakeRes.ErrorCode;
                            Resp.ReturnCode = PreStakeRes.ReturnCode;
                            Resp.ReturnMsg = PreStakeRes.ReturnMsg;
                            return Resp;
                        }
                        StakingDetail = PreStakeRes.StakingDetails;
                        MaturityDetails = PreStakeRes.MaturityDetail;
                        if (UTC_To_IST() < HistoryData.MaturityDate)
                        {
                            data.NewStakingAmountDeduction = Request.Amount;
                            data.CreditAmount = (HistoryData.StakingAmount - (HistoryData.EnableStakingBeforeMaturityCharge + MaturityDetails.Amount));
                        }
                        data.BeforeMaturityChargeDeduction = HistoryData.EnableStakingBeforeMaturityCharge;
                        data.StakingAmount = HistoryData.StakingAmount;
                        data.StakingHistoryId = HistoryData.Id;

                        Resp.UnstakingDetail = data;
                        Resp.NewMaturityDetail = MaturityDetails;
                        Resp.NewStakingDetails = StakingDetail;

                        Resp.ReturnCode = enResponseCode.Success;
                        Resp.ReturnMsg = EnResponseMessage.FindRecored;
                        Resp.ErrorCode = enErrorCode.Success;

                        if (HistoryData.EnableStakingBeforeMaturity == 1)
                        {
                            return Resp;
                        }
                        else
                        {
                            Resp.ErrorCode = enErrorCode.UnstakingNotAllowed;
                            Resp.ReturnCode = enResponseCode.Success;
                            Resp.ReturnMsg = EnResponseMessage.UnstakingNotAllowed;
                            return Resp;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetPreUnstackingData", "WalletService", ex);
                throw ex;
            }
        }

        public async Task<BizResponseClass> UserUnstackingRequest(UserUnstakingReq request, long UserID)
        {
            try
            {
                BizResponseClass Resp = new BizResponseClass();
                var NewPolicyObj = await _StakingDetailCommonRepo.GetSingleAsync(item => item.Id == request.StakingPolicyDetailId);
                var HistoryObj = await _TokenStakingHistoryCommonRepo.GetSingleAsync(item => item.Id == request.StakingHistoryId);

                if (request.StakingPolicyDetailId > 0 && NewPolicyObj == null)
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                    return Resp;
                }
                if (HistoryObj != null)
                {
                    if (request.Type != EnUnstakeType.Full)
                    {
                        if (NewPolicyObj.MinAmount >= HistoryObj.MinAmount)
                        {
                            Resp.ReturnCode = enResponseCode.Fail;
                            Resp.ReturnMsg = EnResponseMessage.InvalidSlabSelectionForUnstak;
                            Resp.ErrorCode = enErrorCode.InvalidSlabSelection;
                            return Resp;
                        }
                    }
                    DateTime TodayDate = UTC_To_IST().AddHours(0).AddMinutes(0).AddSeconds(0);
                    if (HistoryObj.EnableStakingBeforeMaturity != 1 || HistoryObj.MaturityDate > TodayDate)
                    {
                        TokenUnStakingHistory obj = new TokenUnStakingHistory
                        {
                            TokenStakingHistoryID = HistoryObj.Id,
                            UnstakeType = Convert.ToInt16(request.Type),
                            Status = Convert.ToInt16(ServiceStatus.InActive),
                            DegradeStakingHistoryRequestID = request.StakingPolicyDetailId,
                            DegradeStakingAmount = request.StakingAmount,
                            ChargeBeforeMaturity = HistoryObj.EnableStakingBeforeMaturityCharge,
                            InterestCreditedValue = 0,
                            AmountCredited = 0,
                            CreatedBy = UserID,
                            CreatedDate = UTC_To_IST()
                        };
                        await _TokenUnstakingHistoryCommonRepo.AddAsync(obj);

                        HistoryObj.Status = 4;
                        HistoryObj.Remarks = "Requested For Unstaking To Admin";
                        HistoryObj.UpdatedBy = UserID;
                        HistoryObj.UpdatedDate = UTC_To_IST();
                        _TokenStakingHistoryCommonRepo.UpdateWithAuditLog(HistoryObj);

                        Resp.ReturnCode = enResponseCode.Success;
                        Resp.ReturnMsg = EnResponseMessage.UnstakingSuccessfully;
                        Resp.ErrorCode = enErrorCode.Success;
                    }
                    else
                    {
                        var data = _walletSPRepositories.Callsp_UnstakingSchemeRequest(request, UserID, 0);
                        if (data != null)
                        {
                            Resp.ReturnCode = data.ReturnCode;
                            Resp.ReturnMsg = data.ReturnMsg;
                            Resp.ErrorCode = data.ErrorCode;
                        }
                        else
                        {
                            Resp.ReturnCode = enResponseCode.Fail;
                            Resp.ReturnMsg = EnResponseMessage.InternalError;
                            Resp.ErrorCode = enErrorCode.InternalError;
                        }
                    }
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("UserUnstackingRequest", "WalletService", ex);
                throw ex;
            }
        }

        #endregion

        #region Wallet Sharing Methods
        public async Task<ListWalletMasterRes> ListWalletMasterResponseNew(long UserId, string Coin)
        {
            ListWalletMasterRes Resp = new ListWalletMasterRes();
            try
            {
                var data = await _walletRepository1.ListWalletMasterResponseNew(UserId, Coin);
                Resp.Data = data;
                if (data.Count > 0)
                {
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public ListWalletResNew GetWalletByCoinNew(long userid, string coin)
        {
            ListWalletResNew listWalletResponse = new ListWalletResNew();
            try
            {
                var walletResponse = _walletRepository1.GetWalletMasterResponseByCoinNew(userid, coin).GetAwaiter().GetResult();
                var UserPrefobj = _UserPreferencescommonRepository.FindBy(item => item.UserID == userid && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                if (walletResponse.Count == 0)
                {
                    listWalletResponse.ReturnCode = enResponseCode.Fail;
                    listWalletResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    if (UserPrefobj != null)
                    {
                        listWalletResponse.IsWhitelisting = UserPrefobj.IsWhitelisting;
                    }
                    else
                    {
                        listWalletResponse.IsWhitelisting = 0;
                    }
                    listWalletResponse.Wallets = walletResponse;
                    listWalletResponse.ReturnCode = enResponseCode.Success;
                    listWalletResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    listWalletResponse.ErrorCode = enErrorCode.Success;

                }
                return listWalletResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        public ListWalletResNew GetWalletByIdNew(long userid, string walletId)
        {
            ListWalletResNew listWalletResponse = new ListWalletResNew();
            try
            {
                var walletResponse = _walletRepository1.GetWalletMasterResponseByIdNew(userid, walletId).GetAwaiter().GetResult();
                if (walletResponse.Count == 0)
                {
                    listWalletResponse.ReturnCode = enResponseCode.Fail;
                    listWalletResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletResponse.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    listWalletResponse.Wallets = walletResponse;
                    listWalletResponse.ReturnCode = enResponseCode.Success;
                    listWalletResponse.ReturnMsg = EnResponseMessage.FindRecored;
                    listWalletResponse.ErrorCode = enErrorCode.Success;
                }
                return listWalletResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                listWalletResponse.ReturnCode = enResponseCode.InternalError;
                return listWalletResponse;
            }
        }

        public ListAllBalanceTypeWiseRes GetAllBalancesTypeWiseNew(long userId, string WalletType)
        {
            try
            {
                ListAllBalanceTypeWiseRes res = new ListAllBalanceTypeWiseRes();

                List<AllBalanceTypeWiseRes> Response = new List<AllBalanceTypeWiseRes>();
                res.BizResponseObj = new Core.ApiModels.BizResponseClass();

                var listWallet = _walletRepository1.GetWalletMasterResponseByCoinNew(userId, WalletType).GetAwaiter().GetResult();
                if (listWallet.Count() == 0)
                {
                    res.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    res.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    res.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    return res;
                }
                for (int i = 0; i <= listWallet.Count - 1; i++)
                {
                    AllBalanceTypeWiseRes a = new AllBalanceTypeWiseRes();
                    a.Wallet = new WalletResponse();
                    a.Wallet.Balance = new Balance();

                    //2019-2-18 added condi for only used trading wallet
                    var wallet = _commonRepository.GetSingle(item => item.AccWalletID == listWallet[i].AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                    var response = _walletRepository1.GetAllBalancesNew(userId, wallet.Id);

                    a.Wallet.AccWalletID = listWallet[i].AccWalletID;
                    a.Wallet.PublicAddress = listWallet[i].PublicAddress;
                    a.Wallet.WalletName = listWallet[i].WalletName;
                    a.Wallet.IsDefaultWallet = listWallet[i].IsDefaultWallet;
                    a.Wallet.TypeName = listWallet[i].CoinName;

                    a.Wallet.Balance = response;
                    Response.Add(a);
                }
                if (Response.Count() == 0)
                {
                    res.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    res.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    res.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    return res;
                }
                res.Wallets = Response;
                res.BizResponseObj.ReturnCode = enResponseCode.Success;
                res.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                res.BizResponseObj.ErrorCode = enErrorCode.Success;
                return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public AllBalanceResponse GetAllBalancesNew(long userid, string walletId)
        {

            AllBalanceResponse allBalanceResponse = new AllBalanceResponse();
            allBalanceResponse.BizResponseObj = new BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    allBalanceResponse.BizResponseObj.ErrorCode = enErrorCode.InvalidWallet;
                    allBalanceResponse.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    allBalanceResponse.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return allBalanceResponse;
                }
                var response = _walletRepository1.GetAllBalancesNew(userid, wallet.Id);
                if (response == null)
                {
                    allBalanceResponse.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    allBalanceResponse.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    allBalanceResponse.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return allBalanceResponse;
                }
                allBalanceResponse.BizResponseObj.ReturnCode = enResponseCode.Success;
                allBalanceResponse.BizResponseObj.ErrorCode = enErrorCode.Success;
                allBalanceResponse.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                allBalanceResponse.Balance = response;
                //vsolanki 2018-10-27 //for withdraw limit
                var limit = _LimitcommonRepository.GetSingle(item => item.TrnType == 2 && item.WalletId == wallet.Id);
                if (limit == null)
                {
                    allBalanceResponse.WithdrawalDailyLimit = 0;
                }
                else if (limit.LimitPerDay < 0) //ntrivedi 21-11-2018 if limit null then exception so add else if instead of only if
                {
                    allBalanceResponse.WithdrawalDailyLimit = 0;
                }
                else
                {
                    allBalanceResponse.WithdrawalDailyLimit = limit.LimitPerDay;

                }
                // var wallet = _commonRepository.GetById(walletId);
                var walletType = _WalletTypeMasterRepository.GetById(wallet.WalletTypeID);
                allBalanceResponse.WalletType = walletType.WalletTypeName;
                allBalanceResponse.WalletName = wallet.Walletname;
                allBalanceResponse.IsDefaultWallet = wallet.IsDefaultWallet;
                return allBalanceResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ListBalanceResponse GetAvailableBalanceNew(long userid, string walletId)
        {
            ListBalanceResponse Response = new ListBalanceResponse();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                //2019-2-18 added condi for only used trading wallet
                var wallet = _commonRepository.GetSingle(item => item.AccWalletID == walletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWalletId;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }
                var response = _walletRepository1.GetAvailableBalanceNew(userid, wallet.Id);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TotalBalanceRes GetAllAvailableBalanceNew(long userid)
        {
            TotalBalanceRes Response = new TotalBalanceRes();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAllAvailableBalanceNew(userid);
                decimal total = _walletRepository1.GetTotalAvailbleBalNew(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.Response = response;
                Response.TotalBalance = total;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public BalanceResponseWithLimit GetAvailbleBalTypeWiseNew(long userid)
        {
            BalanceResponseWithLimit Response = new BalanceResponseWithLimit();
            Response.BizResponseObj = new Core.ApiModels.BizResponseClass();
            try
            {
                var response = _walletRepository1.GetAvailbleBalTypeWiseNew(userid);
                if (response.Count == 0)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.NotFound;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.NotFound;
                    return Response;
                }
                decimal total = _walletRepository1.GetTotalAvailbleBalNew(userid);
                //vsolanki 26-10-2018
                var walletType = _WalletTypeMasterRepository.GetSingle(item => item.IsDefaultWallet == 1);
                if (walletType == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidCoinName;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidCoin;
                    return Response;
                }
                var wallet = _commonRepository.GetSingle(item => item.IsDefaultWallet == 1 && item.WalletTypeID == walletType.Id && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (wallet == null)
                {
                    Response.BizResponseObj.ErrorCode = enErrorCode.InvalidWallet;
                    Response.BizResponseObj.ReturnCode = enResponseCode.Fail;
                    Response.BizResponseObj.ReturnMsg = EnResponseMessage.InvalidWallet;
                    return Response;
                }

                var limit = _LimitcommonRepository.GetSingle(item => item.TrnType == 9 && item.WalletId == wallet.Id);//for withdraw

                if (limit == null)
                {
                    Response.DailyLimit = 0;

                }
                else
                {
                    Response.DailyLimit = limit.LimitPerDay;

                }
                //get amt from  tq
                var amt = _walletRepository1.GetTodayAmountOfTQ(userid, wallet.Id);

                if (response.Count == 0)
                {
                    Response.UsedLimit = 0;

                }
                else
                {
                    Response.UsedLimit = amt;
                }
                Response.BizResponseObj.ReturnCode = enResponseCode.Success;
                Response.BizResponseObj.ReturnMsg = EnResponseMessage.FindRecored;
                Response.BizResponseObj.ErrorCode = enErrorCode.Success;
                Response.Response = response;
                Response.TotalBalance = total;
                return Response;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion

        //public int AddBulkData()
        //{
        //    try
        //    {
        //        var data = _walletRepository1.AddBulkData();
        //        return data;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public async Task<BizResponseClass> AddConvertedAddress(string address, string convertedAddress, long id)
        {
            BizResponseClass Resp = new BizResponseClass();
            try
            {
                var IsExist = await _addressMstRepository.GetSingleAsync(item => item.Address == address && item.CreatedBy == id);
                if (IsExist != null)
                {
                    IsExist.Address = convertedAddress;
                    IsExist.UpdatedBy = id;
                    IsExist.UpdatedDate = UTC_To_IST();
                    _addressMstRepository.UpdateWithAuditLog(IsExist);

                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.RecordAdded;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("AddConvertedAddress", "WalletService", ex);
                throw ex;
            }
        }

        #region ColdWallet
        //2019-1-15 create cold wallet
        public async Task<BizResponseClass> ColdWallet(string Coin, InsertColdWalletRequest req, long UserId)
        {
            try
            {
                var providerdata = _webApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest { SMSCode = Coin.ToLower(), amount = 0, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.GenerateColdWallet) });
                transactionProviderResponses = await providerdata;

                var apiconfig = _thirdPartyCommonRepository.GetByIdAsync(transactionProviderResponses[0].ThirPartyAPIID);
                thirdPartyAPIConfiguration = await apiconfig;
                //request
                string reqBody = "{\"label\":\"" + req.WalletLabel + "\",\"passphrase\":\"" + req.Password + "\"}";
                thirdPartyAPIRequest = _getWebRequest.MakeWebRequestColdWallet(transactionProviderResponses[0].RouteID, transactionProviderResponses[0].ThirPartyAPIID, transactionProviderResponses[0].SerProDetailID, reqBody, Coin);
                ////response
                string apiResponse = _webApiSendRequest.SendAPIRequestAsyncWallet(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.MethodType);
                //WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID);
                var jsonResponse = JsonConvert.DeserializeObject<RootObject>(apiResponse);
                var jsonErrorResponse = JsonConvert.DeserializeObject<ErrorRootObject>(apiResponse);
                if (jsonErrorResponse.error != null)
                {
                    HelperForLog.WriteLogForConnection(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, jsonErrorResponse.error + "Msg" + jsonErrorResponse.message);
                    return new BizResponseClass { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg, ErrorCode = enErrorCode.InternalError };
                }
                //insert into walletmaster
                #region InsertIntoDB
                WalletMaster wm = new WalletMaster();
                wm.CreatedDate = UTC_To_IST();
                wm.CreatedBy = UserId;
                wm.UpdatedBy = UserId;
                wm.Status = 10;
                wm.Balance = jsonResponse.balance;
                wm.WalletTypeID = _WalletTypeMasterRepository.GetSingle(i => i.WalletTypeName == Coin).Id;
                wm.IsValid = true;
                wm.UpdatedDate = UTC_To_IST();
                wm.UserID = UserId;
                wm.Walletname = req.WalletLabel;
                wm.AccWalletID = RandomGenerateAccWalletId(UserId, 0);
                wm.IsDefaultWallet = 0;
                wm.PublicAddress = jsonResponse.receiveAddress.address;
                wm.InBoundBalance = 0;
                wm.OutBoundBalance = 0;
                wm.ExpiryDate = UTC_To_IST().AddYears(1);
                wm.OrgID = 1;
                wm.WalletUsageType = Convert.ToInt16(EnWalletUsageType.Cold_Wallet);
                var wMaster = _commonRepository.Add(wm);
                ColdWalletMaster cm = new ColdWalletMaster();
                cm.CreatedDate = UTC_To_IST();
                cm.CreatedBy = UserId;
                cm.UpdatedBy = UserId;
                cm.Status = 10;
                cm.UpdatedDate = UTC_To_IST();
                cm.KeyId1 = jsonResponse.keys[0];
                cm.KeyId2 = jsonResponse.keys[1];
                cm.KeyId3 = jsonResponse.keys[2];
                cm.BackUpKey = jsonResponse.keySignatures.backupPub;
                cm.PublicKey = jsonResponse.keySignatures.bitgoPub;
                cm.UserKey = "";
                cm.Recoverable = Convert.ToInt16(jsonResponse.recoverable);
                cm.WalletId = wMaster.Id;
                _ColdWalletMaster.Add(cm);
                #endregion
                return new BizResponseClass { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateWalletSuccessMsg, ErrorCode = enErrorCode.Success };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion

        public StatisticsDetailData GetMonthwiseWalletStatistics(long UserID, short Month, short Year)
        {
            try
            {
                //UserID = 71;
                //Month = 1;
                //Year = 2019;
                StatisticsDetailData Resp = new StatisticsDetailData();
                var trandata = _walletRepository1.GetWalletStatisticsdata(UserID, Month, Year);
                var baldata = _walletSPRepositories.Callsp_GetWalletBalanceStatistics(UserID, Month, Year);

                if (trandata.Count > 0 && baldata != null)
                {
                    WalletStatisticsData balobj = new WalletStatisticsData();
                    balobj.StartingBalance = baldata.StartingBalance;
                    balobj.EndingBalance = baldata.EndingBalance;
                    balobj.TranAmount = trandata;
                    Resp.Balances = balobj;
                    Resp.BaseCurrency = _configuration["BaseCurrencyName"].ToString();

                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetMonthwiseWalletStatistics", "WalletService", ex);
                throw ex;
            }
        }

        public StatisticsDetailData2 GetYearwiseWalletStatistics(long UserID, short Year)
        {
            try
            {
                //UserID = 71;
                //Month = 1;
                //Year = 2019;
                StatisticsDetailData2 Resp = new StatisticsDetailData2();
                var trandata = _walletRepository1.GetYearlyWalletStatisticsdata(UserID, Year).GroupBy(e => e.Month);
                var baldata = _walletSPRepositories.Callsp_GetWalletBalanceStatistics(UserID, 0, Year);
                //var groupedByZone = trandata.Where(t => t.TotalCount > 0).GroupBy(t => t.Month);
                //string json = Newtonsoft.Json.JsonConverter.Se
                if (trandata != null && baldata != null)
                {
                    WalletStatisticsData2 balobj = new WalletStatisticsData2();
                    TempClass Monthwise = new TempClass();
                    List<MonthWiseData> Month;
                    List<WalletTransactiondata> data;
                    balobj.StartingBalance = baldata.StartingBalance;
                    balobj.EndingBalance = baldata.EndingBalance;
                    Month = new List<MonthWiseData>();
                    foreach (var monthdata in trandata)
                    {
                        data = new List<WalletTransactiondata>();
                        foreach (var x in monthdata)
                        {
                            data.Add(new WalletTransactiondata()
                            {
                                TotalAmount = x.TotalAmount,
                                TotalCount = x.TotalCount,
                                TrnTypeId = x.TrnTypeID,
                                TrnTypeName = x.TrnTypeName
                            });
                        }
                        Month.Add(new MonthWiseData()
                        {
                            Data = data,
                            Month = monthdata.Key
                        });

                    }
                    Monthwise.TranAmount = Month;
                    balobj.MonthwiseData = Monthwise;
                    //Monthwise.Month = Month;
                    //balobj.TranAmount = trandata;
                    Resp.Balances = balobj;
                    Resp.BaseCurrency = _configuration["BaseCurrencyName"].ToString();
                    //var List<>
                    //for(int i = 0; i<balobj.TranAmount.Count;i++)
                    //{
                    //    if(balobj.TranAmount[i].Month == balobj.TranAmount[i+1].Month)
                    //    {

                    //    }
                    //}
                    //foreach(var bal in balobj.TranAmount)
                    //{

                    //}
                    //var respObj = JsonConvert.SerializeObject(Resp);
                    //dynamic dynJson = JsonConvert.DeserializeObject(respObj);
                    //foreach (var item in dynJson)
                    //{

                    //}

                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                    Resp.ErrorCode = enErrorCode.Success;
                }
                else
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetYearwiseWalletStatistics", "WalletService", ex);
                throw ex;
            }
        }

        #region ERC20

        public CreateWalletAddressRes CreateERC20Address(long UserId, string Coin, string AccWalletId, short IsLocal = 0)
        {
            try
            {
                UserActivityLog activityLog = new UserActivityLog();
                string password = "";
                string sitename = null;
                string siteid = null;
                string Respaddress = null;

                var wallettype = _WalletTypeMasterRepository.GetSingle(t => t.WalletTypeName == Coin && t.IsLocal == IsLocal);
                if (wallettype == null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidCoinName, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidCoin };
                }
                //2019-2-18 added condi for only used trading wallet
                var walletMasterobj = _commonRepository.GetSingle(item => item.AccWalletID == AccWalletId && item.Status == Convert.ToInt16(ServiceStatus.Active) && item.WalletTypeID == wallettype.Id && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (walletMasterobj == null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                }

                var addressObj = _addressMstRepository.GetSingle(i => i.WalletId == walletMasterobj.Id && i.Status == 1);
                if (addressObj != null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AddressExist };
                }

                var providerdata = _webApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest { SMSCode = Coin.ToLower(), amount = 0, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.Generate_Address) });

                transactionProviderResponses = providerdata.GetAwaiter().GetResult();
                if (transactionProviderResponses == null || transactionProviderResponses.Count == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.ItemNotFoundForGenerateAddress, ReturnCode = enResponseCode.Fail, ReturnMsg = "Please try after sometime." };
                }
                if (transactionProviderResponses[0].ThirPartyAPIID == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                var apiconfig = _thirdPartyCommonRepository.GetById(transactionProviderResponses[0].ThirPartyAPIID);

                thirdPartyAPIConfiguration = apiconfig;
                if (thirdPartyAPIConfiguration == null || transactionProviderResponses.Count == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                password = RandomGeneratePaasword(UserId);
                sitename = _configuration["sitename"].ToString();
                siteid = _configuration["site_id"].ToString();

                thirdPartyAPIRequest = _getWebRequest.MakeWebRequestERC20(transactionProviderResponses[0].RouteID, transactionProviderResponses[0].ThirPartyAPIID, transactionProviderResponses[0].SerProDetailID, password, sitename, siteid);
                string apiResponse = _webApiSendRequest.SendAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.MethodType);
                //string apiResponse = _webApiSendRequest.SendJsonRpcAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody);

                // parse response logic 

                WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID, 0);
                if (ParsedResponse.Status != enTransactionStatus.Success)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
                }
                Respaddress = ParsedResponse.Param1;
                var Key = ParsedResponse.Param2;
                if (Respaddress != null)
                {
                    string responseString = Respaddress;
                    var Obj = _walletRepository1.AddAddressIntoDB(UserId, responseString, ParsedResponse.TrnRefNo, Key, transactionProviderResponses[0].SerProDetailID, IsLocal);
                    if (Obj == true)
                    {
                        #region SMS_Email
                        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.GenerateAddressNotification);
                        ActivityNotification.Param1 = walletMasterobj.Walletname;
                        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                        SMSSendAsyncV1(EnTemplateType.SMS_WalletAddressCreated, walletMasterobj.UserID.ToString(), walletMasterobj.Walletname);
                        Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletAddressCreated, walletMasterobj.UserID.ToString(), wallettype.WalletTypeName, walletMasterobj.Walletname, UTC_To_IST().ToString(), walletMasterobj.PublicAddress, walletMasterobj.Balance.ToString()),
                           () => _signalRService.SendActivityNotificationV2(ActivityNotification, walletMasterobj.UserID.ToString(), 2)
                           );
                        #endregion

                        return new CreateWalletAddressRes { address = responseString, ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateAddressSuccessMsg };
                    }
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
                }
                return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateERC20Address", "WalletService", ex);
                throw ex;
            }
        }

        public CreateWalletAddressRes CreateNeoAddress(long UserId, string Coin, string AccWalletId, short IsLocal = 0)
        {
            try
            {
                UserActivityLog activityLog = new UserActivityLog();
                string password = "";
                string sitename = null;
                string siteid = null;
                string Respaddress = null;

                var wallettype = _WalletTypeMasterRepository.GetSingle(t => t.WalletTypeName == Coin && t.IsLocal == IsLocal);
                if (wallettype == null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidCoinName, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidCoin };
                }
                //2019-2-18 added condi for only used trading wallet
                var walletMasterobj = _commonRepository.GetSingle(item => item.AccWalletID == AccWalletId && item.Status == Convert.ToInt16(ServiceStatus.Active) && item.WalletTypeID == wallettype.Id && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (walletMasterobj == null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidWallet, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet };
                }

                var addressObj = _addressMstRepository.GetSingle(i => i.WalletId == walletMasterobj.Id && i.Status == 1);
                if (addressObj != null)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressExist, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AddressExist };
                }

                var providerdata = _webApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest { SMSCode = Coin.ToLower(), amount = 0, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.Generate_Address) });

                transactionProviderResponses = providerdata.GetAwaiter().GetResult();
                if (transactionProviderResponses == null || transactionProviderResponses.Count == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.ItemNotFoundForGenerateAddress, ReturnCode = enResponseCode.Fail, ReturnMsg = "Please try after sometime." };
                }
                if (transactionProviderResponses[0].ThirPartyAPIID == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                var apiconfig = _thirdPartyCommonRepository.GetById(transactionProviderResponses[0].ThirPartyAPIID);

                thirdPartyAPIConfiguration = apiconfig;
                if (thirdPartyAPIConfiguration == null || transactionProviderResponses.Count == 0)
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.InvalidThirdpartyID, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ItemOrThirdprtyNotFound };
                }
                password = RandomGeneratePaasword(UserId);
                sitename = _configuration["sitename"].ToString();
                siteid = _configuration["site_id"].ToString();

                thirdPartyAPIRequest = _getWebRequest.MakeWebRequestERC20(transactionProviderResponses[0].RouteID, transactionProviderResponses[0].ThirPartyAPIID, transactionProviderResponses[0].SerProDetailID, password, sitename, siteid);
                //string apiResponse = _webApiSendRequest.SendAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody, thirdPartyAPIConfiguration.ContentType, 180000, thirdPartyAPIRequest.keyValuePairsHeader, thirdPartyAPIConfiguration.MethodType);
                string apiResponse = _webApiSendRequest.SendJsonRpcAPIRequestAsync(thirdPartyAPIRequest.RequestURL, thirdPartyAPIRequest.RequestBody);

                // parse response logic 

                WebAPIParseResponseCls ParsedResponse = _WebApiParseResponse.TransactionParseResponse(apiResponse, transactionProviderResponses[0].ThirPartyAPIID, 0);

                Respaddress = ParsedResponse.Param1;
                if (string.IsNullOrEmpty(Respaddress))
                {
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
                }
                var Key = ParsedResponse.Param2;
                if (Respaddress != null)
                {
                    string responseString = Respaddress;
                    var Obj = _walletRepository1.AddAddressIntoDB(UserId, responseString, ParsedResponse.TrnRefNo, Key, transactionProviderResponses[0].SerProDetailID, IsLocal);
                    if (Obj == true)
                    {
                        #region SMS_Email
                        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.GenerateAddressNotification);
                        ActivityNotification.Param1 = walletMasterobj.Walletname;
                        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                        SMSSendAsyncV1(EnTemplateType.SMS_WalletAddressCreated, walletMasterobj.UserID.ToString(), walletMasterobj.Walletname);
                        Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletAddressCreated, walletMasterobj.UserID.ToString(), wallettype.WalletTypeName, walletMasterobj.Walletname, UTC_To_IST().ToString(), walletMasterobj.PublicAddress, walletMasterobj.Balance.ToString()),
                           () => _signalRService.SendActivityNotificationV2(ActivityNotification, walletMasterobj.UserID.ToString(), 2)
                           );
                        #endregion

                        return new CreateWalletAddressRes { address = responseString, ErrorCode = enErrorCode.Success, ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.CreateAddressSuccessMsg };
                    }
                    return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
                }
                return new CreateWalletAddressRes { ErrorCode = enErrorCode.AddressGenerationFailed, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.CreateWalletFailMsg };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateERC20Address", "WalletService", ex);
                throw ex;
            }
        }

        public string RandomGeneratePaasword(long userID)
        {
            try
            {
                long maxValue = 99999;
                long minValue = 10000;
                long x = (long)Math.Round(random.NextDouble() * (maxValue - minValue - 1)) + minValue;
                string userIDStr = x.ToString() + userID.ToString().PadLeft(5, '0');
                return userIDStr;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        #endregion

        #region Leader Board 

        public ListLeaderBoardRes LeaderBoard(int? UserCount)
        {
            try
            {
                ListLeaderBoardRes Resp = new ListLeaderBoardRes();
                var list = _profileConfigurationService.GetFrontLeaderList(0, 0, 2);
                list = _profileConfigurationService.GetFrontLeaderList(0, list.TotalCount, 2);
                long[] LeaderId = list.LeaderList.Select(x => (long)x.LeaderId).ToArray();

                var data = _walletRepository1.LeaderBoard(UserCount, LeaderId);
                if (data.Count() == 0)
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                    return Resp;
                }
                Resp.Data = data;
                Resp.ReturnCode = enResponseCode.Success;
                Resp.ReturnMsg = EnResponseMessage.FindRecored;
                Resp.ErrorCode = enErrorCode.Success;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetYearwiseWalletStatistics", "WalletService", ex);
                throw ex;
            }
        }

        //2019-2-4
        public ListLeaderBoardRes LeaderBoardWeekWiseTopFive(long[] LeaderId, DateTime Date, short IsGainer, int Count)
        {
            try
            {
                ListLeaderBoardRes Resp = new ListLeaderBoardRes();
                var data = _walletRepository1.LeaderBoardWeekWiseTopFive(LeaderId, Date, IsGainer, Count);
                if (data.Count() == 0)
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    Resp.ErrorCode = enErrorCode.NoDataFound;
                    return Resp;
                }
                Resp.Data = data;
                Resp.ReturnCode = enResponseCode.Success;
                Resp.ReturnMsg = EnResponseMessage.FindRecored;
                Resp.ErrorCode = enErrorCode.Success;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LeaderBoardWeekWiseTopFive", "WalletService", ex);
                throw ex;
            }
        }
        #endregion

        public GetTransactionPolicyRes ListTransactionPolicy(long TrnType, long userId)
        {
            GetTransactionPolicyRes Resp = new GetTransactionPolicyRes();
            try
            {
                var obj = _walletRepository1.ListTransactionPolicy(TrnType, userId);
                Resp.Data = obj;
                if (obj != null)
                {
                    Resp.ErrorCode = enErrorCode.Success;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.FindRecored;
                }
                else
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                }
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw;
            }
        }

        // khushali 23-03-2019 For Success and Debit Reocn Process
        public async Task<WalletDrCrResponse> GetDebitWalletWithCharge(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                WalletMaster dWalletobj;
                string remarks = "";
                WalletTypeMaster walletTypeMaster;
                WalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("GetDebitWalletWithCharge", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

                Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
                if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty)
                {
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = timestamp };
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = timestamp }, "Debit");
                }
                //2019-2-18 added condi for only used trading wallet
                Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                dWalletobj = await dWalletobjTask;
                //var msg = _commonWalletFunction.CheckWalletLimitAsync(enWalletLimitType.TradingLimit, dWalletobj.Id, amount);
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = timestamp }, "Debit");
                }
                userID = dWalletobj.UserID;
                //ntrivedi 15-02-2019 removed and moved to stored procedure
                //var errorCode = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);
                //Task<bool> flagTask = CheckUserBalanceAsync(dWalletobj.Id);
                var flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }

                HelperForLog.WriteLogIntoFileAsync("GetDebitWalletWithCharge", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                //CheckUserBalanceFlag = await flagTask;
                CheckUserBalanceFlag = await flagTask;

                HelperForLog.WriteLogIntoFileAsync("GetDebitWalletWithCharge", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
                if (dWalletobj.Balance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }

                //Wallet Limit Validation
                //var limitres = await msg;
                //if (limitres != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletLimitExceed, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse
                //    {
                //        ReturnCode = enResponseCode.Fail,
                //        ReturnMsg = EnResponseMessage.WalletLimitExceed,
                //        ErrorCode = limitres,
                //        TrnNo = objTQ.TrnNo,
                //        Status = objTQ.Status,
                //        StatusMsg = objTQ.StatusMsg
                //    }, "DebitForHold");
                //}

                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                //HelperForLog.WriteLogIntoFileAsync("GetDebitWalletWithCharge", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetDebitWalletWithCharge", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                #region Commented Code
                //vsolanki 208-11-1 ntrivedi at transaction time transaction limit is checked so duplicate so remove for time 
                //var charge = GetServiceLimitChargeValue(routeTrnType, coinName);
                //if (charge.MaxAmount < amount && charge.MinAmount > amount && charge.MaxAmount != 0 && charge.MinAmount != 0)
                //{
                //    var msg1 = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg;
                //    msg1 = msg1.Replace("@MIN", charge.MinAmount.ToString());
                //    msg1 = msg1.Replace("@MAX", charge.MaxAmount.ToString());
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, msg1, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = msg1, ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax }, "Debit");
                //}


                #endregion
                //int count = await countTask;
                CheckTrnRefNoRes count1 = await countTask1;
                if (count1.TotalCount != 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                //if (count != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetDebitWalletWithCharge", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);


                BizResponseClass bizResponse = _walletSPRepositories.Callsp_ReconSuccessAndDebitWalletWithCharge(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo, enWalletDeductionType);

                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    try
                    {
                        decimal charge = _walletRepository1.FindChargeValueHold(timestamp, TrnRefNo);
                        long walletId = _walletRepository1.FindChargeValueWalletId(timestamp, TrnRefNo);
                        WalletMaster ChargeWalletObj = null;
                        WalletTypeMaster ChargewalletType = null;
                        //charge = 0;
                        if (charge > 0 && walletId > 0)
                        {
                            ChargeWalletObj = _commonRepository.GetById(walletId);
                            ChargewalletType = _WalletTypeMasterRepository.GetSingle(i => i.Id == ChargeWalletObj.WalletTypeID);
                        }
                        Task.Run(() => WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, charge, walletId, ChargeWalletObj, ChargewalletType));
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + "Timestamp:" + timestamp, this.GetType().Name, ex);
                    }
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "DebitForHold");

                }
                else
                {
                    // ntrivedi 12-02-2018 status message changed
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "DebitForHold");
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = EnResponseMessage.InternalError, TimeStamp = timestamp }, "DebitForHold");
                //throw ex;
            }
        }

        //khushali 11-04-2019 Process for Release Stuck Order - wallet side   

        public enTransactionStatus CheckTransactionSuccessOrNot(long TrnRefNo)
        {
            try
            {
                return _walletRepository1.CheckTransactionSuccessOrNot(TrnRefNo);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
        //Rita for check settlement process status
        public bool CheckSettlementProceed(long MakerTrnNo, long TakerTrnNo)
        {
            try
            {
                return _walletRepository1.CheckSettlementProceed(MakerTrnNo, TakerTrnNo);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public ListUserUnstakingReq2 GetUnstackingCroneData()
        {
            try
            {
                ListUserUnstakingReq2 Resp = new ListUserUnstakingReq2();
                var data = _walletRepository1.GetStakingdataForChrone();
                Resp.Data = data;
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public int CheckActivityLog(long UserId, int Type)
        {
            try
            {
                var data = _walletRepository1.CheckActivityLog(UserId, Type);
                if(data==null)
                {
                    return 0;//true                
                }
                var date = Helpers.UTC_To_IST();
                //int hour = (date - data.Date).Hours;
                TimeSpan difference = date - data.Date;
                double diffHour = difference.TotalHours;
                var activityhourObj = _ActivityTypeHour.GetSingle(i => i.ActivityType == Type);
                if (activityhourObj == null)
                {
                    return 1;
                }
                if (data != null)
                {
                    if (activityhourObj.ActivityHour >= diffHour)//Convert.ToInt32(_configuration["WithdrawHour"])
                    {
                        return activityhourObj.ActivityHour;//false
                    }
                }
                return 0;//true                
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }
    }
}