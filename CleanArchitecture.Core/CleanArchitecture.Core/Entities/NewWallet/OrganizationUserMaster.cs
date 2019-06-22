using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class OrganizationUserMaster : BizBase
    {
        [Required]       
        public long OrganizationID {get;set;}//pk-query

        [Required]
        [Key]
        public long UserID { get; set; }//pk -query

        [Required]
        [Key]
        public long RoleID { get; set; }

        public void DisableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<OrganizationUserMaster>(this));
        }

        public void EnableService()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<OrganizationUserMaster>(this));
        }
    }
}
