using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.APIConfiguration
{
    public class ManualRenewAPIPlanRequest
    {
        [Required]
        public long SubscribePlanID { get; set; }
        [Required]
        public short ChannelID { get; set; }
    }
}
