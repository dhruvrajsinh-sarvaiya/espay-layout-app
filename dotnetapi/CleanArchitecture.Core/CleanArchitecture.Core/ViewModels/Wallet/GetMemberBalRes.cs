using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class GetMemberBalRes:BizResponseClass
    {
        public decimal WalletBalance { get; set; }
        public decimal WalletOutboundBalance { get; set; }
        public decimal WalletInboundBalance { get; set; }
        public long WalletID { get; set; }
    }
}
