using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class ListAllBalanceTypeWiseRes
    {
        public List<AllBalanceTypeWiseRes> Wallets { get; set; }
        public BizResponseClass BizResponseObj { get; set; }
    }
    public class AllBalanceTypeWiseRes
    {
        public WalletResponse Wallet { get; set; }
        //public WalletMasterResponse Wallet { get; set; }
        //public Balance Balance { get; set; }        
    }
    public class WalletResponse
    {
        public string WalletName { get; set; }
        public string TypeName { get; set; }
        public string AccWalletID { get; set; }
        public string PublicAddress { get; set; }
        public byte IsDefaultWallet { get; set; }
        public Balance Balance { get; set; }
    }

    public class ListChargesTypeWise : BizResponseClass
    {
        public List<ChargeWalletType> Data { get; set; }
    }
    public class ChargesTypeWise
    {
        public string TrnTypeName { get; set; }
        public long TrnTypeId { get; set; }
        public string DeductWalletTypeName { get; set; }
        public decimal ChargeValue { get; set; }
        public decimal MakerCharge { get; set; }
        public decimal TakerCharge { get; set; }
    }
    public class WalletType
    {
        public long WalletTypeId { get; set; }
        public string WalletTypeName { get; set; }
        // public List<ChargesTypeWise> Data { get; set; }
    }
    public class ChargeWalletType
    {
        public string WalletTypeName { get; set; }
        public long WalletTypeId { get; set; }
        public List<ChargesTypeWise> Charges { get; set; }
    }
    public class TrnType
    {
        public List<Charge> Charges { get; set; }
    }
    public class Charge
    {
        public decimal MakerCharge { get; set; }
        public decimal TakerCharge { get; set; }
    }
    public class LeveragePairDetail
    {
        public decimal Amount { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public decimal Leverage { get; set; }
        public decimal LeverageCharge { get; set; }
        public int IsLeverageTaken { get; set; }
    }

    public class PositionValue
    {
        public decimal BidPrice { get; set; }
        public decimal Qty { get; set; }
        public decimal LandingPrice { get; set; }
        public decimal BuyBidPrice { get; set; }
        public decimal BuyQty { get; set; }
        public decimal BuyLandingPrice { get; set; }
        public decimal SellBidPrice { get; set; }
        public decimal SellQty { get; set; }
        public decimal SellLandingPrice { get; set; }
    }


}
