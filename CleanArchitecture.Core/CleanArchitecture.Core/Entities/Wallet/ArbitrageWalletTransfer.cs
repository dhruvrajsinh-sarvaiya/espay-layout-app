﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class ArbitrageWalletTransfer : BizBase
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public string CrAccWalletId { get; set; }

        [Required]
        public string DrAccWalletId { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal Amount { get; set; }

        [Required]
        public long WTrnTypeId { get; set; }

        [Required]
        public string CurrencyName { get; set; }

        [Required]
        public string SystemRemarks { get; set; }

        [Required]
        public string UserRemarks { get; set; }
    }
}
