using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.APIConfiguration
{
    public class StopAutoRenewRequest
    {
        [Required]
        public long AutoRenewID { get; set; }
        [Required]
        public long SubscribeID { get; set; }
    }
}
