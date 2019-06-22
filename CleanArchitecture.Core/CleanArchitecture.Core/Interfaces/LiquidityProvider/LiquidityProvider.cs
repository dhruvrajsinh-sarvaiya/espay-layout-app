using Binance.Net.Objects;
using Bittrex.Net.Objects;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.LiquidityProvider1;
using CoinbasePro.Services.Orders.Models.Responses;
using CoinbasePro.Services.Products.Models;
using CryptoExchange.Net.Objects;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

//using OKExSDK;
//using OKExSDK.Models;
//using OKExSDK.Models.General;
using Huobi.Net;
using Huobi.Net.Objects;

namespace CleanArchitecture.Core.Interfaces.LiquidityProvider
{
    public interface IBinanceLPService
    {
        Task<CallResult<BinanceCanceledOrder>> CancelOrderAsync(string symbol, long? orderId = null, string origClientOrderId = null, string newClientOrderId = null, long? receiveWindow = null);
        Task<CallResult<BinanceOrderBook>> GetOrderBookAsync(string market, int? limit = 100);
        Task GetMarketSummaryAsync(string market);
        Task<WebCallResult<BinanceAggregatedTrades[]>> GetTradeHistoryAsync(string market, int? limit = null);//Get recent trades // default limit 500
        Task<CallResult<BinancePlacedOrder>> PlaceOrderAsync(Binance.Net.Objects.OrderSide side, string market, Binance.Net.Objects.OrderType type, decimal quantity, string newClientOrderId = null, decimal? price = null, Binance.Net.Objects.TimeInForce? timeInForce = null, decimal? stopPrice = null, decimal? icebergQty = null, OrderResponseType? orderResponseType = null, int? receiveWindow = null);
        Task<WebCallResult<BinanceOrder>> GetOrderInfoAsync(string symbol, long? orderId = null, string origClientOrderId = null, long? receiveWindow = null);
        Task GetOpenOrdersAsync(string market = null, int? receiveWindow = null);
        //Task GetBalanceAsync(string currency);
        Task<WebCallResult<BinanceAccountInfo>> GetBalancesAsync();
        Task GetOrderHistoryAsync(string market = null);
        Task GetTradeFeeAsync(string market = null, int? receiveWindow = null);
        Task GetSystemStatusAsync();
        Task<WebCallResult<BinanceExchangeInfo>> GetExchangeInfoAsync();
        CallResult<BinanceTradeFee[]> GetTradeFee(string symbol);
    }
    
    public interface IBitrexLPService
    {
        Task<WebCallResult<BittrexOrderBook>> GetOrderBookAsync(string market);
        Task GetMarketSummaryAsync(string market);
        Task<CallResult<BittrexMarketHistory[]>> GetTradeHistoryAsync(string market);//GetMarketHistoryAsync
        Task<CallResult<BittrexGuid>> PlaceOrderAsync(Bittrex.Net.Objects.OrderSide side, string market, decimal quantity, decimal rate);
        Task<WebCallResult<object>> CancelOrderAsync(Guid guid);
        Task<CallResult<BittrexAccountOrder>> GetOrderInfoAsync(Guid guid);
        Task GetOpenOrdersAsync(string market = null);
        Task<CallResult<BittrexBalance>> GetBalanceAsync(string currency);
        Task GetBalancesAsync();
        Task GetOrderHistoryAsync(string market = null);
    }

    public interface ICoinBaseService
    {
        void Connect();
        Task<OrderResponse> PlaceOrder(enTransactionMarketType marketType, CoinbasePro.Services.Orders.Types.OrderSide side, String Pair, decimal size, decimal limitPrice, decimal stopPrice, bool postOnly = false, Guid? clientOid = null);
        Task<CoinbaseCancelOrderRes> CancelOrderById(string id);
        Task<object> CancelAllOrders();
        Task<OrderResponse> GetOrderById(string id);
        Task<object> GetAllOrders(CoinbasePro.Services.Orders.Types.OrderStatus[] orderStatus, int limit = 100, int numberOfPages = 0);
        Task<object> GetAllCurrencies();
        Task<object> GetProductOrderBook(string Pair);
        Task<object> GetAllProducts();
        Task<object> GetProductStats(string Pair);
        Task<object> GetProductTicker(string Pair);
        Task<IList<IList<ProductTrade>>> GetTrades(string Pair, int limit = 100, int numberOfPages = 0);
        Task<object> GetFillsByProductId(string Pair, int limit = 100, int numberOfPages = 0);
        Task<IEnumerable<CoinbasePro.Services.Accounts.Models.Account>> GetAllAccountsAsync();
    }

    public interface IPoloniexService
    {
        //void Connect();
        Task<Object> GetPoloniexTicker();
        Task<Object> GetPoloniex24Volume();
        Task<Object> GetPoloniexCurrency();
        Task<Object> GetPoloniexOrderBooksAsync(string pair, long level);
        Task<Object> GetPoloniexTradeHistories(string BaseCur, string secondCur, DateTime start, DateTime End);
        Task<List<PoloniexTradeHistory>> GetPoloniexTradeHistoriesV1(string Market, int Limit);
        Task<Object> poloniexChartData(string BaseCur, string secondCur, DateTime start, DateTime End, long? period = 14400);
        Task<Object> GetPoloniexOpenOrder(string BaseCur, string secondCur);
        Task<Object> GetPoloniexOrderTrade(String orderNumber);
        Task<Object> GetPoloniexOrderState(String orderNumber);
        Task<Object> CancelPoloniexOrder(String orderNumber);
        Task<Dictionary<string, decimal>> PoloniexGetBalance();
        Task<String> PlacePoloniexOrder(string BaseCur, string secondCur, decimal amount, decimal rate, enOrderType orderType);
        string GetHash(string Sign, string secretKey);
    }

