using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.SocialProfile
{
    public class GroupMaster : BizBase
    {        
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public ApplicationUser User { get; set; }

        [StringLength(200)]
        public string GroupName { get; set; }

        public ICollection<WatchMaster> WatchMaster { get; set; }
              

        public void DisableGroup()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<GroupMaster>(this));
        }

        public void EnableGroup()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<GroupMaster>(this));
        }

    }
}
