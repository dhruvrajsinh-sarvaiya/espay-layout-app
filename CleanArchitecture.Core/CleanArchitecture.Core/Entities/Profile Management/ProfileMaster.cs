﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Profile_Management
{
    public class ProfileMaster : BizBase
    {
        public long TypeId { get; set; }

        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal ProfileFree { get; set; }

        [StringLength(2000)]
        [Required]
        public string Description { get; set; }

        public int KYCLevel { get; set; }

        [StringLength(150)]
        [Required]
        public string LevelName { get; set; }

        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal DepositFee { get; set; }

        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal Withdrawalfee { get; set; }

        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal Tradingfee { get; set; }

        //[Range(0, 9999999999.99999999), Column(TypeName = "decimal(18, 8)")]
        //public decimal WithdrawalLimit { get; set; }

        public long Profilelevel { get; set; }

        public bool IsProfileExpiry { get; set; }

        [StringLength(2000)]       
        public string TransactionLimit { get; set; }

        [StringLength(2000)]
        public string WithdrawalLimit { get; set; }

        [StringLength(2000)]
        public string TradeLimit { get; set; }

        [StringLength(2000)]
        public string DepositLimit { get; set; }

        [Range(0, 9999999999.999999999999999999), Column(TypeName = "decimal(28, 18)")]
        public decimal SubscriptionAmount { get; set; }

        public bool IsRecursive { get; set; }

        //public bool EnableStatus { get; set; }
    }
}
