using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class TokenTransferHistory : BizBase
    {
        [Required]
        public string FromAddress { get; set; }
        [Required]
        public string ToAddress { get; set; }
        [Required]
        public decimal Amount { get; set; }

        public string TrnHash { get; set; }

        [Required]
        public string Remarks { get; set; }
    }
}
