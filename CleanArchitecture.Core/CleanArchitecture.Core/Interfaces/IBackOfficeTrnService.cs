using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IBackOfficeTrnService
    {
        TradingSummaryResponse GetTradingSummary(long MemberID,string FromDate, string ToDate,long TrnNo,short status,string SMSCode,long PairID,short trade, short Market, int PageSize, int PageNo,short IsMargin=0); //Rita 4-2-19 for Margin Trading
        Task<BizResponseClass> TradeRecon(long TranNo, string ActionMessage, long UserId, string accessToken);
        TransactionChargeResponse ChargeSummary(string FromDate, string ToDate, short trade);
        BizResponseClass WithdrawalRecon(WithdrawalReconRequest request, long UserId, string accessToken);
        WithdrawalSummaryResponse GetWithdrawalSummary(WithdrawalSummaryRequest Request);

        PairTradeSummaryResponse pairTradeSummary(long PairID, short Market, short Range,short IsMargin=0);//Rita 5-3-19 for Margin Trading
        TradeSettledHistoryResponse TradeSettledHistory(int PageSize, int PageNo,long PairID=999,short TrnType=999,short OrderType=999,string FromDate="",string Todate="",long MemberID=0, long TrnNo=0,short IsMargin=0); //Rita 22-2-19 for Margin Trading Data bit
        List<TopLooserGainerPairData> GetTopGainerPair(int Type, short IsMargin = 0);//Rita 5-3-19 for Margin Trading
        List<TopLooserGainerPairData> GetTopLooserPair(int Type, short IsMargin = 0);//Rita 5-3-19 for Margin Trading
        List<TopLooserGainerPairData> GetTopLooserGainerPair(short IsMargin = 0);//Rita 5-3-19 for Margin Trading
        //khushali 23-01-2019 for LP wise Trade history
        TradingSummaryLPResponse GetTradingSummaryLP(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, string LPType);
        TradingReconHistoryResponse GetTradingReconHistory(long MemberID, string FromDate, string ToDate, long TrnNo, short status, long PairID, short trade, short Market, int PageSize, int PageNo, int LPType, short? IsProcessing);
        //khushali 18-03-2019 for trade recon
        Task<BizResponseClass> TradeReconV1(enTradeReconActionType ActionType, long TranNo, string ActionMessage, long UserId, string accessToken);
        //Darshan Dholakiya added this method for Arbitrage summary changes:06-06-2019
        TradingSummaryResponse GetTradingSummaryArbitrage(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, short IsMargin = 0); 
        //Darshan Dholakiya added this method for Arbitrage summary Lp changes:06-06-2019
        TradingSummaryLPResponse GetTradingSummaryLPArbitrage(long MemberID, string FromDate, string ToDate, long TrnNo, short status, string SMSCode, long PairID, short trade, short Market, int PageSize, int PageNo, string LPType);
        //Darshan Dholakiya added this method for Arbitrage Settled History changes:06-06-2019
        TradeSettledHistoryResponse TradeSettledHistoryArbitrage(int PageSize, int PageNo, long PairID = 999, short TrnType = 999, short OrderType = 999, string FromDate = "", string Todate = "", long MemberID = 0, long TrnNo = 0, short IsMargin = 0); 

    }
}
