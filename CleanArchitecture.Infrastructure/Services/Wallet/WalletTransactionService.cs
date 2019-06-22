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

namespace CleanArchitecture.Infrastructure.Services.Wallet
{
    public class WalletTransactionService : IWalletTransaction
    {

        //private readonly IWalletSPRepositories _walletSPRepositories;
        //private readonly ICommonWalletFunction _commonWalletFunction;
        //private readonly IWalletRepository _walletRepository1;
        //private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        //private readonly ICommonRepository<WalletMaster> _commonRepository;
        //private readonly ISignalRService _signalRService;
        //private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        //private readonly UserManager<ApplicationUser> _userManager;
        //private readonly ICommonRepository<TransactionAccount> _TransactionAccountsRepository;
        //private readonly IMessageService _messageService;
        //private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        //private readonly ICommonRepository<MemberShadowBalance> _ShadowBalRepo;
        //private readonly IWalletConfiguration _walletConfiguration;
        //private readonly IWalletTQInsert _WalletTQInsert;

        //public WalletTransactionService(IWalletSPRepositories walletSPRepositories, ICommonWalletFunction commonWalletFunction, IWalletRepository walletRepository1,
        //    ICommonRepository<WalletTypeMaster> WalletTypeMasterRepository, ICommonRepository<WalletMaster> commonRepository, ISignalRService signalRService,
        //     IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, UserManager<ApplicationUser> userManager, 
        //     ICommonRepository<TransactionAccount> TransactionAccountsRepository, IMessageService messageService, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue,
        //     ICommonRepository<MemberShadowBalance> ShadowBalRepo, IWalletConfiguration walletConfiguration,
        //     IWalletTQInsert WalletTQInsert
        //     )
        //{
        //    _walletSPRepositories = walletSPRepositories;
        //    _commonWalletFunction = commonWalletFunction;
        //    _walletRepository1 = walletRepository1;
        //    _WalletTypeMasterRepository = WalletTypeMasterRepository;
        //    _commonRepository = commonRepository;
        //    _signalRService = signalRService;
        //    _pushNotificationsQueue = pushNotificationsQueue;
        //    _userManager = userManager;
        //    _TransactionAccountsRepository = TransactionAccountsRepository;
        //   // _commonWalletFunction = commonWalletFunction;
        //    _messageService = messageService;
        //    _pushSMSQueue = pushSMSQueue;
        //    _ShadowBalRepo = ShadowBalRepo;
        //    _walletConfiguration = walletConfiguration;
        //    _WalletTQInsert = WalletTQInsert;
        //}

