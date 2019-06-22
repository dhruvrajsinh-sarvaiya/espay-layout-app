using Binance.Net;
using Binance.Net.Objects;
using Bittrex.Net;
using Bittrex.Net.Objects;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Infrastructure.BGTask;
using CleanArchitecture.Infrastructure.Interfaces;
using CleanArchitecture.Infrastructure.LiquidityProvider;
using CleanArchitecture.Infrastructure.LiquidityProvider.TradeSatoshiAPI;
using CoinbasePro.Services.Orders.Models.Responses;
using CryptoExchange.Net.Objects;
using MediatR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Core.ViewModels.LiquidityProvider1;
using CleanArchitecture.Infrastructure.DTOClasses;
using Huobi.Net.Objects;
using CleanArchitecture.Infrastructure.LiquidityProvider.OKExAPI;

namespace CleanArchitecture.Infrastructure.Services
{

    public class LPstatusCheckHandler : IRequestHandler<LPStatusCheckCls>
    {
        private readonly ICommonRepository<TradeTransactionQueue> _tradeTrnRepositiory;
        private readonly ICommonRepository<TransactionQueue> _trnRepositiory;
        private readonly IFrontTrnRepository _frontTrnRepository;
        private readonly IMediator _mediator;
        private readonly ILPStatusCheck<LPStatusCheckData> _lPStatusCheckQueue;
        TransactionQueue TransactionQueuecls;
        string ControllerName = "LPstatusCheckHandler";

        public LPstatusCheckHandler(IFrontTrnRepository FrontTrnRepository,ICommonRepository<TradeTransactionQueue> TradeTrnRepositiory,
            ICommonRepository<TransactionQueue> TrnRepositiory, IMediator mediator, ILPStatusCheck<LPStatusCheckData> LPStatusCheckQueue)
        {
            _tradeTrnRepositiory = TradeTrnRepositiory;
            _trnRepositiory = TrnRepositiory;
            _frontTrnRepository = FrontTrnRepository;
            _mediator = mediator;
            _lPStatusCheckQueue = LPStatusCheckQueue;
        }

