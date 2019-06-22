﻿using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class UserConfigurationMapping : BizBaseExtended
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        public Guid ConfigurationMasterId { get; set; }
        public bool IsconfigurationEnable { get; set; }

    }
}
