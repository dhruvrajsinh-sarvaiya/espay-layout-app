using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.SocialProfile
{
    public class FollowersViewModel : TrackerViewModel
    {
        [Required]
        public long LeaderId { get; set; }
        [Required]
        public long FolowerId { get; set; }
        public bool FllowerStatus { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }
    }
}