        public async Task<Unit> Handle(LPStatusCheckCls Request, CancellationToken cancellationToken)
        {
            List<LPStatusCheckData> Data = new List<LPStatusCheckData>();
            try
            {
                Data = _frontTrnRepository.LPstatusCheck();
                foreach(var item in Data)
                {
                    TransactionQueuecls = _trnRepositiory.GetById(item.TrnNo);
                    TransactionQueuecls.CallStatus = 1;
                    _trnRepositiory.Update(TransactionQueuecls);
                    _lPStatusCheckQueue.Enqueue(item);
                }
                return await Task.FromResult(new Unit());
            }
            catch(Exception ex)
            {
                HelperForLog.WriteErrorLog("LPstatusCheckHandler Error:##GUID " + Request.uuid, ControllerName, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class LPStatusCheckSingleHanlder : IRequestHandler<LPStatusCheckData>
    {
        private readonly ICommonRepository<TradeTransactionQueue> _tradeTrnRepositiory;
        private readonly ICommonRepository<TransactionQueue> _trnRepositiory;
        //private readonly IFrontTrnRepository _frontTrnRepository;
        private readonly BinanceLPService _binanceLPService;
        private readonly HuobiLPService _huobiLPService;
        private readonly BitrexLPService _bitrexLPService;
        private readonly ICoinBaseService _coinBaseService;
        private readonly IPoloniexService _poloniexService;
        private readonly ITradeSatoshiLPService _tradeSatoshiLPService;
        private readonly IOKExLPService _oKExLPService; // Add new variable for OKEx API by Pushpraj as on 18-06-2019
        private readonly IMediator _mediator;
        TransactionStatusCheckRequest NewtransactionReq;
        private readonly ICommonRepository<TransactionStatusCheckRequest> _transactionRequest;
        private readonly IGetWebRequest _IGetWebRequest;
        private readonly IUpbitService _upbitService;
        private readonly ISettlementRepositoryAPI<BizResponse> _SettlementRepositoryAPI;
        string ControllerName = "LPStatusCheckSingleHanlder";

        public LPStatusCheckSingleHanlder( //IFrontTrnRepository FrontTrnRepository,
            ICommonRepository<TradeTransactionQueue> TradeTrnRepositiory,
            ICommonRepository<TransactionQueue> TrnRepositiory, IMediator mediator, BinanceLPService BinanceLPService, HuobiLPService huobiLPService,
            BitrexLPService BitrexLPService, ICoinBaseService CoinBaseService, IPoloniexService PoloniexService, IUpbitService upbitService,
            ITradeSatoshiLPService TradeSatoshiLPService, ICommonRepository<TransactionStatusCheckRequest> TransactionRequest, IGetWebRequest IGetWebRequest,
            ISettlementRepositoryAPI<BizResponse> SettlementRepositoryAPI,IOKExLPService oKExLPService)
        {
            _tradeTrnRepositiory = TradeTrnRepositiory;
            _upbitService = upbitService;
            _trnRepositiory = TrnRepositiory;
            //_frontTrnRepository = FrontTrnRepository;
            _mediator = mediator;
            _binanceLPService = BinanceLPService;
            _huobiLPService = huobiLPService;
            _bitrexLPService = BitrexLPService;
            _coinBaseService = CoinBaseService;
            _poloniexService = PoloniexService;
            _tradeSatoshiLPService = TradeSatoshiLPService;
            _transactionRequest = TransactionRequest;
            _IGetWebRequest = IGetWebRequest;
            _SettlementRepositoryAPI = SettlementRepositoryAPI;
            _oKExLPService = oKExLPService; // Add new varible assign for OKEx API by Pushpraj as on 18-06-2019
        }

        public async Task<Unit> Handle(LPStatusCheckData Request, CancellationToken cancellationToken)
        {
            LPProcessTransactionCls LPProcessTransactionClsObj = new LPProcessTransactionCls();
            BizResponse _Resp = new BizResponse();
            
            try
            {
                var updateddata = _trnRepositiory.GetById(Request.TrnNo);
                //NewtransactionReq = await _transactionRequest.GetByIdAsync(Request.TrnNo);
                //if(NewtransactionReq == null)
                //{
                NewtransactionReq = new TransactionStatusCheckRequest()
                {
                    TrnNo = Request.TrnNo,
                    SerProDetailID = Request.AppTypeID,
                    CreatedDate = Helpers.UTC_To_IST(),
                    CreatedBy = 1,
                    OprTrnID = Request.TrnRefNo,
                    TrnID = Request.TrnRefNo,
                    Status = 0
                };
                NewtransactionReq = _transactionRequest.Add(NewtransactionReq);
                //}

                var ServiceProConfiguration = _IGetWebRequest.GetServiceProviderConfiguration(Request.SerProDetailID);
                if (ServiceProConfiguration == null)
                {
                    updateddata.CallStatus = 0;
                    _trnRepositiory.Update(updateddata);
                    HelperForLog.WriteLogIntoFile("LPStatusCheckSingleHanlder", "status Check hanlder", "LPStatusCheckSingleHanlder Call web API creadential not found liquidity provider---" + "##TrnNo:" + Request.TrnNo);                                   
                }
                else
                {
                    switch (Request.AppTypeID)
                    {
                        case (long)enAppType.Binance:
                            _binanceLPService._client.SetApiCredentials(ServiceProConfiguration.APIKey, ServiceProConfiguration.SecretKey);
                            CallResult<BinanceOrder> BinanceResult = await _binanceLPService.GetOrderInfoAsync(Request.Pair, Convert.ToInt64(Request.TrnRefNo));
                            if(BinanceResult != null)
                            {
                                var Status = BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.New ? enTransactionStatus.Initialize :
                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Filled ? enTransactionStatus.Success :
                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.PartiallyFilled ? enTransactionStatus.Hold :
                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Rejected ? enTransactionStatus.OperatorFail :
                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.PendingCancel ? enTransactionStatus.Hold :
                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Expired ? enTransactionStatus.OperatorFail :
                            (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Canceled ? enTransactionStatus.OperatorFail : enTransactionStatus.OperatorFail))))));

                                if (Status == enTransactionStatus.Success)
                                {
                                    updateddata.MakeTransactionSuccess();
                                }
                                else if (Status == enTransactionStatus.Hold)
                                {
                                    updateddata.MakeTransactionHold();
                                }
                                else if (Status == enTransactionStatus.OperatorFail)
                                {
                                    updateddata.MakeTransactionOperatorFail();
                                }
                                else if (Status == enTransactionStatus.Initialize)
                                {
                                    updateddata.MakeTransactionInProcess();
                                }
                                if (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.Filled)
                                {
                                    LPProcessTransactionClsObj.RemainingQty = BinanceResult.Data.OriginalQuantity - BinanceResult.Data.ExecutedQuantity;
                                    LPProcessTransactionClsObj.SettledQty = BinanceResult.Data.ExecutedQuantity;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction fully Success On Binanace";
                                }
                                else if (BinanceResult.Data.Status == Binance.Net.Objects.OrderStatus.PartiallyFilled)
                                {
                                    LPProcessTransactionClsObj.RemainingQty = BinanceResult.Data.OriginalQuantity - BinanceResult.Data.ExecutedQuantity;
                                    LPProcessTransactionClsObj.SettledQty = BinanceResult.Data.ExecutedQuantity;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction partial Success On Binanace";
                                }
                                else
                                {
                                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "No update";
                                }
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Fail On Binanace";
                            }

                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(BinanceResult);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;

                        case (long)enAppType.Huobi:

                            _huobiLPService._client.SetApiCredentials(ServiceProConfiguration.APIKey, ServiceProConfiguration.SecretKey);
                            WebCallResult<HuobiOrder> webCall = await _huobiLPService.GetOrderInfoAsync(Convert.ToInt64(Request.TrnRefNo));
                            if (webCall.Success)

                            {
                                if (webCall.Data.State == HuobiOrderState.Filled)
                                {
                                    LPProcessTransactionClsObj.RemainingQty = 0;
                                    LPProcessTransactionClsObj.SettledQty = webCall.Data.FilledAmount;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction fully Success On Huobi";


                                }
                                else if (webCall.Data.State == HuobiOrderState.PartiallyFilled)
                                {
                                    LPProcessTransactionClsObj.RemainingQty = webCall.Data.Amount - webCall.Data.FilledAmount;
                                    LPProcessTransactionClsObj.SettledQty = webCall.Data.FilledAmount;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction partial Success On huobi";

                                }
                                else if (webCall.Data.State == HuobiOrderState.PartiallyCanceled)
                                {
                                    LPProcessTransactionClsObj.RemainingQty = webCall.Data.FilledAmount;
                                    LPProcessTransactionClsObj.SettledQty = webCall.Data.FilledAmount;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                    _Resp.ReturnCode = enResponseCodeService.Fail;
                                    _Resp.ReturnMsg = "Transaction partial FAIL On huobi";

                                }
                                else if (webCall.Data.State == HuobiOrderState.Canceled)
                                {
                                    updateddata.MakeTransactionOperatorFail();
                                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                    _Resp.ReturnCode = enResponseCodeService.Fail;
                                    _Resp.ReturnMsg = "Transaction Fail On huobi";
                                }
                                else if (webCall.Data.State == HuobiOrderState.Created)
                                {
                                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction processing Success On huobi";

                                }
                                else
                                {

                                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                    _Resp.ReturnCode = enResponseCodeService.Fail;
                                    _Resp.ReturnMsg = "Transaction Fail On huobi";
                                }
                            }
                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(webCall);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;




                        case (long)enAppType.Bittrex:
                            _bitrexLPService._client.SetApiCredentials(ServiceProConfiguration.APIKey, ServiceProConfiguration.SecretKey);
                            CallResult<BittrexAccountOrder> BittrexResult = await _bitrexLPService.GetOrderInfoAsync(Guid.Parse(Request.TrnRefNo));
                            if (BittrexResult.Success)
                            {                            
                                if (BittrexResult.Data.QuantityRemaining == 0)
                                {
                                    updateddata.MakeTransactionSuccess();
                                    LPProcessTransactionClsObj.RemainingQty = BittrexResult.Data.QuantityRemaining;
                                    LPProcessTransactionClsObj.SettledQty = BittrexResult.Data.Quantity - BittrexResult.Data.QuantityRemaining;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction fully Success On Bittrex";
                                }
                                else if (BittrexResult.Data.QuantityRemaining < BittrexResult.Data.Quantity) // partial
                                {
                                    updateddata.MakeTransactionHold();
                                    LPProcessTransactionClsObj.RemainingQty = BittrexResult.Data.QuantityRemaining;
                                    LPProcessTransactionClsObj.SettledQty = BittrexResult.Data.Quantity - BittrexResult.Data.QuantityRemaining;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction partial Success On Bittrex";
                                }
                                else if (BittrexResult.Data.QuantityRemaining == BittrexResult.Data.Quantity) // hold
                                {
                                    updateddata.MakeTransactionHold();
                                    LPProcessTransactionClsObj.RemainingQty = BittrexResult.Data.QuantityRemaining;
                                    LPProcessTransactionClsObj.SettledQty = BittrexResult.Data.Quantity;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction processing Success On Bittrex";
                                }
                                else if (BittrexResult.Data.CancelInitiated)
                                {
                                    updateddata.MakeTransactionOperatorFail();
                                    _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                    _Resp.ReturnCode = enResponseCodeService.Fail;
                                    _Resp.ReturnMsg = "Transaction Fail On Bittrex";
                                }
                                else
                                {
                                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "No update";
                                }
                            }
                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(BittrexResult);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;
                        case (long)enAppType.TradeSatoshi:
                            GlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                            GlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                            GetOrderReturn TradeSatoshiResult = await _tradeSatoshiLPService.GetOrderInfoAsync(Convert.ToInt64(Request.TrnRefNo));

                            //var Result1 = @"{""success"":true,""message"":null,""result"":{""Id"":140876176,""Market"":""ETH_BTC"",""Type"":""Sell"",""Amount"":0.01544508,""Rate"":0.03198508,""Remaining"":0.00000000,""Total"":0.00049401,""Status"":""Complete"",""Timestamp"":""2019-05-29T11:16:11.527"",""IsApi"":true}}";
                            //GetOrderReturn TradeSatoshiResult = JsonConvert.DeserializeObject<GetOrderReturn>(Result1);
                            if(TradeSatoshiResult != null)
                            {
                                if (TradeSatoshiResult.success)
                                {
                                    if (TradeSatoshiResult.result.Status.ToLower() == "complete")
                                    {
                                        updateddata.MakeTransactionSuccess();
                                        LPProcessTransactionClsObj.RemainingQty = TradeSatoshiResult.result.Remaining;
                                        LPProcessTransactionClsObj.SettledQty = TradeSatoshiResult.result.Amount;
                                        LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction fully Success On TradeSatoshi";
                                    }
                                    else if (TradeSatoshiResult.result.Status.ToLower() == "partial")
                                    {
                                        updateddata.MakeTransactionHold();
                                        LPProcessTransactionClsObj.RemainingQty = TradeSatoshiResult.result.Remaining;
                                        LPProcessTransactionClsObj.SettledQty = TradeSatoshiResult.result.Amount - TradeSatoshiResult.result.Remaining;
                                        LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                        _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction partial Success On TradeSatoshi";
                                    }
                                    else
                                    {
                                        _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "No update";
                                    }
                                }
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Fail On TradeSatoshi";
                            }
                            
                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(TradeSatoshiResult);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;
                        case (long)enAppType.Poloniex:
                            PoloniexGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                            PoloniexGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                            object PoloniexRep = await _poloniexService.GetPoloniexOrderState(Request.TrnRefNo);
                            JObject Data = JObject.Parse(PoloniexRep.ToString());
                            var Success = Convert.ToUInt16(Data["result"]["success"]);
                            if (Success == 1)
                            {
                                JToken Result = Data["result"][Request.TrnRefNo];
                                PoloniexOrderState PoloniexResult = JsonConvert.DeserializeObject<PoloniexOrderState>(Result.ToString());
                            
                                if (PoloniexResult.status == "Partially filled")
                                {
                                    updateddata.MakeTransactionHold();
                                    LPProcessTransactionClsObj.RemainingQty = PoloniexResult.amount - PoloniexResult.startingAmount;
                                    LPProcessTransactionClsObj.SettledQty = PoloniexResult.amount;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction partial Success On Poloniex";
                                }
                                else if (PoloniexResult.status == "Filled")
                                {
                                    updateddata.MakeTransactionSuccess();
                                    LPProcessTransactionClsObj.RemainingQty = 0;
                                    LPProcessTransactionClsObj.SettledQty = PoloniexResult.startingAmount;
                                    LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                    _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "Transaction fully Success On Poloniex";
                                }
                                else
                                {
                                    _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                    _Resp.ReturnCode = enResponseCodeService.Success;
                                    _Resp.ReturnMsg = "No update";
                                }
                            }
                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(PoloniexRep);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;
                        case (long)enAppType.Coinbase:
                            CoinBaseGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                            CoinBaseGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                            OrderResponse CoinbaseResult = await _coinBaseService.GetOrderById(Request.TrnRefNo);
                            if (CoinbaseResult.Settled)
                            {
                                updateddata.MakeTransactionSuccess();
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction fully Success On Coinbase";
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "No update";
                            }
                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(CoinbaseResult);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;
                        case (long)enAppType.UpBit:
                            //CoinBaseGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                            //CoinBaseGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                            //Request.TrnRefNo = "a08f09b1-1718-42e2-9358-f0e5e083d3ee";
                            var UpBitResult = await _upbitService.GetOrderInfoAsync(Request.TrnRefNo);
                            if (UpBitResult.state == "done")
                            {
                                updateddata.MakeTransactionSuccess();
                                LPProcessTransactionClsObj.RemainingQty = Convert.ToDecimal(UpBitResult.remaining_volume);
                                LPProcessTransactionClsObj.SettledQty = Convert.ToDecimal(UpBitResult.executed_volume);
                                LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction Fully Success On Upbit";
                            }
                            else if (UpBitResult.state == "cancel")
                            {
                                updateddata.MakeTransactionInProcess();
                                LPProcessTransactionClsObj.RemainingQty = Convert.ToDecimal(UpBitResult.remaining_volume);
                                LPProcessTransactionClsObj.SettledQty = Convert.ToDecimal(UpBitResult.executed_volume);
                                LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction Cancelled On Upbit";
                            }
                            else if (UpBitResult.state == "wait")
                            {
                                updateddata.MakeTransactionHold();
                                LPProcessTransactionClsObj.RemainingQty = Convert.ToDecimal(UpBitResult.remaining_volume);
                                LPProcessTransactionClsObj.SettledQty = Convert.ToDecimal(UpBitResult.executed_volume);
                                LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "Transaction Hold On Upbit";
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                _Resp.ReturnCode = enResponseCodeService.Success;
                                _Resp.ReturnMsg = "No update";
                            }
                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(UpBitResult);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;
                        ///Add new case for OKEx API by Pushpraj as on 18-06-2019
                        case (long)enAppType.OKEx:
                            OKEXGlobalSettings.API_Key = ServiceProConfiguration.APIKey;
                            OKEXGlobalSettings.Secret = ServiceProConfiguration.SecretKey;
                            OKEXGlobalSettings.PassPhrase = "paRo@1$##";

                            OKExGetOrderInfoReturn OKEXResult = await _oKExLPService.GetOrderInfoAsync(Request.Pair,Request.TrnRefNo,Request.TrnRefNo);
                            //GetOrderReturn TradeSatoshiResult = await _tradeSatoshiLPService.GetOrderInfoAsync(Convert.ToInt64(Request.TrnRefNo));

                            //var Result1 = @"{""success"":true,""message"":null,""result"":{""Id"":140876176,""Market"":""ETH_BTC"",""Type"":""Sell"",""Amount"":0.01544508,""Rate"":0.03198508,""Remaining"":0.00000000,""Total"":0.00049401,""Status"":""Complete"",""Timestamp"":""2019-05-29T11:16:11.527"",""IsApi"":true}}";
                            //GetOrderReturn TradeSatoshiResult = JsonConvert.DeserializeObject<GetOrderReturn>(Result1);
                            if (OKEXResult != null)
                            {
                                if (OKEXResult.instrument_id != null)
                                {
                                    if (OKEXResult.status == "2")
                                    {
                                        updateddata.MakeTransactionSuccess();
                                        LPProcessTransactionClsObj.RemainingQty = decimal.Parse(OKEXResult.size) - decimal.Parse(OKEXResult.filled_qty);
                                        LPProcessTransactionClsObj.SettledQty = decimal.Parse(OKEXResult.filled_qty);
                                        LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                        _Resp.ErrorCode = enErrorCode.API_LP_Filled;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction fully Success On OKEX";
                                    }
                                    else if (OKEXResult.status == "1")
                                    {
                                        updateddata.MakeTransactionHold();
                                        LPProcessTransactionClsObj.RemainingQty = decimal.Parse(OKEXResult.size) - decimal.Parse(OKEXResult.filled_qty);
                                        LPProcessTransactionClsObj.SettledQty = decimal.Parse(OKEXResult.filled_qty);
                                        LPProcessTransactionClsObj.TotalQty = Request.Amount;
                                        _Resp.ErrorCode = enErrorCode.API_LP_PartialFilled;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "Transaction partial Success On OKEX";
                                    }
                                    else
                                    {
                                        _Resp.ErrorCode = enErrorCode.API_LP_Success;
                                        _Resp.ReturnCode = enResponseCodeService.Success;
                                        _Resp.ReturnMsg = "No update";
                                    }
                                }
                            }
                            else
                            {
                                _Resp.ErrorCode = enErrorCode.API_LP_Fail;
                                _Resp.ReturnCode = enResponseCodeService.Fail;
                                _Resp.ReturnMsg = "Transaction Fail On OKEX";
                            }

                            updateddata.CallStatus = 0;
                            _trnRepositiory.Update(updateddata);
                            NewtransactionReq.RequestData = "Pair:" + Request.Pair + "Order ID :" + Request.TrnRefNo;
                            NewtransactionReq.ResponseData = JsonConvert.SerializeObject(OKEXResult);
                            _transactionRequest.Update(NewtransactionReq);
                            goto SuccessTrade;

                        default:
                        HelperForLog.WriteLogIntoFile("LPStatusCheckSingleHanlder", "status Check hanlder", "LPStatusCheckSingleHanlder Call web API  not found liquidity provider---" + "##TrnNo:" + Request.TrnNo);
                        break;
                    }

                    SuccessTrade:

                    HelperForLog.WriteLogIntoFile("LPStatusCheckSingleHanlder", "status Check hanlder", "LPStatusCheckSingleHanlder " + "##TrnNo:" + Request.TrnNo + "##Response:" + JsonConvert.SerializeObject(_Resp) + "##APIResponse" + JsonConvert.SerializeObject(LPProcessTransactionClsObj));
                    if (_Resp.ReturnCode == enResponseCodeService.Success && _Resp.ErrorCode == enErrorCode.API_LP_Filled)
                    {
                        await _SettlementRepositoryAPI.PROCESSSETLLEMENTAPI(_Resp, Request.TrnNo, 0, Request.Amount, Request.Price);
                        HelperForLog.WriteLogIntoFile("LPStatusCheckSingleHanlder", "status Check hanlder", "LPStatusCheckSingleHanlder " + "##TrnNo:" + Request.TrnNo + "##PROCESSSETLLEMENTAPI Response:" + JsonConvert.SerializeObject(_Resp));
                    }
                    else if (_Resp.ReturnCode == enResponseCodeService.Success && _Resp.ErrorCode == enErrorCode.API_LP_PartialFilled)
                    {
                        await _SettlementRepositoryAPI.PROCESSSETLLEMENTAPI(_Resp, Request.TrnNo, LPProcessTransactionClsObj.RemainingQty,LPProcessTransactionClsObj.SettledQty, Request.Price);
                        HelperForLog.WriteLogIntoFile("LPStatusCheckSingleHanlder", "status Check hanlder", "LPStatusCheckSingleHanlder " + "##TrnNo:" + Request.TrnNo + "##PROCESSSETLLEMENTAPI Response:" + JsonConvert.SerializeObject(_Resp));

                    }
                }                               
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LPStatusCheckSingleHanlder Error:##TrnNo " + Request.TrnNo, ControllerName, ex);
                return await Task.FromResult(new Unit());                
            }
        }
    }
}
