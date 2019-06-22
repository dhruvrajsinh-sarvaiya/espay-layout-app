using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.Backoffice.PasswordPolicy
{
   public class UserLinkMaster : BizBaseExtended
    {
        public string UserLinkData { get; set; }
        public int UserId { get; set; }
        public int LinkvalidTime { get; set; }
    }
}
