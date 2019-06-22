﻿using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Login
{
    public class SocialLoginWithGoogleViewModel : TrackerViewModel
    {

        //[Required(ErrorMessage = "1,Please Enter Email Id,4007")]
        //[StringLength(50, ErrorMessage = "1,Please Enter Valid Email Id,4008")]
        //[RegularExpression(@"^[-a-zA-Z0-9~!$%^&*_=+}{\'?]+(\.[-a-zA-Z0-9~!$%^&*_=+}{\'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-zA-Z]{2,3})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$", ErrorMessage = "1,Please enter a valid Email Address,4009")]
        //public string Email { get; set; }
        [Required(ErrorMessage = "2,Please Enter ProviderKey,4092")]
        public string ProviderKey { get; set; }
        [Required(ErrorMessage = "3,Please Enter ProviderName,4093")]
        public string ProviderName { get; set; }
        [Required(ErrorMessage = "4,Please Enter access_token,4094")]
        public string access_token { get; set; }
        //public string refresh_token { get; set; }
        //public string token_type { get; set; }
        //public string expires_at { get; set; }
        //public string TicketCreated { get; set; }
    }

    public class SocialLoginGoogleResponse : BizResponseClass
    {
        public string Appkey { get; set; }
    }

}
