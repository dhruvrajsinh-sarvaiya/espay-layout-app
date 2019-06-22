using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
  public  class CronMaster : BizBase
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

    }
}
