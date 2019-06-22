using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Transaction.BackOffice;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IWalletDeposition
    {
        WalletDrCrResponse DepositionWalletOperation(string timestamp, string address, string coinName, decimal amount, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enWalletTranxOrderType enWalletTranx, enWalletLimitType enWalletLimit, enTrnType routeTrnType, string Token = "");
        Task<BizResponseClass> WithdrawalReconV1(WithdrawalReconRequest request, long UserId, string accessToken);
    }
}
