﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class BeneficiaryMaster : BizBase
    {
        [Required]
        public long UserID { get; set; }
        [Required]
        public string Address { get; set; }
        public string Name { get; set; }
        [Required]
        public long WalletTypeID { get; set; }
        public short IsWhiteListed { get; set; }
    }
}
