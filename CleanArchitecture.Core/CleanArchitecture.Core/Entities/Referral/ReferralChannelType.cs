using CleanArchitecture.Core.SharedKernel;
using System.ComponentModel.DataAnnotations;


namespace CleanArchitecture.Core.Entities.Referral
{
   public class ReferralChannelType :BizBase
    {       
        [Required]
        [StringLength(100)]
        public string ChannelTypeName { get; set; }

        public int HourlyLimit { get; set; }
        public int DailyLimit { get; set; }
        public int WeeklyLimit { get; set; }
        public int MonthlyLimit { get; set; }
    }
}
