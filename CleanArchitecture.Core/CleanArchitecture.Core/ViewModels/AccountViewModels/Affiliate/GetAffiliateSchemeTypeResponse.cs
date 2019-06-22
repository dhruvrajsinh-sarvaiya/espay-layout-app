using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate
{
    public class GetAffiliateSchemeTypeResponse : BizResponseClass
    {
        public List<AffiliateSchemeTypeResponseData> Response { get; set; }
    }

    public class AffiliateSchemeTypeResponseData
    {
        public long Id { get; set; }
        public string Value { get; set; }
    }
}
