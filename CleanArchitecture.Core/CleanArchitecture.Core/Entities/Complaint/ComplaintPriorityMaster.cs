using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Complaint
{
    public class ComplaintPriorityMaster : BizBase
    {
        [Required]
        [StringLength(50)]
        public string Priority { get; set; }
        [Required]
        [StringLength(50)]
        public string PriorityTime { get; set; }
    }
}
