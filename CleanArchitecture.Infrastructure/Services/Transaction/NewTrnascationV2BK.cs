using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Services.Transaction
{
    public class NewTransactionV2BK : ITransactionProcessV1
    {
        private readonly ICommonRepository<TransactionQueue> _TransactionRepository;
        private readonly ICommonRepository<TradeTransactionQueue> _TradeTransactionRepository;
        private readonly ICommonRepository<TradeStopLoss> _TradeStopLoss;
        private readonly ICommonRepository<TradeSellerListV1> _TradeSellerList;
        private readonly ICommonRepository<TradeBuyerListV1> _TradeBuyerList;
        private readonly ICommonRepository<TradePairStastics> _tradePairStastics;
        private readonly IWalletService _WalletService;
        private readonly IWebApiRepository _WebApiRepository;
        private readonly ISettlementRepositoryV1<BizResponse> _SettlementRepositoryV1;
        private readonly ISignalRService _ISignalRService;
        private readonly ITrnMasterConfiguration _trnMasterConfiguration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMessageService _messageService;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        // khuhsali liquidity API
        private readonly IWebApiData _IWebApiData;
        private readonly IGetWebRequest _IGetWebRequest;
        private readonly IWebApiSendRequest _IWebApiSendRequest;
        private readonly ICommonRepository<TransactionRequest> _TransactionRequest;

        public BizResponse _Resp;
        public TradePairMaster _TradePairObj;
        public TradePairDetail _TradePairDetailObj;
        public List<TransactionProviderResponse> TxnProviderList;
        TransactionQueue Newtransaction;
        TradeTransactionQueue NewTradetransaction;
        NewTransactionRequestCls Req;
        NewTradeTransactionRequestCls _TradeTransactionObj = new NewTradeTransactionRequestCls();
        ServiceMaster _BaseCurrService;
        ServiceMaster _SecondCurrService;
        TradeSellerListV1 TradeSellerListObj;
        TradeBuyerListV1 TradeBuyerListObj;
        TradeStopLoss TradeStopLossObj;
        private string ControllerName = "TradingTransactionV1";
        // public IServiceProvider Services { get; }  
        short STOPLimitWithSameLTP = 0;
        WebApiParseResponse _WebApiParseResponseObj;
        TransactionRequest NewtransactionReq;
        ProcessTransactionCls _TransactionObj;

        public NewTransactionV2BK(
            ICommonRepository<TransactionQueue> TransactionRepository,
            ICommonRepository<TradeTransactionQueue> TradeTransactionRepository,
            ICommonRepository<TradeStopLoss> tradeStopLoss, IWalletService WalletService, IWebApiRepository WebApiRepository,
            ICommonRepository<TradeSellerListV1> TradeSellerList,
            ICommonRepository<TradeBuyerListV1> TradeBuyerList, ISettlementRepositoryV1<BizResponse> SettlementRepositoryV1,
            ISignalRService ISignalRService, ICommonRepository<TradePairStastics> tradePairStastics,//IServiceProvider services, 
            ITrnMasterConfiguration trnMasterConfiguration, UserManager<ApplicationUser> userManager,
            IMessageService messageService, IPushNotificationsQueue<SendSMSRequest> pushSMSQueue,
            IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, IWebApiData IWebApiData,
            IGetWebRequest IGetWebRequest, IWebApiSendRequest WebApiSendRequest, WebApiParseResponse WebApiParseResponseObj,
            ICommonRepository<TransactionRequest> TransactionRequest)
        {
            _TransactionRepository = TransactionRepository;
            _TradeTransactionRepository = TradeTransactionRepository;
            _TradeStopLoss = tradeStopLoss;
            _WalletService = WalletService;
            _WebApiRepository = WebApiRepository;
            _TradeSellerList = TradeSellerList;
            _TradeBuyerList = TradeBuyerList;
            _SettlementRepositoryV1 = SettlementRepositoryV1;
            _ISignalRService = ISignalRService;
            _tradePairStastics = tradePairStastics;
            //Services = services;
            _trnMasterConfiguration = trnMasterConfiguration;
            _userManager = userManager;
            _messageService = messageService;
            _pushSMSQueue = pushSMSQueue;
            _pushNotificationsQueue = pushNotificationsQueue;
            // khushali khushali liquidity 
            _IGetWebRequest = IGetWebRequest;
            _IWebApiData = IWebApiData;
            _WebApiParseResponseObj = WebApiParseResponseObj;
            _TransactionRequest = TransactionRequest;
        }
        public async Task<BizResponse> ProcessNewTransactionAsync(NewTransactionRequestCls Req1)
        {
            //_SettlementRepositoryV1.Callsp_TradeSettlement(3518, 3518,10,10,10,13,2);
            //int ss = 1;
            //if (ss == 1)
            //    return new BizResponse();
            Req = Req1;

            _Resp = await CreateTransaction();
            if (_Resp.ReturnCode != enResponseCodeService.Success)
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ProcessNewTransactionAsync", ControllerName, _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo + " GUID:" + Req.GUID, Helpers.UTC_To_IST()));
                return _Resp;
            }
            _Resp = await CombineAllInitTransactionAsync();

            return _Resp;
        }

        public async Task<BizResponse> CombineAllInitTransactionAsync()
        {
            _Resp = new BizResponse();
            try
            {
                //await InsertTransactionInQueue();
                //Req.ServiceType = enServiceType.Trading;
                //Req.WalletTrnType = enWalletTrnType.Dr_Sell_Trade;

                //Deduct balance here
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync Wallet", ControllerName, "Balance Deduction Start " + Req.GUID + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));

                var DebitResult1 = _WalletService.GetWalletHoldNew(Req.SMSCode, Helpers.GetTimeStamp(), Req.Amount,
                    Req.DebitAccountID, Req.TrnNo, enServiceType.Trading, Req.TrnType == enTrnType.Buy_Trade ? enWalletTrnType.BuyTrade : enWalletTrnType.SellTrade, Req.TrnType, (EnAllowedChannels)Req.TrnMode, Req.accessToken, (enWalletDeductionType)((short)Req.ordertype)); //NTRIVEDI 07-12-2018               

                TradingDataInsert(_Resp);
                var DebitResult = await DebitResult1;
                //Req.Status = enTransactionStatus.Initialize;
                //Req.StatusCode = Convert.ToInt64(enErrorCode.TransactionInsertSuccess);                
                //InsertTradeTransactionInQueue();
                //InsertTradeStopLoss();

                //var DebitResult = await DebitResults;
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync Wallet", ControllerName, "Deduction End" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));

                if (DebitResult.ReturnCode != enResponseCode.Success)
                {
                    _Resp.ReturnMsg = DebitResult.ReturnMsg;//EnResponseMessage.ProcessTrn_WalletDebitFailMsg;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ErrorCode = DebitResult.ErrorCode;//enErrorCode.ProcessTrn_WalletDebitFail;
                    MarkTransactionSystemFail(_Resp.ReturnMsg, _Resp.ErrorCode);
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Balance Deduction Fail" + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                    return _Resp;
                }
                //===================================Make txn HOLD as balance debited=======================
                //if (Req.TrnType == enTrnType.Buy_Trade)
                //{

                //}
                //else
                //{

                //}
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Update Service Start" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));

                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Trading Data Entry Done " + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "End Service" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "HOLD Start" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                Task.Run(() => MarkTransactionHold(EnResponseMessage.ProcessTrn_HoldMsg, enErrorCode.ProcessTrn_Hold));


                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Trading Data Entry Start " + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));

                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    //await InsertBuyerList();
                    TradeBuyerListObj.TrnNo = Req.TrnNo;
                    TradeBuyerListObj = _TradeBuyerList.Add(TradeBuyerListObj);
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Buyer" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                    if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                    {
                        _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTBuy(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeBuyerListObj, Req.accessToken, 0);
                    }
                }
                else
                {
                    //await InsertSellerList();
                    TradeSellerListObj.TrnNo = Req.TrnNo;
                    TradeSellerListObj = _TradeSellerList.Add(TradeSellerListObj);
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Seller" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                    if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                    {
                        _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTSell(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeSellerListObj, Req.accessToken, 0);
                    }
                }
                Task.Delay(10000).Wait();//rita 3-1-19 wait for all operations done
                return _Resp;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CombineAllInitTransactionAsync Internal Error:##TrnNo " + Req.TrnNo, ControllerName, ex);
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionProcessInternalError });
            }
        }

        #region RegionInitTransaction    
        public async Task<BizResponse> CreateTransaction()
        {
            try
            {
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CreateTransaction", ControllerName, "Transaction Process For" + Req.TrnType + "##TrnNo:" + Req.GUID, Helpers.UTC_To_IST()));
                _TradePairObj = _trnMasterConfiguration.GetTradePairMaster().Where(item => item.Id == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                if (_TradePairObj == null)
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnNoPairSelectedMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrn_NoPairSelected);
                }
                var pairStasticsResult = _tradePairStastics.GetSingleAsync(pair => pair.PairId == Req.PairID);
                _TradeTransactionObj.PairName = _TradePairObj.PairName;
                var LoadDataResult = LoadAllMasterDataParaller();

                var GetWalletIDResult1 = _WalletService.GetWalletID(Req.DebitAccountID);
                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    _TradeTransactionObj.TrnTypeName = "BUY";
                }
                else
                {
                    _TradeTransactionObj.TrnTypeName = "SELL";
                }
                if (Convert.ToInt16(Req.ordertype) < 1 || Convert.ToInt16(Req.ordertype) > 5)
                {
                    Req.StatusMsg = EnResponseMessage.InValidOrderTypeMsg;
                    return MarkSystemFailTransaction(enErrorCode.InValidOrderType);
                }
                var GetWalletIDResult2 = _WalletService.GetWalletID(Req.CreditAccountID);

                Req.DebitWalletID = await GetWalletIDResult1;
                if (Req.DebitWalletID == 0)
                {
                    Req.StatusMsg = EnResponseMessage.InValidDebitAccountIDMsg;
                    return MarkSystemFailTransaction(enErrorCode.InValidDebitAccountID);
                }
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CreateTransaction", ControllerName, "Debit WalletID" + Req.DebitWalletID + "##TrnNo:" + Req.GUID, Helpers.UTC_To_IST()));
                var pairStastics = await pairStasticsResult;
                //IF @PairID <> 0 ntrivedi 18-04-2018  check inside @TrnType (4,5) @TradeWalletMasterID will be 0 or null
                if (Req.ordertype == enTransactionMarketType.MARKET)
                {
                    // var pairStastics =await _tradePairStastics.GetSingleAsync(pair => pair.PairId == Req.PairID);                   
                    Req.Price = pairStastics.LTP;
                }
                _TradeTransactionObj.OrderWalletID = Req.DebitWalletID;

                Req.CreditWalletID = await GetWalletIDResult2;
                if (Req.CreditWalletID == 0)
                {
                    Req.StatusMsg = EnResponseMessage.InValidCreditAccountIDMsg;
                    return MarkSystemFailTransaction(enErrorCode.InValidCreditAccountID);
                }
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CreateTransaction", ControllerName, "Credit WalletID" + Req.CreditWalletID + "##TrnNo:" + Req.GUID, Helpers.UTC_To_IST()));

                _TradeTransactionObj.DeliveryWalletID = Req.CreditWalletID;


                //_TradePairObj = _trnMasterConfiguration.GetTradePairMaster().Where(item => item.Id == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                //if (_TradePairObj == null)
                //{
                //    Req.StatusMsg = EnResponseMessage.CreateTrnNoPairSelectedMsg;
                //    return MarkSystemFailTransaction(enErrorCode.CreateTrn_NoPairSelected);
                //}
                //_TradeTransactionObj.PairName = _TradePairObj.PairName;
                if (Req.Qty <= 0 || (Req.Price <= 0 && Req.ordertype != enTransactionMarketType.MARKET) || (Req.StopPrice == 0 && Req.ordertype == enTransactionMarketType.STOP_Limit))
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidQtyPriceMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidQtyPrice);
                }
                await LoadDataResult;
                //_BaseCurrService = _trnMasterConfiguration.GetServices().Where(item => item.Id == _TradePairObj.BaseCurrencyId).FirstOrDefault();
                //_SecondCurrService = _trnMasterConfiguration.GetServices().Where(item => item.Id == _TradePairObj.SecondaryCurrencyId).FirstOrDefault();

                //_TradePairDetailObj = _trnMasterConfiguration.GetTradePairDetail().Where(item => item.PairId == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
                if (_TradePairDetailObj == null)
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnNoPairSelectedMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrn_NoPairSelected);
                }
                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    _TradeTransactionObj.BuyQty = Req.Qty;
                    _TradeTransactionObj.BidPrice = Req.ordertype == enTransactionMarketType.MARKET ? 0 : Req.Price;
                    var AssRes = AssignDataBuy();
                    //_TradeTransactionObj.DeliveryTotalQty = Req.Qty;
                    //_TradeTransactionObj.OrderTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 8);//235.415001286,8 =  235.41500129                         
                    //_TradeTransactionObj.Order_Currency = _BaseCurrService.SMSCode;
                    //_TradeTransactionObj.Delivery_Currency = _SecondCurrService.SMSCode;
                    //Req.SMSCode = _TradeTransactionObj.Order_Currency;
                    //Req.Amount = _TradeTransactionObj.OrderTotalQty;
                    if (_TradeTransactionObj.BuyQty < _TradePairDetailObj.BuyMinQty || _TradeTransactionObj.BuyQty > _TradePairDetailObj.BuyMaxQty)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.BuyMinQty.ToString()).Replace("@MAX", _TradePairDetailObj.BuyMaxQty.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_AmountBetweenMinMax);
                    }
                    if ((_TradeTransactionObj.BidPrice < _TradePairDetailObj.BuyMinPrice || _TradeTransactionObj.BidPrice > _TradePairDetailObj.BuyMaxPrice) && Req.ordertype != enTransactionMarketType.MARKET)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_PriceBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.BuyMinPrice.ToString()).Replace("@MAX", _TradePairDetailObj.BuyMaxPrice.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_PriceBetweenMinMax);
                    }
                    await AssRes;
                    Task.Run(() => InsertBuyerList());
                }
                else if (Req.TrnType == enTrnType.Sell_Trade)
                {
                    _TradeTransactionObj.SellQty = Req.Qty;
                    _TradeTransactionObj.AskPrice = Req.ordertype == enTransactionMarketType.MARKET ? 0 : Req.Price;
                    var AssRes = AssignDataSell();
                    //_TradeTransactionObj.OrderTotalQty = Req.Qty;
                    //_TradeTransactionObj.DeliveryTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 8);//235.415001286,8 =  235.41500129                        
                    //_TradeTransactionObj.Order_Currency = _SecondCurrService.SMSCode;
                    //_TradeTransactionObj.Delivery_Currency = _BaseCurrService.SMSCode;
                    //Req.SMSCode = _TradeTransactionObj.Order_Currency;
                    //Req.Amount = _TradeTransactionObj.OrderTotalQty;
                    if (_TradeTransactionObj.SellQty < _TradePairDetailObj.SellMinQty || _TradeTransactionObj.SellQty > _TradePairDetailObj.SellMaxQty)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.SellMinQty.ToString()).Replace("@MAX", _TradePairDetailObj.SellMaxQty.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_AmountBetweenMinMax);
                    }
                    if ((_TradeTransactionObj.AskPrice < _TradePairDetailObj.SellMinPrice || _TradeTransactionObj.AskPrice > _TradePairDetailObj.SellMaxPrice) && Req.ordertype != enTransactionMarketType.MARKET)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_PriceBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.SellMinPrice.ToString()).Replace("@MAX", _TradePairDetailObj.SellMaxPrice.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_PriceBetweenMinMax);
                    }
                    await AssRes;
                    Task.Run(() => InsertSellerList());
                }
                var GetProListResult = _WebApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest
                {
                    amount = Req.Amount,
                    SMSCode = Req.SMSCode,
                    APIType = enWebAPIRouteType.TransactionAPI,
                    trnType = Req.TrnType == enTrnType.Sell_Trade ? Convert.ToInt32(enTrnType.Buy_Trade) : Convert.ToInt32(Req.TrnType)
                });

                if (_TradeTransactionObj.OrderTotalQty < (decimal)(0.00000001) || _TradeTransactionObj.DeliveryTotalQty < (decimal)(0.00000001))
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidQtyNAmountMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidQtyNAmount);
                }
                if (Req.Amount <= 0) // ntrivedi 02-11-2018 if amount =0 then also invalid
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidAmountMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidAmount);
                }
                //TxnProviderList = await GetProListResult;
                //if (TxnProviderList.Count == 0) //Uday 05-11-2018 check condition for no record
                //{
                //    Req.StatusMsg = EnResponseMessage.ProcessTrn_ServiceProductNotAvailableMsg;
                //    return MarkSystemFailTransaction(enErrorCode.ProcessTrn_ServiceProductNotAvailable);
                //}
                Req.Status = enTransactionStatus.Initialize;
                Req.StatusCode = Convert.ToInt64(enErrorCode.TransactionInsertSuccess);
                InsertTransactionInQueue();
                Task.Run(() => InsertTradeTransactionInQueue());
                Task.Run(() => InsertTradeStopLoss(pairStastics.LTP));
                return (new BizResponse { ReturnMsg = "", ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("CreateTransaction:##TrnNo " + Req.TrnNo + " GUID:" + Req.GUID, ControllerName, ex));

                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionInsertInternalError });
            }

        }
        public async Task AssignDataBuy()
        {
            try
            {
                _TradeTransactionObj.DeliveryTotalQty = Req.Qty;
                _TradeTransactionObj.OrderTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 8);//235.415001286,8 =  235.41500129                         
                _TradeTransactionObj.Order_Currency = _BaseCurrService.SMSCode;
                _TradeTransactionObj.Delivery_Currency = _SecondCurrService.SMSCode;
                Req.SMSCode = _TradeTransactionObj.Order_Currency;
                Req.Amount = _TradeTransactionObj.OrderTotalQty;
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("AssignDataBuy:##TrnNo " + Req.TrnNo, ControllerName, ex));
                throw ex;
            }
        }
        public async Task AssignDataSell()
        {
            try
            {
                _TradeTransactionObj.OrderTotalQty = Req.Qty;
                _TradeTransactionObj.DeliveryTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 8);//235.415001286,8 =  235.41500129                        
                _TradeTransactionObj.Order_Currency = _SecondCurrService.SMSCode;
                _TradeTransactionObj.Delivery_Currency = _BaseCurrService.SMSCode;
                Req.SMSCode = _TradeTransactionObj.Order_Currency;
                Req.Amount = _TradeTransactionObj.OrderTotalQty;
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("AssignDataBuy:##TrnNo " + Req.TrnNo, ControllerName, ex));
                throw ex;
            }
        }
        public async Task LoadAllMasterDataParaller()
        {
            try
            {
                _BaseCurrService = _trnMasterConfiguration.GetServices().Where(item => item.Id == _TradePairObj.BaseCurrencyId).FirstOrDefault();
                _SecondCurrService = _trnMasterConfiguration.GetServices().Where(item => item.Id == _TradePairObj.SecondaryCurrencyId).FirstOrDefault();
                _TradePairDetailObj = _trnMasterConfiguration.GetTradePairDetail().Where(item => item.PairId == Req.PairID && item.Status == Convert.ToInt16(ServiceStatus.Active)).FirstOrDefault();
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("LoadAllMasterDataParaller:##TrnNo " + Req.TrnNo, ControllerName, ex));
                throw ex;
            }
        }
        public BizResponse MarkSystemFailTransaction(enErrorCode ErrorCode)
        {
            try
            {
                Req.Status = enTransactionStatus.SystemFail;
                Req.StatusCode = Convert.ToInt64(ErrorCode);
                InsertTransactionInQueue();
                InsertTradeStopLoss(0);
                try//as some para null in starting so error occured here ,only in case of system fail
                {
                    InsertTradeTransactionInQueue();
                }
                catch (Exception ex)
                {
                    Task.Run(() => HelperForLog.WriteErrorLog("MarkSystemFailTransaction Trade TQ Error:##TrnNo " + Req.TrnNo, ControllerName, ex));
                }
                //DI of SMS here
                //Uday 06-12-2018  Send SMS When Transaction is Failed
                SMSSendTransactionHoldOrFailed(Newtransaction.Id, Newtransaction.MemberMobile, Req.Price, Req.Qty, 2);

                //Uday 06-12-2018  Send Email When Transaction is Failed
                EmailSendTransactionHoldOrFailed(Newtransaction.Id, Newtransaction.MemberID + "", Req.PairID, Req.Qty, Newtransaction.TrnDate + "", Req.Price, 0, 2, Convert.ToInt16(Req.ordertype), Convert.ToInt16(Req.TrnType));

                try
                {
                    //Rita 26-11-2018 add Activity Notifiation v2
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.TransactionValidationFail);
                    //notification.MsgCode = Convert.ToInt32(ErrorCode);
                    notification.Param1 = Req.TrnNo.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Fail);
                    _ISignalRService.SendActivityNotificationV2(notification, Req.MemberID.ToString(), 2);//Req.accessToken
                    //_ISignalRService.SendActivityNotificationV2(notification, Req.accessToken);
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("MarkSystemFailTransaction Notification Send " + notification.MsgCode, ControllerName, "##TrnNo:" + Newtransaction.Id, Helpers.UTC_To_IST()));
                }
                catch (Exception ex)
                {
                    Task.Run(() => HelperForLog.WriteErrorLog("ISignalRService Notification Error-MarkSystemFailTransaction ##TrnNo:" + Newtransaction.Id, ControllerName, ex));
                }
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.Fail, ErrorCode = ErrorCode });
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("MarkSystemFailTransaction:##TrnNo " + Req.TrnNo, ControllerName, ex));
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionInsertInternalError });
            }
        }
        public async Task InsertTransactionInQueue()//ref long TrnNo
        {
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
                    AdditionalInfo = Req.AdditionalInfo,
                    DebitAccountID = Req.DebitAccountID//rita 03-12-18 added as required in withdraw process
                };
                Newtransaction = _TransactionRepository.Add(Newtransaction);
                Req.TrnNo = Newtransaction.Id;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTransactionInQueue:##TrnNo " + Req.TrnNo, ControllerName, ex);
                throw ex;
            }

        }
        public async Task InsertTradeTransactionInQueue()
        {
            try
            {
                NewTradetransaction = new TradeTransactionQueue()
                {
                    TrnDate = Helpers.UTC_To_IST(),
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
                    StatusMsg = Req.StatusMsg,
                    ordertype = Convert.ToInt16(Req.ordertype),
                    TrnNo = Req.TrnNo//NewTradetransactionReq.TrnNo,
                };
                NewTradetransaction = _TradeTransactionRepository.Add(NewTradetransaction);
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("InsertTradeTransactionInQueue:##TrnNo " + Req.TrnNo, ControllerName, ex));
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        public async Task InsertTradeStopLoss(decimal LTP)
        {
            try
            {
                TradeStopLossObj = new TradeStopLoss()
                {
                    ordertype = Convert.ToInt16(Req.ordertype),
                    StopPrice = Req.StopPrice,
                    Status = Convert.ToInt16(enTransactionStatus.Success),
                    LTP = LTP,
                    PairID = Req.PairID,
                    TrnNo = Req.TrnNo
                };
                if (Req.ordertype == enTransactionMarketType.STOP_Limit)
                {
                    if (Req.StopPrice <= LTP)//250 - 300 Low
                    {
                        if (Req.StopPrice == LTP)
                            STOPLimitWithSameLTP = 1;

                        TradeStopLossObj.RangeMin = Req.StopPrice;
                        TradeStopLossObj.RangeMax = LTP;
                        TradeStopLossObj.MarketIndicator = 0;
                    }
                    else if (Req.StopPrice > LTP)//300 - 350 High
                    {
                        TradeStopLossObj.RangeMin = LTP;
                        TradeStopLossObj.RangeMax = Req.StopPrice;
                        TradeStopLossObj.MarketIndicator = 1;
                    }
                }
                TradeStopLossObj = _TradeStopLoss.Add(TradeStopLossObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("InsertTradeStopLoss:##TrnNo " + Req.TrnNo, ControllerName, ex));
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }
        #endregion        

        #region RegionProcessTransaction        
        public async void MarkTransactionSystemFail(string StatusMsg, enErrorCode ErrorCode)
        {
            try
            {
                //var Txn = _TransactionRepository.GetById(Req.TrnNo);
                Newtransaction.MakeTransactionSystemFail();
                Newtransaction.SetTransactionStatusMsg(StatusMsg);
                Newtransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TransactionRepository.UpdateAsync(Newtransaction);

                //var TradeTxn = _TradeTransactionRepository.GetById(Req.TrnNo);
                NewTradetransaction.MakeTransactionSystemFail();
                NewTradetransaction.SetTransactionStatusMsg(StatusMsg);
                NewTradetransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TradeTransactionRepository.Update(NewTradetransaction);
                try
                {
                    //Rita 26-11-2018 add Activity Notifiation v2
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    notification.MsgCode = Convert.ToInt32(enErrorCode.TransactionValidationFail);
                    //notification.MsgCode = Convert.ToInt32(ErrorCode);
                    notification.Param1 = Req.TrnNo.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Fail);
                    _ISignalRService.SendActivityNotificationV2(notification, Req.MemberID.ToString(), 2);//Req.accessToken
                                                                                                          //_ISignalRService.SendActivityNotificationV2(notification, Req.accessToken);

                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("MarkTransactionSystemFail Notification Send " + notification.MsgCode, ControllerName, "##TrnNo:" + Newtransaction.Id, Helpers.UTC_To_IST()));
                }
                catch (Exception ex)
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ISignalRService Notification Error-MarkTransactionSystemFail", ControllerName, ex.Message + "##TrnNo:" + NewTradetransaction.TrnNo, Helpers.UTC_To_IST()));
                }
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("MarkTransactionSystemFail:##TrnNo " + Req.TrnNo, ControllerName, ex));
                // throw ex;
            }
        }
        public async Task MarkTransactionHold(string StatusMsg, enErrorCode ErrorCode)
        {
            try
            {
                Newtransaction.MakeTransactionHold();
                Newtransaction.SetTransactionStatusMsg(StatusMsg);
                Newtransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TransactionRepository.UpdateAsync(Newtransaction);

                //var Txn = _TransactionRepository.GetById(Req.TrnNo);
                //rita 28-12-18 remove active inactive as txn considers in settlement time
                //if (Req.ordertype == enTransactionMarketType.STOP_Limit && STOPLimitWithSameLTP == 0)//Rita 26-12-18 for STOP & limit Order
                //{
                //    NewTradetransaction.MakeTransactionInActive();
                //}
                //else
                //{
                //    NewTradetransaction.MakeTransactionHold();
                //}
                NewTradetransaction.MakeTransactionHold();
                NewTradetransaction.SetTransactionStatusMsg(StatusMsg);
                NewTradetransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                _TradeTransactionRepository.Update(NewTradetransaction);

                //if (Req.ordertype == enTransactionMarketType.STOP_Limit && STOPLimitWithSameLTP == 0)//Rita 26-12-18 for STOP & limit Order
                //{
                //    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                //    notification.MsgCode = Convert.ToInt32(enErrorCode.SignalRTrnSuccessfullyCreated);
                //    notification.Param1 = Req.Price.ToString();
                //    notification.Param2 = Req.Qty.ToString();
                //    notification.Type = Convert.ToInt16(EnNotificationType.Success);
                //    _ISignalRService.SendActivityNotificationV2(notification, Req.MemberID.ToString(), 2);//Req.accessToken    
                //    return;//for Inactive Order no need to send Book,history etc
                //}

                try
                {
                    var CopyNewtransaction = new TransactionQueue();
                    CopyNewtransaction = (TransactionQueue)Newtransaction.Clone();
                    //CopyNewtransaction.MakeTransactionHold();

                    var CopyNewTradetransaction = new TradeTransactionQueue();
                    CopyNewTradetransaction = (TradeTransactionQueue)NewTradetransaction.Clone();
                    //CopyNewTradetransaction.MakeTransactionHold();
                    //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ISignalRService", ControllerName, "parallel execution pre ##TrnNo:",Helpers.UTC_To_IST()));
                    Parallel.Invoke(() => _ISignalRService.OnStatusHold(Convert.ToInt16(enTransactionStatus.Success), CopyNewtransaction, CopyNewTradetransaction, "", TradeStopLossObj.ordertype));
                    //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ISignalRService", ControllerName, "parallel execution complete ##TrnNo:",Helpers.UTC_To_IST()));

                    //Uday 06-12-2018  Send SMS When Transaction is Hold
                    SMSSendTransactionHoldOrFailed(Newtransaction.Id, Newtransaction.MemberMobile, Req.Price, Req.Qty, 1);
                }
                catch (Exception ex)
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("ISignalRService", ControllerName, "Trading Hold Error " + ex.Message + "##TrnNo:" + NewTradetransaction.TrnNo, Helpers.UTC_To_IST()));
                }
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("MarkTransactionHold:##TrnNo " + Req.TrnNo, ControllerName, ex));
                throw ex;
            }
        }
        #endregion

        #region Settlement Insert Data        
        public async Task InsertSellerList()
        {
            try
            {
                TradeSellerListObj = new TradeSellerListV1()
                {
                    CreatedBy = Req.MemberID,
                    TrnNo = Req.TrnNo,
                    PairID = Req.PairID,
                    PairName = _TradeTransactionObj.PairName,
                    Price = Req.Price,
                    Qty = Req.Qty,
                    ReleasedQty = Req.Qty,
                    SelledQty = 0,
                    RemainQty = Req.Qty,
                    IsProcessing = 1,
                    OrderType = Convert.ToInt16(Req.ordertype),
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
                };
                if (Req.ordertype == enTransactionMarketType.STOP_Limit && STOPLimitWithSameLTP == 0)
                {
                    //TradeSellerListObj.Status = Convert.ToInt16(enTransactionStatus.InActive);
                    TradeSellerListObj.IsProcessing = 0;
                }
                //TradeSellerListObj =_TradeSellerList.Add(TradeSellerListObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("Tradepoolmaster:##TrnNo " + Req.TrnNo, ControllerName, ex));
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }
        }

        public async Task InsertBuyerList()
        {
            try
            {
                TradeBuyerListObj = new TradeBuyerListV1()
                {
                    CreatedBy = Req.MemberID,
                    TrnNo = Req.TrnNo,
                    PairID = Req.PairID,
                    PairName = _TradeTransactionObj.PairName,
                    Price = Req.Price,
                    Qty = Req.Qty, //same as request as one entry per one request
                    DeliveredQty = 0,
                    RemainQty = Req.Qty,
                    IsProcessing = 1,
                    OrderType = Convert.ToInt16(Req.ordertype),
                    Status = Convert.ToInt16(enTransactionStatus.Initialize),//txn type status
                };
                if (Req.ordertype == enTransactionMarketType.STOP_Limit && STOPLimitWithSameLTP == 0)
                {
                    //TradeBuyerListObj.Status = Convert.ToInt16(enTransactionStatus.InActive);
                    TradeBuyerListObj.IsProcessing = 0;
                }
                //TradeBuyerListObj = _TradeBuyerList.Add(TradeBuyerListObj);
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommSuccessMsgInternal, ReturnCode = enResponseCodeService.Success });
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("InsertBuyerList:##TrnNo " + Req.TrnNo, ControllerName, ex));
                //return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError });
                throw ex;
            }

        }

        public async Task<BizResponse> TradingDataInsert(BizResponse _Resp)
        {
            try
            {
                //foreach (TransactionProviderResponse Provider in TxnProviderList)//Make txn on every API
                //{
                //    Newtransaction.SetServiceProviderData(Provider.ServiceID, Provider.ServiceProID, Provider.ProductID, Provider.RouteID);
                //    _TransactionRepository.Update(Newtransaction);
                //    break;
                //}                
                _Resp.ReturnMsg = "success";
                _Resp.ReturnCode = enResponseCodeService.Success;
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("TradingDataInsert:##TrnNo " + Req.TrnNo, ControllerName, ex));
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = ex.Message;
            }
            //return Task.FromResult(_Resp);
            return _Resp;
        }

        public Task<BizResponse> TradingDataInsertV2(BizResponse _Resp)
        {
            _TransactionObj = new ProcessTransactionCls();
            //TransactionRequest TransactionRequestObj=new TransactionRequest(); 
            ThirdPartyAPIRequest ThirdPartyAPIRequestOnj;
            WebApiConfigurationResponse WebApiConfigurationResponseObj;
            WebAPIParseResponseCls WebAPIParseResponseClsObj = new WebAPIParseResponseCls();
            //long TxnRequestID = 0;
            short IsTxnProceed = 0;
            try
            {
                foreach (TransactionProviderResponse Provider in TxnProviderList)//Make txn on every API
                {
                    switch (Enum.Parse<enWebAPIRouteType>(Provider.ServiceProID.ToString()))
                    {
                        case enWebAPIRouteType.TradeServiceLocal:
                            // for local trade routing 
                            break;
                        case enWebAPIRouteType.LiquidityProvider: // for liquidity provider
                            Newtransaction.SetServiceProviderData(Provider.ServiceID, Provider.ServiceProID, Provider.ProductID, Provider.RouteID);
                            _TransactionRepository.Update(Newtransaction);

                            WebApiConfigurationResponseObj = _IWebApiData.GetAPIConfiguration(Provider.ThirPartyAPIID);
                            if (WebApiConfigurationResponseObj == null)
                            {
                                _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_ThirdPartyDataNotFoundMsg;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ErrorCode = enErrorCode.ProcessTrn_ThirdPartyDataNotFound;
                                continue;
                            }
                            //if (Req.TrnType == enTrnType.Withdraw)
                            //    Task.Run(() => InsertIntoWithdrawHistory(Provider.ServiceProID, Provider.RouteName, WebAPIParseResponseClsObj.TrnRefNo, Req));

                            HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--1--LiquidityConfiguration Call Web API---" + "##TrnNo:" + Req.TrnNo);
                            ThirdPartyAPIRequestOnj = _IGetWebRequest.MakeWebRequest(Provider.RouteID, Provider.ThirPartyAPIID, Provider.SerProDetailID, Newtransaction);
                            //Insert API request Data
                            _TransactionObj.TransactionRequestID = InsertTransactionRequest(Provider, ThirdPartyAPIRequestOnj.RequestURL + "::" + ThirdPartyAPIRequestOnj.RequestBody);

                            switch (Provider.AppTypeID)
                            {
                                case (long)enAppType.WebSocket:

                                case (long)enAppType.JsonRPC:
                                    _TransactionObj.APIResponse = _IWebApiSendRequest.SendJsonRpcAPIRequestAsync(ThirdPartyAPIRequestOnj.RequestURL, ThirdPartyAPIRequestOnj.RequestBody, ThirdPartyAPIRequestOnj.keyValuePairsHeader);
                                    break;
                                case (long)enAppType.TCPSocket:

                                case (long)enAppType.RestAPI:
                                    _TransactionObj.APIResponse = _IWebApiSendRequest.SendAPIRequestAsync(ThirdPartyAPIRequestOnj.RequestURL, ThirdPartyAPIRequestOnj.RequestBody, WebApiConfigurationResponseObj.ContentType, 30000, ThirdPartyAPIRequestOnj.keyValuePairsHeader, WebApiConfigurationResponseObj.MethodType);
                                    break;
                                case (long)enAppType.HttpApi:
                                    _TransactionObj.APIResponse = _IWebApiSendRequest.SendAPIRequestAsync(ThirdPartyAPIRequestOnj.RequestURL, ThirdPartyAPIRequestOnj.RequestBody, WebApiConfigurationResponseObj.ContentType, 30000, ThirdPartyAPIRequestOnj.keyValuePairsHeader, WebApiConfigurationResponseObj.MethodType);
                                    break;
                                case (long)enAppType.SocketApi:

                                case (long)enAppType.BitcoinDeamon:

                                default:
                                    Console.WriteLine("Default case");
                                    break;
                            }
                            NewtransactionReq.SetResponse(_TransactionObj.APIResponse);
                            NewtransactionReq.SetResponseTime(Helpers.UTC_To_IST());
                            if (string.IsNullOrEmpty(_TransactionObj.APIResponse))
                            {
                                _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_HoldMsg;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ErrorCode = enErrorCode.ProcessTrn_GettingResponseBlank;
                                //Task.Run(() => MarkTransactionHold(_Resp.ReturnMsg, _Resp.ErrorCode, Newtransaction));
                                IsTxnProceed = 1;//no further call next API
                                break;
                            }
                            //_TransactionObj.APIResponse = "{\"txid\":\"dc0f4454e77cb3bdaa0c707b37eca250dc6ac84a40994cc99c9c063583f50bbc\",\"tx\":\"01000000000101bbdb21bfc18efc9357c2abcbed6e6a6bc47bab2dd78952aa3b1b0aaa48af972c0100000023220020a3dd471b5765c0ac7e7173c00cb8f6d8ede04809442441a78ae71e555f0e3e25ffffffff02ce2a81000000000017a914ed1f54cf86f6b69e860bd118d29b63f6dbb2e17c87988d07000000000017a9141f6b16323e351422509d8f70f2ebe8f77aabc62d87040047304402205871d8dea5a91b9d40b6b8489dfd94184b2cb6338745b95cf71f45c6e23bc12a02202c4d99a057b85a6c0e8fed053278c9e4a1d0faf95931dc7925a52723e57e0f3d01483045022100f52edab9924eb8cc9785f1f27ebf8d53a86c81232ef8bafe7c66615e593283ac02206052b2e7c76f1390a57def1dbca28480ba70b506d20b4245204c8803b2bb85260169522103ca80fd2ca4c7097f386853f52f9224128b15409340524d04bddafc5afdb6b47321026563949e58c2b622d9ad84c53dbd5d1bdc09858ec37d96fbd95af4b49f06a8342102b5208a7ce843e28e2460eff28cd6d770c948a516074f1f0627f3cfb020512c0153aebc310800\",\"status\":\"signed\"}";
                            WebAPIParseResponseClsObj = _WebApiParseResponseObj.TransactionParseResponse(_TransactionObj.APIResponse, Provider.ThirPartyAPIID);
                            NewtransactionReq.SetTrnID(WebAPIParseResponseClsObj.TrnRefNo);
                            NewtransactionReq.SetOprTrnID(WebAPIParseResponseClsObj.OperatorRefNo);
                            Task.Run(() => _TransactionRequest.Update(NewtransactionReq));


                            WebAPIParseResponseClsObj.Status = enTransactionStatus.Success;//komal test 
                            if ((WebAPIParseResponseClsObj.Status == enTransactionStatus.Success) || (WebAPIParseResponseClsObj.Status == enTransactionStatus.Hold))
                            {
                                //if (Req.TrnType == enTrnType.Withdraw)
                                //    Task.Run(() => UpdateIntoWithdrawHistory(Req, 6, "Process entry", ThirdPartyAPIRequestOnj.walletID));
                            }
                            else
                            {
                                //if (Req.TrnType == enTrnType.Withdraw)
                                //    Task.Run(() => UpdateIntoWithdrawHistory(Req, 2, "Fail", ThirdPartyAPIRequestOnj.walletID));
                            }
                            HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--2--LiquidityConfiguration Call web API---" + "##TrnNo:" + Req.TrnNo);
                            if (WebAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                            {
                                //Task.Run(() => MarkTransactionSuccess(WebAPIParseResponseClsObj.StatusMsg, Newtransaction));
                                IsTxnProceed = 1;//no further call next API
                                break;
                            }
                            else if (WebAPIParseResponseClsObj.Status == enTransactionStatus.OperatorFail)
                            {
                                continue;
                            }
                            else
                            {
                                Newtransaction.SetTransactionStatusMsg(WebAPIParseResponseClsObj.StatusMsg);
                                Task.Run(() => _TransactionRepository.Update(Newtransaction));

                                _Resp.ReturnMsg = "Hold";
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ErrorCode = enErrorCode.ProcessTrn_Hold;
                                IsTxnProceed = 1;//no further call next API
                                break;
                            }
                        case enWebAPIRouteType.MarketData:

                            break;
                        case enWebAPIRouteType.TransactionAPI:

                            break;
                    }
                }
                if (IsTxnProceed == 0)
                {
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_OprFail;
                    //Task.Run(() => MarkTransactionOperatorFail("Fail" + WebAPIParseResponseClsObj.StatusMsg, _Resp.ErrorCode, Newtransaction));
                }
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CallWebAPI:##TrnNo " + Req.TrnNo, ControllerName, ex);
                if (IsTxnProceed == 0)
                {
                    _Resp.ReturnMsg = "Error occured";
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_APICallInternalError;
                }
                else
                {
                    _Resp.ReturnMsg = "Hold";
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_Hold;
                }

            }
            return Task.FromResult(_Resp);
        }
        public long InsertTransactionRequest(TransactionProviderResponse listObj, string Request)
        {
            try
            {
                NewtransactionReq = new TransactionRequest()
                {
                    TrnNo = Req.TrnNo,
                    ServiceID = listObj.ServiceID,
                    SerProID = listObj.ServiceProID,
                    SerProDetailID = listObj.SerProDetailID,
                    CreatedDate = Helpers.UTC_To_IST(),
                    RequestData = Request
                };
                NewtransactionReq = _TransactionRequest.Add(NewtransactionReq);
                return NewtransactionReq.Id;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTransactionRequest:##TrnNo " + Req.TrnNo, ControllerName, ex);
                return 0;
            }
        }
        #endregion

        #region Send SMS And Email
        public async Task SMSSendTransactionHoldOrFailed(long TrnNo, string MobileNumber, decimal Price, decimal Qty, int type)
        {
            try
            {
                if (!string.IsNullOrEmpty(MobileNumber))
                {
                    TemplateMasterData SmsData = new TemplateMasterData();
                    SendSMSRequest SendSMSRequestObj = new SendSMSRequest();
                    ApplicationUser User = new ApplicationUser();

                    CommunicationParamater communicationParamater = new CommunicationParamater();
                    communicationParamater.Param1 = TrnNo + "";
                    communicationParamater.Param2 = Price + "";
                    communicationParamater.Param3 = Qty + "";

                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SendSMSTransaction - SMSSendTransactionHoldOrFailed", ControllerName, " ##TrnNo : " + TrnNo + " ##MobileNo : " + MobileNumber + " ##Price : " + Price + " ##Qty : " + Qty + " ##Type : " + type, Helpers.UTC_To_IST()));

                    if (type == 1) // Transaction Created
                    {
                        SmsData = _messageService.ReplaceTemplateMasterData(EnTemplateType.SMS_TransactionCreated, communicationParamater, enCommunicationServiceType.SMS).Result;
                    }
                    else if (type == 2) // Transaction Failed
                    {
                        SmsData = _messageService.ReplaceTemplateMasterData(EnTemplateType.SMS_TransactionFailed, communicationParamater, enCommunicationServiceType.SMS).Result;
                    }

                    if (SmsData != null)
                    {
                        if (SmsData.IsOnOff == 1)
                        {
                            SendSMSRequestObj.Message = SmsData.Content;
                            SendSMSRequestObj.MobileNo = Convert.ToInt64(MobileNumber);
                            _pushSMSQueue.Enqueue(SendSMSRequestObj);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("SMSSendTransactionHold:##TrnNo " + TrnNo, ControllerName, ex));
            }
        }

        public async Task EmailSendTransactionHoldOrFailed(long TrnNo, string UserId, long pairid, decimal qty, string datetime, decimal price, decimal fee, int Type, short OrderType, short TrnType)
        {
            try
            {
                SendEmailRequest Request = new SendEmailRequest();
                ApplicationUser User = new ApplicationUser();
                TemplateMasterData EmailData = new TemplateMasterData();
                CommunicationParamater communicationParamater = new CommunicationParamater();

                User = await _userManager.FindByIdAsync(UserId);
                if (!string.IsNullOrEmpty(User.Email))
                {
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SendEmailTransaction - EmailSendWithdrwalTransaction", ControllerName, " ##TrnNo : " + TrnNo + " ##Type : " + Type, Helpers.UTC_To_IST()));

                    var pairdata = _trnMasterConfiguration.GetTradePairMaster().Where(x => x.Id == pairid).FirstOrDefault();

                    if (pairdata != null)
                    {
                        communicationParamater.Param1 = pairdata.PairName + "";
                        communicationParamater.Param3 = pairdata.PairName.Split("_")[1];
                    }

                    communicationParamater.Param8 = User.Name + "";
                    communicationParamater.Param2 = qty + "";
                    communicationParamater.Param4 = datetime;
                    communicationParamater.Param5 = price + "";
                    communicationParamater.Param6 = fee + "";
                    communicationParamater.Param7 = "0";  //Uday 01-01-2019  In failed transaction final price as 0
                    communicationParamater.Param9 = ((enTransactionMarketType)OrderType).ToString();  //Uday 01-01-2019 Add OrderType In Email
                    communicationParamater.Param10 = ((enTrnType)TrnType).ToString();  //Uday 01-01-2019 Add TranType In Email
                    communicationParamater.Param11 = TrnNo.ToString(); //Uday 01-01-2019 Add TrnNo In Email

                    //if (CancelType == 1) // Hold
                    //{
                    //    EmailData = _messageService.SendMessageAsync(EnTemplateType.EMAIL_OrderCancel, communicationParamater, enCommunicationServiceType.Email).Result;
                    //}
                    if (Type == 2) // Failed
                    {
                        EmailData = _messageService.ReplaceTemplateMasterData(EnTemplateType.EMAIL_TransactionFailed, communicationParamater, enCommunicationServiceType.Email).Result;
                    }

                    if (EmailData != null)
                    {
                        Request.Body = EmailData.Content;
                        Request.Subject = EmailData.AdditionalInfo;
                        Request.Recepient = User.Email;
                        Request.EmailType = 0;
                        _pushNotificationsQueue.Enqueue(Request);
                    }
                }
            }
            catch (Exception ex)
            {
                Task.Run(() => HelperForLog.WriteErrorLog("EmailSendCancelTransaction:##TrnNo " + TrnNo, ControllerName, ex));
            }
        }
        #endregion
    }
}
