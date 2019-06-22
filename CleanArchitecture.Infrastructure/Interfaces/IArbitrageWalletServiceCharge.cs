using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.ControlPanel;
using CleanArchitecture.Core.ViewModels.Wallet;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

//Chirag 11-06-2019 Added
namespace CleanArchitecture.Infrastructure.Interfaces
{
    public interface IArbitrageWalletServiceCharge
    {
        BizResponseClass InsertUpdateArbitrageChargeConfigurationMaster(InsertUpdateArbitrageChargeConfigurationMasterReq Req, long UserId);

        ListArbitrageChargeConfigurationMasterRes ListArbitrageChargeConfigurationMaster(long? WalletTypeId, long? SerProId, long? PairID);

        ListProviderWalletLedgerResv1 GetProviderArbitrageWalletLedger(DateTime FromDate, DateTime ToDate, long WalletId, int page, int PageSize);

        ListProviderWalletRes ListProviderWallet(Int16? Status, long? SerProId, string SMSCode);

        ListArbitrageWalletTypeMasterRes ListAllWalletTypeMaster();

        BizResponseClass InsertUpdateArbitrageWalletTypeMaster(InsertUpdateArbitrageWalletTypeMasterReq Req, long UserId);

        BizResponseClass InsertUpdateChargeConfigurationMasterArbitrage(InsertUpdateChargeConfigurationMasterArbitrageReq Req, long UserId);

        ListChargeConfigurationMasterArbitrageRes ListChargeConfigurationMasterArbitrage(long? WalletTypeId);

        Task<BizResponseClass> AddNewChargeConfigurationDetail(ChargeConfigurationDetailArbitrageReq request, long id);

        Task<BizResponseClass> UpdateChargeConfigurationDetail(long detailId, ChargeConfigurationDetailArbitrageReq request, long id);

        Task<ChargeConfigurationDetailArbitrageRes2> GetChargeConfigurationDetail(long detailId);

        Task<ListChargeConfigurationDetailArbitrageRes> ListChargeConfigurationDetail(long? masterId, long? chargeType, short? chargeValueType, short? chargeDistributionBasedOn, short? status);
    }
}
