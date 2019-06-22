using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class DepositionInterval : BizBase
    {
        public long DepositHistoryFetchListInterval { get; set; }
        public long DepositStatusCheckInterval { get; set; }
    }
}
