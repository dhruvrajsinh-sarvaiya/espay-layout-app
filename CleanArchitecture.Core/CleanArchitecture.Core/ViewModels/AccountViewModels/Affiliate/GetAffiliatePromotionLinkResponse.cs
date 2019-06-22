using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate
{
    public class GetAffiliatePromotionLinkResponse : BizResponseClass
    {
        public dynamic Response { get; set; }
    }

    public class AffiliateAvailablePromotionLinkData
    {
        public short Status { get; set; }
        public string PromotionLink { get; set; }
    }

    public class AffiliateAvailablePromotionLink
    {
        public long PromotionTypeId { get; set; }
        public string PromotionType { get; set; }
        public string PromotionLink { get; set; }
        public short PromotionStatus { get; set; }
    }
}
