using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class TrnChargeLogRes
    {
        public short Status { get; set; }
        public string StrStatus { get; set; }
        public string BatchNo { get; set; }
        public long TrnNo { get; set; }
        public long TrnTypeID { get; set; }
        public string TrnTypeName { get; set; }
        public decimal Amount { get; set; }
        public string StrAmount { get; set; }
        public decimal Charge { get; set; }
        public long StakingChargeMasterID { get; set; }
        public long ChargeConfigurationDetailID { get; set; }
        public string ChargeConfigurationDetailRemarks { get; set; }
        public string TimeStamp { get; set; }
        public long DWalletID { get; set; }
        public string DAccWalletId { get; set; }
        public string DWalletName { get; set; }
        public long OWalletID { get; set; }
        public string OAccWalletID { get; set; }
        public string OWalletName { get; set; }
        public long DUserID { get; set; }
        public string DUserName { get; set; }
        public string DEmail { get; set; }
        public long OUserID { get; set; }
        public string OUserName { get; set; }
        public string OEmail { get; set; }
        public long WalletTypeID { get; set; }
        public string WalletTypeName { get; set; }
        public short SlabType { get; set; }
        public string SlabTypeName { get; set; }
        public string TrnChargeLogRemarks { get; set; }
        public long ChargeConfigurationMasterID { get; set; }
        public long SpecialChargeConfigurationID { get; set; }
        public string SpecialChargeConfigurationRemarks { get; set; }
        public short Ismaker { get; set; }
        public string StrIsmaker { get; set; }
        public DateTime Date { get; set; }
    }

    public class ListTrnChargeLogRes:BizResponseClass
    {
        public List<TrnChargeLogRes> Data { get; set; }
        public long TotalCount { get; set; }
        public int PageNo { get; set; }
        public long PageSize { get; set; }
    }
}
