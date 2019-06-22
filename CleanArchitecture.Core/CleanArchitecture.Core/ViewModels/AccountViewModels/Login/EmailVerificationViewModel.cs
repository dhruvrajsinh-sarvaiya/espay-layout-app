using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Login
{
    public class EmailVerificationViewModel : TrackerViewModel
    {
        [Required(ErrorMessage = "1,Please Enter Email Id,4007")]
        [StringLength(50, ErrorMessage = "1,Please Enter Valid Email Id,4008")]
        //[EmailAddress]
        [RegularExpression(@"^[-a-zA-Z0-9~!$%^&*_=+}{\'?]+(\.[-a-zA-Z0-9~!$%^&*_=+}{\'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-zA-Z]{2,3})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$", ErrorMessage = "1,Please enter a valid Email Address,4009")]
        public string Email { get; set; }
    }

    public class EmailVerificationResponse : BizResponseClass
    {
       
    }
}
