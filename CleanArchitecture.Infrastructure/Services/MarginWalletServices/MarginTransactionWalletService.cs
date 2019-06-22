﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.MarginEntitiesWallet;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.MarginWalletServices
{
    public class MarginTransactionWalletService : IMarginTransactionWallet
    {
        //private readonly ISignalRService _signalRService;
        //private readonly IMarginSPRepositories _walletSPRepositories;
        //private readonly UserManager<ApplicationUser> _userManager;

        #region DI
        //ThirdPartyAPIConfiguration thirdPartyAPIConfiguration;
        //ThirdPartyAPIRequest thirdPartyAPIRequest;

        //private readonly ILogger<WalletService> _log;
        //private IProfileConfigurationService _profileConfigurationService;
        //private readonly ICommonRepository<WalletTrnLimitConfiguration> _walletTrnLimitConfiguration;
        //private readonly ICommonRepository<StakingChargeMaster> _StakingChargeCommonRepo;
        //private readonly ICommonRepository<StakingPolicyMaster> _StakingPolicyCommonRepo;
        //private readonly ICommonRepository<StakingPolicyDetail> _StakingDetailCommonRepo;
        //private readonly ICommonRepository<TokenStakingHistory> _TokenStakingHistoryCommonRepo;
        //private readonly ICommonRepository<TokenUnStakingHistory> _TokenUnstakingHistoryCommonRepo;
        //private readonly ICommonRepository<UserActivityLog> _UserActivityLogCommonRepo;
        //private readonly ICommonRepository<ColdWalletMaster> _ColdWalletMaster;
        //   private readonly ICommonRepository<WalletMaster> _commonRepositoryTest; //ntrivedi to solve method conflict

        //private readonly ICommonRepository<WalletMaster> _commonRepositoryNew; //ntrivedi to solve method conflict
        //private readonly ICommonRepository<WalletLimitConfiguration> _LimitcommonRepository;
        //private readonly ICommonRepository<OrganizationUserMaster> _OrganizationUserMaster;
        //private readonly ICommonRepository<WalletLimitConfigurationMaster> _WalletLimitConfigurationMasterRepository;
        //private readonly ICommonRepository<ThirdPartyAPIConfiguration> _thirdPartyCommonRepository;
        //private readonly ICommonRepository<WalletOrder> _walletOrderRepository;
        //private readonly ICommonRepository<AddressMaster> _addressMstRepository;
        //private readonly ICommonRepository<TrnAcBatch> _trnBatch;
        //private readonly ICommonRepository<TradeBitGoDelayAddresses> _bitgoDelayRepository;
        //private readonly ICommonRepository<WalletAllowTrn> _WalletAllowTrnRepo;
        //private readonly ICommonRepository<BeneficiaryMaster> _BeneficiarycommonRepository;
        //private readonly ICommonRepository<UserPreferencesMaster> _UserPreferencescommonRepository;
        //private readonly ICommonRepository<WalletLedger> _WalletLedgersRepo;
        //private readonly ICommonRepository<MemberShadowBalance> _ShadowBalRepo;
        //private readonly ICommonRepository<AddRemoveUserWalletRequest> _AddRemoveUserWalletRequest;
        //private readonly ICommonRepository<AllowTrnTypeRoleWise> _AllowTrnTypeRoleWise;
        //private readonly ICommonRepository<UserRoleMaster> _UserRoleMaster;
        //private readonly ICommonRepository<MemberShadowLimit> _ShadowLimitRepo;
        // private readonly ICommonRepository<ConvertFundHistory> _ConvertFundHistory;
        //readonly ICommonRepository<WalletLedger> _walletLedgerRepository;

        //private readonly IWebApiSendRequest _webApiSendRequest;
        //private readonly IGetWebRequest _getWebRequest;
        //private readonly WebApiParseResponse _WebApiParseResponse;
        //private readonly IGenerateAddressQueue<BGTaskAddressGeneration> _IGenerateAddressQueue;
        //vsolanki 8-10-2018 
        //private readonly ICommonRepository<WithdrawHistory> _WithdrawHistoryRepository;
        //readonly IBasePage _BaseObj;
        //private static Random random = new Random((int)DateTime.Now.Ticks);
        //vsolanki 10-10-2018 
        //private readonly ICommonRepository<WalletAllowTrn> _WalletAllowTrnRepository;
        //private readonly ICommonRepository<TransactionAccount> _TransactionAccountsRepository;
        //private readonly ICommonRepository<ChargeRuleMaster> _chargeRuleMaster;
        //private readonly ICommonRepository<LimitRuleMaster> _limitRuleMaster;
        //private readonly ICommonWalletFunction _commonWalletFunction;
        private readonly IMarginWalletTQInsert _WalletTQInsert;

        //private readonly IRepository<WalletTransactionOrder> _WalletAllowTrnRepository;
        //  private readonly ICommonRepository<WalletTransactionQueue> t;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly IMarginSPRepositories _walletSPRepositories;
        //List<TransactionProviderResponse> transactionProviderResponses;
        private readonly ISignalRService _signalRService;
        private readonly ICommonRepository<MarginWalletTypeMaster> _WalletTypeMasterRepository;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        private readonly IMarginWalletRepository _walletRepository1;
        private readonly IWebApiRepository _webApiRepository;
        private readonly IMessageService _messageService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
        private readonly IMessageConfiguration _messageConfiguration;
        private readonly ICommonRepository<MarginWalletAuthorizeUserMaster> _WalletAuthorizeUserMaster;
        private readonly ICommonRepository<MarginWalletMaster> _commonRepository;
        private readonly ICommonRepository<MarginTransactionAccount> _TransactionAccountsRepository;
        private readonly ICommonRepository<CleanArchitecture.Core.Entities.NewWallet.LeverageMaster> _LeverageMaster;
        private readonly ICommonRepository<MarginChargeOrder> _MarginChargeOrder;
        private readonly IMarginCreateOrderFromWallet _CreateOrder;
        private readonly ICommonRepository<MarginCloseUserPositionWallet> _ClosePosition;
        //private readonly IMarginClosePosition _marginClosePosition;

        #endregion


        public MarginTransactionWalletService(

            ICommonRepository<MarginWalletMaster> commonRepository,
            IMarginWalletRepository walletRepository, IWebApiRepository webApiRepository,
            IWebApiSendRequest webApiSendRequest, IMessageConfiguration messageConfiguration,
            ICommonRepository<MarginWalletTypeMaster> WalletTypeMasterRepository, UserManager<ApplicationUser> userManager,
            IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, ISignalRService signalRService,
            Microsoft.Extensions.Configuration.IConfiguration configuration,
           IMarginSPRepositories walletSPRepositories, IMessageService messageService, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue,
            ICommonRepository<MarginWalletAuthorizeUserMaster> WalletAuthorizeUserMaster, IMarginWalletTQInsert WalletTQInsert,
            ICommonRepository<MarginTransactionAccount> TransactionAccountsRepository, ICommonRepository<CleanArchitecture.Core.Entities.NewWallet.LeverageMaster> LeverageMaster,
            ICommonRepository<MarginChargeOrder> MarginChargeOrder, IMarginCreateOrderFromWallet CreateOrder , ICommonRepository<MarginCloseUserPositionWallet> closePosition)
        {
            _TransactionAccountsRepository = TransactionAccountsRepository;
            _configuration = configuration;
            _messageConfiguration = messageConfiguration;
            _userManager = userManager;
            _commonRepository = commonRepository;
            _pushNotificationsQueue = pushNotificationsQueue;
            //_walletRepository = repository;         
            _walletRepository1 = walletRepository;
            _webApiRepository = webApiRepository;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            _walletSPRepositories = walletSPRepositories;
            _messageService = messageService;
            _pushSMSQueue = pushSMSQueue;
            _signalRService = signalRService;
            _WalletAuthorizeUserMaster = WalletAuthorizeUserMaster;
            _WalletTQInsert = WalletTQInsert;
            _LeverageMaster = LeverageMaster;
            _MarginChargeOrder = MarginChargeOrder;
            _CreateOrder = CreateOrder;
            _ClosePosition = closePosition;
           // _marginClosePosition = marginClosePosition;
        }

        public async Task<WalletDrCrResponse> MarginGetWalletHoldNew(long requestUserID, string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enMarginWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                MarginWalletMaster dWalletobj;
                //string remarks = "";
                MarginWalletTypeMaster walletTypeMaster;
                MarginWalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                //bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("MarginGetWalletHoldNew", "MarginTransactionWalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + requestUserID + ",amount=" + amount.ToString());

                //Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
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
                Task<MarginWalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == EnWalletUsageType.Margin_Trading_Wallet && e.UserID == requestUserID);

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType, Convert.ToInt64(enErrorCode.InvalidTradeRefNo));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType, Convert.ToInt64(enErrorCode.InvalidAmount));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
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
                //ntrivedi temperory 21-02-2019
                //var flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                //if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}

                //HelperForLog.WriteLogIntoFileAsync("MarginGetWalletHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                //CheckUserBalanceFlag = await flagTask;
                //ntrivedi temperory 21-02-2019
                //CheckUserBalanceFlag = await flagTask; 


                HelperForLog.WriteLogIntoFileAsync("MarginGetWalletHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                //dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
                if (dWalletobj.Balance < amount && enWalletDeductionType != enWalletDeductionType.InternalSquareOffOrder) //ntrivedi 09-05-2018 internal square off order duplicate may be so already hold and it will be release in sp 
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType, Convert.ToInt64(enErrorCode.InsufficantBal));
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

                //if (!CheckUserBalanceFlag)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                //HelperForLog.WriteLogIntoFileAsync("MarginGetWalletHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                HelperForLog.WriteLogIntoFileAsync("MarginGetWalletHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
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
                //ntrivedi temperory 21-02-2019
                //CheckTrnRefNoRes count1 = await countTask1;
                //if (count1.TotalCount != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                //if (count != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                HelperForLog.WriteLogIntoFileAsync("MarginGetWalletHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);



                BizResponseClass bizResponse = _walletSPRepositories.Callsp_HoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo, enWalletDeductionType);

                decimal charge = 0;
                MarginWalletTypeMaster ChargewalletType = null;

                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    try
                    {
                        charge = _walletRepository1.FindChargeValueHold(timestamp, TrnRefNo);
                        var walletId = _walletRepository1.FindChargeValueWalletId(timestamp, TrnRefNo);
                        MarginWalletMaster WalletlogObj = null;
                        if (charge > 0 && walletId > 0)
                        {
                            WalletlogObj = _commonRepository.GetById(walletId);
                            ChargewalletType = _WalletTypeMasterRepository.GetSingle(i => i.Id == WalletlogObj.WalletTypeID);
                        }
                        Task.Run(() => WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, charge, walletId, WalletlogObj));
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                    }

                    //Task.Run(() => WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType));
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


        public async Task<WalletDrCrResponse> MarginGetWalletCreditDrForHoldNewAsyncFinal(MarginPNL PNLObj, MarginCommonClassCrDr firstCurrObj, MarginCommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web)
        {
            try
            {
                MarginWalletTransactionQueue tqObj;
                //WalletTransactionQueue firstCurrObjTQDr, secondCurrObjTQDr, tqObj;
                //WalletTransactionQueue firstCurrObjTQ, secondCurrObjTQ;
                //WalletTransactionOrder firstCurrObjTO, secondCurrObjTO;
                // TransactionAccount firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA;
                // WalletLedger firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL;
                MarginWalletMaster firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjDrWM;
                // string remarksFirstDr, remarksFirstCr, remarksSecondDr, remarksSecondCr;
                MarginWalletTypeMaster walletTypeFirstCurr, walletTypeSecondCurr;
                //bool CheckUserCrBalanceFlag = false;
                //bool CheckUserDrBalanceFlag = false;
                //bool CheckUserCrBalanceFlag1 = false;
                //bool CheckUserDrBalanceFlag1 = false;
                // enErrorCode enErrorCodefirst, enErrorCodeSecond;
                bool checkDebitRefNo, checkDebitRefNo1;
                //MemberShadowBalance FirstDebitShadowWallet, SecondDebitShadowWallet;
                Task<bool> checkDebitRefNoTask;
                Task<bool> checkDebitRefNoTask1;
                BizResponseClass bizResponseClassFC, bizResponseClassSC;

                //Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal first currency", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + firstCurrObj.Amount + ",Coin=" + firstCurrObj.Coin + ", CR WalletID=" + firstCurrObj.creditObject.WalletId + ",Dr WalletID=" + firstCurrObj.debitObject.WalletId + " cr full settled=" + firstCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + firstCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + firstCurrObj.debitObject.isMarketTrade));
                //Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal second currency", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + secondCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + secondCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + secondCurrObj.Amount + ",Coin=" + secondCurrObj.Coin + ", CR WalletID=" + secondCurrObj.creditObject.WalletId + ",Dr WalletID=" + secondCurrObj.debitObject.WalletId + " cr full settled=" + secondCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + secondCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + secondCurrObj.debitObject.isMarketTrade));
                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal first currency", "MarginTransactionWalletService", "timestamp:" + timestamp + Helpers.JsonSerialize(firstCurrObj)));
                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal second currency", "MarginTransactionWalletService", "timestamp:" + timestamp + Helpers.JsonSerialize(secondCurrObj)));
                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal MarginPNL", "MarginTransactionWalletService", "timestamp:" + timestamp + Helpers.JsonSerialize(PNLObj)));



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
                var firstCurrObjCrWMTask = _commonRepository.GetSingleAsync(item => item.Id == firstCurrObj.creditObject.WalletId && item.WalletUsageType == EnWalletUsageType.Margin_Trading_Wallet);
                if (firstCurrObj.debitObject.isMarketTrade == 1 && firstCurrObj.debitObject.OrderType != enWalletDeductionType.InternalSquareOffOrder)
                {
                    checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForMarketAsync(firstCurrObj);
                }
                else if(firstCurrObj.debitObject.OrderType != enWalletDeductionType.InternalSquareOffOrder)
                {
                    checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForHoldAsync(firstCurrObj);
                }
                else
                {
                    checkDebitRefNoTask = null;
                }
                //2019-2-18 added condi for only used trading wallet
                var firstCurrObjDrWMTask = _commonRepository.GetSingleAsync(item => item.Id == firstCurrObj.debitObject.WalletId && item.WalletUsageType == EnWalletUsageType.Margin_Trading_Wallet);

                if (secondCurrObj.debitObject.isMarketTrade == 1 && secondCurrObj.debitObject.OrderType != enWalletDeductionType.InternalSquareOffOrder)
                {
                    checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForMarketAsync(secondCurrObj);
                }
                else if(secondCurrObj.debitObject.OrderType != enWalletDeductionType.InternalSquareOffOrder)
                {
                    checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForHoldAsync(secondCurrObj);
                }
                else
                {
                    checkDebitRefNoTask1 = null;
                }
                //2019-2-18 added condi for only used trading wallet
                var secondCurrObjCrWMTask = _commonRepository.GetSingleAsync(item => item.Id == secondCurrObj.creditObject.WalletId && item.WalletUsageType == EnWalletUsageType.Margin_Trading_Wallet);

                //Task<MemberShadowBalance> FirstDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == firstCurrObj.creditObject.WalletId);
                //2019-2-18 added condi for only used trading wallet
                var secondCurrObjDrWMTask = _commonRepository.GetSingleAsync(item => item.Id == secondCurrObj.debitObject.WalletId && item.WalletUsageType == EnWalletUsageType.Margin_Trading_Wallet);

                //Task<MemberShadowBalance> SecondDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == secondCurrObj.creditObject.WalletId);

                //Task<bool> CheckUserCrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.creditObject.WalletId);
                Task<MarginWalletTypeMaster> walletTypeFirstCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == firstCurrObj.Coin);
                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //CheckUserCrBalanceFlag = await CheckUserCrBalanceFlagTask;
                //if (!CheckUserCrBalanceFlag)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<bool> CheckUserDrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                Task<MarginWalletTypeMaster> walletTypeSecondCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == secondCurrObj.Coin);
                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //CheckUserDrBalanceFlag = await CheckUserDrBalanceFlagTask;
                //if (!CheckUserDrBalanceFlag)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.debitObject.WalletId, firstCurrObj.Coin, firstCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //Task<bool> CheckUserCrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                //Task<bool> CheckUserCrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);

                //Task<bool> CheckUserCrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.creditObject.WalletId);

                //used two times 16-05-2019
                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //CheckUserCrBalanceFlag1 = await CheckUserCrBalanceFlagTask1;
                //if (!CheckUserCrBalanceFlag1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.debitObject.WalletId, secondCurrObj.Coin, secondCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<bool> CheckUserDrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);


                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("MarginGetWalletCreditDrForHoldNewAsyncFinal before await1", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                if (firstCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, secondCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                if (firstCurrObjDrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, secondCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                secondCurrObjCrWM = await secondCurrObjCrWMTask;
                if (secondCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                secondCurrObj.creditObject.UserID = secondCurrObjCrWM.UserID;

                secondCurrObjDrWM = await secondCurrObjDrWMTask;
                if (secondCurrObjDrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                secondCurrObj.debitObject.UserID = secondCurrObjDrWM.UserID;

                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal after await1", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));
                //already doing in settlment sp 26-05-2019
                //GetMemberBalRes MemberBalRes = _walletSPRepositories.Callsp_MarginGetMemberBalance(firstCurrObj.debitObject.WalletId, 0, 0, 1, firstCurrObj.Amount, Convert.ToInt16(EnWalletUsageType.Margin_Trading_Wallet));
                //if (MemberBalRes.ReturnCode != 0)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, Convert.ToInt64(enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchDrWallet));
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = MemberBalRes.ReturnMsg, ErrorCode = enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}
                //MemberBalRes = _walletSPRepositories.Callsp_MarginGetMemberBalance(firstCurrObj.creditObject.WalletId, 0, 0, 1, firstCurrObj.Amount, Convert.ToInt16(EnWalletUsageType.Margin_Trading_Wallet));
                //if (MemberBalRes.ReturnCode != 0)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.creditObject.trnType, Convert.ToInt64(enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchCrWallet));
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = MemberBalRes.ReturnMsg, ErrorCode = enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}
                //MemberBalRes = _walletSPRepositories.Callsp_MarginGetMemberBalance(secondCurrObj.debitObject.WalletId, 0, 0, 1, secondCurrObj.Amount, Convert.ToInt16(EnWalletUsageType.Margin_Trading_Wallet));
                //if (MemberBalRes.ReturnCode != 0)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, Convert.ToInt64(enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchDrWalletSecCur));
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = MemberBalRes.ReturnMsg, ErrorCode = enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchDrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}
                //MemberBalRes = _walletSPRepositories.Callsp_MarginGetMemberBalance(secondCurrObj.creditObject.WalletId, 0, 0, 1, secondCurrObj.Amount, Convert.ToInt16(EnWalletUsageType.Margin_Trading_Wallet));
                //if (MemberBalRes.ReturnCode != 0)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.creditObject.trnType, Convert.ToInt64(enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchCrWalletSecCur));
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = MemberBalRes.ReturnMsg, ErrorCode = enErrorCode.sp_MarginCrDrWalletForHoldWithCharge_CrDrCredit_SettledBalMismatchCrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal before await2", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));
                if (firstCurrObj.debitObject.OrderType != enWalletDeductionType.InternalSquareOffOrder) //condition added 08-05-2019
                {
                    checkDebitRefNo = await checkDebitRefNoTask;
                    if (checkDebitRefNo == false)//fail
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);                        
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                if (secondCurrObj.debitObject.OrderType != enWalletDeductionType.InternalSquareOffOrder) //condition added 08-05-2019
                {
                    checkDebitRefNo1 = await checkDebitRefNoTask1;
                    if (checkDebitRefNo1 == false)//fail
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", secondCurrObj.creditObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                //30-05-2019 move here for second operation started error so take before MarginGetWalletHoldNew call
                walletTypeFirstCurr = await walletTypeFirstCurrTask;
                walletTypeSecondCurr = await walletTypeSecondCurrTask;

                if (walletTypeFirstCurr == null || walletTypeSecondCurr == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
                }

                //ntrivedi InternalSquareOffOrder need to full deduct at sattlement time 02-04-2019 move above 08-05-2019
                if (firstCurrObj.debitObject.OrderType == enWalletDeductionType.InternalSquareOffOrder)
                {
                    WalletDrCrResponse walletcrdrResponseFirstCurr = await MarginGetWalletHoldNew(firstCurrObj.debitObject.UserID, firstCurrObj.Coin, timestamp, firstCurrObj.Amount, firstCurrObjDrWM.AccWalletID, firstCurrObj.debitObject.TrnRefNo, enServiceType.Trading, firstCurrObj.debitObject.trnType, enTrnType.Sell_Trade, EnAllowedChannels.Web, enWalletDeductionType.InternalSquareOffOrder);
                    if (walletcrdrResponseFirstCurr.ReturnCode != 0) //ntrivedi checking returncode 30-04-2019
                    {
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = walletcrdrResponseFirstCurr.ReturnCode, ReturnMsg = walletcrdrResponseFirstCurr.ReturnMsg, ErrorCode = walletcrdrResponseFirstCurr.ErrorCode, TrnNo = walletcrdrResponseFirstCurr.TrnNo, Status = walletcrdrResponseFirstCurr.Status, StatusMsg = walletcrdrResponseFirstCurr.StatusMsg }, "Credit");
                    }
                    checkDebitRefNo = await _walletRepository1.CheckTrnIDDrForHoldAsync(firstCurrObj);
                    //checkDebitRefNo = await checkDebitRefNoTask;
                    if (checkDebitRefNo == false)//fail
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                if (secondCurrObj.debitObject.OrderType == enWalletDeductionType.InternalSquareOffOrder)
                {
                    WalletDrCrResponse walletcrdrResponseSecondCurr = await MarginGetWalletHoldNew(secondCurrObj.debitObject.UserID, secondCurrObj.Coin, timestamp, secondCurrObj.Amount, secondCurrObjDrWM.AccWalletID, secondCurrObj.debitObject.TrnRefNo, enServiceType.Trading, secondCurrObj.debitObject.trnType, enTrnType.Buy_Trade, EnAllowedChannels.Web, enWalletDeductionType.InternalSquareOffOrder);
                    if (walletcrdrResponseSecondCurr.ReturnCode != 0) //ntrivedi checking returncode 30-04-2019
                    {
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = walletcrdrResponseSecondCurr.ReturnCode, ReturnMsg = walletcrdrResponseSecondCurr.ReturnMsg, ErrorCode = walletcrdrResponseSecondCurr.ErrorCode, TrnNo = walletcrdrResponseSecondCurr.TrnNo, Status = walletcrdrResponseSecondCurr.Status, StatusMsg = walletcrdrResponseSecondCurr.StatusMsg }, "Credit");
                    }
                    checkDebitRefNo1 = await _walletRepository1.CheckTrnIDDrForHoldAsync(secondCurrObj);
                    if (checkDebitRefNo1 == false)//fail
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", secondCurrObj.creditObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                if (firstCurrObj.debitObject.isMarketTrade == 1 && firstCurrObj.debitObject.differenceAmount > 0)
                {
                    if (firstCurrObjDrWM.Balance < firstCurrObj.debitObject.differenceAmount)
                    {
                        // insert with status=2 system failed
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit first currency");
                    }
                    bizResponseClassFC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(firstCurrObjDrWM, timestamp, serviceType, firstCurrObj.debitObject.differenceAmount, firstCurrObj.Coin, allowedChannels, firstCurrObjDrWM.WalletTypeID, firstCurrObj.debitObject.WTQTrnNo, firstCurrObj.debitObject.WalletId, firstCurrObj.debitObject.UserID, enTrnType.Buy_Trade, firstCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                    if (bizResponseClassFC.ReturnCode != enResponseCode.Success)
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.FirstCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit second currency");
                    }
                }
                if (secondCurrObj.debitObject.isMarketTrade == 1 && secondCurrObj.debitObject.differenceAmount > 0)
                {
                    if (secondCurrObjDrWM.Balance < secondCurrObj.debitObject.differenceAmount)
                    {
                        // insert with status=2 system failed
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                    bizResponseClassSC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(secondCurrObjDrWM, timestamp, serviceType, secondCurrObj.debitObject.differenceAmount, secondCurrObj.Coin, allowedChannels, secondCurrObjDrWM.WalletTypeID, secondCurrObj.debitObject.WTQTrnNo, secondCurrObj.debitObject.WalletId, secondCurrObj.debitObject.UserID, enTrnType.Buy_Trade, secondCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                    if (bizResponseClassSC.ReturnCode != enResponseCode.Success)
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                        tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.SecondCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
               
                //Task<WalletTransactionQueue> firstCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(firstCurrObj.debitObject.WTQTrnNo);
                //Task<WalletTransactionQueue> secondCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(secondCurrObj.debitObject.WTQTrnNo);

                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal after await2", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

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

                //ntrivedi 30-05-2019 comment below for second operation started
                //walletTypeFirstCurr = await walletTypeFirstCurrTask;
                //walletTypeSecondCurr = await walletTypeSecondCurrTask;

                //if (walletTypeFirstCurr == null || walletTypeSecondCurr == null)
                //{
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
                //}

                //bool flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.creditObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.debitObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.creditObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.debitObject.WalletId);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("MarginGetWalletCreditDrForHoldNewAsyncFinal before await3", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                //Task<enErrorCode> enErrorCodeTaskfirst = _commonWalletFunction.CheckShadowLimitAsync(firstCurrObjDrWM.Id, firstCurrObj.Amount);
                //enErrorCodefirst = await enErrorCodeTaskfirst;
                //if (enErrorCodefirst != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                if (firstCurrObjDrWM.OutBoundBalance < firstCurrObj.Amount) // ntrivedi checking outbound balance
                {
                    // insert with status=2 system failed
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutgoingBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                //Task<enErrorCode> enErrorCodeTaskSecond = _commonWalletFunction.CheckShadowLimitAsync(secondCurrObjDrWM.Id, secondCurrObj.Amount);
                //enErrorCodeSecond = await enErrorCodeTaskSecond;
                //if (enErrorCodeSecond != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}

                if (secondCurrObjDrWM.OutBoundBalance < secondCurrObj.Amount)// ntrivedi checking outbound balance
                {
                    // insert with status=2 system failed
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficietOutgoingBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                if (firstCurrObjDrWM.Status != 1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                if (secondCurrObjDrWM.Status != 1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
                    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }


                //CheckUserDrBalanceFlag1 = await CheckUserDrBalanceFlagTask1;
                //if (!CheckUserDrBalanceFlag1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWalletSecDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal after await3", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));



                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal before Wallet operation", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                //bool flag = await _walletRepository1.WalletCreditDebitwithTQTestFinal(firstCurrObjTQ, secondCurrObjTQ, secondCurrObjTO, firstCurrObjTO, FirstDebitShadowWallet, SecondDebitShadowWallet, firstCurrObjTQDr, secondCurrObjTQDr, firstCurrObj, secondCurrObj, firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL, firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA);
                BizResponseClass bizResponse = _walletSPRepositories.Callsp_CrDrWalletForHold(PNLObj, firstCurrObj, secondCurrObj, timestamp, serviceType, walletTypeFirstCurr.Id, walletTypeSecondCurr.Id, (long)allowedChannels);

                _walletRepository1.ReloadEntity(firstCurrObjCrWM, secondCurrObjCrWM, firstCurrObjDrWM, secondCurrObjDrWM);

                if (bizResponse.ReturnCode != enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = 0, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Credit");
                }

                decimal ChargefirstCur = 0, ChargesecondCur = 0;
                //ntrivedi added for try catch 05-03-2019
                try
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before WaitAll", "MartinTransactionWalletService", "timestamp:" + timestamp));
                    Task.WaitAll();
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after WaitAll", "MartinTransactionWalletService", "timestamp:" + timestamp));
                    ChargefirstCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.creditObject.TrnRefNo);
                    ChargesecondCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.debitObject.TrnRefNo);
                    secondCurrObj.debitObject.Charge = ChargesecondCur;
                    firstCurrObj.debitObject.Charge = ChargefirstCur;
                }
                catch (Exception ex1)
                {
                    HelperForLog.WriteErrorLog("GetWalletCreditDrForHoldNewAsyncFinal charge exception  Timestamp" + timestamp, this.GetType().Name, ex1);
                }

                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal after Wallet operation", "MarginTransactionWalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                Task.Run(() => CreditDebitNotificationSend(timestamp, firstCurrObj, secondCurrObj, firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjCrWM, ChargefirstCur, ChargesecondCur));

                Task.Run(() => HelperForLog.WriteLogIntoFile("MarginGetWalletCreditDrForHoldNewAsyncFinal:Without Token done", "MarginTransactionWalletService", ",timestamp =" + timestamp));


                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "MarginGetWalletCreditDrForHoldNewAsyncFinal");


            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "MarginGetWalletCreditDrForHoldNewAsyncFinal");
                //throw ex;
            }
        }

        public async Task<WalletDrCrResponse> MarginGetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enMarginWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "")
        {
            try
            {
                MarginWalletMaster dWalletobj;
                string remarks = "";
                MarginWalletTypeMaster walletTypeMaster;
                MarginWalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "MarginTransactionWalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

                //Task<int> countTask = _walletRepository1.CheckTrnRefNoAsync(TrnRefNo, orderType, trnType); //CheckTrnRefNo(TrnRefNo, orderType, trnType);
                if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty)
                {
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = timestamp };
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Release Hold");
                }

                //2019-2-18 added condi for only used trading wallet
                Task<MarginWalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == EnWalletUsageType.Margin_Trading_Wallet);

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType, Convert.ToInt64(enErrorCode.InvalidTradeRefNo));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType, Convert.ToInt64(enErrorCode.InvalidAmount));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                dWalletobj = await dWalletobjTask;
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = timestamp }, "Release Hold");
                }
                userID = dWalletobj.UserID;
                //ntrivedi no need to check shadow limit in release transaction
                //var errorCode = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);
                Task<bool> flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                //Task<bool> flagTask1 = CheckUserBalanceAsync(dWalletobj.Id, enBalanceType.OutBoundBalance);

                if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType, Convert.ToInt64(enErrorCode.InvalidWallet));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }

                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + "timestamp:" + timestamp + ", TrnNo=" + TrnRefNo.ToString());
                CheckUserBalanceFlag = await flagTask;

                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);
                dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 

                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType, Convert.ToInt64(enErrorCode.SettedBalanceMismatch));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                Task<bool> flagTask1 = CheckUserBalanceAsync(amount, dWalletobj.Id, enBalanceType.OutBoundBalance);
                CheckUserBalanceFlag = await flagTask1;
                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType, Convert.ToInt64(enErrorCode.SettedOutgoingBalanceMismatch));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedOutgoingBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);
                //no need tocheck shadow limit 22-02-2019
                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                //}
                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);

                //int count = await countTask;
                //if (count != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                if (dWalletobj.OutBoundBalance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType, Convert.ToInt64(enErrorCode.InsufficientOutboundBalance));
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutboundBalance, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);

                BizResponseClass bizResponse = _walletSPRepositories.Callsp_ReleaseHoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo);

                if (bizResponse.ReturnCode == enResponseCode.Success)
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

                    decimal charge = _walletRepository1.FindChargeValueDeduct(timestamp, TrnRefNo);

                    ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                    ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.ChargeReleasedWallet);
                    ActivityNotificationCharge.Param1 = coinName;
                    ActivityNotificationCharge.Param2 = charge.ToString();
                    ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                    ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                    HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "OnWalletBalChange + SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());

                    Task.Run(() => Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2, "", 1),

                        () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2, "", 1)
                      ));

                    if (charge > 0)
                    {
                        Parallel.Invoke(
                       () => _signalRService.SendActivityNotificationV2(ActivityNotificationCharge, dWalletobj.UserID.ToString(), 2, "", 1),
                        () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, dWalletobj.UserID.ToString(), charge.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), "Released."));
                    }
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Release Hold");

                }
                else
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Release Hold");
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarginMarginGetReleaseHoldNew", "MarginTransactionWalletService TimeStamp:" + timestamp, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "Release Hold");
                //throw ex;
            }
        }

        public async Task WalletHoldNotificationSend(string timestamp, MarginWalletMaster dWalletobj, string coinName, decimal amount, long TrnRefNo, byte routeTrnType, decimal charge, long walletId, MarginWalletMaster WalletlogObj)
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
                #region EMAIL_SMS
                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceNotification);
                ActivityNotification.Param1 = coinName;
                ActivityNotification.Param2 = amount.ToString();
                ActivityNotification.Param3 = TrnRefNo.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                //decimal charge = _walletRepository1.FindChargeValueHold(timestamp, TrnRefNo);
                //long walletId = _walletRepository1.FindChargeValueWalletId(timestamp, TrnRefNo);



                ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                ActivityNotificationCharge.MsgCode = Convert.ToInt32(enErrorCode.ChargeHoldWallet);
                ActivityNotificationCharge.Param1 = coinName;
                ActivityNotificationCharge.Param2 = charge.ToString();
                ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                HelperForLog.WriteLogIntoFileAsync("WalletHoldNotificationSend", "OnWalletBalChange + SendActivityNotificationV2 pre timestamp=" + timestamp.ToString());

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2, "", 1),

                    () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2, "", 1),
                    () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, dWalletobj.UserID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString()),
                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, dWalletobj.UserID.ToString(), amount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString())
        );

                if (charge > 0 && walletId > 0 && WalletlogObj != null)
                {
                    //   var WalletlogObj = _commonRepository.GetById(walletId);

                    WalletMasterResponse walletMasterObjCharge = new WalletMasterResponse();
                    walletMasterObjCharge.AccWalletID = WalletlogObj.AccWalletID;
                    walletMasterObjCharge.Balance = WalletlogObj.Balance;
                    walletMasterObjCharge.WalletName = WalletlogObj.Walletname;
                    walletMasterObjCharge.PublicAddress = WalletlogObj.PublicAddress;
                    walletMasterObjCharge.IsDefaultWallet = WalletlogObj.IsDefaultWallet;
                    walletMasterObjCharge.CoinName = coinName;
                    walletMasterObjCharge.OutBoundBalance = WalletlogObj.OutBoundBalance;

                    Parallel.Invoke(
                 () => _signalRService.SendActivityNotificationV2(ActivityNotificationCharge, WalletlogObj.UserID.ToString(), 2, "", 1),
                   () => _signalRService.OnWalletBalChange(walletMasterObjCharge, coinName, WalletlogObj.UserID.ToString(), 2, "", 1),
                   () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, WalletlogObj.UserID.ToString(), charge.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), "Hold."));

                }
                #endregion 
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, "MarginWalletService", ex);
                //throw ex;
            }
        }
        //2018-12-6
        public async Task SMSSendAsyncV1(EnTemplateType templateType, string UserID, string WalletName = null, string SourcePrice = null, string DestinationPrice = null, string ONOFF = null, string Coin = null, string TrnType = null, string TrnNo = null)
        {
            try
            {
                //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 SMSSendAsyncV1", " -Data- " + templateType.ToString());
                CommunicationParamater communicationParamater = new CommunicationParamater();
                ApplicationUser User = new ApplicationUser();
                User = await _userManager.FindByIdAsync(UserID);
                //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 SMSSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
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
                                //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 SMSSendAsyncV1", " -Data- " + SmsData.Content);
                                _pushSMSQueue.Enqueue(Request);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("SMSSendAsyncV1" + " - Data- " + templateType.ToString(), "MarginTransactionWalletService", ex);
            }
        }

        //2018-12-6
        public async Task EmailSendAsyncV1(EnTemplateType templateType, string UserID, string Param1 = "", string Param2 = "", string Param3 = "", string Param4 = "", string Param5 = "", string Param6 = "", string Param7 = "", string Param8 = "", string Param9 = "")
        {
            try
            {
                //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 EmailSendAsyncV1", " -Data- " + templateType.ToString() + "Parameters" + Param1 + Param2 + Param3 + Param4 + Param5 + Param6 + Param7 + Param8 + Param9);
                CommunicationParamater communicationParamater = new CommunicationParamater();
                SendEmailRequest Request = new SendEmailRequest();
                ApplicationUser User = new ApplicationUser();
                User = await _userManager.FindByIdAsync(UserID);
                //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 EmailSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
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
                        //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 EmailSendAsyncV1", " -Data- " + "Parameters" + Param1 + Param2 + Param3 + Param4 + Param5 + Param6 + Param7 + Param8 + Param9);
                        var EmailData = _messageService.ReplaceTemplateMasterData(templateType, communicationParamater, enCommunicationServiceType.Email).Result;
                        //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
                        if (EmailData != null)
                        {
                            Request.Body = EmailData.Content;
                            Request.Subject = EmailData.AdditionalInfo;
                            Request.EmailType = Convert.ToInt16(EnEmailType.Template);
                            //HelperForLog.WriteLogIntoFile("MarginTransactionWalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
                            Request.Recepient = User.Email;
                            //HelperForLog.WriteLogForSocket("MarginTransactionWalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData);
                            _pushNotificationsQueue.Enqueue(Request);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " -Data- " + templateType.ToString(), "MarginTransactionWalletService", ex);
            }
        }

        public WalletDrCrResponse GetCrDRResponse(WalletDrCrResponse obj, string extras)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(extras, "MarginTransactionWalletService", "timestamp:" + obj.TimeStamp + ",ReturnCode=" + obj.ReturnCode + ",ErrorCode=" + obj.ErrorCode + ", ReturnMsg=" + obj.ReturnMsg + ",StatusMsg=" + obj.StatusMsg + ",TrnNo=" + obj.TrnNo));
                return obj;
            }
            catch (Exception ex)
            {
                return obj;
            }
        }
        public MarginWalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
           long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enMarginWalletTrnType enWalletTrnType, long errorcode = 0)
        {
            try
            {
                MarginWalletTransactionQueue walletTransactionQueue = new MarginWalletTransactionQueue();
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
                walletTransactionQueue.ErrorCode = errorcode;
                return walletTransactionQueue;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task CreditDebitNotificationSend(string timestamp, MarginCommonClassCrDr firstCurrObj, MarginCommonClassCrDr secondCurrObj, MarginWalletMaster firstCurrObjCrWM, MarginWalletMaster firstCurrObjDrWM, MarginWalletMaster secondCurrObjCrWM, MarginWalletMaster secondCurrObjDrWM, decimal ChargefirstCur, decimal ChargesecondCur)
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

                Task.Run(() => HelperForLog.WriteLogIntoFile("CreditNotificationSend Activity:Without Token", "MartinTransactionWalletService", "msg=" + ActivityNotificationdr.MsgCode.ToString() + ",User=" + firstCurrObjCrWM.UserID.ToString() + "WalletID" + firstCurrObjCrWM.AccWalletID + ",Balance" + firstCurrObjCrWM.Balance.ToString()));

                var firstCurrObjCrType = firstCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
                var firstCurrObjDrType = firstCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");
                var secCurrObjCrType = secondCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
                var secCurrObjDrType = secondCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotificationCr, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr, firstCurrObj.Coin, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.SendActivityNotificationV2(ActivityNotificationCr1, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr1, secondCurrObj.Coin, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.SendActivityNotificationV2(ActivityNotificationdr, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjDr, firstCurrObj.Coin, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.SendActivityNotificationV2(ActivityNotificationdr1, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjDr1, secondCurrObj.Coin, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp, 1),
                                           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, firstCurrObjCrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjCrType, firstCurrObj.creditObject.TrnRefNo.ToString()),
                                           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, secondCurrObjCrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjCrType, secondCurrObj.creditObject.TrnRefNo.ToString()),
                                            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, firstCurrObjDrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjDrType, firstCurrObj.debitObject.TrnRefNo.ToString()),
                                            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, secondCurrObjDrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjDrType, secondCurrObj.debitObject.TrnRefNo.ToString()),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, secondCurrObjCrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.creditObject.TrnRefNo.ToString(), secCurrObjCrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, firstCurrObjCrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.creditObject.TrnRefNo.ToString(), firstCurrObjCrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, secondCurrObjDrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), secCurrObjDrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, firstCurrObjDrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), firstCurrObjDrType));

                if (ChargefirstCur > 0 && ChargesecondCur > 0)
                {
                    Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotificationCrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2, "", 1),
                   () => _signalRService.SendActivityNotificationV2(ActivityNotificationDrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2, "", 1),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, firstCurrObjDrWM.UserID.ToString(), ChargefirstCur.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, secondCurrObjDrWM.UserID.ToString(), ChargesecondCur.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"));
                }
                #endregion

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreditNotificationSend" + "TimeStamp:" + timestamp, "MarginTransactionWalletService", ex);

                //throw ex;
            }
        }

        public async Task<bool> CheckUserBalanceAsync(decimal amount, long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Margin_Trading_Wallet)
        {
            try
            {

                decimal crsum, drsum;
                decimal wObjBal;//= GetUserBalance(WalletId);
                MarginWalletMaster walletObject;
                //var TA = _TransactionAccountsRepository.FindBy(item=>item.WalletID== WalletId);

                Task<decimal> crsumTask = _TransactionAccountsRepository.GetSumAsync(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalance, f => f.CrAmt);
                Task<decimal> drsumTask = _TransactionAccountsRepository.GetSumAsync(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalance, f => f.DrAmt);
                //  Task<WalletMaster> walletObjectTask = _commonRepository.GetByIdAsync(WalletId);

                //2019-2-18 added condi for only used trading wallet
                Task<MarginWalletMaster> walletObjectTask = _commonRepository.GetSingleAsync(item => item.Id == WalletId && item.WalletUsageType == enWalletUsageType);
                crsum = await crsumTask;
                drsum = await drsumTask;
                walletObject = await walletObjectTask;
                //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
                if (walletObject.WalletUsageType != enWalletUsageType)
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
                HelperForLog.WriteErrorLog("CheckUserBalanceAsync", "MartinTransactionWalletService", ex);
                throw ex;
            }
        }


        //Rushabh 26-10-2018
        public async Task<long> GetWalletID(string AccWalletID)
        {
            try
            {
                Task<MarginWalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.AccWalletID == AccWalletID);
                MarginWalletMaster obj = await obj1;
                if (obj != null)//Rita for object ref error
                    return obj.Id;
                else
                    return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletID", this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<string> GetAccWalletID(long WalletID)
        {
            try
            {
                Task<MarginWalletMaster> obj1 = _commonRepository.GetSingleAsync(item => item.Id == WalletID);
                MarginWalletMaster obj = await obj1;
                if (obj != null)//Rita for object ref error
                    return obj.AccWalletID;
                else
                    return "";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetAccWalletID", this.GetType().Name, ex);
                throw ex;
            }
        }

        //Rita 9-1-19 need for social trading
        public async Task<string> GetDefaultAccWalletID(string SMSCode, long UserID)
        {
            try
            {
                MarginWalletTypeMaster obj1 = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == SMSCode);
                MarginWalletMaster obj = await _commonRepository.GetSingleAsync(item => item.WalletTypeID == obj1.Id && item.UserID == UserID && item.IsDefaultWallet == 1);

                if (obj != null)//Rita for object ref error
                    return obj.AccWalletID;
                else
                    return "";

            }
            catch (Exception ex)
            {
                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                Task.Run(() => HelperForLog.WriteErrorLog("GetDefaultAccWalletID:##SMSCode " + SMSCode, "WalletServicce", ex));
                return "";
            }
        }

        //public async Task<StopLimitOrderPrice> ReCalculateInternalOrderPrice(long UserID, long PairID,string baseCurrency)
        //{
        //    StopLimitOrderPrice stopLimitOrderPriceObj = new StopLimitOrderPrice();
        //    BizResponseClass BizResponseClassObj = new BizResponseClass();
        //    decimal dailyCharge = 0, dailyChargePer=0;
        //    try
        //    {
        //        //Every Settlement find the Internal Order BidPrice

        //        // Average Qty Average BidPrice Average Landing
        //        //sum(buy Qty) - sum(sell Qty)      sum(buy bidprice) - sum(sell bidprice)            sum(buy Landing) - sum(sell Landing)

        //        //    100                     5                                               500

        //        //SAfety balance = 10 - today charge balance = 2 => 10 - 2 = 8 safety amount
        //        //500 - 8 = 492 / 100 Qty = 4.92  price e settle thay to aapan ne 8 to loss jay
        //       stopLimitOrderPriceObj.PairID = PairID;
        //        stopLimitOrderPriceObj.UserID = UserID;
        //        stopLimitOrderPriceObj.baseCurrency = baseCurrency;

        //        OpenPositionMaster openPositionMasterObj =  _walletRepository1.GetPositionMasterValue(PairID, UserID);
        //        if(openPositionMasterObj == null)
        //        {
        //            BizResponseClassObj.ReturnCode = enResponseCode.Fail;
        //            BizResponseClassObj.ReturnMsg = EnResponseMessage.OpenPositionNotFound;
        //            BizResponseClassObj.ErrorCode = enErrorCode.OpenPositionNotFound;
        //            stopLimitOrderPriceObj.BizResponseClass = BizResponseClassObj;
        //            HelperForLog.WriteLogIntoFileAsync("ReCalculateInternalOrderPrice", Helpers.JsonSerialize(stopLimitOrderPriceObj));
        //            return stopLimitOrderPriceObj;
        //        }
        //        PositionValue posValueDetailObj = _walletRepository1.GetPositionDetailValue(openPositionMasterObj.Id);
        //        stopLimitOrderPriceObj.AvgBidPrice = posValueDetailObj.BidPrice;
        //        stopLimitOrderPriceObj.AvgLanding = posValueDetailObj.LandingPrice;
        //        stopLimitOrderPriceObj.AvgQty = posValueDetailObj.Qty;

        //        MarginWalletTypeMaster marginWalletTypeObj = _WalletTypeMasterRepository.GetSingle(x => x.WalletTypeName == baseCurrency && x.Status==1);
        //        if (marginWalletTypeObj == null)
        //        {
        //            BizResponseClassObj.ReturnCode = enResponseCode.Fail;
        //            BizResponseClassObj.ReturnMsg = EnResponseMessage.InvalidBaseCurrency;
        //            BizResponseClassObj.ErrorCode = enErrorCode.InvalidBaseCurrency;
        //            stopLimitOrderPriceObj.BizResponseClass = BizResponseClassObj;
        //            HelperForLog.WriteLogIntoFileAsync("ReCalculateInternalOrderPrice", Helpers.JsonSerialize(stopLimitOrderPriceObj));
        //            return stopLimitOrderPriceObj;
        //        }
        //        Core.Entities.NewWallet.LeverageMaster LeverageMasterObj = _LeverageMaster.GetSingle(x => x.WalletTypeID == marginWalletTypeObj.Id);
        //        if (LeverageMasterObj == null)
        //        {
        //            BizResponseClassObj.ReturnCode = enResponseCode.Fail;
        //            BizResponseClassObj.ReturnMsg = EnResponseMessage.InvalidBaseCurrency;
        //            BizResponseClassObj.ErrorCode = enErrorCode.InvalidBaseCurrency;
        //            stopLimitOrderPriceObj.BizResponseClass = BizResponseClassObj;
        //            HelperForLog.WriteLogIntoFileAsync("ReCalculateInternalOrderPrice", Helpers.JsonSerialize(stopLimitOrderPriceObj));

        //            return stopLimitOrderPriceObj;
        //        }
        //        if (LeverageMasterObj.LeverageChargeDeductionType == enLeverageChargeDeductionType.Monthly)
        //        {
        //            // dailyCharge = LeverageMasterObj.MarginChargePer/30;
        //            dailyChargePer = Helpers.DoRoundForTrading(LeverageMasterObj.MarginChargePer / 30, 18);
        //        }
        //        else
        //        {
        //            dailyChargePer = LeverageMasterObj.MarginChargePer;
        //        }
        //        MarginWalletMaster marginWalletMasterObj = _commonRepository.GetSingle(x => x.Status == 1 && x.WalletUsageType == EnWalletUsageType.Margin_Safety_Wallet && x.UserID == UserID && x.WalletTypeID == marginWalletTypeObj.Id);
        //        if (marginWalletMasterObj == null)
        //        {
        //            BizResponseClassObj.ReturnCode = enResponseCode.Fail;
        //            BizResponseClassObj.ReturnMsg = EnResponseMessage.SafetyWalletNotFound;
        //            BizResponseClassObj.ErrorCode = enErrorCode.SafetyWalletNotFound;
        //            stopLimitOrderPriceObj.BizResponseClass = BizResponseClassObj;
        //            HelperForLog.WriteLogIntoFileAsync("ReCalculateInternalOrderPrice", Helpers.JsonSerialize(stopLimitOrderPriceObj));

        //            return stopLimitOrderPriceObj;
        //        }
        //        stopLimitOrderPriceObj.SafetyBalance = marginWalletMasterObj.Balance;
        //        stopLimitOrderPriceObj.Charge = Helpers.DoRoundForTrading(Helpers.DoRoundForTrading(marginWalletMasterObj.Balance * dailyChargePer, 18)/100,18);
        //        stopLimitOrderPriceObj.SafetyBalanceAferCharge = stopLimitOrderPriceObj.SafetyBalance - stopLimitOrderPriceObj.Charge;
        //        stopLimitOrderPriceObj.MinLanding = stopLimitOrderPriceObj.AvgLanding - stopLimitOrderPriceObj.SafetyBalanceAferCharge;
        //        stopLimitOrderPriceObj.FinalBidPrice = Helpers.DoRoundForTrading(stopLimitOrderPriceObj.MinLanding / stopLimitOrderPriceObj.AvgQty,18);

        //        BizResponseClassObj.ReturnCode = enResponseCode.Success;
        //        BizResponseClassObj.ReturnMsg = EnResponseMessage.PriceCalculationisSuccess;
        //        BizResponseClassObj.ErrorCode = enErrorCode.PriceCalculationisSuccess;
        //        stopLimitOrderPriceObj.BizResponseClass = BizResponseClassObj;
        //        HelperForLog.WriteLogIntoFileAsync("ReCalculateInternalOrderPrice", Helpers.JsonSerialize(stopLimitOrderPriceObj));
        //        return stopLimitOrderPriceObj;
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("ReCalculateInternalOrderPrice", this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //Rita 9-4-19 for release Base currency, based on Market-Order/Cancellation , after this Re-calculate Margin Balance based on safety Bal
        public async Task<bool> ReleaseMarginWalletforSettleLeverageBalance(long BatchNo)
        {
            try
            {
                IEnumerable<MarginChargeOrder> OrderS = await _MarginChargeOrder.FindByAsync(e => e.BatchNo == BatchNo && e.Status == 0);

                foreach (MarginChargeOrder Order in OrderS)
                {
                    if (Order.MarginChargeCase == MarginChargeCase.InsufficinetLeverage_PlaceOrder)//Market order
                    {
                        await Task.Delay(new Random().Next(100, 900));//rita 10-5-19 as crone run multiple time
                        RespnseToWallet TxnResult = await _CreateOrder.PlaceMarketSELLOrder(EnAllowedChannels.WalletSystemInternal, Order.UserID, "9999999999", Order.PairID, Order.Amount, Order.DebitAccountID, Order.CreditAccountID, Order.Id.ToString(), "");
                        if (TxnResult.ReturnCode != enResponseCodeService.Success)
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseMarginWalletforSettleLeverageBalance Market Order ", "MarginWalletServicce", "PlaceMarketSELLOrder Fail Msg:" + TxnResult.ReturnMsg + " ##BatchNo:" + BatchNo, Helpers.UTC_To_IST()));
                        }
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseMarginWalletforSettleLeverageBalance  Market Order", "MarginWalletServicce", "PlaceMarketSELLOrder Success ##GUID:" + TxnResult.Guid + " ##TrnRefNo:" + TxnResult.TrnNo + " ##BatchNo:" + BatchNo, Helpers.UTC_To_IST()));

                        Order.Status = 6;
                        Order.Guid = TxnResult.Guid.ToString();
                        Order.UpdatedDate = Helpers.UTC_To_IST();
                        _MarginChargeOrder.Update(Order);
                    }
                    else if (Order.MarginChargeCase == MarginChargeCase.InsufficientLeverage_ButLessLeverageMax)//Release order
                    {
                        await Task.Delay(new Random().Next(100,900));//rita 10-5-19 as crone run multiple time
                        RespnseToWallet TxnResult = await _CreateOrder.ReleaseOrderForNoOpenPosition(EnAllowedChannels.WalletSystemInternal, Order.UserID, Order.Amount, BatchNo, Order.BaseCurrency, Order.Id.ToString(), "");
                        if (TxnResult.ReturnCode != enResponseCodeService.Success)
                        {
                            Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseMarginWalletforSettleLeverageBalance  Cancel Order", "MarginWalletServicce", "PlaceMarketSELLOrder Fail Msg:" + TxnResult.ReturnMsg + " ##BatchNo:" + BatchNo, Helpers.UTC_To_IST()));
                        }
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ReleaseMarginWalletforSettleLeverageBalance Cancel Order ", "MarginWalletServicce", "PlaceMarketSELLOrder Success ##GUID:" + TxnResult.Guid + " ##TrnRefNo:" + TxnResult.TrnNo + " ##BatchNo:" + BatchNo, Helpers.UTC_To_IST()));

                        Order.Status = 6;
                        Order.TrnRefNo = TxnResult.TrnNo;
                        Order.UpdatedDate = Helpers.UTC_To_IST();
                        _MarginChargeOrder.Update(Order);
                    }
                }

                return true;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ReleaseMarginWalletforSettleLeverageBalance Internal Error:##BatchNo " + BatchNo, "MarginWalletServicce", ex);
                return false;
            }
        }
        public async Task<BizResponseClass> SettleMarketOrderForCharge(long ChargeID)
        {
            try
            {
                MarginChargeOrder marginChargeOrder;
                BizResponseClass bizResponse = new BizResponseClass();
                marginChargeOrder = _MarginChargeOrder.GetById(ChargeID);
                if (marginChargeOrder == null)
                {
                    bizResponse = new BizResponseClass { ErrorCode = enErrorCode.RecordNotFound, ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.NotFound };
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SettleMarketOrderForCharge", "MarginTransactionWalletServicce", "SettleMarketOrderForCharge Fail Msg:" + Helpers.JsonSerialize(bizResponse) + " ChargeID=" + ChargeID, Helpers.UTC_To_IST()));
                    return bizResponse;
                }
                bizResponse = _walletSPRepositories.Callsp_MarginProcessLeverageAccountEOD(marginChargeOrder.LoanID, marginChargeOrder.BatchNo, 1);
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SettleMarketOrderForCharge", "MarginTransactionWalletServicce", "SettleMarketOrderForCharge after sp call Msg:" + Helpers.JsonSerialize(bizResponse) + " ChargeID=" + ChargeID, Helpers.UTC_To_IST()));
                return bizResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("SettleMarketOrderForCharge", this.GetType().Name, ex);
                throw ex;
            }
        }
     




    }
}
