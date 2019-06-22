using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Backoffice
{/// <summary>
/// Created by pankaj for create the table for iprange data 
/// this table mainly use the valid the ip check in particular range    
/// </summary>
   public class IPRange : BizBaseExtended
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(20)]
        public string StartIp { get; set; }

        [Required]
        [StringLength(20)]
        public string EndIp { get; set; }
    }
}
