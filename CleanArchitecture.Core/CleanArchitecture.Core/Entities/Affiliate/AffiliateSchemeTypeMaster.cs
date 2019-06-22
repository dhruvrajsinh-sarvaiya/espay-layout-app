using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Affiliate
{
    public class AffiliateSchemeTypeMaster : BizBase
    {
        [Required]
        public string SchemeTypeName { get; set; }

        public string Description { get; set; }
    }
}
