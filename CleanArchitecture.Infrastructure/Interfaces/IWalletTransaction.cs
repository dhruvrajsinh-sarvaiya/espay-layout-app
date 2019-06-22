using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IWalletTransaction
    {
        //ntrivedi 15-02-2019 not in use so comment , so no need to change margin wallet not use changes
        //Task<WalletDrCrResponse> GetWalletCreditDrForHoldNewAsyncFinal(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels enAllowedChannels, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);

        //Task<WalletDrCrResponse> GetWalletHoldNew(long userID, string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);

        //Task<WalletDrCrResponse> GetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "");

        //Task<WalletDrCrResponse> GetWalletDeductionNew(string coinName, string timestamp, enWalletTranxOrderType orderType, decimal amount, long userID, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, string Token = "", EnAllowedChannels allowedChannels = EnAllowedChannels.Web);
    }
}
