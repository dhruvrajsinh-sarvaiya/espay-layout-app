using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Complaint
{
    public class ComplainStatusTypeMaster : BizBase
    {
        [Required]
        [StringLength(100)]
        public string CompainStatusType { get; set; }

        public bool IsEnable { get; set; }

        public bool IsDeleted { get; set; }
    }
}
