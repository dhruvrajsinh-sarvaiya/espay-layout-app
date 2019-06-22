using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Entities.NewWallet;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Interfaces.MarginWallet;
using CleanArchitecture.Core.MarginEntitiesWallet;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletConfiguration;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Wallet
{
    public class ArbitrageWalletService : IArbitrageWalletService
    {
        private readonly IArbitrageSPRepositories _walletSPRepositories;
        private readonly ICommonRepository<ArbitrageWalletTypeMaster> _WalletTypeMasterRepository;
        private readonly ICommonRepository<ArbitrageWalletMaster> _ArbitrageWalletMaster;
        private readonly ICommonRepository<ArbitrageLPAddressMaster> _ArbitrageLPAddressMaster;
        private readonly IArbitrageWalletRepository _ArbitrageWalletRepository;
        private readonly ICommonRepository<LPArbitrageWalletMaster> _LPArbitrageWallet;
        private readonly ICommonRepository<TransactionQueueArbitrage> _TransactionQueueArbitrage;
        private readonly ICommonRepository<ArbitrageTransactionRequest> _ArbitrageTransactionRequest;
        private readonly ICommonRepository<ArbitrageDepositFund> _ArbitrageDepositFund;
        private readonly ICommonRepository<ServiceMasterArbitrage> _ServiceMasterArbitrage;
        //private readonly ICommonRepository<ArbitrageWithdrawAdminRequest> _ArbitrageWithdrawAdminRequest;
        private readonly ITransactionConfigService _transactionConfig;
        private readonly IWebApiSendRequest _IWebApiSendRequest;
        private readonly IGetWebRequest _IGetWebRequest;
        private readonly IMediator _mediator;
        private readonly IWalletTQInsert _WalletTQInsert;
        private WebApiParseResponse _WebApiParseResponseObj;
        private readonly ISignalRService _signalRService;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly IMessageService _messageService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        private readonly ICommonRepository<LPArbitrageWalletMismatch> _mismatchReconRepository;

        public ArbitrageWalletService(IArbitrageSPRepositories walletSPRepositories, IArbitrageWalletRepository ArbitrageWalletRepository, ICommonRepository<ArbitrageWalletTypeMaster> WalletTypeMasterRepository,
             ICommonRepository<ArbitrageWalletMaster> ArbitrageWalletMaster, ICommonRepository<ArbitrageLPAddressMaster> ArbitrageLPAddressMaster, ICommonRepository<LPArbitrageWalletMaster> LPArbitrageWallet,
             ITransactionConfigService transactionConfig, IMediator mediator, IWalletTQInsert WalletTQInsert,
          ICommonRepository<TransactionQueueArbitrage> TransactionQueueArbitrage, ICommonRepository<ArbitrageTransactionRequest> ArbitrageTransactionRequest, ICommonRepository<ArbitrageDepositFund> ArbitrageDepositFund, IGetWebRequest IGetWebRequest, IWebApiSendRequest IWebApiSendRequest, WebApiParseResponse WebApiParseResponseObj,
           ISignalRService signalRService,
              IMessageService messageService, IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, UserManager<ApplicationUser> userManager, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue,
              ICommonRepository<LPArbitrageWalletMismatch> mismatchReconRepository, ICommonRepository<ServiceMasterArbitrage> ServiceMasterArbitrage)
        {
            _walletSPRepositories = walletSPRepositories;
            _ArbitrageWalletRepository = ArbitrageWalletRepository;
            _WalletTypeMasterRepository = WalletTypeMasterRepository;
            _ArbitrageWalletMaster = ArbitrageWalletMaster;
            _ArbitrageLPAddressMaster = ArbitrageLPAddressMaster;
            _LPArbitrageWallet = LPArbitrageWallet;
            _transactionConfig = transactionConfig;
            _mediator = mediator;
            _TransactionQueueArbitrage = TransactionQueueArbitrage;
            _ArbitrageTransactionRequest = ArbitrageTransactionRequest;
            _ArbitrageDepositFund = ArbitrageDepositFund;
            // _ArbitrageWithdrawAdminRequest = ArbitrageWithdrawAdminRequest;
            _IGetWebRequest = IGetWebRequest;
            _IWebApiSendRequest = IWebApiSendRequest;
            _WebApiParseResponseObj = WebApiParseResponseObj;
            _WalletTQInsert = WalletTQInsert;
            _signalRService = signalRService;
            _messageService = messageService;
            _pushNotificationsQueue = pushNotificationsQueue;
            _userManager = userManager;
            _pushSMSQueue = pushSMSQueue;
            _mismatchReconRepository = mismatchReconRepository;
            _ServiceMasterArbitrage = ServiceMasterArbitrage;
        }

        #region Wallet
        public BizResponseClass CreateArbitrageWallet(string currency, long UserId)
        {
            try
            {
                var res = _walletSPRepositories.sp_CreateMarginWallet(currency, UserId);
                return res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateMarginWallet", "ArbitrageWalletService", ex);
                throw ex;
            }
        }
        public ListArbitrageWalletTypeMasterResponse ListAllWalletArbitrageTypeMaster(int status)
        {
            ListArbitrageWalletTypeMasterResponse listWalletTypeMasterResponse = new ListArbitrageWalletTypeMasterResponse();
            IEnumerable<ArbitrageWalletTypeMasterRes> arbitrageWalletTypeMasterRes;
            try
            {
                IEnumerable<ArbitrageWalletTypeMaster> coin = new List<ArbitrageWalletTypeMaster>();
                coin = _WalletTypeMasterRepository.FindBy(item => item.Status == status);
                if (coin == null)
                {
                    listWalletTypeMasterResponse.ReturnCode = enResponseCode.Fail;
                    listWalletTypeMasterResponse.ReturnMsg = EnResponseMessage.NotFound;
                    listWalletTypeMasterResponse.ErrorCode = enErrorCode.RecordNotFound;

                }
                else
                {
                    //arbitrageWalletTypeMasterRes = 
                    listWalletTypeMasterResponse.ArbitrageWalletTypeMasters = coin;
                    listWalletTypeMasterResponse.ReturnCode = enResponseCode.Success;
                    listWalletTypeMasterResponse.ErrorCode = enErrorCode.Success;
                    listWalletTypeMasterResponse.ReturnMsg = EnResponseMessage.FindRecored;
                }

                return listWalletTypeMasterResponse;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                listWalletTypeMasterResponse.ReturnCode = enResponseCode.InternalError;
                return listWalletTypeMasterResponse;
            }
        }
        public async Task<ListArbitrageWallet> ListArbitrageWalletMaster(long? WalletTypeId, short? Status, string AccWalletId, long? UserId)
        {
            ListArbitrageWallet Resp = new ListArbitrageWallet();
            try
            {
                //Resp.PageNo = PageNo;
                //Resp.PageSize = PageSize;

                var data = _ArbitrageWalletRepository.ListArbitrageWallet(WalletTypeId, 0, Status, AccWalletId, UserId);
                Resp.Data = data;
                //Resp.TotalCount = TotalCount;
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
        public ListWalletLedgerResv1 GetArbitrageWalletLedger(DateTime FromDate, DateTime ToDate, string WalletId, int page, int PageSize)
        {
            try
            {
                var wallet = _ArbitrageWalletMaster.GetSingle(item => item.AccWalletID == WalletId);

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
                var wl = _ArbitrageWalletRepository.GetArbitrageWalletLedger(FromDate, newToDate, wallet.Id, page + 1, PageSize, ref TotalCount);
                Response.TotalCount = TotalCount;
                if (wl.Count == 0)
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
        #endregion

        #region Arbitrage Address

        public InsertUpdateAddressRes InsertUpdateArbitrageAddress(InsertUpdateAddressReq Req, long UserId)
        {
            try
            {
                var WalletTypeObj = _WalletTypeMasterRepository.GetSingle(i => i.Id == Req.WalletTypeId && i.Status == 1);
                if (WalletTypeObj == null)
                {
                    return new InsertUpdateAddressRes()
                    {
                        ReturnCode = enResponseCode.Fail,
                        ReturnMsg = EnResponseMessage.InvalidWalletType,
                        ErrorCode = enErrorCode.InvalidWalletType
                    };
                }

                if (Req.Id == 0)
                {
                    var IsExistObj = _ArbitrageLPAddressMaster.GetSingle(i => i.WalletTypeId == Req.WalletTypeId && i.SerProID == Req.ServiceProviderID && i.Status == 1);
                    if (IsExistObj != null)
                    {
                        if (IsExistObj.Address == Req.Address)
                        {
                            return new InsertUpdateAddressRes()
                            {
                                ReturnCode = enResponseCode.Fail,
                                ReturnMsg = EnResponseMessage.Alredy_Exist,
                                ErrorCode = enErrorCode.Alredy_Exist
                            };
                        }
                        if (IsExistObj.IsDefaultAddress == 1 && Req.IsDefaultAddress == 1)
                        {
                            IsExistObj.IsDefaultAddress = 0;
                            _ArbitrageLPAddressMaster.UpdateWithAuditLog(IsExistObj);
                        }
                    }
                    ArbitrageLPAddressMaster NewObj = new ArbitrageLPAddressMaster()
                    {
                        CreatedBy = UserId,
                        CreatedDate = Helpers.UTC_To_IST(),
                        Status = 1,
                        WalletId = 0,
                        WalletTypeId = Req.WalletTypeId,
                        SerProID = Req.ServiceProviderID,
                        Address = Req.Address,
                        OriginalAddress = Req.Address,
                        IsDefaultAddress = Req.IsDefaultAddress,
                        AddressLable = WalletTypeObj.WalletTypeName + " Address",
                        GUID = "",
                        AddressType = enAddressType.DepositionAddress,
                        TxnID = ""
                    };
                    _ArbitrageLPAddressMaster.Add(NewObj);
                    return new InsertUpdateAddressRes()
                    {
                        ReturnCode = enResponseCode.Success,
                        ReturnMsg = EnResponseMessage.RecordAdded,
                        ErrorCode = enErrorCode.Success
                    };
                }
                else
                {
                    var IsExist = _ArbitrageLPAddressMaster.GetSingle(i => i.Id == Req.Id && i.Status == 1);
                    if (IsExist != null)
                    {
                        if (IsExist.IsDefaultAddress == 0 && Req.IsDefaultAddress == 1)
                        {
                            var IsExistObj = _ArbitrageLPAddressMaster.GetSingle(i => i.WalletTypeId == Req.WalletTypeId && i.SerProID == Req.ServiceProviderID && i.Status == 1 && i.IsDefaultAddress == 1);
                            if (IsExistObj != null)
                            {
                                IsExistObj.IsDefaultAddress = 0;
                                _ArbitrageLPAddressMaster.UpdateWithAuditLog(IsExistObj);
                            }
                        }
                        IsExist.IsDefaultAddress = Req.IsDefaultAddress;
                        IsExist.UpdatedBy = UserId;
                        IsExist.UpdatedDate = Helpers.UTC_To_IST();
                        IsExist.Status = 1;
                        IsExist.WalletTypeId = Req.WalletTypeId;
                        IsExist.SerProID = Req.ServiceProviderID;
                        IsExist.Address = Req.Address;
                        IsExist.OriginalAddress = Req.Address;
                        IsExist.AddressLable = WalletTypeObj.WalletTypeName + " Address";
                        _ArbitrageLPAddressMaster.UpdateWithAuditLog(IsExist);
                        return new InsertUpdateAddressRes()
                        {
                            ReturnCode = enResponseCode.Success,
                            ReturnMsg = EnResponseMessage.RecordUpdated,
                            ErrorCode = enErrorCode.Success
                        };
                    }
                    else
                    {
                        return new InsertUpdateAddressRes()
                        {
                            ReturnCode = enResponseCode.Fail,
                            ReturnMsg = EnResponseMessage.NotFound,
                            ErrorCode = enErrorCode.NotFound
                        };
                    }
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListArbitrageAddressRes ListArbitrageAddress(string Address, long? WalletTypeId, long? ServiceProviderId)
        {
            try
            {
                ListArbitrageAddressRes resp = new ListArbitrageAddressRes();
                var data = _ArbitrageWalletRepository.ListArbitrageAddress(Address, WalletTypeId, ServiceProviderId);

                if (data.Count == 0)
                {
                    resp.Data = new List<ArbitrageAddressRes>();
                    resp.ReturnCode = enResponseCode.Fail;
                    resp.ReturnMsg = EnResponseMessage.NotFound;
                    resp.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    resp.Data = data;
                    resp.ReturnCode = enResponseCode.Success;
                    resp.ReturnMsg = EnResponseMessage.FindRecored;
                    resp.ErrorCode = enErrorCode.Success;
                }
                return resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        #endregion

        #region balance
        public async Task<ArbitrageServiceProBalanceResponse> GetArbitrageProviderBalance(long SerProID, string SMSCode)
        {
            List<Task<ArbitrageServiceProviderBalance>> responseCls = new List<Task<ArbitrageServiceProviderBalance>>();
            List<ArbitrageServiceProviderBalance> responseData = new List<ArbitrageServiceProviderBalance>();
            ArbitrageServiceProBalanceResponse response = new ArbitrageServiceProBalanceResponse();
            ArbitrageServiceProviderBalance responseClsSub;
            ArbitrageWalletTypeMaster arbitrageWalletType = new ArbitrageWalletTypeMaster();
            try
            {

                IEnumerable<LPArbitrageWalletMaster> ArbitrageWalletList;
                List<Task<ArbitrageServiceProviderBalance>> taskResult = new List<Task<ArbitrageServiceProviderBalance>>();

                arbitrageWalletType = _WalletTypeMasterRepository.GetSingle(x => x.WalletTypeName == SMSCode);
                if (arbitrageWalletType == null)
                {
                    response.ReturnCode = enResponseCode.Fail;
                    response.ReturnMsg = EnResponseMessage.InvalidBaseCurrency;
                    response.ErrorCode = enErrorCode.InvalidSourceCurrency;
                    return response;
                }
                if (SerProID == 0)
                {
                    ArbitrageWalletList = _LPArbitrageWallet.FindBy(x => x.WalletTypeID == arbitrageWalletType.Id);
                }
                else
                {
                    ArbitrageWalletList = _LPArbitrageWallet.FindBy(x => x.WalletTypeID == arbitrageWalletType.Id && x.SerProID == SerProID);
                }
                foreach (LPArbitrageWalletMaster subItem in ArbitrageWalletList)
                {
                    //var resultTask = GetArbitrageProviderBalanceMediatR(subItem.SerProID, subItem.WalletTypeID);
                    HelperForLog.WriteLogIntoFileAsync("GetArbitrageProviderBalance", "WalletService", subItem.SerProID.ToString() + " Currency " + subItem.WalletTypeID);
                    taskResult.Add(GetArbitrageProviderBalanceMediatR(subItem.SerProID, subItem.WalletTypeID, subItem.Balance));
                }
                var testResult = await Task.WhenAll<ArbitrageServiceProviderBalance>(taskResult);

                //return testResult.ToList().AsEnumerable();
                response.Data = testResult.ToList();
                response.Data.RemoveAll(item => item == null);
                if (testResult.ToList().Count == 0)
                {
                    response.ReturnCode = enResponseCode.Fail;
                    response.ReturnMsg = EnResponseMessage.ProviderDataFetchFail;
                    response.ErrorCode = enErrorCode.NoRecordFound;
                }
                else
                {
                    response.ReturnCode = enResponseCode.Success;
                    response.ReturnMsg = EnResponseMessage.ProviderDataFetchSuccess;
                    response.ErrorCode = enErrorCode.Success;
                }
                return response;
                //foreach (Task<ArbitrageServiceProviderBalance> taskResultSub in taskResult)
                //{
                //    responseClsSub = taskResultSub;
                //    if(responseClsSub !=null)
                //    {
                //        responseData.Add(responseClsSub);
                //    }
                //}
                //return testResult;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public async Task<ArbitrageServiceProviderBalance> GetArbitrageProviderBalanceMediatR(long SerProID, long WalletTypeID, decimal balance)
        {
            LPBalanceCheck mediatrReq;
            ArbitrageWalletTypeMaster arbitrageCurrency;
            ArbitrageServiceProviderBalance responseCls = new ArbitrageServiceProviderBalance();
            Core.ViewModels.Configuration.ServiceProviderViewModel providerViewModel = new ServiceProviderViewModel();
            try
            {

                arbitrageCurrency = _WalletTypeMasterRepository.GetSingle(x => x.Id == WalletTypeID);
                if (arbitrageCurrency == null)
                {
                    return null;
                }
                providerViewModel = _transactionConfig.GetPoviderByID(SerProID);
                if (providerViewModel == null)
                {
                    return null;
                }
                mediatrReq = new LPBalanceCheck();
                mediatrReq.SerProID = SerProID;
                mediatrReq.Currency = arbitrageCurrency.WalletTypeName;
                await _mediator.Send(mediatrReq);
                responseCls.Balance = mediatrReq.Balance;
                responseCls.CurrencyName = arbitrageCurrency.WalletTypeName;
                responseCls.ProviderName = providerViewModel.ProviderName;
                responseCls.WalletBalance = balance;
                //await Task.Delay(10000);     
                HelperForLog.WriteLogIntoFileAsync("GetArbitrageProviderBalanceMediatR", "WalletService", SerProID + " Currency " + WalletTypeID);
                return responseCls;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
                //throw ex;
            }
        }


        public async Task<WalletDrCrResponse> ArbitrageLPGetWalletHoldNew(LPHoldDr LPObj)
        {
            try
            {

                WalletDrCrResponse resp = new WalletDrCrResponse();
                //bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Debit;
                ArbitrageWalletTypeMaster walletTypeMaster;
                long userID = 0, TrnNo = 0;
                ArbitrageWalletTransactionQueue objTQ;
                LPArbitrageWalletMaster dWalletobj;

                HelperForLog.WriteLogIntoFileAsync("ArbitrageGetWalletHoldNew", "MarginTransactionWalletService", Helpers.JsonSerialize(LPObj));

                //Task<CheckTrnRefNoRes> countTask1 = _walletRepository1.CheckTranRefNoAsync(TrnRefNo, orderType, trnType);
                if (LPObj.SerProID == 0 || LPObj.CoinName == string.Empty)
                {
                    return new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName, TimeStamp = LPObj.Timestamp };
                }
                walletTypeMaster = _WalletTypeMasterRepository.GetForceSingle(e => e.WalletTypeName == LPObj.CoinName);
                if (walletTypeMaster == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                }
                //2019-2-18 added condi for only used trading wallet
                var dWalletobjTask = _LPArbitrageWallet.GetForceSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.SerProID == LPObj.SerProID);

                if (LPObj.TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, LPObj.Amount, LPObj.TrnRefNo, Helpers.UTC_To_IST(), null, 0, LPObj.CoinName, userID, LPObj.Timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, LPObj.trnType, enErrorCode.InvalidTradeRefNo);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                }
                if (LPObj.Amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, LPObj.Amount, LPObj.TrnRefNo, Helpers.UTC_To_IST(), null, 0, LPObj.CoinName, userID, LPObj.Timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, LPObj.trnType, enErrorCode.InvalidAmount);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmount, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                }
                dWalletobj = await dWalletobjTask;
                if (dWalletobj == null)
                {
                    //tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid().ToString(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, 2, EnResponseMessage.InvalidWallet);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                }
                LPObj.WalletID = dWalletobj.Id;
                //userID = dWalletobj.UserID;
                HelperForLog.WriteLogIntoFileAsync("ArbitrageGetWalletHoldNew", "CheckUserBalance Pre sp call TrnNo=" + LPObj.TrnRefNo.ToString() + " timestamp:" + LPObj.Timestamp);
                BizResponseClass bizResponse = _walletSPRepositories.Callsp_ArbitrageHoldWallet(LPObj, dWalletobj);
                HelperForLog.WriteLogIntoFileAsync("ArbitrageGetWalletHoldNew", "CheckUserBalance Post sp call TrnNo=" + LPObj.TrnRefNo.ToString() + " timestamp:" + LPObj.Timestamp);
                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = LPObj.TrnNo, Status = 0, StatusMsg = bizResponse.ReturnMsg, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                }
                else
                {
                    // ntrivedi 12-02-2018 status message changed
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = TrnNo, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = EnResponseMessage.InternalError, TimeStamp = LPObj.Timestamp }, "ArbitrageGetWalletHoldNew");
                //throw ex;
            }
        }

        public WalletDrCrResponse GetCrDRResponse(WalletDrCrResponse obj, string extras)
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFile(extras, "ArbitrageTransactionWalletService", Helpers.JsonSerialize(obj)));
                return obj;
            }
            catch (Exception ex)
            {
                return obj;
            }
        }

        public ArbitrageWalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
           long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType, enErrorCode enErrorCodeObj, LPOrderType LPType = LPOrderType.LPHoldUser)
        {
            try
            {
                ArbitrageWalletTransactionQueue walletTransactionQueue = new ArbitrageWalletTransactionQueue();
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
                walletTransactionQueue.IsProcessing = 0;
                walletTransactionQueue.LPType = Convert.ToInt16(LPType);
                walletTransactionQueue.ErrorCode = Convert.ToInt64(enErrorCodeObj);
                return walletTransactionQueue;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public async Task<WalletDrCrResponse> GetArbitrageWalletHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                ArbitrageWalletMaster dWalletobj;
                string remarks = "";
                ArbitrageWalletTypeMaster walletTypeMaster;
                ArbitrageWalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("GetArbitrageWalletHoldNew", "ArbitrageWalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

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
                Task<ArbitrageWalletMaster> dWalletobjTask = _ArbitrageWalletMaster.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType, enErrorCode.InvalidTradeRefNo, 0);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType, enErrorCode.InvalidAmount, 0);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);

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
                //var flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                //if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}

                HelperForLog.WriteLogIntoFileAsync("GetArbitrageWalletHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + ", TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                //CheckUserBalanceFlag = await flagTask;
                //CheckUserBalanceFlag = await flagTask;

                HelperForLog.WriteLogIntoFileAsync("GetArbitrageWalletHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                dWalletobj = _ArbitrageWalletMaster.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 
                if (dWalletobj.Balance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType, enErrorCode.InsufficantBal);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBal, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                }



                //if (!CheckUserBalanceFlag)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType,enErrorCode.SettedBalanceMismatch);
                //    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                //HelperForLog.WriteLogIntoFileAsync("GetWalletHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);

                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "DebitForHold");
                //}
                HelperForLog.WriteLogIntoFileAsync("GetArbitrageWalletHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);
                #region Commented Code



                #endregion
                //int count = await countTask;
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
                HelperForLog.WriteLogIntoFileAsync("GetArbitrageWalletHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + " timestamp:" + timestamp);



                BizResponseClass bizResponse = _walletSPRepositories.Callsp_HoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo, enWalletDeductionType);

                decimal charge = 0;
                ArbitrageWalletTypeMaster ChargewalletType = null;
                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    try
                    {
                        charge = _ArbitrageWalletRepository.FindChargeValueHold(timestamp, TrnRefNo);
                        long walletId = _ArbitrageWalletRepository.FindChargeValueWalletId(timestamp, TrnRefNo);
                        ArbitrageWalletMaster ChargeWalletObj = null;

                        ////charge = 0;
                        if (charge > 0 && walletId > 0)
                        {
                            ChargeWalletObj = _ArbitrageWalletMaster.GetById(walletId);
                            ChargewalletType =   _WalletTypeMasterRepository.GetSingle(i => i.Id == ChargeWalletObj.WalletTypeID);
                        }
                        // Task.Run(() =>WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, charge, walletId, ChargeWalletObj, ChargewalletType));

                        await WalletHoldNotificationSend(timestamp, dWalletobj, coinName, amount, TrnRefNo, (byte)routeTrnType, charge, walletId, ChargeWalletObj, ChargewalletType);
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

        public async Task<WalletDrCrResponse> ArbitrageGetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "")
        {
            try
            {
                ArbitrageWalletMaster dWalletobj;
                string remarks = "";
                ArbitrageWalletTypeMaster walletTypeMaster;
                ArbitrageWalletTransactionQueue objTQ;
                //long walletTypeID;
                WalletDrCrResponse resp = new WalletDrCrResponse();
                bool CheckUserBalanceFlag = false;
                enWalletTranxOrderType orderType = enWalletTranxOrderType.Credit;
                long userID = 0, TrnNo = 0;

                HelperForLog.WriteLogIntoFileAsync("ArbitrageGetReleaseHoldNew", "ArbitrageTransactionWalletService", "timestamp:" + timestamp + "," + "coinName:" + coinName + ",accWalletID=" + accWalletID + ",TrnRefNo=" + TrnRefNo.ToString() + ",userID=" + userID + ",amount=" + amount.ToString());

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
                Task<ArbitrageWalletMaster> dWalletobjTask = _ArbitrageWalletMaster.GetSingleAsync(e => e.WalletTypeID == walletTypeMaster.Id && e.AccWalletID == accWalletID && e.WalletUsageType == Convert.ToInt64(EnWalletUsageType.Trading_Wallet));

                if (TrnRefNo == 0) // sell 13-10-2018
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidTradeRefNo, trnType, enErrorCode.InvalidTradeRefNo);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNo, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                if (amount <= 0)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, 0, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidAmt, trnType, enErrorCode.InvalidAmount);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
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
                //Task<bool> flagTask = CheckUserBalanceAsync(amount, dWalletobj.Id);
                //Task<bool> flagTask1 = CheckUserBalanceAsync(dWalletobj.Id, enBalanceType.OutBoundBalance);

                if (dWalletobj.Status != 1 || dWalletobj.IsValid == false)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InvalidWallet, trnType, enErrorCode.InvalidWallet);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidWallet, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold Arbitrage");
                }

                //HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "CheckUserBalance pre Balance=" + dWalletobj.Balance.ToString() + "timestamp:" + timestamp + ", TrnNo=" + TrnRefNo.ToString());
                //CheckUserBalanceFlag = await flagTask;

                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "CheckUserBalance Post TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);
                dWalletobj = _ArbitrageWalletMaster.GetById(dWalletobj.Id); // ntrivedi fetching fresh balance for multiple request at a time 

                //if (!CheckUserBalanceFlag)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType, enErrorCode.SettedBalanceMismatch);
                //    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold Arbitrage");
                //}
                //Task<bool> flagTask1 = CheckUserBalanceAsync(amount, dWalletobj.Id, enBalanceType.OutBoundBalance);
                //CheckUserBalanceFlag = await flagTask1;
                //if (!CheckUserBalanceFlag)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, trnType, enErrorCode.SettedOutgoingBalanceMismatch);
                //    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SettedOutgoingBalanceMismatch, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                //}
                //HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "before Check ShadowLimit TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);
                //no need tocheck shadow limit 22-02-2019
                //enErrorCode enErrorCode1 = await errorCode;
                //if (enErrorCode1 != enErrorCode.Success)
                //{
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType);
                //    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.ShadowLimitExceed, ErrorCode = enErrorCode.ShadowBalanceExceed, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                //}
                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "Check ShadowLimit done TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);

                //int count = await countTask;
                //if (count != 0)
                //{
                //    // insert with status=2 system failed
                //    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.AlredyExist, trnType);
                //    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.AlredyExist, ErrorCode = enErrorCode.AlredyExist, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg }, "Debit");
                //}
                if (dWalletobj.OutBoundBalance < amount)
                {
                    // insert with status=2 system failed
                    objTQ = InsertIntoWalletTransactionQueue(Guid.NewGuid(), orderType, amount, TrnRefNo, Helpers.UTC_To_IST(), null, dWalletobj.Id, coinName, userID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, trnType, enErrorCode.InsufficientOutboundBalance);
                    objTQ = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(objTQ, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutboundBalance, TrnNo = objTQ.TrnNo, Status = objTQ.Status, StatusMsg = objTQ.StatusMsg, TimeStamp = timestamp }, "Release Hold");
                }
                HelperForLog.WriteLogIntoFileAsync("MarginGetReleaseHoldNew", "CheckTrnRefNo TrnNo=" + TrnRefNo.ToString() + "timestamp:" + timestamp);

                BizResponseClass bizResponse = _walletSPRepositories.Callsp_ReleaseHoldWallet(dWalletobj, timestamp, serviceType, amount, coinName, allowedChannels, walletTypeMaster.Id, TrnRefNo, dWalletobj.Id, dWalletobj.UserID, routeTrnType, trnType, ref TrnNo);

                if (bizResponse.ReturnCode == enResponseCode.Success)
                {
                    WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                    walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
                    walletMasterObj.Balance = dWalletobj.Balance;
                    walletMasterObj.WalletName = dWalletobj.WalletName;
                    walletMasterObj.PublicAddress = "";
                    walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
                    walletMasterObj.CoinName = coinName;
                    walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

                    ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                    ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceReleaseNotification);
                    ActivityNotification.Param1 = coinName;
                    ActivityNotification.Param2 = amount.ToString();
                    ActivityNotification.Param3 = TrnRefNo.ToString();
                    ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                    decimal charge = _ArbitrageWalletRepository.FindChargeValueDeduct(timestamp, TrnRefNo);

                    

                    HelperForLog.WriteLogIntoFileAsync("ArbitrageGetReleaseHoldNew", "OnWalletBalChange + SendActivityNotificationV2Arbitrage pre TrnNo=" + TrnRefNo.ToString());

                    Task.Run(() => Parallel.Invoke(() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotification, dWalletobj.UserID.ToString(), 2, ""),

                        () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2, "", 1)
                      ));

                    if (charge > 0)
                    {
                        //ntrivedi 19-06-2019 taken from above
                        ActivityNotificationMessage ActivityNotificationCharge = new ActivityNotificationMessage();
                        ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.ChargeReleasedWallet);
                        ActivityNotificationCharge.Param1 = coinName;
                        ActivityNotificationCharge.Param2 = charge.ToString();
                        ActivityNotificationCharge.Param3 = TrnRefNo.ToString();
                        ActivityNotificationCharge.Type = Convert.ToInt16(EnNotificationType.Info);

                        Parallel.Invoke(
                       () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCharge, dWalletobj.UserID.ToString(), 2, "", 1),
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
                HelperForLog.WriteErrorLog("ArbitrageMarginGetReleaseHoldNew", "ArbitrageTransactionWalletService TimeStamp:" + timestamp, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "Release Hold");
                //throw ex;
            }
        }

        public async Task<WalletDrCrResponse> GetArbitrageWalletCreditDrForHoldNewAsyncFinal(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                ArbitrageWalletTransactionQueue tqObj;
                //WalletTransactionQueue firstCurrObjTQDr, secondCurrObjTQDr, tqObj;
                //WalletTransactionQueue firstCurrObjTQ, secondCurrObjTQ;
                //WalletTransactionOrder firstCurrObjTO, secondCurrObjTO;
                // TransactionAccount firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA;
                // WalletLedger firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL;
                ArbitrageWalletMaster firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjDrWM;
                // string remarksFirstDr, remarksFirstCr, remarksSecondDr, remarksSecondCr;
                ArbitrageWalletTypeMaster walletTypeFirstCurr, walletTypeSecondCurr;
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

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal first currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + firstCurrObj.Amount + ",Coin=" + firstCurrObj.Coin + ", CR WalletID=" + firstCurrObj.creditObject.WalletId + ",Dr WalletID=" + firstCurrObj.debitObject.WalletId + " cr full settled=" + firstCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + firstCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + firstCurrObj.debitObject.isMarketTrade));
                Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal second currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + secondCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + secondCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + secondCurrObj.Amount + ",Coin=" + secondCurrObj.Coin + ", CR WalletID=" + secondCurrObj.creditObject.WalletId + ",Dr WalletID=" + secondCurrObj.debitObject.WalletId + " cr full settled=" + secondCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + secondCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + secondCurrObj.debitObject.isMarketTrade));

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
                var firstCurrObjCrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == firstCurrObj.creditObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                if (firstCurrObj.debitObject.isMarketTrade == 1)
                {
                    checkDebitRefNoTask = _ArbitrageWalletRepository.CheckTrnIDDrForMarketAsync(firstCurrObj);
                }
                else
                {
                checkDebitRefNoTask = _ArbitrageWalletRepository.CheckTrnIDDrForHoldAsync(firstCurrObj);
                }
                //2019-2-18 added condi for only used trading wallet
                var firstCurrObjDrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == firstCurrObj.debitObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                // to solve second operation started error solving 04-03-2019 ntrivedi await before query in same repository
                checkDebitRefNo = await checkDebitRefNoTask;
                if (checkDebitRefNo == false)//fail
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType, enErrorCode.InvalidTradeRefNoFirCur);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                if (secondCurrObj.debitObject.isMarketTrade == 1)
                {
                    checkDebitRefNoTask1 = _ArbitrageWalletRepository.CheckTrnIDDrForMarketAsync(secondCurrObj);
                }
                else
                {
                checkDebitRefNoTask1 = _ArbitrageWalletRepository.CheckTrnIDDrForHoldAsync(secondCurrObj);
                }
                //2019-2-18 added condi for only used trading wallet
                var secondCurrObjCrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == secondCurrObj.creditObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                //Task<MemberShadowBalance> FirstDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == firstCurrObj.creditObject.WalletId);
                //2019-2-18 added condi for only used trading wallet
                var secondCurrObjDrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == secondCurrObj.debitObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                //Task<MemberShadowBalance> SecondDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == secondCurrObj.creditObject.WalletId);

                //Task<bool> CheckUserCrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.creditObject.WalletId);
                Task<ArbitrageWalletTypeMaster> walletTypeFirstCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == firstCurrObj.Coin);
                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //CheckUserCrBalanceFlag = await CheckUserCrBalanceFlagTask;
                //if (!CheckUserCrBalanceFlag)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<bool> CheckUserDrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                Task<ArbitrageWalletTypeMaster> walletTypeSecondCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == secondCurrObj.Coin);
                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //CheckUserDrBalanceFlag = await CheckUserDrBalanceFlagTask;
                //if (!CheckUserDrBalanceFlag)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.debitObject.WalletId, firstCurrObj.Coin, firstCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //Task<bool> CheckUserCrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                //Task<bool> CheckUserCrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);

                //Task<bool> CheckUserCrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.creditObject.WalletId);

                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //CheckUserCrBalanceFlag1 = await CheckUserCrBalanceFlagTask1;
                //if (!CheckUserCrBalanceFlag1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.debitObject.WalletId, secondCurrObj.Coin, secondCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<bool> CheckUserDrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);


                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetWalletCreditDrForHoldNewAsyncFinal before await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                if (firstCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, secondCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.FirstCurrCrWalletNotFound);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                firstCurrObjDrWM = await firstCurrObjDrWMTask;
                if (firstCurrObjDrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, secondCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.FirstCurrDrWalletNotFound);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;
                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));
                secondCurrObjCrWM = await secondCurrObjCrWMTask;
                if (secondCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.SecondCurrCrWalletNotFound);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                secondCurrObj.creditObject.UserID = secondCurrObjCrWM.UserID;

                secondCurrObjDrWM = await secondCurrObjDrWMTask;
                if (secondCurrObjDrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.SecondCurrDrWalletNotFound);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                secondCurrObj.debitObject.UserID = secondCurrObjDrWM.UserID;




                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                //checkDebitRefNo = await checkDebitRefNoTask;
                //if (checkDebitRefNo == false)//fail
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                checkDebitRefNo1 = await checkDebitRefNoTask1;
                if (checkDebitRefNo1 == false)//fail
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", secondCurrObj.creditObject.trnType, enErrorCode.InvalidTradeRefNoSecCur);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);

                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                }
                //market trade comment 11-06-2019
                if (firstCurrObj.debitObject.isMarketTrade == 1 && firstCurrObj.debitObject.differenceAmount > 0)
                {
                    if (firstCurrObjDrWM.Balance < firstCurrObj.debitObject.differenceAmount)
                    {
                        // insert with status=2 system failed
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType, enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed);
                        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                    bizResponseClassFC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(firstCurrObjDrWM, timestamp, serviceType, firstCurrObj.debitObject.differenceAmount, firstCurrObj.Coin, allowedChannels, firstCurrObjDrWM.WalletTypeID, firstCurrObj.debitObject.WTQTrnNo, firstCurrObj.debitObject.WalletId, firstCurrObj.debitObject.UserID, enTrnType.Buy_Trade, firstCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                    if (bizResponseClassFC.ReturnCode != enResponseCode.Success)
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType, enErrorCode.FirstCurrDifferentialAmountHoldFailed);
                        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.FirstCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                }
                if (secondCurrObj.debitObject.isMarketTrade == 1 && secondCurrObj.debitObject.differenceAmount > 0)
                {
                    if (secondCurrObjDrWM.Balance < secondCurrObj.debitObject.differenceAmount)
                    {
                        // insert with status=2 system failed
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType, enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed);
                        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                    }
                    bizResponseClassSC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(secondCurrObjDrWM, timestamp, serviceType, secondCurrObj.debitObject.differenceAmount, secondCurrObj.Coin, allowedChannels, secondCurrObjDrWM.WalletTypeID, secondCurrObj.debitObject.WTQTrnNo, secondCurrObj.debitObject.WalletId, secondCurrObj.debitObject.UserID, enTrnType.Buy_Trade, secondCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                    if (bizResponseClassSC.ReturnCode != enResponseCode.Success)
                    {
                        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType, enErrorCode.SecondCurrDifferentialAmountHoldFailed);
                        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
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

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetArbitrageWalletCreditDrForHoldNewAsyncFinal before await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                //Task<enErrorCode> enErrorCodeTaskfirst = _commonWalletFunction.CheckShadowLimitAsync(firstCurrObjDrWM.Id, firstCurrObj.Amount);
                //enErrorCodefirst = await enErrorCodeTaskfirst;
                //if (enErrorCodefirst != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                if (firstCurrObjDrWM.OutBoundBalance < firstCurrObj.Amount) // ntrivedi checking outbound balance
                {
                    // insert with status=2 system failed
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType, enErrorCode.InsufficientOutgoingBalFirstCur);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutgoingBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                //Task<enErrorCode> enErrorCodeTaskSecond = _commonWalletFunction.CheckShadowLimitAsync(secondCurrObjDrWM.Id, secondCurrObj.Amount);
                //enErrorCodeSecond = await enErrorCodeTaskSecond;
                //if (enErrorCodeSecond != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}

                if (secondCurrObjDrWM.OutBoundBalance < secondCurrObj.Amount)// ntrivedi checking outbound balance
                {
                    // insert with status=2 system failed
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType, enErrorCode.InsufficietOutgoingBalSecondCur);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficietOutgoingBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                if (firstCurrObjDrWM.Status != 1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType, enErrorCode.FirstCurrWalletStatusDisable);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }

                if (secondCurrObjDrWM.Status != 1)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType, enErrorCode.SecondCurrWalletStatusDisable);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }


                //CheckUserDrBalanceFlag1 = await CheckUserDrBalanceFlagTask1;
                //if (!CheckUserDrBalanceFlag1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWalletSecDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal after await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));



                Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal before Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                //bool flag = await _walletRepository1.WalletCreditDebitwithTQTestFinal(firstCurrObjTQ, secondCurrObjTQ, secondCurrObjTO, firstCurrObjTO, FirstDebitShadowWallet, SecondDebitShadowWallet, firstCurrObjTQDr, secondCurrObjTQDr, firstCurrObj, secondCurrObj, firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL, firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA);
                BizResponseClass bizResponse = _walletSPRepositories.Callsp_ArbitrageCrDrWalletForHold(firstCurrObj, secondCurrObj, timestamp, serviceType, walletTypeFirstCurr.Id, walletTypeSecondCurr.Id, (long)allowedChannels);

                _ArbitrageWalletRepository.ReloadEntity(firstCurrObjCrWM, secondCurrObjCrWM, firstCurrObjDrWM, secondCurrObjDrWM);

                if (bizResponse.ReturnCode != enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = 0, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Credit");
                }
                decimal ChargefirstCur = 0, ChargesecondCur = 0;
                //ntrivedi added for try catch 05-03-2019 11-06-2019
                try
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before WaitAll", "ArbitrageWalletService", "timestamp:" + timestamp));
                    Task.WaitAll();
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after WaitAll", "ArbitrageWalletService", "timestamp:" + timestamp));
                    ChargefirstCur = _ArbitrageWalletRepository.FindChargeValueDeduct(timestamp, secondCurrObj.creditObject.TrnRefNo);
                    ChargesecondCur = _ArbitrageWalletRepository.FindChargeValueDeduct(timestamp, secondCurrObj.debitObject.TrnRefNo);
                    secondCurrObj.debitObject.Charge = ChargesecondCur;
                    firstCurrObj.debitObject.Charge = ChargefirstCur;
                }
                catch (Exception ex1)
                {
                    HelperForLog.WriteErrorLog("ArbitrageGetWalletCreditDrForHoldNewAsyncFinal charge exception  Timestamp" + timestamp, this.GetType().Name, ex1);
                }

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal after Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));

                Task.Run(() => CreditDebitNotificationSend(timestamp, firstCurrObj, secondCurrObj, firstCurrObjCrWM, firstCurrObjDrWM, secondCurrObjCrWM, secondCurrObjCrWM, ChargefirstCur, ChargesecondCur));

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal:Without Token done", "WalletService", ",timestamp =" + timestamp));
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("GetArbitrageWalletCreditDrForHoldNewAsyncFinal Timestamp" + timestamp, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
                //throw ex;
            }
        }
        public async Task CreditDebitNotificationSend(string timestamp, CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, ArbitrageWalletMaster firstCurrObjCrWM, ArbitrageWalletMaster firstCurrObjDrWM, ArbitrageWalletMaster secondCurrObjCrWM, ArbitrageWalletMaster secondCurrObjDrWM, decimal ChargefirstCur, decimal ChargesecondCur)
        {
            try
            {
                #region SMS_Email
                WalletMasterResponse walletMasterObjCr = new WalletMasterResponse();
                walletMasterObjCr.AccWalletID = firstCurrObjCrWM.AccWalletID;
                walletMasterObjCr.Balance = firstCurrObjCrWM.Balance;
                walletMasterObjCr.WalletName = firstCurrObjCrWM.WalletName;
                walletMasterObjCr.PublicAddress = "";
                walletMasterObjCr.IsDefaultWallet = firstCurrObjCrWM.IsDefaultWallet;
                walletMasterObjCr.CoinName = firstCurrObj.Coin;
                walletMasterObjCr.OutBoundBalance = firstCurrObjCrWM.OutBoundBalance;

                WalletMasterResponse walletMasterObjCr1 = new WalletMasterResponse();
                walletMasterObjCr1.AccWalletID = secondCurrObjCrWM.AccWalletID;
                walletMasterObjCr1.Balance = secondCurrObjCrWM.Balance;
                walletMasterObjCr1.WalletName = secondCurrObjCrWM.WalletName;
                walletMasterObjCr1.PublicAddress = "";
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
                walletMasterObjDr.WalletName = firstCurrObjDrWM.WalletName;
                walletMasterObjDr.PublicAddress = "";
                walletMasterObjDr.IsDefaultWallet = firstCurrObjDrWM.IsDefaultWallet;
                walletMasterObjDr.CoinName = firstCurrObj.Coin;
                walletMasterObjDr.OutBoundBalance = firstCurrObjDrWM.OutBoundBalance;


                WalletMasterResponse walletMasterObjDr1 = new WalletMasterResponse();
                walletMasterObjDr1.AccWalletID = secondCurrObjDrWM.AccWalletID;
                walletMasterObjDr1.Balance = secondCurrObjDrWM.Balance;
                walletMasterObjDr1.WalletName = secondCurrObjDrWM.WalletName;
                walletMasterObjDr1.PublicAddress = "";
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

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCr, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr, firstCurrObj.Coin, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCr1, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr1, secondCurrObj.Coin, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationdr, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjDr, firstCurrObj.Coin, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationdr1, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjDr1, secondCurrObj.Coin, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, firstCurrObjCrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjCrType, firstCurrObj.creditObject.TrnRefNo.ToString()),
                                           () => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, secondCurrObjCrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjCrType, secondCurrObj.creditObject.TrnRefNo.ToString()),
                                            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, firstCurrObjDrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjDrType, firstCurrObj.debitObject.TrnRefNo.ToString()),
                                            () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, secondCurrObjDrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjDrType, secondCurrObj.debitObject.TrnRefNo.ToString()),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, secondCurrObjCrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.creditObject.TrnRefNo.ToString(), secCurrObjCrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, firstCurrObjCrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.creditObject.TrnRefNo.ToString(), firstCurrObjCrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, secondCurrObjDrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), secCurrObjDrType),
                                            () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, firstCurrObjDrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), firstCurrObjDrType)
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

                    Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, firstCurrObjDrWM.UserID.ToString(), ChargefirstCur.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, secondCurrObjDrWM.UserID.ToString(), ChargesecondCur.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                  () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2),
                    () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationDrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2));
                }
                #endregion

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreditNotificationSend" + "TimeStamp:" + timestamp, "WalletService", ex);

                //throw ex;
            }
        }
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

        public async Task<WalletDrCrResponse> GetLPArbitrageWalletCreditDrForHoldNewAsyncFinal(ArbitrageCommonClassCrDr firstCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal)
        {
            try
            {
                ArbitrageWalletTransactionQueue tqObj;
                //WalletTransactionQueue firstCurrObjTQDr, secondCurrObjTQDr, tqObj;
                //WalletTransactionQueue firstCurrObjTQ, secondCurrObjTQ;
                //WalletTransactionOrder firstCurrObjTO, secondCurrObjTO;
                // TransactionAccount firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA;
                // WalletLedger firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL;
                ArbitrageWalletMaster firstCurrObjCrWM, firstCurrObjDrWM;
                LPArbitrageWalletMaster LPCurrObjCrWM;

                // string remarksFirstDr, remarksFirstCr, remarksSecondDr, remarksSecondCr;
                ArbitrageWalletTypeMaster walletTypeFirstCurr, walletTypeSecondCurr;
                //bool CheckUserCrBalanceFlag = false;
                //bool CheckUserDrBalanceFlag = false;
                //bool CheckUserCrBalanceFlag1 = false;
                //bool CheckUserDrBalanceFlag1 = false;
                // enErrorCode enErrorCodefirst, enErrorCodeSecond;
                bool checkDebitRefNo, checkDebitRefNo1;
                //MemberShadowBalance FirstDebitShadowWallet, SecondDebitShadowWallet;
                Task<bool> checkDebitRefNoTask;
                Task<bool> checkDebitRefNoTask1;
                //BizResponseClass bizResponseClassFC, bizResponseClassSC;

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetLPArbitrageWalletCreditDrForHoldNewAsyncFinal first currency", "WalletService", "timestamp:" + timestamp + Helpers.JsonSerialize(firstCurrObj)));
                //Task.Run(() => HelperForLog.WriteLogIntoFile("GetLPArbitrageWalletCreditDrForHoldNewAsyncFinal second currency", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + secondCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + secondCurrObj.debitObject.TrnRefNo.ToString() + ",Amount=" + secondCurrObj.Amount + ",Coin=" + secondCurrObj.Coin + ", CR WalletID=" + secondCurrObj.creditObject.WalletId + ",Dr WalletID=" + secondCurrObj.debitObject.WalletId + " cr full settled=" + secondCurrObj.creditObject.isFullSettled.ToString() + ",Dr full settled=" + secondCurrObj.debitObject.isFullSettled.ToString() + ",Dr MarketTrade" + secondCurrObj.debitObject.isMarketTrade));

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
                var firstCurrObjCrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == firstCurrObj.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                var LPCurrObjCrWMTask = _LPArbitrageWallet.GetSingleAsync(item => item.Id == firstCurrObj.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                //if (firstCurrObj.debitObject.isMarketTrade == 1)
                //{
                //    checkDebitRefNoTask = _walletRepository1.CheckTrnIDDrForMarketAsync(firstCurrObj);
                //}
                //else
                //{
                //checkDebitRefNoTask = _ArbitrageWalletRepository.CheckTrnIDDrForHoldAsync(firstCurrObj);
                //}
                //2019-2-18 added condi for only used trading wallet
                //var firstCurrObjDrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == firstCurrObj.debitObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                //// to solve second operation started error solving 04-03-2019 ntrivedi await before query in same repository
                //checkDebitRefNo = await checkDebitRefNoTask;
                //if (checkDebitRefNo == false)//fail
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType, enErrorCode.InvalidTradeRefNoFirCur);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                //if (secondCurrObj.debitObject.isMarketTrade == 1)
                //{
                //    checkDebitRefNoTask1 = _walletRepository1.CheckTrnIDDrForMarketAsync(secondCurrObj);
                //}
                //else
                //{
                //checkDebitRefNoTask1 = _ArbitrageWalletRepository.CheckTrnIDDrForHoldAsync(secondCurrObj);
                ////}
                ////2019-2-18 added condi for only used trading wallet
                //var secondCurrObjCrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == secondCurrObj.creditObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                ////Task<MemberShadowBalance> FirstDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == firstCurrObj.creditObject.WalletId);
                ////2019-2-18 added condi for only used trading wallet
                //var secondCurrObjDrWMTask = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == secondCurrObj.debitObject.WalletId && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));

                //Task<MemberShadowBalance> SecondDebitShadowWalletTask = _ShadowBalRepo.GetSingleAsync(e => e.WalletID == secondCurrObj.creditObject.WalletId);

                //Task<bool> CheckUserCrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.creditObject.WalletId);
                Task<ArbitrageWalletTypeMaster> walletTypeFirstCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == firstCurrObj.Coin);
                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //CheckUserCrBalanceFlag = await CheckUserCrBalanceFlagTask;
                //if (!CheckUserCrBalanceFlag)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.creditObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<bool> CheckUserDrBalanceFlagTask = CheckUserBalanceAsync(firstCurrObj.Amount, firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                Task<ArbitrageWalletTypeMaster> walletTypeSecondCurrTask = _WalletTypeMasterRepository.GetSingleAsync(e => e.WalletTypeName == firstCurrObj.HoldCoin);
                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //CheckUserDrBalanceFlag = await CheckUserDrBalanceFlagTask;
                //if (!CheckUserDrBalanceFlag)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.debitObject.WalletId, firstCurrObj.Coin, firstCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //Task<bool> CheckUserCrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask = _walletRepository1.CheckUserBalanceV1Async(firstCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);
                //Task<bool> CheckUserCrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.creditObject.WalletId);
                //Task<bool> CheckUserDrBalanceFlagTask1 = _walletRepository1.CheckUserBalanceV1Async(secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);

                //Task<bool> CheckUserCrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.creditObject.WalletId);

                //firstCurrObjCrWM = await firstCurrObjCrWMTask;
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;

                //CheckUserCrBalanceFlag1 = await CheckUserCrBalanceFlagTask1;
                //if (!CheckUserCrBalanceFlag1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.debitObject.WalletId, secondCurrObj.Coin, secondCurrObj.debitObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchCrWalletSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<bool> CheckUserDrBalanceFlagTask1 = CheckUserBalanceAsync(secondCurrObj.Amount, secondCurrObj.debitObject.WalletId, enBalanceType.OutBoundBalance);


                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("GetWalletCreditDrForHoldNewAsyncFinal before await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.TrnRefNo.ToString()));


                firstCurrObjCrWM = await firstCurrObjCrWMTask;
                if (firstCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, firstCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, firstCurrObj.trnType, enErrorCode.FirstCurrCrWalletNotFound);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                LPCurrObjCrWM = await LPCurrObjCrWMTask;
                if (LPCurrObjCrWM == null)
                {
                    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjCrWM.Id, firstCurrObj.Coin, firstCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, firstCurrObj.trnType, enErrorCode.FirstCurrCrWalletNotFound);
                    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.InvalidArbitarageWallet, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                }
                #region MyRegionComment
                //firstCurrObj.creditObject.UserID = firstCurrObjCrWM.UserID;

                //firstCurrObjDrWM = await firstCurrObjDrWMTask;
                //if (firstCurrObjDrWM == null)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, secondCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.FirstCurrDrWalletNotFound);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}
                //firstCurrObj.debitObject.UserID = firstCurrObjDrWM.UserID;
                //Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after await1", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));
                //secondCurrObjCrWM = await secondCurrObjCrWMTask;
                //if (secondCurrObjCrWM == null)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjCrWM.Id, secondCurrObj.Coin, secondCurrObjCrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.SecondCurrCrWalletNotFound);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrCrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}
                //secondCurrObj.creditObject.UserID = secondCurrObjCrWM.UserID;

                //secondCurrObjDrWM = await secondCurrObjDrWMTask;
                //if (secondCurrObjDrWM == null)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.WalletNotMatch, secondCurrObj.debitObject.trnType, enErrorCode.SecondCurrDrWalletNotFound);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrDrWalletNotFound, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}
                //secondCurrObj.debitObject.UserID = secondCurrObjDrWM.UserID;
                #endregion                                         

                Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.TrnRefNo.ToString()));

                #region MyRegionComment1
                //checkDebitRefNo = await checkDebitRefNoTask;
                //if (checkDebitRefNo == false)//fail
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObj.creditObject.WalletId, firstCurrObj.Coin, firstCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", firstCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoFirCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                //checkDebitRefNo1 = await checkDebitRefNoTask1;
                //if (checkDebitRefNo1 == false)//fail
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, "Amount and DebitRefNo matching failure", secondCurrObj.creditObject.trnType, enErrorCode.InvalidTradeRefNoSecCur);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);

                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNo, ErrorCode = enErrorCode.InvalidTradeRefNoSecCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                //market trade comment 11-06-2019
                //if (firstCurrObj.debitObject.isMarketTrade == 1 && firstCurrObj.debitObject.differenceAmount > 0)
                //{
                //    if (firstCurrObjDrWM.Balance < firstCurrObj.debitObject.differenceAmount)
                //    {
                //        // insert with status=2 system failed
                //        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckFirstCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //    }
                //    bizResponseClassFC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(firstCurrObjDrWM, timestamp, serviceType, firstCurrObj.debitObject.differenceAmount, firstCurrObj.Coin, allowedChannels, firstCurrObjDrWM.WalletTypeID, firstCurrObj.debitObject.WTQTrnNo, firstCurrObj.debitObject.WalletId, firstCurrObj.debitObject.UserID, enTrnType.Buy_Trade, firstCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                //    if (bizResponseClassFC.ReturnCode != enResponseCode.Success)
                //    {
                //        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.FirstCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //    }
                //}
                //if (secondCurrObj.debitObject.isMarketTrade == 1 && secondCurrObj.debitObject.differenceAmount > 0)
                //{
                //    if (secondCurrObjDrWM.Balance < secondCurrObj.debitObject.differenceAmount)
                //    {
                //        // insert with status=2 system failed
                //        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientMarketInternalBalanceCheckSecondCurrencyForDifferentialAmountFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //    }
                //    bizResponseClassSC = _walletSPRepositories.Callsp_HoldWallet_MarketTrade(secondCurrObjDrWM, timestamp, serviceType, secondCurrObj.debitObject.differenceAmount, secondCurrObj.Coin, allowedChannels, secondCurrObjDrWM.WalletTypeID, secondCurrObj.debitObject.WTQTrnNo, secondCurrObj.debitObject.WalletId, secondCurrObj.debitObject.UserID, enTrnType.Buy_Trade, secondCurrObj.debitObject.trnType, enWalletDeductionType.Market);
                //    if (bizResponseClassSC.ReturnCode != enResponseCode.Success)
                //    {
                //        tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //        tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //        return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.SecondCurrDifferentialAmountHoldFailed, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //    }
                //}
                //Task<WalletTransactionQueue> firstCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(firstCurrObj.debitObject.WTQTrnNo);
                //Task<WalletTransactionQueue> secondCurrObjTQDrTask = _walletRepository1.GetTransactionQueueAsync(secondCurrObj.debitObject.WTQTrnNo);

                #endregion

                Task.Run(() => HelperForLog.WriteLogIntoFile("LPGetWalletCreditDrForHoldNewAsyncFinal after await2", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.TrnRefNo.ToString()));

                if (firstCurrObj.Coin == string.Empty || firstCurrObj.HoldCoin == string.Empty)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidWalletOrUserIDorCoinName }, "Credit");
                }
                if (firstCurrObj.Amount <= 0 || firstCurrObj.HoldAmount <= 0) // ntrivedi amount -ve check
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidAmt, ErrorCode = enErrorCode.InvalidAmt }, "Credit");
                }
                if (firstCurrObj.TrnRefNo == 0 )
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNoCr, ErrorCode = enErrorCode.InvalidTradeRefNoCr }, "Credit");
                }
                //if (firstCurrObj.debitObject.TrnRefNo == 0 || secondCurrObj.debitObject.TrnRefNo == 0)
                //{
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidTradeRefNoDr, ErrorCode = enErrorCode.InvalidTradeRefNoDr }, "Debit");
                //}
                walletTypeFirstCurr = await walletTypeFirstCurrTask;
                walletTypeSecondCurr = await walletTypeSecondCurrTask;

                if (walletTypeFirstCurr == null || walletTypeSecondCurr == null)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidReq, ErrorCode = enErrorCode.InvalidCoinName }, "Credit");
                }

                //firstCurrObjDrWM = _ArbitrageWalletMaster.FindBy(x => x.WalletTypeID == walletTypeSecondCurr.Id && x.UserID == firstCurrObj.UserID).Single();


                //bool flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.creditObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(firstCurrObj.debitObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.creditObject.WalletId);
                //flag = _walletRepository1.CheckUserBalanceV1(secondCurrObj.debitObject.WalletId);

                Task.Run(() => HelperForLog.WriteLogIntoFileAsync("LPGetArbitrageWalletCreditDrForHoldNewAsyncFinal before await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.TrnRefNo.ToString()));

                #region Comment3
                //Task<enErrorCode> enErrorCodeTaskfirst = _commonWalletFunction.CheckShadowLimitAsync(firstCurrObjDrWM.Id, firstCurrObj.Amount);
                //enErrorCodefirst = await enErrorCodeTaskfirst;
                //if (enErrorCodefirst != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}
                //if (firstCurrObjDrWM.OutBoundBalance < firstCurrObj.Amount) // ntrivedi checking outbound balance
                //{
                //    // insert with status=2 system failed
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType, enErrorCode.InsufficientOutgoingBalFirstCur);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficientOutgoingBalFirstCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //Task<enErrorCode> enErrorCodeTaskSecond = _commonWalletFunction.CheckShadowLimitAsync(secondCurrObjDrWM.Id, secondCurrObj.Amount);
                //enErrorCodeSecond = await enErrorCodeTaskSecond;
                //if (enErrorCodeSecond != enErrorCode.Success)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, firstCurrObj.Amount, firstCurrObj.debitObject.TrnRefNo, UTC_To_IST(), null, firstCurrObjDrWM.Id, firstCurrObj.Coin, firstCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, firstCurrObj.debitObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficantBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg }, "Credit");
                //}

                //if (secondCurrObjDrWM.OutBoundBalance < secondCurrObj.Amount)// ntrivedi checking outbound balance
                //{
                //    // insert with status=2 system failed
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType, enErrorCode.InsufficietOutgoingBalSecondCur);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InsufficantBal, ErrorCode = enErrorCode.InsufficietOutgoingBalSecondCur, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //if (firstCurrObjDrWM.Status != 1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType, enErrorCode.FirstCurrWalletStatusDisable);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.FirstCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                //if (secondCurrObjDrWM.Status != 1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Debit, secondCurrObj.Amount, secondCurrObj.debitObject.TrnRefNo, Helpers.UTC_To_IST(), null, secondCurrObjDrWM.Id, secondCurrObj.Coin, secondCurrObjDrWM.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.InsufficantBal, secondCurrObj.debitObject.trnType, enErrorCode.SecondCurrWalletStatusDisable);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.SecondCurrWalletStatusDisable, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}


                //CheckUserDrBalanceFlag1 = await CheckUserDrBalanceFlagTask1;
                //if (!CheckUserDrBalanceFlag1)
                //{
                //    tqObj = InsertIntoWalletTransactionQueue(Guid.NewGuid(), enWalletTranxOrderType.Credit, secondCurrObj.Amount, secondCurrObj.creditObject.TrnRefNo, UTC_To_IST(), null, secondCurrObj.creditObject.WalletId, secondCurrObj.Coin, secondCurrObj.creditObject.UserID, timestamp, enTransactionStatus.SystemFail, EnResponseMessage.BalMismatch, secondCurrObj.creditObject.trnType);
                //    tqObj = _WalletTQInsert.AddIntoArbitrageWalletTransactionQueue(tqObj, 1);
                //    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = EnResponseMessage.InvalidWallet, ErrorCode = enErrorCode.CrDrCredit_SettledBalMismatchDrWalletSecDr, TrnNo = tqObj.TrnNo, Status = tqObj.Status, StatusMsg = tqObj.StatusMsg, TimeStamp = timestamp }, "Credit");
                //}

                // Task.Run(() => HelperForLog.WriteLogIntoFile("GetArbitrageWalletCreditDrForHoldNewAsyncFinal after await3", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.creditObject.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.debitObject.TrnRefNo.ToString()));


                #endregion

                
                Task.Run(() => HelperForLog.WriteLogIntoFile("LPGetArbitrageWalletCreditDrForHoldNewAsyncFinal before Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.TrnRefNo.ToString()));

                //bool flag = await _walletRepository1.WalletCreditDebitwithTQTestFinal(firstCurrObjTQ, secondCurrObjTQ, secondCurrObjTO, firstCurrObjTO, FirstDebitShadowWallet, SecondDebitShadowWallet, firstCurrObjTQDr, secondCurrObjTQDr, firstCurrObj, secondCurrObj, firstCurrObjCrWL, firstCurrObjDrWL, secondCurrObjCrWL, secondCurrObjDrWL, firstCurrObjCrTA, firstCurrObjDrTA, secondCurrObjDrTA, secondCurrObjCrTA);
                BizResponseClass bizResponse = _walletSPRepositories.Callsp_LPArbitrageCrDrWalletForHold(firstCurrObj, timestamp, serviceType, walletTypeFirstCurr.Id, walletTypeSecondCurr.Id, (long)allowedChannels);

                _ArbitrageWalletRepository.ReloadEntitySingle(firstCurrObjCrWM,LPCurrObjCrWM);

                if (bizResponse.ReturnCode != enResponseCode.Success)
                {
                    return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Fail, ReturnMsg = bizResponse.ReturnMsg, ErrorCode = bizResponse.ErrorCode, TrnNo = 0, Status = enTransactionStatus.Initialize, StatusMsg = bizResponse.ReturnMsg, TimeStamp = timestamp }, "Credit");
                }
                decimal ChargefirstCur = 0, ChargesecondCur = 0;
                //ntrivedi added for try catch 05-03-2019 11-06-2019
                try
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal before WaitAll", "WalletService", "timestamp:" + timestamp));
                    Task.WaitAll();
                    Task.Run(() => HelperForLog.WriteLogIntoFile("GetWalletCreditDrForHoldNewAsyncFinal after WaitAll", "WalletService", "timestamp:" + timestamp));
                    ChargefirstCur = _ArbitrageWalletRepository.FindChargeValueDeduct(timestamp, firstCurrObj.TrnRefNo);
                    //ChargesecondCur = _ArbitrageWalletRepository.FindChargeValueDeduct(timestamp, firstCurrObj.TrnRefNo);
                    //secondCurrObj.debitObject.Charge = ChargesecondCur;
                    firstCurrObj.Charge = ChargefirstCur;
                }
                catch (Exception ex1)
                {
                    HelperForLog.WriteErrorLog("GetWalletCreditDrForHoldNewAsyncFinal charge exception  Timestamp" + timestamp, this.GetType().Name, ex1);
                }

                Task.Run(() => HelperForLog.WriteLogIntoFile("LPGetArbitrageWalletCreditDrForHoldNewAsyncFinal after Wallet operation", "WalletService", "timestamp:" + timestamp + " ,Cr TrnNo=" + firstCurrObj.TrnRefNo.ToString() + ", Dr TrnNo=" + firstCurrObj.TrnRefNo.ToString()));

                Task.Run(() => LPCreditDebitNotificationSend(timestamp, firstCurrObj, firstCurrObjCrWM, firstCurrObjCrWM, ChargefirstCur, ChargesecondCur));

                Task.Run(() => HelperForLog.WriteLogIntoFile("LPGetArbitrageWalletCreditDrForHoldNewAsyncFinal:Without Token done", "WalletService", ",timestamp =" + timestamp));
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.Success, ReturnMsg = EnResponseMessage.SuccessCredit, ErrorCode = enErrorCode.Success, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LPGetArbitrageLPWalletCreditDrForHoldNewAsyncFinal Timestamp" + timestamp, this.GetType().Name, ex);
                return GetCrDRResponse(new WalletDrCrResponse { ReturnCode = enResponseCode.InternalError, ReturnMsg = EnResponseMessage.InternalError, ErrorCode = enErrorCode.InternalError, TrnNo = 0, Status = 0, StatusMsg = "", TimeStamp = timestamp }, "GetWalletCreditDrForHoldNewAsyncFinal");
                //throw ex;
            }
        }
        #endregion

        #region Withdraw 

        public ArbitrageWithdrawRes ArbitrageWithdraw(ArbitrageWithdrawReq Req, long UserId)
        {
            ArbitrageWithdrawRes Resp = new ArbitrageWithdrawRes();
            Resp.TransactionId = "";
            short IsTxnProceed = 0;
            try
            {
                var WalletTypeObj = _WalletTypeMasterRepository.GetSingle(i => i.WalletTypeName == Req.SMSCode && i.Status == 1);
                if (WalletTypeObj == null)
                {
                    Resp.ErrorCode = enErrorCode.InvalidWalletType;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidWalletType;
                    return Resp;
                }
                var ServiceObj = _ServiceMasterArbitrage.GetSingle(i => i.WalletTypeID ==WalletTypeObj.Id && i.Status == 1);
                if (ServiceObj == null)
                {
                    Resp.ErrorCode = enErrorCode.NotFound;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.NotFound;
                    return Resp;
                }
                var AddressObj = _ArbitrageLPAddressMaster.GetSingle(i => i.SerProID == Req.ToServiceProviderId && i.Status == 1 && i.Address == Req.Address && i.WalletTypeId == WalletTypeObj.Id);
                if (AddressObj == null)
                {
                    Resp.ErrorCode = enErrorCode.InvalidAddress;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidAddress;
                    return Resp;
                }
                if (Req.Amount <= 0)
                {
                    Resp.ErrorCode = enErrorCode.InvalidAmt;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.InvalidAmt;
                    return Resp;
                }
                var TQObj = _TransactionQueueArbitrage.GetSingle(i => i.TransactionAccount == Req.Address && i.Amount == Req.Amount && i.TrnDate.AddMinutes(10) > Helpers.UTC_To_IST() && (i.Status == Convert.ToInt16(enTransactionStatus.Hold) || i.Status == Convert.ToInt16(enTransactionStatus.Success)));
                if (TQObj != null)
                {
                    Resp.ErrorCode = enErrorCode.CreateTrnDuplicateTrn;
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ReturnMsg = EnResponseMessage.CreateTrnDuplicateTrnMsg;
                    return Resp;
                }

                var Newtransaction = new TransactionQueueArbitrage()
                {
                    TrnDate = Helpers.UTC_To_IST(),
                    GUID = Guid.NewGuid(),
                    TrnMode = 21,
                    TrnType = Convert.ToInt16(enTrnType.Withdraw),
                    MemberID = UserId,
                    MemberMobile = "",
                    TransactionAccount = Req.Address,
                    SMSCode = Req.SMSCode.ToUpper(),
                    Amount = Req.Amount,
                    Status = 0,
                    StatusCode = 0,
                    StatusMsg = "Initialize",
                    TrnRefNo = "",
                    AdditionalInfo = "",
                    DebitAccountID = "",
                    IsInternalTrn = 2,
                    EmailSendDate = Helpers.UTC_To_IST(),
                    IsVerifiedByAdmin = 0,
                    ServiceID= ServiceObj.Id
                };
                Newtransaction = _TransactionQueueArbitrage.Add(Newtransaction);

                Resp = CallWithdrawAPI(Newtransaction, Req, UserId);
                return Resp;
            }
            catch (Exception ex)
            {
                if (IsTxnProceed == 0)
                {
                    Resp.ReturnMsg = "Error occured";
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_APICallInternalError;
                }
                else
                {
                    Resp.ReturnMsg = "Hold";
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_Hold;
                }
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ArbitrageWithdrawRes CallWithdrawAPI(TransactionQueueArbitrage Newtransaction, ArbitrageWithdrawReq Req, long UserId)
        {
            short IsTxnProceed = 0;
            ArbitrageWithdrawRes Resp = new ArbitrageWithdrawRes();
            try
            {
                var TxnProviderListResult = _ArbitrageWalletRepository.ArbitrageGetProviderDataList(new ArbitrageTransactionApiConfigurationRequest { amount = Req.Amount, SMSCode = Req.SMSCode, APIType = enWebAPIRouteType.TransactionAPI, trnType = Convert.ToInt32(enTrnType.Withdraw) }).GetAwaiter().GetResult();
                if (TxnProviderListResult.Count == 0)
                {
                    Newtransaction.StatusMsg = "OperatorFail";
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.ProcessTrn_OprFail);
                    Newtransaction.Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
                    _TransactionQueueArbitrage.Update(Newtransaction);

                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_OprFail;
                    Resp.ReturnMsg = "Fail";
                    return Resp;
                }

                ArbitrageDepositFund WH = new ArbitrageDepositFund();
                WH.SMSCode = Req.SMSCode.ToUpper();
                WH.TrnID = "";
                WH.Address = Req.Address;
                WH.ToAddress = "";
                WH.Amount = Req.Amount;
                WH.Status = 0;
                WH.CreatedDate = Helpers.UTC_To_IST();
                WH.IsProcessing = 0;
                WH.TrnNo = Newtransaction.Id;
                WH.RouteTag = TxnProviderListResult[0].RouteName;
                WH.UserId = UserId;
                WH.FromSerProId = Req.FromServiceProviderId;
                WH.ToserProId = Req.ToServiceProviderId;
                WH.TrnDate = Helpers.UTC_To_IST();
                WH.SystemRemarks = "Initial entry Created";
                WH.ProviderWalletID = "";
                WH.ApprovedBy = UserId;
                WH.ApprovedDate = Helpers.UTC_To_IST();

                WH = _ArbitrageDepositFund.Add(WH);

                if (TxnProviderListResult[0].IsAdminApprovalRequired == 1)
                {
                    Newtransaction.IsVerifiedByAdmin = 0;
                    Newtransaction.Status = 6;
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.WithdrawalReqSentToAdmin);
                    Newtransaction.StatusMsg = "Waiting For Admin Approval";
                    _TransactionQueueArbitrage.Update(Newtransaction);

                    Resp.ErrorCode = enErrorCode.WithdrawalReqSentToAdmin;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = "Waiting For Admin Approval";
                    return Resp;
                }
                Newtransaction.IsVerifiedByAdmin = 1;
                _TransactionQueueArbitrage.Update(Newtransaction);



                var ThirdPartyAPIRequestObj = _IGetWebRequest.ArbitrageMakeWebRequest(TxnProviderListResult[0].RouteID, TxnProviderListResult[0].ThirPartyAPIID, TxnProviderListResult[0].SerProDetailID, Newtransaction);
                if (ThirdPartyAPIRequestObj == null)
                {
                    Newtransaction.StatusMsg = "OperatorFail";
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.ProcessTrn_OprFail);
                    Newtransaction.Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
                    _TransactionQueueArbitrage.Update(Newtransaction);

                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_OprFail;
                    Resp.ReturnMsg = "Fail";
                    return Resp;
                }
                var NewtransactionReq = new ArbitrageTransactionRequest()
                {
                    TrnNo = Newtransaction.Id,
                    ServiceID = TxnProviderListResult[0].ServiceID,
                    SerProID = TxnProviderListResult[0].ServiceProID,
                    SerProDetailID = TxnProviderListResult[0].SerProDetailID,
                    CreatedDate = Helpers.UTC_To_IST(),
                    RequestData = ThirdPartyAPIRequestObj.RequestURL + "::" + ThirdPartyAPIRequestObj.RequestBody
                };
                NewtransactionReq = _ArbitrageTransactionRequest.Add(NewtransactionReq);

                var APIResponse = _IWebApiSendRequest.SendAPIRequestAsync(ThirdPartyAPIRequestObj.RequestURL, ThirdPartyAPIRequestObj.RequestBody, "application/json", 30000, ThirdPartyAPIRequestObj.keyValuePairsHeader, "POST");
                //var APIResponse= "{\"success\":1,\"message\":\"\",\"return\":\"success\",\"data\":{\"transfer\":{\"id\":\"5c3884d82ce26c3607419c6d232b23e7\",\"coin\":\"fun\",\"wallet\":\"5ae6fce3cee2f9225448f44cf9154900\",\"enterprise\":\"5a79359692f6f738073dffcbbb0c22df\",\"txid\":\"0x54719f9f90d2f1f428dc8bb6fe2b2b44a199b3505bfaea493c890e9217e963f4\",\"height\":999999999,\"date\":\"2019-01-11T11:58:16.718Z\",\"type\":\"send\",\"value\":0,\"valueString\":\"0\",\"feeString\":\"0\",\"payGoFee\":0,\"payGoFeeString\":\"0\",\"usd\":0,\"usdRate\":0,\"state\":\"signed\",\"instant\":false,\"tags\":[\"5ae6fce3cee2f9225448f44cf9154900\",\"5a79359692f6f738073dffcbbb0c22df\"],\"history\":[{\"date\":\"2019-01-11T11:58:16.717Z\",\"action\":\"signed\"},{\"date\":\"2019-01-11T11:58:16.324Z\",\"action\":\"created\"}],\"entries\":[{\"address\":\"0xe6b8b5c49d83619e91a57d50d169eabee8f91f6b\",\"wallet\":\"5ae6fce3cee2f9225448f44cf9154900\",\"value\":-100000000,\"valueString\":\"-100000000\"},{\"address\":\"0x65b8e3c2b429bf912d9d2109539b48dada560845\",\"wallet\":\"5ae6fce3cee2f9225448f44cf9154900\",\"value\":100000000,\"valueString\":\"100000000\"}],\"signedTime\":\"2019-01-11T11:58:16.717Z\",\"createdTime\":\"2019-01-11T11:58:16.324Z\"},\"txid\":\"0x54719f9f90d2f1f428dc8bb6fe2b2b44a199b3505bfaea493c890e9217e963f4\",\"tx\":\"f901ad82138d850271d949008307a12094e6b8b5c49d83619e91a57d50d169eabee8f91f6b80b901440dcd7a6c00000000000000000000000065b8e3c2b429bf912d9d2109539b48dada5608450000000000000000000000000000000000000000000000000000000005f5e100000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b000000000000000000000000000000000000000000000000000000005c41bf5700000000000000000000000000000000000000000000000000000000000000d500000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000041bbfb7cf470f92413718e938394c672aa315411b3b57da9616463f6ea12aa82a3596b84c9f2b1a3c5df1406a8ec692043d0b4b5deacb4f6c9dbb2cbdad236921d1b000000000000000000000000000000000000000000000000000000000000001ba0553ecde8e6ef68751a9e45952d4789a2c6550345420ef22b2848d0a26b914c98a006b1d3a7a9b2820a38157a621fbc16e885e1959db59ca85297af03bb9b3ea820\",\"status\":\"signed\"}}";

                if (APIResponse == null)
                {
                    IsTxnProceed = 1;
                    Newtransaction.StatusMsg = "Hold";
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.ProcessTrn_GettingResponseBlank);
                    Newtransaction.Status = Convert.ToInt16(enErrorCode.ProcessTrn_Hold);
                    _TransactionQueueArbitrage.Update(Newtransaction);

                    Resp.ErrorCode = enErrorCode.ProcessTrn_GettingResponseBlank;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.ProcessTrn_HoldMsg;
                    return Resp;
                }
                NewtransactionReq.ResponseData = APIResponse;
                NewtransactionReq.ResponseTime = Helpers.UTC_To_IST();
                _ArbitrageTransactionRequest.Update(NewtransactionReq);

                var parseResponse = _WebApiParseResponseObj.ArbitrageTransactionParseResponse(APIResponse, TxnProviderListResult[0].ThirPartyAPIID);
                if (parseResponse == null)
                {
                    IsTxnProceed = 1;
                    Newtransaction.StatusMsg = "Hold";
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.ProcessTrn_GettingResponseBlank);
                    Newtransaction.Status = Convert.ToInt16(enErrorCode.ProcessTrn_Hold);
                    _TransactionQueueArbitrage.Update(Newtransaction);

                    Resp.ErrorCode = enErrorCode.ProcessTrn_GettingResponseBlank;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = EnResponseMessage.ProcessTrn_HoldMsg;
                    return Resp;
                }
                Resp.TransactionId = parseResponse.TrnRefNo;
                NewtransactionReq.TrnID = Resp.TransactionId;
                _ArbitrageTransactionRequest.Update(NewtransactionReq);

                if ((parseResponse.Status == enTransactionStatus.Success) || (parseResponse.Status == enTransactionStatus.Hold))
                {
                    WH.TrnID = Resp.TransactionId;
                    WH.Status = 6;
                    WH.SystemRemarks = "Process entry";
                    _ArbitrageDepositFund.Update(WH);
                }
                else
                {
                    WH.TrnID = Resp.TransactionId;
                    WH.Status = 2;
                    WH.SystemRemarks = "Fail";
                    _ArbitrageDepositFund.Update(WH);
                }
                if (parseResponse.Status == enTransactionStatus.Success)
                {
                    Newtransaction.StatusMsg = "Success";
                    Newtransaction.Status = Convert.ToInt16(enTransactionStatus.Success);
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.WithdrwalOutsideTransactionSuccess);
                    _TransactionQueueArbitrage.Update(Newtransaction);
                    IsTxnProceed = 1;//no further call next API
                    Resp.ReturnMsg = "Transaction Confirm Success.";
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ErrorCode = enErrorCode.Withdrwal_TransactionConfirmSuccess;
                }
                else if (parseResponse.Status == enTransactionStatus.OperatorFail)
                {
                    Newtransaction.StatusMsg = "OperatorFail";
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.ProcessTrn_OprFail);
                    Newtransaction.Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
                    _TransactionQueueArbitrage.Update(Newtransaction);
                }
                else
                {
                    Newtransaction.Status = Convert.ToInt16(enTransactionStatus.Hold);
                    Newtransaction.StatusMsg = "Hold";
                    Newtransaction.StatusCode = Convert.ToInt16(enErrorCode.ProcessTrn_Hold);
                    _TransactionQueueArbitrage.Update(Newtransaction);
                    Resp.ErrorCode = enErrorCode.ProcessTrn_Hold;
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ReturnMsg = "Hold";
                    IsTxnProceed = 1;
                }
                if (IsTxnProceed == 0)
                {
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_OprFail;
                    Resp.ReturnMsg = "Fail";
                    Newtransaction.StatusMsg = "OperatorFail";
                    Newtransaction.Status = Convert.ToInt16(enTransactionStatus.OperatorFail);
                    Newtransaction.StatusCode = Convert.ToInt64(enErrorCode.ProcessTrn_OprFail);
                    _TransactionQueueArbitrage.Update(Newtransaction);
                }
                return Resp;
            }
            catch (Exception ex)
            {
                if (IsTxnProceed == 0)
                {
                    Resp.ReturnMsg = "Error occured";
                    Resp.ReturnCode = enResponseCode.Fail;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_APICallInternalError;
                }
                else
                {
                    Resp.ReturnMsg = "Hold";
                    Resp.ReturnCode = enResponseCode.Success;
                    Resp.ErrorCode = enErrorCode.ProcessTrn_Hold;
                }
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public ListArbitrageTopUpHistory TopUpHistory(int PageNo, int PageSize, string Address, string CoinName, long? FromServiceProviderId, long? ToServiceProviderId, string TrnId, DateTime? FromDate, DateTime? ToDate, long UserId, short? Status)
        {
            try
            {
                ListArbitrageTopUpHistory resp = new ListArbitrageTopUpHistory();
                int TotalCount = 0;
                resp.PageNo = PageNo;
                resp.PageSize = PageSize;
                var data = _ArbitrageWalletRepository.TopUpHistory(PageNo + 1, PageSize, UserId, Status, Address, CoinName, FromServiceProviderId, ToServiceProviderId, TrnId, FromDate, ToDate, ref TotalCount);
                resp.TotalCount = TotalCount;
                if (data.Data.Count == 0)
                {
                    resp.Data = new List<ArbitrageTopUpHistory>();
                    resp.ReturnCode = enResponseCode.Fail;
                    resp.ReturnMsg = EnResponseMessage.NotFound;
                    resp.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    resp.Data = data.Data;
                    resp.ReturnCode = enResponseCode.Success;
                    resp.ReturnMsg = EnResponseMessage.FindRecored;
                    resp.ErrorCode = enErrorCode.Success;
                }
                return resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        #endregion

        //Rita 12-06-19
        public async Task<long> GetWalletID(string AccWalletID)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                Task<ArbitrageWalletMaster> obj1 = _ArbitrageWalletMaster.GetSingleAsync(item => item.AccWalletID == AccWalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                ArbitrageWalletMaster obj = await obj1;
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

        //Rita 12-06-19
        public async Task<string> GetAccWalletID(long WalletID)
        {
            try
            {
                //2019-2-18 added condi for only used trading wallet
                Task<ArbitrageWalletMaster> obj1 = _ArbitrageWalletMaster.GetSingleAsync(item => item.Id == WalletID && item.WalletUsageType == Convert.ToInt16(EnWalletUsageType.Trading_Wallet));
                ArbitrageWalletMaster obj = await obj1;
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

        public async Task WalletHoldNotificationSend(string timestamp, ArbitrageWalletMaster dWalletobj, string coinName, decimal amount, long TrnRefNo, byte routeTrnType, decimal charge, long walletId, ArbitrageWalletMaster WalletlogObj, ArbitrageWalletTypeMaster DeductCoinName)
        {
            try
            {
                #region EMAIL_SMS
                WalletMasterResponse walletMasterObj = new WalletMasterResponse();
                walletMasterObj.AccWalletID = dWalletobj.AccWalletID;
                walletMasterObj.Balance = dWalletobj.Balance;
                walletMasterObj.WalletName = dWalletobj.WalletName;
                walletMasterObj.PublicAddress = "";
                walletMasterObj.IsDefaultWallet = dWalletobj.IsDefaultWallet;
                walletMasterObj.CoinName = coinName;
                walletMasterObj.OutBoundBalance = dWalletobj.OutBoundBalance;

                ActivityNotificationMessage ActivityNotification = new ActivityNotificationMessage();
                ActivityNotification.MsgCode = Convert.ToInt32(enErrorCode.HoldBalanceNotification);
                ActivityNotification.Param1 = coinName;
                ActivityNotification.Param2 = amount.ToString();
                ActivityNotification.Param3 = TrnRefNo.ToString();
                ActivityNotification.Type = Convert.ToInt16(EnNotificationType.Info);

                HelperForLog.WriteLogIntoFileAsync("WalletHoldNotificationSend", "OnWalletBalChange + SendActivityNotificationV2Arbitrage pre timestamp=" + timestamp.ToString());

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotification, dWalletobj.UserID.ToString(), 2),
                    () => _signalRService.OnWalletBalChange(walletMasterObj, coinName, dWalletobj.UserID.ToString(), 2),

                    () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, dWalletobj.UserID.ToString(), null, null, null, null, coinName, routeTrnType.ToString(), TrnRefNo.ToString()),
                    () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, dWalletobj.UserID.ToString(), amount.ToString(), coinName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString()));

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
                    walletMasterObjCharge.WalletName = WalletlogObj.WalletName;
                    walletMasterObjCharge.PublicAddress = "";
                    walletMasterObjCharge.IsDefaultWallet = WalletlogObj.IsDefaultWallet;
                    walletMasterObjCharge.CoinName = DeductCoinName.WalletTypeName;
                    walletMasterObjCharge.OutBoundBalance = WalletlogObj.OutBoundBalance;

                    Parallel.Invoke(
                      () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCharge, dWalletobj.UserID.ToString(), 2),
                      () => _signalRService.OnWalletBalChange(walletMasterObjCharge, DeductCoinName.WalletTypeName, dWalletobj.UserID.ToString(), 2),
                      () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, dWalletobj.UserID.ToString(), charge.ToString(), DeductCoinName.WalletTypeName, Helpers.UTC_To_IST().ToString(), TrnRefNo.ToString(), "hold"));
                }
                #endregion
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WalletHoldNotificationSend Timestamp=" + timestamp, "WalletService", ex);
                //throw ex;
            }
        }

        public async Task LPCreditDebitNotificationSend(string timestamp, ArbitrageCommonClassCrDr firstCurrObj, ArbitrageWalletMaster firstCurrObjCrWM, ArbitrageWalletMaster firstCurrObjDrWM, decimal ChargefirstCur, decimal ChargesecondCur)
        {
            try
            {
                #region SMS_Email
                WalletMasterResponse walletMasterObjCr = new WalletMasterResponse();
                walletMasterObjCr.AccWalletID = firstCurrObjCrWM.AccWalletID;
                walletMasterObjCr.Balance = firstCurrObjCrWM.Balance;
                walletMasterObjCr.WalletName = firstCurrObjCrWM.WalletName;
                walletMasterObjCr.PublicAddress = "";
                walletMasterObjCr.IsDefaultWallet = firstCurrObjCrWM.IsDefaultWallet;
                walletMasterObjCr.CoinName = firstCurrObj.Coin;
                walletMasterObjCr.OutBoundBalance = firstCurrObjCrWM.OutBoundBalance;

                WalletMasterResponse walletMasterObjCr1 = new WalletMasterResponse();
                walletMasterObjCr1.AccWalletID = firstCurrObjDrWM.AccWalletID;
                walletMasterObjCr1.Balance = firstCurrObjDrWM.Balance;
                walletMasterObjCr1.WalletName = firstCurrObjDrWM.WalletName;
                walletMasterObjCr1.PublicAddress = "";
                walletMasterObjCr1.IsDefaultWallet = firstCurrObjDrWM.IsDefaultWallet;
                walletMasterObjCr1.CoinName = firstCurrObj.HoldCoin;
                walletMasterObjCr1.OutBoundBalance = firstCurrObjDrWM.OutBoundBalance;

                //WalletMasterResponse walletMasterObjCr1 = new WalletMasterResponse();
                //walletMasterObjCr1.AccWalletID = secondCurrObjCrWM.AccWalletID;
                //walletMasterObjCr1.Balance = secondCurrObjCrWM.Balance;
                //walletMasterObjCr1.WalletName = secondCurrObjCrWM.WalletName;
                //walletMasterObjCr1.PublicAddress = "";
                //walletMasterObjCr1.IsDefaultWallet = secondCurrObjCrWM.IsDefaultWallet;
                //walletMasterObjCr1.CoinName = secondCurrObj.Coin;
                //walletMasterObjCr1.OutBoundBalance = secondCurrObjCrWM.OutBoundBalance;


                ActivityNotificationMessage ActivityNotificationCr = new ActivityNotificationMessage();
                ActivityNotificationCr.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
                ActivityNotificationCr.Param1 = firstCurrObj.Coin;
                ActivityNotificationCr.Param2 = firstCurrObj.trnType.ToString();
                ActivityNotificationCr.Param3 = firstCurrObj.TrnRefNo.ToString();
                ActivityNotificationCr.Type = Convert.ToInt16(EnNotificationType.Info);
              
                //ActivityNotificationMessage ActivityNotificationCr1 = new ActivityNotificationMessage();
                //ActivityNotificationCr1.MsgCode = Convert.ToInt32(enErrorCode.CreditWalletMsgNotification);
                //ActivityNotificationCr1.Param1 = secondCurrObj.Coin;
                //ActivityNotificationCr1.Param2 = secondCurrObj.creditObject.trnType.ToString();
                //ActivityNotificationCr1.Param3 = secondCurrObj.creditObject.TrnRefNo.ToString();
                //ActivityNotificationCr1.Type = Convert.ToInt16(EnNotificationType.Info);

                //WalletMasterResponse walletMasterObjDr = new WalletMasterResponse();
                //walletMasterObjDr.AccWalletID = firstCurrObjDrWM.AccWalletID;
                //walletMasterObjDr.Balance = firstCurrObjDrWM.Balance;
                //walletMasterObjDr.WalletName = firstCurrObjDrWM.WalletName;
                //walletMasterObjDr.PublicAddress = "";
                //walletMasterObjDr.IsDefaultWallet = firstCurrObjDrWM.IsDefaultWallet;
                //walletMasterObjDr.CoinName = firstCurrObj.Coin;
                //walletMasterObjDr.OutBoundBalance = firstCurrObjDrWM.OutBoundBalance;

                //WalletMasterResponse walletMasterObjDr1 = new WalletMasterResponse();
                //walletMasterObjDr1.AccWalletID = secondCurrObjDrWM.AccWalletID;
                //walletMasterObjDr1.Balance = secondCurrObjDrWM.Balance;
                //walletMasterObjDr1.WalletName = secondCurrObjDrWM.WalletName;
                //walletMasterObjDr1.PublicAddress = "";
                //walletMasterObjDr1.IsDefaultWallet = secondCurrObjDrWM.IsDefaultWallet;
                //walletMasterObjDr1.CoinName = secondCurrObj.Coin;
                //walletMasterObjDr1.OutBoundBalance = secondCurrObjDrWM.OutBoundBalance;

                //ActivityNotificationMessage ActivityNotificationdr = new ActivityNotificationMessage();
                //ActivityNotificationdr.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
                //ActivityNotificationdr.Param1 = firstCurrObj.Coin;
                //ActivityNotificationdr.Param2 = firstCurrObj.debitObject.trnType.ToString();
                //ActivityNotificationdr.Param3 = firstCurrObj.debitObject.TrnRefNo.ToString();
                //ActivityNotificationdr.Type = Convert.ToInt16(EnNotificationType.Info);

                //ActivityNotificationMessage ActivityNotificationdr1 = new ActivityNotificationMessage();
                //ActivityNotificationdr1.MsgCode = Convert.ToInt32(enErrorCode.DebitWalletMsgNotification);
                //ActivityNotificationdr1.Param1 = secondCurrObj.Coin;
                //ActivityNotificationdr1.Param2 = secondCurrObj.debitObject.trnType.ToString();
                //ActivityNotificationdr1.Param3 = secondCurrObj.debitObject.TrnRefNo.ToString();
                //ActivityNotificationdr1.Type = Convert.ToInt16(EnNotificationType.Info);

                //decimal ChargefirstCur =  _ArbitrageWalletMaster.FindChargeValueDeduct(timestamp, firstCurrObj.TrnRefNo);
                //decimal ChargesecondCur = _walletRepository1.FindChargeValueDeduct(timestamp, secondCurrObj.debitObject.TrnRefNo);

                //Task.Run(() => HelperForLog.WriteLogIntoFile("CreditNotificationSend Activity:Without Token", "WalletService", "msg=" + ActivityNotificationdr.MsgCode.ToString() + ",User=" + firstCurrObjCrWM.UserID.ToString() + "WalletID" + firstCurrObjCrWM.AccWalletID + ",Balance" + firstCurrObjCrWM.Balance.ToString()));

                //var firstCurrObjCrType = firstCurrObj.trnType.ToString().Contains("Cr_") ? firstCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
                //var firstCurrObjDrType = firstCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? firstCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : firstCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");
                //var secCurrObjCrType = secondCurrObj.creditObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.creditObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.creditObject.trnType.ToString().Replace("Dr_", "");
                //var secCurrObjDrType = secondCurrObj.debitObject.trnType.ToString().Contains("Cr_") ? secondCurrObj.debitObject.trnType.ToString().Replace("Cr_", "") : secondCurrObj.debitObject.trnType.ToString().Replace("Dr_", "");

                Parallel.Invoke(() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCr, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.TrnRefNo + " timestamp : " + timestamp),
                                           () => _signalRService.OnWalletBalChange(walletMasterObjCr, firstCurrObj.Coin, firstCurrObjCrWM.UserID.ToString(), 2, firstCurrObj.TrnRefNo + " timestamp : " + timestamp)
                                           //() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCr1, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           //() => _signalRService.OnWalletBalChange(walletMasterObjCr1, secondCurrObj.Coin, secondCurrObjCrWM.UserID.ToString(), 2, secondCurrObj.creditObject.TrnRefNo + " timestamp : " + timestamp),
                                           //() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationdr, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           //() => _signalRService.OnWalletBalChange(walletMasterObjDr, firstCurrObj.Coin, firstCurrObjDrWM.UserID.ToString(), 2, firstCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           //() => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationdr1, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           //() => _signalRService.OnWalletBalChange(walletMasterObjDr1, secondCurrObj.Coin, secondCurrObjDrWM.UserID.ToString(), 2, secondCurrObj.debitObject.TrnRefNo + " timestamp : " + timestamp),
                                           //() => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, firstCurrObjCrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjCrType, firstCurrObj.creditObject.TrnRefNo.ToString()),
                                           //() => SMSSendAsyncV1(EnTemplateType.SMS_WalletCredited, secondCurrObjCrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjCrType, secondCurrObj.creditObject.TrnRefNo.ToString()),
                                           // () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, firstCurrObjDrWM.UserID.ToString(), null, null, null, null, firstCurrObj.Coin, firstCurrObjDrType, firstCurrObj.debitObject.TrnRefNo.ToString()),
                                           // () => SMSSendAsyncV1(EnTemplateType.SMS_WalletDebited, secondCurrObjDrWM.UserID.ToString(), null, null, null, null, secondCurrObj.Coin, secCurrObjDrType, secondCurrObj.debitObject.TrnRefNo.ToString()),
                                           // () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, secondCurrObjCrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.creditObject.TrnRefNo.ToString(), secCurrObjCrType),
                                           // () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletCredited, firstCurrObjCrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.creditObject.TrnRefNo.ToString(), firstCurrObjCrType),
                                           // () => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, secondCurrObjDrWM.UserID.ToString(), secondCurrObj.Amount.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), secCurrObjDrType),
                                           //() => EmailSendAsyncV1(EnTemplateType.EMAIL_WalletDebited, firstCurrObjDrWM.UserID.ToString(), firstCurrObj.Amount.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), firstCurrObjDrType)
                                           );

                //if (ChargefirstCur > 0 && ChargesecondCur > 0)
                //{
                //    ActivityNotificationMessage ActivityNotificationCrChargeSec = new ActivityNotificationMessage();
                //    ActivityNotificationCrChargeSec.MsgCode = Convert.ToInt32(enErrorCode.ChargeDeductedWallet);
                //    ActivityNotificationCrChargeSec.Param1 = secondCurrObj.Coin;
                //    ActivityNotificationCrChargeSec.Param2 = ChargefirstCur.ToString();
                //    ActivityNotificationCrChargeSec.Param3 = secondCurrObj.creditObject.TrnRefNo.ToString();
                //    ActivityNotificationCrChargeSec.Type = Convert.ToInt16(EnNotificationType.Info);

                //    //ActivityNotificationMessage ActivityNotificationDrChargeSec = new ActivityNotificationMessage();
                //    //ActivityNotificationDrChargeSec.MsgCode = Convert.ToInt32(enErrorCode.ChargeDeductedWallet);
                //    //ActivityNotificationDrChargeSec.Param1 = secondCurrObj.Coin;
                //    //ActivityNotificationDrChargeSec.Param2 = ChargesecondCur.ToString();
                //    //ActivityNotificationDrChargeSec.Param3 = secondCurrObj.debitObject.TrnRefNo.ToString();
                //    //ActivityNotificationDrChargeSec.Type = Convert.ToInt16(EnNotificationType.Info);

                //    Parallel.Invoke(() => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, firstCurrObjDrWM.UserID.ToString(), ChargefirstCur.ToString(), firstCurrObj.Coin, Helpers.UTC_To_IST().ToString(), firstCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                //    () => EmailSendAsyncV1(EnTemplateType.EMAIL_ChrgesApply, secondCurrObjDrWM.UserID.ToString(), ChargesecondCur.ToString(), secondCurrObj.Coin, Helpers.UTC_To_IST().ToString(), secondCurrObj.debitObject.TrnRefNo.ToString(), "Deducted"),
                //  () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationCrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2),
                //    () => _signalRService.SendActivityNotificationV2Arbitrage(ActivityNotificationDrChargeSec, firstCurrObjDrWM.UserID.ToString(), 2));
                //}
                #endregion

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LPCreditNotificationSend" + "TimeStamp:" + timestamp, "ArbitrageWalletService", ex);

                //throw ex;
            }
        }

        #region Graph

        public AnalyticsGraphRes AnalyticsGraphAPI(string CurrencyName, long UserId)
        {
            try
            {
                AnalyticsGraphRes resp = new AnalyticsGraphRes();
                resp = _ArbitrageWalletRepository.AnalyticsGraphAPI(CurrencyName, UserId);

                if (resp == null)
                {
                    resp.ReturnCode = enResponseCode.Fail;
                    resp.ReturnMsg = EnResponseMessage.NotFound;
                    resp.ErrorCode = enErrorCode.NotFound;
                }
                else
                {
                    resp.ReturnCode = enResponseCode.Success;
                    resp.ReturnMsg = EnResponseMessage.FindRecored;
                    resp.ErrorCode = enErrorCode.Success;
                }
                return resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        #endregion

        #region Fund Transfer 

        public FundTransferResponse ArbitrageFundTransafer(FundTransferRequest Request, long UserId)
        {
            try
            {
                var Resp = _walletSPRepositories.Call_sp_ArbitrageWalletFundTransfer(Request,UserId);
                return Resp;
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public FundTransferResponse ArbitrageToTradingFundTransafer(FundTransferRequest Request, long UserId)
        {
            try
            {
                var Resp = _walletSPRepositories.Call_sp_ArbitrageToTradingWalletFundTransfer(Request, UserId);
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public FundTransferResponse ArbitrageProviderFundTransafer(ProviderFundTransferRequest Reuest, long UserId)
        {
            try
            {
                var Resp = _walletSPRepositories.Callsp_CreditArbitrageProviderInitialBalance(Reuest);
                return Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public async Task<BizResponseClass> CheckingBalanceLP(long SerProID,string SMSCode)
        {
            BizResponseClass bizResponseClass = new BizResponseClass();
            try
            {
                  ArbitrageServiceProBalanceResponse response =  await GetArbitrageProviderBalance(SerProID, SMSCode);
                  if(response == null)
                  {
                    //bizResponseClass = new BizResponseClass();
                    bizResponseClass.ErrorCode = enErrorCode.API_LP_Fail;
                    bizResponseClass.ReturnCode = enResponseCode.Fail;
                    bizResponseClass.ReturnMsg = "Api Call Failed.";
                    return bizResponseClass;
                  }

                ArbitrageWalletTypeMaster arbitrageWalletType = _WalletTypeMasterRepository.GetSingle(x => x.WalletTypeName == SMSCode);
                if (arbitrageWalletType == null)
                {
                    response.ReturnCode = enResponseCode.Fail;
                    response.ReturnMsg = EnResponseMessage.InvalidBaseCurrency;
                    response.ErrorCode = enErrorCode.InvalidSourceCurrency;
                    return response;
                }
              
                LPArbitrageWalletMaster ArbitrageWalletObj = _LPArbitrageWallet.FindBy(x => x.WalletTypeID == arbitrageWalletType.Id && x.SerProID == SerProID).SingleOrDefault();

                if(ArbitrageWalletObj == null)
                {
                    response.ReturnCode = enResponseCode.Fail;
                    response.ReturnMsg = EnResponseMessage.WalletNotFound;
                    response.ErrorCode = enErrorCode.WalletNotFound;
                    return response;
                }                

                if (response.Data[0].Balance != response.Data[0].WalletBalance)
                {
                    bizResponseClass.ErrorCode = enErrorCode.ArbitrageLPWalletBalanceMismatch;
                    bizResponseClass.ReturnCode = enResponseCode.Fail;
                    bizResponseClass.ReturnMsg = EnResponseMessage.ArbitrageLPWalletBalanceMismatch;
                    LPArbitrageWalletMismatch lPWallet = new LPArbitrageWalletMismatch();                                     
                    lPWallet.CreatedBy = 99;
                    lPWallet.CreatedDate = Helpers.UTC_To_IST();
                    lPWallet.MismatchaingAmount = response.Data[0].Balance - response.Data[0].WalletBalance;
                    lPWallet.Status = 0;
                    lPWallet.TPBalance = response.Data[0].Balance;
                    lPWallet.SystemBalance = response.Data[0].WalletBalance;
                    lPWallet.WalletID = ArbitrageWalletObj.Id;
                    _mismatchReconRepository.Add(lPWallet);
                    ArbitrageWalletObj.Status = 9;
                    ArbitrageWalletObj.UpdatedBy = 99;
                    arbitrageWalletType.UpdatedDate = Helpers.UTC_To_IST();

                    _LPArbitrageWallet.Update(ArbitrageWalletObj);
                    HelperForLog.WriteLogIntoFileAsync("CheckingBalanceLP", "ArbitrageWalletService", Helpers.JsonSerialize(response) + "ArbitrageWalletObj WalletID" + ArbitrageWalletObj.Id);
                    return bizResponseClass;
                }
                else
                {
                    bizResponseClass.ErrorCode = enErrorCode.Success;
                    bizResponseClass.ReturnCode = enResponseCode.Fail;
                    bizResponseClass.ReturnMsg = "Success.";
                    return bizResponseClass;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                bizResponseClass.ErrorCode = enErrorCode.InternalError;
                bizResponseClass.ReturnCode = enResponseCode.Fail;
                bizResponseClass.ReturnMsg = EnResponseMessage.InternalError;
                return bizResponseClass;
            }
        }

        public ListChargesTypeWise ListArbitrageChargesTypeWise(string WalletTypeName, long? TrnTypeId, long UserId)
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
                var res = _walletSPRepositories.GetArbitrageChargeWalletType(Id);
                for (int i = 0; i <= res.Count - 1; i++)
                {
                    ChargeWalletType a = new ChargeWalletType();
                    a.WalletTypeName = res[i].WalletTypeName;
                    a.WalletTypeId = res[i].WalletTypeId;
                    a.Charges = new List<ChargesTypeWise>();
                    var data = _walletSPRepositories.ListArbitrageChargesTypeWise(res[i].WalletTypeId, TrnTypeId);
                    a.Charges = data;
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
        #endregion
    }

}
