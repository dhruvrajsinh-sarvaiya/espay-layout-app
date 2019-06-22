using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.Wallet
{
    public class MarginDepositCounterMaster : BizBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }
        public int RecordCount { get; set; }
        public long Limit { get; set; }
        public string LastTrnID { get; set; }
        public long MaxLimit { get; set; }
        [Key]
        public long WalletTypeID { get; set; }
        [Key]
        public long SerProId { get; set; }
        public string PreviousTrnID { get; set; }
        public string prevIterationID { get; set; }

        public long TPSPickupStatus { get; set; }
        public int AppType { get; set; } //Uday 04-02-2019  In Deposit App Check Provider
        // public long AutoNo { get; set; }
        // public DateTime UpdateDate { get; set; }
        // public int DeliveryRowsCount { get; set; }
        //  public int ValidDays { get; set; }
    }
}
