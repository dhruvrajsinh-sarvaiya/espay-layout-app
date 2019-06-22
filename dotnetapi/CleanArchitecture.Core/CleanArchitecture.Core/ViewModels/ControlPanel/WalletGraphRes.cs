using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.ControlPanel
{
    public class WalletGraphRes
    {
        public int TotalCount { get; set; }
        public int Month { get; set; }
    }
    public class ListWalletGraphRes : BizResponseClass
    {
        public List<int> TotalCount { get; set; }
        public List<string> Month { get; set; }
    }
    public class TransactionTypewiseCount
    {
        public int TranType { get; set; }
        public int TotalCount { get; set; }
        //public int Month { get; set; }
    }
    public class ListTransactionTypewiseCount : BizResponseClass
    {
        public List<int> TotalCount { get; set; }
        //public List<int> TranType { get; set; }
        public List<string> TypeName { get; set; }
        //public List<string> Month { get; set; }
    }
}
