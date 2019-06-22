using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.User
{
   public class SecurityQuestionMaster : BizBaseExtended
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        [StringLength(200)]
        public string SecurityQuestion { get; set; }
        [Required]
        [StringLength(200)]
        public string Answer { get; set; }
    }
}
