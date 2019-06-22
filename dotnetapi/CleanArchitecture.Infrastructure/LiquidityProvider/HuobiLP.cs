using System;
using System.Collections.Generic;
using System.Text;

using System.Threading;
using System.Threading.Tasks;
using Binance.Net;

using Binance.Net.Objects;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.Transaction;
using CryptoExchange.Net.Objects;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

using StructureMap;
using Huobi.Net.Objects;
using Huobi.Net;
using Newtonsoft.Json.Linq;
using System.Linq;

namespace CleanArchitecture.Infrastructure.LiquidityProvider
{
    public class HuobiLPService : IHuobiLPService
    {
        public HuobiClient _client;
        public HuobiLPService(HuobiClient Client)
        {
            _client = Client;
        }

        public Task<WebCallResult<long>> CancelOrderAsync(long orderId)
        {
            try
            {
                WebCallResult<long> result = _client.CancelOrder(orderId);
                return Task.FromResult(result);
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("cancalOrder", "HuboiAPI", e);
                return null;
            }
        }

        public  Task<WebCallResult<List<HuobiBalance>>> GetBalancesAsync(long accountId)
        {
            try
            {
                var Result = _client.GetBalances(accountId);
                

                string data = "{\"Success\":\"true\",\"Error\":null,\"data\":[{\"currency\":\"usdt\",\"type\":0,\"balance\":\"500009195917.4362872650\"},{\"currency\":\"usdt\",\"type\":\"frozen\",\"balance\":\"328048.1199920000\"},{\"currency\":\"etc\",\"type\":0,\"balance\":\"499999894616.1302471000\"},{\"currency\":\"etc\",\"type\":\"frozen\",\"balance\":\"9786.6783000000\"},{\"currency\":\"eth\",\"type\":0,\"balance\":\"499999894616.1302471000\"},{\"currency\":\"eth\",\"type\":1,\"balance\":\"9786.6783000000\"}]}";
                if (data != null)
                {
                    try
                    {
                         var list = JsonConvert.DeserializeObject<WebCallResult<List<HuobiBalance>>>(data);
                        return Task.FromResult(list);

                       
                    }
                    catch (Exception e)
                    {
                        
                        return null;
                    }

                }
                else
                {
                    return null;
                }

            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("Getbalance", "HuboiAPI", e);
                return null;
            }
        }


        public Task<WebCallResult<List<HuobiSymbol>>> GetExchangeInfoAsync()
        {
            try
            {
                var Result = _client.GetSymbols();
                return Task.FromResult(Result);
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetExchangeInfo", "HuboiAPI", e);
                return null;
            }
        }

        public Task GetMarketSummaryAsync(string market)
        {
            try
            {
                var Result = _client.GetMarketDetails24H(market);
                return Task.CompletedTask;
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetMarketSummary", "HuboiAPI", e);
                return null;
            }
        }

        public Task GetOpenOrdersAsync(string market = null, int? receiveWindow = null)
        {
            try
            {
                var Result = _client.GetOpenOrders();
                return Task.CompletedTask;
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetopenOrder", "HuboiAPI", e);
                return null;
            }
        }

