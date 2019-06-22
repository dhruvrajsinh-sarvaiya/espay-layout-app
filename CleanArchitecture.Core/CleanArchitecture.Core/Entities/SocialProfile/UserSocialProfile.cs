using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.Events;
using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CleanArchitecture.Core.Entities.SocialProfile
{
    public class UserSocialProfile : BizBase
    {
        [Required]
        public int UserId { get; set; }

        //[ForeignKey("UserId")]
        //public ApplicationUser User { get; set; }

        [Required]
        [StringLength(10)]
        public string ProfileRole { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }


        public void SetEnableStatus()
        {
            IsEnable = false;
            Events.Add(new ServiceStatusEvent<UserSocialProfile>(this));
        }
        public void SetDisableStatus()
        {
            IsEnable = true;
            Events.Add(new ServiceStatusEvent<UserSocialProfile>(this));
        }


        public void SetUnDeleteStatus()
        {
            IsDeleted = false;
            Events.Add(new ServiceStatusEvent<UserSocialProfile>(this));
        }
        public void SetDeleteStatus()
        {
            IsDeleted = true;
            Events.Add(new ServiceStatusEvent<UserSocialProfile>(this));
        }
    }
}
