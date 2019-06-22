﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.ViewModels.AccountViewModels.SignUp;

namespace CleanArchitecture.Core.Interfaces.User
{
    public partial interface IOtpMasterService
    {
        Task<OtpMasterViewModel> AddOtp(int UserId,string Email=null,string Mobile =null);
        Task<OtpMasterViewModel> GetOtpData(int Id);
        void UpdateOtp(long Id);
        Task<OtpMasterViewModel> AddOptionalOtp(int UserId, string Email = null, string Mobile = null);
        Task<OtpMasterViewModel> AddOtpForSignupuser(int UserId, string Email = null, string Mobile = null);
        void UpdateEmailAndMobileOTP(long id);
    }
}
