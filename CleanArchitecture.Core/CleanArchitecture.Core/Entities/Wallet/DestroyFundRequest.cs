using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class DestroyFundRequest : BizBase
    {
        [Required]
        public string Address { get; set; }
        [Required]
        public string Remarks { get; set; }

        public string TrnHash { get; set; }
    }
}
