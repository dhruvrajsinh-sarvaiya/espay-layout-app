using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.EmailMaster
{
    public class EmailMaster : BizBaseExtended
    {
        [Required]
        [StringLength(50)]
        public string Email { get; set; }
        [Required]
        public int UserId { get; set; }
        public bool IsPrimary { get; set; }
        public bool IsDeleted { get; set; }

    }
}