    public interface ITradeSatoshiLPService
    {
        //public API
        Task GetCurrenciesAsync();
        Task<GetOrderBookReturn> GetOrderBookAsync(string market, string type = "both", int? depth = null);
        Task GetMarketSummaryAsync(string market);
        Task<GetMarketHistoryReturn> GetTradeHistoryAsync(string market, int? count = null);//GetMarketHistoryAsync
        Task GetTickerAsync(string market);

         // private API
        Task GetBalanceAsync(string currency);
        Task<GetBalancesReturn> GetBalancesAsync();
        Task<SubmitOrderReturn> PlaceOrderAsync(OrderSide side, string market, decimal quantity, decimal rate); // SubmitOrder
        Task<CancelOrderReturn> CancelOrderAsync(CancelOrderType type, long? orderID = null, string market = "");
        Task<GetOrderReturn> GetOrderInfoAsync(long orderID);
        Task<GetOrdersReturn> GetOpenOrdersAsync(string market, int? limit = 20);  //GetOrders      
        //Task GetOrderHistoryAsync(string market = null); // GetTradeHistory
    }
    public interface IHuobiLPService    
    {
        Task<WebCallResult<long>> CancelOrderAsync(long orderId);
        Task<WebCallResult<HuobiMarketDepth>>GetOrderBookAsync(string market, int? limit = 100);
        Task GetMarketSummaryAsync(string market);
        Task<WebCallResult<List<HuobiMarketTrade>>> GetTradeHistoryAsync(string market, int limit = 20);//Get recent trades // default limit 500
       Task<WebCallResult<HuobiOrder>> GetOrderInfoAsync(long orderId );
        Task GetOpenOrdersAsync(string market = null, int? receiveWindow = null);
        Task<WebCallResult<List<HuobiBalance>>> GetBalancesAsync(long accountId);
        //Task GetOrderHistoryAsync(string market = null);
        Task<WebCallResult<List<HuobiOrderTrade>>> GetOrderHistoryAsync(string symbol, IEnumerable<HuobiOrderType> types = null, DateTime? startTime = null, DateTime? endTime = null, long? fromId = null, HuobiFilterDirection? direction = null, int? limit = null);

        Task<WebCallResult<List<HuobiSymbol>>> GetExchangeInfoAsync();
        Task<WebCallResult<long>> PlaceOrder(long accountId, string symbol, HuobiOrderType orderType, decimal amount, decimal? price = null);
     }

    public interface IUpbitService
    {
        Task<ListCurrencyResult> GetCurrenciesAsync();
        Task<UpbitOrderbookResponse> GetOrderBookAsync(string market);
        Task<TickerResponse> GetTickerAsync(string market);
        
        Task<CreateOrCancelOrderResponse> PlaceOrderAsync(string market, UpbitOrderSide side, decimal volume, decimal price, UpbitOrderType ord_type = UpbitOrderType.limit); 
        Task<UpbitCancelOrderResponse> CancelOrderAsync(string OrderId);
        Task<OrdersResponse> GetOrderInfoAsync(string OrderId);
        Task<TrandeHistoryResponse> GetTrandHistory(string market); 
    }
    /// <summary>
    /// Generate/Add new Interface for Implement New API OKEx By Pushpraj as on : 10-06-2019 Task Assign by: Khushali Medam
    /// </summary>

    #region OKEx Method Class
    public interface IOKExLPService 
    {
        //Private API
        Task<OKExCancelOrderReturn> CancelOrderAsync(string instrument_id, string order_id);
        Task<OKExPlaceOrderReturn> PlaceOrderAsync(string instrument_id, string type, decimal price, decimal size, int leverage, string client_oid, string match_price);
        Task<OKExGetOrderInfoReturn> GetOrderInfoAsync(string instrument_id, string order_id, string client_oid);
        Task<OKExGetAllOpenOrderReturn> GetOpenOrderAsync(string instrument_id, int? from, int? to, int? limit);
        Task<OKEBalanceResult> GetWalletBalanceAsync();
        Task<OKExGetWithdrawalFeeReturn> GetWithDrawalFeeAsync(string currency);

        //Public API
        Task<OKExGetOrderBookReturn> GetOrderBookAsync(string instrument_id, int? size, int? depth);
        Task<OKExGetMarketDataReturn> GetMarketSummaryDataAsync(string instrument_id, DateTime? start, DateTime? end, int? granularity);
        Task<GetOKEXTradeHistoryResult> GetTradeHistoryAasync(string instrument_id, int? from, int? to, int? limit);
        Task<OKExGetExchangeRateInfoReturn> GetExchangeRateAsync();
        Task<OKExGetTokenPairDetailReturn> GetTokenPairDetailAsync();
    }
    #endregion

    /// <summary>
    /// End Generate/Add new Interface for Implement New API OKEx By Pushpraj as on : 10-06-2019 Task Assign by: Khushali Medam
    /// </summary>

}
