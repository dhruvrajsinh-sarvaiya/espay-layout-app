using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Affiliate
{
    public class AffiliateSchemeMaster : BizBase
    {
        [Required]
        public string SchemeType { get; set; }

        [Required]
        public string SchemeName { get; set; }
    }
}
