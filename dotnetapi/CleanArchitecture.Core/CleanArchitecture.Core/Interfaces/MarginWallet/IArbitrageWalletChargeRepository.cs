using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.MarginWallet
{
    public interface IArbitrageWalletChargeRepository
    {
        List<ArbitrageChargeConfigurationMasterRes> ListArbitrageChargeConfigurationMaster(long? WalletTypeId, long? SerProId, long? PairID);

        List<ProviderWalletLedgerRes> GetArbitrageProviderWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize, ref int TotalCount);

        List<ProviderWalletRes> ListProviderWallet(Int16? Status, long? SerProId, string SMSCode);

        List<ChargeConfigurationMasterArbitrageRes> ListChargeConfigurationMasterArbitrage(long? WalletTypeId);

        ChargeConfigurationDetailArbitrageRes GetChargeConfigDetailbyId(long detailID);

        List<ChargeConfigurationDetailArbitrageRes> GetChargeConfigDetailList(long? masterId, long? chargeType, short? chargeValueType, short? chargeDistributionBasedOn, short? status);
    }
}