        public  Task<WebCallResult<HuobiMarketDepth>> GetOrderBookAsync(string market, int? limit = 100)
        {
            try
            {
                var Result = _client.GetMarketDepth(market, limit.Value);                
                string data = "{     \"status\":\"ok\",   \"data\":{        \"id\":59378,      \"symbol\":\"ethusdt\",      \"account-id\":100009,      \"amount\":\"10.1000000000\",      \"price\":\"100.1000000000\",      \"created-at\":1494901162595,      \"type\":\"buy-limit\",      \"filled-amount\":\"10.1000000000\",      \"filled-cash-amount\":\"1011.0100000000\",      \"filled-fees\":\"0.0202000000\",      \"finished-at\":1494901400468,      \"source\":\"api\",      \"state\":\"filled\",      \"canceled-at\":0   }}";
                if (data != null)
                {
                    try
                    {
                        return Task.FromResult(JsonConvert.DeserializeObject<WebCallResult<HuobiMarketDepth>>(data));
                        //return JsonConvert.DeserializeObject<UpbitOrderbookResponse>(data);
                    }
                    catch (Exception e)
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
                

            } 
        
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetOrderbook", "HuboiAPI", e);
                return null;
            }

        }

       
        public Task<WebCallResult<List<HuobiOrderTrade>>> GetOrderHistoryAsync(string symbol, IEnumerable<HuobiOrderType> types = null, DateTime? startTime = null, DateTime? endTime = null, long? fromId = null, HuobiFilterDirection? direction = null, int? limit = null)
        {
            try
            {
                var Result = _client.GetSymbolTrades(symbol);
                return Task.FromResult(Result);
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetOrderHistory", "HuboiAPI", e);
                return null;
            }
        }

