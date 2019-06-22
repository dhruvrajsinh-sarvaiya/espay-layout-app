using Binance.Net;
using Binance.Net.Objects;
using Bittrex.Net;
using Bittrex.Net.Objects;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Infrastructure.DTOClasses;
using CleanArchitecture.Infrastructure.LiquidityProvider;
using CleanArchitecture.Infrastructure.LiquidityProvider.TradeSatoshiAPI;
using CryptoExchange.Net.Authentication;
using CryptoExchange.Net.Objects;
using Huobi.Net;
using Huobi.Net.Objects;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using CleanArchitecture.Infrastructure.LiquidityProvider.OKExAPI;

namespace CleanArchitecture.Infrastructure.Services
{

    public class CryptoWatcherHandler : IRequestHandler<CryptoWatcherReq>
    {
        private IMemoryCache _cache;
        private readonly IMediator _mediator;
        private readonly ITransactionConfigService _transactionConfigService;
        private readonly IFrontTrnRepository _frontTrnRepository;

        public CryptoWatcherHandler(IMemoryCache Cache, IMediator mediator, ITransactionConfigService TransactionConfigService, IFrontTrnRepository FrontTrnRepository)
        {
            _cache = Cache;
            _mediator = mediator;
            _transactionConfigService = TransactionConfigService;
            _frontTrnRepository = FrontTrnRepository;
        }

