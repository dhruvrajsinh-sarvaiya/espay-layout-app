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
    public class ChargeTypeMaster : BizBase
    {
        //[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        [Required]
        public new long Id { get; set; }

        //[Required]
        //[Key]
        //public long ChargeTypeId { get; set; }

        [Required]
        public string ChargeName { get; set; }      

        public void DisableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<ChargeTypeMaster>(this));
        }

        public void EnableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<ChargeTypeMaster>(this));
        }
    }
}
