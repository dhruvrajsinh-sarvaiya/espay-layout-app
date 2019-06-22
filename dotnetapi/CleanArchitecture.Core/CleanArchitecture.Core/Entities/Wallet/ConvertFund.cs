﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class ConvertFundHistory : BizBase
    {
        [Required]
        public long FromWalletId { get; set; }

        [Required]
        public long ToWalletId { get; set; }

        //[Required]
        //public long  SourceWalletTypeId{get;set;}

        //[Required]
        //public long  DestinationWalletTypeId{get;set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal DestinationPrice { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal SourcePrice { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Price { get; set; }

        [Required]
        public DateTime TrnDate { get; set; }
    }
}
