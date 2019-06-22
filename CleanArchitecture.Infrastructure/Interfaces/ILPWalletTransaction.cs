using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using CleanArchitecture.Core.ViewModels.WalletConfiguration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface ILPWalletTransaction
    {
        Task<WalletDrCrResponse> LPGetWalletHoldNew(LPHoldDr LPObj);
    }

    public interface IArbitrageWalletService
    {
        BizResponseClass CreateArbitrageWallet(string currencyName, long id);
        ListArbitrageWalletTypeMasterResponse ListAllWalletArbitrageTypeMaster(int Status);
        Task<ListArbitrageWallet> ListArbitrageWalletMaster(long? WalletTypeId, short? Status, string AccWalletId, long? UserId);
        ListWalletLedgerResv1 GetArbitrageWalletLedger(DateTime FromDate, DateTime ToDate, string WalletId, int page, int PageSize);

        InsertUpdateAddressRes InsertUpdateArbitrageAddress(InsertUpdateAddressReq Req, long UserId);
        Task<ArbitrageServiceProBalanceResponse> GetArbitrageProviderBalance(long SerProID, string SMSCode);
        ListArbitrageAddressRes ListArbitrageAddress(string Address, long? WalletTypeId, long? ServiceProviderId);

        Task<WalletDrCrResponse> GetArbitrageWalletHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "", enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);
        Task<WalletDrCrResponse> ArbitrageLPGetWalletHoldNew(LPHoldDr LPObj);
        ArbitrageWithdrawRes ArbitrageWithdraw(ArbitrageWithdrawReq Req,long UserId);
        ListArbitrageTopUpHistory TopUpHistory(int PageNo, int PageSize, string Address, string CoinName, long? FromServiceProviderId, long? ToServiceProviderId, string TrnId, DateTime? FromDate, DateTime? ToDate,long UserId,short? Status);
        Task<string> GetAccWalletID(long WalletID);
        Task<long> GetWalletID(string AccWalletID);
        Task<WalletDrCrResponse> ArbitrageGetReleaseHoldNew(string coinName, string timestamp, decimal amount, string accWalletID, long TrnRefNo, enServiceType serviceType, enWalletTrnType trnType, enTrnType routeTrnType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, string Token = "");
        Task<WalletDrCrResponse> GetArbitrageWalletCreditDrForHoldNewAsyncFinal(CommonClassCrDr firstCurrObj, CommonClassCrDr secondCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);

        AnalyticsGraphRes AnalyticsGraphAPI(string CurrencyName,long UserId);

        FundTransferResponse ArbitrageFundTransafer(FundTransferRequest Reuest,long UserId);
        FundTransferResponse ArbitrageToTradingFundTransafer(FundTransferRequest Reuest,long UserId);

        FundTransferResponse ArbitrageProviderFundTransafer(ProviderFundTransferRequest Reuest,long UserId);

        Task<WalletDrCrResponse> GetLPArbitrageWalletCreditDrForHoldNewAsyncFinal(ArbitrageCommonClassCrDr firstCurrObj, string timestamp, enServiceType serviceType, EnAllowedChannels allowedChannels = EnAllowedChannels.Web, enWalletDeductionType enWalletDeductionType = enWalletDeductionType.Normal);

        ListChargesTypeWise ListArbitrageChargesTypeWise(string WalletTypeName, long? TrnTypeId, long UserId);
    }
}
