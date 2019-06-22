using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.SharedKernel;

namespace CleanArchitecture.Core.MarginEntitiesWallet
{
    public class MarginWalletLedger : BizBase
    {
        [Required]
        public long WalletId { get; set;} // fk of walletmaster table

        [Required]
        public long ToWalletId { get; set; }

        [Required]
        public DateTime TrnDate { get; set; }

        [Required]
        public enServiceType ServiceTypeID { get; set; } // fk of ServiceTypeMaster table

        [Required]
        public enWalletTrnType TrnType { get; set; } // type of txn

        [Required]
        public long TrnNo { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal CrAmt { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal DrAmt { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal PreBal { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal PostBal { get; set; }

        [Required]
        [StringLength(100)]
        public string Remarks { get; set; }

        //ntrivedi added 30-11-2018
        [Required]
        [DefaultValue(1)]      
        public enBalanceType Type { get; set; }

        public MarginWalletLedger() // adding default balance type 11-12-2018
        {
            Type = enBalanceType.AvailableBalance;
        }
    }
}
