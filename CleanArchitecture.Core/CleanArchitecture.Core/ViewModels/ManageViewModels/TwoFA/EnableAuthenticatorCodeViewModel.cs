using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.ManageViewModels.TwoFA
{
   public  class EnableAuthenticatorCodeViewModel
    {

       // public string UserName { get; set; }

        [Required(ErrorMessage = "1,Please enter a valid twoFa Code,4082")]
        [Display(Name = "Verification Code")]
        [StringLength(6, ErrorMessage = "1,Please enter a valid twoFa Code,4082")]        
        public string Code { get; set; }

        //[Required(ErrorMessage = "1,Please enter a 2FA key.,4095")]
        //[Display(Name = "TwoFAKey")]
        //public string TwoFAKey { get; set; }


    }

    public class TwoFACodeVerifyViewModel : TrackerViewModel
    {

        // public string UserName { get; set; }

        [Required(ErrorMessage = "1,Please enter a valid twoFa Code,4082")]
        [Display(Name = "Verification Code")]
        [StringLength(6, ErrorMessage = "1,Please enter a valid twoFa Code,4082")]
        public string Code { get; set; }

        [Required(ErrorMessage = "1,Please enter a 2FA key.,4095")]
        [Display(Name = "TwoFAKey")]
        public string TwoFAKey { get; set; }

        [Required(ErrorMessage = "1,Please enter a Allow Token.,4096")]
        [Display(Name = "AllowToken")]
        public string AllowToken { get; set; }
    }

    public class UserTwoFACodeVerifyViewModel 
    {

        // public string UserName { get; set; }

        [Required(ErrorMessage = "1,Please enter a valid twoFa Code,4082")]
        [Display(Name = "Verification Code")]
        [StringLength(6, ErrorMessage = "1,Please enter a valid twoFa Code,4082")]
        public string Code { get; set; }

        //[Required(ErrorMessage = "1,Please enter a 2FA key.,4095")]
        //[Display(Name = "TwoFAKey")]
        //public string TwoFAKey { get; set; }
    }
}
