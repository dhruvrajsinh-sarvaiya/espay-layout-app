using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services
{
    public class WalletDeposition : IWalletDeposition
    {

        //private readonly ISignalRServiceV2 _signalRService;
        private readonly ICommonRepository<WalletMaster> _commonRepository;
        private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        private readonly ICommonRepository<TransactionQueue> _transactionQueueRepository;
        private readonly ICommonRepository<WalletTrnLimitConfiguration> _walletTrnLimitConfiguration;
        //private readonly ICommonRepository<WalletLimitConfiguration> _LimitcommonRepository;
        // private readonly ICommonRepository<ThirdPartyAPIConfiguration> _thirdPartyCommonRepository;
        //private readonly ICommonRepository<WalletOrder> _walletOrderRepository;
        private readonly ICommonRepository<AddressMaster> _addressMstRepository;
        //private readonly ICommonRepository<TrnAcBatch> _trnBatch;
        //private readonly ICommonRepository<TradeBitGoDelayAddresses> _bitgoDelayRepository;
        //private readonly ICommonRepository<WalletAllowTrn> _WalletAllowTrnRepo;
        //private readonly ICommonRepository<BeneficiaryMaster> _BeneficiarycommonRepository;
        //private readonly ICommonRepository<UserPreferencesMaster> _UserPreferencescommonRepository;

        //readonly ICommonRepository<WalletLedger> _walletLedgerRepository;
        private readonly IWalletRepository _walletRepository1;
        private readonly IMessageService _messageService;
        //  private readonly IWalletService _walletRepository1;
        //private readonly ICommonRepository<WalletTypeMaster> _WalletTypeMasterRepository;
        //private readonly ICommonRepository<TransactionAccount> _TransactionAccountsRepository;
        //  private readonly IWalletService _walletService;
        //private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        private readonly ICommonWalletFunction _commonWalletFunction;
        //private readonly ICommonRepository<ChargeRuleMaster> _chargeRuleMaster;
        //private readonly ICommonRepository<LimitRuleMaster> _limitRuleMaster;
        //private readonly IWebApiRepository _webApiRepository;
        //private readonly IWebApiSendRequest _webApiSendRequest;
        //private readonly IGetWebRequest _getWebRequest;
        //private readonly WebApiParseResponse _WebApiParseResponse;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly IWalletSPRepositories _walletSPRepositories;
        private readonly ICommonRepository<ServiceMaster> _serviceMasterRepository;
      //  private readonly IWalletTransactionCrDr _WalletService;
        private readonly IBackOfficeTrnRepository _backOfficeTrnRepository;
        TransactionRecon tradeReconObj;
        private readonly ICommonRepository<TransactionAccount> _TransactionAccountsRepository;
        private readonly IWalletTQInsert _WalletTQInsert;



        public WalletDeposition(ICommonRepository<WalletMaster> commonRepository, ICommonRepository<WalletTrnLimitConfiguration> walletTrnLimitConfiguration,
           IWalletRepository walletRepository, ICommonRepository<AddressMaster> addressMaster, IWalletSPRepositories walletSPRepositories, ICommonRepository<TransactionQueue> transactionQueueRepository,
          ICommonWalletFunction commonWalletFunction, IMessageService messageService, IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, ICommonRepository<WalletTypeMaster> WalletTypeMasterRepository,
          ICommonRepository<TransactionAccount> TransactionAccountsRepository,
          ICommonRepository<ServiceMaster> serviceMasterRepository, IBackOfficeTrnRepository backOfficeTrnRepository, IWalletTQInsert WalletTQInsert) 
        {
            _walletSPRepositories = walletSPRepositories;
            _walletTrnLimitConfiguration = walletTrnLimitConfiguration;
            _transactionQueueRepository = transactionQueueRepository;
            _commonRepository = commonRepository;
            _walletRepository1 = walletRepository;
            _addressMstRepository = addressMaster;
            _commonWalletFunction = commonWalletFunction;
            _messageService = messageService;
            _pushNotificationsQueue = pushNotificationsQueue;
            _serviceMasterRepository = serviceMasterRepository;
           // _WalletService = WalletService;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            _backOfficeTrnRepository = backOfficeTrnRepository;
            _TransactionAccountsRepository = TransactionAccountsRepository;
            _WalletTQInsert = WalletTQInsert;
        }

        public WalletDrCrResponse DepositionWalletOperation(string timestamp, string address, string coinName, decimal amount, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enWalletTranxOrderType enWalletTranx, enWalletLimitType enWalletLimit, enTrnType routeTrnType, string Token = "")
        {
            try
            {
                WalletMaster dWalletobj, cWalletObj;
                //string DrRemarks = "", CrRemarks = "";
               // WalletTypeMaster walletTypeMaster;
                WalletTransactionQueue objTQDr, objTQCr;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                long owalletID, orgID;
                //WalletTransactionOrder woObj;
                HelperForLog.WriteLogIntoFile("DepositionWalletOperation", "WalletTransactionCrDr", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",TrnRefNo=" + TrnRefNo.ToString() + ",address=" + address + ",amount=" + amount.ToString() + ",Token=" + Token);

                owalletID = GetWalletByAddress(address);
                //--call new SP 2019-1-22
                long Trnno = 0;

                /// ====
                //if (owalletID == 0)
                //{
                //    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAddress, ErrorCode = enErrorCode.InvalidAddress };
                //}
                cWalletObj = _commonRepository.GetById(owalletID);
                orgID = _walletRepository1.getOrgID();
                //if (orgID == 0)
                //{
                //    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.OrgIDNotFound, ErrorCode = enErrorCode.OrgIDNotFound };
                //}
                dWalletobj = _commonRepository.FindBy(e => e.WalletTypeID == cWalletObj.WalletTypeID && e.UserID == orgID && e.IsDefaultWallet == 1 && e.Status == 1 && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet)).FirstOrDefault();
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet };
                }
                //ntrivedi 15-02-2019 for margin wallet not use other wallet
                if (cWalletObj.WalletUsageType != Convert.ToInt16(EnWalletUsageType.Trading_Wallet))
                {
                    if (cWalletObj.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Commission_Org_Wallet) && cWalletObj.UserID == orgID) //ntrivedi 13-05-2019 for organization refer wallet deposition 
                    {

                    }
                    else
                    {
                        objTQCr = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, amount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletObj.Id, coinName, cWalletObj.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.MarginWalletCanNotBeUsedForThis, trnType);
                        objTQCr = _walletRepository1.AddIntoWalletTransactionQueue(objTQCr, 1);
                        return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.MarginWalletCanNotBeUsedForThis, ErrorCode = enErrorCode.MarginWalletCanNotBeUsedForThis };
                    }
                }
                //ntrivedi 03-11-2018
                var charge = _commonWalletFunction.GetServiceLimitChargeValue(enWalletTrnType.Deposit, coinName);
                if (charge.MaxAmount < amount && charge.MinAmount > amount)
                {
                    objTQCr = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, dWalletobj.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg, trnType);
                    objTQCr = _walletRepository1.AddIntoWalletTransactionQueue(objTQCr, 1);
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg, ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax };
                }
                //resp = InsertWalletTQDebit(timestamp, dWalletobj.Id, coinName, amount, TrnRefNo, serviceType, enWalletTrnType.Deposit, enWalletTranx, enWalletLimit);
                //if (resp.ReturnCode != 0 || resp.Status != enTransactionStatus.Initialize)
                //{
                //    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = resp.StatusMsg, ErrorCode = resp.ErrorCode };
                //}
                if (cWalletObj.Status != 1 || cWalletObj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQCr = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, dWalletobj.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                    objTQCr = _walletRepository1.AddIntoWalletTransactionQueue(objTQCr, 1);
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQCr.TrnNo, Status = objTQCr.Status, StatusMsg = objTQCr.StatusMsg };
                }
                var response = _walletSPRepositories.Callsp_DepositionProcess(ref Trnno, EnAllowedChannels.Web, timestamp, coinName, trnType, amount, TrnRefNo);
                if (response.ReturnCode != enResponseCode.Success)
                {
                    return new WalletDrCrResponse { ReturnCode = response.ReturnCode, ReturnMsg = response.ReturnMsg, ErrorCode = response.ErrorCode };
                }
                //objTQDr = _walletRepository1.GetTransactionQueue(resp.TrnNo);
                //TrnAcBatch batchObj = _trnBatch.Add(new TrnAcBatch());
                //DrRemarks = "Debit for Deposition TrnNo:" + TrnRefNo;
                //WalletLedger walletLedgerDr = GetWalletLedgerObj(dWalletobj.Id, cWalletObj.Id, amount, 0, enWalletTrnType.Deposit, serviceType, objTQDr.TrnNo, DrRemarks, dWalletobj.Balance, 1);
                //TransactionAccount tranxAccounDrt = GetTransactionAccount(dWalletobj.Id, 1, batchObj.Id, amount, 0, objTQDr.TrnNo, DrRemarks, 1);
                //dWalletobj.DebitBalance(amount);
                //objTQDr.Status = enTransactionStatus.Success;
                //objTQDr.StatusMsg = "Success";
                //DrRemarks = "Credit for Deposition TrnNo:" + TrnRefNo;
                //objTQCr = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, amount, TrnRefNo, UTC_To_IST(), null, cWalletObj.Id, coinName, cWalletObj.UserID, timestamp, 0, "Inserted", trnType);
                //objTQCr = _walletRepository1.AddIntoWalletTransactionQueue(objTQCr, 1);
                //woObj = InsertIntoWalletTransactionOrder(null, UTC_To_IST(), cWalletObj.Id, dWalletobj.Id, amount, coinName, objTQCr.TrnNo, objTQDr.TrnNo, 0, "Inserted");
                //woObj = _walletRepository1.AddIntoWalletTransactionOrder(woObj, 1);
                //WalletLedger walletLedgerCr = GetWalletLedgerObj(cWalletObj.Id, dWalletobj.Id, 0, amount, trnType, serviceType, objTQCr.TrnNo, DrRemarks, cWalletObj.Balance, 1);
                //TransactionAccount tranxAccountCr = GetTransactionAccount(cWalletObj.Id, 1, batchObj.Id, 0, amount, objTQCr.TrnNo, DrRemarks, 1);
                //cWalletObj.CreditBalance(amount);
                ////var objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, 1, "Updated");
                //objTQCr.Status = enTransactionStatus.Success;
                //objTQCr.StatusMsg = "Success";
                //objTQCr.UpdatedDate = UTC_To_IST();
                //woObj.Status = enTransactionStatus.Success;
                //woObj.StatusMsg = "Deposition success for RefNo :" + TrnRefNo;
                //woObj.UpdatedDate = UTC_To_IST();
                //objTQDr.SettedAmt = amount;
                //_walletRepository1.WalletCreditDebitwithTQ(walletLedgerDr, walletLedgerCr, tranxAccountCr, tranxAccounDrt, dWalletobj, cWalletObj, objTQCr, objTQDr, woObj);
                //ntrivedi temperory
                // 2018-11-1---------------socket method   --------------------------
                WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                walletMasterObj.AccWalletID = cWalletObj.AccWalletID;
                walletMasterObj.Balance = cWalletObj.Balance;
                walletMasterObj.WalletName = cWalletObj.Walletname;
                walletMasterObj.PublicAddress = cWalletObj.PublicAddress;
                walletMasterObj.AccWalletID = cWalletObj.AccWalletID;
                walletMasterObj.CoinName = coinName;
                walletMasterObj.OutBoundBalance = cWalletObj.OutBoundBalance;

                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
                ActivityNotification.Param1 = coinName;
                ActivityNotification.Param2 = routeTrnType.ToString();
                ActivityNotification.Param3 = TrnRefNo.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);
                try
                {
                    //_signalRService.OnWalletBalChange(walletMasterObj, coinName, cWalletObj.UserID.ToString(), 2);
                    ////_signalRService.SendActivityNotification(msg, cWalletObj.UserID.ToString(), 2);
                    //_signalRService.SendActivityNotificationV2(ActivityNotification, cWalletObj.UserID.ToString(), 2);

                    var trn = trnType.ToString().Contains("Cr_") ? trnType.ToString().Replace("Cr_", "") : trnType.ToString().Replace("Dr_", "");
                    ApplicationUser User = new ApplicationUser();
                    try
                    {
                        User = _walletRepository1.GetUserById(Convert.ToInt64(cWalletObj.UserID.ToString())).GetAwaiter().GetResult();
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog("User ex" + System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                    }
                    //2018-12-7 for EMAIL //amount,coin,date,refno
                    EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, cWalletObj.UserID.ToString(), amount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), trn, "", "", "", "", User);


                    //Task.Run(() => Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, cWalletObj.UserID.ToString(), 2),
                    //    () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, cWalletObj.UserID.ToString(), 2),
                    //    () => _walletService.SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, cWalletObj.UserID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString())));


                    //Parallel.Invoke(() => _signalRService.SendActivityNotificationV2(ActivityNotification, cWalletObj.UserID.ToString(), 2),
                    //   () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, cWalletObj.UserID.ToString(), 2),
                    //   () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, cWalletObj.UserID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString()));

                }
                catch (Exception ex2)
                {
                    HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex2);

                }
                return new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = resp.TrnNo, Status = resp.Status, StatusMsg = resp.StatusMsg };

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
                //_log.LogError(ex, "Date: " + UTC_To_IST() + ",\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task EmailSendAsyncV1(EnTemplateType templateType, string UserID, string Param1 = "", string Param2 = "", string Param3 = "", string Param4 = "", string Param5 = "", string Param6 = "", string Param7 = "", string Param8 = "", string Param9 = "", ApplicationUser User = null)
        {
            try
            {
                HelperForLog.WriteLogIntoFile("WalletTransactionCrDr", "0 EmailSendAsyncV1", " -Data- " + templateType.ToString());
                CommunicationParamater communicationParamater = new CommunicationParamater();
                SendEmailRequest Request = new SendEmailRequest();
                // ApplicationUser User = new ApplicationUser();
                // User =await _walletRepository1.GetUserById(Convert.ToInt64(UserID));
                HelperForLog.WriteLogIntoFile("WalletTransactionCrDr", "0 EmailSendAsyncV1", " -Data- " + UserID.ToString() + "UserName : " + User.UserName);
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
                        var EmailData = _messageService.ReplaceTemplateMasterData(templateType, communicationParamater, enCommunicationServiceType.Email).Result;
                        if (EmailData != null)
                        {
                            Request.Body = EmailData.Content;
                            Request.Subject = EmailData.AdditionalInfo;
                            Request.EmailType = Convert.ToInt16(EnEmailType.Template);
                            HelperForLog.WriteLogIntoFile("WalletTransactionCrDr", "0 EmailSendAsyncV1", " -Data- " + EmailData.Content.ToString());
                            Request.Recepient = User.Email;
                            HelperForLog.WriteLogForSocket("WalletTransactionCrDr", "0 EmailSendAsyncV1", " -Data- " + EmailData);
                            _pushNotificationsQueue.Enqueue(Request);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " -Data- " + templateType.ToString(), this.GetType().Name, ex);
            }
        }

        protected WalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
        long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType)
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



        #region Withdraw Code

        public async Task<BizResponseClass> WithdrawalReconV1(WithdrawalReconRequest request, long UserId, string accessToken)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var TransactionQueueObj = _transactionQueueRepository.GetById(request.TrnNo);
                if (TransactionQueueObj == null)
                {
                    Response.ErrorCode = enErrorCode.WithdrawalRecon_NoRecordFound;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_NoRecordFound;
                    return Response;
                }
                if (TransactionQueueObj.TrnType != Convert.ToInt16(enTrnType.Withdraw))
                {
                    Response.ErrorCode = enErrorCode.WithdrawalRecon_InvalidTrnType;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_InvalidTrnType;
                    return Response;
                }

                if (request.ActionType == enWithdrawalReconActionType.Refund) //Only For Success And Hold transaction are allowed
                {
                    if (!(TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.Success) || TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.Hold)))
                    {
                        Response.ErrorCode = enErrorCode.WithdrawalRecon_InvalidActionType;
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_InvalidActionType;
                        return Response;
                    }
                    else
                    {
                        TransactionReconEntry(request.TrnNo, enTransactionStatus.Refunded, TransactionQueueObj.Status, TransactionQueueObj.SerProID, TransactionQueueObj.SerProID, request.ActionMessage, UserId);

                        TransactionQueueObj.Status = Convert.ToInt16(enTransactionStatus.Refunded);
                        TransactionQueueObj.StatusMsg = "Refunded";

                        //Refund Process(Credit To User Wallet)
                        List<CreditWalletDrArryTrnID> CreditWalletDrArryTrnIDList = new List<CreditWalletDrArryTrnID>();
                        CreditWalletDrArryTrnIDList.Add(new CreditWalletDrArryTrnID { DrTrnRefNo = request.TrnNo, Amount = TransactionQueueObj.Amount });

                        var _TrnService = _serviceMasterRepository.GetSingle(item => item.SMSCode == TransactionQueueObj.SMSCode && item.Status == Convert.ToInt16(ServiceStatus.Active));
                        var ServiceType = (enServiceType)_TrnService.ServiceType;
                        //enWalletTrnType.Cr_Refund
                        var CreditResult1 = GetWalletCreditNewAsync(TransactionQueueObj.SMSCode, Helpers.GetTimeStamp(), enWalletTrnType.Refund, TransactionQueueObj.Amount, TransactionQueueObj.MemberID,
                            TransactionQueueObj.DebitAccountID, CreditWalletDrArryTrnIDList.ToArray(), request.TrnNo, 1, enWalletTranxOrderType.Credit, ServiceType, (enTrnType)TransactionQueueObj.TrnType);

                        var CreditResult = await CreditResult1;

                        if (CreditResult.ReturnCode != enResponseCode.Success)
                        {
                            Response.ErrorCode = enErrorCode.WithdrawalRecon_ProcessFail;
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_ProcessFail;
                            return Response;
                        }
                    }
                }
                else if (request.ActionType == enWithdrawalReconActionType.SuccessAndDebit) //Only For OperatorFail,SystemFail,Refund transaction are allowed
                {
                    if (!(TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.OperatorFail) || TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.SystemFail) || TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.Refunded)))
                    {
                        Response.ErrorCode = enErrorCode.WithdrawalRecon_InvalidActionType;
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_InvalidActionType;
                        return Response;
                    }
                    else
                    {
                        TransactionReconEntry(request.TrnNo, enTransactionStatus.Success, TransactionQueueObj.Status, TransactionQueueObj.SerProID, TransactionQueueObj.SerProID, request.ActionMessage, UserId);

                        TransactionQueueObj.Status = Convert.ToInt16(enTransactionStatus.Success);
                        TransactionQueueObj.StatusMsg = "Success";

                        var _TrnService = _serviceMasterRepository.GetSingle(item => item.SMSCode == TransactionQueueObj.SMSCode && item.Status == Convert.ToInt16(ServiceStatus.Active));
                        var ServiceType = (enServiceType)_TrnService.ServiceType;

                        //Debit From User Wallet
                        //enWalletTrnType.Dr_Withdrawal
                        var DebitResult = GetWalletDeductionNew(TransactionQueueObj.SMSCode, Helpers.GetTimeStamp(), enWalletTranxOrderType.Debit, TransactionQueueObj.Amount, TransactionQueueObj.MemberID,
                            TransactionQueueObj.DebitAccountID, request.TrnNo, ServiceType, enWalletTrnType.Withdrawal, (enTrnType)TransactionQueueObj.TrnType, accessToken);

                        if (DebitResult.Result.ReturnCode != enResponseCode.Success)
                        {
                            Response.ErrorCode = enErrorCode.WithdrawalRecon_ProcessFail;
                            Response.ReturnCode = enResponseCode.Fail;
                            Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_ProcessFail;
                            return Response;
                        }
                    }
                }
                else if (request.ActionType == enWithdrawalReconActionType.Success) //Only For Hold transaction are allowed
                {
                    if (!(TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.Hold)))
                    {
                        Response.ErrorCode = enErrorCode.WithdrawalRecon_InvalidActionType;
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_InvalidActionType;
                        return Response;
                    }
                    else
                    {
                        TransactionReconEntry(request.TrnNo, enTransactionStatus.Success, TransactionQueueObj.Status, TransactionQueueObj.SerProID, TransactionQueueObj.SerProID, request.ActionMessage, UserId);

                        TransactionQueueObj.Status = Convert.ToInt16(enTransactionStatus.Success);
                        TransactionQueueObj.StatusMsg = "Success";
                    }
                }
                else if (request.ActionType == enWithdrawalReconActionType.FailedMark) //Only For Hold,Success transaction are allowed
                {
                    if (!(TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.Hold) || TransactionQueueObj.Status == Convert.ToInt16(enTransactionStatus.Success)))
                    {
                        Response.ErrorCode = enErrorCode.WithdrawalRecon_InvalidActionType;
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_InvalidActionType;
                        return Response;
                    }
                    else
                    {
                        TransactionReconEntry(request.TrnNo, enTransactionStatus.Success, TransactionQueueObj.Status, TransactionQueueObj.SerProID, TransactionQueueObj.SerProID, request.ActionMessage, UserId);

                        TransactionQueueObj.Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
                        TransactionQueueObj.StatusMsg = "OperatorFail";
                    }
                }

                var ResultBool = _backOfficeTrnRepository.WithdrawalRecon(tradeReconObj, TransactionQueueObj);
                if (!ResultBool)
                {
                    Response.ErrorCode = enErrorCode.WithdrawalRecon_ProcessFail;
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_ProcessFail;
                    return Response;
                }
                else
                {
                    Response.ErrorCode = enErrorCode.WithdrawalRecon_Success;
                    Response.ReturnCode = enResponseCode.Success;
                    Response.ReturnMsg = EnResponseMessage.WithdrawalRecon_Success;
                    return Response;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public void TransactionReconEntry(long TrnNo, enTransactionStatus NewStatus, short OldStatus, long SerProID, long ServiceID, string Remarks, long UserID)
        {
            try
            {
                tradeReconObj = new TransactionRecon()
                {
                    TrnNo = TrnNo,
                    NewStatus = Convert.ToInt16(NewStatus),
                    OldStatus = OldStatus,
                    SerProID = SerProID,
                    ServiceID = ServiceID,
                    Remarks = Remarks,
                    CreatedBy = UserID,
                    CreatedDate = Helpers.UTC_To_IST(),
                    Status = 1,
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WithdrwalreconEntry:##TrnNo " + TrnNo, "BackOfficeTrnService", ex);
            }
        }

        public async Task<WalletDrCrResponse> GetWalletCreditNewAsync(string coinName, string timestamp, enWalletTrnType trnType, decimal TotalAmount, long userID, string crAccWalletID, CreditWalletDrArryTrnID[] arryTrnID, long TrnRefNo, short isFullSettled, enWalletTranxOrderType orderType, enServiceType serviceType, enTrnType routeTrnType, string Token = "")
        {
            WalletTransactionQueue tqObj = new WalletTransactionQueue();
            WalletTransactionOrder woObj = new WalletTransactionOrder();
            try
            {
                WalletMaster cWalletobj;
                string remarks = "";
                WalletTypeMaster walletTypeMaster;
                //long walletTypeID;
                long TrnNo = 0;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                HelperForLog.WriteLogIntoFile("GetWalletCreditNew", "WalletTransactionCrDr", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + TotalAmount.ToString());

                if (string.IsNullOrEmpty(crAccWalletID) || coinName == string.Empty || userID == 0)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
                }
                walletTypeMaster = await _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == coinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
                }

                //ntrivedi 15-02-2019 for margin wallet not use other wallet
                cWalletobj = await _commonRepository.GetSingleAsync(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == crAccWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

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
                var bal1 = CheckUserBalanceAsync(cWalletobj.Id);
                var bal = await bal1;
                if (!bal)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
                    tqObj = _walletRepository1.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                if (TotalAmount <= 0)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
                    tqObj = _walletRepository1.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                int count = CheckTrnRefNoForCredit(TrnRefNo, enWalletTranxOrderType.Debit); // check whether for this refno wallet is pre decuted or not
                if (count == 0)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    tqObj = _walletRepository1.AddIntoWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist }, "Credit");
                }
                bool checkArray = CheckarryTrnID(arryTrnID, coinName);
                if (checkArray == false)//fail
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, TotalAmount, TrnRefNo, Helpers.UTC_To_IST(), null, cWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", trnType);
                    tqObj = _walletRepository1.AddIntoWalletTransactionQueue(tqObj, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }               

                BizResponseClass bizResponse = _walletSPRepositories.Callsp_CreditWallet(cWalletobj, timestamp, serviceType, TotalAmount, coinName, EnAllowedChannels.Web, walletTypeMaster.Id, TrnRefNo, cWalletobj.Id, cWalletobj.UserID, routeTrnType, trnType, ref TrnNo, enWalletDeductionType.Normal);
                if (bizResponse.ReturnCode != enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "GetWalletCreditNewAsync");
                }

                // 2018-11-1---------------socket method   --------------------------
                WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                walletMasterObj.AccWalletID = cWalletobj.AccWalletID;
                walletMasterObj.Balance = cWalletobj.Balance;
                walletMasterObj.WalletName = cWalletobj.Walletname;
                walletMasterObj.PublicAddress = cWalletobj.PublicAddress;
                walletMasterObj.IsDefaultWallet = cWalletobj.IsDefaultWallet;
                walletMasterObj.CoinName = coinName;
                walletMasterObj.OutBoundBalance = cWalletobj.OutBoundBalance;

                var trn = trnType.ToString().Contains("Cr_") ? trnType.ToString().Replace("Cr_", "") : trnType.ToString().Replace("Dr_", "");

                ApplicationUser User = new ApplicationUser();
                try
                {
                    User = _walletRepository1.GetUserById(Convert.ToInt64(userID.ToString())).GetAwaiter().GetResult();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog("User ex" + System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }               

                try
                {
                    decimal charge = _walletRepository1.FindChargeValueDeduct(timestamp, TrnRefNo);
                    long ChargewalletId = _walletRepository1.FindChargeValueReleaseWalletId(timestamp, TrnRefNo);
                    string ChargeCurrency = _walletRepository1.FindChargeCurrencyDeduct(TrnRefNo);

                    HelperForLog.WriteLogIntoFileAsync("GetWalletCreditNewAsync before", "Get walletid and currency walletid=" + ChargewalletId.ToString() + "Currency : " + ChargeCurrency.ToString() + "Charge: " + charge.ToString() + "TrnRefNo: " + TrnRefNo.ToString() + "timestamp : " + timestamp.ToString());
                    if (charge > 0 && ChargewalletId > 0 && (ChargeCurrency != null || ChargeCurrency != ""))
                    {
                        var ChargeWalletObj = _commonRepository.GetById(ChargewalletId);
                        if (ChargeWalletObj != null)
                        {
                            HelperForLog.WriteLogIntoFileAsync("GetWalletCreditNewAsync before", "Get walletid and currency walletid=" + ChargewalletId.ToString() + "Currency : " + ChargeCurrency.ToString() + "Charge: " + charge.ToString() + "TrnRefNo: " + TrnRefNo.ToString() + "timestamp : " + timestamp.ToString());
                                        

                            WalletMasterResponse walletMasterObjCharge = new WalletMasterResponse();
                            walletMasterObjCharge.AccWalletID = ChargeWalletObj.AccWalletID;
                            walletMasterObjCharge.Balance = ChargeWalletObj.Balance;
                            walletMasterObjCharge.WalletName = ChargeWalletObj.Walletname;
                            walletMasterObjCharge.PublicAddress = ChargeWalletObj.PublicAddress;
                            walletMasterObjCharge.IsDefaultWallet = ChargeWalletObj.IsDefaultWallet;
                            walletMasterObjCharge.CoinName = ChargeCurrency;
                            walletMasterObjCharge.OutBoundBalance = ChargeWalletObj.OutBoundBalance;                            
                        }
                    }
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog("Charge ex timestamp: " + timestamp + System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                }
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "GetWalletCreditNew");

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "" }, "Credit");

                //throw ex;
            }
        }

        public Task<bool> CheckUserBalanceAsync(long WalletId, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet)
        {
            try
            {
                //var wObjBal = GetUserBalance(WalletId);
                WalletMaster walletObjectTask = _commonRepository.GetById(WalletId);

                //var TA = _TransactionAccountsRepository.FindBy(item=>item.WalletID== WalletId);
                var crsum = _TransactionAccountsRepository.GetSum(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalanceType.AvailableBalance, f => f.CrAmt);
                var drsum = _TransactionAccountsRepository.GetSum(e => e.WalletID == WalletId && e.IsSettled == 1 && e.Type == enBalanceType.AvailableBalance, f => f.DrAmt);
                var total = crsum - drsum;
                //ntrivedi 13-02-2019 added so margin wallet do not use in other transaction
                if (walletObjectTask.WalletUsageType != Convert.ToInt16(enWalletUsageType))
                {
                    HelperForLog.WriteLogIntoFileAsync("CheckUserBalanceAsync", "WalletId=" + WalletId.ToString() + "WalletUsageType Mismatching :" + enWalletUsageType);
                    return Task.FromResult(false);
                }
                if (total == walletObjectTask.Balance && total >= 0)
                {
                    return Task.FromResult(true);
                }
                return Task.FromResult(false);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public WalletDrCrResponse GetCrDRResponse(WalletDrCrResponse obj, string extras)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(extras, "WalletTransactionCrDr", "Time Stamp:" + obj.TimeStamp + " " + "ReturnCode=" + obj.ReturnCode + ",ErrorCode=" + obj.ErrorCode + ", ReturnMsg=" + obj.ReturnMsg + ",StatusMsg=" + obj.StatusMsg + ",TrnNo=" + obj.TrnNo));
                return obj;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return obj;
            }
        }

        public int CheckTrnRefNoForCredit(long TrnRefNo, enWalletTranxOrderType TrnType)
        {
            var count = _walletRepository1.CheckTrnRefNoForCredit(TrnRefNo, TrnType);
            return count;
        }

        public bool CheckarryTrnID(CreditWalletDrArryTrnID[] arryTrnID, string coinName)
        {
            bool obj = _walletRepository1.CheckarryTrnID(arryTrnID, coinName);
            return obj;
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
                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "WalletTransactionCrDr", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

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


                //ntrivedi 15-02-2019 for margin wallet not use other wallet
                Task<WalletMaster> dWalletobjTask = _commonRepository.GetSingleAsync(e => e.UserID == userID && e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (orderType != enWalletTranxOrderType.Debit) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTrnType, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTrnType, ErrorCode = enErrorCode.InvalidTrnType, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType);
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
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
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
                var msg = _commonWalletFunction.CheckWalletLimitAsyncV1(enWalletLimitType.WithdrawLimit, dWalletobj.Id, amount);

                if (dWalletobj.Balance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Debit");
                }
                if (!CheckUserBalanceFlag)
                {
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType);
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
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletLimitExceed, trnType);
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
                        MaximumAmount = limitres.MaximumAmounts
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
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
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
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = trnno, Status = 0, StatusMsg = "" }, "Debit");
                }

                HelperForLog.WriteLogIntoFileAsync("GetWalletDeductionNew", "OnWalletBalChange + SendActivityNotificationV2 Done TrnNo=" + TrnRefNo.ToString());

                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessDebit, ErrorCode = enErrorCode.Success, TrnNo = trnno, Status = enTransactionStatus.Hold, StatusMsg = bizResponse.ReturnMsg }, "Debit");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetWalletDeductionNew", "WalletTransactionCrDr", ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "Debit");
            }
        }
        #endregion
    }
}
