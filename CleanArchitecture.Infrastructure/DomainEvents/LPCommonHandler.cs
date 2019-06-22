using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Helpers;
using CleanArchitecture.Core.Interfaces;
using CleanArchitecture.Core.Interfaces.Configuration;
using CleanArchitecture.Core.Interfaces.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.LiquidityProvider1;
using CleanArchitecture.Core.ViewModels.Transaction;
using CoinbasePro.Services.Products.Models.Responses;
using MediatR;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Huobi.Net;
using CleanArchitecture.Core.Interfaces;

namespace CleanArchitecture.Infrastructure.Services
{

    public class BinanceOrderBookHandler : IRequestHandler<BinanceBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public BinanceOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(BinanceBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = obj.Quantity, Price = obj.Price });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Binance);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = obj.Quantity, Price = obj.Price });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Binance);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }
    // add huobi handler
    public class HuobiOrderBookHandler : IRequestHandler<HuobiBuySellBook>
    {
        
        private readonly ISignalRService _signalRService;       
       
        public HuobiOrderBookHandler(ISignalRService SignalRService)
        {
            _signalRService = SignalRService;
        }
         
        public async Task<Unit> Handle(HuobiBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = obj.Quantity, Price = obj.Price });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                     await _signalRService.BulkBuyerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Huobi);    
                   //await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Huobi);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = obj.Quantity, Price = obj.Price });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _signalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Huobi);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }

        }
    }

    public class BittrexOrderBookHandler : IRequestHandler<BittrexBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public BittrexOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(BittrexBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = obj.Quantity, Price = obj.Quantity });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Bittrex);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = obj.Quantity, Price = obj.Quantity });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Bittrex);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class CoinbaseOrderBookHandler : IRequestHandler<CoinbaseBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public CoinbaseOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(CoinbaseBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = obj.Size, Price = obj.Price });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Coinbase);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = obj.Size, Price = obj.Price });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Coinbase);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class PoloniexOrderBookHandler : IRequestHandler<PoloniexBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public PoloniexOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(PoloniexBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            if (Convert.ToDecimal(obj[1]) != 0)
                            {
                                SellerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj[1]), Price = Convert.ToDecimal(obj[0]) });
                            }
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Poloniex);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            if (Convert.ToDecimal(obj[1]) != 0)
                            {
                                BuyerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj[1]), Price = Convert.ToDecimal(obj[0]) });
                            }
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Poloniex);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class TradeSatoshiOrderBookHandler : IRequestHandler<TradesatoshiBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public TradeSatoshiOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(TradesatoshiBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj.quantity), Price = Convert.ToDecimal(obj.rate) });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.TradeSatoshi);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj.quantity), Price = Convert.ToDecimal(obj.rate) });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.TradeSatoshi);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class UpbitOrderBookHandler : IRequestHandler<UpbitBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public UpbitOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(UpbitBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj.ask_size), Price = Convert.ToDecimal(obj.ask_price) });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Upbit);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj.bid_size), Price = Convert.ToDecimal(obj.bid_price) });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.Upbit);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    #region OKExOrderBookHandler
    /// <summary>
    /// Add New Handler for integrate new API OKEx by Pushpraj
    /// </summary>
    public class OKExOrderBookHandler : IRequestHandler<OKExBuySellBook>
    {
        private readonly ISignalRService _SignalRService;

        public OKExOrderBookHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(OKExBuySellBook data, CancellationToken cancellationToken)
        {
            List<GetBuySellBook> SellerBookList = new List<GetBuySellBook>();
            List<GetBuySellBook> BuyerBookList = new List<GetBuySellBook>();
            try
            {
                if (data.Asks.Count > 0)
                {
                    var cnt = 0;
                    foreach (var obj in data.Asks)
                    {
                        {
                            SellerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj.quantity), Price = Convert.ToDecimal(obj.rate) });
                            cnt += 1;
                            if (cnt == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkSellerBook(SellerBookList, data.Symbol, Core.Enums.enLiquidityProvider.OKEx);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                if (data.Bids.Count > 0)
                {
                    var cnt1 = 0;
                    foreach (var obj in data.Bids)
                    {
                        {
                            BuyerBookList.Add(new GetBuySellBook() { Amount = Convert.ToDecimal(obj.quantity), Price = Convert.ToDecimal(obj.rate) });
                            cnt1 += 1;
                            if (cnt1 == 10)
                                break;
                        }
                    }
                    await _SignalRService.BulkBuyerBook(BuyerBookList, data.Symbol, Core.Enums.enLiquidityProvider.OKEx);
                    // HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair);
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    /// <summary>
    /// Add New Handler for integrate new API OKEx by Pushpraj
    /// </summary>
    #endregion

    public class LiquidityProviderHandler : IRequestHandler<CommonOrderBookRequest>
    {
        private readonly ISignalRService _SignalRService;
        private readonly IBinanceLPService _BinanceLPService;
        private readonly IBitrexLPService _BitrexLPService;
        private readonly IHuobiLPService _HuobiLPService;
        private readonly IPoloniexService _poloniexService;
        private readonly ITradeSatoshiLPService _TradeSatoshiLPService;
        private readonly ICoinBaseService _coinBaseService;
        //Add New Interface class for OKEx API by Pushpraj
        private readonly IOKExLPService _oKExLPService;
        //End Add New Interface class for OKEx API by Pushpraj

        private readonly IUpbitService _upbitService;
        private IMemoryCache _cache;
        private readonly ITransactionConfigService _transactionConfigService;
        private List<GetBuySellBook> OrderBookList;// = new List<GetBuySellBook>();
        private readonly IMediator _mediator;
        LPConverPairV1[] Symbol;

        public LiquidityProviderHandler(ISignalRService SignalRService,
            IBinanceLPService BinanceLPService, IHuobiLPService HuobiLPService, IBitrexLPService BitrexLPService, IPoloniexService poloniexService,
            ITradeSatoshiLPService TradeSatoshiLPService, ICoinBaseService coinBaseService, IUpbitService upbitService,
            IMemoryCache Cache, IMediator mediator,  ITransactionConfigService TransactionConfigService, IOKExLPService oKExLPService)
        {
            _SignalRService = SignalRService;
            _BinanceLPService = BinanceLPService;
            _HuobiLPService = HuobiLPService;
            _BitrexLPService = BitrexLPService;
            _poloniexService = poloniexService;
            _SignalRService = SignalRService;
            _upbitService = upbitService;
            _TradeSatoshiLPService = TradeSatoshiLPService;
            _coinBaseService = coinBaseService;
            _cache = Cache;
            _mediator = mediator;
            _transactionConfigService = TransactionConfigService;
            _oKExLPService = oKExLPService; ///add by Pushpraj as on 11-06-2019 for OKEx Implementation
        }

        public async Task<Unit> Handle(CommonOrderBookRequest data, CancellationToken cancellationToken)
        {
            try
            {
                switch (data.LpType)
                {
                    case enAppType.Binance:
                        //Symbol =  GetPair(_cache.Get<string[]>("BinanceSymbol"),data.LpType);
                        Symbol = GetPair(data.LpType);
                        foreach (var Data in Symbol)
                        {
                            var obj = await _BinanceLPService.GetOrderBookAsync(Data.Pair, 10);
                            if (obj.Data != null)
                            {
                                var BinanceOrderBook = new BinanceBuySellBook()
                                {
                                    Symbol = Data.LocalPair,
                                    Asks = obj.Data.Asks,
                                    Bids = obj.Data.Bids
                                };
                                _mediator.Send(BinanceOrderBook);
                            }

                            var obj1 = await _BinanceLPService.GetTradeHistoryAsync(Data.Pair, 10);
                            if (obj1.Data != null)
                            {
                                var BinanceTradeHistory = new BinanceTradeHistory()
                                {
                                    Symbol = Data.LocalPair,
                                    History = obj1.Data.ToList()
                                };
                                _mediator.Send(BinanceTradeHistory);
                            }
                        }
                        return await Task.FromResult(new Unit());

                    case enAppType.Huobi:
                        
                        Symbol = GetPair(data.LpType);
                        foreach (var Data in Symbol)
                        {
                            var obj = await _HuobiLPService.GetOrderBookAsync(Data.Pair, 10);
                            if (obj.Data != null)
                            {
                                var HuobiOrderBook = new HuobiBuySellBook()
                                {
                                    Symbol = Data.LocalPair,
                                    Asks = obj.Data.Asks,
                                    Bids = obj.Data.Bids
                                };
                                _mediator.Send(HuobiOrderBook);
                            }

                            var obj1 = await _HuobiLPService.GetTradeHistoryAsync(Data.Pair, 10);
                            if (obj1.Data != null)
                            {
                                var HuobiTradeHistory = new HuobiTradeHistory()
                                {
                                    Symbol = Data.LocalPair,
                                    History = obj1.Data.ToList()
                                };
                                _mediator.Send(HuobiTradeHistory);
                            }
                        }
                        return await Task.FromResult(new Unit());

                    case enAppType.Bittrex:
                        //Symbol = GetPair(_cache.Get<string[]>("BittrexSymbol"), data.LpType);
                        Symbol = GetPair(data.LpType);
                            
                        foreach (var Data in Symbol)
                        {
                            var book = await _BitrexLPService.GetOrderBookAsync(Data.Pair);
                            if (book != null)
                            {
                                Bittrex.Net.Objects.BittrexOrderBook data1 = book.Data;
                                if (data1 != null)
                                {
                                    var BittrexOrderBook = new BittrexBuySellBook()
                                    {
                                        Symbol = Data.LocalPair,
                                        Asks = data1.Sell,
                                        Bids = data1.Buy
                                    };
                                    _mediator.Send(BittrexOrderBook);
                                }
                            }

                            var obj1 = await _BitrexLPService.GetTradeHistoryAsync(Data.Pair);
                            if (obj1.Data != null)
                            {
                                var BittrexTradeHistory = new BittrexTradeHistory()
                                {
                                    Symbol = Data.LocalPair,
                                    History = obj1.Data.ToList()
                                };
                                _mediator.Send(BittrexTradeHistory);
                            }
                        }
                        return await Task.FromResult(new Unit());

                    case enAppType.Coinbase:
                        //Symbol = GetPair(_cache.Get<string[]>("CoinbaseSymbol"), data.LpType);
                        Symbol = GetPair(data.LpType);
                        foreach (var Data in Symbol)
                        {
                            var res = await _coinBaseService.GetProductOrderBook(Data.Pair);
                            if (res != null)
                            {
                                if (res.ToString() == "NotFound" || res.ToString() == "The operation was canceled.")
                                    continue;
                                var book = JsonConvert.DeserializeObject<ProductsOrderBookResponse>(JsonConvert.SerializeObject(res));
                                var CoinbaseOrderBook = new CoinbaseBuySellBook()
                                {
                                    Symbol = Data.LocalPair
                                };
                                if (book.Asks != null)
                                {
                                    CoinbaseOrderBook.Asks = book.Asks.ToList();
                                }
                                if (book.Bids != null)
                                {
                                    CoinbaseOrderBook.Bids = book.Bids.ToList();
                                }
                                _mediator.Send(CoinbaseOrderBook);
                            }

                            var obj1 = await _coinBaseService.GetTrades(Data.Pair, 10);
                            if (obj1 != null && obj1[0] != null)
                            {
                                var CoinbaseTradeHistory = new CoinbaseTradeHistory()
                                {
                                    Symbol = Data.LocalPair,
                                    History = obj1[0].ToList()
                                };
                                _mediator.Send(CoinbaseTradeHistory);
                            }
                        }
                        return await Task.FromResult(new Unit());

                    case enAppType.Poloniex:

                        Symbol = GetPair(data.LpType);
                        foreach (var Data in Symbol)
                        {
                            PoloniexOrderBook Res = new PoloniexOrderBook();
                            var PoloniexorderBook = await _poloniexService.GetPoloniexOrderBooksAsync(Data.Pair, 10);
                            if (PoloniexorderBook != null)
                            {
                                Res = JsonConvert.DeserializeObject<PoloniexOrderBook>(JsonConvert.SerializeObject(PoloniexorderBook));
                                if (Res != null)
                                {
                                    var PoloniexOrderBook = new PoloniexBuySellBook()
                                    {
                                        Symbol = Data.LocalPair
                                    };
                                    if (Res.asks != null)
                                    {
                                        PoloniexOrderBook.Asks = Res.asks;
                                    }
                                    if (Res.bids != null)
                                    {
                                        PoloniexOrderBook.Bids = Res.bids;
                                    }
                                    _mediator.Send(PoloniexOrderBook);
                                }

                                var obj1 = await _poloniexService.GetPoloniexTradeHistoriesV1(Data.Pair, 10);
                                if (obj1 != null)
                                {
                                    var PoloniexTradeHistory = new PoloniexTradeHistoryV1()
                                    {
                                        Symbol = Data.LocalPair,
                                        History = obj1
                                    };
                                    _mediator.Send(PoloniexTradeHistory);
                                }
                            }
                        }
                        return await Task.FromResult(new Unit());

                    case enAppType.TradeSatoshi:

                        TradeSatoshiOrderBook orderBook;
                        //Symbol = GetPair(_cache.Get<string[]>("TradeSatoshiSymbol"), data.LpType);
                        Symbol = GetPair(data.LpType);
                        foreach (var Data in Symbol)
                        {
                            orderBook = new TradeSatoshiOrderBook();
                            GetOrderBookReturn res = _TradeSatoshiLPService.GetOrderBookAsync(Data.Pair, depth: 10).GetAwaiter().GetResult();
                            if (res != null)
                            {
                                if (res.result != null)
                                {
                                    orderBook = JsonConvert.DeserializeObject<TradeSatoshiOrderBook>(JsonConvert.SerializeObject(res));
                                    if (orderBook != null)
                                    {
                                        if (orderBook.result != null)
                                        {
                                            var TradesatoshiOrderBook = new TradesatoshiBuySellBook()
                                            {
                                                Symbol = Data.LocalPair
                                            };
                                            if (orderBook.result.sell != null)
                                            {
                                                TradesatoshiOrderBook.Asks = orderBook.result.sell;
                                            }
                                            if (orderBook.result.buy != null)
                                            {
                                                TradesatoshiOrderBook.Bids = orderBook.result.buy;
                                            }
                                            _mediator.Send(TradesatoshiOrderBook);
                                        }
                                    }
                                }
                            }

                            var obj1 = await _TradeSatoshiLPService.GetTradeHistoryAsync(Data.Pair, 10);
                            if (obj1.success && obj1.result != null)
                            {
                                var TradesatoshiTradeHistory = new TradesatoshiTradeHistory()
                                {
                                    Symbol = Data.LocalPair,
                                    History = obj1.result
                                };
                                _mediator.Send(TradesatoshiTradeHistory);
                            }
                        }
                        return await Task.FromResult(new Unit());

                    case enAppType.UpBit :


                        Symbol = GetPair(data.LpType);

                        foreach (var Data in Symbol)
                        {
                            var res = await _upbitService.GetOrderBookAsync(Data.Pair);
                            if (res != null)
                            {
                                if (res.ToString() == "NotFound" || res.ToString() == "The operation was canceled.")
                                    continue;
                                var book = JsonConvert.DeserializeObject<UpbitOrderbookResponse>(JsonConvert.SerializeObject(res));
                                var UpbitOrderBook = new UpbitBuySellBook()
                                {
                                    Symbol = Data.LocalPair
                                };
                                foreach (var x in book.orderbook_units)
                                {
                                    List<OrderbookUnit> Aunit = new List<OrderbookUnit>();
                                    List<OrderbookUnit> Bunit = new List<OrderbookUnit>();
                                    if (x.ask_price != null || x.ask_price != 0)
                                    {
                                        Aunit.Add(x);
                                    }
                                    if (x.bid_price != null || x.bid_price != 0)
                                    {
                                        Bunit.Add(x);
                                    }
                                    UpbitOrderBook.Asks = Aunit;
                                    UpbitOrderBook.Bids = Bunit;
                                    _mediator.Send(UpbitOrderBook);
                                }

                            }
                        }
                        return await Task.FromResult(new Unit());

                    #region "OKEx"
                    ///add by Pushpraj as on 11-06-2019 for OKEx Implementation
                    case enAppType.OKEx:

                        //OKExOrderBook OKEXorderBook;
                        //Symbol = GetPair(_cache.Get<string[]>("TradeSatoshiSymbol"), data.LpType);
                        Symbol = GetPair(data.LpType);
                        foreach (var Data in Symbol)
                        {
                            //OKEXorderBook = new OKExOrderBook();
                            var res = _oKExLPService.GetOrderBookAsync(Data.Pair, depth: 10, size: 10).GetAwaiter().GetResult();
                            if (res != null)
                            {
                                OKExGetOrderBookReturn OKEXorderBook = JsonConvert.DeserializeObject<OKExGetOrderBookReturn>(JsonConvert.SerializeObject(res));
                                if (OKEXorderBook != null)
                                {
                                    var OKExcOrderBook = new OKExBuySellBook()
                                    {
                                        Symbol = Data.LocalPair,                                       
                                    };
                                    
                                    List<OKExOrderBookBuySell> AsksArray = new List<OKExOrderBookBuySell>();
                                    List<OKExOrderBookBuySell> BidsArray = new List<OKExOrderBookBuySell>();
                                    foreach (var x in OKEXorderBook.asks)
                                    {
                                        //var quantity = 0.0m;
                                        //var rate = 0.0m;                                        
                                        //x.TryGetValue(0, out quantity);
                                        //x.TryGetValue(1, out rate);
                                        AsksArray.Add(new OKExOrderBookBuySell {
                                            quantity = x[1],
                                            rate = x[0],
                                        });
                                    }

                                    foreach (var x in OKEXorderBook.bids)
                                    {
                                        //var quantity = 0.0m;
                                        //var rate = 0.0m;
                                        //x.TryGetValue(0, out quantity);
                                        //x.TryGetValue(1, out rate);
                                        BidsArray.Add(new OKExOrderBookBuySell
                                        {
                                            quantity = x[1],
                                            rate = x[0],
                                        });
                                    }

                                    OKExcOrderBook.Asks = AsksArray;
                                    OKExcOrderBook.Bids = BidsArray;
                                    _mediator.Send(OKExcOrderBook);
                                }
                            }

                            var obj1 = await _oKExLPService.GetTradeHistoryAasync(Data.Pair, from: 0, to: 100, limit: 100);
                           
                            if (obj1 != null)
                            {
                               
                                var OKExTradeHistory = new OKExTradeHistory()
                                {
                                    Symbol = Data.LocalPair,
                                    History = obj1.result
                                };
                                _mediator.Send(OKExTradeHistory);
                            }
                        }
                        return await Task.FromResult(new Unit());
                        #endregion
                        ///End add by Pushpraj as on 11-06-2019 for OKEx Implementation
                }
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog("LiquidityProviderHandler", this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }

        //public LPConverPairV1[] GetPair(string[] OldSymbol , enAppType LP)
        public LPConverPairV1[] GetPair(enAppType LP)
        {
            try
            {                //_cache.Get<string[]>("BinanceSymbol")
                //LPConverPairV1[] symbol = _transactionConfigService.LpPairListConvertorWithLocalPair(OldSymbol, Convert.ToInt16(LP));
                LPConverPairV1[] symbol = _transactionConfigService.LpPairListConvertorWithLocalPair(Convert.ToInt16(LP));
                return symbol;
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return null;
            }
        }
    }


    public class BinanceTradeHistoryHandler : IRequestHandler<BinanceTradeHistory>
    {
        private readonly ISignalRService _SignalRService;

        public BinanceTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(BinanceTradeHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = data.AggregateTradeId;
                    TradeData.Type = data.BuyerWasMaker.ToString();
                    TradeData.Price = data.Price;
                    TradeData.Amount = data.Quantity;
                    TradeData.Total = data.Price * data.Quantity;
                    TradeData.DateTime = data.Timestamp;
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = "BuyORSell";
                    TradeData.SettledDate = data.Timestamp;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.Binance);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }
    public class HuobiTradeHistoryHandler : IRequestHandler<HuobiTradeHistory>
    {
        private readonly ISignalRService _SignalRService; 

        public HuobiTradeHistoryHandler(ISignalRService SignalRService)     
        {
            _SignalRService = SignalRService;
        }

        
        public async Task<Unit> Handle(HuobiTradeHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();

                    foreach (var obj in data.Details)
                    {
                        TradeData.TrnNo = Convert.ToInt64(obj.Id);
                  
                        TradeData.Type = obj.Side.ToString();
                        TradeData.Price = obj.Price;
                        TradeData.Amount = obj.Amount;
                        TradeData.Total = obj.Price * obj.Amount;
                        TradeData.DateTime = obj.Timestamp;
                    }

                    
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = "BuyORSell";
                    TradeData.SettledDate = data.Timestamp;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.Huobi);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }
    public class BittrexTradeHistoryHandler : IRequestHandler<BittrexTradeHistory>
    {
        private readonly ISignalRService _SignalRService;

        public BittrexTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(BittrexTradeHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = data.Id;
                    TradeData.Type = data.FillType.ToString();
                    TradeData.Price = data.Price;
                    TradeData.Amount = data.Quantity;
                    TradeData.Total = data.Total;
                    TradeData.DateTime = data.Timestamp;
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = "BuyORSell";
                    TradeData.SettledDate = data.Timestamp;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.Bittrex);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class TradeSatoshiTradeHistoryHandler : IRequestHandler<TradesatoshiTradeHistory>
    {
        private readonly ISignalRService _SignalRService;

        public TradeSatoshiTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(TradesatoshiTradeHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = data.id;
                    TradeData.Type = data.orderType.ToString();
                    TradeData.Price = data.price;
                    TradeData.Amount = data.quantity;
                    TradeData.Total = data.price * data.quantity;
                    TradeData.DateTime = data.timeStamp;
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = data.orderType;
                    TradeData.SettledDate = data.timeStamp;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.TradeSatoshi);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }
    public class UpbitTradeHistoryHandler : IRequestHandler<UpbitTradesHistory>
    {
        private readonly ISignalRService _SignalRService;

        public UpbitTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(UpbitTradesHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = data.sequentialId;
                    TradeData.Type = data.askBid;
                    TradeData.Price = Convert.ToInt64(data.tradePrice);
                    TradeData.Amount = Convert.ToInt64(data.tradeVolume);
                    TradeData.Total = Convert.ToInt64(data.tradePrice) * Convert.ToInt64(data.tradeVolume);
                    TradeData.DateTime = Convert.ToDateTime(data.tradeTimestamp);
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = data.askBid;
                    TradeData.SettledDate = Convert.ToDateTime(data.timestamp);
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.Upbit);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }
    public class CoinbaseTradeHistoryHandler : IRequestHandler<CoinbaseTradeHistory>
    {
        private readonly ISignalRService _SignalRService;

        public CoinbaseTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(CoinbaseTradeHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = data.TradeId;
                    TradeData.Type = data.Side.ToString();
                    TradeData.Price = data.Price;
                    TradeData.Amount = data.Size;
                    TradeData.Total = data.Price * data.Size;
                    TradeData.DateTime = data.Time;
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = data.Side.ToString();
                    TradeData.SettledDate = data.Time;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.Coinbase);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }

    public class PoloniexTradeHistoryHandler : IRequestHandler<PoloniexTradeHistoryV1>
    {
        private readonly ISignalRService _SignalRService;

        public PoloniexTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(PoloniexTradeHistoryV1 Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = data.tradeID;
                    TradeData.Type = data.type.ToString();
                    TradeData.Price = data.rate;
                    TradeData.Amount = data.amount;
                    TradeData.Total = data.rate * data.amount;
                    TradeData.DateTime = data.date;
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = data.type;
                    TradeData.SettledDate = data.date;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.Poloniex);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            } 
        }
    }

    #region Get OKEX Trade History 
    /// <summary>
    /// Add new Handler for OKEx Trade history by pushpraj as on 17-06-2019
    /// </summary>
    public class OKExTradeHistoryHandler : IRequestHandler<OKExTradeHistory>
    {
        private readonly ISignalRService _SignalRService;

        public OKExTradeHistoryHandler(ISignalRService SignalRService)
        {
            _SignalRService = SignalRService;
        }

        public async Task<Unit> Handle(OKExTradeHistory Request, CancellationToken cancellationToken)
        {
            List<GetTradeHistoryInfo> TradeHisotry = new List<GetTradeHistoryInfo>();
            try
            {
                var cnt = 0;
                foreach (var data in Request.History)
                {
                    var TradeData = new GetTradeHistoryInfo();
                    TradeData.TrnNo = long.Parse(data.trade_id);
                    //TradeData.Type = data.orderType.ToString();
                    TradeData.Price = Decimal.Parse(data.price);
                    TradeData.Amount = Decimal.Parse(data.size);
                    TradeData.Total = Decimal.Parse(data.price) * Decimal.Parse(data.size);
                    TradeData.DateTime = data.timestamp;
                    TradeData.Status = 1;
                    TradeData.StatusText = "Success";
                    TradeData.PairName = Request.Symbol;
                    TradeData.ChargeRs = 0;
                    TradeData.IsCancel = 0;
                    TradeData.OrderType = data.side;
                    TradeData.SettledDate = data.timestamp;
                    //TradeData.SettledQty  = data.
                    //TradeData.Chargecurrency  = 
                    TradeHisotry.Add(TradeData);
                    cnt += 1;
                    if (cnt == 10)
                        break;
                }
                await _SignalRService.BulkOrderHistory(TradeHisotry, Request.Symbol, enLiquidityProvider.OKEx);
                //HelperForLog.WriteLogForSocket("DEpth ", "Original Pair", data.Symbol + " New Pair " + Pair + "Response : " + TradeData);
                return await Task.FromResult(new Unit());
            }
            catch (Exception ex)
            {
                HelperForLog.WriteErrorLog(System.Reflection.MethodBase.GetCurrentMethod().Name, this.GetType().Name, ex);
                return await Task.FromResult(new Unit());
            }
        }
    }
    #endregion
}
