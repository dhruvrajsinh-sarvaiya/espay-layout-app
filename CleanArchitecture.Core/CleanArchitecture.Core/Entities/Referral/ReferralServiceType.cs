using CleanArchitecture.Core.SharedKernel;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.Entities.Referral
{
   public class ReferralServiceType :BizBase
    {       
        [Required]
        [StringLength(256)]
        public string ServiceTypeName { get; set; }
    }
}