        //public async Task<WalletDrCrResponse> GetWalletCreditDrForHoldNewAsyncFinal(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        //{
        //    try
        //    {
        //        WalletTransactionQueue tqObj;
        //        //WalletTransactionQueue firstCurrObjTQDr, secondCurrObjTQDr, tqObj;
        //        //WalletTransactionQueue firstCurrObjTQ, secondCurrObjTQ;
        //        //WalletTransactionOrder firstCurrObjTO, secondCurrObjTO;
        //        // TransactionAccount firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA;
        //        // WalletLedger firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL;
        //        WalletMaster firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjDrWM;
        //        // string remarksFirstDr, remarksFirstCr, remarksSecondDr, remarksSecondCr;
        //        WalletTypeMaster walletTypeFirstCurr, walletTypeSecondCurr;
        //        bool CheckUserCrBalanceFlag = false;
        //        bool CheckUserDrBalanceFlag = false;
        //        bool CheckUserCrBalanceFlag1 = false;
        //        bool CheckUserDrBalanceFlag1 = false;
        //        // enErrorCode enErrorCodefirst, enErrorCodeSecond;
        //        bool checkDebitRefNo, checkDebitRefNo1;
        //        //MemberShadowBalance FirstDebitShadowWallet, SecondDebitShadowWallet;
        //        Task<bool> checkDebitRefNoTask;
        //        Task<bool> checkDebitRefNoTask1;
        //        BizResponseClass bizResponseClassFC, bizResponseClassSC;

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal first currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + firstCurrObj.Amount + ",Coin=" + firstCurrObj.Coin + ", CR WalletID=" + firstCurrObj.creditObject.WalletId + ",Dr WalletID=" + firstCurrObj.debitObject.WalletId + " cr full settled=" + firstCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + firstCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + firstCurrObj.debitObject.isMarketTrade));
        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal second currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + secondCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + secondCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + secondCurrObj.Amount + ",Coin=" + secondCurrObj.Coin + ", CR WalletID=" + secondCurrObj.creditObject.WalletId + ",Dr WalletID=" + secondCurrObj.debitObject.WalletId + " cr full settled=" + secondCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + secondCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + secondCurrObj.debitObject.isMarketTrade));


        //        // check amount for both object
        //        // check coin name for both object
        //        // check refno for all 4 object
        //        // check walletid for all 4 object

        //        // call CheckTrnIDDrForHoldAsync for both debit trn object

        //        // check shadow balance for both debit walletid and amount
        //        //having sufficient balance for debit walletid both
        //        //wallet status for all walletid should be enable 

        //        var firstCurrObjCrWMTask = _commonRepository.GetByIdAsync(firstCurrObj.creditObject.WalletId);
        //        if (firstCurrObj.debitObject.isMarketTrade == 1)
        //        {
        //            checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForMarketAsync(firstCurrObj);
        //        }
        //        else
        //        {
        //            checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForHoldAsync(firstCurrObj);
        //        }
        //        var firstCurrObjDrWMTask = _commonRepository.GetByIdAsync(firstCurrObj.debitObject.WalletId);

        //        if (secondCurrObj.debitObject.isMarketTrade == 1)
        //        {
        //            checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForMarketAsync(secondCurrObj);
        //        }
        //        else
        //        {
        //            checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForHoldAsync(secondCurrObj);
        //        }
        //        var secondCurrObjCrWMTask = _commonRepository.GetByIdAsync(secondCurrObj.creditObject.WalletId);

        //        Task<MemberShadowBalance> FirstDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == firstCurrObj.creditObject.WalletId);

        //        var secondCurrObjDrWMTask = _commonRepository.GetByIdAsync(secondCurrObj.debitObject.WalletId);

        //        Task<MemberShadowBalance> SecondDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == secondCurrObj.creditObject.WalletId);

        //        Task<bool> CheckUserCrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.creditObject.WalletId);
        //        Task<WalletTypeMaster> walletTypeFirstCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == firstCurrObj.Coin);
        //        firstCurrObjCrWM = await firstCurrObjCrWMTask;
        //        firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

        //        firstCurrObjDrWM = await firstCurrObjDrWMTask;
        //        firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

        //        CheckUserCrBalanceFlag = await CheckUserCrBalanceFlagTask;
        //        if (!CheckUserCrBalanceFlag)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        Task<bool> CheckUserDrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
        //        Task<WalletTypeMaster> walletTypeSecondCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == secondCurrObj.Coin);
        //        firstCurrObjCrWM = await firstCurrObjCrWMTask;
        //        firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

        //        CheckUserDrBalanceFlag = await CheckUserDrBalanceFlagTask;
        //        if (!CheckUserDrBalanceFlag)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.debitObject.WalletId, firstCurrObj.Coin, firstCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        firstCurrObjDrWM = await firstCurrObjDrWMTask;
        //        firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

        //        //Task<bool> CheckUserCrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.creditObject.WalletId);
        //        //Task<bool> CheckUserDrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
        //        //Task<bool> CheckUserCrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.creditObject.WalletId);
        //        //Task<bool> CheckUserDrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);

        //        Task<bool> CheckUserCrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.creditObject.WalletId);

        //        firstCurrObjCrWM = await firstCurrObjCrWMTask;
        //        firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

        //        firstCurrObjDrWM = await firstCurrObjDrWMTask;
        //        firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

        //        CheckUserCrBalanceFlag1 = await CheckUserCrBalanceFlagTask1;
        //        if (!CheckUserCrBalanceFlag1)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.debitObject.WalletId, secondCurrObj.Coin, secondCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        Task<bool> CheckUserDrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);


        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetWalletCreditDrForHoldNewAsyncFinal before await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


        //        firstCurrObjCrWM = await firstCurrObjCrWMTask;
        //        if (firstCurrObjCrWM == null)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, secondCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

        //        firstCurrObjDrWM = await firstCurrObjDrWMTask;
        //        if (firstCurrObjDrWM == null)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, secondCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }
        //        firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

        //        secondCurrObjCrWM = await secondCurrObjCrWMTask;
        //        if (secondCurrObjCrWM == null)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }
        //        secondCurrObj.creditObject.UserID = secondCurrObjCrWM.UserID;

        //        secondCurrObjDrWM = await secondCurrObjDrWMTask;
        //        if (secondCurrObjDrWM == null)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }
        //        secondCurrObj.debitObject.UserID = secondCurrObjDrWM.UserID;

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

        //        checkDebitRefNo = await checkDebitRefNoTask;
        //        if (checkDebitRefNo == false)//fail
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        checkDebitRefNo1 = await checkDebitRefNoTask1;
        //        if (checkDebitRefNo1 == false)//fail
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", secondCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        if (firstCurrObj.debitObject.isMarketTrade == 1 && firstCurrObj.debitObject.differenceAmount > 0)
        //        {
        //            if (firstCurrObjDrWM.Balance < firstCurrObj.debitObject.differenceAmount)
        //            {
        //                // insert with status=2 system failed
        //                tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //                tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //            }
        //            bizResponseClassFC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(firstCurrObjDrWM, timestamp, serviceType, firstCurrObj.debitObject.differenceAmount, firstCurrObj.Coin, allowedChannels, firstCurrObjDrWM.WalletTypeID, firstCurrObj.debitObject.WTQTrnNo, firstCurrObj.debitObject.WalletId, firstCurrObj.debitObject.UserID, enTrnType.Buy_Trade, firstCurrObj.debitObject.trnType, enWalletDeductionType.Market);
        //            if (bizResponseClassFC.ReturnCode != enResponseCode.Success)
        //            {
        //                tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //                tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.FirstCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //            }
        //        }
        //        if (secondCurrObj.debitObject.isMarketTrade == 1 && secondCurrObj.debitObject.differenceAmount > 0)
        //        {
        //            if (secondCurrObjDrWM.Balance < secondCurrObj.debitObject.differenceAmount)
        //            {
        //                // insert with status=2 system failed
        //                tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //                tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //            }
        //            bizResponseClassSC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(secondCurrObjDrWM, timestamp, serviceType, secondCurrObj.debitObject.differenceAmount, secondCurrObj.Coin, allowedChannels, secondCurrObjDrWM.WalletTypeID, secondCurrObj.debitObject.WTQTrnNo, secondCurrObj.debitObject.WalletId, secondCurrObj.debitObject.UserID, enTrnType.Buy_Trade, secondCurrObj.debitObject.trnType, enWalletDeductionType.Market);
        //            if (bizResponseClassSC.ReturnCode != enResponseCode.Success)
        //            {
        //                tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //                tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.SecondCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //            }
        //        }
        //        //Task<WalletTransactionQueue> firstCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(firstCurrObj.debitObject.WTQTrnNo);
        //        //Task<WalletTransactionQueue> secondCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(secondCurrObj.debitObject.WTQTrnNo);

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

        //        if (firstCurrObj.Coin == string.Empty || secondCurrObj.Coin == string.Empty)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
        //        }
        //        if (firstCurrObj.Amount <= 0 || secondCurrObj.Amount <= 0)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmt }, "Credit");
        //        }
        //        if (firstCurrObj.creditObject.TrnRefNo == 0 || secondCurrObj.creditObject.TrnRefNo == 0)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNoCr, ErrorCode = enErrorCode.InvalidTradeRefNoCr }, "Credit");
        //        }
        //        if (firstCurrObj.debitObject.TrnRefNo == 0 || secondCurrObj.debitObject.TrnRefNo == 0)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNoDr, ErrorCode = enErrorCode.InvalidTradeRefNoDr }, "Debit");
        //        }
        //        walletTypeFirstCurr = await walletTypeFirstCurrTask;
        //        walletTypeSecondCurr = await walletTypeSecondCurrTask;

        //        if (walletTypeFirstCurr == null || walletTypeSecondCurr == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
        //        }

        //        //ntrivedi 18-12-2018  IsValidChannel and  IsValidWallet is added 
        //        bool channelFlag = _walletConfiguration.IsValidChannel((long)allowedChannels, (long)firstCurrObj.creditObject.trnType);
        //        if (channelFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, firstCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidChannel, firstCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidChannelFirstCurrCr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        channelFlag = _walletConfiguration.IsValidChannel((long)allowedChannels, (long)secondCurrObj.creditObject.trnType);
        //        if (channelFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidChannel, secondCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidChannelSecondCurrCr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        channelFlag = _walletConfiguration.IsValidChannel((long)allowedChannels, (long)firstCurrObj.debitObject.trnType);
        //        if (channelFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidChannel, firstCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidChannelFirstCurrDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        channelFlag = _walletConfiguration.IsValidChannel((long)allowedChannels, (long)secondCurrObj.debitObject.trnType);
        //        if (channelFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidChannel, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidChannelSecondCurrDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        bool walletFlag = _walletConfiguration.IsValidWallet(firstCurrObj.debitObject.WalletId,(long)firstCurrObj.debitObject.trnType ,firstCurrObjDrWM.Id);
        //        if (walletFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWalletTransaction, firstCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWalletTransaction, ErrorCode = enErrorCode.InvalidWalletTransactionFirstCurrDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        walletFlag = _walletConfiguration.IsValidWallet(secondCurrObj.debitObject.WalletId, (long)secondCurrObj.debitObject.trnType, secondCurrObjDrWM.Id);
        //        if (walletFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWalletTransaction, secondCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWalletTransaction, ErrorCode = enErrorCode.InvalidWalletTransactionSecondCurrDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        walletFlag = _walletConfiguration.IsValidWallet(firstCurrObj.creditObject.WalletId, (long)firstCurrObj.creditObject.trnType, firstCurrObjCrWM.Id);
        //        if (walletFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, firstCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWalletTransaction, firstCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWalletTransaction, ErrorCode = enErrorCode.InvalidWalletTransactionFirstCurrCr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        walletFlag = _walletConfiguration.IsValidWallet(secondCurrObj.creditObject.WalletId, (long)secondCurrObj.creditObject.trnType, secondCurrObjCrWM.Id);
        //        if (walletFlag == false)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWalletTransaction, secondCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWalletTransaction, ErrorCode = enErrorCode.InvalidWalletTransactionSecondCurrCr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }

        //        //bool flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.creditObject.WalletId);
        //        //flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.debitObject.WalletId);
        //        //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.creditObject.WalletId);
        //        //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.debitObject.WalletId);

        //        Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetWalletCreditDrForHoldNewAsyncFinal before await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


        //        //Task<enErrorCode> enErrorCodeTaskfirst = _commonWalletFunction.CheckShadowLimitAsync(firstCurrObjDrWM.Id, firstCurrObj.Amount);
        //        //enErrorCodefirst = await enErrorCodeTaskfirst;
        //        //if (enErrorCodefirst != enErrorCode.Success)
        //        //{
        //        //    tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //        //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        //}
        //        if (firstCurrObjDrWM.OutBoundBalance < firstCurrObj.Amount) // ntrivedi checking outbound balance
        //        {
        //            // insert with status=2 system failed
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutgoingBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        //Task<enErrorCode> enErrorCodeTaskSecond = _commonWalletFunction.CheckShadowLimitAsync(secondCurrObjDrWM.Id, secondCurrObj.Amount);
        //        //enErrorCodeSecond = await enErrorCodeTaskSecond;
        //        //if (enErrorCodeSecond != enErrorCode.Success)
        //        //{
        //        //    tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
        //        //    tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        //}

        //        if (secondCurrObjDrWM.OutBoundBalance < secondCurrObj.Amount)// ntrivedi checking outbound balance
        //        {
        //            // insert with status=2 system failed
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficietOutgoingBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        if (firstCurrObjDrWM.Status != 1)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        if (secondCurrObjDrWM.Status != 1)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }


        //        CheckUserDrBalanceFlag1 = await CheckUserDrBalanceFlagTask1;
        //        if (!CheckUserDrBalanceFlag1)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.creditObject.trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWalletSecDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));



        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

        //        //bool flag = await _walletRepository1.WalletCreditDebitwithTQTestFinal(firstCurrObjTQ, secondCurrObjTQ, secondCurrObjTO, firstCurrObjTO, FirstDebitShadowWallet, SecondDebitShadowWallet, firstCurrObjTQDr, secondCurrObjTQDr, firstCurrObj, secondCurrObj, firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL, firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA);
        //        BizResponseClass bizResponse = _walletSPRepositories.Callsp_CrDrWalletForHold(firstCurrObj, secondCurrObj, timestamp, serviceType, walletTypeFirstCurr.Id, walletTypeSecondCurr.Id, (long)allowedChannels);

        //        _walletRepository1.ReloadEntity(firstCurrObjCrWM, secondCurrObjCrWM, firstCurrObjDrWM, secondCurrObjDrWM);

        //        if (bizResponse.ReturnCode != enResponseCode.Success)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = 0, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Credit");
        //        }

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

        //        Task.Run(() => CreditDebitNotificationSend(timestamp, firstCurrObj, secondCurrObj, firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjCrWM));

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal:Without Token done", "WalletService", ",timestamp =" + timestamp));

                

        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");


        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetWalletCreditDrForHoldNewAsyncFinal TimeStamp:" + timestamp, this.GetType().Name, ex);
        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
        //        //throw ex;
        //    }
        //}

        //public async Task<WalletDrCrResponse> GetWalletHoldNew(long userID,string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        //{
        //    try
        //    {
        //        WalletMaster dWalletobj;
        //        string remarks = "";
        //        WalletTypeMaster walletTypeMaster;
        //        WalletTransactionQueue objTQ;
        //        //long walletTypeID;
        //        WalletDrCrResponse resp = new WalletDrCrResponse();
        //        bool CheckUserBalanceFlag = false;
        //        enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
        //        long TrnNo = 0;

        //        HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "WalletTransactionService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

        //        //Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
        //        if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty)
        //        {
        //            return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = timestamp };
        //        }
        //        //walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
        //        //if (walletTypeMaster == null)
        //        //{
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = timestamp }, "Debit");
        //        //}

        //        Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.AccWalletID == accWalletID);

        //        if (TrnRefNo == 0) // sell 13-10-2018
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
        //        }
        //        if (amount <= 0)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
        //        }
        //        dWalletobj = await dWalletobjTask;
        //        if (dWalletobj == null)
        //        {
        //            //tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = timestamp }, "Debit");
        //        }
        //        // Wallet Limit Check
        //        //var msg = _commonWalletFunction.CheckWalletLimitAsync(enWalletLimitType.TradingLimit, dWalletobj.Id, amount);

        //        //userID = dWalletobj.UserID;
        //        //var errorCode = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);
        //        ////Task<bool> flagTask = CheckUserBalanceAsync(dWalletobj.Id);
        //        //var flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
        //        //if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
        //        //{
        //        //    // insert with status=2 system failed
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        //}

        //        HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
        //        //CheckUserBalanceFlag = await flagTask;

        //        //Wallet Limit Validation
        //        //var limitres = await msg;
        //        //if (limitres != enErrorCode.Success)
        //        //{
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletLimitExceed, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse
        //        //    {
        //        //        ReturnCode = enResponseCode.Fail,
        //        //        ReturnMsg = EnResponseMessage.WalletLimitExceed,
        //        //        ErrorCode = limitres,
        //        //        TrnNo = objTQ.TrnNo,
        //        //        Status = objTQ.Status,
        //        //        StatusMsg = objTQ.StatusMsg
        //        //    }, "DebitForHold");
        //        //}


        //        //CheckUserBalanceFlag = await flagTask;
        //        //ntrivedi 18-12-2018  IsValidChannel and  IsValidWallet is added 
        //        //bool channelFlag = _walletConfiguration.IsValidChannel((long)allowedChannels, (long)trnType);
        //        //if(channelFlag == false)
        //        //{
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidChannel, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidChannelWalletHold, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        //}

        //        //bool walletFlag = _walletConfiguration.IsValidWallet(dWalletobj.Id, (long)trnType, walletTypeMaster.Id);
        //        //if (walletFlag == false)
        //        //{
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWalletTransaction, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWalletTransaction, ErrorCode = enErrorCode.InvalidWalletTransactionWalletHold, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        //}
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
        //        //dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
        //        if (dWalletobj.Balance < amount)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType, Convert.ToInt64(enErrorCode.InsufficantBal));
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        }

        //        //if (!CheckUserBalanceFlag)
        //        //{
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        //}
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

        //        //enErrorCode enErrorCode1 = await errorCode;
        //        //if (enErrorCode1 != enErrorCode.Success)
        //        //{
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        //}
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
        //        #region Commented Code
        //        //vsolanki 208-11-1 ntrivedi at transaction time transaction limit is checked so duplicate so remove for time 
        //        //var charge = GetServiceLimitChargeValue(routeTrnType, coinName);
        //        //if (charge.MaxAmount < amount && charge.MinAmount > amount && charge.MaxAmount != 0 && charge.MinAmount != 0)
        //        //{
        //        //    var msg1 = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg;
        //        //    msg1 = msg1.Replace("@MIN", charge.MinAmount.ToString());
        //        //    msg1 = msg1.Replace("@MAX", charge.MaxAmount.ToString());
        //        //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, msg1, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = msg1, ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax }, "Debit");
        //        //}


        //        #endregion
        //        //int count = await countTask;
        //        //CheckTrnRefNoRes count1 = await countTask1;
        //        //if (count1.TotalCount != 0)
        //        //{
        //        //    // insert with status=2 system failed
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
        //        //}
        //        //if (count != 0)
        //        //{
        //        //    // insert with status=2 system failed
        //        //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        //}
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

        //       // #region Commented Code
               

        //        BizResponseClass bizResponse = _walletSPRepositories.Callsp_HoldWalletFinal(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, dWalletobj.WalletTypeID, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo, enWalletDeductionType);

        //        if (bizResponse.ReturnCode == enResponseCode.Success)
        //        {
        //            Task.Run(() => WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType));
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "DebitForHold");

        //        }
        //        else
        //        {
        //            //objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, dWalletobj.UserID, timestamp, enTransactionStatus.SystemFail, bizResponse.ReturnMsg, trnType, Convert.ToInt64(bizResponse.ErrorCode));                    
        //            //objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 2);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.SP_sp_CrDrWallet_ReturnFail, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "DebitForHold");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetWalletHoldNew TimeStamp:" + timestamp, this.GetType().Name, ex);
        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = EnResponseMessage.InternalError, TimeStamp = timestamp }, "DebitForHold");
        //        //throw ex;
        //    }
        //}

        //public async Task<WalletDrCrResponse> GetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "")
        //{
        //    try
        //    {
        //        WalletMaster dWalletobj;
        //        string remarks = "";
        //        WalletTypeMaster walletTypeMaster;
        //        WalletTransactionQueue objTQ;
        //        //long walletTypeID;
        //        WalletDrCrResponse resp = new WalletDrCrResponse();
        //        bool CheckUserBalanceFlag = false;
        //        enWalletTranxOrderType orderType = enWalletTranxOrderType.Debit;
        //        long userID = 0, TrnNo = 0;

        //        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

        //        //Task<int> countTask = _walletRepository1.CheckTrnRefNoAsync(TrnRefNo, orderType, trnType); //CheckTrnRefNo(TrnRefNo, orderType, trnType);
        //        if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty)
        //        {
        //            return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName };
        //        }
        //        walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
        //        if (walletTypeMaster == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Debit");
        //        }

        //        Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID);

        //        if (TrnRefNo == 0) // sell 13-10-2018
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        if (amount <= 0)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        dWalletobj = await dWalletobjTask;
        //        if (dWalletobj == null)
        //        {
        //            //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet }, "Debit");
        //        }
        //        userID = dWalletobj.UserID;
        //        //var errorCode = _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);
        //        Task<bool> flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
        //        //Task<bool> flagTask1 = CheckUserBalanceAsync(dWalletobj.Id, enBalanceType.OutBoundBalance);

        //        if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }

        //        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString());
        //        CheckUserBalanceFlag = await flagTask;

        //        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString());
        //        dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 

        //        if (!CheckUserBalanceFlag)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        Task<bool> flagTask1 = CheckUserBalanceAsync(amount, dWalletobj.Id, enBalanceType.OutBoundBalance);
        //        CheckUserBalanceFlag = await flagTask1;
        //        if (!CheckUserBalanceFlag)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedOutgoingBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString());
        //        // ntrivedi 08-01-2018 no need to check shadow limit when release hold balance
        //        //enErrorCode enErrorCode1 = await errorCode;
        //        //if (enErrorCode1 != enErrorCode.Success)
        //        //{
        //        //    objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        //}
        //        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString());

        //        //int count = await countTask;
        //        //if (count != 0)
        //        //{
        //        //    // insert with status=2 system failed
        //        //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
        //        //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        //}
        //        if (dWalletobj.OutBoundBalance < amount)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutboundBalance, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString());

        //        BizResponseClass bizResponse = _walletSPRepositories.Callsp_ReleaseHoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo);

        //        if (bizResponse.ReturnCode == enResponseCode.Success)
        //        {
        //            WalletMasterResponse walletMasterObj = new WalletMasterResponse();
        //            walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
        //            walletMasterObj.Balance = dWalletobj.Balance;
        //            walletMasterObj.WalletName = dWalletobj.Walletname;
        //            walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
        //            walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
        //            walletMasterObj.CoinName = coinName;
        //            walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

        //            ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //            ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceReleaseNotification);
        //            ActivityNotification.Param1 = coinName;
        //            ActivityNotification.Param2 = amount.ToString();
        //            ActivityNotification.Param3 = TrnRefNo.ToString();
        //            ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //            HelperForLog.WriteLogIntoFileAsync("GetReleaseHoldNew", "OnWalletBalChange + SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());

        //            Task.Run(() => Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
        //                () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2)));

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = TrnNo, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg }, "Debit");

        //        }
        //        else
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg }, "Debit");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetReleaseHoldNew TimeStamp:" + timestamp, this.GetType().Name, ex);
        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "" }, "DebitForHold");
        //        //throw ex;
        //    }
        //}

        //public WalletDrCrResponse GetCrDRResponse(WalletDrCrResponse obj, string extras)
        //{
        //    try
        //    {
        //        Task.Run(() => HelperForLog.WriteLogIntoFile(extras, "WalletService", "TimeStamp" + obj.TimeStamp + ",ReturnCode=" + obj.ReturnCode + ",ErrorCode=" + obj.ErrorCode + ", ReturnMsg=" + obj.ReturnMsg + ",StatusMsg=" + obj.StatusMsg + ",TrnNo=" + obj.TrnNo));
        //        return obj;
        //    }
        //    catch (Exception ex)
        //    {
        //        return obj;
        //    }
        //}
        //public async Task WalletHoldNotificationSend(string timestamp, WalletMaster dWalletobj, string coinName, decimal amount, long TrnRefNo, byte routeTrnType)
        //{
        //    try
        //    {
        //        WalletMasterResponse walletMasterObj = new WalletMasterResponse();
        //        walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
        //        walletMasterObj.Balance = dWalletobj.Balance;
        //        walletMasterObj.WalletName = dWalletobj.Walletname;
        //        walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
        //        walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
        //        walletMasterObj.CoinName = coinName;
        //        walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;
        //        #region EMAIL_SMS
        //        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceNotification);
        //        ActivityNotification.Param1 = coinName;
        //        ActivityNotification.Param2 = amount.ToString();
        //        ActivityNotification.Param3 = TrnRefNo.ToString();
        //        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //        HelperForLog.WriteLogIntoFileAsync("WalletHoldNotificationSend", "OnWalletBalChange + SendActivityNotificationV2 pre timestamp=" + timestamp.ToString());

        //        Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
        //            () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2),
        //            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, dWalletobj.UserID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString()),
        //            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, dWalletobj.UserID.ToString(), amount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString()));
        //        #endregion 
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, this.GetType().Name, ex);
        //        //throw ex;
        //    }
        //}

        //public async Task CreditWalletNotificationSend(string timestamp, WalletMasterResponse walletMasterObj, string coinName, decimal TotalAmount, long TrnRefNo, byte routeTrnType, long userID, string Token, string Wtrntype)
        //{
        //    try
        //    {
        //        #region SMS_EMail           
        //        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
        //        ActivityNotification.Param1 = coinName;
        //        ActivityNotification.Param2 = routeTrnType.ToString();
        //        ActivityNotification.Param3 = TrnRefNo.ToString();
        //        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //        HelperForLog.WriteLogIntoFile("GetWalletCreditNew Activity:With Token", "WalletTransactionService", "msg=" + ActivityNotification.MsgCode.ToString() + "," + "WalletID" + walletMasterObj.AccWalletID + ",Balance" + walletMasterObj.Balance.ToString());

        //        var trnType = Wtrntype.Contains("Cr_") ? Wtrntype.Replace("Cr_", "") : Wtrntype.Replace("Dr_", "");
        //        Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, userID.ToString(), 2),
        //           () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, userID.ToString(), 2),
        //           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, userID.ToString(), null, null, null, null, coinName, trnType, TrnRefNo.ToString()),
        //           () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, userID.ToString(), TotalAmount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), trnType));

        //        #endregion
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, "WalletService", ex);
        //        //throw ex;
        //    }
        //}

        //public async Task WalletDeductionNewNotificationSend(string timestamp, WalletMaster dWalletobj, string coinName, decimal amount, long TrnRefNo, byte routeTrnType, long userID, string Token, string Wtrntype, WalletMasterResponse walletMasterObj)
        //{
        //    try
        //    {            
        //        #region SMS_Email
        //        ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
        //        ActivityNotification.Param1 = coinName;
        //        ActivityNotification.Param2 = routeTrnType.ToString();
        //        ActivityNotification.Param3 = TrnRefNo.ToString();
        //        ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
        //        HelperForLog.WriteLogIntoFileAsync("WalletDeductionNewNotificationSend", "OnWalletBalChange + SendActivityNotificationV2 pre TrnNo=" + TrnRefNo.ToString());

        //        var trnType = Wtrntype.Contains("Cr_") ? Wtrntype.Replace("Cr_", "") : Wtrntype.Replace("Dr_", "");
        //        Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, dWalletobj.UserID.ToString(), 2),
        //           () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2),
        //           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, userID.ToString(), null, null, null, null, coinName, trnType, TrnRefNo.ToString()),
        //           () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, userID.ToString(), amount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), trnType));
        //        #endregion
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, this.GetType().Name, ex);
        //        //throw ex;
        //    }
        //}

        //public async Task SMSSendAsyncV1(EnTemplateType templateType, string UserID, string WalletName = null, string SourcePrice = null, string DestinationPrice = null, string ONOFF = null, string Coin = null, string TrnType = null, string TrnNo = null)
        //{
        //    try
        //    {
        //        HelperForLog.WriteLogIntoFile("WalletService", "0 SMSSendAsyncV1", " -Data- " + templateType.ToString());
        //        CommunicationParamater communicationParamater = new CommunicationParamater();
        //        ApplicationUser User = new ApplicationUser();
        //        User = await _userManager.FindByIdAsync(UserID);
        //        HelperForLog.WriteLogIntoFile("WalletService", "0 SMSSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
        //        //User.Mobile = ""; //for testing
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            if (!string.IsNullOrEmpty(User.Mobile) && Convert.ToInt16(templateType) != 0)
        //            {
        //                if (!string.IsNullOrEmpty(WalletName))
        //                {
        //                    communicationParamater.Param1 = WalletName;  //1.WalletName for CreateWallet and address 2.WalletType for Beneficiary method                                               
        //                }
        //                if (!string.IsNullOrEmpty(SourcePrice) && !string.IsNullOrEmpty(DestinationPrice))
        //                {
        //                    communicationParamater.Param1 = SourcePrice;
        //                    communicationParamater.Param2 = DestinationPrice;
        //                }
        //                if (!string.IsNullOrEmpty(ONOFF))// for whitelisted bit
        //                {
        //                    communicationParamater.Param1 = ONOFF;
        //                }
        //                if (!string.IsNullOrEmpty(Coin) && !string.IsNullOrEmpty(TrnType) && !string.IsNullOrEmpty(TrnNo))//for credit or debit
        //                {
        //                    communicationParamater.Param1 = Coin;
        //                    communicationParamater.Param2 = TrnType;
        //                    communicationParamater.Param3 = TrnNo;
        //                }

        //                var SmsData = _messageService.ReplaceTemplateMasterData(templateType, communicationParamater, enCommunicationServiceType.SMS).Result;
        //                if (SmsData != null)
        //                {
        //                    if (SmsData.IsOnOff == 1)
        //                    {
        //                        //SmsData.Content
        //                        SendSMSRequest Request = new SendSMSRequest();
        //                        Request.Message = SmsData.Content;
        //                        Request.MobileNo = Convert.ToInt64(User.Mobile);
        //                        HelperForLog.WriteLogIntoFile("WalletService", "0 SMSSendAsyncV1", " -Data- " + SmsData.Content);
        //                        _pushSMSQueue.Enqueue(Request);
        //                    }
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("SMSSendAsyncV1" + " - Data- " + templateType.ToString(), this.GetType().Name, ex);
        //    }
        //}

        ////2018-12-6
        //public async Task EmailSendAsyncV1(EnTemplateType templateType, string UserID, string Param1 = "", string Param2 = "", string Param3 = "", string Param4 = "", string Param5 = "", string Param6 = "", string Param7 = "", string Param8 = "", string Param9 = "")
        //{
        //    try
        //    {
        //        HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + templateType.ToString() + "Parameters" + Param1 + Param2 + Param3 + Param4 + Param5 + Param6 + Param7 + Param8 + Param9);
        //        CommunicationParamater communicationParamater = new CommunicationParamater();
        //        SendEmailRequest Request = new SendEmailRequest();
        //        ApplicationUser User = new ApplicationUser();
        //        User = await _userManager.FindByIdAsync(UserID);
        //        HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
        //        if (!string.IsNullOrEmpty(UserID))
        //        {
        //            if (!string.IsNullOrEmpty(User.Email) && Convert.ToInt16(templateType) != 0)
        //            {
        //                communicationParamater.Param1 = User.UserName;
        //                if (!string.IsNullOrEmpty(Param1))
        //                {
        //                    communicationParamater.Param2 = Param1;
        //                    communicationParamater.Param3 = Param2;
        //                    communicationParamater.Param4 = Param3;
        //                    communicationParamater.Param5 = Param4;
        //                    communicationParamater.Param6 = Param5;
        //                    communicationParamater.Param7 = Param6;
        //                    communicationParamater.Param8 = Param7;
        //                    communicationParamater.Param9 = Param8;
        //                    communicationParamater.Param10 = Param9;
        //                }
        //                //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + "Parameters" + Param1 + Param2 + Param3 + Param4 + Param5 + Param6 + Param7 + Param8 + Param9);
        //                var EmailData = _messageService.ReplaceTemplateMasterData(templateType, communicationParamater, enCommunicationServiceType.Email).Result;
        //                //HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
        //                if (EmailData != null)
        //                {
        //                    Request.Body = EmailData.Content;
        //                    Request.Subject = EmailData.AdditionalInfo;
        //                    Request.EmailType = Convert.ToInt16(EnEmailType.Template);
        //                    HelperForLog.WriteLogIntoFile("WalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
        //                    Request.Recepient = User.Email;
        //                    //HelperForLog.WriteLogForSocket("WalletService", "0 EmailSendAsyncV1", " -Data- " + EmailData);
        //                    _pushNotificationsQueue.Enqueue(Request);
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " -Data- " + templateType.ToString(), this.GetType().Name, ex);
        //    }
        //}

        //public async Task<bool> CheckUserBalanceAsync(decimal amount, long WalletId, enBalanceType enBalance = enBalanceType.AvailableBalance, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        //{
        //    try
        //    {

        //        decimal crsum, drsum;
        //        decimal wObjBal;//= GetUserBalance(WalletId);
        //        WalletMaster walletObject;
        //        //var TA = _TransactionAccountsRepository.FindBy(item=>item.WalletID== WalletId);

        //        Task<decimal> crsumTask = _TransactionAccountsRepository.GetSumAsync(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalance, f => f.CrAmt);
        //        Task<decimal> drsumTask = _TransactionAccountsRepository.GetSumAsync(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalance, f => f.DrAmt);
        //        Task<WalletMaster> walletObjectTask = _commonRepository.GetByIdAsync(WalletId);
        //        crsum = await crsumTask;
        //        drsum = await drsumTask;
        //        walletObject = await walletObjectTask;
        //        //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
        //        if (walletObject.WalletUsageType != Convert.ToInt16(enWalletUsageType))
        //        {
        //            HelperForLog.WriteLogIntoFileAsync("CheckUserBalanceAsync WalletTransactionService", "WalletId=" + WalletId.ToString() + "WalletUsageType Mismatching :" + enWalletUsageType);
        //            return false;
        //        }

        //        decimal total = crsum - drsum;
        //        if (enBalance == enBalanceType.AvailableBalance)
        //        {
        //            wObjBal = walletObject.Balance;
        //        }
        //        else if (enBalance == enBalanceType.OutBoundBalance)
        //        {
        //            wObjBal = walletObject.OutBoundBalance;
        //        }
        //        else if (enBalance == enBalanceType.InBoundBalance)
        //        {
        //            wObjBal = walletObject.InBoundBalance;
        //        }
        //        else
        //        {
        //            return false;
        //        }
        //        if (total == wObjBal && total >= 0)
        //        {
        //            return true;
        //        }
        //        else
        //        {
        //            HelperForLog.WriteLogIntoFileAsync("CheckUserBalance Reload Entity", "WalletId=" + walletObject.Id.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
        //            _commonRepository.ReloadEntity(walletObject);
        //            if (enBalance == enBalanceType.AvailableBalance)
        //            {
        //                wObjBal = walletObject.Balance;
        //                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
        //            }
        //            else if (enBalance == enBalanceType.OutBoundBalance)
        //            {
        //                wObjBal = walletObject.OutBoundBalance;
        //                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance OutBoundBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
        //            }
        //            else if (enBalance == enBalanceType.InBoundBalance)
        //            {
        //                wObjBal = walletObject.InBoundBalance;
        //                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance InBoundBalance", "WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
        //            }
        //            else
        //            {
        //                return false;
        //            }
        //            if (total == wObjBal && total >= 0)
        //            {
        //                return true;
        //            }
        //            else
        //            {
        //                if (Math.Abs(total - wObjBal) % amount == 0)
        //                {
        //                    return true;
        //                }
        //                HelperForLog.WriteLogIntoFileAsync("CheckUserBalance failed.", "Amount: " + amount.ToString() + "  WalletId=" + WalletId.ToString() + ",Total=" + total.ToString() + ",dbbalance=" + wObjBal.ToString());
        //                return false;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
        //        throw ex;
        //    }
        //}

        //public async Task CreditDebitNotificationSend(string timestamp, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, WalletMaster firstCurrObjCrWM, WalletMaster firstCurrObjDrWM, WalletMaster secondCurrObjCrWM, WalletMaster secondCurrObjDrWM)
        //{
        //    try
        //    {
        //        #region SMS_Email
        //        WalletMasterResponse walletMasterObjCr = new WalletMasterResponse();
        //        walletMasterObjCr.AccWalletID = firstCurrObjCrWM.AccWalletID;
        //        walletMasterObjCr.Balance = firstCurrObjCrWM.Balance;
        //        walletMasterObjCr.WalletName = firstCurrObjCrWM.Walletname;
        //        walletMasterObjCr.PublicAddress = firstCurrObjCrWM.PublicAddress;
        //        walletMasterObjCr.IsDefaultWallet = firstCurrObjCrWM.IsDefaultWallet;
        //        walletMasterObjCr.CoinName = firstCurrObj.Coin;
        //        walletMasterObjCr.OutBoundBalance = firstCurrObjCrWM.OutBoundBalance;

        //        WalletMasterResponse walletMasterObjCr1 = new WalletMasterResponse();
        //        walletMasterObjCr1.AccWalletID = secondCurrObjCrWM.AccWalletID;
        //        walletMasterObjCr1.Balance = secondCurrObjCrWM.Balance;
        //        walletMasterObjCr1.WalletName = secondCurrObjCrWM.Walletname;
        //        walletMasterObjCr1.PublicAddress = secondCurrObjCrWM.PublicAddress;
        //        walletMasterObjCr1.IsDefaultWallet = secondCurrObjCrWM.IsDefaultWallet;
        //        walletMasterObjCr1.CoinName = secondCurrObj.Coin;
        //        walletMasterObjCr1.OutBoundBalance = secondCurrObjCrWM.OutBoundBalance;


        //        ActivityNotificationMessage ActivityNotificationCr = new ActivityNotificationMessage();
        //        ActivityNotificationCr.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
        //        ActivityNotificationCr.Param1 = firstCurrObj.Coin;
        //        ActivityNotificationCr.Param2 = firstCurrObj.creditObject.trnType.ToString();
        //        ActivityNotificationCr.Param3 = firstCurrObj.creditObject.TrnRefNo.ToString();
        //        ActivityNotificationCr.Type = Convert.ToInt16(EnNotificationType.Info);

        //        ActivityNotificationMessage ActivityNotificationCr1 = new ActivityNotificationMessage();
        //        ActivityNotificationCr1.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
        //        ActivityNotificationCr1.Param1 = secondCurrObj.Coin;
        //        ActivityNotificationCr1.Param2 = firstCurrObj.creditObject.trnType.ToString();
        //        ActivityNotificationCr1.Param3 = secondCurrObj.creditObject.TrnRefNo.ToString();
        //        ActivityNotificationCr1.Type = Convert.ToInt16(EnNotificationType.Info);


        //        WalletMasterResponse walletMasterObjDr = new WalletMasterResponse();
        //        walletMasterObjDr.AccWalletID = firstCurrObjDrWM.AccWalletID;
        //        walletMasterObjDr.Balance = firstCurrObjDrWM.Balance;
        //        walletMasterObjDr.WalletName = firstCurrObjDrWM.Walletname;
        //        walletMasterObjDr.PublicAddress = firstCurrObjDrWM.PublicAddress;
        //        walletMasterObjDr.IsDefaultWallet = firstCurrObjDrWM.IsDefaultWallet;
        //        walletMasterObjDr.CoinName = firstCurrObj.Coin;
        //        walletMasterObjDr.OutBoundBalance = firstCurrObjDrWM.OutBoundBalance;


        //        WalletMasterResponse walletMasterObjDr1 = new WalletMasterResponse();
        //        walletMasterObjDr1.AccWalletID = secondCurrObjDrWM.AccWalletID;
        //        walletMasterObjDr1.Balance = secondCurrObjDrWM.Balance;
        //        walletMasterObjDr1.WalletName = secondCurrObjDrWM.Walletname;
        //        walletMasterObjDr1.PublicAddress = secondCurrObjDrWM.PublicAddress;
        //        walletMasterObjDr1.IsDefaultWallet = secondCurrObjDrWM.IsDefaultWallet;
        //        walletMasterObjDr1.CoinName = secondCurrObj.Coin;
        //        walletMasterObjDr1.OutBoundBalance = secondCurrObjDrWM.OutBoundBalance;



        //        ActivityNotificationMessage ActivityNotificationdr = new ActivityNotificationMessage();
        //        ActivityNotificationdr.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
        //        ActivityNotificationdr.Param1 = firstCurrObj.Coin;
        //        ActivityNotificationdr.Param2 = firstCurrObj.debitObject.trnType.ToString();
        //        ActivityNotificationdr.Param3 = firstCurrObj.debitObject.TrnRefNo.ToString();
        //        ActivityNotificationdr.Type = Convert.ToInt16(EnNotificationType.Info);

        //        ActivityNotificationMessage ActivityNotificationdr1 = new ActivityNotificationMessage();
        //        ActivityNotificationdr1.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
        //        ActivityNotificationdr1.Param1 = secondCurrObj.Coin;
        //        ActivityNotificationdr1.Param2 = secondCurrObj.debitObject.trnType.ToString();
        //        ActivityNotificationdr1.Param3 = secondCurrObj.debitObject.TrnRefNo.ToString();
        //        ActivityNotificationdr1.Type = Convert.ToInt16(EnNotificationType.Info);

        //        Task.Run(() => HelperForLog.WriteLogIntoFile("CreditNotificationSend Activity:Without Token", "WalletService", "msg=" + ActivityNotificationdr.MsgCode.ToString() + ",User=" + firstCurrObjCrWM.UserID.ToString() + "WalletID" + firstCurrObjCrWM.AccWalletID + ",Balance" + firstCurrObjCrWM.Balance.ToString()));

        //        var firstCurrObjCrType = firstCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
        //        var firstCurrObjDrType = firstCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");
        //        var secCurrObjCrType = secondCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
        //        var secCurrObjDrType = secondCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");

        //        Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotificationCr, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.OnWalletBalChange(walletMasterObjCr, firstCurrObj.Coin, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.SendActivityNotificationV2(ActivityNotificationCr1, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.OnWalletBalChange(walletMasterObjCr1, secondCurrObj.Coin, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.SendActivityNotificationV2(ActivityNotificationdr, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.OnWalletBalChange(walletMasterObjDr, firstCurrObj.Coin, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.SendActivityNotificationV2(ActivityNotificationdr1, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => _signalRService.OnWalletBalChange(walletMasterObjDr1, secondCurrObj.Coin, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
        //                                   () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, firstCurrObjCrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjCrType, firstCurrObj.creditObject.TrnRefNo.ToString()),
        //                                   () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, secondCurrObjCrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjCrType, secondCurrObj.creditObject.TrnRefNo.ToString()),
        //                                    () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, firstCurrObjDrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjDrType, firstCurrObj.debitObject.TrnRefNo.ToString()),
        //                                    () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, secondCurrObjDrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjDrType, secondCurrObj.debitObject.TrnRefNo.ToString()),
        //                                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, secondCurrObjCrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin,Helpers.UTC_To_IST().ToString(), secondCurrObj.creditObject.TrnRefNo.ToString(), secCurrObjCrType),
        //                                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, firstCurrObjCrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.creditObject.TrnRefNo.ToString(), firstCurrObjCrType),
        //                                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, secondCurrObjDrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), secCurrObjDrType),
        //                                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, firstCurrObjDrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), firstCurrObjDrType)
        //                                   );
        //        #endregion

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("CreditNotificationSend" + "TimeStamp:" + timestamp, this.GetType().Name, ex);

        //        //throw ex;
        //    }
        //}

        //public async Task<WalletDrCrResponse> GetWalletCreditNewAsync(string coinName, string timestamp, enWalletTrnType trnType, decimal TotalAmount, long userID, string crAccWalletID, CreditWalletDrArryTrnID[] arryTrnID, long TrnRefNo, short isFullSettled, enWalletTranxOrderType orderType, enServiceType serviceType, enTrnType routeTrnType, string Token = "")
        //{
        //    WalletTransactionQueue tqObj = new WalletTransactionQueue();
        //    WalletTransactionOrder woObj = new WalletTransactionOrder();
        //    try
        //    {
        //        WalletMaster cWalletobj;
        //        string remarks = "";
        //        WalletTypeMaster walletTypeMaster;
        //        //long walletTypeID;
        //        WalletDrCrResponse resp = new WalletDrCrResponse();
        //        HelperForLog.WriteLogIntoFile("GetWalletCreditNew", "WalletTransactionService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + TotalAmount.ToString());

        //        if (string.IsNullOrEmpty(crAccWalletID) || coinName == string.Empty || userID == 0)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
        //        }
        //        walletTypeMaster = await _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == coinName);
        //        if (walletTypeMaster == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
        //        }

        //        cWalletobj = await _commonRepository.GetSingleAsync(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == crAccWalletID);

        //        if (cWalletobj == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.UserIDWalletIDDidNotMatch }, "Credit");
        //        }
        //        if (cWalletobj.Status != 1 || cWalletobj.IsValid == false)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet }, "Credit");
        //        }
        //        if (orderType != enWalletTranxOrderType.Credit) // buy 
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType }, "Credit");
        //        }

        //        //WalletTransactionQueue
        //        if (TrnRefNo == 0) // buy
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo }, "Credit");
        //        }
        //        var bal1 = CheckUserBalanceAsync(TotalAmount, cWalletobj.Id);
        //        var bal = await bal1;
        //        if (!bal)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        if (TotalAmount <= 0)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        int count = CheckTrnRefNoForCredit(TrnRefNo, enWalletTranxOrderType.Debit); // check whether for this refno wallet is pre decuted or not
        //        if (count == 0)
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist }, "Credit");
        //        }
        //        bool checkArray = CheckarryTrnID(arryTrnID, coinName);
        //        if (checkArray == false)//fail
        //        {
        //            tqObj = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", trnType);
        //            tqObj = _WalletTQInsert.AddIntoWalletTransactionQueue(tqObj, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
        //        }
        //        //TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch());
        //        //remarks = "Credit for TrnNo:" + tqObj.TrnNo;

        //        //WalletLedger walletLedger = GetWalletLedger(cWalletobj.Id, 0, 0, TotalAmount, trnType, serviceType, tqObj.TrnNo, remarks, cWalletobj.Balance, 1);
        //        //TransactionAccount tranxAccount = GetTransactionAccount(cWalletobj.Id, 1, batchObj.Id, 0, TotalAmount, tqObj.TrnNo, remarks, 1);
        //        ////cWalletobj.CreditBalance(TotalAmount);
        //        ////var objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, 1, "Updated");
        //        //tqObj.Status = enTransactionStatus.Success;
        //        //tqObj.StatusMsg = "Success.";
        //        //tqObj.UpdatedDate = Helpers.UTC_To_IST();
        //        //_walletRepository1.WalletCreditwithTQ(walletLedger, tranxAccount, cWalletobj, tqObj, arryTrnID, TotalAmount);

        //        BizResponseClass bizResponse = _walletSPRepositories.Callsp_CreditWallet(cWalletobj, timestamp, serviceType, TotalAmount, coinName, EnAllowedChannels.Web, walletTypeMaster.Id, TrnRefNo, cWalletobj.Id, cWalletobj.UserID, routeTrnType, trnType, ref TrnRefNo, enWalletDeductionType.Normal);
        //        if (bizResponse.ReturnCode != enResponseCode.Success)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "GetWalletCreditNewAsync");
        //        }
        //        // 2018-11-1---------------socket method   --------------------------
        //        WalletMasterResponse walletMasterObj = new WalletMasterResponse();
        //        walletMasterObj.AccWalletID = cWalletobj.AccWalletID;
        //        walletMasterObj.Balance = cWalletobj.Balance;
        //        walletMasterObj.WalletName = cWalletobj.Walletname;
        //        walletMasterObj.PublicAddress = cWalletobj.PublicAddress;
        //        walletMasterObj.IsDefaultWallet = cWalletobj.IsDefaultWallet;
        //        walletMasterObj.CoinName = coinName;
        //        walletMasterObj.OutBoundBalance = cWalletobj.OutBoundBalance;

        //        //ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
        //        //ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
        //        //ActivityNotification.Param1 = coinName;
        //        //ActivityNotification.Param2 = routeTrnType.ToString();
        //        //ActivityNotification.Param3 = TrnRefNo.ToString();
        //        //ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

        //        //var trn = trnType.ToString().Contains("Cr_") ? trnType.ToString().Replace("Cr_", "") : trnType.ToString().Replace("Dr_", "");

        //        //Task.Run(() => Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, userID.ToString(), 2),
        //        //      () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, Token),
        //        //      () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, userID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString()),
        //        //      () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, userID.ToString(), TotalAmount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), trn)));
        //        Task.Run(() => CreditWalletNotificationSend(timestamp, walletMasterObj, coinName, TotalAmount, TrnRefNo, (byte)routeTrnType, userID, Token, trnType.ToString()));


        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg,TimeStamp = timestamp }, "GetWalletCreditNew");

        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetWalletCreditNewAsync TimeStamp:" + timestamp, this.GetType().Name, ex);
        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "",TimeStamp = timestamp }, "Credit");

        //        //throw ex;
        //    }
        //}
        //public bool CheckarryTrnID(CreditWalletDrArryTrnID[] arryTrnID, string coinName)
        //{
        //    bool obj = _walletRepository1.CheckarryTrnID(arryTrnID, coinName);
        //    return obj;
        //}
        //public int CheckTrnRefNoForCredit(long TrnRefNo, enWalletTranxOrderType TrnType)
        //{
        //    var count = _walletRepository1.CheckTrnRefNoForCredit(TrnRefNo, TrnType);
        //    return count;
        //}

        //public async Task<WalletDrCrResponse> GetWalletDeductionNew(string coinName, string timestamp, enWalletTranxOrderType orderType, decimal amount, long userID, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, string Token = "" ,EnAllowedChannels allowedChannels = EnAllowedChannels.Web)
        //{
        //    try
        //    {
        //        WalletMaster dWalletobj;
        //        string remarks = "";
        //        WalletTypeMaster walletTypeMaster;
        //        WalletTransactionQueue objTQ;
        //        //long walletTypeID;
        //        WalletDrCrResponse resp = new WalletDrCrResponse();
        //        bool CheckUserBalanceFlag = false;
        //        long trnno = 0;
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

        //        //Task<int> countTask = _walletRepository1.CheckTrnRefNoAsync(TrnRefNo, orderType, trnType); //CheckTrnRefNo(TrnRefNo, orderType, trnType);
        //        Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
        //        if (string.IsNullOrEmpty(accWalletID) || coinName == string.Empty || userID == 0)
        //        {
        //            return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName };
        //        }
        //        walletTypeMaster = _WalletTypeMasterRepository.GetSingle(e => e.WalletTypeName == coinName);
        //        if (walletTypeMaster == null)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Debit");
        //        }

        //        Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID);
        //        if (orderType != enWalletTranxOrderType.Debit) // sell 13-10-2018
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTrnType, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        if (TrnRefNo == 0) // sell 13-10-2018
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        if (amount <= 0)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        dWalletobj = await dWalletobjTask;
        //        //Task<bool> flagTask = CheckUserBalanceAsync(dWalletobj.Id);
        //        bool flagTask = _walletRepository1.CheckUserBalanceV1(dWalletobj.Id);
        //        if (dWalletobj == null)
        //        {
        //            //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet }, "Debit");
        //        }
        //        if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString());
        //        //CheckUserBalanceFlag = await flagTask;
        //        CheckUserBalanceFlag = flagTask;
        //        //ntrivedi 18-12-2018  IsValidChannel and  IsValidWallet is added
        //        bool channelFlag = _walletConfiguration.IsValidChannel((long)allowedChannels, (long)trnType);
        //        if(channelFlag == false)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidChannel, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidChannelWalletDeduction, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }

        //        bool walletFlag = _walletConfiguration.IsValidWallet(dWalletobj.Id, (long)trnType, walletTypeMaster.Id);
        //        if (walletFlag == false)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWalletTransaction, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidChannel, ErrorCode = enErrorCode.InvalidWalletTransactionWalletDeduction, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString());

        //        dWalletobj = _commonRepository.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
        //        // Wallet Limit Check
        //        //var msg = _commonWalletFunction.CheckWalletLimitAsync(enWalletLimitType.WithdrawLimit, dWalletobj.Id, amount); //CheckWalletLimitAsync
        //        var msg = _commonWalletFunction.CheckWalletLimitAsyncV1(enWalletLimitType.WithdrawLimit, dWalletobj.Id, amount);
        //        if (dWalletobj.Balance < amount)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        if (!CheckUserBalanceFlag)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString());
        //        var bal = await _commonWalletFunction.CheckShadowLimitAsync(dWalletobj.Id, amount);

        //        //Wallet Limit Validation
        //        var limitres = await msg;
        //        //if (limitres != enErrorCode.Success)
        //        if (limitres.ErrorCode != enErrorCode.Success)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletLimitExceed, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse
        //            {
        //                ReturnCode = enResponseCode.Fail,
        //                ReturnMsg = EnResponseMessage.WalletLimitExceed,
        //                //ErrorCode = limitres,
        //                ErrorCode = limitres.ErrorCode,
        //                TrnNo = objTQ.TrnNo,
        //                Status = objTQ.Status,
        //                StatusMsg = objTQ.StatusMsg
        //            }, "Debit");
        //        }


        //        if (bal != enErrorCode.Success)
        //        {
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString());

        //        //int count = await countTask;
        //        CheckTrnRefNoRes count1 = await countTask1;
        //        if (count1.TotalCount != 0)
        //        {
        //            // insert with status=2 system failed
        //            objTQ = _commonWalletFunction.InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
        //            objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
        //        }
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString());

        //        #region Comments
        //        //objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 0, "Inserted", trnType);
        //        //objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
        //        //TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch(UTC_To_IST()));
        //        //remarks = "Debit for TrnNo:" + objTQ.TrnNo;
        //        ////dWalletobj = _commonRepository.GetById(dWalletobj.Id);
        //        //WalletLedger walletLedger = GetWalletLedger(dWalletobj.Id, 0, amount, 0, trnType, serviceType, objTQ.TrnNo, remarks, dWalletobj.Balance, 1);
        //        //TransactionAccount tranxAccount = GetTransactionAccount(dWalletobj.Id, 1, batchObj.Id, amount, 0, objTQ.TrnNo, remarks, 1);
        //        ////dWalletobj.DebitBalance(amount); moved this inside function so do not overlap the object while parallet object
        //        //objTQ.Status = enTransactionStatus.Hold;
        //        //objTQ.StatusMsg = "Hold";
        //        //_walletRepository1.WalletDeductionwithTQ(walletLedger, tranxAccount, dWalletobj.Id, objTQ, amount);
        //        //HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletDeductionwithTQ done TrnNo=" + TrnRefNo.ToString());

        //        #endregion

        //        BizResponseClass bizResponse = _walletSPRepositories.Callsp_DebitWallet(dWalletobj, timestamp, serviceType, amount, coinName, EnAllowedChannels.Web, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref trnno, enWalletDeductionType.Normal);
        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletDeductionwithTQ sp call done TrnNo=" + TrnRefNo.ToString());

        //        if (bizResponse.ReturnCode != enResponseCode.Success)
        //        {
        //            return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = trnno, Status = 0, StatusMsg = "" }, "Debit");
        //        }

        //        //vsolanki 2018-11-1---------------socket method   --------------------------
        //        WalletMasterResponse walletMasterObj = new WalletMasterResponse();
        //        walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
        //        walletMasterObj.Balance = dWalletobj.Balance;
        //        walletMasterObj.WalletName = dWalletobj.Walletname;
        //        walletMasterObj.PublicAddress = dWalletobj.PublicAddress;
        //        walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
        //        walletMasterObj.CoinName = coinName;
        //        walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

        //        Task.Run(() => WalletDeductionNewNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, userID, Token, trnType.ToString(), walletMasterObj));

        //        HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "OnWalletBalChange + SendActivityNotificationV2 Done TrnNo=" + TrnRefNo.ToString());

        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = trnno, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg }, "Debit");
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("GetWalletDeductionNew TimeStamp:" + timestamp, this.GetType().Name, ex);
        //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "" , TimeStamp = timestamp }, "Debit");
        //    }
        //}
    }
}
