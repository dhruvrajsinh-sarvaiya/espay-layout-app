using CleanArchitecture.Core.Entities.SocialProfile;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
   public class ProfileConfiguration : BizBase
    {
        [Required]
        [StringLength(200)]
        public string ConfigType { get; set; }

        [Required]
        [StringLength(250)]
        public string ConfigKey { get; set; }

        [Required]
        [StringLength(250)]
        public string ConfigValue { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }

       // public ICollection<UserProfileConfig> UserProfileConfig{ get; set; }

        public void SetEnableStatus()
        {
            IsEnable = false;
            Events.Add(new ServiceStatusEvent<ProfileConfiguration>(this));
        }
        public void SetDisableStatus()
        {
            IsEnable = true;
            Events.Add(new ServiceStatusEvent<ProfileConfiguration>(this));
        }


        public void SetUnDeleteStatus()
        {
            IsDeleted = false;
            Events.Add(new ServiceStatusEvent<ProfileConfiguration>(this));
        }
        public void SetDeleteStatus()
        {
            IsDeleted = true;
            Events.Add(new ServiceStatusEvent<ProfileConfiguration>(this));
        }
    }
}
