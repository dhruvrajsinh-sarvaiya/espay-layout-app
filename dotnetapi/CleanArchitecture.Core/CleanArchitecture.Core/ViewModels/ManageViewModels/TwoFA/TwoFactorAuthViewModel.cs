﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.ManageViewModels
{
    public class TwoFactorAuthViewModel : TrackerViewModel
    {
        public string MobileNo { get; set; }
        public int TxnPin { get; set; }
        public string TwoFAQRKey { get; set; }
        public string TwoFAAuthCode { get; set; }
        public string TwoFAUserCode { get; set; }

    }
    public class TwoFactorAuthResponse : BizResponseClass
    {

    }
}
