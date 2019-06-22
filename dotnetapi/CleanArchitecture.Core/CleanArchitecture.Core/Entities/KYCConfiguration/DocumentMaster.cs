using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.KYCConfiguration
{
 public   class DocumentMaster : BizBaseExtended
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }
    }
}
