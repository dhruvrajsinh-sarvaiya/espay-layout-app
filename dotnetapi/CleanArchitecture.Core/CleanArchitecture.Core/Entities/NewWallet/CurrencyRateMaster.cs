using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class CurrencyRateMaster : BizBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }

        [Required]
        [Key]
        public long WalletTypeId { get; set; }

        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        [DefaultValue(0)]
        public decimal CurrentRate { get; set; }

        [DefaultValue("USD")]
        public string CurrencyName { get; set; }//2019-02-01
    }


    public class BalanceStatistics : BizBase
    {
        [Required]
        public long UserID { get; set; }

        [Required]
        public long WalletID { get; set; }

        [Required]
        public long WalletTypeID { get; set; }

        [Required]
        public short Year { get; set; }

        [Required]
        public short Month { get; set; }

        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        [DefaultValue(0)]
        public decimal StartingBalance { get; set; }

        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        [DefaultValue(0)]
        public decimal EndingBalance { get; set; }

        //Removed as per the instruction by nupoora mam on 16-01-2019 by -Rushabh
        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //[DefaultValue(0)]
        //public decimal StartingBalanceUSD { get; set; }

        //[Range(0, 9999999999.99999999), DataType(DataType.Currency)]
        //[Column(TypeName = "decimal(18, 8)")]
        //[DefaultValue(0)]
        //public decimal EndingBalanceUSD { get; set; }
    }
}
