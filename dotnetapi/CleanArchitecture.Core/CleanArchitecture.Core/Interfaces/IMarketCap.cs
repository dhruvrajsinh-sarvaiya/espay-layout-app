using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.Affiliate;
using CleanArchitecture.Core.Entities.Charges;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces
{
    public interface IMarketCap
    {
        BizResponseClass CallAPI();

        BizResponseClass ParseResponse(string response);

        BizResponseClass UpdateMarketCapCounter();

        string SendAPIRequest(MarketCapCounterMaster marketCap, string ContentType = "application/json", int Timeout = 180000, string MethodType = "GET");

        List<WalletTypeMaster> GetWalletTypeMaster();

        MarketCapCounterMaster GetMarketCounter();

        BizResponseClass CallSP_InsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD");
        BizResponseClass CallSP_ArbitrageInsertUpdateProfit(DateTime TrnDate, string CurrencyName = "USD");

        AffiliateCommissionCron GetCronData();

        AffiliateCommissionCron InsertIntoCron(int Hour);

        Task<bool> ForceWithdrwLoan();
    }
}
