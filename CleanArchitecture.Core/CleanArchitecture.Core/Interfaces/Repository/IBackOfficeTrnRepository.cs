using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Transaction;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Configuration;
using CleanArchitecture.Core.ViewModels.Configuration.FeedConfiguration;
using CleanArchitecture.Core.ViewModels.Transaction;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Repository
{
    public interface IBackOfficeTrnRepository
    {
        List<GetTradingSummary> GetTradingSummary(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<TradePairConfigRequest> GetAllPairConfiguration();
        List<ProductConfigrationGetInfo> GetAllProductConfiguration();
        List<TrnChargeSummaryViewModel> ChargeSummary(string FromDate, string ToDate, short trade);
        bool WithdrawalRecon(TransactionRecon transactionRecon, TransactionQueue TransactionQueue, WithdrawHistory _WithdrawHistory = null, WithdrawERCTokenQueue _WithdrawERCTokenQueueObj = null, TransactionRequest TransactionRequestobj= null,short IsInsert=2);
        List<WithdrawalSummaryViewModel> GetWithdrawalSummary(WithdrawalSummaryRequest Request);
        List<PairTradeSummaryQryResponse> PairTradeSummary(long PairID, short Market, short Range);
        List<AvailableRoute> GetAvailableRoute();
        List<ListPairInfo> ListPairInfo();
        List<GetTradeRouteConfigurationData> GetTradeRouteConfiguration(long Id);
        List<WithdrawRouteConfig> GetWithdrawRoute(long ID,enTrnType? TrnType);
        List<AvailableRoute> GetAvailableTradeRoute(int TrnType);
        List<GetTradeRouteConfigurationData> GetTradeRouteForPriority(long PairId, long OrderType, int TrnType);
        List<TradeSettledHistory> TradeSettledHistory(int PageSize, int PageNo, ref long TotalPages,ref long TotalCount, ref int PageSize1,long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0);
        List<MarketTickerPairData> GetMarketTickerPairData();
        int UpdateMarketTickerPairData(List<long> PairId, long UserId);
        List<VolumeDataRespose> GetUpdatedMarketTicker();
        List<TopLooserGainerPairData> GetTopGainerPair(int Type);
        List<TopLooserGainerPairData> GetTopLooserPair(int Type);
        List<TopLooserGainerPairData> GetTopLooserGainerPair();
        //khuhsali 23-01-2019 trade summery for LP wise data
        List<GetTradingSummaryLP> GetTradingSummaryLP(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, string LPType, ref long TotalPages);
        List<GetTradingReconHistory> GetTradingReconHistory(long MemberID, string FromDate, string ToDate, long TrnNo, short status, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, int LPType, ref long TotalPages, short? IsProcessing);
        List<SocketFeedConfigQueryRes> GetAllFeedConfiguration();
        //Rita 4-2-19 for Margin Trading
        List<TradeSettledHistory> TradeSettledHistoryMargin(int PageSize, int PageNo, ref long TotalPages, ref long TotalCount, ref int PageSize1, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0);
        List<VolumeDataRespose> GetUpdatedMarketTickerMargin();
        List<GetTradingSummary> GetTradingSummaryMargin(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<PairTradeSummaryQryResponse> PairTradeSummaryMargin(long PairID, short Market, short Range);
        List<TopLooserGainerPairData> GetTopGainerPairMargin(int Type);
        List<TopLooserGainerPairData> GetTopLooserPairMargin(int Type);
        List<TopLooserGainerPairData> GetTopLooserGainerPairMargin();
        List<MarketTickerPairData> GetMarketTickerPairDataMargin();
        int UpdateMarketTickerPairDataMargin(List<long> PairId, long UserId);
        List<TradePairConfigRequest> GetAllPairConfigurationMargin();
        List<ListPairInfo> ListPairInfoMargin();
        List<TradePairConfigRequest> GetAllPairConfigurationArbitrageData(); //Darshan Dholakiya added method for the arbitrage configuration changes:06-06-2019
        List<ListPairInfo> ListPairArbitrageInfo(); //Darshan Dholakiya added method for the arbitrage configuration changes:06-06-2019
        List<GetTradingSummary> GetTradingSummaryArbitrageInfo(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);//Darshan Dholakiya added method for the Trading Summary Arbitrage changes:06-06-2019
        List<GetTradingSummaryLP> GetTradingSummaryLPArbitrageInfo(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, string LPType, ref long TotalPages);//Darshan Dholakiya added method for the Trading Summary Arbitrage changes:06-06-2019

        //Darshan Dholakiya added method for the Trading Settlement History changes:08-06-2019
        List<TradeSettledHistory> TradeSettledHistoryArbitrageInfo(int PageSize, int PageNo, ref long TotalPages, ref long TotalCount, ref int PageSize1, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0);
        //Darshan Dholakiya added this method for Trade arbitrage changes:12-06-2019
        List<GetTradeRouteConfigurationData> GetTradeRouteConfigurationArbitrage(long Id);
        //Darshan Dholakiya added this method for Trade arbitrage changes:12-06-2019
        List<GetTradeRouteConfigurationData> GetTradeRouteForPriorityArbitrage(long PairId, long OrderType, int TrnType);

        //Darshan Dholakiya added this method for Trade arbitrage changes:12-06-2019

        List<AvailableRoute> GetAvailableTradeRouteArbitrageInfo(int TrnType);

        //Darshan Dholakiya added this method for arbitrage Product changes:18-06-2019

        List<ProductConfigrationGetInfo> GetAllProductConfigurationArbitrageInfo();

    }
}
