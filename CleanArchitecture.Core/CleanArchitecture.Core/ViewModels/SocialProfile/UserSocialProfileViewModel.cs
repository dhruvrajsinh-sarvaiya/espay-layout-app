using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.SocialProfile
{
   public class UserSocialProfileViewModel : TrackerViewModel
    {

        [Required]
        public int UserId { get; set; }
        [Required]
        [StringLength(10)]
        public string ProfileRole { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }

    }
}
