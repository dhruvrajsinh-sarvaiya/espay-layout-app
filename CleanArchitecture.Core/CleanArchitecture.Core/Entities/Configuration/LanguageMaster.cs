using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Configuration
{
    public class LanguageMaster : BizBaseExtended
    {
        [Required]
        [StringLength(100)]

        public string Languagename { get; set; }
    }
}
