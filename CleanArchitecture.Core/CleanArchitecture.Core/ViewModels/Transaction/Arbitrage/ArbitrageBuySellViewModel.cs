using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Transaction.Arbitrage
{
    public class ArbitrageBuySellViewModel
    {
        public short LPType { get; set; }
       // public long RouteID { get; set; }
        public string ProviderName { get; set; }
        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal LTP { get; set; }
        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal Fees { get; set; }
    }
    public class ArbitrageBuySellResponse : BizResponseClass
    {
        public List<ArbitrageBuySellViewModel> Response { get; set; }
    }
}
