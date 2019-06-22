using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class SumAmount
    {
        public decimal DifferenceAmount { get; set; }
    }
    public class GetCount
    {
        public int Count { get; set; }
    }

    public class TQTrnAmt
    {
        public decimal DifferenceAmount { get; set; }
        public long TrnNo { get; set; }

    }
}
