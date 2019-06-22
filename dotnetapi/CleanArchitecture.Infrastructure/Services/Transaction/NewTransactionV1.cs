using Binance.Net;
using Binance.Net.Objects;
using Bittrex.Net;
using Bittrex.Net.Objects;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ApiModels.Chat;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.LiquidityProvider1;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Infrastructure.LiquidityProvider;
using CleanArchitecture.Infrastructure.LiquidityProvider.TradeSatoshiAPI;
using CoinbasePro.Services.Orders.Models.Responses;
using CryptoExchange.Net.Authentication;
using CryptoExchange.Net.Objects;
using Huobi.Net.Objects;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CleanArchitecture.Infrastructure.LiquidityProvider.OKExAPI;

namespace CleanArchitecture.Infrastructure.Services.Transaction
{
    public class NewTransactionV1 : ITransactionProcessV1
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
        private readonly ISettlementRepositoryAPI<BizResponse> _SettlementRepositoryAPI;
        private readonly ISignalRService _ISignalRService;
        private readonly ITrnMasterConfiguration _trnMasterConfiguration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMessageService _messageService;
        private readonly IPushNotificationsQueue<SendSMSRequest> _pushSMSQueue;
        private IPushNotificationsQueue<SendEmailRequest> _pushNotificationsQueue;
        private readonly IMediator _mediator;
        private readonly ICommonWalletFunction _commonWalletFunction;
        private readonly IFrontTrnRepository _frontTrnRepository; // khushali 24-05-2019 for LTP watcher
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
        //Routing using LP
        private readonly IWebApiData _IWebApiData;
        private readonly IGetWebRequest _IGetWebRequest;
        //private readonly IWebApiSendRequest _IWebApiSendRequest; //komal 03 May 2019, Cleanup
        private readonly ICommonRepository<TransactionRequest> _TransactionRequest;
        private readonly BinanceLPService _binanceLPService;
        //add huobi interface
        private readonly HuobiLPService _huobiLPService;
    
        private readonly BitrexLPService _bitrexLPService;
        private readonly ICoinBaseService _coinBaseService;
        private readonly IPoloniexService _poloniexService;
        private readonly ITradeSatoshiLPService _tradeSatoshiLPService;
        private readonly IUpbitService _upbitService;
        private readonly IOKExLPService _oKExLPService; //Add new variable for OKEx API by Pushpraj as on 17-06-2019
        WebApiParseResponse _WebApiParseResponseObj;
        TransactionRequest NewtransactionRequest;
        ProcessTransactionCls _TransactionObj; 
        private readonly IResdisTradingManagment _IResdisTradingManagment;//Rita 15-3-19 added for Site Token conversion
        private readonly ICommonRepository<TradingConfiguration> _tradingConfiguration; // khushali 25-05-2019 Trading configuration Type
        public List<TradingConfiguration> TradingConfigurationList;
        int IsOnlyLocalTradeOn = 0;
        int IsOnlyLiquidtyTradeOn = 0;
        int IsOnlyMarketMakingTradeOn = 0;
        int IsMaxProfit = 0;
        int IsProceedInLocal = 0;
        LPProcessTransactionCls LPProcessTransactionCls;

        public NewTransactionV1(
            ICommonRepository<TransactionQueue> TransactionRepository,
            ICommonRepository<TradeTransactionQueue> TradeTransactionRepository,
            ICommonRepository<TradeStopLoss> tradeStopLoss, IWalletService WalletService,IWebApiRepository WebApiRepository,
            ICommonRepository<TradeSellerListV1> TradeSellerList,
            ICommonRepository<TradeBuyerListV1> TradeBuyerList, ISettlementRepositoryV1<BizResponse> SettlementRepositoryV1,
            ISignalRService ISignalRService, ICommonRepository<TradePairStastics> tradePairStastics,//IServiceProvider services, 
            ITrnMasterConfiguration trnMasterConfiguration, UserManager<ApplicationUser> userManager, IMessageService messageService, 
            IPushNotificationsQueue<SendSMSRequest> pushSMSQueue, IPushNotificationsQueue<SendEmailRequest> pushNotificationsQueue, IMediator mediator,
            ICommonWalletFunction commonWalletFunction, BinanceLPService BinanceLPService, HuobiLPService huobiLPService, BitrexLPService BitrexLPService,
            ICoinBaseService CoinBaseService, IPoloniexService PoloniexService, ITradeSatoshiLPService TradeSatoshiLPService, IUpbitService upbitService,
            IWebApiData IWebApiData,IGetWebRequest IGetWebRequest, IWebApiSendRequest WebApiSendRequest, 
            WebApiParseResponse WebApiParseResponseObj,ICommonRepository<TransactionRequest> TransactionRequest,
            IResdisTradingManagment IResdisTradingManagment, IFrontTrnRepository FrontTrnRepository,
            ICommonRepository<TradingConfiguration> TradingConfiguration,
            ISettlementRepositoryAPI<BizResponse> SettlementRepositoryAPI,IOKExLPService oKExLPService)
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
            _mediator = mediator;
            _commonWalletFunction = commonWalletFunction;
            // khushali khushali liquidity 
            _IGetWebRequest = IGetWebRequest;
            _IWebApiData = IWebApiData;
            _WebApiParseResponseObj = WebApiParseResponseObj;
            _TransactionRequest = TransactionRequest;
            _binanceLPService = BinanceLPService;
            _huobiLPService = huobiLPService;
            _bitrexLPService = BitrexLPService;
            _coinBaseService = CoinBaseService;
            _poloniexService = PoloniexService;
            _upbitService = upbitService;
            _tradeSatoshiLPService = TradeSatoshiLPService;
            _IResdisTradingManagment = IResdisTradingManagment;
            _frontTrnRepository = FrontTrnRepository;
            _tradingConfiguration = TradingConfiguration;
            _SettlementRepositoryAPI = SettlementRepositoryAPI;
            _oKExLPService = oKExLPService; //Add new for OKEx API by Pushpraj as on 17-06-2019
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
                //Deduct balance here
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync Wallet", ControllerName, "Balance Deduction Start " + Req.GUID + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));              

                var DebitResult1 = _WalletService.GetWalletHoldNew(Req.SMSCode, Helpers.GetTimeStamp(),Req.Amount,
                    Req.DebitAccountID, Req.TrnNo, enServiceType.Trading, Req.TrnType == enTrnType.Buy_Trade?enWalletTrnType.BuyTrade: enWalletTrnType.SellTrade, Req.TrnType, (EnAllowedChannels)Req.TrnMode, Req.accessToken,(enWalletDeductionType)((short)Req.ordertype)); //NTRIVEDI 07-12-2018               

                //TradingDataInsert(_Resp);
                var DebitResult = await DebitResult1;
                //2019-4-29 addedd charge 
                Newtransaction.ChargeRs = DebitResult.Charge;
                Newtransaction.ChargeCurrency = DebitResult.ChargeCurrency;
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
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Update Service Start" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Trading Data Entry Done " + _Resp.ReturnMsg + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "End Service" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "HOLD Start" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                MarkTransactionHold(EnResponseMessage.ProcessTrn_HoldMsg, enErrorCode.ProcessTrn_Hold);//Rita 4-3-19 remove task.run for speed execution status not update as settlement reverse

                //Rita 8-1-19 for followers trading
                if (Req.ISFollowersReq == 0 && Req.FollowingTo == 0 && Req.LeaderTrnNo == 0)//only for leader's allow this
                {
                    FollowersOrderRequestCls request = new FollowersOrderRequestCls { Req = Req, Delivery_Currency = _TradeTransactionObj.Delivery_Currency, Order_Currency = _TradeTransactionObj.Order_Currency };
                    Task.Run(() => _mediator.Send(request));
                }
                //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "Trading Data Entry Start " + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));

                //Rita 19-3-19 save to Redis cache,as live remove this
                //await _IResdisTradingManagment.TransactionOrderCacheEntry(_Resp, Req.TrnNo, Req.PairID, _TradeTransactionObj.PairName,
                //    Req.Price, Req.Qty, Req.Qty, Convert.ToInt16(Req.ordertype), _TradeTransactionObj.TrnTypeName,0);

                //=====================For Routing Enable-uncomment TradingConfiguration(), and comment below code block===================================================                              
                if (Req.TrnType == enTrnType.Buy_Trade)
                {
                    TradeBuyerListObj.TrnNo = Req.TrnNo;
                    TradeBuyerListObj = _TradeBuyerList.Add(TradeBuyerListObj);
                }
                else
                {
                    TradeSellerListObj.TrnNo = Req.TrnNo;
                    TradeSellerListObj = _TradeSellerList.Add(TradeSellerListObj);
                }

