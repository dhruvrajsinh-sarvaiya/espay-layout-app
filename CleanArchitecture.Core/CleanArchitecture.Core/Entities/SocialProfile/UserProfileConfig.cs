using CleanArchitecture.Core.Entities.Configuration;
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
   public class UserProfileConfig : BizBase
    {
        [Required]
        public int UserId { get; set; }
        //[ForeignKey("UserId")]
        //public ApplicationUser User { get; set; }

        public long LeaderId { get; set; }

        [Required]
        public long ProfileConfigId { get; set; }

        //[ForeignKey("ProfileConfigId")]
        //public ProfileConfiguration ProfileConfiguration { get; set; }

        [Required]
        [StringLength(250)]
        public string ConfigValue { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }


       

        public void SetEnableStatus()
        {
            Status = Convert.ToInt16(ServiceStatus.Active);
            Events.Add(new ServiceStatusEvent<UserProfileConfig>(this));
        }
        public void SetDisableStatus()
        {
            Status = Convert.ToInt16(ServiceStatus.Disable);
            Events.Add(new ServiceStatusEvent<UserProfileConfig>(this));
        }


        public void SetUnDeleteStatus()
        {
            Status = Convert.ToInt16(ServiceStatus.InActive);
            Events.Add(new ServiceStatusEvent<UserProfileConfig>(this));
        }
        //public void SetDeleteStatus()
        //{
        //    IsDeleted = true;
        //    Events.Add(new ServiceStatusEvent<UserProfileConfig>(this));
        //}
    }
}
