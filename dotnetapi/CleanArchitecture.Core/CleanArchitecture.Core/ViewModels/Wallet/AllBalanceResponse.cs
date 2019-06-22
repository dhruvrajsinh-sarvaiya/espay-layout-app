﻿using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class AllBalanceResponse
    {
        public Balance Balance { get; set; }
        public string WalletType { get; set; }
        public string WalletName { get; set; }
        public byte IsDefaultWallet { get; set; }
        public decimal WithdrawalDailyLimit { get; set; }
        public BizResponseClass BizResponseObj { get; set; }
    }
    public class Balance
    {
        public decimal UnSettledBalance { get; set; }
        public decimal UnClearedBalance { get; set; }
        public decimal AvailableBalance { get; set; }
        public decimal ShadowBalance { get; set; }
        public decimal StackingBalance { get; set; }
    }

    public class BalanceTotal
    {
        public decimal TotalBalance { get; set; }
    }
    public class ChargeWalletId
    {
        public long Id { get; set; }
    }

    public class ChargeCurrency
    {
        public string Name { get; set; }
    }

}
