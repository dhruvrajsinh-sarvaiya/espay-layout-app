using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.NewWallet
{
    public class AutorizedApps : BizBase
    {
        [Required]
        [StringLength(100)]
        public string AppName { get; set; }

        [Required]
        [StringLength(100)]
        public string SiteURL { get; set; }

        [StringLength(100)]
        [Required]
        public string SecretKey { get; set; }
    }
}
