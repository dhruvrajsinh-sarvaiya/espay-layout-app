using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using Newtonsoft.Json;

namespace CleanArchitecture.Core.Entities
{
    public class WalletTypeMaster : BizBase
    {        
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }

        [Required]
        [Key]
        [StringLength(7)]
        [JsonProperty(PropertyName = "CoinName")]
        public string WalletTypeName { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }

        [Required]
        public short IsDepositionAllow { get; set; }

        [Required]
        public short IsWithdrawalAllow { get; set; }

        [Required]
        public short IsTransactionWallet { get; set; }

        
        public short? IsDefaultWallet { get; set; }

        public short? ConfirmationCount { get; set; }

        public short? IsLocal { get; set; }//add for Call ERC-20 API

        public void DisableStatus()
        {
            Status  = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new WalletStatusDisable<WalletTypeMaster>(this));
        }
                
        public long CurrencyTypeID { get; set; }
    }
   
}
