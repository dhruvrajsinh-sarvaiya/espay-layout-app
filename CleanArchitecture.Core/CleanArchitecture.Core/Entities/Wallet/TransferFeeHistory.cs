using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class TransferFeeHistory : BizBase
    {
        [Required]
        public long WalletTypeId { get; set; }

        [Required]
        public string ContractAddress { get; set; }

        [Required]        
        public int BasePoint { get; set; }

        [Required]        
        public int Maxfee { get; set; }

        [Required]        
        public int Minfee { get; set; }

        [StringLength(150)]
        [Required]
        public string Remarks { get; set; }

        public string TrnHash { get; set; }
    }
}
