using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class WithdrawERCTokenQueue : BizBase
    {
        public long TrnNo { get; set; }
        public string TrnRefNo { get; set; }
        public string AdminAddress { get; set; }
        public long AddressId { get; set; }
    }
}
