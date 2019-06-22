using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities
{
    public class ErrorInfo:BizBase
    {
        [Required]
        [StringLength(50)]
        public string FunctionName { get; set; }

        [Required]
        public long RefNo { get; set; }

        [Required]
        [StringLength(500)]
        public string ErrorMsg { get; set; } 
    }
}
