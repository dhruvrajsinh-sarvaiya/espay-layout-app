using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class MarginTradingAllowToUser : BizBase
    {
        public long UserId { get; set; }
    }
}
