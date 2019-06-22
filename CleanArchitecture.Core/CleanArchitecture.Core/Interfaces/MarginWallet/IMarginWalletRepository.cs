using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.MarginEntitiesWallet;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.MarginWallet
{
    public interface IMarginWalletRepository
    {
        List<MarginWalletMasterRes> ListMarginWalletMaster(long? WalletTypeId, EnWalletUsageType? WalletUsageType, short? Status, string AccWalletId, long? UserId);

        List<MarginWalletMasterRes2> ListMarginWallet(int PageNo, int PageSize,long? WalletTypeId, EnWalletUsageType? WalletUsageType, short? Status, string AccWalletId, long? UserId, ref int TotalCount);

        List<MarginWalletByUserIdRes> GetMarginWalletByUserId(long UserId);

        Task<bool> CheckTrnIDDrForHoldAsync(MarginCommonClassCrDr arryTrnID);

        Task<bool> CheckTrnIDDrForMarketAsync(MarginCommonClassCrDr arryTrnID);

        void ReloadEntity(MarginWalletMaster wm1, MarginWalletMaster wm2, MarginWalletMaster wm3, MarginWalletMaster wm4);

        List<LeaverageReport> LeverageRequestReport(long? WalletTypeId,long UserId, DateTime? FromDate, DateTime? ToDate, int PageNo, int PageSize, short? Status, ref int TotalCount);


        List<LeaverageReportRes> LeveragePendingReport(long? WalletTypeId, long? UserId, DateTime? FromDate, DateTime? ToDate, int PageNo, int PageSize, ref int TotalCount);

        List<LeaverageReport> LeverageReport(long? WalletTypeId, long? UserId, DateTime FromDate, DateTime ToDate, int PageNo, int PageSize, short? Status, ref int TotalCount);

        Task<List<LeverageRes>> ListLeverage(long? WalletTypeId, short? Status);

        List<ChargesTypeWise> ListMarginChargesTypeWise(long WalletTypeId, long? TrntypeId);

        List<WalletType> GetMarginChargeWalletType(long? WalletTypeId);

        List<TrnChargeLogRes> MarginTrnChargeLogReport(int PageNo, int PageSize, short? Status, long? TrnTypeID, long? WalleTypeId, short? SlabType, DateTime? FromDate, DateTime? ToDate, long? TrnNo, ref long TotalCount);

        decimal FindChargeValueHold(string Timestamp, long TrnRefNo);

        decimal FindChargeValueDeduct(string Timestamp, long TrnRefNo);

        decimal FindChargeValueRelease(string Timestamp, long TrnRefNo);

        long FindChargeValueWalletId(string Timestamp, long TrnRefNo);

        List<WalletLedgerRes> GetMarginWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount);

        //ntrivedi 05-03-2019 added
        LeveragePairDetail GetPairLeverageDetail(long WalletID);

        Task<List<LeverageRes>> ListLeverageBaseCurrency(long? WalletTypeId, short? Status);

        PositionValue GetPositionDetailValue(long OpenPositionMasterID); //ntrivedi added 04-03-2019

        OpenPositionMaster GetPositionMasterValue(long PairID, long UserID); //ntrivedi added 04-03-2019
        List<PNLAccount> GetProfitNLossData(long? pairId, string currencyName, long id);
        List<OpenPosition> GetOpenPosition(long pairId, long userid);
        OpenPositionMaster GetPositionOpenInOtherPair(long PairID, long UserID);//Rita 26-4-18 for check open position on other pair , open by site token conversion 

        OpenPositionMaster GetPairPositionMasterValue(long UserID); //ntrivedi for settle 01-05-2019

        //khushali 11-04-2019 Process for Release Stuck Order - wallet side   
        enTransactionStatus CheckTransactionSuccessOrNot(long TrnRefNo);
        bool CheckSettlementProceed(long MakerTrnNo, long TakerTrnNo);        
    }

    public interface ILPWalletRepository //ntrivedi for Liquidity provider 28-05-2019
    {

    }

    public interface IArbitrageWalletRepository //ntrivedi for Liquidity provider 28-05-2019
    {
        List<ArbitrageWalletMasterRes> ListArbitrageWallet(long? WalletTypeId, short? WalletUsageType, short? Status, string AccWalletId, long? UserId);

        List<WalletLedgerRes> GetArbitrageWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount);

        List<ArbitrageAddressRes> ListArbitrageAddress(string Address, long? WalletTypeId, long? ServiceProviderId);

        void ReloadEntity(ArbitrageWalletMaster wm1, ArbitrageWalletMaster wm2, ArbitrageWalletMaster wm3, ArbitrageWalletMaster wm4);

        Task<bool> CheckTrnIDDrForHoldAsync(CommonClassCrDr arryTrnID);

        Task<List<ArbitrageTransactionProviderResponse>> ArbitrageGetProviderDataList(ArbitrageTransactionApiConfigurationRequest Request);

        ListArbitrageTopUpHistory TopUpHistory(int PageNo, int PageSize,long userid,short? Status, string Address, string CoinName, long? FromServiceProviderId, long? ToServiceProviderId, string TrnId, DateTime? FromDate, DateTime? ToDate, ref int TotalCount);

        void ReloadEntitySingle(ArbitrageWalletMaster wm1, LPArbitrageWalletMaster wm2);

        AnalyticsGraphRes AnalyticsGraphAPI(string CurrencyName, long UserId);

        Task<bool> CheckTrnIDDrForMarketAsync(CommonClassCrDr arryTrnID);

        long FindChargeValueWalletId(string Timestamp, long TrnRefNo);//ntrivedi 19-06-2019
        decimal FindChargeValueHold(string Timestamp, long TrnRefNo);//ntrivedi 19-06-2019
        decimal FindChargeValueDeduct(string Timestamp, long TrnRefNo);//ntrivedi 19-06-2019
    }

}
