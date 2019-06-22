using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate
{
    public class GetAffiliatePromotionTypeResponse : BizResponseClass
    {
        public List<AffiliatePromotionTypeResponse> Response { get; set; }
    }

    public class AffiliatePromotionTypeResponse
    {
        public long Id { get; set; }
        public string PromotionType { get; set; }
    }
}
