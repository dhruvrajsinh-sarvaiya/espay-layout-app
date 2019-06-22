using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.ViewModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.Arbitrage;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IFrontTrnService
    {
        List<ActiveOrderInfo> GetActiveOrder(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        List<OpenOrderInfo> GetOpenOrder(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        CopiedLeaderOrdersResponse GetCopiedLeaderOrders(long MemberID, string FromDate = "", string TodDate = "", long PairId = 999, short trnType = 999, string FollowTradeType = "", long FollowingTo = 0, int PageSize = 0, int PageNo = 0);
        List<BasePairResponse> GetTradePairAsset();
        List<VolumeDataRespose> GetVolumeData(long BasePairId, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        List<GetTradeHistoryInfo> GetTradeHistory(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        long GetPairIdByName(string pair, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        bool IsValidPairName(string Pair);
        List<RecentOrderInfo> GetRecentOrder(long PairId, long MemberID, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        List<GetBuySellBook> GetBuyerBook(long id, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        List<GetBuySellBook> GetSellerBook(long id, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        bool IsValidDateFormate(string date);
        Int16 IsValidTradeType(string Type);
        Int16 IsValidMarketType(string type);
        Int16 IsValidStatus(string status);
        long GetBasePairIdByName(string BasePair, short IsMargin = 0);//Rita 22-2-19 for Margin Trading Data bit
        GetTradePairByName GetTradePairByName(long id);
        List<GetGraphDetailInfo> GetGraphDetail(long PairId, int IntervalTime, string IntervalData, short IsMargin = 0);//Rita 23-2-19 for Margin Trading Data bit
        MarketCapData GetMarketCap(long PairId);
        VolumeDataRespose GetVolumeDataByPair(long PairId);
        bool addSetteledTradeTransaction(SettledTradeTransactionQueue queueData);
        PairRatesResponse GetPairRates(long PairId, short IsMargin = 0);//Rita 23-2-19 for Margin Trading Data bit
        int AddToFavouritePair(long PairId, long UserId);
        int RemoveFromFavouritePair(long PairId, long UserId);
        List<FavouritePairInfo> GetFavouritePair(long UserId, short IsMargin = 0);//Rita 23-2-19 for Margin Trading Data bit
        Task GetPairAdditionalVal(long PairId, decimal CurrentRate, long TrnNo, decimal Quantity, DateTime TranDate, string UserID = "");
        void GetIntervalTimeValue(string Interval, ref int IntervalTime, ref string IntervalData);
        List<VolumeDataRespose> GetMarketTicker(short IsMargin = 0);//Rita 23-2-19 for Margin Trading Data bit
        int GetMarketTickerSignalR(short IsMargin = 0);//Rita 23-2-19 for Margin Trading Data bit
        List<TopLooserGainerPairData> GetFrontTopGainerPair(int Type);
        List<TopLooserGainerPairData> GetFrontTopLooserPair(int Type);
        List<TopLooserGainerPairData> GetFrontTopLooserGainerPair();
        GetBuySellMarketBook GetMarketDepthChart(long PairId);
        List<HistoricalPerformanceYear> GetHistoricalPerformance(long UserId);
        GetWithdrawalTransactionData GetWithdrawalTransaction(string RefId);
        TopLeadersListResponse TopLeadersList();
        TradeWatchListResponse getTradeWatchList(long userId);
        TopProfitGainerLoserResponse GetTopProfitGainer(DateTime date, int size);
        TopProfitGainerLoserResponse TopProfitLoser(DateTime date, int size);
        List<HistoricalPerformanceYear> GetHistoricalPerformanceV1(long UserId);
        SiteTokenConvertFundResponse GetSiteTokenConversionData(long? UserID, string SourceCurrency = "", string TargerCurrency = "", string FromDate = "", string ToDate = "", short IsMargin = 0);
        //Rita 20-2-19 for margin trading
        Task GetPairAdditionalValMargin(long PairId, decimal CurrentRate, long TrnNo, decimal Quantity, DateTime TranDate, string UserID = "");
        List<BasePairResponse> GetTradePairAssetMargin();
        GetTradePairByName GetTradePairByNameMargin(long id);
        MarketCapData GetMarketCapMargin(long PairId);
        VolumeDataRespose GetVolumeDataByPairMargin(long PairId);
        GetBuySellMarketBook GetMarketDepthChartMargin(long PairId);
        int AddToFavouritePairMargin(long PairId, long UserId);
        int RemoveFromFavouritePairMargin(long PairId, long UserId);

        //khushali 27-05-2019 for trading configuration
        TradingConfigurationList TradingConfiguration();
        BizResponseClass ChangeTradingConfigurationStatus(long ConfigID, short Status, long UserID);

        //Rita 31-5-19 for arbitrage traging methods
        long GetPairIdByNameArbitrage(string pair, short IsMargin = 0);
        List<ActiveOrderInfoArbitrage> GetActiveOrderArbitrage(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0);
        List<OpenOrderInfo> GetOpenOrderArbitrage(long MemberID, string FromDate, string TodDate, long PairId, int Page, short trnType, short IsMargin = 0);
        List<GetTradeHistoryInfoArbitrage> GetTradeHistoryArbitrage(long MemberID, string sCondition, string FromDate, string TodDate, int page, int IsAll, short IsMargin = 0);
        List<RecentOrderInfoArbitrage> GetRecentOrderArbitrage(long PairId, long MemberID, short IsMargin = 0);

        List<GetBuySellBook> GetBuyerBookArbitrage(long id, short IsMargin = 0);
        List<GetBuySellBook> GetSellerBookArbitrage(long id, short IsMargin = 0);
        List<GetGraphDetailInfo> GetGraphDetailArbitrage(long PairId, int IntervalTime, string IntervalData, short IsMargin = 0);//Rita 23-2-19 for Margin Trading Data bit
        Task GetPairAdditionalValArbitrage(long PairId, decimal CurrentRate, long TrnNo, decimal Quantity, DateTime TranDate, string UserID = "");
        ProfitIndicatorInfo GetProfitIndicatorArbitrage(long PairId, short IsMargin = 0);
        List<BasePairResponse> GetTradePairAssetArbitrage();//Darshan Dholakiya added method this for the Arbitrage Trading changes:07-06-2019
        List<ExchangeProviderListArbitrage> ExchangeProviderListArbitrage(long PairId, short IsMargin = 0);
        List<ArbitrageBuySellViewModel> GetExchangeProviderBuySellBookArbitrage(long PairId, short TrnType);
        List<ExchangeListSmartArbitrage> ExchangeListSmartArbitrageService(long PairId,string PairName, short ProviderCount, short IsMargin = 0);
        List<SmartArbitrageHistoryInfo> SmartArbitrageHistoryList(long PairId,long MemberID, string FromDate, string TodDate, short IsMargin = 0);
        //============================================
    }
}
