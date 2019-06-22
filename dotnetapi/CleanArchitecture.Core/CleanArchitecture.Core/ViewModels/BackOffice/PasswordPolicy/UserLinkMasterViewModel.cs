using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.BackOffice.PasswordPolicy
{
    public class UserLinkMasterViewModel
    {
        public string UserLinkData { get; set; }
        public int UserId { get; set; }
        public int LinkvalidTime { get; set; }
    
    }
    public class UserLinkMasterUpdateViewModel
    {
        public Guid Id { get; set; }
        public string UserLinkData { get; set; }
        public int UserId { get; set; }
        public int LinkvalidTime { get; set; }

    }
}
