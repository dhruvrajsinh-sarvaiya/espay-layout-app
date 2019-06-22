using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class DepositionRecon : BizBase
    {
        [Required]
        public long TrnNo { get; set; }

        [Required]
        public long TrnRefNo { get; set; }

        [Required]
        public short OldStatus { get; set; }

        [Required]
        public short NewStatus { get; set; }

        [Required]
        public short ActionType { get; set; }

        [StringLength(250)]
        public string Remarks { get; set; }

        public short ReconBy { get; set; }

        public DateTime ReconDate { get; set; }
    }
}
