using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.User
{
   public class AllowedIPAddress : BizBaseExtended
    {
        [Required]
        public int UserId { get; set; }
        [Required]
        [StringLength(30)]
        public string FromIPAddress { get; set; }
        [Required]
        [StringLength(30)]
        public string ToIPAddress { get; set; }
    }
}
