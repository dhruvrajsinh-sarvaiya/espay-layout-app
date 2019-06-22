using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class StatasticsDetail : BizBase
    {
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        //public new long Id { get; set; }
                
        [Required]
        public long StatasticsId { get; set; }

        [Required]
        [StringLength(50)]
        public string EntityName { get; set; }

        [Required]
        public string TrnNo { get; set; }

        [Required]
        public long Type { get; set; } //1-credit, 2-debit

        [Required]
        public decimal Amount { get; set; }

       // [Required]
        public DateTime? USDLastUpdateDateTime { get; set; }

        //[Required]
        public decimal? USDAmount { get; set; }
    }
}
