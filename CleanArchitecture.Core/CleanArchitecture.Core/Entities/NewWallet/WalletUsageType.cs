using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class WalletUsageType :BizBase
    {
        [Key]
        [Required]
        public new long Id { get; set; }

        [Required]
        public string WalletUsageTypeName { get; set; }
    }
}
