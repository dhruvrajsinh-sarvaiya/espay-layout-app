using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.Enums;


namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class LPCharge : BizBase
    {
        public long WalletID {get; set;}

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal ChargeValue { get; set; }

        public EnInterestType ChargeType { get; set; }

    }

    public class LPWalletMismatch : BizBase
    {
        public long WalletID { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal TPBalance { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal SystemBalance { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal MismatchaingAmount { get; set; }

        public long ResolvedBy { get; set; }

        public DateTime ResolvedDate { get; set; }

        [StringLength(150)]
        public string ResolvedRemarks { get; set; }
    }

    public class LPArbitrageWalletMismatch : BizBase
    {
        public long WalletID { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal TPBalance { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal SystemBalance { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal MismatchaingAmount { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal SettledAmount { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal ProviderBalance { get; set; } //taken in input

        public long ResolvedBy { get; set; }

        public DateTime ResolvedDate { get; set; }

        [StringLength(150)]
        public string ResolvedRemarks { get; set; }
    }
}
