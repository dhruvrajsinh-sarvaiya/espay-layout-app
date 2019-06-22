using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Profile_Management
{
    public class ProfileLevelMaster : BizBase
    {
        [Required]
        [StringLength(250)]
        public string ProfileName { get; set; }
    }
}