        public Task<WebCallResult<HuobiOrder>> GetOrderInfoAsync(long orderId)
        {
            try
            {
                var Result = _client.GetOrderInfo(orderId);
                //return Task.FromResult(Result);
                string data= "{ 	\"status\": \"ok\", 	\"data\": { 		\"id\": 59378, 		\"symbol\": \"ethusdt\", 		\"account-id\": 100009, 		\"amount\": \"10.1000000000\", 		\"price\": \"100.1000000000\", 		\"created-at\": 1494901162595, 		\"type\": \"buy-limit\", 		\"filled-amount\": \"10.1000000000\", 		\"filled-cash-amount\": \"1011.0100000000\", 		\"filled-fees\": \"0.0202000000\", 		\"finished-at\": 1494901400468, 		\"source\": \"api\", 		\"state\": \"filled\", 		\"canceled-at\": 0 	} }";
                if (data != null)
                {
                    try
                    {
                        return Task.FromResult(JsonConvert.DeserializeObject<WebCallResult<HuobiOrder>>(data));
                      
                    }
                    catch (Exception e)
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
               
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetOrderinfo", "HuboiAPI", e);
                return null;
            }
        }

        public Task<WebCallResult<List<HuobiMarketTrade>>> GetTradeHistoryAsync(string market, int limit)
        {
           
               
               /// return Task.FromResult(Res);
            //    // var data= "{      \"data\":{         \"id\":31459998,       \"Timestamp\":1502448920106,       \"data\":{            \"id\":17592256642623,          \"amount\":0.04,          \"price\":1997,          \"Side\":\"buy\",          \"Timestamp\":1502448920106       }    } }";

            //    var data = "{\"data\":[{\"Id\":31459998,\"TimeStamp\":1502448920106,\"Details\":[{\"Id\":17592256642623,\"Amount\":0.04,\"Price\":1997,\"Side\":\"buy\",\"TimeStamp\":1502448920106},{\"Id\":17592256642623,\"Amount\":0.04,\"Price\":1997,\"Side\":\"buy\",\"TimeStamp\":1502448920106}]},{\"Id\":31459998,\"TimeStamp\":1502448920106,\"result\":[{\"Id\":17592256642623,\"Amount\":0.04,\"Price\":1997,\"Side\":\"buy\",\"TimeStamp\":1502448920106},{\"Id\":17592256642623,\"Amount\":0.04,\"Price\":1997,\"Side\":\"buy\",\"TimeStamp\":1502448920106}]}]}";
            
             try
            {
                var Res = _client.GetMarketTradeHistory(market, limit);
                try
                {
                   
                    if (Res != null)
                    {

                       // var result = JsonConvert.DeserializeObject<WebCallResult<List<HuobiMarketTrade>>>(Res);
                        return Task.FromResult(Res);
                    }
                    else
                    {
                        return null;
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
           

            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("GetTradeHistory", "HuboiAPI", e);
                return null;
            }
        }

        public Task<WebCallResult<long>> PlaceOrder(long accountId, string symbol, HuobiOrderType orderType, decimal amount, decimal? price = null)
        {
            try
            {
                WebCallResult<long> result = _client.PlaceOrder(accountId, symbol, orderType, amount, price);
                return Task.FromResult(result);
            }
            catch (Exception e)
            {
                HelperForLog.WriteErrorLog("placeorder", "HuboiAPI", e);
                return null;
            }


        }

    }
    //public interface IHuobiScopedProcessingService
    //{
    //    void DoWork();
    //}

    //public class HuobiScopedProcessingService : IHuobiScopedProcessingService
    //{

    //    private readonly ILogger _logger;
    //    private readonly IServiceProvider _serviceProvider;
    //    List<GetBuySellBook> OrderBookList;// = new List<GetBuySellBook>();
    //    private readonly ITransactionConfigService _transactionConfigService;
    //    private IMemoryCache _cache;
    //    //private readonly IMediator _mediator;
    //    private readonly ILiquidityProviderService _liquidityProviderService;

    //    public HuobiScopedProcessingService(IMemoryCache Cache, ILogger<BinanceScopedProcessingService> logger, // IMediator mediator , ILiquidityProviderService LiquidityProviderService,
    //       IServiceProvider serviceProvider, ITransactionConfigService TransactionConfigService)
    //    {
    //        _serviceProvider = serviceProvider;
    //        _logger = logger;
    //        //_mediator = mediator;
    //        _transactionConfigService = TransactionConfigService;
    //        _cache = Cache;
    //        //_liquidityProviderService = LiquidityProviderService;
    //    }
    //    public void DoWork()
    //    {
    //        try
    //        {
    //            WebCallResult<List<HuobiSymbol>> ExchangeInfo;
    //            using (var client = new HuobiClient())
    //            {
    //                ExchangeInfo = client.GetSymbols();

    //            }                    
    //            //string[] Symbol = new string[ExchangeInfo.Data.Symbol.Length];
    //                 string Symbol = ExchangeInfo.Data.BaseCurrency;
    //              _cache.Set<string>("HuobiSymbol", Symbol);
    //                string[] symbol = _transactionConfigService.LpPairListConvertorV1(symbol, Convert.ToInt16(enAppType.Huobi));
    //                //string[] baseCur = new string[] { "BTC", "ETH", "USDT", "BNB", "USD", "PAX" };
    //                _cache.Set<string[]>("HuobiTradePair", symbol);


                
    //            _logger.LogInformation("huobi Scoped Processing Service is working.");
    //        }
    //        catch (Exception ex)
    //        {
    //            HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
    //        }

    //    }        
    //}

    //public class HuobiConsumeScopedServiceHostedService : IHostedService
    //{
    //    private readonly ILogger _logger;

    //    public HuobiConsumeScopedServiceHostedService(IServiceProvider services,
    //        ILogger<BinanceConsumeScopedServiceHostedService> logger)
    //    {
    //        Services = services;
    //        _logger = logger;
    //    }

    //    public IServiceProvider Services { get; }


    //    public Task StartAsync(CancellationToken cancellationToken)
    //    {
    //        _logger.LogInformation(
    //          " HuobiConsume Scoped Service Hosted Service is starting.");

    //        DoWork();

    //        return Task.CompletedTask;

    //    }

    //    private void DoWork()
    //    {
    //        _logger.LogInformation(
    //           "HuobiConsume Scoped Service Hosted Service is working.");

    //        using (var scope = Services.CreateScope())
    //        {
    //            var scopedProcessingService =
    //                scope.ServiceProvider
    //                    .GetRequiredService<IHuobiScopedProcessingService>();

    //            scopedProcessingService.DoWork();
    //        }
    //    }

    //    public Task StopAsync(CancellationToken cancellationToken)
    //    {
    //        _logger.LogInformation(
    //            "HuobiConsume Scoped Service Hosted Service is stopping.");

    //        return Task.CompletedTask;

    //    }
    //}

}
