﻿using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class StackingBalanceRes
    {
        public decimal StackingAmount { get; set; }
        public decimal MaxLimitAmount { get; set; }
        public decimal MinLimitAmount { get; set; }
        public long WalletId { get; set; }
        public string WalletType { get; set; }
    }
    public class ListStackingBalanceRes
    {
        public List<StackingBalanceRes> Response { get; set; }
        public BizResponseClass BizResponseObj { get; set; }
    }
}
