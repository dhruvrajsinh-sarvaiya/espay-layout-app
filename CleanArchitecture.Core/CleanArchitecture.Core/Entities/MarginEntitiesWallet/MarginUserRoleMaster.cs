using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.MarginEntitiesWallet
{
    public class MarginUserRoleMaster : BizBase
    {
        [Required]
        [StringLength(20)]
        public string RoleName { get; set; }

        [Required]
        [StringLength(20)]
        public string RoleType { get; set; }

        public void DisableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<MarginUserRoleMaster>(this));
        }

        public void EnableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<MarginUserRoleMaster>(this));
        }
    }

    
}
