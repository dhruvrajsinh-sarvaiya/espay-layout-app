using System.ComponentModel.DataAnnotations;
using CleanArchitecture.Core.SharedKernel;

namespace CleanArchitecture.Core.Entities.Referral
{
   public class ReferralPayType : BizBase
    {       
        [Required]
        [StringLength(50)]
        public string PayTypeName { get; set; }
    }
}
