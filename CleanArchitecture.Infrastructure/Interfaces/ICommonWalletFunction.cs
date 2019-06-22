using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Wallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletOperations;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface ICommonWalletFunction
    {
        decimal GetLedgerLastPostBal(long walletId);
        enErrorCode CheckShadowLimit(long WalletID, decimal Amount, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);
        ServiceLimitChargeValue GetServiceLimitChargeValue(enWalletTrnType TrnType, string CoinName);

        //vsolanki 2018-11-24
        Task<enErrorCode> CheckShadowLimitAsync(long WalletID, decimal Amount, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);

        //vsolanki 2018-11-24
        Task<enErrorCode> InsertUpdateShadowAsync(long WalletID, decimal Amount, string Remarks, long WalleTypeId, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);
        Task<enErrorCode> UpdateShadowAsync(long WalletID, decimal Amount, EnWalletUsageType enWalletUsageType = EnWalletUsageType.Trading_Wallet);
       // Task<enErrorCode> CheckWalletLimitAsync(enWalletLimitType TrnType, long WalletId, decimal Amount);
        Task<WalletTrnLimitResponse> CheckWalletLimitAsyncV1(enWalletLimitType TrnType, long WalletId, decimal Amount, long TrnNo = 0);
        WalletTransactionQueue InsertIntoWalletTransactionQueue(Guid Guid, enWalletTranxOrderType TrnType, decimal Amount, long TrnRefNo, DateTime TrnDate, DateTime? UpdatedDate,
         long WalletID, string WalletType, long MemberID, string TimeStamp, enTransactionStatus Status, string StatusMsg, enWalletTrnType enWalletTrnType,
         Int64 ErrorCode = 0, decimal holdChargeAmount = 0, decimal chargeAmount = 0);

        Task<BizResponseClass> CheckWithdrawBeneficiary(string address, long userID, string smscode);
    }
}
