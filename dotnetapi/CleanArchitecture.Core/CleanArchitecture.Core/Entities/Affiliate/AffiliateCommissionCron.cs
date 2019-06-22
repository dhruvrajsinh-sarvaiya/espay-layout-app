using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Affiliate
{
    public class AffiliateCommissionCron : BizBase
    {
        public long SchemeMappingId { get; set; }
        public string Remarks { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
