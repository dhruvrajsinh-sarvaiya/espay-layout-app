using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class TransactionMarketType : BizBase
    {
        public string MarketName { get; set; }
        public Boolean AllowForFollowers { get; set; }
    }
}
