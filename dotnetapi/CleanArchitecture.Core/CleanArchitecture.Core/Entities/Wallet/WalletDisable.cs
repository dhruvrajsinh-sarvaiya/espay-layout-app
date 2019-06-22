using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class WalletDisable : BizBase
    {
        public long WalletID { get; set; }
        public decimal Balance { get; set; }
        public decimal TABalance { get; set; }
        [StringLength(50)]
        public string Remarks { get; set; }
    }

    public class LPArbitrageWalletDisable : BizBase
    {
        public long WalletID { get; set; }
        public decimal Balance { get; set; }
        [StringLength(100)]
        public string Remarks { get; set; }
        public long EnabedBy { get; set; }
        public DateTime EnabedDate { get; set; }
        [StringLength(100)]
        public String EnabledRemarks { get; set; }
    }
}
