using System;
using System.Collections.Generic;
using System.Text;
using CleanArchitecture.Core.SharedKernel;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities.Referral
{
   public class ReferralUserClick : BizBase
    {       
        public long UserId { get; set; } 
        
        public long ReferralServiceId { get; set; } 

        public long ReferralChannelTypeId { get; set; }

        public string IPAddress { get; set; } 
    }
}
