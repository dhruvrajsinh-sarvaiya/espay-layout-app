using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.SocialProfile
{
    public class UserProfileConfigViewModel : TrackerViewModel
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public long ProfileConfigId { get; set; }
        [Required]
        [StringLength(250)]
        public string ConfigValue { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }
    }
}
