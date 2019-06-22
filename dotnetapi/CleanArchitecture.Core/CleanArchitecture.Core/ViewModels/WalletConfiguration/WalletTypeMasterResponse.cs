using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities;
using CleanArchitecture.Core.MarginEntitiesWallet;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.WalletConfiguration
{
    public class WalletTypeMasterResponse:BizResponseClass
    {
        public WalletTypeMaster walletTypeMaster { get; set; }
    }
    public class MarginWalletTypeMasterResponse : BizResponseClass
    {
        public MarginWalletTypeMaster walletTypeMaster { get; set; }
    }
}
