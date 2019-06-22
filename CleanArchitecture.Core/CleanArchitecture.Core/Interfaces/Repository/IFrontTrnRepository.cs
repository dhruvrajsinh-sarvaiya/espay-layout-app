using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.LiquidityProvider;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.Repository
{
    public interface IFrontTrnRepository
    {
        List<ActiveOrderDataResponse> GetActiveOrder(long MemberID, string FromDate, string TodDate, long PairId, short trnType);
        List<OpenOrderQryResponse> GetOpenOrder(long MemberID, string FromDate, string ToDate, long PairId, short trnType);
        List<TradeHistoryResponce> GetTradeHistory(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, long TrnNo = 0);
        List<CopiedLeaderOrdersQryRes> GetCopiedLeaderOrders(long MemberID, string FromDate = null, string ToDate = null, long PairId = 999, short trnType = 999, string FollowTradeType = "", long FollowingTo = 0);
        long GetPairIdByName(string pair);
        List<RecentOrderRespose> GetRecentOrder(long PairId, long MemberID);
        List<GetBuySellBook> GetBuyerBook(long id, decimal Price = -1);
        List<GetBuySellBook> GetSellerBook(long id, decimal Price = -1);
        List<GetGraphDetailInfo> GetGraphData(long id, int IntervalTime, string IntervalData, DateTime Minute, int socket = 0);
        decimal LastPriceByPair(long PairId, ref short UpDownBit);
        PairRatesResponse GetPairRates(long PairId);
        List<TradePairTableResponse> GetTradePairAsset(long BaseId = 0);
        List<ServiceMasterResponse> GetAllServiceConfiguration(int StatusData = 0);
        List<GetGraphResponsePairWise> GetGraphDataEveryLastMin(string Interval);
        HighLowViewModel GetHighLowValue(long PairId, int Day);
        List<FavouritePairInfo> GetFavouritePairs(long UserId);
        List<PairStatisticsCalculation> GetPairStatisticsCalculation();
        void UpdatePairStatisticsCalculation(List<TradePairStastics> PairDataUpdated);

        OpenOrderInfo CheckOpenOrderRange(long TrnNo);
        List<TopLooserGainerPairData> GetFrontTopGainerPair(int Type);
        List<TopLooserGainerPairData> GetFrontTopLooserPair(int Type);
        List<TopLooserGainerPairData> GetFrontTopLooserGainerPair();
        decimal GetHistoricalPerformanceData(long UserId, int Type);
        List<StopLimitBuySellBook> GetStopLimitBuySellBooks(decimal LTP, long Pair, enOrderType OrderType, short IsCancel = 0);
        List<LPStatusCheckData> LPstatusCheck(); // khushali 23-01-2019  for LP status check 
        List<LPStatusCheckDataArbitrage> LPstatusCheckArbitrage(); // khushali 23-01-2019  for LP status check 
        List<TopLeaderListInfo> TopLeaderList(int IsAll = 0);
        List<TradeWatchLists> getTradeWatchList(List<TradeWatchLists> TradeWatcher);

        List<SiteTokenConversionQueryRes> GetSiteTokenConversionData(long? UserId, string SourceCurrency = "", string TargerCurrency = "", string FromDate = "", string ToDate = "", short IsMargin = 0);

        //Rita 20-2-19 for Margin Trading
        List<StopLimitBuySellBook> GetStopLimitBuySellBooksMargin(decimal LTP, long Pair, enOrderType OrderType, short IsCancel = 0);
        List<GetBuySellBook> GetSellerBookMargin(long id, decimal Price = -1);
        List<GetBuySellBook> GetBuyerBookMargin(long id, decimal Price = -1);
        HighLowViewModel GetHighLowValueMargin(long PairId, int Day);
        List<GetGraphDetailInfo> GetGraphDataMargin(long id, int IntervalTime, string IntervalData, DateTime Minute, int socket = 0);
        List<TradeHistoryResponce> GetTradeHistoryMargin(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, long TrnNo = 0);
        List<ActiveOrderDataResponse> GetActiveOrderMargin(long MemberID, string FromDate, string TodDate, long PairId, short trnType);
        List<OpenOrderQryResponse> GetOpenOrderMargin(long MemberID, string FromDate, string ToDate, long PairId, short trnType);
        List<RecentOrderRespose> GetRecentOrderMargin(long PairId, long MemberID);
        List<TradePairTableResponse> GetTradePairAssetMargin(long BaseId = 0);
        PairRatesResponse GetPairRatesMargin(long PairId);
        List<FavouritePairInfo> GetFavouritePairsMargin(long UserId);
        List<GetGraphResponsePairWise> GetGraphDataEveryLastMinMargin(string Interval);
        List<ServiceMasterResponse> GetAllServiceConfigurationMargin(int StatusData = 0);

        //khuhsali 03-04-2019 for ReleaseAndStuckOrder cron 
        List<ReleaseAndStuckOrdercls> ReleaseAndStuckOrder(DateTime Date);
        //khuhsali 14-05-2019 for Liquidity configuration
        List<ConfigureLP> GetLiquidityConfigurationData(short LPType);
        //khuhsali 15-05-2019 for Marging trading ReleaseAndStuckOrder cron 
        List<ReleaseAndStuckOrdercls> MarginReleaseAndStuckOrder(DateTime Date);

        //khushali for Liquidity Provider configuration
        bool UpdateLTPData(LTPcls LTPData);
        bool InsertLTPData(LTPcls LTPData);
        List<CryptoWatcher> GetPairWiseLTPData(GetLTPDataLPwise LTPData);
        bool GetLocalConfigurationData(short LPType);
        LPKeyVault BalanceCheckLP(long SerproID);
        LPKeyVault BalanceCheckLPArbitrage(long SerproID);
        //Rita 31-5-19 for arbitrage traging methods
        List<ActiveOrderDataResponseArbitrage> GetActiveOrderArbitrage(long MemberID, string FromDate, string TodDate, long PairId, short trnType);
        List<OpenOrderQryResponse> GetOpenOrderArbitrage(long MemberID, string FromDate, string ToDate, long PairId, short trnType);
        List<TradeHistoryResponceArbitrage> GetTradeHistoryArbitrage(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, long TrnNo = 0);
        List<RecentOrderResposeArbitrage> GetRecentOrderArbitrage(long PairId, long MemberID);

        List<GetBuySellBook> GetBuyerBookArbitrage(long id, decimal Price = -1);
        List<GetBuySellBook> GetSellerBookArbitrage(long id, decimal Price = -1);
        List<GetGraphDetailInfo> GetGraphDataArbitrage(long id, int IntervalTime, string IntervalData, DateTime Minute, int socket = 0);
        List<GetGraphResponsePairWise> GetGraphDataEveryLastMinArbitrage(string Interval);
        List<StopLimitBuySellBook> GetStopLimitBuySellBooksArbitrage(decimal LTP, long Pair, enOrderType OrderType, short IsCancel = 0);
        HighLowViewModel GetHighLowValueArbitrage(long PairId, int Day);
        List<ExchangeProviderListArbitrage> GetExchangeProviderListArbitrage(long PairId);
        List<SmartArbitrageHistoryInfo> SmartArbitrageHistoryList(long PairId,long MemberID,string FromDat, string ToDate);
        List<ConfigureLPArbitrage> GetLiquidityConfigurationDataArbitrage(short LPType);
        Task<ArbitrageCryptoWatcherQryRes> UpdateLTPDataArbitrage(ArbitrageLTPCls LTPData);
        ArbitrageCryptoWatcherQryRes InsertLTPDataArbitrage(ArbitrageLTPCls LTPData);
        bool GetLocalConfigurationDataArbitrage(short LPType);
        List<ArbitrageBuySellViewModel> GetExchangeProviderBuySellBookArbitrage(long PairId, short TrnType);
        LPKeyVault GetTradeFeesLPArbitrage(long LPType);

        //Darshan Dholakiya added this methods for arbitrage changes:07-06-2019
        List<TradePairTableResponse> GetTradePairAssetArbitrageInfo(long BaseId = 0);
        //khushali 10-06-2019 Route configuration wise exchange info
        ExchangeProviderListArbitrage GetExchangeProviderListArbitrageRouteWise(long RouteID);
        //============================================


        //Darshan Dholakiya added this methods for Service Config changes:11-06-2019

        List<ServiceMasterResponse> GetAllServiceConfigurationArbitrage(int StatusData = 0);
        LocalPairStatisticsQryRes GetLocalPairStatistics(long Pair);
        //============================================
    }
}
