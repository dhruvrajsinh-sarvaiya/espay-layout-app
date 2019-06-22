using CleanArchitecture.Core.ViewModels.Transaction.BackOfficeCount;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Repository
{
    public interface IBackOfficeCountTrnRepository
    {
        ActiveTradeUserCount GetActiveTradeUserCount();
        ConfigurationCount GetConfigurationCount();
        LedgerCountInfo GetLedgerCount();
        OrderSummaryCount GetOrderSummaryCount();
        TradeSummaryCount GetTradeSummaryCount();
        ProfitSummaryCount GetProfitSummaryCount();
        TradeSummaryCount GetTradeUserMarketTypeCount(string Type);
        //Rita 6-3-19 for Margin Trading
        ActiveTradeUserCount GetActiveTradeUserCountMargin();
        ConfigurationCount GetConfigurationCountMargin();
        LedgerCountInfo GetLedgerCountMargin();
        OrderSummaryCount GetOrderSummaryCountMargin();
        TradeSummaryCount GetTradeSummaryCountMargin();
        ProfitSummaryCount GetProfitSummaryCountMargin();
        TradeSummaryCount GetTradeUserMarketTypeCountMargin(string Type);
        TransactionReportCountResponse TransactionReportCount();

        ActiveTradeUserCount GetActiveTradeUserCountArbitrage(string Status);
        ConfigurationCount GetConfigurationCountArbitrage();
        TradeSummaryCount GetTradeSummaryCountArbitrage();
        TradeSummaryCount GetTradeUserMarketTypeCountArbitrage(string Type, string Status);
    }
}
