using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Affiliate
{
    public class AffiliateLinkClick : BizBase
    {
        [Required]
        public long AffiliateUserId { get; set; } // Reference From AffiliateUserMaster

        [Required]
        public long PromotionTypeId { get; set; } // Reference From AffiliatePromotionMaster
        
        public string LinkDetail { get; set; } 

        public string IPAddress { get; set; } // Uday 22-02-2019 Store IPAddress From Where Link is Click.
    }
}
