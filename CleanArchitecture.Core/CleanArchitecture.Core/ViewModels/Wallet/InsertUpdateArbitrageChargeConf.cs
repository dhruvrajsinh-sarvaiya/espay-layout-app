using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.MarginEntitiesWallet;
using CleanArchitecture.Core.MarginEntitiesWallet;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

//Chirag 11-06-2019 Added
namespace CleanArchitecture.Core.ViewModels.Wallet
{
    class InsertUpdateArbitrageChargeConf
    {
    }

    public class InsertUpdateArbitrageChargeConfigurationMasterReq
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17086")]
        public long WalletTypeId { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public long PairID { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public long SerProID { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public long TrnType { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short KYCComplaint { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short Status { get; set; }

        public string Remarks { get; set; }
    }

    public class InsertUpdateChargeConfigurationMasterArbitrageReq
    {
        public long Id { get; set; }

        public long WalletTypeId { get; set; }

        public long TrnType { get; set; }

        public short KYCComplaint { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short Status { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short SlabType { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17086")]
        public long SpecialChargeConfigurationID { get; set; }

        public string Remarks { get; set; }
    }

    public class ListArbitrageChargeConfigurationMasterRes : BizResponseClass
    {
        public List<ArbitrageChargeConfigurationMasterRes> Data { get; set; }
    }

    public class ListChargeConfigurationMasterArbitrageRes : BizResponseClass
    {
        public List<ChargeConfigurationMasterArbitrageRes> Data { get; set; }
    }

    public class ChargeConfigurationMasterArbitrageRes
    {
        public Int64 Id { get; set; }
        public Int16 Status { get; set; }
        public string StrStatus { get; set; }
        public Int64 WalletTypeID { get; set; }
        public string WalletTypeName { get; set; }
        public Int64 TrnType { get; set; }
        public string TrnTypeName { get; set; }
        public Int16 KYCComplaint { get; set; }
        public Int16 SlabType { get; set; }
        public string SlabTypeName { get; set; }
        public Int64 SpecialChargeConfigurationID { get; set; }
        public string Remarks { get; set; }
    }

    public class ArbitrageChargeConfigurationMasterRes
    {
        public Int64 Id { get; set; }
        public Int16 Status { get; set; }
        public string StrStatus { get; set; }
        public Int64 WalletTypeID { get; set; }
        public string WalletTypeName { get; set; }
        public Int64 PairID { get; set; }
        public string PairName { get; set; }
        public Int64 SerProID { get; set; }
        public string ProviderName { get; set; }
        public Int64 TrnType { get; set; }
        public string TrnTypeName { get; set; }
        public Int16 KYCComplaint { get; set; }
        public string Remarks { get; set; }
    }

    public class ListProviderWalletLedgerResv1 : BizResponseClass
    {
        public List<ProviderWalletLedgerRes> ProviderWalletLedgers { get; set; }
        public long TotalCount { get; set; }
        public long PageSize { get; set; }
        public long PageNo { get; set; }
    }

    public class ProviderWalletLedgerRes
    {
        public long LedgerId { get; set; }

        public decimal PreBal { get; set; }

        public decimal PostBal { get; set; }

        public decimal CrAmount { get; set; }

        public decimal DrAmount { get; set; }

        public string Remarks { get; set; }

        public decimal Amount { get; set; }

        public DateTime TrnDate { get; set; }
    }

    public class ListProviderWalletRes : BizResponseClass
    {
        public List<ProviderWalletRes> Data { get; set; }
    }

    public class ProviderWalletRes
    {
        public Int64 WalletTypeID { get; set; }
        public string WalletTypeIDName { get; set; }
        public string WalletName { get; set; }
        public Guid AccWalletID { get; set; }
        public decimal Balance { get; set; }
        public decimal OutBoundBalance { get; set; }
        public decimal InBoundBalance { get; set; }
        public Int64 SerProId { get; set; }
        public string SerProIdName { get; set; }
        public Int16 Status { get; set; }
        public string StrStatus { get; set; }
    }

    public class ListArbitrageWalletTypeMasterRes : BizResponseClass
    {
        public IEnumerable<ArbitrageWalletTypeMaster> ArbitrageWalletTypeMasters { get; set; }
    }

    public class InsertUpdateArbitrageWalletTypeMasterReq
    {
        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public long Id { get; set; }

        public string WalletTypeName { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public string Description { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short IsDepositionAllow { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short IsWithdrawalAllow { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short IsTransactionWallet { get; set; }

        public short IsDefaultWallet { get; set; }

        public short ConfirmationCount { get; set; }

        public short IsLocal { get; set; }

        public Int64 CurrencyTypeID { get; set; }

        public short IsLeaverageAllow { get; set; }

        [Required(ErrorMessage = "1,Please enter Required Param,17085")]
        public short Status { get; set; }
    }
}
