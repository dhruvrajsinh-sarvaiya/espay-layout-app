using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.MarginEntitiesWallet
{
    public class MarginSpecialChargeConfiguration : BizBase
    {
        [Required]
        public DateTime TrnDate { get; set; }

        public string Remarks { get; set; }//(Diwali,Holi)
    }
}
