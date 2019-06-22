using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class ProviderWalletTypeMapping : BizBase
    {
        [Required]
        public long WalletTypeId { get; set; }

        [Required]
        public long ServiceProviderId { get; set; }
    }
}
