using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class TradingChargeTypeMaster:BizBase
    {
        [Required]
        public short Type { get; set; }

        [Required]
        public string TypeName { get; set; }
    }
}