        public async Task<Unit> Handle(CryptoWatcherReq data, CancellationToken cancellationToken)
        {
            try
            {
                List<ConfigureLP> symbol = GetPair().ToList();
                foreach (var LPData in symbol)
                {
                    LTPcls Req = new LTPcls()
                    {
                        Pair = LPData.Pair,
                        LpType = LPData.LPType,
                        Price = 0.0m
                    };
                    var Res = await _mediator.Send(Req);
                    //Req.Price = Res.Price;
                    if (Req.Price > 0)
                    {
                        var ResponseFromUpdateLTP = _frontTrnRepository.UpdateLTPData(Req);
                        if (!ResponseFromUpdateLTP)
                        {
                            _frontTrnRepository.InsertLTPData(Req);
                        }
                    }
                }
                _frontTrnRepository.GetLocalConfigurationData(Convert.ToInt16(enAppType.COINTTRADINGLocal));
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }

        public ConfigureLP[] GetPair()
        {
            try
            {
                ConfigureLP[] symbol = _transactionConfigService.TradePairConfigurationV1();
                return symbol;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }
    }

    public class CommonPriceTickerHandler : IRequestHandler<RealTimeLtpChecker, RealTimeLtpChecker>
    {
        private readonly IMediator _mediator;

        public CommonPriceTickerHandler(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<RealTimeLtpChecker> Handle(RealTimeLtpChecker Request, CancellationToken cancellationToken)
        {
            string Url = "https://api.cryptowat.ch/markets/#exchange#/#Pair#/price"; // pair - ltcbtc - Ltc Base           
            try
            {
                foreach (var data in Request.List)
                {
                    data.Pair = Request.Pair;
                    var data1 = await _mediator.Send(data);
                    data.Price = data1.Price;
                }

                return await Task.FromResult(Request);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(Request);
            }
        }
    }

    public class PriceTickerHandler : IRequestHandler<LTPcls, LTPcls>
    {
        public IWebApiSendRequest _WebAPISendRequest { get; set; }

        public PriceTickerHandler(IWebApiSendRequest WebAPISendRequest)
        {
            _WebAPISendRequest = WebAPISendRequest;
        }

        public async Task<LTPcls> Handle(LTPcls data, CancellationToken cancellationToken)
        {
            CryptoWatcherAPIResponse ResponseData = new CryptoWatcherAPIResponse();
            string Response = string.Empty;
            string Url = "https://api.cryptowat.ch/markets/#exchange#/#Pair#/price";
            try
            {

                var Pair = data.Pair.Split("_");
                switch (data.LpType)
                {
                    case (short)enAppType.Binance:
                        Url = "https://api.binance.com//api/v3/ticker/price?symbol=#Pair#";
                        Url = Url.Replace("#exchange#", "binance");
                        Url = Url.Replace("#Pair#", Pair[0].ToUpper() + Pair[1].ToUpper());
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            BinanceWatcherAPIResponse BinanceResponseData = new BinanceWatcherAPIResponse();
                            try
                            {
                                BinanceResponseData = JsonConvert.DeserializeObject<BinanceWatcherAPIResponse>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Binance ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (BinanceResponseData != null)
                            {
                                data.Price = BinanceResponseData.price;
                            }
                        }
                        break;
                    case (short)enAppType.Bittrex:
                        Url = "https://api.bittrex.com/api/v1.1/public/getticker?market=#Pair#";
                        Url = Url.Replace("#exchange#", "bittrex");
                        Url = Url.Replace("#Pair#", Pair[1].ToUpper() + "-" + Pair[0].ToUpper());
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            CommonWatcherAPIResponse BittrexResponseData = new CommonWatcherAPIResponse();
                            try
                            {
                                BittrexResponseData = JsonConvert.DeserializeObject<CommonWatcherAPIResponse>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Bittrex ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (BittrexResponseData != null && BittrexResponseData.success)
                            {
                                data.Price = BittrexResponseData.result.last;
                            }
                        }
                        break;
                    case (short)enAppType.Coinbase:
                        Url = "https://api-public.sandbox.pro.coinbase.com/products/#Pair#/ticker";
                        Url = Url.Replace("#exchange#", "coinbase-pro");
                        Url = Url.Replace("#Pair#", Pair[0].ToUpper() + "-" + Pair[1].ToUpper());
                        //                    web.Headers["User-Agent"] =
                        //"Mozilla/4.0 (Compatible; Windows NT 5.1; MSIE 6.0) " +
                        //"(compatible; MSIE 6.0; Windows NT 5.1; " +
                        //".NET CLR 1.1.4322; .NET CLR 2.0.50727)";
                        //            }
                        WebHeaderCollection HeaderCollection = new WebHeaderCollection();
                        HeaderCollection.Add(string.Format("User-Agent: {0}", ".NET CLR 1.1.4322; .NET CLR 2.0.50727;"));
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 90000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            try
                            {
                                ResponseData = JsonConvert.DeserializeObject<CryptoWatcherAPIResponse>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Coinbase ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (string.IsNullOrEmpty(ResponseData.error) && ResponseData.result != null)
                            {
                                data.Price = ResponseData.result.price;
                            }
                        }
                        break;
                    case (short)enAppType.Poloniex:
                        Url = "https://poloniex.com/public?command=returnTicker";
                        Url = Url.Replace("#exchange#", "poloniex");
                        Url = Url.Replace("#Pair#", Pair[1].ToLower() + "_" + Pair[0].ToLower());
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            Dictionary<string, poloniexWatcherAPIResponse> poloniexResponseData = new Dictionary<string, poloniexWatcherAPIResponse>();
                            try
                            {
                                poloniexResponseData = JsonConvert.DeserializeObject<Dictionary<string, poloniexWatcherAPIResponse>>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Poloniex ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (poloniexResponseData != null)
                            {
                                poloniexWatcherAPIResponse poloniexWatcher = new poloniexWatcherAPIResponse();
                                poloniexResponseData.TryGetValue(Pair[1].ToUpper() + "_" + Pair[0].ToUpper(), out poloniexWatcher);
                                if (poloniexWatcher?.last != 0)
                                {
                                    //poloniexResponseData.TryGetValue(Pair[1].ToUpper() + "_" + Pair[0].ToUpper(), out poloniexWatcher);
                                    data.Price = poloniexWatcher.last;
                                }
                            }
                        }
                        break;
                    case (short)enAppType.TradeSatoshi:
                        Url = "https://tradesatoshi.com/api/public/getticker?market=#Pair#";
                        Url = Url.Replace("#Pair#", data.Pair);
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        if (!string.IsNullOrEmpty(Response))
                        {
                            CommonWatcherAPIResponse TradesatoshiResponseData = new CommonWatcherAPIResponse();
                            try
                            {
                                TradesatoshiResponseData = JsonConvert.DeserializeObject<CommonWatcherAPIResponse>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " TradeSatoshi ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            
                            if (TradesatoshiResponseData != null && TradesatoshiResponseData.success && TradesatoshiResponseData.result != null)
                            {
                                data.Price = TradesatoshiResponseData.result.last;
                            }
                        }
                        break;

                    case (short)enAppType.UpBit:
                        Url = "https://api.upbit.com/v1/trades/ticks?market=#Pair#";
                        Url = Url.Replace("#Pair#", data.Pair);
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();                        
                        if (!string.IsNullOrEmpty(Response))
                        {
                            List<UpbitWatcherAPIResponse> UpbitResponseData = new List<UpbitWatcherAPIResponse>();
                            try
                            {
                                UpbitResponseData = JsonConvert.DeserializeObject<List<UpbitWatcherAPIResponse>>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " TradeSatoshi ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (UpbitResponseData != null || UpbitResponseData.Count>0)
                            {
                                data.Price = Convert.ToDecimal(UpbitResponseData[0].trade_price);
                            }
                        }
                        break;
                    case (short)enAppType.Huobi:
                        Url = "https://api.huobi.com/market/detail/merged?symbol=#Pair#";
                        Url = Url.Replace("#Pair#", Pair[0].ToLower()+Pair[1].ToLower());
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        //Response = "{\"status\":\"ok\",\"ch\":\"market.ethusdt.detail.merged\",\"ts\":1560505048373,\"tick\":{\"amount\":2838.6856972704545,\"open\":257.98,\"close\":255.13,\"high\":261.74,\"id\":101372929968,\"count\":1238,\"low\":252.0,\"version\":101372929968,\"ask\":[255.13,4.415570016850465],\"vol\":730750.5870850132,\"bid\":[255.1,10.0016]}}";
                        if (!string.IsNullOrEmpty(Response))
                        {
                            HuboiTickResult HuboiResponseData = new HuboiTickResult();
                            try
                            {
                                HuboiResponseData = JsonConvert.DeserializeObject<HuboiTickResult>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Huobi ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (HuboiResponseData != null && HuboiResponseData.status.ToLower() == "ok")
                            {
                                data.Price = Convert.ToDecimal(HuboiResponseData.tick.close);
                            }
                        }
                        break;
                    /// Add new case for OKEx By Pushpraj as on 12-06-2019
                    case (short)enAppType.OKEx:
                        Url = "https://www.okex.com/api/spot/v3/instruments/#Pair#/ticker";
                        Url = Url.Replace("#Pair#", data.Pair);
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        //Response = "{\"best_ask\":\"8249.9\",\"best_bid\":\"8247.1\",\"instrument_id\":\"BTC-USDT\",\"product_id\":\"BTC-USDT\",\"last\":\"8247\",\"ask\":\"8249.9\",\"bid\":\"8247.1\",\"open_24h\":\"8083.2\",\"high_24h\":\"8308.7\",\"low_24h\":\"8005.6\",\"base_volume_24h\":\"29333.78369784\",\"timestamp\":\"2019-06-14T09:21:21.807Z\",\"quote_volume_24h\":\"239946783.7\"}";
                        if (!string.IsNullOrEmpty(Response))
                        {
                            var OKExResponseData = JsonConvert.DeserializeObject<OKExGetTokenPairDetailReturn>(Response);
                            if (OKExResponseData != null && OKExResponseData.last != null)
                            {
                                data.Price =  Decimal.Parse(OKExResponseData.last);
                            }
                        }
                        break;
                        ///End Add new case for OKEx By Pushpraj as on 12-06-2019
                }
                return await Task.FromResult(data);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(data);
            }
        }
    }

    public class LiquidityBalanceCheckHandler : IRequestHandler<LPBalanceCheck, LPBalanceCheck>
    {
        private readonly IFrontTrnRepository _frontTrnRepository;
        private readonly BinanceLPService _binanceLPService;
        private readonly BitrexLPService _bitrexLPService;
        private readonly ICoinBaseService _coinBaseService;
        private readonly IPoloniexService _poloniexService;
        private readonly IUpbitService _upbitService;
        private readonly IHuobiLPService _huobiLPService;
        private readonly ITradeSatoshiLPService _tradeSatoshiLPService;
        private readonly IOKExLPService _oKExLPService; //Add new Interface object for OKEx By Pushpraj as on 12-06-2019

        public LiquidityBalanceCheckHandler(IFrontTrnRepository FrontTrnRepository,
        BinanceLPService BinanceLPService, BitrexLPService BitrexLPService, IUpbitService upbitService, IHuobiLPService huobiLPService,   
        ICoinBaseService CoinBaseService, IPoloniexService PoloniexService, ITradeSatoshiLPService TradeSatoshiLPService, IOKExLPService oKExLPService)
        {
            _frontTrnRepository = FrontTrnRepository;
            _binanceLPService = BinanceLPService;
            _bitrexLPService = BitrexLPService;
            _coinBaseService = CoinBaseService;
            _poloniexService = PoloniexService;
            _upbitService = upbitService;
            _huobiLPService = huobiLPService;
            _tradeSatoshiLPService = TradeSatoshiLPService;
            _oKExLPService = oKExLPService; ///Add new Interface object for OKEx By Pushpraj as on 12-06-2019
        }

        public async Task<LPBalanceCheck> Handle(LPBalanceCheck Request, CancellationToken cancellationToken)
        {
            try
            {
                LPKeyVault LPKeyVaultObj = _frontTrnRepository.BalanceCheckLP(Request.SerProID);
                switch (LPKeyVaultObj.AppTypeID)
                {
                    case (long)enAppType.Binance:
                        await BalanceCheckOnBinance(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.Huobi:
                        await BalanceCheckOnHuobi(Request, LPKeyVaultObj);
                        break;

                    case (long)enAppType.Bittrex:
                        await BalanceCheckOnBittrex(Request, LPKeyVaultObj);
                        break;

                    case (long)enAppType.TradeSatoshi:
                        await BalanceCheckOnTradeSatoshi(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.Poloniex:
                        await BalanceCheckOnPoloniex(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.Coinbase:
                        await BalanceCheckOnCoinbase(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.UpBit:
                        await BalanceCheckOnUpbit(Request, LPKeyVaultObj);
                        break;

                    //Add New Case for OKEx by Pushpraj as on 12-06-2019
                    case (long)enAppType.OKEx:
                        await BalanceCheckOnOKEx(Request, LPKeyVaultObj);
                        break;
                    default:
                        Request.Balance = 0;
                        HelperForLog.WriteLogIntoFile("LiquidityConfiguration", this.GetType().Name, "--3--LiquidityConfiguration Call web API  not found proper liquidity provider---" + "##Provider Type:" + LPKeyVaultObj.AppTypeID);
                        break;
                }
                return await Task.FromResult(Request);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(Request);
            }
        }

        private async Task<LPBalanceCheck> BalanceCheckOnHuobi(LPBalanceCheck request, LPKeyVault lPKeyVaultObj)
        {
            try
            {
                HuobiClient.SetDefaultOptions(new HuobiClientOptions()
                {
                    ApiCredentials = new ApiCredentials(lPKeyVaultObj.APIKey, lPKeyVaultObj.SecretKey)
                });

                WebCallResult<List<HuobiBalance>> HuobiResult =  await _huobiLPService.GetBalancesAsync(request.SerProID);

                if (HuobiResult != null)
                {
                    foreach (var balance in HuobiResult.Data)
                    {
                        if(balance.Currency.ToUpper()==request.Currency.ToUpper())
                        { 
                            request.Balance = Convert.ToDecimal(balance.Balance);
                        }
                    }
                }
                else
                {
                    request.Balance = 0;
                }
                return request;
            }
            catch (Exception ex)
            {
                request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return request;
            }

        }

        private async Task<LPBalanceCheck> BalanceCheckOnBinance(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                //BinanceClient.SetDefaultOptions(new BinanceClientOptions()
                //{
                //    ApiCredentials = new ApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey)
                //});
                _binanceLPService._client.SetApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey);
                CallResult<BinanceAccountInfo> BinanceResult = await _binanceLPService.GetBalancesAsync();
                if (BinanceResult != null && BinanceResult?.Data != null && BinanceResult.Data?.Balances != null && BinanceResult.Success)
                {
                    foreach (var balance in BinanceResult.Data.Balances)
                    {
                        if (balance.Asset.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.Free;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheck> BalanceCheckOnBittrex(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                //BittrexClient.SetDefaultOptions(new BittrexClientOptions()
                //{
                //    ApiCredentials = new ApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey)
                //});
                _bitrexLPService._client.SetApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey);
                CallResult<BittrexBalance> BittrexResult = await _bitrexLPService.GetBalanceAsync(Request.Currency.ToUpper());
                if (BittrexResult != null && BittrexResult.Success && BittrexResult.Data != null && BittrexResult.Data?.Available != null)
                {
                    Request.Balance = Convert.ToDecimal(BittrexResult.Data.Available);
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheck> BalanceCheckOnTradeSatoshi(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                GlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                GlobalSettings.Secret = LPKeyVaultObj.SecretKey;
                GetBalancesReturn TradeSatoshiResult = await _tradeSatoshiLPService.GetBalancesAsync();
                if (TradeSatoshiResult != null && TradeSatoshiResult.success && TradeSatoshiResult.result != null)
                {
                    foreach (var balance in TradeSatoshiResult.result)
                    {
                        if (balance.currency.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.available;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        /// <summary>
        /// Add new Class for Call the BalanceCheck Method Of OKEx API By Pushpraj as on 12-0-2019
        /// </summary>
        /// <param name="Request"></param>
        /// <param name="LPKeyVaultObj"></param>
        /// <returns></returns>
        #region "OKEx Balance Check Method call class"
        private async Task<LPBalanceCheck> BalanceCheckOnOKEx(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                OKEXGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                OKEXGlobalSettings.Secret = LPKeyVaultObj.SecretKey;
                OKEXGlobalSettings.PassPhrase = "paRo@1$##";

                OKEBalanceResult OKExResult = await _oKExLPService.GetWalletBalanceAsync();
                if (OKExResult.Data != null)
                {
                    foreach (var bal in OKExResult.Data)
                    {
                        if (bal.currency.ToString().ToUpper() == Request.Currency.ToString().ToUpper())
                        {
                            Request.Balance = Convert.ToDecimal(bal.available);
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }
        #endregion
        /// <summary>
        /// End Add new Class for Call the BalanceCheck Method Of OKEx API By Pushpraj as on 12-0-2019
        /// </summary>
        /// <param name="Request"></param>
        /// <param name="LPKeyVaultObj"></param>
        /// <returns></returns>

        private async Task<LPBalanceCheck> BalanceCheckOnCoinbase(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                CoinBaseGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                CoinBaseGlobalSettings.Secret = LPKeyVaultObj.SecretKey;

                IEnumerable<CoinbasePro.Services.Accounts.Models.Account> CoinbaseResult = await _coinBaseService.GetAllAccountsAsync();
                if (CoinbaseResult != null && CoinbaseResult.Count() > 0)
                {
                    foreach (var balance in CoinbaseResult)
                    {
                        if (balance.Currency.ToString().ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.Available;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheck> BalanceCheckOnPoloniex(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                PoloniexGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                PoloniexGlobalSettings.Secret = LPKeyVaultObj.SecretKey;

                Dictionary<string, decimal> PoloniexResult = await _poloniexService.PoloniexGetBalance();
                if (PoloniexResult != null)
                {
                    foreach (var balance in PoloniexResult)
                    {
                        if (balance.Key.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.Value;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheck> BalanceCheckOnUpbit(LPBalanceCheck Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                //PoloniexGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                //PoloniexGlobalSettings.Secret = LPKeyVaultObj.SecretKey;

                var UpbitResult = await _upbitService.GetCurrenciesAsync();
                if (UpbitResult != null)
                {
                    foreach (var balance in UpbitResult.Result)
                    {
                        if (balance.currency.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = Convert.ToDecimal(balance.balance);
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }
    }

    //komal 10-06-2016 for Arbitrage
    public class CryptoWatcherArbitrageHandler : IRequestHandler<CryptoWatcherArbitrageReq>
    {
        private IMemoryCache _cache;
        private readonly IMediator _mediator;
        private readonly ITransactionConfigService _transactionConfigService;
        private readonly IFrontTrnRepository _frontTrnRepository;
        private readonly ISignalRService _iSignalRService;
        private readonly ITrnMasterConfiguration _ITrnMasterConfiguration;
        private readonly IBinanceLPService _binanceLPService;
        private readonly IFrontTrnService _frontTrnService;

        public CryptoWatcherArbitrageHandler(IMemoryCache Cache, IMediator mediator, ITransactionConfigService TransactionConfigService, 
            IFrontTrnRepository FrontTrnRepository, ISignalRService iSignalRService, ITrnMasterConfiguration ITrnMasterConfiguration,
            IBinanceLPService binanceLPService, IFrontTrnService frontTrnService)
        {
            _cache = Cache;
            _mediator = mediator;
            _transactionConfigService = TransactionConfigService;
            _frontTrnRepository = FrontTrnRepository;
            _iSignalRService = iSignalRService;
            _ITrnMasterConfiguration = ITrnMasterConfiguration;
            _binanceLPService = binanceLPService;
            _frontTrnService = frontTrnService;
        }

        public async Task<Unit> Handle(CryptoWatcherArbitrageReq data, CancellationToken cancellationToken)
        {
            ArbitrageBuySellViewModel BuySellmodel;
            ExchangeProviderListArbitrage exchangeProvider;
            LastPriceViewModelArbitrage lastPriceObj;
            
            try
            {
                List<ConfigureLPArbitrage> symbol = GetPair().ToList();
                foreach (var LPData in symbol)
                {
                    ArbitrageLTPCls Req = new ArbitrageLTPCls()
                    {
                        Pair = LPData.Pair.Trim(),
                        LpType = LPData.LPType,
                        Price = 0.0m
                    };
                    var Res = await _mediator.Send(Req);
                    //Req.Price = Res.Price;
                    if (Req.Price > 0)
                    {
                        var ResponseFromUpdateLTP =await _frontTrnRepository.UpdateLTPDataArbitrage(Req);
                        //HelperForLog.WriteLogForSocket(" Price Change ", " Price Change 1 ", "ProviderName : " + LPData.ProviderName + " ResponseFromUpdateLTP.Price =" + ResponseFromUpdateLTP.Price + " Req.Price =" + Req.Price);
                        if (ResponseFromUpdateLTP == null)
                        {
                            switch (Req.LpType)
                            {
                                case (short)enAppType.Binance:
                                    Req.Fees = GetTradeFeesOnBinance(Req.Pair, Req.LpType);
                                    break;
                            }
                            ResponseFromUpdateLTP = _frontTrnRepository.InsertLTPDataArbitrage(Req);
                        }
                        //HelperForLog.WriteLogForSocket(" Price Change ", " Price Change 1 ", "ResponseFromUpdateLTP.Price =" + ResponseFromUpdateLTP.Price + "Req.Price =" + Req.Price);
                        if (ResponseFromUpdateLTP != null)
                        {
                            //if (Db_LTP != LP_LTP)
                            //{
                                //HelperForLog.WriteLogForSocket(" Price Change ", " Price Change 2", "ResponseFromUpdateLTP.Price =" + ResponseFromUpdateLTP.Price + "Req.Price =" + Req.Price);

                                lastPriceObj = new LastPriceViewModelArbitrage();
                                lastPriceObj.LastPrice = ResponseFromUpdateLTP.Price;
                                lastPriceObj.UpDownBit = ResponseFromUpdateLTP.UpDownBit;
                                lastPriceObj.LPType = ResponseFromUpdateLTP.LpType;
                                lastPriceObj.ExchangeName = LPData.ProviderName;
                                _iSignalRService.LastPriceArbitrage(lastPriceObj, Req.Pair, "0");

                                BuySellmodel = new ArbitrageBuySellViewModel();
                                BuySellmodel.LPType = ResponseFromUpdateLTP.LpType;
                                BuySellmodel.LTP = ResponseFromUpdateLTP.Price;
                                BuySellmodel.ProviderName = LPData.ProviderName;
                                BuySellmodel.Fees = ResponseFromUpdateLTP.Fees;
                                _iSignalRService.BuyerBookArbitrage(BuySellmodel, Req.Pair, "0");
                                _iSignalRService.SellerBookArbitrage(BuySellmodel, Req.Pair, "0");

                                exchangeProvider = new ExchangeProviderListArbitrage();
                                exchangeProvider.LPType = ResponseFromUpdateLTP.LpType;
                                exchangeProvider.LTP = ResponseFromUpdateLTP.Price;
                                exchangeProvider.ProviderName = LPData.ProviderName;
                                exchangeProvider.UpDownBit = ResponseFromUpdateLTP.UpDownBit;
                                exchangeProvider.Volume = ResponseFromUpdateLTP.Volume;
                                exchangeProvider.ChangePer = ResponseFromUpdateLTP.ChangePer;
                                _iSignalRService.ProviderMarketDataArbitrage(exchangeProvider, Req.Pair);

                            //Rita 17-6-19 send Profit Indicator data and also smart arbitrage data                           
                            ProfitIndicatorInfo responsedata = _frontTrnService.GetProfitIndicatorArbitrage(Req.PairID, 0);
                            if (responsedata != null)
                            {
                                //ProfitIndicatorResponse Response = new ProfitIndicatorResponse();
                                //Response.response = responsedata;
                                //Response.ReturnCode = enResponseCode.Success;
                                //Response.ErrorCode = enErrorCode.Success;
                                //Response.ReturnMsg = "Success";
                                _iSignalRService.ProfitIndicatorArbitrage(responsedata, Req.Pair);
                            }
                            List<ExchangeListSmartArbitrage> responsedata1 = _frontTrnService.ExchangeListSmartArbitrageService(Req.PairID, Req.Pair, 5, 0);
                            if (responsedata1 != null)
                            {
                                //ExchangeListSmartArbitrageResponse Response = new ExchangeListSmartArbitrageResponse();
                                //Response.response = responsedata1;
                                //Response.ReturnCode = enResponseCode.Success;
                                //Response.ErrorCode = enErrorCode.Success;
                                //Response.ReturnMsg = "Success";
                                _iSignalRService.ExchangeListSmartArbitrage(responsedata1, Req.Pair);
                            }
                            //====================================================================
                            //}
                        }
                    }
                }
                _frontTrnRepository.GetLocalConfigurationDataArbitrage(Convert.ToInt16(enAppType.COINTTRADINGLocal));
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }

        public ConfigureLPArbitrage[] GetPair()
        {
            try
            {
                ConfigureLPArbitrage[] symbol = _transactionConfigService.TradePairConfigurationArbitrageV1();
                return symbol;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }

        public Decimal GetTradeFeesOnBinance(string Pair, short LPType)
        {
            try
            {
                var PairArray = Pair.Split("_");
                LPKeyVault LPKeyVaultObj = _frontTrnRepository.GetTradeFeesLPArbitrage(LPType);
                BinanceClient Client = new BinanceClient(new BinanceClientOptions()
                {
                    ApiCredentials = new ApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey)
                });
                CallResult<BinanceTradeFee[]> BinanceResult = Client.GetTradeFee(PairArray[0].ToUpper() + PairArray[1].ToUpper());
                if (BinanceResult != null && BinanceResult?.Data != null && BinanceResult.Success)
                {
                    return BinanceResult.Data.FirstOrDefault().MakerFee;
                }
                return 0;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return 0;
            }
        }
    }

    public class PriceTickerArbitrageHandler : IRequestHandler<ArbitrageLTPCls, ArbitrageLTPCls>
    {
        public IWebApiSendRequest _WebAPISendRequest { get; set; }

        public PriceTickerArbitrageHandler(IWebApiSendRequest WebAPISendRequest)
        {
            _WebAPISendRequest = WebAPISendRequest;
        }

        public async Task<ArbitrageLTPCls> Handle(ArbitrageLTPCls data, CancellationToken cancellationToken)
        {
            ArbitrageCoinbaseCryptoWatcherCls ResponseData = new ArbitrageCoinbaseCryptoWatcherCls();
            string Response = string.Empty;
            string Url = "https://api.cryptowat.ch/markets/#exchange#/#Pair#/price";
            try
            {

                var Pair = data.Pair.Split("_");
                switch (data.LpType)
                {
                    case (short)enAppType.Binance: //done
                        Url = "https://api.binance.com/api/v1/ticker/24hr?symbol=#Pair#";
                        Url = Url.Replace("#exchange#", "binance");
                        Url = Url.Replace("#Pair#", Pair[0].ToUpper() + Pair[1].ToUpper());
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            ArbitrageBinanceCryptoWatcherCls BinanceResponseData = new ArbitrageBinanceCryptoWatcherCls();
                            try
                            {
                                BinanceResponseData = JsonConvert.DeserializeObject<ArbitrageBinanceCryptoWatcherCls>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Binance ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }

                            if (BinanceResponseData != null)
                            {
                                data.Price =Convert.ToDecimal(BinanceResponseData.lastPrice);
                                data.Volume= Convert.ToDecimal(BinanceResponseData.quoteVolume);
                                data.ChangePer= Convert.ToDecimal(BinanceResponseData.priceChangePercent);
                            }
                        }
                        break;
                    case (short)enAppType.Bittrex: //Done
                        Url = "https://bittrex.com/api/v1.1/public/getmarketsummary?market=#Pair#";
                        Url = Url.Replace("#exchange#", "bittrex");
                        Url = Url.Replace("#Pair#", Pair[1].ToUpper() + "-" + Pair[0].ToUpper());
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            ArbitrageBittrexCryptoWatcherCls BittrexResponseData = new ArbitrageBittrexCryptoWatcherCls();
                            try
                            {
                                BittrexResponseData = JsonConvert.DeserializeObject<ArbitrageBittrexCryptoWatcherCls>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Bittrex ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }

                            if (BittrexResponseData != null && BittrexResponseData.success)
                            {
                                data.Price =Convert.ToDecimal(BittrexResponseData.result.FirstOrDefault().Last);
                                data.Volume =Convert.ToDecimal(BittrexResponseData.result.FirstOrDefault().BaseVolume);
                                data.ChangePer = 0;
                            }
                        }
                        break;
                    case (short)enAppType.Coinbase: //Done
                        Url = "https://api-public.sandbox.pro.coinbase.com/products/#Pair#/ticker";
                        Url = Url.Replace("#exchange#", "coinbase-pro");
                        Url = Url.Replace("#Pair#", Pair[0].ToUpper() + "-" + Pair[1].ToUpper());
                        //                    web.Headers["User-Agent"] =
                        //"Mozilla/4.0 (Compatible; Windows NT 5.1; MSIE 6.0) " +
                        //"(compatible; MSIE 6.0; Windows NT 5.1; " +
                        //".NET CLR 1.1.4322; .NET CLR 2.0.50727)";
                        //            }
                        WebHeaderCollection HeaderCollection = new WebHeaderCollection();
                        HeaderCollection.Add(string.Format("User-Agent: {0}", ".NET CLR 1.1.4322; .NET CLR 2.0.50727;"));
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", HeaderCollection, 90000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            try
                            {
                                ResponseData = JsonConvert.DeserializeObject<ArbitrageCoinbaseCryptoWatcherCls>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Coinbase ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }

                            if (ResponseData != null)
                            {
                                data.Price = Convert.ToDecimal( ResponseData.price);
                                data.Volume = Convert.ToDecimal( ResponseData.volume);
                                data.ChangePer = 0;
                            }
                        }
                        break;
                    case (short)enAppType.Poloniex: //done
                        Url = "https://poloniex.com/public?command=returnTicker";
                        Url = Url.Replace("#exchange#", "poloniex");
                        Url = Url.Replace("#Pair#", Pair[1].ToLower() + "_" + Pair[0].ToLower());
                        Response = await _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false);
                        if (!string.IsNullOrEmpty(Response))
                        {
                            Dictionary<string, poloniexWatcherAPIResponse> poloniexResponseData = new Dictionary<string, poloniexWatcherAPIResponse>();
                            try
                            {
                                poloniexResponseData = JsonConvert.DeserializeObject<Dictionary<string, poloniexWatcherAPIResponse>>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Poloniex ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }

                            if (poloniexResponseData != null)
                            {
                                poloniexWatcherAPIResponse poloniexWatcher = new poloniexWatcherAPIResponse();
                                poloniexResponseData.TryGetValue(Pair[1].ToUpper() + "_" + Pair[0].ToUpper(), out poloniexWatcher);
                                if (poloniexWatcher?.last != 0)
                                {
                                    //poloniexResponseData.TryGetValue(Pair[1].ToUpper() + "_" + Pair[0].ToUpper(), out poloniexWatcher);
                                    data.Price = poloniexWatcher.last;
                                    data.Volume = poloniexWatcher.quoteVolume;
                                    data.ChangePer = poloniexWatcher.percentChange;
                                }
                            }
                        }
                        break;
                    case (short)enAppType.TradeSatoshi:
                        Url = "https://tradesatoshi.com/api/public/getmarketsummary?market=#Pair#";
                        Url = Url.Replace("#Pair#", data.Pair);
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        if (!string.IsNullOrEmpty(Response))
                        {
                            ArbitrageTradeSatoshiCryptoWatcherCls TradesatoshiResponseData = new ArbitrageTradeSatoshiCryptoWatcherCls();
                            try
                            {
                                TradesatoshiResponseData = JsonConvert.DeserializeObject<ArbitrageTradeSatoshiCryptoWatcherCls>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " TradeSatoshi ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }

                            if (TradesatoshiResponseData != null && TradesatoshiResponseData.result != null)
                            {
                                data.Price =Convert.ToDecimal(TradesatoshiResponseData.result.last);
                                data.Volume =Convert.ToDecimal(TradesatoshiResponseData.result.baseVolume);
                                data.ChangePer =Convert.ToDecimal(TradesatoshiResponseData.result.change);
                            }
                        }
                        break;

                    case (short)enAppType.UpBit://Done
                        Url = "https://api.upbit.com/v1/trades/ticks?market=#Pair#";
                        Url = Url.Replace("#Pair#", data.Pair);
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        if (!string.IsNullOrEmpty(Response))
                        {
                            List<UpbitWatcherAPIResponse> UpbitResponseData = new List<UpbitWatcherAPIResponse>();
                            try
                            {
                                UpbitResponseData = JsonConvert.DeserializeObject<List<UpbitWatcherAPIResponse>>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " UpBit ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (UpbitResponseData != null || UpbitResponseData.Count > 0)
                            {
                                data.Price = Convert.ToDecimal(UpbitResponseData[0].trade_price);
                                data.Volume = Convert.ToDecimal(UpbitResponseData[0].trade_volume);
                                data.ChangePer = Convert.ToDecimal(UpbitResponseData[0].change_price);
                            }
                        }
                        break;
                    case (short)enAppType.Huobi: //Done
                        Url = "https://api.huobi.com/market/detail/merged?symbol=#Pair#";
                        Url = Url.Replace("#Pair#", Pair[0].ToLower() + Pair[1].ToLower());
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        if (!string.IsNullOrEmpty(Response))
                        {
                            HuboiTickResult HuboiResponseData = new HuboiTickResult();
                            try
                            {
                                HuboiResponseData = JsonConvert.DeserializeObject<HuboiTickResult>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " Huobi ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }

                            if (HuboiResponseData != null && HuboiResponseData.status.ToLower() == "ok")
                            {
                                data.Price = Convert.ToDecimal(HuboiResponseData.tick.close);
                                data.Volume = Convert.ToDecimal(HuboiResponseData.tick.vol);
                                //change per remain
                            }
                        }
                        break;
                    /// Add new case for OKEx By Pushpraj as on 20-06-2019
                    case (short)enAppType.OKEx:
                        Url = "https://www.okex.com/api/spot/v3/instruments/#Pair#/ticker";
                        Url = Url.Replace("#Pair#", data.Pair);
                        Response = _WebAPISendRequest.SendRequestAsync(Url, "", "GET", "application/json", null, 15000, false).GetAwaiter().GetResult();
                        if (!string.IsNullOrEmpty(Response))
                        {
                            CommonWatcherAPIResponse OKExResponseData = new CommonWatcherAPIResponse();
                            try
                            {
                                OKExResponseData = JsonConvert.DeserializeObject<CommonWatcherAPIResponse>(Response);
                            }
                            catch (Exception ex)
                            {
                                //HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name + " OKEx ", this.GetType().Name, ex);
                                return await Task.FromResult(data);
                            }
                            if (OKExResponseData != null && OKExResponseData.success && OKExResponseData.result != null)
                            {
                                data.Price = OKExResponseData.result.last;
                            }
                        }
                        break;
                }
                return await Task.FromResult(data);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(data);
            }
        }
    }

    public class ArbitrageLiquidityBalanceCheckHandler : IRequestHandler<LPBalanceCheckArbitrage, LPBalanceCheckArbitrage>
    {
        private readonly IFrontTrnRepository _frontTrnRepository;
        private readonly BinanceLPService _binanceLPService;
        private readonly BitrexLPService _bitrexLPService;
        private readonly ICoinBaseService _coinBaseService;
        private readonly IPoloniexService _poloniexService;
        private readonly IUpbitService _upbitService;
        private readonly IHuobiLPService _huobiLPService;
        private readonly ITradeSatoshiLPService _tradeSatoshiLPService;
        private readonly IOKExLPService _oKExLPService;

        public ArbitrageLiquidityBalanceCheckHandler(IFrontTrnRepository FrontTrnRepository,
        BinanceLPService BinanceLPService, BitrexLPService BitrexLPService, IUpbitService upbitService, IHuobiLPService huobiLPService,
        ICoinBaseService CoinBaseService, IPoloniexService PoloniexService, ITradeSatoshiLPService TradeSatoshiLPService, IOKExLPService oKExLPService)
        {
            _frontTrnRepository = FrontTrnRepository;
            _binanceLPService = BinanceLPService;
            _bitrexLPService = BitrexLPService;
            _coinBaseService = CoinBaseService;
            _poloniexService = PoloniexService;
            _upbitService = upbitService;
            _huobiLPService = huobiLPService;
            _tradeSatoshiLPService = TradeSatoshiLPService;
            _oKExLPService = oKExLPService;
        }

        public async Task<LPBalanceCheckArbitrage> Handle(LPBalanceCheckArbitrage Request, CancellationToken cancellationToken)
        {
            try
            {
                LPKeyVault LPKeyVaultObj = _frontTrnRepository.BalanceCheckLPArbitrage(Request.SerProID);
                switch (LPKeyVaultObj.AppTypeID)
                {
                    case (long)enAppType.Binance:
                        await BalanceCheckOnBinance(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.Huobi:
                        await BalanceCheckOnHuobi(Request, LPKeyVaultObj);
                        break;

                    case (long)enAppType.Bittrex:
                        await BalanceCheckOnBittrex(Request, LPKeyVaultObj);
                        break;

                    case (long)enAppType.TradeSatoshi:
                        await BalanceCheckOnTradeSatoshi(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.Poloniex:
                        await BalanceCheckOnPoloniex(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.Coinbase:
                        await BalanceCheckOnCoinbase(Request, LPKeyVaultObj);
                        break;
                    case (long)enAppType.UpBit:
                        await BalanceCheckOnUpbit(Request, LPKeyVaultObj);
                        break;

                    //Add New Case for OKEx by Pushpraj as on 12-06-2019
                    case (long)enAppType.OKEx:
                        await BalanceCheckOnOKEx(Request, LPKeyVaultObj);
                        break;
                    default:
                        Request.Balance = 0;
                        HelperForLog.WriteLogIntoFile("LiquidityConfiguration", this.GetType().Name, "--3--LiquidityConfiguration Call web API  not found proper liquidity provider---" + "##Provider Type:" + LPKeyVaultObj.AppTypeID);
                        break;
                }
                return await Task.FromResult(Request);
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(Request);
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnHuobi(LPBalanceCheckArbitrage request, LPKeyVault lPKeyVaultObj)
        {
            try
            {
                HuobiClient.SetDefaultOptions(new HuobiClientOptions()
                {
                    ApiCredentials = new ApiCredentials(lPKeyVaultObj.APIKey, lPKeyVaultObj.SecretKey)
                });

                WebCallResult<List<HuobiBalance>> HuobiResult = await _huobiLPService.GetBalancesAsync(request.SerProID);

                if (HuobiResult != null)
                {
                    foreach (var balance in HuobiResult.Data)
                    {
                        if (balance.Currency.ToUpper() == request.Currency.ToUpper())
                        {
                            request.Balance = Convert.ToDecimal(balance.Balance);
                        }
                    }
                }
                else
                {
                    request.Balance = 0;
                }
                return request;
            }
            catch (Exception ex)
            {
                request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return request;
            }

        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnBinance(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                //BinanceClient.SetDefaultOptions(new BinanceClientOptions()
                //{
                //    ApiCredentials = new ApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey)
                //});
                _binanceLPService._client.SetApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey);
                CallResult<BinanceAccountInfo> BinanceResult = await _binanceLPService.GetBalancesAsync();
                if (BinanceResult != null && BinanceResult?.Data != null && BinanceResult.Data?.Balances != null && BinanceResult.Success)
                {
                    foreach (var balance in BinanceResult.Data.Balances)
                    {
                        if (balance.Asset.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.Free;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnBittrex(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                //BittrexClient.SetDefaultOptions(new BittrexClientOptions()
                //{
                //    ApiCredentials = new ApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey)
                //});
                _bitrexLPService._client.SetApiCredentials(LPKeyVaultObj.APIKey, LPKeyVaultObj.SecretKey);
                CallResult<BittrexBalance> BittrexResult = await _bitrexLPService.GetBalanceAsync(Request.Currency.ToUpper());
                if (BittrexResult != null && BittrexResult.Success && BittrexResult.Data != null && BittrexResult.Data?.Available != null)
                {
                    Request.Balance = Convert.ToDecimal(BittrexResult.Data.Available);
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnTradeSatoshi(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                GlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                GlobalSettings.Secret = LPKeyVaultObj.SecretKey;
                GetBalancesReturn TradeSatoshiResult = await _tradeSatoshiLPService.GetBalancesAsync();
                if (TradeSatoshiResult != null && TradeSatoshiResult.success && TradeSatoshiResult.result != null)
                {
                    foreach (var balance in TradeSatoshiResult.result)
                    {
                        if (balance.currency.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.available;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnCoinbase(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                CoinBaseGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                CoinBaseGlobalSettings.Secret = LPKeyVaultObj.SecretKey;

                IEnumerable<CoinbasePro.Services.Accounts.Models.Account> CoinbaseResult = await _coinBaseService.GetAllAccountsAsync();
                if (CoinbaseResult != null && CoinbaseResult.Count() > 0)
                {
                    foreach (var balance in CoinbaseResult)
                    {
                        if (balance.Currency.ToString().ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.Available;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnPoloniex(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                PoloniexGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                PoloniexGlobalSettings.Secret = LPKeyVaultObj.SecretKey;

                Dictionary<string, decimal> PoloniexResult = await _poloniexService.PoloniexGetBalance();
                if (PoloniexResult != null)
                {
                    foreach (var balance in PoloniexResult)
                    {
                        if (balance.Key.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = balance.Value;
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnUpbit(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                //PoloniexGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                //PoloniexGlobalSettings.Secret = LPKeyVaultObj.SecretKey;

                var UpbitResult = await _upbitService.GetCurrenciesAsync();
                if (UpbitResult != null)
                {
                    foreach (var balance in UpbitResult.Result)
                    {
                        if (balance.currency.ToUpper() == Request.Currency.ToUpper())
                        {
                            Request.Balance = Convert.ToDecimal(balance.balance);
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }

        private async Task<LPBalanceCheckArbitrage> BalanceCheckOnOKEx(LPBalanceCheckArbitrage Request, LPKeyVault LPKeyVaultObj)
        {
            try
            {
                OKEXGlobalSettings.API_Key = LPKeyVaultObj.APIKey;
                OKEXGlobalSettings.Secret = LPKeyVaultObj.SecretKey;
                OKEXGlobalSettings.PassPhrase = "paRo@1$##";

                OKEBalanceResult OKExResult = await _oKExLPService.GetWalletBalanceAsync();
                if (OKExResult.Data != null)
                {
                    foreach (var bal in OKExResult.Data)
                    {
                        if (bal.currency.ToString().ToUpper() == Request.Currency.ToString().ToUpper())
                        {
                            Request.Balance = Convert.ToDecimal(bal.available);
                        }
                    }
                }
                else
                {
                    Request.Balance = 0;
                }
                return Request;
            }
            catch (Exception ex)
            {
                Request.Balance = 0;
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return Request;
            }
        }
    }

}
