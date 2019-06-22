using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.Entities.Referral
{
    public class ReferralUserLevelMapping : BizBase
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public long ReferUserId { get; set; }

        [Required]
        public long Level { get; set; }

        [Required]
        public short IsCommissionCredited { get; set; }//1-credited

        [DefaultValue(0)]
        public short IsTradingCommissionCredited { get; set; }//1-credited
    }
}
