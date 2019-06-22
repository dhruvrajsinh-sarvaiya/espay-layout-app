using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Wallet
{
    public class DepositHistoryResponse : BizResponseClass
    {
       public List<DepoHistoryObject> Histories { get; set; }
    }
    public class WithdrawHistoryResponse : BizResponseClass
    {
        public List<HistoryObject> Histories { get; set; }
    }
    public class WithdrawHistoryNewResponse : BizResponseClass
    {
        //Uday 15-01-2019 Add new Parameter create new class becuase old class use in multiple place
        public List<WithdrawHistoryObject> Histories { get; set; }
    }
}
