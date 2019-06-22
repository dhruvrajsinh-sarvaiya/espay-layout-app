using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Transaction
{
    public class TradingConfiguration : BizBase
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }
    }
}
