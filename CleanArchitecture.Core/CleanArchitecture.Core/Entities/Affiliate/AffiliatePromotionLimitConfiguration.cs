using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Affiliate
{
    public class AffiliatePromotionLimitConfiguration : BizBase
    {
        public long PromotionType { get; set; }
        public long HourlyLimit { get; set; }
        public long DailyLimit { get; set; }
    }
}
