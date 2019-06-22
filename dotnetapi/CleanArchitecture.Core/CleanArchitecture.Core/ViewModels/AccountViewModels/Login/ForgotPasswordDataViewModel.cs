using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Login
{
 public   class ForgotPasswordDataViewModel
    {
        public Guid Id{ get; set; }
        public int LinkvalidTime { get; set; }
    }
}
