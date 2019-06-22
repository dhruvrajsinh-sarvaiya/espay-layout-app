using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class Statastics : BizBase
    {
        //[Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }

        [Key]
        [Required]
        public long TrnType { get; set; }

        [Key]
        [Required]
        public long WalletType { get; set; }

        [Key]
        [Required]
        public long WalletId { get; set; }

        [Key]
        [Required]
        public long UserId { get; set; }

        [Key]
        [Required]
        public long Hour { get; set; }

        [Key]
        [Required]
        public long Day { get; set; }

        [Key]
        [Required]
        public long Week { get; set; }

        [Key]
        [Required]
        public long Month { get; set; }

        [Key]
        [Required]
        public long Year { get; set; }

        [Required]
        public long Count { get; set; }

        [Required]
        public decimal Amount { get; set; }

        //[Required]
        public decimal? USDAmount { get; set; }
    }
}
