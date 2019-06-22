using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Login
{
    public class LoginStepViewModel
    {
        public bool EmailConfirmed { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
    }

    public class LoginStepResponse : BizResponseClass
    {
        public LoginStepViewModel LoginStepProcess { get; set; }
    }

}
