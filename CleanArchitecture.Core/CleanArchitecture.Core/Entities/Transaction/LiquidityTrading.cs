using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class CryptoWatcher
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal LTP { get; set; }
        [Required]
        public string Pair { get; set; }
        [Required]
        public short LPType { get; set; }
    }

    public class CryptoWatcherArbitrage
    {
        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal LTP { get; set; }

        [Required]
        public string Pair { get; set; }

        [Key]
        [Required]
        public short LPType { get; set; }

        [Key]
        public long PairId { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Volume { get; set; }
        
        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal Fees { get; set; }

        [Required]
        [Range(0, 9999999999.999999999999999999), DataType(DataType.Currency)]
        [Column(TypeName = "decimal(28, 18)")]
        public decimal ChangePer { get; set; }

        public short UpDownBit { get; set; }
    }
}
