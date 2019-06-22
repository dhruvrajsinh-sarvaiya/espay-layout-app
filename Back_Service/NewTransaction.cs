using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Infrastructure.Data.Transaction;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Transaction
{
    public class NewTransaction : ITransactionProcess
    {
        private readonly ICommonRepository<TradePairMaster> _TradePairMaster;
        private readonly ICommonRepository<TradePairDetail> _TradePairDetail;
        private readonly ICommonRepository<TransactionQueue> _TransactionRepository;
        private readonly ICommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly ICommonRepository<TradeStopLoss> _TradeStopLoss;
        private readonly ICommonRepository<ServiceMaster> _ServiceConfi;
        private readonly ICommonRepository<PoolOrder> _PoolOrder;
        private readonly ICommonRepository<TradePoolMaster> _TradePoolMaster; 
        private readonly ICommonRepository<TradeBuyRequest> _TradeBuyRequest; 
        private readonly ICommonRepository<TradeSellerList> _TradeSellerList; 
        private readonly ICommonRepository<TradeBuyerList> _TradeBuyerList;
        private readonly ICommonRepository<TradePairStastics> _tradePairStastics;
        private readonly IWalletService _WalletService;
        private readonly IWebApiRepository _WebApiRepository;
        private readonly ISettlementRepository<BizResponse> _SettlementRepository;
        private readonly ISignalRService _ISignalRService;
        private readonly ITrnMasterConfiguration _trnMasterConfiguration;       

        public BizResponse _Resp;        
        public TradePairMaster _TradePairObj;
        public TradePairDetail _TradePairDetailObj;
        public List<TransactionProviderResponse> TxnProviderList;

        TransactionQueue Newtransaction;
        TradeTransactionQueue NewTradetransaction;
        NewTransactionRequestCls Req;
        NewTradeTransactionRequestCls _TradeTransactionObj = new NewTradeTransactionRequestCls();
        ProcessTransactionCls _TransactionObj;
        ServiceMaster _BaseCurrService;
        ServiceMaster _SecondCurrService;
        IEnumerable<ServiceMaster> _AllService;
        PoolOrder PoolOrderObj;
        TradePoolMaster TradePoolMasterObj;
        TradeBuyRequest TradeBuyRequestObj;
        TradeSellerList TradeSellerListObj;
        TradeStopLoss TradeStopLossObj;
        private string ControllerName = "TradingTransaction";
        public IServiceProvider Services { get; }
       

        public NewTransaction(ICommonRepository<TradePairMaster> TradePairMaster,
            ICommonRepository<TransactionQueue> TransactionRepository,
            ICommonRepository<TradeTransactionQueue> TradeTransactionRepository,
            ICommonRepository<ServiceMaster> ServiceConfi,
            ICommonRepository<TradeStopLoss> tradeStopLoss, IWalletService WalletService,
            ICommonRepository<TradePairDetail> TradePairDetail, IWebApiRepository WebApiRepository,
            ICommonRepository<PoolOrder> PoolOrder, ICommonRepository<TradePoolMaster> TradePoolMaster,
            ICommonRepository<TradeBuyRequest> TradeBuyRequest, ICommonRepository<TradeSellerList> TradeSellerList,
            ICommonRepository<TradeBuyerList> TradeBuyerList, ISettlementRepository<BizResponse> SettlementRepository, 
            ISignalRService ISignalRService, ICommonRepository<TradePairStastics> tradePairStastics,
            IServiceProvider services, ITrnMasterConfiguration trnMasterConfiguration)
        {
            _TradePairMaster = TradePairMaster;
            _TransactionRepository = TransactionRepository;
            _TradeTransactionRepository = TradeTransactionRepository;
            _ServiceConfi = ServiceConfi;
            _TradeStopLoss = tradeStopLoss;
            _WalletService = WalletService;
            _TradePairDetail = TradePairDetail;
            _WebApiRepository = WebApiRepository;
            _PoolOrder = PoolOrder;
            _TradePoolMaster = TradePoolMaster;
            _TradeBuyRequest = TradeBuyRequest;
            _TradeSellerList = TradeSellerList;
            _TradeBuyerList = TradeBuyerList;
            _SettlementRepository = SettlementRepository;
            _ISignalRService = ISignalRService;
            _tradePairStastics = tradePairStastics;
            Services = services;
            _trnMasterConfiguration = trnMasterConfiguration;
        }
        public async Task<BizResponse> ProcessNewTransactionAsync(NewTransactionRequestCls Req1)
        {
            Req = Req1;         

            _Resp =await CreateTransaction();
            if (_Resp.ReturnCode != enResponseCodeService.Success)
            {
                HelperForLog.WriteLogIntoFile("ProcessNewTransactionAsync", ControllerName, _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo);
                return _Resp;
            }
            //var myResp = new Task(async () => CombineAllInitTransactionAsync());
            //await Task.Run(() => CombineAllInitTransactionAsync());

            // MiddleWare();
            //return await Task.Run(() => CombineAllInitTransactionAsync());
            return await CombineAllInitTransactionAsync();

            //return await Task.FromResult(new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success, ErrorCode = enErrorCode.TransactionProcessSuccess });
            //_Resp = await MethodRespTsk;            
            // return new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success, ErrorCode = enErrorCode.TransactionProcessSuccess };
            //return _Resp;
        }
        //public async void MiddleWare()
        //{
        //    var df = await Task.Run(() => CombineAllInitTransactionAsync());
        //}

        public async Task<BizResponse> CombineAllInitTransactionAsync()
        {
            _Resp = new BizResponse();
            try
            {               
                //=========================PROCESS
                var Validation = await ValidateTransaction(_Resp);                

                if (!Validation) //Validation.Result//validation and balance check success
                {
                    HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Validation fail" + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo);
                    MarkTransactionSystemFail(_Resp.ReturnMsg, _Resp.ErrorCode);
                    //return Task.FromResult(_Resp);
                    return _Resp;
                }
                //14-11-18 already check in deduction
                //var BalResult = _WalletService.WalletBalanceCheck(Req.Amount, Req.DebitAccountID); //DI of Wallet for balance check
                //if (!BalResult) //validation and balance check success
                //{
                //    _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_InsufficientBalanceMsg;
                //    _Resp.ReturnCode = enResponseCodeService.Fail;
                //    _Resp.ErrorCode = enErrorCode.ProcessTrn_InsufficientBalance;
                //    MarkTransactionSystemFail(_Resp.ReturnMsg, _Resp.ErrorCode);
                //    HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Balance check Fail" + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo);
                //    return _Resp;
                //}
                //===================================Make txn HOLD as balance Not debited=======================
               // MakeTransactionInProcess();

                Req.ServiceType = enServiceType.Trading;
                Req.WalletTrnType = Req.TrnType == enTrnType.Buy_Trade ? enWalletTrnType.BuyTrade : enWalletTrnType.SellTrade;//enWalletTrnType.Dr_Trade Rita 16-1-19 change as wallet team changed enums

                //Deduct balance here
                HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Balance Deduction Start" + "##TrnNo:" + Req.TrnNo);
                var DebitResult = await _WalletService.GetWalletDeductionNew(Req.SMSCode, Helpers.GetTimeStamp(), enWalletTranxOrderType.Debit, Req.Amount, Req.MemberID,
                    Req.DebitAccountID, Req.TrnNo, Req.ServiceType, Req.WalletTrnType, Req.TrnType, Req.accessToken);

                HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Deduction End" + "##TrnNo:" + Req.TrnNo);

                if (DebitResult.ReturnCode == enResponseCode.Fail)
                {
                    _Resp.ReturnMsg = DebitResult.ReturnMsg;//EnResponseMessage.ProcessTrn_WalletDebitFailMsg;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ErrorCode = DebitResult.ErrorCode;//enErrorCode.ProcessTrn_WalletDebitFail;
                    MarkTransactionSystemFail(_Resp.ReturnMsg, _Resp.ErrorCode);
                    HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Balance Deduction Fail" + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo);
                    return _Resp;
                }

                //===================================Make txn HOLD as balance debited=======================
                MarkTransactionHold(EnResponseMessage.ProcessTrn_HoldMsg, enErrorCode.ProcessTrn_Hold);

                HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Trading Data Entry Start " + "##TrnNo:" + Req.TrnNo);
                //Make Trading Data Entry
                _Resp = await TradingDataInsert(_Resp);
                HelperForLog.WriteLogIntoFile("CombineAllInitTransactionAsync", ControllerName, "Trading Data Entry Done " + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo);

                //====================================Start Settlement Here
                //var HoldTrnNos = new List<long> { };  
                ParallelProcessTrns ParallelTrnsObj = new ParallelProcessTrns();
                //List<long> HoldTrnNos = new List<long> { };
                //ParallelTrnsObj.HoldTrnNos = HoldTrnNos;

                if (_Resp.ReturnCode == enResponseCodeService.Success)
                {
                    _Resp = await _SettlementRepository.PROCESSSETLLEMENT(_Resp, TradeBuyRequestObj, ParallelTrnsObj, Req.accessToken);
                    long processTrnNo = 0;
                    try
                    {//This try catch create wrapper for current transaction                            

                        BizResponse _Resp1 = new BizResponse();
                        var AllBuyerRequest = await _TradeBuyRequest.GetAllAsync();
                        //long LastTrnNo = ParallelTrnsObj.HoldTrnNos.Last();
                        foreach (long HoldTrnNo in ParallelTrnsObj.HoldTrnNos)
                        {
                            processTrnNo = HoldTrnNo;
                            //var NewBuyRequestObj = _TradeBuyRequest.GetSingle(item => item.TrnNo == HoldTrnNo && item.IsProcessing == 0 && item.IsCancel == 0 &&
                            //                                                (item.Status == Convert.ToInt16(enTransactionStatus.Hold) ||
                            //                                                item.Status == Convert.ToInt16(enTransactionStatus.Pending)));

                            var NewBuyRequestObj = AllBuyerRequest.Where(item => item.TrnNo == HoldTrnNo && item.IsProcessing == 0 && item.IsCancel == 0 &&
                                                                            (item.Status == Convert.ToInt16(enTransactionStatus.Hold) ||
                                                                            item.Status == Convert.ToInt16(enTransactionStatus.Pending))).FirstOrDefault();

                            if (NewBuyRequestObj != null)
                            {
                                //var HoldTrnNosNotExec = new List<long> { };
                                ParallelProcessTrns ParallelTrnsObjNotExec = new ParallelProcessTrns();
                                //await _SettlementRepository.PROCESSSETLLEMENT(_Resp1, NewBuyRequestObj, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request

                                using (var scope = Services.CreateScope())
                                {
                                    var _SettlementRepositoryNew = scope.ServiceProvider.GetRequiredService<ISettlementRepository<BizResponse>>();
                                    await _SettlementRepositoryNew.PROCESSSETLLEMENT(_Resp1, NewBuyRequestObj, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request
                                }
                                //if (HoldTrnNo.Equals(ParallelTrnsObj.HoldTrnNos.Last()))
                                //    await _SettlementRepository.PROCESSSETLLEMENT(_Resp1, NewBuyRequestObj, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request
                                //else
                                //    _SettlementRepository.PROCESSSETLLEMENT(_Resp1, NewBuyRequestObj, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request

                            }
                        }

                        //14-11-2018 take same pair old txn for process
                        IEnumerable<TradeBuyRequest> BuyRequestListHold;
                        //BuyRequestListHold = await _TradeBuyRequest.FindByAsync(item => item.IsProcessing == 0 && item.IsCancel == 0 && item.PairID == TradeBuyRequestObj.PairID &&
                        //                                                    (item.Status == Convert.ToInt16(enTransactionStatus.Hold)) && item.TrnNo != Req.TrnNo);

                        BuyRequestListHold = AllBuyerRequest.Where(item => item.IsProcessing == 0 && item.IsCancel == 0 && item.PairID == TradeBuyRequestObj.PairID &&
                                                                           (item.Status == Convert.ToInt16(enTransactionStatus.Hold)) && 
                                                                           item.TrnNo != Req.TrnNo).OrderBy(x => x.TrnNo).Take(5);
                        //var BuyRequestListHold1 = BuyRequestListHold.OrderBy(x => x.TrnNo).Take(5);
                        //var LastBuyReqObj = BuyRequestListHold.Last();
                        foreach (var BuyRequestHold in BuyRequestListHold)
                        {
                            if (ParallelTrnsObj.HoldTrnNos.Any(e => e == BuyRequestHold.TrnNo))//skip which is already process above
                                continue;

                            processTrnNo = BuyRequestHold.TrnNo;
                            ParallelProcessTrns ParallelTrnsObjNotExec = new ParallelProcessTrns();

                            //await _SettlementRepository.PROCESSSETLLEMENT(_Resp1, BuyRequestHold, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request
                            using (var scope = Services.CreateScope())
                            {
                                var _SettlementRepositoryNew = scope.ServiceProvider.GetRequiredService<ISettlementRepository<BizResponse>>();

                                await _SettlementRepositoryNew.PROCESSSETLLEMENT(_Resp1, BuyRequestHold, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request
                                //if (BuyRequestHold.Equals(BuyRequestListHold.Last()))
                                //    await _SettlementRepositoryNew.PROCESSSETLLEMENT(_Resp1, BuyRequestHold, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request
                                //else
                                //    _SettlementRepositoryNew.PROCESSSETLLEMENT(_Resp1, BuyRequestHold, ParallelTrnsObjNotExec);// no access tocken as no login this member in this request
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        HelperForLog.WriteErrorLog("CombineAllInitTransactionAsync:##TrnNo " + Req.TrnNo + " Process TrnNo" + processTrnNo, ControllerName, ex);
                    }
                }

                return _Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CombineAllInitTransactionAsync:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return Task.FromResult((new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionProcessInternalError }));
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionProcessInternalError });
            }            
        }

        #region RegionInitTransaction    
        public async Task<BizResponse> CreateTransaction()
        {
            try
            {
                HelperForLog.WriteLogIntoFile("CreateTransaction", ControllerName, "Transaction Process For" + Req.TrnType + "##TrnNo:" + Req.TrnNo);
                var GetWalletIDResult1 = _WalletService.GetWalletID(Req.DebitAccountID);
                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    _TradeTransactionObj.TrnTypeName = "BUY";
                }
                else
                {
                    _TradeTransactionObj.TrnTypeName = "SELL";
                }
                var GetWalletIDResult2 = _WalletService.GetWalletID(Req.CreditAccountID);

                //Req.DebitWalletID = _WalletService.GetWalletID(Req.DebitAccountID);
                Req.DebitWalletID = await GetWalletIDResult1;
                if (Req.DebitWalletID==0)
                {
                    Req.StatusMsg = EnResponseMessage.InValidDebitAccountIDMsg;
                    return MarkSystemFailTransaction(enErrorCode.InValidDebitAccountID);
                }
                HelperForLog.WriteLogIntoFile("CreateTransaction", ControllerName, "Debit WalletID" + Req.DebitWalletID + "##TrnNo:" + Req.TrnNo);
                //IF @PairID <> 0 ntrivedi 18-04-2018  check inside @TrnType (4,5) @TradeWalletMasterID will be 0 or null
                if (Req.ordertype == enTransactionMarketType.MARKET)
                {
                    var pairStastics = _tradePairStastics.GetSingle(pair => pair.PairId == Req.PairID);
                    Req.Price = pairStastics.LTP;
                }
                //Req.CreditWalletID = _WalletService.GetWalletID(Req.CreditAccountID);
                Req.CreditWalletID = await GetWalletIDResult2;
                if (Req.CreditWalletID == 0)
                {
                    Req.StatusMsg = EnResponseMessage.InValidCreditAccountIDMsg;
                    return MarkSystemFailTransaction(enErrorCode.InValidCreditAccountID);
                }
                HelperForLog.WriteLogIntoFile("CreateTransaction", ControllerName, "Credit WalletID" + Req.CreditWalletID + "##TrnNo:" + Req.TrnNo);
                //_TradePairObj = new TradePairMaster();
                //_TradePairObj = _TradePairMaster.GetSingle(item => item.Id == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active));
                _TradePairObj = _trnMasterConfiguration.GetTradePairMaster().Where(item => item.Id == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                if (_TradePairObj == null)
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnNoPairSelectedMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrn_NoPairSelected);
                }
                _TradeTransactionObj.PairName = _TradePairObj.PairName;
                //_TradePairDetailObj = _TradePairDetail.GetSingle(item => item.PairId == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active));
                _TradePairDetailObj = _trnMasterConfiguration.GetTradePairDetail().Where(item => item.PairId == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                if (_TradePairDetailObj == null)
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnNoPairSelectedMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrn_NoPairSelected);
                }
                if (Req.Qty <= 0 || Req.Price <= 0)
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidQtyPriceMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidQtyPrice);
                }
                _AllService =await _ServiceConfi.GetAllAsync();
                //_BaseCurrService = _ServiceConfi.GetSingle(item => item.Id == _TradePairObj.BaseCurrencyId);
                //_SecondCurrService = _ServiceConfi.GetSingle(item => item.Id == _TradePairObj.SecondaryCurrencyId);
                _BaseCurrService = _AllService.Where(item => item.Id == _TradePairObj.BaseCurrencyId).FirstOrDefault();
                _SecondCurrService = _AllService.Where(item => item.Id == _TradePairObj.SecondaryCurrencyId).FirstOrDefault();
                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    _TradeTransactionObj.BuyQty = Req.Qty;
                    _TradeTransactionObj.BidPrice = Req.Price;
                    _TradeTransactionObj.DeliveryTotalQty = Req.Qty;
                    _TradeTransactionObj.OrderTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 18);//235.415001286,8 =  235.41500129                         
                    _TradeTransactionObj.Order_Currency = _BaseCurrService.SMSCode;
                    _TradeTransactionObj.Delivery_Currency = _SecondCurrService.SMSCode;
                }
                if (Req.TrnType == enTrnType.Sell_Trade)
                {
                    _TradeTransactionObj.SellQty = Req.Qty;
                    _TradeTransactionObj.AskPrice = Req.Price;
                    _TradeTransactionObj.OrderTotalQty = Req.Qty;
                    _TradeTransactionObj.DeliveryTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 18);//235.415001286,8 =  235.41500129                        
                    _TradeTransactionObj.Order_Currency = _SecondCurrService.SMSCode;
                    _TradeTransactionObj.Delivery_Currency = _BaseCurrService.SMSCode;
                }
                if (_TradeTransactionObj.OrderTotalQty < (decimal)(0.00000001) || _TradeTransactionObj.DeliveryTotalQty < (decimal)(0.00000001))
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidQtyNAmountMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidQtyNAmount);
                }
                Req.SMSCode = _TradeTransactionObj.Order_Currency;
                //Balace check Here , take DeliveryWalletID output
                _TradeTransactionObj.DeliveryWalletID = Req.CreditWalletID;
                _TradeTransactionObj.OrderWalletID = Req.DebitWalletID;

                Req.Amount = _TradeTransactionObj.OrderTotalQty;
                //if (_TradeTransactionObj.DeliveryWalletID == 0)
                //{
                //    Req.StatusMsg = EnResponseMessage.CreateTrn_NoCreditAccountFoundMsg;
                //    return MarkSystemFailTransaction(enErrorCode.CreateTrn_NoCreditAccountFound);
                //}

                if (Req.Amount <= 0) // ntrivedi 02-11-2018 if amount =0 then also invalid
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidAmountMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidAmount);
                }            
                
                Req.Status = enTransactionStatus.Initialize;
                Req.StatusCode = Convert.ToInt64(enErrorCode.TransactionInsertSuccess);
                InsertTransactionInQueue();
                InsertTradeTransactionInQueue();
                InsertTradeStopLoss();
                return (new BizResponse { ReturnMsg = "", ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateTransaction:##TrnNo " + Req.TrnNo, ControllerName, ex);
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionInsertInternalError });
            }

        }
        public BizResponse MarkSystemFailTransaction(enErrorCode ErrorCode)
        {
            try
            {
                Req.Status = enTransactionStatus.SystemFail;
                Req.StatusCode = Convert.ToInt64(ErrorCode);
                InsertTransactionInQueue();
                InsertTradeStopLoss();
                try//as some para null in starting so error occured here ,only in case of system fail
                {
                    InsertTradeTransactionInQueue();
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteErrorLog("MarkSystemFailTransaction Trade TQ Error:##TrnNo " + Req.TrnNo, ControllerName, ex);
                }
               
                //DI of SMS here
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.Fail, ErrorCode = ErrorCode });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarkSystemFailTransaction:##TrnNo " + Req.TrnNo, ControllerName, ex);
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionInsertInternalError });
            }
        }
        public async Task InsertTransactionInQueue()//ref long TrnNo
        {
            //_Resp = new BizResponse();
            try
            {
                Newtransaction = new TransactionQueue()
                {
                    TrnDate = Helpers.UTC_To_IST(),
                    //GUID = Guid.NewGuid(),
                    GUID = Req.GUID,                    
                    TrnMode = Req.TrnMode,
                    TrnType = Convert.ToInt16(Req.TrnType),
                    MemberID = Req.MemberID,
                    MemberMobile = Req.MemberMobile,
                    TransactionAccount = Req.TransactionAccount,
                    SMSCode = Req.SMSCode,
                    Amount = Req.Amount,
                    Status = Convert.ToInt16(Req.Status),
                    StatusCode = Req.StatusCode,
                    StatusMsg = Req.StatusMsg,
                    TrnRefNo = Req.TrnRefNo,
                    AdditionalInfo = Req.AdditionalInfo
                };
                Newtransaction = _TransactionRepository.Add(Newtransaction);
                Req.TrnNo = Newtransaction.Id;
                //Req.GUID = Newtransaction.GUID;

               // return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTransactionInQueue:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        public async Task InsertTradeTransactionInQueue()
        {
            try
            {
                NewTradetransaction = new TradeTransactionQueue()
                {
                    TrnDate= Helpers.UTC_To_IST(),
                    TrnNo = Req.TrnNo,//NewTradetransactionReq.TrnNo,
                    TrnType = Convert.ToInt16(Req.TrnType),
                    TrnTypeName = _TradeTransactionObj.TrnTypeName,
                    MemberID = Req.MemberID,
                    PairID = Req.PairID,
                    PairName = _TradeTransactionObj.PairName,
                    OrderWalletID = _TradeTransactionObj.OrderWalletID,
                    DeliveryWalletID = _TradeTransactionObj.DeliveryWalletID,
                    OrderAccountID = Req.DebitAccountID,
                    DeliveryAccountID = Req.CreditAccountID,
                    BuyQty = _TradeTransactionObj.BuyQty,
                    BidPrice = _TradeTransactionObj.BidPrice,
                    SellQty = _TradeTransactionObj.SellQty,
                    AskPrice = _TradeTransactionObj.AskPrice,
                    Order_Currency = _TradeTransactionObj.Order_Currency,
                    OrderTotalQty = _TradeTransactionObj.OrderTotalQty,
                    Delivery_Currency = _TradeTransactionObj.Delivery_Currency,
                    DeliveryTotalQty = _TradeTransactionObj.DeliveryTotalQty,
                    SettledBuyQty = _TradeTransactionObj.SettledBuyQty,
                    SettledSellQty = _TradeTransactionObj.SettledSellQty,
                    Status = Convert.ToInt16(Req.Status),
                    StatusCode = Req.StatusCode,
                    StatusMsg = Req.StatusMsg
                };
                NewTradetransaction=_TradeTransactionRepository.Add(NewTradetransaction);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTradeTransactionInQueue:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        public async Task InsertTradeStopLoss()
        {
            try
            {
                TradeStopLossObj = new TradeStopLoss()
                {
                    TrnNo = Req.TrnNo,
                    ordertype = Convert.ToInt16(Req.ordertype),
                    StopPrice = Req.StopPrice,
                    Status = Convert.ToInt16(enTransactionStatus.Success)
                };
                TradeStopLossObj =_TradeStopLoss.Add(TradeStopLossObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTradeStopLoss:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        #endregion        

        #region RegionProcessTransaction
        public async Task<Boolean> ValidateTransaction(BizResponse _Resp)
        {
            _TransactionObj =new ProcessTransactionCls();
            //Member Service Disable check here for regular txn
            try
            {
               var GetProListResult = _WebApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest { amount = Req.Amount, SMSCode = Req.SMSCode, APIType = enWebAPIRouteType.TransactionAPI, trnType = Req.TrnType == enTrnType.Sell_Trade ? Convert.ToInt32(enTrnType.Buy_Trade) : Convert.ToInt32(Req.TrnType) });
                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    _TransactionObj.BidPrice_TQ = _TradeTransactionObj.BidPrice;
                    _TransactionObj.BidPrice_BuyReq = Helpers.DoRoundForTrading(1 / _TradeTransactionObj.BidPrice, 18);
                    //_TradePairDetailObj
                    if (_TradeTransactionObj.BuyQty < _TradePairDetailObj.BuyMinQty || _TradeTransactionObj.BuyQty > _TradePairDetailObj.BuyMaxQty)
                    {
                        _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.BuyMinQty.ToString()).Replace("@MAX", _TradePairDetailObj.BuyMaxQty.ToString());
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax;
                        //return Task.FromResult(false);
                        return false;
                    }
                    if (_TradeTransactionObj.BidPrice < _TradePairDetailObj.BuyMinPrice || _TradeTransactionObj.BidPrice > _TradePairDetailObj.BuyMaxPrice)
                    {
                        _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_PriceBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.BuyMinPrice.ToString()).Replace("@MAX", _TradePairDetailObj.BuyMaxPrice.ToString());
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ErrorCode = enErrorCode.ProcessTrn_PriceBetweenMinMax;
                        return false;
                    }
                    _TransactionObj.Delivery_ServiceID = _SecondCurrService.Id;
                    _TransactionObj.Order_ServiceID = _BaseCurrService.Id;

                }
                else if (Req.TrnType == enTrnType.Sell_Trade)
                {
                    _TransactionObj.BidPrice_TQ = Helpers.DoRoundForTrading(1 / _TradeTransactionObj.AskPrice, 18);
                    _TransactionObj.BidPrice_BuyReq = _TradeTransactionObj.AskPrice;
                    //_TradePairDetailObj
                    if (_TradeTransactionObj.SellQty < _TradePairDetailObj.SellMinQty || _TradeTransactionObj.SellQty > _TradePairDetailObj.SellMaxQty)
                    {
                        _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.SellMinQty.ToString()).Replace("@MAX", _TradePairDetailObj.SellMaxQty.ToString());
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ErrorCode = enErrorCode.ProcessTrn_AmountBetweenMinMax;
                        return false;
                    }
                    if (_TradeTransactionObj.AskPrice < _TradePairDetailObj.SellMinPrice || _TradeTransactionObj.AskPrice > _TradePairDetailObj.SellMaxPrice)
                    {
                        _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_PriceBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.SellMinPrice.ToString()).Replace("@MAX", _TradePairDetailObj.SellMaxPrice.ToString());
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ErrorCode = enErrorCode.ProcessTrn_PriceBetweenMinMax;
                        return false;
                    }
                    _TransactionObj.Delivery_ServiceID = _BaseCurrService.Id;
                    _TransactionObj.Order_ServiceID = _SecondCurrService.Id;

                }
                if (_TransactionObj.BidPrice_TQ == 0 || _TransactionObj.BidPrice_BuyReq == 0)
                {
                    _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_InvalidBidPriceValueMsg;
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_InvalidBidPriceValue;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    return false;
                }
                //_TransactionObj.Delivery_ServiceID = _ServiceConfi.GetSingle(item => item.SMSCode == _TradeTransactionObj.Delivery_Currency).Id;                   
                await CreatePoolOrder();
                if (PoolOrderObj == null)
                {
                    _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_PoolOrderCreateFailMsg;
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_PoolOrderCreateFail;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    return false;
                }
                TxnProviderList = await GetProListResult;
                if (TxnProviderList.Count == 0) //Uday 05-11-2018 check condition for no record
                {
                    _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_ServiceProductNotAvailableMsg;
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_ServiceProductNotAvailable;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    return false;
                }
                //Make Transaction Initialise
                //var Txn = _TransactionRepository.GetById(Req.TrnNo);
                //Newtransaction.MakeTransactionInProcess();
                //Newtransaction.SetTransactionStatusMsg(EnResponseMessage.ProcessTrn_InitializeMsg);
                //Newtransaction.SetTransactionCode(Convert.ToInt64(enErrorCode.ProcessTrn_Initialize));
                //_TransactionRepository.Update(Newtransaction);
                //Take Provider Configuration           

                return true;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ValidateTransaction:##TrnNo " + Req.TrnNo, ControllerName, ex);
                return false;
            }
        }
        public async void MarkTransactionSystemFail(string StatusMsg,enErrorCode ErrorCode)
        {
            try
            {
                //var Txn = _TransactionRepository.GetById(Req.TrnNo);
                Newtransaction.MakeTransactionSystemFail();
                Newtransaction.SetTransactionStatusMsg(StatusMsg);
                Newtransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TransactionRepository.Update(Newtransaction);

                //var TradeTxn = _TradeTransactionRepository.GetById(Req.TrnNo);
                NewTradetransaction.MakeTransactionSystemFail();
                NewTradetransaction.SetTransactionStatusMsg(StatusMsg);
                NewTradetransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TradeTransactionRepository.Update(NewTradetransaction);
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("MarkTransactionSystemFail:##TrnNo " + Req.TrnNo, ControllerName, ex);
               // throw ex;
            } 
        }
        public async Task MarkTransactionHold(string StatusMsg, enErrorCode ErrorCode)
        { 
            try
            {
                //var Txn = _TransactionRepository.GetById(Req.TrnNo);
                Newtransaction.MakeTransactionHold();
                Newtransaction.SetTransactionStatusMsg(StatusMsg);
                Newtransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TransactionRepository.Update(Newtransaction);
                NewTradetransaction.MakeTransactionHold();
                NewTradetransaction.SetTransactionStatusMsg(StatusMsg);
                NewTradetransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TradeTransactionRepository.Update(NewTradetransaction);
                try
                {
                    var CopyNewtransaction = new TransactionQueue();
                    CopyNewtransaction = (TransactionQueue)Newtransaction.Clone();
                    //CopyNewtransaction.MakeTransactionHold();

                    var CopyNewTradetransaction = new TradeTransactionQueue();
                    CopyNewTradetransaction = (TradeTransactionQueue)NewTradetransaction.Clone();
                    //CopyNewTradetransaction.MakeTransactionHold();
                    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "parallel execution pre ##TrnNo:");
                    Parallel.Invoke(() => _ISignalRService.OnStatusHold(Convert.ToInt16(enTransactionStatus.Success), CopyNewtransaction, CopyNewTradetransaction, Req.accessToken, TradeStopLossObj.ordertype));
                    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "parallel execution complete ##TrnNo:");
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Trading Hold Error " + ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                }
                //try
                //{
                //    var CopyNewtransaction = new TransactionQueue();
                //    CopyNewtransaction = (TransactionQueue)Newtransaction.Clone();

                //    var CopyNewTradetransaction = new TradeTransactionQueue();
                //    CopyNewTradetransaction = (TradeTransactionQueue)NewTradetransaction.Clone();

                //    _ISignalRService.OnStatusHold(Convert.ToInt16(enTransactionStatus.Success), CopyNewtransaction, CopyNewTradetransaction, Req.accessToken, TradeStopLossObj.ordertype);
                //}
                //catch (Exception ex)
                //{
                //    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Trading Hold Error " + ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                //}

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarkTransactionHold:##TrnNo " + Req.TrnNo, ControllerName, ex);
                throw ex;
            }
        }

        public async Task MakeTransactionInProcess()
        {
            try
            {
                //var Txn = _TransactionRepository.GetById(Req.TrnNo);
                Newtransaction.MakeTransactionInProcess();
                Newtransaction.SetTransactionStatusMsg(EnResponseMessage.ProcessTrn_InitializeMsg);              
                Newtransaction.SetTransactionCode(Convert.ToInt64(enErrorCode.ProcessTrn_Initialize));
                _TransactionRepository.UpdateAsync(Newtransaction);

                NewTradetransaction.MakeTransactionInProcess();
                NewTradetransaction.SetTransactionStatusMsg(EnResponseMessage.ProcessTrn_InitializeMsg);
                NewTradetransaction.SetTransactionCode(Convert.ToInt64(enErrorCode.ProcessTrn_Initialize));
                NewTradetransaction.MakeTransactionHold();
                _TradeTransactionRepository.UpdateAsync(NewTradetransaction);
                try
                {
                    var CopyNewtransaction = new TransactionQueue();
                    CopyNewtransaction = (TransactionQueue)Newtransaction.Clone();
                    CopyNewtransaction.MakeTransactionHold();

                    var CopyNewTradetransaction = new TradeTransactionQueue();
                    CopyNewTradetransaction = (TradeTransactionQueue)NewTradetransaction.Clone();
                    CopyNewTradetransaction.MakeTransactionHold();
                    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "parallel execution pre ##TrnNo:");
                    Parallel.Invoke(() => _ISignalRService.OnStatusHold(Convert.ToInt16(enTransactionStatus.Success), CopyNewtransaction, CopyNewTradetransaction, Req.accessToken, TradeStopLossObj.ordertype));
                    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "parallel execution complete ##TrnNo:");
                }
                catch (Exception ex)
                {
                    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Trading Hold Error " + ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                }

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("MarkTransactionHold:##TrnNo " + Req.TrnNo, ControllerName, ex);
                throw ex;
            }
        }
        //public async void MarkTransactionOperatorFail(string StatusMsg, enErrorCode ErrorCode)
        //{
        //    //CreditWalletDrArryTrnID[] CreditWalletDrArryTrnIDObj = new CreditWalletDrArryTrnID[1];
        //    List<CreditWalletDrArryTrnID> CreditWalletDrArryTrnIDList = new List<CreditWalletDrArryTrnID>();
        //    try
        //    {
        //        //var Txn = _TransactionRepository.GetById(Req.TrnNo);
        //        Newtransaction.MakeTransactionOperatorFail();
        //        Newtransaction.SetTransactionStatusMsg(StatusMsg);
        //        Newtransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
        //        _TransactionRepository.Update(Newtransaction);

        //        //Cr Amount to member back
        //        //CreditWalletDrArryTrnIDObj[0].DrTrnRefNo = Req.TrnNo;
        //        //CreditWalletDrArryTrnIDObj[0].Amount = Req.Amount;
        //        CreditWalletDrArryTrnIDList.Add(new CreditWalletDrArryTrnID { DrTrnRefNo = Req.TrnNo, Amount = Req.Amount });


        //        _WalletService.GetWalletCreditNew(Req.SMSCode, Helpers.GetTimeStamp(), enWalletTrnType.Cr_Refund, Req.Amount, Req.MemberID,
        //        Req.DebitAccountID, CreditWalletDrArryTrnIDList.ToArray(), Req.TrnNo,1, enWalletTranxOrderType.Credit, Req.ServiceType, (enTrnType)Newtransaction.TrnType);

        //        try
        //        {
        //            //komal 16-11-2018 add Activity Notifiation v2
        //            ActivityNotificationMessage notification = new ActivityNotificationMessage();
        //            notification.MsgCode = Convert.ToInt32(enErrorCode.TransactionFailed);
        //            notification.Param1 = Req.TrnNo.ToString();
        //            _ISignalRService.SendActivityNotificationV2(notification, Req.accessToken);
        //            //_ISignalRService.SendActivityNotification("Transaction Failed TrnNo:" + Req.TrnNo, Req.accessToken);
        //        }
        //        catch (Exception ex)
        //        {
        //            HelperForLog.WriteLogIntoFile("ISignalRService Notification Error--Operator fail", ControllerName, ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("MarkTransactionOperatorFail:##TrnNo " + Req.TrnNo, ControllerName, ex);
        //        throw ex;
        //    }
        //}     
        #endregion

        #region Settlement Insert Data
        public async Task CreatePoolOrder()
        {
            try
            {
                PoolOrderObj = new PoolOrder()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = Req.MemberID,                   
                    UserID = Req.MemberID,
                    DMemberID = Req.MemberID, //Member/User gives Amount to Pool
                    TrnNo = Req.TrnNo,
                    TrnMode = Req.TrnMode,
                    PayMode = Convert.ToInt16(enWebAPIRouteType.TradeServiceLocal),
                    ORemarks = "Order Created",
                    OrderAmt = Req.Amount,
                    DiscPer = 0,
                    DiscRs = 0,                   
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
                    UserWalletID = Req.DebitWalletID,
                    UserWalletAccID = Req.DebitAccountID,                  
                };
                PoolOrderObj = _PoolOrder.Add(PoolOrderObj);              

                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreatePoolOrder:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        public void Tradepoolmaster()
        {
            try
            {
                TradePoolMasterObj = new TradePoolMaster()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = Req.MemberID,
                    PairName = _TradeTransactionObj.PairName,
                    ProductID = Convert.ToInt16(enWebAPIRouteType.TradeServiceLocal),
                    SellServiceID = _TransactionObj.Order_ServiceID,
                    BuyServiceID = _TransactionObj.Delivery_ServiceID,
                    BidPrice = _TransactionObj.BidPrice_TQ,
                    CountPerPrice = 0,
                    Status = Convert.ToInt16(ServiceStatus.Active),//Record Type Status
                    TotalQty = Req.Amount,
                    OnProcessing = 0,                   
                    TPSPickupStatus = 0,
                    IsSleepMode = 0,
                    GUID = Guid.NewGuid(),
                    PairId = Req.PairID,
                };
                TradePoolMasterObj = _TradePoolMaster.Add(TradePoolMasterObj);                
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("Tradepoolmaster:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        public async void InsertSellerList()
        {
            try
            {
                TradeSellerListObj = new TradeSellerList()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = Req.MemberID,
                    TrnNo = Req.TrnNo,
                    PoolID = TradePoolMasterObj.Id,
                    SellServiceID = TradePoolMasterObj.SellServiceID,
                    BuyServiceID = TradePoolMasterObj.BuyServiceID,
                    Price = TradePoolMasterObj.BidPrice,
                    Qty = Req.Amount,//take trnno amount as pool as total amount
                    RemainQty = Req.Amount,
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
                };
                TradeSellerListObj = _TradeSellerList.Add(TradeSellerListObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("Tradepoolmaster:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
       
        public void TradeBuyRequest()
        {
            try
            {
                TradeBuyRequestObj = new TradeBuyRequest()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    PickupDate = Helpers.UTC_To_IST(),
                    CreatedBy = Req.MemberID,
                    UserID = Req.MemberID,
                    TrnNo = Req.TrnNo,
                    PairID = Req.PairID,                   
                    ServiceID = _TransactionObj.Delivery_ServiceID,
                    PaidServiceID = _TransactionObj.Order_ServiceID,
                    BidPrice = _TransactionObj.BidPrice_BuyReq,
                    Qty = _TradeTransactionObj.DeliveryTotalQty,                   
                    PaidQty = _TradeTransactionObj.OrderTotalQty,
                    PendingQty = _TradeTransactionObj.DeliveryTotalQty,
                    DeliveredQty = 0,
                    IsCancel = 0,
                    IsPartialProceed = 0,
                    IsProcessing=0,
                    SellStockID = TradePoolMasterObj.Id,
                    BuyStockID = 0,//No use as process with multiple stock
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),
                };
                TradeBuyRequestObj = _TradeBuyRequest.Add(TradeBuyRequestObj);

                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("Tradepoolmaster:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        public async void InsertBuyerList()
        {
            try
            {
               var TradeBuyerListObj = new TradeBuyerList()
                {
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = Req.MemberID,
                    TrnNo = Req.TrnNo,
                    BuyReqID = TradeBuyRequestObj.Id,
                    ServiceID = TradeBuyRequestObj.ServiceID,
                    PaidServiceID = TradeBuyRequestObj.PaidServiceID,
                    Price = TradeBuyRequestObj.BidPrice,
                    Qty = TradeBuyRequestObj.Qty, //same as request as one entry per one request
                    IsProcessing = 0,
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
                };
                TradeBuyerListObj = _TradeBuyerList.Add(TradeBuyerListObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("Tradepoolmaster:##TrnNo " + Req.TrnNo, ControllerName, ex);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        
        public Task<BizResponse> TradingDataInsert(BizResponse _Resp)
        {
            try
            {
                _Resp.ReturnCode = enResponseCodeService.Fail;//temp init
                foreach (TransactionProviderResponse Provider in TxnProviderList)//Make txn on every API
                {
                    //Update Service Provider Data
                    Newtransaction.SetServiceProviderData(Provider.ServiceID, Provider.ServiceProID, Provider.ProductID, Provider.RouteID);

                    //===========POOL==================
                    TradePoolMasterObj = _TradePoolMaster.GetSingle(item => item.BidPrice == _TransactionObj.BidPrice_TQ && 
                                                        item.SellServiceID == _TransactionObj.Order_ServiceID && 
                                                        item.BuyServiceID == _TransactionObj.Delivery_ServiceID &&
                                                        item.Status == Convert.ToInt16(ServiceStatus.Active));
                    if (TradePoolMasterObj != null)//Update
                    {
                        TradePoolMasterObj.TotalQty += Req.Amount;
                        TradePoolMasterObj.UpdatedBy = Req.MemberID;
                        TradePoolMasterObj.UpdatedDate = Helpers.UTC_To_IST();
                        _TradePoolMaster.Update(TradePoolMasterObj);
                        _Resp.ReturnMsg = "PoolMaster Record updated";
                    }
                    else//Make new Pool Entry
                    {
                        Tradepoolmaster();
                        _Resp.ReturnMsg = "PoolMaster Record Inserted";
                    }
                    //Insert into seller list
                    InsertSellerList();
                    _Resp.ReturnMsg = "Seller Entry Inserted";

                    PoolOrderObj.PoolID = TradePoolMasterObj.Id;
                    PoolOrderObj.OMemberID = TradePoolMasterObj.Id;//Pool takes amount from member
                    PoolOrderObj.DeliveryAmt = Req.Amount;
                    PoolOrderObj.DRemarks = "Delivery Success with " + _TransactionObj.BidPrice_TQ;
                    PoolOrderObj.Status = Convert.ToInt16(enTransactionStatus.Success);                    
                    _PoolOrder.Update(PoolOrderObj);
                    _Resp.ReturnMsg = "Pool Order Updated Inserted";

                    
                    //=======================Buy Request
                    TradeBuyRequest();
                    InsertBuyerList();

                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "Pool Order Updated Inserted";
                    //try
                    //{
                    //    var CopyNewtransaction = new TransactionQueue();
                    //    CopyNewtransaction = (TransactionQueue)Newtransaction.Clone();

                    //    var CopyNewTradetransaction = new TradeTransactionQueue();                      
                    //    CopyNewTradetransaction = (TradeTransactionQueue)NewTradetransaction.Clone();

                    //    _ISignalRService.OnStatusHold(Convert.ToInt16(enTransactionStatus.Success), CopyNewtransaction, CopyNewTradetransaction, Req.accessToken, TradeStopLossObj.ordertype);                        
                    //}
                    //catch (Exception ex)
                    //{
                    //    HelperForLog.WriteLogIntoFile("ISignalRService", ControllerName, "Trading Hold Error " + ex.Message + "##TrnNo:" + TradeBuyRequestObj.TrnNo);
                    //}
                    break;
                }              
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("TradingDataInsert:##TrnNo " + Req.TrnNo, ControllerName, ex);
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = ex.Message;
                //throw ex;
            }
            return Task.FromResult(_Resp);
        }
        #endregion
    }
}
