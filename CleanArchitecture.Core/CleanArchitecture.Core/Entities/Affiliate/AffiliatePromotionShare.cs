using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Affiliate
{
    public class AffiliatePromotionShare : BizBase
    {
        [Required]
        public long AffiliateUserId { get; set; } // Reference From AffiliateUserMaster

        [Required]
        public long PromotionTypeId { get; set; } // Reference From AffiliatePromotionMaster

        public string PromotionDetail { get; set; }
    }
}
