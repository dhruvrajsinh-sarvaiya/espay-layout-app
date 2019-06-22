using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class UserWalletBlockTrnTypeMaster: BizBase
    {
        //[Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public new long Id { get; set; }

        [Key]
        [Required]
        public long WalletID { get; set; }

        [Key]
        [Required]
        public long WTrnTypeMasterID { get; set; }

        [StringLength(150)]
        public string Remarks { get; set; }

        public void DisableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<UserWalletBlockTrnTypeMaster>(this));
        }

        public void EnableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<UserWalletBlockTrnTypeMaster>(this));
        }
    }
}
