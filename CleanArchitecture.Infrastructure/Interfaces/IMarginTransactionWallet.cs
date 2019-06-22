using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IMarginTransactionWallet
    {
        //Task<WalletDrCrResponse> GetWalletHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enMarginWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels, string Token = "", enMarginWalletDeductionType enWalletDeductionType = enMarginWalletDeductionType.Normal);
        Task<WalletDrCrResponse> MarginGetWalletHoldNew(long requestUserID, string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enMarginWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);
        Task<WalletDrCrResponse> MarginGetWalletCreditDrForHoldNewAsyncFinal(MarginPNL PNLObj ,MarginCommonClassCrDr firstCurrObj, MarginCommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web);
        Task<WalletDrCrResponse> MarginGetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enMarginWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "");
        Task<string> GetDefaultAccWalletID(string SMSCode, long UserID);
        Task<string> GetAccWalletID(long WalletID);
        Task<long> GetWalletID(string AccWalletID);
        //Task<StopLimitOrderPrice> ReCalculateInternalOrderPrice(long UserID, long PairID, string baseCurrency);
        Task<bool> ReleaseMarginWalletforSettleLeverageBalance(long BatchNo);
        Task<BizResponseClass> SettleMarketOrderForCharge(long ChargeID);
  
    }
}
