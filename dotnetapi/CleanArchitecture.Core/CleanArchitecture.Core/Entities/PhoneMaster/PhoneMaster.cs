using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.PhoneMaster
{
    public class PhoneMaster : BizBaseExtended
    {
        [Required]
        [StringLength(15)]
        public string Mobilenumber { get; set; }
        [Required]
        public int UserId { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsDeleted { get; set; }
    }
}
