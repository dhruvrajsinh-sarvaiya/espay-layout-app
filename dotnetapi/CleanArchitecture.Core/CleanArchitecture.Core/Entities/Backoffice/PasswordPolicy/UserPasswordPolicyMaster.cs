using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Backoffice.PasswordPolicy
{
 public   class UserPasswordPolicyMaster : BizBase
    {
        public int UserId { get; set; }
        public int PwdExpiretime { get; set; }
        public int MaxfppwdDay { get; set; }
        public int MaxfppwdMonth { get; set; }
        public int LinkExpiryTime { get; set; }
        public int OTPExpiryTime { get; set; }
    
    }
}
