using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Transaction
{

    public class BackOfficeTrnService : IBackOfficeTrnService
    {
        private readonly ILogger<FrontTrnService> _logger;
        private readonly IBackOfficeTrnRepository _backOfficeTrnRepository;
        private readonly ICommonRepository<TransactionQueue> _transactionQueueRepository;
        private readonly ICommonRepository<TradeTransactionQueue> _tradeTransactionRepository;
        private readonly ICommonRepository<TradeBuyRequest> _tradeBuyRepository;
        private readonly ICommonRepository<TradeCancelQueue> _tradeCancelQueueRepository;
        private readonly ICommonRepository<TransactionRequest> _TransactionRequest;

        private readonly IBasePage _basePage;
        private readonly ICommonRepository<PoolOrder> _poolOrderRepository;
        private readonly ICommonRepository<TradePoolMaster> _tradePoolMasterRepository;
        private readonly ICancelOrderProcessV1 _cancelOrderProcess;//Rita 5-2-19 for API cancellation mane new Class
        private readonly IWalletService _WalletService;
        private readonly ICommonRepository<ServiceMaster> _serviceMasterRepository;
        private readonly ICommonRepository<RouteConfiguration> _RouteConfiguration;
        private readonly ICommonRepository<WithdrawHistory> _WithdrawHistory;
        private readonly ICommonRepository<WithdrawERCTokenQueue> _WithdrawERCTokenQueue;

        TransactionRecon tradeReconObj;
        private readonly IWalletTransactionCrDr _walletTransactionCrDr;
        private readonly ITradeReconProcessV1 _tradeReconProcessV1; // khushali 18-03-2019 for Trade Recond

        public BackOfficeTrnService(ILogger<FrontTrnService> logger,
            IBackOfficeTrnRepository backOfficeTrnRepository,
            ICommonRepository<TransactionQueue> transactionQueueRepository,
            ICommonRepository<TradeTransactionQueue> tradeTransactionRepository,
            ICommonRepository<TradeBuyRequest> tradeBuyRepository,
            ICommonRepository<TradeCancelQueue> tradeCancelQueueRepository,
            IBasePage basePage, ICommonRepository<RouteConfiguration> RouteConfiguration,
            ICommonRepository<TransactionRequest> TransactionRequest,
            ICommonRepository<WithdrawHistory> WithdrawHistory,
            ICommonRepository<PoolOrder> poolOrderRepository,
            ICommonRepository<TradePoolMaster> tradePoolMasterRepository,
            ICancelOrderProcessV1 cancelOrderProcess,
            IWalletService WalletService,
            ICommonRepository<ServiceMaster> serviceMasterRepository,
            IWalletTransactionCrDr walletTransactionCrDr,
            ICommonRepository<WithdrawERCTokenQueue> WithdrawERCTokenQueue,
            ITradeReconProcessV1 TradeReconProcessV1 // khushali 18-03-2019 for Trade Recond
            )
        {
            _logger = logger;
            _WithdrawHistory = WithdrawHistory;
            _backOfficeTrnRepository = backOfficeTrnRepository;
            _transactionQueueRepository = transactionQueueRepository;
            _tradeTransactionRepository = tradeTransactionRepository;
            _tradeBuyRepository = tradeBuyRepository;
            _tradeCancelQueueRepository = tradeCancelQueueRepository;
            _basePage = basePage;
            _TransactionRequest = TransactionRequest;
            _poolOrderRepository = poolOrderRepository;
            _tradePoolMasterRepository = tradePoolMasterRepository;
            _cancelOrderProcess = cancelOrderProcess;
            _WalletService = WalletService;
            _serviceMasterRepository = serviceMasterRepository;
            _walletTransactionCrDr = walletTransactionCrDr;
            _tradeReconProcessV1 = TradeReconProcessV1;
            _WithdrawERCTokenQueue = WithdrawERCTokenQueue;
            _RouteConfiguration = RouteConfiguration;
        }

        #region methods
        public TradingSummaryResponse GetTradingSummary(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, short IsMargin = 0) //Rita 4-2-19 for Margin Trading
        {
            try
            {
                long TotalCount = 0, TotalPages = 0;
                int PageSize1 = 0;
                TradingSummaryResponse _Res = new TradingSummaryResponse();
                List<TradingSummaryViewModel> list = new List<TradingSummaryViewModel>();
                List<GetTradingSummary> Modellist;// = _backOfficeTrnRepository.GetTradingSummary(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade,Market,PageSize,PageNo,ref TotalCount,ref PageSize1,ref TotalPages);
                if (IsMargin == 1) //Rita 4-2-19 for Margin Trading
                    Modellist = _backOfficeTrnRepository.GetTradingSummaryMargin(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, ref TotalPages);
                else
                    Modellist = _backOfficeTrnRepository.GetTradingSummary(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, ref TotalPages);

                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }


                foreach (var model in Modellist)
                {
                    list.Add(new TradingSummaryViewModel()
                    {
                        Amount = model.Amount,
                        ChargeRs = model.ChargeRs,
                        DateTime = model.DateTime.Date,
                        MemberID = Convert.ToInt64(model.MemberID),
                        PairID = model.PairID,
                        PairName = model.PairName,
                        //PostBal = model.PostBal,
                        //PreBal = model.PreBal,
                        Price = model.Price,
                        StatusText = model.StatusText,
                        Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs) : ((model.Price * model.Amount)),
                        TrnNo = model.TrnNo,
                        Type = model.Type,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                        StatusCode = model.StatusCode,
                        IsCancelled = model.IsCancelled,
                        SettleQty = model.SettleQty
                    });
                }
                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;

                _Res.PageNo = PageNo;       //Uday 12-01-2019 Add Pagination
                _Res.PageSize = PageSize1;
                _Res.TotalCount = TotalCount;
                _Res.TotalPages = TotalPages;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TradingSummaryLPResponse GetTradingSummaryLP(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, string LPType)
        {
            try
            {
                long TotalCount = 0, TotalPages = 0;
                int PageSize1 = 0;
                TradingSummaryLPResponse _Res = new TradingSummaryLPResponse();
                List<TradingSummaryLPViewModel> list = new List<TradingSummaryLPViewModel>();
                var Modellist = _backOfficeTrnRepository.GetTradingSummaryLP(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, LPType, ref TotalPages);
                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }


                foreach (var model in Modellist)
                {
                    list.Add(new TradingSummaryLPViewModel()
                    {
                        Amount = model.Amount,
                        ChargeRs = model.ChargeRs,
                        DateTime = model.DateTime.Date,
                        MemberID = Convert.ToInt64(model.MemberID),
                        PairID = model.PairID,
                        PairName = model.PairName,
                        //PostBal = model.PostBal,
                        //PreBal = model.PreBal,
                        Price = model.Price,
                        StatusText = model.StatusText,
                        Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs) : ((model.Price * model.Amount)),
                        TrnNo = model.TrnNo,
                        Type = model.Type,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                        StatusCode = model.StatusCode,
                        IsCancelled = model.IsCancelled,
                        SettleQty = model.SettleQty,
                        ProviderName = model.ProviderName
                    });
                }
                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;

                _Res.PageNo = PageNo;       //Uday 12-01-2019 Add Pagination
                _Res.PageSize = PageSize1;
                _Res.TotalCount = TotalCount;
                _Res.TotalPages = TotalPages;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TradingReconHistoryResponse GetTradingReconHistory(long MemberID, string FromDate, string ToDate, long TrnNo, short status, long PairID, short trade, short Market, int PageSize, int PageNo, int LPType, short? IsProcessing)
        {
            try
            {
                long TotalCount = 0, TotalPages = 0;
                int PageSize1 = 0;
                TradingReconHistoryResponse _Res = new TradingReconHistoryResponse();
                List<TradingReconHistoryViewModel> list = new List<TradingReconHistoryViewModel>();
                var Modellist = _backOfficeTrnRepository.GetTradingReconHistory(MemberID, FromDate, ToDate, TrnNo, status, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, LPType, ref TotalPages, IsProcessing);
                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }


                foreach (var model in Modellist)
                {
                    list.Add(new TradingReconHistoryViewModel()
                    {
                        Amount = model.Amount,
                        ChargeRs = model.ChargeRs,
                        DateTime = model.DateTime,
                        MemberID = Convert.ToInt64(model.MemberID),
                        PairID = model.PairID,
                        PairName = model.PairName,
                        //PostBal = model.PostBal,
                        //PreBal = model.PreBal,
                        Price = model.Price,
                        StatusText = model.StatusText,
                        Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs) : ((model.Price * model.Amount)),
                        TrnNo = model.TrnNo,
                        Type = model.Type,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                        StatusCode = model.StatusCode,
                        IsCancelled = model.IsCancelled,
                        SettleQty = model.SettleQty,
                        ProviderName = model.ProviderName,
                        IsProcessing = model.IsProcessing,
                        ActionStage = model.ActionStage,
                        IsAPITrade = model.IsAPITrade,
                        UserName = model.UserName
                    });
                }
                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;

                _Res.PageNo = PageNo;       //Uday 12-01-2019 Add Pagination
                _Res.PageSize = PageSize1;
                _Res.TotalCount = TotalCount;
                _Res.TotalPages = TotalPages;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //public BizResponseClass TradeRecon(long TranNo, string ActionMessage,long UserId)
        //{
        //    BizResponseClass Response = new BizResponseClass();
        //    try
        //    {
        //        var transactionQueue = _transactionQueueRepository.GetById(TranNo);
        //        var tradeTranQueue = _tradeTransactionRepository.GetSingle(x => x.TrnNo == TranNo);
        //        var tradeBuyRequest = _tradeBuyRepository.GetSingle(x => x.TrnNo == TranNo);

        //        if (transactionQueue != null && transactionQueue != null && tradeBuyRequest != null)
        //        {
        //            var datediff = _basePage.UTC_To_IST() - transactionQueue.TrnDate;
        //            if(UserId != 1 && datediff.Days > 7)
        //            {
        //                //After 7 days of transaction you can not take action, Please contact admin
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.TradeRecon_After7DaysTranDontTakeAction;
        //                Response.ErrorCode = enErrorCode.TradeRecon_After7DaysTranDontTakeAction;

        //            }
        //            else if(transactionQueue.Status != 4)
        //            {
        //                //Invalid Transaction Status For Trade Recon
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.TradeRecon_InvalidTransactionStatus;
        //                Response.ErrorCode = enErrorCode.TradeRecon_InvalidTransactionStatus;

        //            }
        //            else if(tradeTranQueue.IsCancelled == 1)
        //            {
        //                //Transaction Cancellation request is already in processing.
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.TradeRecon_CancelRequestAlreayInProcess;
        //                Response.ErrorCode = enErrorCode.TradeRecon_CancelRequestAlreayInProcess;
        //            }
        //            else if(tradeBuyRequest.IsProcessing == 1)
        //            {
        //                //Transaction Already in Process, Please try After Sometime
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.TradeRecon_TransactionAlreadyInProcess;
        //                Response.ErrorCode = enErrorCode.TradeRecon_TransactionAlreadyInProcess;
        //            }
        //            else if(tradeBuyRequest.PendingQty == 0)
        //            {
        //                //Can not initiate Cancellation Request.Your order is fully executed
        //                Response.ReturnCode = enResponseCode.Fail;
        //                Response.ReturnMsg = EnResponseMessage.TradeRecon_OrderIsFullyExecuted;
        //                Response.ErrorCode = enErrorCode.TradeRecon_OrderIsFullyExecuted;
        //            }
        //            else
        //            {
        //                var DeliveryQty = Math.Round((transactionQueue.Amount * tradeBuyRequest.PendingQty) / tradeBuyRequest.Qty,8);

        //                if(DeliveryQty == 0 || DeliveryQty < 0)
        //                {
        //                    //Invalid Delivery Amount
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ReturnMsg = EnResponseMessage.TradeRecon_InvalidDeliveryAmount;
        //                    Response.ErrorCode = enErrorCode.TradeRecon_InvalidDeliveryAmount;
        //                }
        //                if(DeliveryQty > transactionQueue.Amount)
        //                {
        //                    //Invalid Delivery Amount
        //                    Response.ReturnCode = enResponseCode.Fail;
        //                    Response.ReturnMsg = EnResponseMessage.TradeRecon_InvalidDeliveryAmount;
        //                    Response.ErrorCode = enErrorCode.TradeRecon_InvalidDeliveryAmount;
        //                }
        //                else
        //                {
        //                    //Add record in Transaction Cancel Queue
        //                    var tradeCancelQueue = new TradeCancelQueue()
        //                    {
        //                        TrnNo = TranNo,
        //                        DeliverServiceID = transactionQueue.ServiceID,
        //                        TrnDate = _basePage.UTC_To_IST(),
        //                        PendingBuyQty = tradeBuyRequest.PendingQty,
        //                        DeliverQty = DeliveryQty,
        //                        Status = 0,
        //                        StatusMsg = "Cancel Order",
        //                        CreatedBy = UserId,
        //                        CreatedDate = _basePage.UTC_To_IST()
        //                    };

        //                    tradeCancelQueue = _tradeCancelQueueRepository.Add(tradeCancelQueue);

        //                    //Add record in PoolOrder
        //                    var poolOrder = new PoolOrder()
        //                    {

        //                        CreatedDate = _basePage.UTC_To_IST(),
        //                        CreatedBy = UserId,
        //                        TrnMode = Convert.ToByte(transactionQueue.TrnMode),
        //                        PayMode = Convert.ToInt16(enWebAPIRouteType.TradeServiceLocal),
        //                        ORemarks = "Cancellation Initiated",
        //                        OrderAmt = DeliveryQty,
        //                        OMemberID = transactionQueue.MemberID,
        //                        DMemberID = tradeBuyRequest.SellStockID,
        //                        DiscPer = 0,
        //                        DiscRs = 0,
        //                        Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
        //                        UserWalletID = tradeTranQueue.OrderWalletID,
        //                        //UserWalletAccID = tradeTranQueue.OrderWalletID,
        //                        TrnNo = TranNo,
        //                        CancelID = tradeCancelQueue.Id,
        //                        DeliveryAmt = DeliveryQty,
        //                        DRemarks = "Cancel Order",

        //                        //OrderDate = _basePage.UTC_To_IST(),
        //                        //TrnMode = Convert.ToByte(transactionQueue.TrnMode),
        //                        //OMemberID = transactionQueue.MemberID,
        //                        //PayMode = 2,
        //                        //OrderAmt = DeliveryQty,
        //                        //DiscPer = 0,
        //                        //DiscRs = 0,
        //                        //OBankID = 0,
        //                        //OBranchName = "",
        //                        //OAccountNo = "",
        //                        //OChequeNo = "",
        //                        //DMemberID = tradeBuyRequest.SellStockID,
        //                        //DBankID = 0,
        //                        //DAccountNo = "",
        //                        //Status = 0,
        //                        //ORemarks = "",                             
        //                        //AlertRec = 0,
        //                        //CashChargePer = 0,
        //                        //CashChargeRs = 0,
        //                        //WalletAmt = 0,
        //                        //PGId = 0,
        //                        //CouponNo = 0,
        //                        //IsChargeAccepted = false,
        //                        //WalletID = tradeTranQueue.OrderWalletID,                              
        //                        //CreatedBy = UserId,
        //                        //CreatedDate = _basePage.UTC_To_IST()
        //                    };

        //                    poolOrder = _poolOrderRepository.Add(poolOrder);

        //                    //Update TradeBuyRequest
        //                    tradeBuyRequest.UpdatedDate = _basePage.UTC_To_IST();
        //                    tradeBuyRequest.UpdatedBy = UserId;
        //                    tradeBuyRequest.IsCancel = 1;
        //                    _tradeBuyRepository.Update(tradeBuyRequest);

        //                    //Update TradeTransaction Queue
        //                    tradeTranQueue.UpdatedDate = _basePage.UTC_To_IST();
        //                    tradeTranQueue.UpdatedBy = UserId;
        //                    tradeTranQueue.IsCancelled = 1;
        //                    tradeTranQueue.StatusMsg = "Cancellation Initiated";
        //                    _tradeTransactionRepository.Update(tradeTranQueue);

        //                    //Update OrderID in TransactionCancel Queue
        //                    tradeCancelQueue.OrderID = poolOrder.Id;
        //                    _tradeCancelQueueRepository.Update(tradeCancelQueue);

        //                    var tradePoolMaster = _tradePoolMasterRepository.GetSingle(x => x.Id == tradeBuyRequest.SellStockID && x.IsSleepMode == 1);
        //                    if(tradePoolMaster != null)
        //                    {
        //                        tradePoolMaster.IsSleepMode = 0;
        //                        _tradePoolMasterRepository.Update(tradePoolMaster);
        //                    }

        //                    Response.ReturnCode = enResponseCode.Success;
        //                    Response.ReturnMsg = EnResponseMessage.TradeRecon_CencelRequestSuccess;
        //                    Response.ErrorCode = enErrorCode.TradeRecon_CencelRequestSuccess;
        //                }
        //            }
        //        }
        //        else
        //        {
        //            Response.ReturnCode = enResponseCode.Fail;
        //            Response.ReturnMsg = EnResponseMessage.TradeRecon_InvalidTransactionNo;
        //            Response.ErrorCode = enErrorCode.TradeRecon_InvalidTransactionNo;
        //        }

        //        return Response;
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
        //        throw ex;
        //    }
        //}

        public Task<BizResponseClass> TradeRecon(long TranNo, string ActionMessage, long UserId, string accessToken)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var transactionQueue = _transactionQueueRepository.GetById(TranNo);
                if (transactionQueue != null)
                {
                    var datediff = _basePage.UTC_To_IST() - transactionQueue.TrnDate;
                    if (UserId != 1 && datediff.Days > 7)
                    {
                        //After 7 days of transaction you can not take action, Please contact admin
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.TradeRecon_After7DaysTranDontTakeAction;
                        Response.ErrorCode = enErrorCode.TradeRecon_After7DaysTranDontTakeAction;
                        return Task.FromResult(Response);
                    }
                    else
                    {
                        var cancelOrderRequest = new NewCancelOrderRequestCls()
                        {
                            TranNo = TranNo,
                            accessToken = accessToken
                        };
                        var response = _cancelOrderProcess.ProcessCancelOrderAsyncV1(cancelOrderRequest);

                        Response.ReturnCode = (enResponseCode)enResponseCodeService.Parse(typeof(enResponseCodeService), response.Result.ReturnCode.ToString());
                        Response.ErrorCode = response.Result.ErrorCode;
                        Response.ReturnMsg = response.Result.ReturnMsg;

                        return Task.FromResult(Response);
                    }
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.TradeRecon_InvalidTransactionNo;
                    Response.ErrorCode = enErrorCode.TradeRecon_InvalidTransactionNo;
                    return Task.FromResult(Response);
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TransactionChargeResponse ChargeSummary(string FromDate, string ToDate, short trade)
        {
            try
            {
                TransactionChargeResponse _Res = new TransactionChargeResponse();
                var Modellist = _backOfficeTrnRepository.ChargeSummary(FromDate, ToDate, trade);
                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }
                _Res.response = Modellist;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                return _Res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unexpected exception occured,\nMethodName:" + System.Reflection.MethodBase.GetCurrentMethod().Name + "\nClassname=" + this.GetType().Name, LogLevel.Error);
                throw ex;
            }
        }

        public BizResponseClass WithdrawalRecon(WithdrawalReconRequest request, long UserId, string accessToken)
        {
            BizResponseClass Response = new BizResponseClass();
            WithdrawHistory WithdrawHistoryObj = null;
            TransactionRequest TransactionRequestobj = null;
            WithdrawERCTokenQueue _WithdrawERCTokenQueueObj = null;
            short IsInsert = 2;
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

                        //2019-4-3
                        WithdrawHistoryObj = _WithdrawHistory.GetSingle(i => i.TrnNo == request.TrnNo);
                        if (WithdrawHistoryObj != null)
                        {
                            WithdrawHistoryObj.Status = Convert.ToInt16(enTransactionStatus.Refunded);
                            WithdrawHistoryObj.SystemRemarks = "Refunded";
                            IsInsert = 0;
                        }

                        _WithdrawERCTokenQueueObj = _WithdrawERCTokenQueue.GetSingle(i => i.TrnNo == request.TrnNo);
                        if (_WithdrawERCTokenQueueObj != null)
                        {
                            _WithdrawERCTokenQueueObj.Status = Convert.ToInt16(enTransactionStatus.InActive);
                            //_WithdrawERCTokenQueueObj.SystemRemarks = "Refunded";
                        }


                        //Uday 06-02-2019  Comment GetWalletCreditNew Function, used new fucntion GetWalletCreditNewAsync as per instruction of nupoora mam
                        //enWalletTrnType.Cr_Refund
                        //var CreditResult = _WalletService.GetWalletCreditNew(TransactionQueueObj.SMSCode, Helpers.GetTimeStamp(), enWalletTrnType.Refund, TransactionQueueObj.Amount, TransactionQueueObj.MemberID,
                        //    TransactionQueueObj.DebitAccountID, CreditWalletDrArryTrnIDList.ToArray(), request.TrnNo, 1, enWalletTranxOrderType.Credit,ServiceType, (enTrnType)TransactionQueueObj.TrnType);
                        var CreditResult = _walletTransactionCrDr.GetWalletCreditNewAsync(TransactionQueueObj.SMSCode, Helpers.GetTimeStamp(), enWalletTrnType.Withdrawal, TransactionQueueObj.Amount, TransactionQueueObj.MemberID,
                           TransactionQueueObj.DebitAccountID, CreditWalletDrArryTrnIDList.ToArray(), request.TrnNo, 1, enWalletTranxOrderType.Credit, ServiceType, (enTrnType)TransactionQueueObj.TrnType);

                        if (CreditResult.Result.ReturnCode != enResponseCode.Success)
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
                        var DebitResult = _WalletService.GetWalletDeductionNew(TransactionQueueObj.SMSCode, Helpers.GetTimeStamp(), enWalletTranxOrderType.Debit, TransactionQueueObj.Amount, TransactionQueueObj.MemberID,
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

                        if (request.TrnID != null)
                        {
                             TransactionRequestobj = _TransactionRequest.GetSingle(i => i.TrnNo == request.TrnNo);
                            if (TransactionRequestobj != null)
                            {
                                if (TransactionRequestobj.TrnID == null || TransactionRequestobj.TrnID == "")
                                {
                                    TransactionRequestobj.TrnID = request.TrnID;
                                }
                            }
                            WithdrawHistoryObj = _WithdrawHistory.GetSingle(i => i.TrnNo == request.TrnNo);
                            if (WithdrawHistoryObj == null)
                            {
                                var routeObj = _RouteConfiguration.GetSingle(i => i.Id == TransactionQueueObj.RouteID);
                                if(routeObj!=null)
                                {
                                    WithdrawHistoryObj = new WithdrawHistory();
                                    WithdrawHistoryObj.SMSCode = TransactionQueueObj.SMSCode;
                                    WithdrawHistoryObj.TrnID = request.TrnID;
                                    WithdrawHistoryObj.WalletId = _WalletService.GetWalletID(TransactionQueueObj.DebitAccountID).Result;
                                    WithdrawHistoryObj.Address = TransactionQueueObj.TransactionAccount;
                                    WithdrawHistoryObj.ToAddress = "";
                                    WithdrawHistoryObj.Confirmations = 0;
                                    WithdrawHistoryObj.Value = 0;
                                    WithdrawHistoryObj.Amount = TransactionQueueObj.Amount;
                                    WithdrawHistoryObj.Charge = 0;
                                    WithdrawHistoryObj.Status = 5;
                                    WithdrawHistoryObj.confirmedTime = "";
                                    WithdrawHistoryObj.unconfirmedTime = "";
                                    WithdrawHistoryObj.CreatedDate = Helpers.UTC_To_IST();
                                    WithdrawHistoryObj.State = 0;
                                    WithdrawHistoryObj.IsProcessing = 0;
                                    WithdrawHistoryObj.TrnNo = TransactionQueueObj.Id;
                                    WithdrawHistoryObj.RouteTag = routeObj.RouteName;
                                    WithdrawHistoryObj.UserId = TransactionQueueObj.MemberID;
                                    WithdrawHistoryObj.SerProID = TransactionQueueObj.SerProID;
                                    WithdrawHistoryObj.TrnDate = Helpers.UTC_To_IST();
                                    WithdrawHistoryObj.APITopUpRefNo = "";
                                    WithdrawHistoryObj.createdTime = Helpers.UTC_To_IST().ToString();
                                    WithdrawHistoryObj.SystemRemarks = "Recon Process Refunded";
                                    WithdrawHistoryObj.ProviderWalletID = routeObj.ProviderWalletID;

                                    IsInsert = 1;
                                }
                            }
                            else
                            {
                                WithdrawHistoryObj.TrnID = request.TrnID;

                                IsInsert = 0;
                            }
                        }
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

                var ResultBool = _backOfficeTrnRepository.WithdrawalRecon(tradeReconObj, TransactionQueueObj, WithdrawHistoryObj, _WithdrawERCTokenQueueObj,TransactionRequestobj,IsInsert);
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
                    CreatedDate = _basePage.UTC_To_IST(),
                    Status = 1,
                };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("WithdrwalreconEntry:##TrnNo " + TrnNo, "BackOfficeTrnService", ex);
            }
        }

        public WithdrawalSummaryResponse GetWithdrawalSummary(WithdrawalSummaryRequest Request)
        {
            try
            {
                WithdrawalSummaryResponse _Res = new WithdrawalSummaryResponse();

                if (Request.Status == 81)
                {
                    Request.Status = 1;
                }
                else if (Request.Status == 82)
                {
                    Request.Status = 2;
                }
                else if (Request.Status == 83)
                {
                    Request.Status = 3;
                }
                else if (Request.Status == 84)
                {
                    Request.Status = 4;
                }
                else if (Request.Status == 85)
                {
                    Request.Status = 5;
                }
                else if (Request.Status == 86)
                {
                    Request.Status = 6;
                }

                var Modellist = _backOfficeTrnRepository.GetWithdrawalSummary(Request);

                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }
                else
                {
                    _Res.ReturnCode = enResponseCode.Success;
                    _Res.ErrorCode = enErrorCode.Success;
                    _Res.response = Modellist;
                    return _Res;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public PairTradeSummaryResponse pairTradeSummary(long PairID, short Market, short Range, short IsMargin = 0)
        {
            try
            {
                PairTradeSummaryResponse _Res = new PairTradeSummaryResponse();
                List<PairTradeSummaryViewModel> Modellist = new List<PairTradeSummaryViewModel>();
                List<PairTradeSummaryQryResponse> list;
                if (IsMargin == 1)
                    list = _backOfficeTrnRepository.PairTradeSummaryMargin(PairID, Market, Range);
                else
                    list = _backOfficeTrnRepository.PairTradeSummary(PairID, Market, Range);

                if (list.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }
                foreach (var model in list)
                {
                    decimal CalcChargePer = 0;
                    try
                    {
                        CalcChargePer = ((model.LTP * 100) / model.OpenP) - 100;
                    }
                    catch (Exception e)
                    {
                        CalcChargePer = 0;
                    }
                    Modellist.Add(new PairTradeSummaryViewModel()
                    {
                        PairId = model.Id,
                        buy = model.buy,
                        Cancelled = model.Cancelled,
                        CloseP = model.LTP,
                        high = model.high,
                        low = model.low,
                        LTP = model.LTP,
                        OpenP = model.OpenP,
                        PairName = model.PairName,
                        sell = model.sell,
                        Settled = model.Settled,
                        TradeCount = model.TradeCount,
                        Volume = model.Volume,
                        ChargePer = CalcChargePer,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype)
                    });
                }
                _Res.Response = Modellist;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public TradeSettledHistoryResponse TradeSettledHistory(int PageSize, int PageNo, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0, short IsMargin = 0)//Rita 23-2-19 for Margin Trading Data bit
        {
            try
            {
                long TotalCount = 0;
                int PageSize1 = 0;
                long TotalPages = 0;

                TradeSettledHistoryResponse _Res = new TradeSettledHistoryResponse();
                List<TradeSettledHistory> list = new List<TradeSettledHistory>();
                //Uday 12-01-2019 Add pagination parameter
                if (IsMargin == 1)
                    list = _backOfficeTrnRepository.TradeSettledHistoryMargin(PageSize, PageNo, ref TotalPages, ref TotalCount, ref PageSize1, PairID, TrnType, OrderType, FromDate, Todate, MemberID, TrnNo);
                else
                    list = _backOfficeTrnRepository.TradeSettledHistory(PageSize, PageNo, ref TotalPages, ref TotalCount, ref PageSize1, PairID, TrnType, OrderType, FromDate, Todate, MemberID, TrnNo);


                if (list.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }

                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                _Res.TotalCount = TotalCount;
                _Res.PageSize = PageSize1;
                _Res.PageNo = PageNo;
                _Res.TotalPages = TotalPages;


                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }


        public List<TopLooserGainerPairData> GetTopGainerPair(int Type, short IsMargin = 0)//Rita 5-3-19 for Margin Trading
        {
            try
            {
                List<TopLooserGainerPairData> Data;
                if (IsMargin == 1)
                    Data = _backOfficeTrnRepository.GetTopGainerPairMargin(Type);
                else
                    Data = _backOfficeTrnRepository.GetTopGainerPair(Type);

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetTopLooserPair(int Type, short IsMargin = 0)//Rita 5-3-19 for Margin Trading
        {
            try
            {
                List<TopLooserGainerPairData> Data;
                if (IsMargin == 1)
                    Data = _backOfficeTrnRepository.GetTopLooserPairMargin(Type);
                else
                    Data = _backOfficeTrnRepository.GetTopLooserPair(Type);

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        public List<TopLooserGainerPairData> GetTopLooserGainerPair(short IsMargin = 0)//Rita 5-3-19 for Margin Trading
        {
            try
            {
                List<TopLooserGainerPairData> Data;

                if (IsMargin == 1)
                    Data = _backOfficeTrnRepository.GetTopLooserGainerPairMargin();
                else
                    Data = _backOfficeTrnRepository.GetTopLooserGainerPair();

                return Data;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

        //khushali 18-03-2019 for Trade Recon
        public async Task<BizResponseClass> TradeReconV1(enTradeReconActionType ActionType, long TranNo, string ActionMessage, long UserId, string accessToken)
        {
            BizResponseClass Response = new BizResponseClass();
            try
            {
                var transactionQueue = _transactionQueueRepository.GetById(TranNo);
                if (transactionQueue != null)
                {
                    var datediff = _basePage.UTC_To_IST() - transactionQueue.TrnDate;
                    if (UserId != 1 && datediff.Days > 7)
                    {
                        //After 7 days of transaction you can not take action, Please contact admin
                        Response.ReturnCode = enResponseCode.Fail;
                        Response.ReturnMsg = EnResponseMessage.TradeRecon_After7DaysTranDontTakeAction;
                        Response.ErrorCode = enErrorCode.TradeRecon_After7DaysTranDontTakeAction;
                        return Response;
                    }
                    else
                    {
                        Response = await _tradeReconProcessV1.TradeReconProcessAsyncV1(ActionType, TranNo, ActionMessage, UserId, accessToken);
                        return Response;
                    }
                }
                else
                {
                    Response.ReturnCode = enResponseCode.Fail;
                    Response.ReturnMsg = EnResponseMessage.TradeRecon_InvalidTransactionNo;
                    Response.ErrorCode = enErrorCode.TradeRecon_InvalidTransactionNo;
                    return Response;
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }
        }

       //Darshan Dholakiya added method for the arbitrage related changes:06-06-2019
        public TradingSummaryResponse GetTradingSummaryArbitrage(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, short IsMargin = 0)
        {
            try
            {
                long TotalCount = 0, TotalPages = 0;
                int PageSize1 = 0;
                TradingSummaryResponse _Res = new TradingSummaryResponse();
                List<TradingSummaryViewModel> list = new List<TradingSummaryViewModel>();
                List<GetTradingSummary> Modellist;// = _backOfficeTrnRepository.GetTradingSummary(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade,Market,PageSize,PageNo,ref TotalCount,ref PageSize1,ref TotalPages);
                //if (IsMargin == 1) //Rita 4-2-19 for Margin Trading
                //    Modellist = _backOfficeTrnRepository.GetTradingSummaryMargin(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, ref TotalPages);
                //else
                    Modellist = _backOfficeTrnRepository.GetTradingSummaryArbitrageInfo(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, ref TotalPages);

                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }


                foreach (var model in Modellist)
                {
                    list.Add(new TradingSummaryViewModel()
                    {
                        Amount = model.Amount,
                        ChargeRs = model.ChargeRs,
                        DateTime = model.DateTime.Date,
                        MemberID = Convert.ToInt64(model.MemberID),
                        PairID = model.PairID,
                        PairName = model.PairName,
                        //PostBal = model.PostBal,
                        //PreBal = model.PreBal,
                        Price = model.Price,
                        StatusText = model.StatusText,
                        Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs) : ((model.Price * model.Amount)),
                        TrnNo = model.TrnNo,
                        Type = model.Type,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                        StatusCode = model.StatusCode,
                        IsCancelled = model.IsCancelled,
                        SettleQty = model.SettleQty
                    });
                }
                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;

                _Res.PageNo = PageNo;       //Uday 12-01-2019 Add Pagination
                _Res.PageSize = PageSize1;
                _Res.TotalCount = TotalCount;
                _Res.TotalPages = TotalPages;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }
        public TradingSummaryLPResponse GetTradingSummaryLPArbitrage(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, string LPType)
        {
            try
            {
                long TotalCount = 0, TotalPages = 0;
                int PageSize1 = 0;
                TradingSummaryLPResponse _Res = new TradingSummaryLPResponse();
                List<TradingSummaryLPViewModel> list = new List<TradingSummaryLPViewModel>();
                var Modellist = _backOfficeTrnRepository.GetTradingSummaryLPArbitrageInfo(MemberID, FromDate, ToDate, TrnNo, status, SMSCode, PairID, trade, Market, PageSize, PageNo, ref TotalCount, ref PageSize1, LPType, ref TotalPages);
                if (Modellist.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }


                foreach (var model in Modellist)
                {
                    list.Add(new TradingSummaryLPViewModel()
                    {
                        Amount = model.Amount,
                        ChargeRs = model.ChargeRs,
                        DateTime = model.DateTime.Date,
                        MemberID = Convert.ToInt64(model.MemberID),
                        PairID = model.PairID,
                        PairName = model.PairName,
                        //PostBal = model.PostBal,
                        //PreBal = model.PreBal,
                        Price = model.Price,
                        StatusText = model.StatusText,
                        Total = model.Type == "BUY" ? ((model.Price * model.Amount) - model.ChargeRs) : ((model.Price * model.Amount)),
                        TrnNo = model.TrnNo,
                        Type = model.Type,
                        OrderType = Enum.GetName(typeof(enTransactionMarketType), model.ordertype),
                        StatusCode = model.StatusCode,
                        IsCancelled = model.IsCancelled,
                        SettleQty = model.SettleQty,
                        ProviderName = model.ProviderName
                    });
                }
                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;

                _Res.PageNo = PageNo;       //Uday 12-01-2019 Add Pagination
                _Res.PageSize = PageSize1;
                _Res.TotalCount = TotalCount;
                _Res.TotalPages = TotalPages;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        public TradeSettledHistoryResponse TradeSettledHistoryArbitrage(int PageSize, int PageNo, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0, short IsMargin = 0)
        {
            try
            {
                long TotalCount = 0;
                int PageSize1 = 0;
                long TotalPages = 0;
                TradeSettledHistoryResponse _Res = new TradeSettledHistoryResponse();
                List<TradeSettledHistory> list = new List<TradeSettledHistory>();
                //Uday 12-01-2019 Add pagination parameter
                //if (IsMargin == 1)
                //    list = _backOfficeTrnRepository.TradeSettledHistoryMargin(PageSize, PageNo, ref TotalPages, ref TotalCount, ref PageSize1, PairID, TrnType, OrderType, FromDate, Todate, MemberID, TrnNo);
                //else
                  list = _backOfficeTrnRepository.TradeSettledHistoryArbitrageInfo(PageSize, PageNo, ref TotalPages, ref TotalCount, ref PageSize1, PairID, TrnType, OrderType, FromDate, Todate, MemberID, TrnNo);
                if (list.Count == 0)
                {
                    _Res.ReturnCode = enResponseCode.Fail;
                    _Res.ErrorCode = enErrorCode.NoDataFound;
                    return _Res;
                }
                _Res.Response = list;
                _Res.ReturnCode = enResponseCode.Success;
                _Res.ErrorCode = enErrorCode.Success;
                _Res.ReturnMsg = "Success";
                _Res.TotalCount = TotalCount;
                _Res.PageSize = PageSize1;
                _Res.PageNo = PageNo;
                _Res.TotalPages = TotalPages;
                return _Res;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                throw ex;
            }

        }

        #endregion
    }
}