                //IsOnlyLocalTradeOn == 1 && IsOnlyMarketMakingTradeOn==0
                //Rita 25-5-19 If max profit=1 means off then check if provider or route not found then goes in local ,then shoul not go in route
                if (IsMaxProfit==0 || TxnProviderList?.Count == 0 || (IsOnlyLiquidtyTradeOn == 0 && IsOnlyMarketMakingTradeOn == 0))
                {
                    //Rita 3 - 4 - 19 after routing add move this in TradingDataInsertV2
                    if (Req.TrnType == enTrnType.Buy_Trade)
                    {
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Buyer" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                        if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                        {
                            _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTBuy(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeBuyerListObj, Req.accessToken, 0);
                        }
                    }
                    else
                    {
                        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Seller" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                        if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                        {
                            _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTSell(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeSellerListObj, Req.accessToken, 0);
                        }
                    }
                    IsProceedInLocal = 1;//then does not proceed in routing
                }
                if ((IsOnlyLiquidtyTradeOn == 1 || IsOnlyMarketMakingTradeOn == 1) && 
                    (_Resp.ReturnCode != enResponseCodeService.Success || IsProceedInLocal == 0) &&
                    TxnProviderList.Count != 0)
                {
                    //Rita 6-3-19 for trade routing
                    await TradingConfiguration(_Resp);
                }
                ////////if (IsOnlyMarketMakingTradeOn == 1 || (IsOnlyLiquidtyTradeOn==1 && TxnProviderList.Count == 0 && _Resp.ReturnCode != enResponseCodeService.Success))//TxnProviderList not checked for IsOnlyLiquidtyTradeOn=1
                //////if (((IsOnlyLiquidtyTradeOn==1 || IsOnlyMarketMakingTradeOn == 1) && IsMaxProfit == 1) || 
                //////    (TxnProviderList.Count != 0 && _Resp.ReturnCode != enResponseCodeService.Success && (IsOnlyLiquidtyTradeOn == 1 || IsOnlyMarketMakingTradeOn == 1)))//TxnProviderList not checked for IsOnlyLiquidtyTradeOn=1
                //////{
                //////    //Rita 6-3-19 for trade routing
                //////    await TradingConfiguration(_Resp);
                //////}   

                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync Settlement END Now wait for 20 sec", ControllerName, _Resp.ReturnMsg, Helpers.UTC_To_IST()));
                Task.Delay(10000).Wait();//rita 3-1-19 wait for all operations done //Uday 15-01-2019 change from 10000 to 20000 //rita 27-2-19 change from 20000 to 10000

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
                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CreateTransaction", ControllerName, "Debit WalletID" + Req.DebitWalletID + "##TrnNo:" + Req.GUID,Helpers.UTC_To_IST()));
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
                if (Req.Qty <= 0 || (Req.Price <= 0 && Req.ordertype != enTransactionMarketType.MARKET)|| (Req.StopPrice == 0 && Req.ordertype == enTransactionMarketType.STOP_Limit))
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
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_AmountBetweenMinMax, _TradePairDetailObj.BuyMinQty.ToString(), _TradePairDetailObj.BuyMaxQty.ToString());
                    }
                    if ((_TradeTransactionObj.BidPrice < _TradePairDetailObj.BuyMinPrice || _TradeTransactionObj.BidPrice > _TradePairDetailObj.BuyMaxPrice) && Req.ordertype != enTransactionMarketType.MARKET)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_PriceBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.BuyMinPrice.ToString()).Replace("@MAX", _TradePairDetailObj.BuyMaxPrice.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_PriceBetweenMinMax, _TradePairDetailObj.BuyMinPrice.ToString(), _TradePairDetailObj.BuyMaxPrice.ToString());
                    }
                    await AssRes;
                    InsertBuyerList();
                }
                else if (Req.TrnType == enTrnType.Sell_Trade)
                {
                    _TradeTransactionObj.SellQty = Req.Qty;
                    _TradeTransactionObj.AskPrice = Req.ordertype == enTransactionMarketType.MARKET ? 0 : Req.Price;
                    var AssRes=AssignDataSell();
                    //_TradeTransactionObj.OrderTotalQty = Req.Qty;
                    //_TradeTransactionObj.DeliveryTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 8);//235.415001286,8 =  235.41500129                        
                    //_TradeTransactionObj.Order_Currency = _SecondCurrService.SMSCode;
                    //_TradeTransactionObj.Delivery_Currency = _BaseCurrService.SMSCode;
                    //Req.SMSCode = _TradeTransactionObj.Order_Currency;
                    //Req.Amount = _TradeTransactionObj.OrderTotalQty;
                    if (_TradeTransactionObj.SellQty < _TradePairDetailObj.SellMinQty || _TradeTransactionObj.SellQty > _TradePairDetailObj.SellMaxQty)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_AmountBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.SellMinQty.ToString()).Replace("@MAX", _TradePairDetailObj.SellMaxQty.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_AmountBetweenMinMax, _TradePairDetailObj.SellMinQty.ToString(), _TradePairDetailObj.SellMaxQty.ToString());
                    }
                    if ((_TradeTransactionObj.AskPrice < _TradePairDetailObj.SellMinPrice || _TradeTransactionObj.AskPrice > _TradePairDetailObj.SellMaxPrice) && Req.ordertype != enTransactionMarketType.MARKET)
                    {
                        Req.StatusMsg = EnResponseMessage.ProcessTrn_PriceBetweenMinMaxMsg.Replace("@MIN", _TradePairDetailObj.SellMinPrice.ToString()).Replace("@MAX", _TradePairDetailObj.SellMaxPrice.ToString());
                        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_PriceBetweenMinMax, _TradePairDetailObj.SellMinPrice.ToString(), _TradePairDetailObj.SellMaxPrice.ToString());
                    }
                    await AssRes;
                    InsertSellerList();
                }
                //var GetProListResult = _WebApiRepository.GetProviderDataListAsync(new TransactionApiConfigurationRequest {amount = Req.Amount,SMSCode = Req.SMSCode, APIType = enWebAPIRouteType.TransactionAPI,
                //                        trnType = Req.TrnType == enTrnType.Sell_Trade ? Convert.ToInt32(enTrnType.Buy_Trade) : Convert.ToInt32(Req.TrnType) });
                //Rita 6-3-19 for trade routing
                var GetProListResult = _WebApiRepository.GetProviderDataListV2Async(new TransactionApiConfigurationRequest
                {
                    amount = Req.Qty,//Req.Amount Rita 4-4-19 pass Qty , as base on Qty routing place
                    SMSCode = Req.SMSCode,
                    APIType = enWebAPIRouteType.TransactionAPI,
                    trnType = Req.TrnType == enTrnType.Sell_Trade ? Convert.ToInt32(enTrnType.Sell_Trade) : Convert.ToInt32(enTrnType.Buy_Trade),
                    OrderType = Convert.ToInt16(Req.ordertype),
                    PairID = Req.PairID
                });

                //var walletLimit = _commonWalletFunction.CheckWalletLimitAsync(enWalletLimitType.TradingLimit, Req.DebitWalletID, Req.Amount);
                var walletLimit = _commonWalletFunction.CheckWalletLimitAsyncV1(enWalletLimitType.TradingLimit, Req.DebitWalletID, Req.Amount);

                if (_TradeTransactionObj.OrderTotalQty < (decimal)(0.000000000000000001) || _TradeTransactionObj.DeliveryTotalQty < (decimal)(0.000000000000000001))
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidQtyNAmountMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidQtyNAmount);
                }
                if (Req.Amount <= 0) // ntrivedi 02-11-2018 if amount =0 then also invalid
                {
                    Req.StatusMsg = EnResponseMessage.CreateTrnInvalidAmountMsg;
                    return MarkSystemFailTransaction(enErrorCode.CreateTrnInvalidAmount);
                }

                //enErrorCode WalletLimitRes= await walletLimit;//komal 25-01-2019 check transaction limit
                //Rushabh 06-02-2019
                WalletTrnLimitResponse WalletLimitRes = await walletLimit;//komal 25-01-2019 check transaction limit
                if ( WalletLimitRes.ErrorCode != enErrorCode.Success)
                {
                    //Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CreateTransaction", ControllerName, "Debit WalletID" + Req.DebitWalletID + "##TrnNo:" + Req.GUID+ "check transaction limit : " + WalletLimitRes.ToString(), Helpers.UTC_To_IST()));
                    //Req.StatusMsg = WalletLimitRes.ReturnMsg.ToString();
                    //return MarkSystemFailTransaction(WalletLimitRes.ErrorCode);//2019-3-7 add new param for notification msg
                }
                //khushali 25-5-19 check all types of Trading bit
                TradingConfigurationList = _tradingConfiguration.FindBy(e => e.Status == 1).ToList();
                foreach (var TradeConfig in TradingConfigurationList)
                {
                    if (TradeConfig.Name == enTradingType.Regular.ToString())
                    {
                        IsOnlyLocalTradeOn = 1;
                    }
                    else if (TradeConfig.Name == enTradingType.Liquidity.ToString())
                    {
                        IsOnlyLiquidtyTradeOn = 1;
                    }
                    else if (TradeConfig.Name == enTradingType.MarketMaking.ToString())
                    {
                        IsOnlyMarketMakingTradeOn = 1;
                    }
                    else if (TradeConfig.Name == enTradingType.MaxProfit.ToString())
                    {
                        IsMaxProfit = 1;
                    }
                }
                if (IsOnlyLocalTradeOn ==0)//Rita 25-5-19 if bit not set then make Txn fail
                {                    
                    Req.StatusMsg = "Transaction is currenctly stopped";
                    return MarkSystemFailTransaction(enErrorCode.CreateTxnTradingIsStopped);
                }

                TxnProviderList = await GetProListResult;
                //rita 25-5-19 remove-as if route not present then trading place in local without below error

                //if ((IsOnlyLiquidtyTradeOn == 1 || IsOnlyMarketMakingTradeOn==1) && IsMaxProfit==1)//if MaxProfit on then N then check routing
                //{
                //    TxnProviderList = await GetProListResult;
                //    if (TxnProviderList.Count == 0) //Uday 05-11-2018 check condition for no record
                //    {
                //        Req.StatusMsg = EnResponseMessage.ProcessTrn_ServiceProductNotAvailableMsg;
                //        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_ServiceProductNotAvailable);
                //    }

                //    var AllRoutExist = TxnProviderList.Where(e => e.ProTypeID == Convert.ToInt64(enWebAPIRouteType.TradeServiceLocal) ||
                //                                                e.ProTypeID == Convert.ToInt64(enWebAPIRouteType.LiquidityProvider)).ToList();
                //    if (AllRoutExist.Count == 0) //Rita 4-4-19 if this type not exist then make fail
                //    {
                //        Req.StatusMsg = EnResponseMessage.ProcessTrn_ServiceProductNotAvailableMsg;
                //        return MarkSystemFailTransaction(enErrorCode.ProcessTrn_RouteTypeDefinedWrong);
                //    }
                //}

                Req.Status = enTransactionStatus.Initialize;
                Req.StatusCode = Convert.ToInt64(enErrorCode.TransactionInsertSuccess);
                await InsertTransactionInQueue();
                await InsertTradeTransactionInQueue();
                await InsertTradeStopLoss(pairStastics.LTP);
                return new BizResponse { ReturnMsg = "", ReturnCode = enResponseCodeService.Success };
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("CreateTransaction:##TrnNo " + Req.TrnNo + " GUID:"+ Req.GUID, ControllerName, ex);
                return (new BizResponse { ReturnMsg = EnResponseMessage.CommFailMsgInternal, ReturnCode = enResponseCodeService.InternalError, ErrorCode = enErrorCode.TransactionInsertInternalError });
            }

        }
        public async Task AssignDataBuy()
        {
            try
            {
                _TradeTransactionObj.DeliveryTotalQty = Req.Qty;
                _TradeTransactionObj.OrderTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 18);//235.415001286,8 =  235.41500129                         
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
                _TradeTransactionObj.DeliveryTotalQty = Helpers.DoRoundForTrading(Req.Qty * Req.Price, 18);//235.415001286,8 =  235.41500129                        
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
                HelperForLog.WriteErrorLog("LoadAllMasterDataParaller:##TrnNo " + Req.TrnNo, ControllerName, ex);
                throw ex;
            }
        }
        public BizResponse MarkSystemFailTransaction(enErrorCode ErrorCode,string Param2="",string Param3="")
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
                EmailSendTransactionHoldOrFailed(Newtransaction.Id, Newtransaction.MemberID + "",Req.PairID,Req.Qty, Newtransaction.TrnDate + "", Req.Price, 0, 2, Convert.ToInt16(Req.ordertype),Convert.ToInt16(Req.TrnType));

                try
                {
                    //Rita 26-11-2018 add Activity Notifiation v2
                    ActivityNotificationMessage notification = new ActivityNotificationMessage();
                    //notification.MsgCode = Convert.ToInt32(enErrorCode.TransactionValidationFail);
                    notification.MsgCode = Convert.ToInt32(ErrorCode); //komal 05-02-2019 set validation error code
                    notification.Param1 = Req.TrnNo.ToString();
                    notification.Param2 = Param2;
                    notification.Param3 = Param3;
                    notification.Param4 = "USD";
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
                    TrnNo = Req.TrnNo,//NewTradetransactionReq.TrnNo,
                    IsAPITrade=0,
                    IsExpired =0,//Rita 30-1-19 for API level changes
                    APIStatus = "",
                    IsAPICancelled = 0
                };
                NewTradetransaction = _TradeTransactionRepository.Add(NewTradetransaction);
            }
            catch (Exception ex)
            {
               HelperForLog.WriteErrorLog("InsertTradeTransactionInQueue:##TrnNo " + Req.TrnNo, ControllerName, ex);
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
                    PairID=Req.PairID,
                    TrnNo = Req.TrnNo,
                    ISFollowersReq=Req.ISFollowersReq,//Rita 12-1-19 main req always 0
                    FollowingTo =Req.FollowingTo,//Rita 12-1-19 main req always 0
                    LeaderTrnNo = Req.LeaderTrnNo,//Rita 21-1-19 main req always 0
                    FollowTradeType = Req.FollowTradeType//Rita 22-1-19 main req always blank
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
                TradeStopLossObj =_TradeStopLoss.Add(TradeStopLossObj);
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

                    if (ErrorCode == enErrorCode.sp_InsufficientBalanceForCharge)//Rita 13-03-19 In this case only send diff ErrorCode as per front and wallet
                        notification.MsgCode = Convert.ToInt32(ErrorCode);

                    //notification.MsgCode = Convert.ToInt32(ErrorCode);
                    notification.Param1 = Req.TrnNo.ToString();
                    notification.Type = Convert.ToInt16(EnNotificationType.Fail);
                    _ISignalRService.SendActivityNotificationV2(notification, Req.MemberID.ToString(),2);//Req.accessToken
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
                if (Newtransaction.Status != 0)//Rita 22-2-19 this update after settlement so overrights status, error solved
                    return;

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
                if (NewTradetransaction.Status != 0)
                    return;

                NewTradetransaction.MakeTransactionHold();
                NewTradetransaction.SetTransactionStatusMsg(StatusMsg);
                NewTradetransaction.SetTransactionCode(Convert.ToInt64(ErrorCode));
                if (NewTradetransaction.Status == 1)
                    return;
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
                    Parallel.Invoke(() => _ISignalRService.OnStatusHold(Convert.ToInt16(enTransactionStatus.Success), CopyNewtransaction, CopyNewTradetransaction,"", TradeStopLossObj.ordertype));
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
                    IsAPITrade = 0,//Rita 30-1-19 for API level changes in settlement , do not pick in local settlement
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
                    IsAPITrade = 0,//Rita 30-1-19 for API level changes in settlement , do not pick in local settlement
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

        //public async Task<BizResponse> TradingDataInsert(BizResponse _Resp)
        //{
        //    try
        //    {                
        //        //foreach (TransactionProviderResponse Provider in TxnProviderList)//Make txn on every API
        //        //{
        //        //    Newtransaction.SetServiceProviderData(Provider.ServiceID, Provider.ServiceProID, Provider.ProductID, Provider.RouteID);
        //        //    _TransactionRepository.Update(Newtransaction);
        //        //    break;
        //        //}                
        //        _Resp.ReturnMsg = "success";
        //        _Resp.ReturnCode = enResponseCodeService.Success;
        //    }
        //    catch (Exception ex)
        //    {
        //        Task.Run(() => HelperForLog.WriteErrorLog("TradingDataInsert:##TrnNo " + Req.TrnNo, ControllerName, ex));
        //        _Resp.ReturnCode = enResponseCodeService.Fail;
        //        _Resp.ReturnMsg = ex.Message;
        //    }
        //    //return Task.FromResult(_Resp);
        //    return _Resp;
        //}

        #endregion

        //khushali 22-05-2019 Seperate code block Trading type wise 
        public async Task<BizResponse> TradingConfiguration(BizResponse _Resp)
        {
            ProcessTransactionCls _TransactionObj = new ProcessTransactionCls();
            WebAPIParseResponseCls WebAPIParseResponseClsObj = new WebAPIParseResponseCls();
            //RealTimeLtpChecker RealTimeLtpCheckerobj = new RealTimeLtpChecker();
            GetLTPDataLPwise GetLTPDataLPwiseObj = new GetLTPDataLPwise();
            List<CryptoWatcher> LTPData = new List<CryptoWatcher>();
            short IsTxnProceed = 0;
            _Resp = new BizResponse();
            try
            {
                var BinanceExchangeInfoResp = _binanceLPService.GetExchangeInfoAsync();

                if (IsOnlyMarketMakingTradeOn==1 || IsOnlyLiquidtyTradeOn==1)//enTradingType.MarketMaking.ToString() == "MarketMaking"
                {
                    #region old logic - Real time check LTP
                    //RealTimeLtpCheckerobj.Pair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                    //foreach (TransactionProviderResponse Provider in TxnProviderList)
                    //{

                    //    RealTimeLtpCheckerobj.List.Add(new LTPcls { LpType = Convert.ToInt16(Provider.AppTypeID), Price = 0 });
                    //}
                    //RealTimeLtpCheckerobj = await _mediator.Send(RealTimeLtpCheckerobj);
                    //if (Req.TrnType == enTrnType.Buy_Trade)
                    //{
                    //    RealTimeLtpCheckerobj.List = RealTimeLtpCheckerobj.List.OrderBy(o => o.Price).ToList();
                    //}
                    //else
                    //{
                    //    RealTimeLtpCheckerobj.List = RealTimeLtpCheckerobj.List.OrderByDescending(o => o.Price).ToList();
                    //}

                    //foreach (var Data in RealTimeLtpCheckerobj.List)//Make txn on every API
                    //{
                    //    TransactionProviderResponse Provider = TxnProviderList.Where(e => (short)e.AppTypeID == Data.LpType).FirstOrDefault();
                    //    IsTxnProceed = await TradingDataInsertV2(_Resp, Provider);
                    //    if (IsTxnProceed == 0)
                    //        continue;

                    //}
                    #endregion

                    GetLTPDataLPwiseObj.Pair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                    foreach (TransactionProviderResponse Provider in TxnProviderList)
                    {
                        if(GetLTPDataLPwiseObj.LpType == null)
                        {
                            GetLTPDataLPwiseObj.LpType = Provider.AppTypeID.ToString();
                        }
                        else
                        {
                            GetLTPDataLPwiseObj.LpType += "," + Provider.AppTypeID.ToString();
                        }
                    }

                    LTPData = _frontTrnRepository.GetPairWiseLTPData(GetLTPDataLPwiseObj);

                    //LTPData = LTPData.Where(e => e.LTP > 0).ToList();

                    if (Req.TrnType == enTrnType.Buy_Trade)
                    {
                        //LTPData = LTPData.Where(e => e.LTP > 0 && e.LTP <= Req.Price).OrderBy(o => o.LTP).ToList();
                        LTPData = LTPData.Where(e => e.LTP > 0).OrderBy(o => o.LTP).ToList();
                    }
                    else
                    {
                        //LTPData = LTPData.Where(e => e.LTP > 0 && e.LTP >= Req.Price).OrderByDescending(o => o.LTP).ToList();
                        LTPData = LTPData.Where(e => e.LTP > 0).OrderByDescending(o => o.LTP).ToList();
                    }

                    foreach (var Data in LTPData)//Make txn on every API
                    {
                        var Price = Data.LTP;
                        if(Data.LPType == (short)enAppType.COINTTRADINGLocal && IsProceedInLocal == 0)
                        {
                            //if and only if Market making and LTP hase first priority for Local trading then N then add below code for local trading
                            
                            if (Req.TrnType == enTrnType.Buy_Trade)
                            {
                                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Buyer" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                                if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                                {
                                    _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTBuy(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeBuyerListObj, Req.accessToken, 0);
                                }
                            }
                            else
                            {
                                Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Seller" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                                if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                                {
                                    _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTSell(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeSellerListObj, Req.accessToken, 0);
                                }
                            }
                            if (_Resp.ReturnCode != enResponseCodeService.Success)//Move on next provider
                            {
                                IsTxnProceed = 0;
                                continue;
                            }
                            IsTxnProceed = 1;//does not fail this order
                            return _Resp;
                        }
                        if(IsMaxProfit == 1)
                        {
                            if (Req.Price == 0 && Req.ordertype == enTransactionMarketType.MARKET)
                            {
                                Price = Data.LTP;
                            }
                            else if (Req.TrnType == enTrnType.Buy_Trade)
                            {

                                if (Req.Price > 0 && Data.LTP <= Req.Price) // 2 LTP -1 
                                {
                                    Price = Data.LTP;
                                }
                                else if (Req.Price > 0 && Data.LTP >= Req.Price) // 1 , LTP - 3
                                {
                                    Price = Req.Price;
                                }
                                else
                                {
                                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                    _Resp.ReturnCode = enResponseCodeService.Fail;
                                    _Resp.ReturnMsg = "Transaction Failed";
                                    return _Resp;
                                }

                            }
                            else if (Req.TrnType == enTrnType.Sell_Trade)
                            {
                                if (Req.Price > 0 && Data.LTP >= Req.Price)
                                {
                                    Price = Data.LTP;
                                }
                                else if (Req.Price > 0 && Data.LTP <= Req.Price)
                                {
                                    Price = Req.Price;
                                }
                                else
                                {
                                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                    _Resp.ReturnCode = enResponseCodeService.Fail;
                                    _Resp.ReturnMsg = "Transaction Failed";
                                    return _Resp;
                                }
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Failed";
                                return _Resp;
                            }
                        }
                        else
                        {
                            if (Req.Price == 0 && Req.ordertype == enTransactionMarketType.MARKET)
                            {
                                Price = Data.LTP;
                            }
                            else if(Req.ordertype == enTransactionMarketType.LIMIT)
                            {
                                Price = Req.Price;
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Failed";
                                return _Resp;
                            }
                        }

                        TransactionProviderResponse Provider = TxnProviderList.Where(e => (short)e.AppTypeID == Data.LPType).FirstOrDefault();
                        
                        IsTxnProceed = await TradingDataInsertV2(_Resp, Provider, Price);
                        if (IsTxnProceed == 0)
                            continue;        
                        return _Resp;
                    }
                }
                //else if(enTradingType.Liquidity.ToString() == "Liquidity")
                //{
                //    foreach (TransactionProviderResponse Provider in TxnProviderList)//Make txn on every API
                //    {
                //        IsTxnProceed = await TradingDataInsertV2(_Resp, Provider);
                //        if (IsTxnProceed == 0)
                //            continue;

                //    }
                //}
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
            return await Task.FromResult(_Resp);
        }

        //khushali 22-05-2019 Seperate code block Trading type wise 
        public async Task<short> TradingDataInsertV2(BizResponse _Resp, TransactionProviderResponse Provider, decimal LTP)
        {
            ProcessTransactionCls _TransactionObj = new ProcessTransactionCls();
            WebAPIParseResponseCls WebAPIParseResponseClsObj = new WebAPIParseResponseCls();
            RealTimeLtpChecker RealTimeLtpCheckerobj = new RealTimeLtpChecker();
            LPProcessTransactionCls LPProcessTransactionClsObj = new LPProcessTransactionCls();
            short IsTxnProceed = 0;
            _Resp = new BizResponse();
            try
            {
                var huobiExchangeInfoResp = _huobiLPService.GetExchangeInfoAsync();
                var BinanceExchangeInfoResp = _binanceLPService.GetExchangeInfoAsync();
                Newtransaction.SetServiceProviderData(Provider.ServiceID, Provider.SerProDetailID, Provider.ProductID, Provider.RouteID);
                _TransactionRepository.Update(Newtransaction);

                #region "Don't check Provider route for local trading"
                ////if and only if Market making and LTP hase first priority for Local trading then N then add below code for local trading

                //if (Enum.Parse<enWebAPIRouteType>(Provider.ProTypeID.ToString()) == enWebAPIRouteType.TradeServiceLocal && IsProceedInLocal == 0)
                //{
                //    if (Req.TrnType == enTrnType.Buy_Trade)
                //    {
                //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Buyer" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                //        if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                //        {
                //            _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTBuy(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeBuyerListObj, Req.accessToken, 0);
                //        }
                //    }
                //    else
                //    {
                //        Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Seller" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
                //        if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
                //        {
                //            _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTSell(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeSellerListObj, Req.accessToken, 0);
                //        }
                //    }
                //    if (_Resp.ReturnCode != enResponseCodeService.Success)//Move on next provider
                //    {
                //        IsTxnProceed = 0;
                //    }
                //    IsTxnProceed = 1;//does not fail this order
                //}                
                //else 
                #endregion

                if (Enum.Parse<enWebAPIRouteType>(Provider.ProTypeID.ToString()) == enWebAPIRouteType.LiquidityProvider)// for liquidity provider
                {
                    Task.Delay(5000).Wait();

                    var ServiceProConfiguration = _IGetWebRequest.GetServiceProviderConfiguration(Provider.SerProDetailID);
                    if (ServiceProConfiguration == null || string.IsNullOrEmpty(ServiceProConfiguration.APIKey) || string.IsNullOrEmpty(ServiceProConfiguration.SecretKey))
                    {
                        _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_ThirdPartyDataNotFoundMsg;
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ErrorCode = enErrorCode.ProcessTrn_ThirdPartyDataNotFound;
                        IsTxnProceed = 0;
                    }

                    HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--1--LiquidityConfiguration Call Web API---" + "##TrnNo:" + Req.TrnNo);
                    //Insert API request Data
                    _TransactionObj.TransactionRequestID = InsertTransactionRequest(Provider, "Price : " + Req.Price + "API Price : " + LTP + "  Qty : " + Req.Amount + " OrderType :" + Req.ordertype);

                    switch (Provider.AppTypeID)
                    {
                        case (long)enAppType.Binance:
                            await ProcessTransactionOnBinance(_Resp, ServiceProConfiguration, BinanceExchangeInfoResp.Result.Data, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                                goto SuccessTrade;

                        case (long)enAppType.Huobi:
                            await ProcessTransactionOnHuobi(_Resp, ServiceProConfiguration, huobiExchangeInfoResp.Result.Data, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                            goto SuccessTrade;

                        case (long)enAppType.Bittrex:
                            await ProcessTransactionOnBittrex(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                                goto SuccessTrade;
                        case (long)enAppType.TradeSatoshi:
                            await ProcessTransactionOnTradeSatoshi(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                                goto SuccessTrade;
                        case (long)enAppType.Poloniex:
                            await ProcessTransactionOnTradePoloniex(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                                goto SuccessTrade;
                        case (long)enAppType.Coinbase:
                            await ProcessTransactionOnTradeCoinbase(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                                goto SuccessTrade;
                        case (long)enAppType.UpBit:
                            await ProcessTransactionOnTradeUpbit(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo, _TransactionObj, LTP, LPProcessTransactionClsObj);
                            if (_Resp.ReturnCode != enResponseCodeService.Success)
                                IsTxnProceed = 0;//check next loop provider
                            else
                                IsTxnProceed = 1;//does not fail this order
                            goto SuccessTrade;

                        default:
                            HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--3--LiquidityConfiguration Call web API  not found proper liquidity provider---" + "##TrnNo:" + Req.TrnNo);
                            break;
                    }
                    SuccessTrade:

                    HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--2--LiquidityConfiguration Call web API---" + "##TrnNo:" + Req.TrnNo);

                                           
                    if (IsTxnProceed == 1)
                    {
                        NewtransactionRequest.SetResponse(_TransactionObj.APIResponse);
                        NewtransactionRequest.SetResponseTime(Helpers.UTC_To_IST());

                        NewtransactionRequest.SetTrnID(WebAPIParseResponseClsObj.TrnRefNo);
                        NewtransactionRequest.SetOprTrnID(WebAPIParseResponseClsObj.OperatorRefNo);
                        _TransactionRequest.Update(NewtransactionRequest);

                        NewTradetransaction.IsAPITrade = 1;
                        NewTradetransaction.APIPrice = LTP;
                        NewTradetransaction.SetTransactionStatusMsg(WebAPIParseResponseClsObj.StatusMsg);
                        //if (_Resp.ErrorCode == enErrorCode.API_LP_Filled)
                        //{
                            NewTradetransaction.APIStatus = NewTradetransaction.Status.ToString();
                        //}
                        _TradeTransactionRepository.Update(NewTradetransaction);
                        if (Req.TrnType == enTrnType.Buy_Trade)
                        {
                            TradeBuyerListObj.Status = NewTradetransaction.Status;
                            TradeBuyerListObj.IsAPITrade = NewTradetransaction.IsAPITrade;
                            TradeBuyerListObj.IsProcessing = 0;
                            _TradeBuyerList.Update(TradeBuyerListObj);
                        }
                        else if (Req.TrnType == enTrnType.Sell_Trade)
                        {
                            TradeSellerListObj.Status = NewTradetransaction.Status;
                            TradeSellerListObj.IsAPITrade = NewTradetransaction.IsAPITrade;
                            TradeSellerListObj.IsProcessing = 0;
                            _TradeSellerList.Update(TradeSellerListObj);                            
                        }
                        if (_Resp.ErrorCode == enErrorCode.API_LP_Filled)
                        {
                            //await _SettlementRepositoryAPI.PROCESSSETLLEMENTAPI(_Resp, Req.TrnNo,0,Req.Amount,Req.Price);
                            await _SettlementRepositoryAPI.PROCESSSETLLEMENTAPIFromInit(_Resp, Req.TrnNo,0,Req.Qty,Req.Price, Newtransaction, NewTradetransaction, TradeStopLossObj, TradeBuyerListObj, TradeSellerListObj);
                        }
                        else if(_Resp.ErrorCode == enErrorCode.API_LP_PartialFilled)
                        {
                            //await _SettlementRepositoryAPI.PROCESSSETLLEMENTAPI(_Resp, Req.TrnNo,0,Req.Amount,Req.Price);
                            await _SettlementRepositoryAPI.PROCESSSETLLEMENTAPIFromInit(_Resp, Req.TrnNo, LPProcessTransactionClsObj.RemainingQty, LPProcessTransactionClsObj.SettledQty, Req.Price, Newtransaction, NewTradetransaction, TradeStopLossObj, TradeBuyerListObj, TradeSellerListObj);
                        }
                    }
                }
                   
                if (IsTxnProceed == 0)//Here add logic of SPOT order is pending then make release and remove code of release from settlementrepository
                {
                    Newtransaction.SetServiceProviderData(0, 0, 0, 0);
                    _TransactionRepository.Update(Newtransaction);
                    _Resp.ErrorCode = enErrorCode.ProcessTrn_OprFail;
                    //if(Req.TrnType == enTrnType.Buy_Trade)
                    //{
                    //    await _SettlementRepositoryV1.ReleaseWalletAmountBuy(TradeBuyerListObj, Newtransaction, NewTradetransaction);
                    //}
                    //else if (Req.TrnType == enTrnType.Sell_Trade)
                    //{
                    //    await _SettlementRepositoryV1.ReleaseWalletAmountSell(TradeSellerListObj, Newtransaction, NewTradetransaction);
                    //}
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
            return await Task.FromResult(IsTxnProceed);
        }








        // khushali 22-05-2019 Seperate code block Trading type wise - old code
        #region TradingDataInsertV2OLD

        //public async Task<BizResponse> TradingDataInsertV2OLD(BizResponse _Resp)
        //{
        //    ProcessTransactionCls _TransactionObj = new ProcessTransactionCls();
        //    WebAPIParseResponseCls WebAPIParseResponseClsObj = new WebAPIParseResponseCls();
        //    RealTimeLtpChecker RealTimeLtpCheckerobj = new RealTimeLtpChecker();
        //    short IsTxnProceed = 0;
        //    _Resp = new BizResponse();
        //    try
        //    {
        //        var BinanceExchangeInfoResp = _binanceLPService.GetExchangeInfoAsync();
        //        if (enTradingType.MarketMaking.ToString() == "MarketMaking")
        //        {
        //            RealTimeLtpCheckerobj.Pair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
        //            foreach (TransactionProviderResponse Provider in TxnProviderList)
        //            {
        //                RealTimeLtpCheckerobj.List.Add(new LTPcls { LpType = Convert.ToInt16(Provider.AppTypeID), Price = 0 });
        //            }
        //            RealTimeLtpCheckerobj = await _mediator.Send(RealTimeLtpCheckerobj);
        //        }


        //        if (Req.TrnType == enTrnType.Buy_Trade)
        //        {
        //            TradeBuyerListObj.TrnNo = Req.TrnNo;
        //            TradeBuyerListObj = _TradeBuyerList.Add(TradeBuyerListObj);
        //            RealTimeLtpCheckerobj.List = RealTimeLtpCheckerobj.List.OrderBy(o => o.Price).ToList();
        //        }
        //        else
        //        {
        //            TradeSellerListObj.TrnNo = Req.TrnNo;
        //            TradeSellerListObj = _TradeSellerList.Add(TradeSellerListObj);
        //            RealTimeLtpCheckerobj.List = RealTimeLtpCheckerobj.List.OrderByDescending(o => o.Price).ToList();
        //        }


        //        //foreach (TransactionProviderResponse Provider in TxnProviderList)//Make txn on every API
        //        foreach (var Data in RealTimeLtpCheckerobj.List)//Make txn on every API
        //        {
        //            TransactionProviderResponse Provider = TxnProviderList.Where(e => (short)e.AppTypeID == Data.LpType).FirstOrDefault();
        //            Newtransaction.SetServiceProviderData(Provider.ServiceID, Provider.SerProDetailID, Provider.ProductID, Provider.RouteID);
        //            _TransactionRepository.Update(Newtransaction);

        //            if (Enum.Parse<enWebAPIRouteType>(Provider.ProTypeID.ToString()) == enWebAPIRouteType.TradeServiceLocal)
        //            {
        //                if (Req.TrnType == enTrnType.Buy_Trade)
        //                {
        //                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Buyer" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
        //                    if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
        //                    {
        //                        _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTBuy(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeBuyerListObj, Req.accessToken, 0);
        //                    }
        //                }
        //                else
        //                {
        //                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("CombineAllInitTransactionAsync", ControllerName, "END Seller" + "##TrnNo:" + Req.TrnNo, Helpers.UTC_To_IST()));
        //                    if (Req.ordertype != enTransactionMarketType.STOP_Limit || STOPLimitWithSameLTP == 1)
        //                    {
        //                        _Resp = await _SettlementRepositoryV1.PROCESSSETLLEMENTSell(_Resp, NewTradetransaction, Newtransaction, TradeStopLossObj, TradeSellerListObj, Req.accessToken, 0);
        //                    }
        //                }
        //                if (_Resp.ReturnCode != enResponseCodeService.Success)//Move on next provider
        //                {
        //                    continue;
        //                }
        //                IsTxnProceed = 1;//does not fail this order
        //                break;
        //            }
        //            else if (Enum.Parse<enWebAPIRouteType>(Provider.ProTypeID.ToString()) == enWebAPIRouteType.LiquidityProvider)// for liquidity provider
        //            {
        //                Task.Delay(5000).Wait();

        //                var ServiceProConfiguration = _IGetWebRequest.GetServiceProviderConfiguration(Provider.SerProDetailID);
        //                if (ServiceProConfiguration == null)
        //                {
        //                    _Resp.ReturnMsg = EnResponseMessage.ProcessTrn_ThirdPartyDataNotFoundMsg;
        //                    _Resp.ReturnCode = enResponseCodeService.Fail;
        //                    _Resp.ErrorCode = enErrorCode.ProcessTrn_ThirdPartyDataNotFound;
        //                    continue;
        //                }

        //                HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--1--LiquidityConfiguration Call Web API---" + "##TrnNo:" + Req.TrnNo);
        //                //Insert API request Data
        //                _TransactionObj.TransactionRequestID = InsertTransactionRequest(Provider, "Price : " + Req.Price + "  Qty : " + Req.Amount + " OrderType :" + Req.ordertype);

        //                switch (Provider.AppTypeID)
        //                {
        //                    case (long)enAppType.Binance:
        //                        await ProcessTransactionOnBinance(_Resp, ServiceProConfiguration, BinanceExchangeInfoResp.Result.Data, WebAPIParseResponseClsObj, Provider, Req.TrnNo);
        //                        if (_Resp.ReturnCode != enResponseCodeService.Success)
        //                            continue;//check next loop provider

        //                        IsTxnProceed = 1;//does not fail this order
        //                        goto SuccessTrade;

        //                    case (long)enAppType.Bittrex:
        //                        await ProcessTransactionOnBittrex(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo);
        //                        if (_Resp.ReturnCode != enResponseCodeService.Success)
        //                            continue;//check next loop provider

        //                        IsTxnProceed = 1;//does not fail this order
        //                        goto SuccessTrade;

        //                    case (long)enAppType.TradeSatoshi:
        //                        await ProcessTransactionOnTradeSatoshi(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo);
        //                        if (_Resp.ReturnCode != enResponseCodeService.Success)
        //                            continue;//check next loop provider

        //                        IsTxnProceed = 1;//does not fail this order
        //                        goto SuccessTrade;
        //                    case (long)enAppType.Poloniex:
        //                        await ProcessTransactionOnTradePoloniex(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo);
        //                        if (_Resp.ReturnCode != enResponseCodeService.Success)
        //                            continue;//check next loop provider

        //                        IsTxnProceed = 1;//does not fail this order
        //                        goto SuccessTrade;
        //                    case (long)enAppType.Coinbase:
        //                        await ProcessTransactionOnTradeCoinbase(_Resp, ServiceProConfiguration, WebAPIParseResponseClsObj, Provider, Req.TrnNo);
        //                        if (_Resp.ReturnCode != enResponseCodeService.Success)
        //                            continue;//check next loop provider

        //                        IsTxnProceed = 1;//does not fail this order
        //                        goto SuccessTrade;

        //                    default:
        //                        HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--3--LiquidityConfiguration Call web API  not found proper liquidity provider---" + "##TrnNo:" + Req.TrnNo);
        //                        break;
        //                }
        //                SuccessTrade:

        //                HelperForLog.WriteLogIntoFile("LiquidityConfiguration", ControllerName, "--2--LiquidityConfiguration Call web API---" + "##TrnNo:" + Req.TrnNo);

        //                NewtransactionRequest.SetResponse(_TransactionObj.APIResponse);
        //                NewtransactionRequest.SetResponseTime(Helpers.UTC_To_IST());

        //                NewtransactionRequest.SetTrnID(WebAPIParseResponseClsObj.TrnRefNo);
        //                NewtransactionRequest.SetOprTrnID(WebAPIParseResponseClsObj.OperatorRefNo);
        //                _TransactionRequest.Update(NewtransactionRequest);
        //                if (IsTxnProceed == 1)
        //                {
        //                    NewTradetransaction.IsAPITrade = 1;
        //                    NewTradetransaction.SetTransactionStatusMsg(WebAPIParseResponseClsObj.StatusMsg);
        //                    _TradeTransactionRepository.Update(NewTradetransaction);
        //                    break;
        //                }
        //            }

        //        }
        //        if (IsTxnProceed == 0)//Here add logic of SPOT order is pending then make release and remove code of release from settlementrepository
        //        {
        //            _Resp.ErrorCode = enErrorCode.ProcessTrn_OprFail;
        //            //if(Req.TrnType == enTrnType.Buy_Trade)
        //            //{
        //            //    await _SettlementRepositoryV1.ReleaseWalletAmountBuy(TradeBuyerListObj, Newtransaction, NewTradetransaction);
        //            //}
        //            //else if (Req.TrnType == enTrnType.Sell_Trade)
        //            //{
        //            //    await _SettlementRepositoryV1.ReleaseWalletAmountSell(TradeSellerListObj, Newtransaction, NewTradetransaction);
        //            //}
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        HelperForLog.WriteErrorLog("CallWebAPI:##TrnNo " + Req.TrnNo, ControllerName, ex);
        //        if (IsTxnProceed == 0)
        //        {
        //            _Resp.ReturnMsg = "Error occured";
        //            _Resp.ReturnCode = enResponseCodeService.Fail;
        //            _Resp.ErrorCode = enErrorCode.ProcessTrn_APICallInternalError;
        //        }
        //        else
        //        {
        //            _Resp.ReturnMsg = "Hold";
        //            _Resp.ReturnCode = enResponseCodeService.Success;
        //            _Resp.ErrorCode = enErrorCode.ProcessTrn_Hold;
        //        }

        //    }
        //    return await Task.FromResult(_Resp);
        //}

        #endregion

        private async Task<BizResponse> ProcessTransactionOnHuobi(BizResponse _Resp, ServiceProConfiguration serviceProConfiguration, List<HuobiSymbol> data, WebAPIParseResponseCls webAPIParseResponseClsObj, TransactionProviderResponse provider, long trnNo, ProcessTransactionCls transactionObj, decimal lTP, LPProcessTransactionCls lPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {
                _huobiLPService._client.SetApiCredentials(serviceProConfiguration.APIKey, serviceProConfiguration.SecretKey);
                string LocalPair = _BaseCurrService.SMSCode + _SecondCurrService.SMSCode;
               
                foreach (var obj in data)
                {
                    if(LocalPair.ToLower() == obj.Symbol)
                    {
                         WebCallResult<long> HuobiResult =await _huobiLPService.PlaceOrder(Req.AccountID, obj.Symbol, Req.TrnType == enTrnType.Sell_Trade ? Huobi.Net.Objects.HuobiOrderType.MarketSell : Huobi.Net.Objects.HuobiOrderType.MarketBuy, Req.Amount, Req.Price);

                       // var result= "{  \"account-id\": \"100009\",\"amount\": \"10.1\", \"price\": \"100.1\",\"source\": \"api\",\"symbol\": \"ethusdt\"  \"type\": \"buy-limit\"}";
                        if (HuobiResult == null)
                        {
                            _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                            _Resp.ReturnCode = enResponseCodeService.Fail;
                            _Resp.ReturnMsg = "Transaction Fail On huobi";
                            return _Resp;
                        }
                        if (HuobiResult.Success)
                        {
                            IsProcessedBit = 1;
                            _TransactionObj.APIResponse = JsonConvert.SerializeObject(HuobiResult);
                            //_TransactionObj.APIResponse = JsonConvert.SerializeObject(result);
                            if (HuobiResult.Success)
                            {

                                // CallResult<BittrexAccountOrder> BittrexResult2 = await _bitrexLPService.GetOrderInfoAsync(BittrexResult1.Data.Uuid);
                                WebCallResult<HuobiOrder> webCall = await _huobiLPService.GetOrderInfoAsync(HuobiResult.Data);

                                webAPIParseResponseClsObj.TrnRefNo = HuobiResult.Data.ToString();
                                webAPIParseResponseClsObj.OperatorRefNo = webCall.Data.Id.ToString();
                                if (webCall.Success)

                                {

                                    if (webCall.Data.State == HuobiOrderState.Filled)
                                    {
                                        lPProcessTransactionClsObj.RemainingQty = 0;
                                        lPProcessTransactionClsObj.SettledQty = webCall.Data.FilledAmount;
                                        lPProcessTransactionClsObj.TotalQty = Req.Qty;
                                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction fully Success On Huobi";
                                        return _Resp;

                                    }
                                    else if (webCall.Data.State == HuobiOrderState.PartiallyFilled)
                                    {
                                        lPProcessTransactionClsObj.RemainingQty = webCall.Data.Amount - webCall.Data.FilledAmount;
                                        lPProcessTransactionClsObj.SettledQty = webCall.Data.FilledAmount;
                                        lPProcessTransactionClsObj.TotalQty = Req.Qty;
                                        _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction partial Success On huobi";
                                        return _Resp;
                                    }
                                    else if (webCall.Data.State == HuobiOrderState.PartiallyCanceled)
                                    {
                                        lPProcessTransactionClsObj.RemainingQty = webCall.Data.FilledAmount;
                                        lPProcessTransactionClsObj.SettledQty = webCall.Data.FilledAmount;
                                        lPProcessTransactionClsObj.TotalQty = Req.Qty;
                                        _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                        _Resp.ReturnCode = enResponseCodeService.Fail;
                                        _Resp.ReturnMsg = "Transaction partial FAIL On huobi";
                                        return _Resp;
                                    }
                                    else if (webCall.Data.State == HuobiOrderState.Canceled)
                                    {
                                        webAPIParseResponseClsObj.Status = enTransactionStatus.OperatorFail;
                                        _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                        _Resp.ReturnCode = enResponseCodeService.Fail;
                                        _Resp.ReturnMsg = "Transaction Fail On huobi";
                                    }
                                    else if (webCall.Data.State == HuobiOrderState.Created)
                                    {
                                        _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction processing Success On huobi";
                                        return _Resp;
                                    }
                                    else
                                    {
                                        IsProcessedBit = 0;
                                        _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                        _Resp.ReturnCode = enResponseCodeService.Fail;
                                        _Resp.ReturnMsg = "Transaction Fail On huobi";
                                        return _Resp;
                                    }


                                }
                            }
                        }
                    }
                }
                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On Huobi";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionHuobi:##TrnNo " + trnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                {
                    if (webAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction Success On Huobi";
                        return _Resp;
                    }
                    else
                    {
                        _Resp.ReturnCode = enResponseCodeService.Success;
                    }
                }
                else
                {
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                    _Resp.ReturnMsg = ex.Message;
                    _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
                }
            }
            return _Resp;
        }

        private async Task<BizResponse> ProcessTransactionOnBinance(BizResponse _Resp,ServiceProConfiguration ServiceProConfiguration, BinanceExchangeInfo BinanceExchangeInfoResult, WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj,decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {
                _binanceLPService._client.SetApiCredentials(ServiceProConfiguration.APIKey, ServiceProConfiguration.SecretKey);
                foreach (var symbol in BinanceExchangeInfoResult.Symbols)
                {
                    if (symbol.Name == ( _SecondCurrService.SMSCode + _BaseCurrService.SMSCode))
                    {
                        //if (symbol.MinNotionalFilter.MinNotional <= Req.Price * Req.Qty)
                        if (symbol.MinNotionalFilter.MinNotional <= LTP * Req.Qty)
                            {
                            //if (symbol.PriceFilter.MinPrice <= Req.Price && symbol.PriceFilter.MaxPrice >= Req.Price)
                            if (symbol.PriceFilter.MinPrice <= LTP && symbol.PriceFilter.MaxPrice >= LTP)
                                {
                                if (symbol.MarketLotSizeFilter.MinQuantity <= Req.Qty && symbol.MarketLotSizeFilter.MaxQuantity >= Req.Qty)
                                {
                                    Binance.Net.Objects.OrderType type = Req.ordertype == enTransactionMarketType.LIMIT ? Binance.Net.Objects.OrderType.Limit
                                    : (Req.ordertype == enTransactionMarketType.MARKET ? Binance.Net.Objects.OrderType.Market
                                    : (Req.ordertype == enTransactionMarketType.STOP ? Binance.Net.Objects.OrderType.StopLoss
                                    : (Req.ordertype == enTransactionMarketType.STOP_Limit ? Binance.Net.Objects.OrderType.StopLossLimit : Binance.Net.Objects.OrderType.TakeProfit
                                    )));

                                    // commented for testing purpose
                                    ////CallResult<BinancePlacedOrder> BinanceResult = await _binanceLPService.PlaceOrderAsync(Req.TrnType == enTrnType.Sell_Trade ? Binance.Net.Objects.OrderSide.Sell : Binance.Net.Objects.OrderSide.Buy, symbol.Name, type, Req.Qty, price: Req.Price, stopPrice: Req.StopPrice, timeInForce: TimeInForce.ImmediateOrCancel);
                                    CallResult<BinancePlacedOrder> BinanceResult = await _binanceLPService.PlaceOrderAsync(Req.TrnType == enTrnType.Sell_Trade ? Binance.Net.Objects.OrderSide.Sell : Binance.Net.Objects.OrderSide.Buy, symbol.Name, type, Req.Qty, price: LTP, stopPrice: Req.StopPrice, timeInForce: Binance.Net.Objects.TimeInForce.ImmediateOrCancel);
                                   
                                    // khushali Testing Resposne 
                                    //var Result = @" {""Data"":{""Symbol"":""ETHBTC"",""OrderId"":372478262,""ClientOrderId"":""qyqWCPYsuEXhCx2ICIhpOj"",""TransactTime"":1559044223603,""Price"":0.03090000,""origQty"":0.10000000,""executedQty"":0.10000000,""cummulativeQuoteQty"":0.00309610,""Status"":""FILLED"",""TimeInForce"":""IOC"",""Type"":""LIMIT"",""Side"":""SELL"",""Fills"":[{""TradeId"":124844138,""Price"":0.03096100,""qty"":0.10000000,""Commission"":0.00000310,""CommissionAsset"":""BTC""}]},""Error"":null,""Success"":true}";
                                    //CallResult<BinancePlacedOrder> BinanceResult = JsonConvert.DeserializeObject<CallResult<BinancePlacedOrder>>(Result);

                                    if (BinanceResult.Success)
                                    {
                                        IsProcessedBit = 1;
                                        HelperForLog.WriteLogIntoFile("ProcessBinanceOnTradeSatoshi:##TrnNo " + TrnNo, ControllerName, JsonConvert.SerializeObject(BinanceResult));
                                        _TransactionObj.APIResponse = JsonConvert.SerializeObject(BinanceResult);
                                        if (BinanceResult.Success)
                                        {
                                            WebAPIParseResponseClsObj.TrnRefNo = BinanceResult.Data.OrderId.ToString();
                                            WebAPIParseResponseClsObj.OperatorRefNo = BinanceResult.Data.ClientOrderId;
                                            WebAPIParseResponseClsObj.Status = BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.New ? enTransactionStatus.Hold :
                                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Filled ? enTransactionStatus.Success :
                                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.PartiallyFilled ? enTransactionStatus.Hold :
                                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Rejected ? enTransactionStatus.OperatorFail :
                                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Canceled ? enTransactionStatus.OperatorFail : enTransactionStatus.OperatorFail))));

                                            if(BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Filled)
                                            {
                                                LPProcessTransactionClsObj.RemainingQty = BinanceResult.Data.OriginalQuantity - BinanceResult.Data.ExecutedQuantity;
                                                LPProcessTransactionClsObj.SettledQty = BinanceResult.Data.ExecutedQuantity;
                                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                                _Resp.ReturnCode = enResponseCodeService.Success;
                                                _Resp.ReturnMsg = "Transaction fully Success On Binanace";
                                                return _Resp;
                                            }
                                            else if (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.PartiallyFilled)
                                            {
                                                LPProcessTransactionClsObj.RemainingQty = BinanceResult.Data.OriginalQuantity - BinanceResult.Data.ExecutedQuantity;
                                                LPProcessTransactionClsObj.SettledQty = BinanceResult.Data.ExecutedQuantity;
                                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                                _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                                _Resp.ReturnCode = enResponseCodeService.Success;
                                                _Resp.ReturnMsg = "Transaction partial Success On Binanace";
                                                return _Resp;
                                            }
                                            else if (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Expired)
                                            {
                                                IsProcessedBit = 0;
                                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                                _Resp.ReturnMsg = "Transaction Fail On Binanace";
                                                return _Resp;
                                            }
                                            else if (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.New)
                                            {
                                                _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                                _Resp.ReturnCode = enResponseCodeService.Success;
                                                _Resp.ReturnMsg = "Transaction processing Success On Binanace";
                                                return _Resp;
                                            }
                                            else
                                            {
                                                IsProcessedBit = 0;
                                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                                _Resp.ReturnMsg = "Transaction Fail On Binanace";
                                                return _Resp;

                                            }                                            
                                        }
                                    }                                    
                                }
                            }
                        }
                    }
                }
                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On Binanace";

            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnBinance:##TrnNo " + TrnNo, ControllerName, ex);
                if(IsProcessedBit==1)//Does not proceed on next API
                    if (WebAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction Success On Binanace";
                        return _Resp;
                    }
                    else
                    {
                        _Resp.ReturnCode = enResponseCodeService.Success;
                    }                
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
        }

        private async Task<BizResponse> ProcessTransactionOnBittrex(BizResponse _Resp, ServiceProConfiguration ServiceProConfiguration,WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj, decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {
                //BittrexClient.SetDefaultOptions(new BittrexClientOptions()
                //{
                //    ApiCredentials = new ApiCredentials(ServiceProConfiguration.APIKey, ServiceProConfiguration.SecretKey)
                //});
                _bitrexLPService._client.SetApiCredentials(ServiceProConfiguration.APIKey, ServiceProConfiguration.SecretKey);
                string LocalPair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                string BittrexPair = LocalPair.Split("_")[1] + "_" + LocalPair.Split("_")[0];
                CallResult<BittrexGuid> BittrexResult1 = await _bitrexLPService.PlaceOrderAsync(Req.TrnType == enTrnType.Sell_Trade ? Bittrex.Net.Objects.OrderSide.Sell : Bittrex.Net.Objects.OrderSide.Buy, BittrexPair, Req.Qty, LTP);
                if(BittrexResult1 == null)
                {
                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Fail On Binanace";
                    return _Resp;
                }
                if (!BittrexResult1.Success && BittrexResult1.Data == null)
                {
                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Fail On Binanace";
                    return _Resp;
                }
                if (BittrexResult1.Success)
                {
                    IsProcessedBit = 1;
                    _TransactionObj.APIResponse = JsonConvert.SerializeObject(BittrexResult1);
                    if (BittrexResult1.Success)
                    {
                        CallResult<BittrexAccountOrder> BittrexResult2 = await _bitrexLPService.GetOrderInfoAsync(BittrexResult1.Data.Uuid);
                        WebAPIParseResponseClsObj.TrnRefNo = BittrexResult1.Data.Uuid.ToString();
                        WebAPIParseResponseClsObj.OperatorRefNo = BittrexResult2.Data.OrderUuid.ToString();
                        if (BittrexResult2.Success)
                        {
                            if (BittrexResult2.Data.QuantityRemaining == 0)
                            {
                                LPProcessTransactionClsObj.RemainingQty = BittrexResult2.Data.QuantityRemaining;
                                LPProcessTransactionClsObj.SettledQty = BittrexResult2.Data.Quantity - BittrexResult2.Data.QuantityRemaining;
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Success;
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction fully Success On Bittrex";
                                return _Resp;
                            }
                            else if (BittrexResult2.Data.QuantityRemaining < BittrexResult2.Data.Quantity) // partial
                            {
                                LPProcessTransactionClsObj.RemainingQty = BittrexResult2.Data.QuantityRemaining;
                                LPProcessTransactionClsObj.SettledQty = BittrexResult2.Data.Quantity - BittrexResult2.Data.QuantityRemaining;
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;
                                _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction partial Success On Bittrex";
                                return _Resp;
                            }
                            else if(BittrexResult2.Data.QuantityRemaining == BittrexResult2.Data.Quantity) // hold
                            {
                                LPProcessTransactionClsObj.RemainingQty = BittrexResult2.Data.QuantityRemaining;
                                LPProcessTransactionClsObj.SettledQty = BittrexResult2.Data.Quantity;
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;
                                _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction processing Success On Bittrex";
                                return _Resp;
                            }
                            else if (BittrexResult2.Data.CancelInitiated)
                            {
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.OperatorFail;
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Fail On Bittrex";
                            }
                        }
                        _Resp.ErrorCode = enErrorCode.API_LP_Success;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction processing Success On Bittrex";
                        return _Resp;
                    }
                }

                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On Bittrex";
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnBittrex:##TrnNo " + TrnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                    if (WebAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction Success On Bittrex";
                        return _Resp;
                    }
                    else
                    {
                        _Resp.ReturnCode = enResponseCodeService.Success;
                    }
                
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
        }

        private async Task<BizResponse> ProcessTransactionOnTradeSatoshi(BizResponse _Resp, ServiceProConfiguration ServiceProConfiguration, WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj, decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {

                GlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                GlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                string TradeSatoshiPair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                /// commented -- actual code
                SubmitOrderReturn TradeSatoshiResult = _tradeSatoshiLPService.PlaceOrderAsync(Req.TrnType == enTrnType.Sell_Trade ? Core.Interfaces.LiquidityProvider.OrderSide.Sell : Core.Interfaces.LiquidityProvider.OrderSide.Buy, TradeSatoshiPair, Req.Qty, LTP).Result;

                //var Result = @" {""success"":true,""message"":null,""result"":{""orderId"":140876176,""filled"":[21474705,21474706,21474707,21474708,21474709,21474710,21474711,21474712,21474713,21474714,21474715,21474716,21474717,21474718,21474719,21474720,21474721,21474722,21474723]}}";
                //SubmitOrderReturn TradeSatoshiResult = JsonConvert.DeserializeObject<SubmitOrderReturn>(Result);
                
                _TransactionObj.APIResponse = JsonConvert.SerializeObject(TradeSatoshiResult);
                if (TradeSatoshiResult.success)
                {
                    IsProcessedBit = 1;
                    WebAPIParseResponseClsObj.TrnRefNo = TradeSatoshiResult.result.OrderId.ToString();
                    WebAPIParseResponseClsObj.OperatorRefNo = TradeSatoshiResult.result.OrderId.ToString();
                    if (TradeSatoshiResult.result.OrderId != null)
                    {
                        GetOrderReturn TradeSatoshiResult1 = await _tradeSatoshiLPService.GetOrderInfoAsync(Convert.ToInt64(TradeSatoshiResult.result.OrderId));

                        //var Result1 = @" {""success"":true,""message"":null,""result"":{""id"":140876176,""market"":""ETH_BTC"",""type"":""Sell"",""amount"":0.01544508,""rate"":0.03198508,""remaining"":0.01094647,""total"":0.00049401,""status"":""Partial"",""timestamp"":""2019-05-29T11:16:11.527"",""isApi"":true}}";
                        //GetOrderReturn TradeSatoshiResult1 = JsonConvert.DeserializeObject<GetOrderReturn>(Result1);

                        //GetOrderReturn TradeSatoshiResult1 = await _tradeSatoshiLPService.GetOrderInfoAsync(TradeSatoshiResult.result.OrderId);
                        if (TradeSatoshiResult1.success)
                        {
                            if (TradeSatoshiResult1.result.Status.ToLower() == "complete")
                            {
                                LPProcessTransactionClsObj.RemainingQty = TradeSatoshiResult1.result.Remaining;
                                LPProcessTransactionClsObj.SettledQty = TradeSatoshiResult1.result.Amount ;
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Success;
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction fully Success On TradeSatoshi";
                                return _Resp;
                            }
                            else if (TradeSatoshiResult1.result.Status.ToLower() == "partial")
                            {
                                LPProcessTransactionClsObj.RemainingQty = TradeSatoshiResult1.result.Remaining;
                                LPProcessTransactionClsObj.SettledQty = TradeSatoshiResult1.result.Amount - TradeSatoshiResult1.result.Remaining;
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;
                                _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction partial Success On TradeSatoshi";
                                return _Resp;
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Fail On TradeSatoshi";
                                return _Resp;
                            }
                        }
                        else
                        {
                            _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                            _Resp.ReturnCode = enResponseCodeService.Fail;
                            _Resp.ReturnMsg = "Transaction Fail On TradeSatoshi";
                            return _Resp;
                        }
                    }
                    else
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ReturnMsg = "Transaction Fail On TradeSatoshi";
                        return _Resp;
                    }                    
                }

                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On TradeSatoshi";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnTradeSatoshi:##TrnNo " + TrnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                    if (WebAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction Success On Bittrex";
                        return _Resp;
                    }
                    else
                    {
                        _Resp.ReturnCode = enResponseCodeService.Success;
                    }
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
        }

        private async Task<BizResponse> ProcessTransactionOnTradePoloniex(BizResponse _Resp, ServiceProConfiguration ServiceProConfiguration, WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj, decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {
                PoloniexGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                PoloniexGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                PoloniexOrderResult PoloniexResult = new PoloniexOrderResult();
                PoloniexErrorObj errorObj = new PoloniexErrorObj();

                var PoloniexRes = await _poloniexService.PlacePoloniexOrder(_BaseCurrService.SMSCode, _SecondCurrService.SMSCode, Req.Qty, LTP, Req.TrnType == enTrnType.Sell_Trade ? enOrderType.SellOrder : enOrderType.BuyOrder);
                if(PoloniexRes == null)
                {
                    errorObj = JsonConvert.DeserializeObject<PoloniexErrorObj>(PoloniexRes);
                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Fail On Poloniex";
                    return _Resp;
                }
                if (PoloniexRes != null && PoloniexRes.ToLower().Contains("error"))
                {
                    errorObj = JsonConvert.DeserializeObject<PoloniexErrorObj>(PoloniexRes);
                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Fail On Poloniex";
                    return _Resp;
                }
                IsProcessedBit = 1;
                _TransactionObj.APIResponse = PoloniexRes;

                PoloniexResult = JsonConvert.DeserializeObject<PoloniexOrderResult>(PoloniexRes);
                if (PoloniexResult.resultingTrades == null)
                {
                    errorObj = JsonConvert.DeserializeObject<PoloniexErrorObj>(PoloniexRes);
                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                    _Resp.ReturnCode = enResponseCodeService.Fail;
                    _Resp.ReturnMsg = "Transaction Fail On Poloniex";
                    return _Resp;
                }
                if (PoloniexResult.orderNumber != null)
                {
                    WebAPIParseResponseClsObj.TrnRefNo = PoloniexResult.orderNumber.ToString();
                    WebAPIParseResponseClsObj.OperatorRefNo = PoloniexResult.orderNumber.ToString();
                    WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;

                    object PoloniexRep = await _poloniexService.GetPoloniexOrderState(WebAPIParseResponseClsObj.TrnRefNo);
                    JObject Data = JObject.Parse(PoloniexRep.ToString());
                    var Success = Convert.ToUInt16(Data["result"]["success"]);
                    if (Success == 1)
                    {
                        JToken Result = Data["result"][WebAPIParseResponseClsObj.TrnRefNo];
                        PoloniexOrderState PoloniexResult1 = JsonConvert.DeserializeObject<PoloniexOrderState>(Result.ToString());
                        if (PoloniexResult1.status == "Partially filled")
                        {
                            LPProcessTransactionClsObj.RemainingQty = PoloniexResult1.amount - PoloniexResult1.startingAmount;
                            LPProcessTransactionClsObj.SettledQty = PoloniexResult1.amount;
                            LPProcessTransactionClsObj.TotalQty = Req.Qty;
                            WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;
                            _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Transaction partial Success On Bittrex";
                            return _Resp;
                        }
                        else if (PoloniexResult1.status == "Filled")
                        {
                            LPProcessTransactionClsObj.RemainingQty =0;
                            LPProcessTransactionClsObj.SettledQty = PoloniexResult1.startingAmount;
                            LPProcessTransactionClsObj.TotalQty = Req.Qty;
                            WebAPIParseResponseClsObj.Status = enTransactionStatus.Success;
                            _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                            _Resp.ReturnCode = enResponseCodeService.Success;
                            _Resp.ReturnMsg = "Transaction fully Success On Bittrex";
                            return _Resp;
                        }
                    }

                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "Transaction processing Success On Poloniex";
                    return _Resp;
                }

                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On Poloniex";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnTradePoloniex:##TrnNo " + TrnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                    if (WebAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction Success On Bittrex";
                        return _Resp;
                    }
                    else
                    {
                        _Resp.ReturnCode = enResponseCodeService.Success;
                    }                
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
        }

        private async Task<BizResponse> ProcessTransactionOnTradeCoinbase(BizResponse _Resp, ServiceProConfiguration ServiceProConfiguration, WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj, decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {
                CoinBaseGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                CoinBaseGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                string LocalPair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                string CoinBasePair = Char.ToUpperInvariant(LocalPair.Split("_")[1][0]) + LocalPair.Split("_")[1].Substring(1).ToLower() + Char.ToUpperInvariant(LocalPair.Split("_")[0][0]) + LocalPair.Split("_")[0].Substring(1).ToLower();
                OrderResponse CoinbaseResult = await _coinBaseService.PlaceOrder(Req.ordertype, Req.TrnType == enTrnType.Sell_Trade ? CoinbasePro.Services.Orders.Types.OrderSide.Sell : CoinbasePro.Services.Orders.Types.OrderSide.Buy, CoinBasePair, Req.Qty, LTP, Req.StopPrice);
                IsProcessedBit = 1;
                _TransactionObj.APIResponse = JsonConvert.SerializeObject(CoinbaseResult);
                if (CoinbaseResult.Status == CoinbasePro.Services.Orders.Types.OrderStatus.Active)
                {
                    WebAPIParseResponseClsObj.TrnRefNo = CoinbaseResult.Id.ToString();
                    WebAPIParseResponseClsObj.OperatorRefNo = CoinbaseResult.Id.ToString();
                    WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;

                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "Transaction processing Success On Coinbase";
                    return _Resp;
                }               

                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On Coinbase";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnTradeCoinbase:##TrnNo " + TrnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                    _Resp.ReturnCode = enResponseCodeService.Success;
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
        }

        private async Task<BizResponse> ProcessTransactionOnTradeUpbit(BizResponse _Resp, ServiceProConfiguration ServiceProConfiguration, WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj, decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {
                //UpbitGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                //UpbitGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                string LocalPair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                var UpbitRes = await _upbitService.PlaceOrderAsync(LocalPair, Req.TrnType == enTrnType.Sell_Trade ? UpbitOrderSide.ask : UpbitOrderSide.bid, Req.Qty,Req.Price,Req.ordertype == enTransactionMarketType.LIMIT ? UpbitOrderType.limit : Req.ordertype == enTransactionMarketType.MARKET ? UpbitOrderType.market : Req.ordertype == enTransactionMarketType.STOP ? UpbitOrderType.price : UpbitOrderType.limit);
                    
                IsProcessedBit = 1;
                _TransactionObj.APIResponse = JsonConvert.SerializeObject(UpbitRes);
                if (UpbitRes.state == "done")
                {
                    WebAPIParseResponseClsObj.TrnRefNo = UpbitRes.uuid.ToString();
                    WebAPIParseResponseClsObj.OperatorRefNo = UpbitRes.uuid.ToString();
                    WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;

                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                    _Resp.ReturnCode = enResponseCodeService.Success;
                    _Resp.ReturnMsg = "Transaction processing Success On Upbit";
                    return _Resp;
                }

                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On Coinbase";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnTradeUpbit:##TrnNo " + TrnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                    _Resp.ReturnCode = enResponseCodeService.Success;
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
        }

        public long InsertTransactionRequest(TransactionProviderResponse listObj, string Request)
        {
            try
            {
                NewtransactionRequest = new TransactionRequest()
                {
                    TrnNo = Req.TrnNo,
                    ServiceID = listObj.ServiceID,
                    SerProID = listObj.ServiceProID,
                    SerProDetailID = listObj.SerProDetailID,
                    CreatedDate = Helpers.UTC_To_IST(),
                    RequestData = Request
                };
                NewtransactionRequest = _TransactionRequest.Add(NewtransactionRequest);
                return NewtransactionRequest.Id;

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("InsertTransactionRequest:##TrnNo " + Req.TrnNo, ControllerName, ex);
                return 0;
            }
        }


        #region OKEX Place Order 
        /// <summary>
        /// Add new Place order for OKEX API by Pushpraj as on 17-06-2019
        /// </summary>
        /// <param name="_Resp"></param>
        /// <param name="ServiceProConfiguration"></param>
        /// <param name="WebAPIParseResponseClsObj"></param>
        /// <param name="Provider"></param>
        /// <param name="TrnNo"></param>
        /// <param name="_TransactionObj"></param>
        /// <param name="LTP"></param>
        /// <param name="LPProcessTransactionClsObj"></param>
        /// <returns></returns>
        private async Task<BizResponse> ProcessTransactionOnOKEX(BizResponse _Resp, ServiceProConfiguration ServiceProConfiguration, WebAPIParseResponseCls WebAPIParseResponseClsObj, TransactionProviderResponse Provider, long TrnNo, ProcessTransactionCls _TransactionObj, decimal LTP, LPProcessTransactionCls LPProcessTransactionClsObj)
        {
            short IsProcessedBit = 0;
            try
            {

                OKEXGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                OKEXGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                string OKEXPair = _SecondCurrService.SMSCode + "_" + _BaseCurrService.SMSCode;
                /// commented -- actual code
                //SubmitOrderReturn Tradestresult = _tradeSatoshiLPService.PlaceOrderAsync(Req.TrnType == enTrnType.Sell_Trade ? Core.Interfaces.LiquidityProvider.OrderSide.Sell : Core.Interfaces.LiquidityProvider.OrderSide.Buy, TradeSatoshiPair, Req.Qty, LTP).Result;

                OKExPlaceOrderReturn OKExResult = _oKExLPService.PlaceOrderAsync(OKEXPair,Req.TrnType == enTrnType.Sell_Trade ? Core.Interfaces.LiquidityProvider.OrderSide.Sell.ToString() : Core.Interfaces.LiquidityProvider.OrderSide.Buy.ToString(),LTP,Req.Qty,10, "y12233456","0").Result;

                //var Result = @" {""success"":true,""message"":null,""result"":{""orderId"":140876176,""filled"":[21474705,21474706,21474707,21474708,21474709,21474710,21474711,21474712,21474713,21474714,21474715,21474716,21474717,21474718,21474719,21474720,21474721,21474722,21474723]}}";
                //SubmitOrderReturn TradeSatoshiResult = JsonConvert.DeserializeObject<SubmitOrderReturn>(Result);

                _TransactionObj.APIResponse = JsonConvert.SerializeObject(OKExResult);
                if (OKExResult.result == true)
                {
                    IsProcessedBit = 1;
                    WebAPIParseResponseClsObj.TrnRefNo = OKExResult.order_id.ToString();
                    WebAPIParseResponseClsObj.OperatorRefNo = OKExResult.order_id.ToString();
                    if (OKExResult.order_id != null)
                    {
                        OKExGetOrderInfoReturn OKExOrderReturn = await _oKExLPService.GetOrderInfoAsync(OKEXPair,OKExResult.order_id,OKExResult.client_oid);

                        //var Result1 = @" {""success"":true,""message"":null,""result"":{""id"":140876176,""market"":""ETH_BTC"",""type"":""Sell"",""amount"":0.01544508,""rate"":0.03198508,""remaining"":0.01094647,""total"":0.00049401,""status"":""Partial"",""timestamp"":""2019-05-29T11:16:11.527"",""isApi"":true}}";
                        //GetOrderReturn TradeSatoshiResult1 = JsonConvert.DeserializeObject<GetOrderReturn>(Result1);

                        //GetOrderReturn TradeSatoshiResult1 = await _tradeSatoshiLPService.GetOrderInfoAsync(TradeSatoshiResult.result.OrderId);
                        if (OKExOrderReturn!= null)
                        {
                            if (OKExOrderReturn.status == "2")
                            {
                                LPProcessTransactionClsObj.RemainingQty =  Req.Qty - decimal.Parse(OKExOrderReturn.filled_qty);
                                LPProcessTransactionClsObj.SettledQty = decimal.Parse(OKExOrderReturn.filled_qty);
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Success;
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction fully Success On OKEX";
                                return _Resp;
                            }
                            else if (OKExOrderReturn.status == "1")
                            {
                                LPProcessTransactionClsObj.RemainingQty = Req.Qty - decimal.Parse(OKExOrderReturn.filled_qty);
                                LPProcessTransactionClsObj.SettledQty = Req.Qty - decimal.Parse(OKExOrderReturn.filled_qty) - (Req.Qty - decimal.Parse(OKExOrderReturn.filled_qty));
                                LPProcessTransactionClsObj.TotalQty = Req.Qty;
                                WebAPIParseResponseClsObj.Status = enTransactionStatus.Hold;
                                _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction partial Success On OKEX";
                                return _Resp;
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Fail On OKEX";
                                return _Resp;
                            }
                        }
                        else
                        {
                            _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                            _Resp.ReturnCode = enResponseCodeService.Fail;
                            _Resp.ReturnMsg = "Transaction Fail On OKEX";
                            return _Resp;
                        }
                    }
                    else
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                        _Resp.ReturnCode = enResponseCodeService.Fail;
                        _Resp.ReturnMsg = "Transaction Fail On OKEX";
                        return _Resp;
                    }
                }

                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                _Resp.ReturnCode = enResponseCodeService.Fail;
                _Resp.ReturnMsg = "Transaction Fail On OKEX";

            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("ProcessTransactionOnOKEX:##TrnNo " + TrnNo, ControllerName, ex);
                if (IsProcessedBit == 1)//Does not proceed on next API
                    if (WebAPIParseResponseClsObj.Status == enTransactionStatus.Success)
                    {
                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                        _Resp.ReturnCode = enResponseCodeService.Success;
                        _Resp.ReturnMsg = "Transaction Success On OKEX";
                        return _Resp;
                    }
                    else
                    {
                        _Resp.ReturnCode = enResponseCodeService.Success;
                    }
                else
                    _Resp.ReturnCode = enResponseCodeService.Fail;

                _Resp.ReturnMsg = ex.Message;
                _Resp.ErrorCode = enErrorCode.API_LP_InternalError;
            }
            return _Resp;
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

        public async Task EmailSendTransactionHoldOrFailed(long TrnNo, string UserId,long pairid,decimal qty, string datetime, decimal price, decimal fee, int Type,short OrderType,short TrnType)
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
                    Task.Run(() => HelperForLog.WriteLogIntoFileAsyncDtTm("SendEmailTransaction - EmailSendWithdrwalTransaction", ControllerName, " ##TrnNo : " + TrnNo  + " ##Type : " + Type, Helpers.UTC_To_IST()));

                    var pairdata = _trnMasterConfiguration.GetTradePairMaster().Where(x => x.Id == pairid).FirstOrDefault();
                    
                    if(pairdata != null)
                    {
                        communicationParamater.Param1 = pairdata.PairName + "";
                        communicationParamater.Param3 = pairdata.PairName.Split("_")[1];
                    }

                    communicationParamater.Param8 = User.Name + "";
                    communicationParamater.Param2 = Helpers.DoRoundForTrading(qty, 8).ToString();
                    communicationParamater.Param4 = datetime;
                    communicationParamater.Param5 = Helpers.DoRoundForTrading(price, 8).ToString();
                    communicationParamater.Param6 = Helpers.DoRoundForTrading(fee, 8).ToString();
                    communicationParamater.Param7 = Helpers.DoRoundForTrading(0, 8).ToString();  //Uday 01-01-2019  In failed transaction final price as 0
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
