using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.SignUp
{
    public class SignUpWithEmailViewModel : TrackerViewModel
    {        
        [Required(ErrorMessage = "1,Please Enter Email Id,4007")]
        [StringLength(50, ErrorMessage = "1,Please Enter Valid Email Id,4008")]
        [RegularExpression(@"^[-a-zA-Z0-9~!$%^&*_=+}{\'?]+(\.[-a-zA-Z0-9~!$%^&*_=+}{\'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-zA-Z]{2,3})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$", ErrorMessage = "1,Please enter a valid Email Address,4009")]
        //[EmailAddress(ErrorMessage ="1,Please Enter Valid Email Id, 4009")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        //[Required(ErrorMessage = "1,Please Provide PreferedLanguage,4185")]
        [StringLength(5, ErrorMessage = "1,Please enter a valid PreferedLanguage,4186")]
        public string PreferedLanguage { get; set; } = "en";
        public string ReferralCode { get; set; }
        public int ReferralServiceId { get; set; }
        public int ReferralChannelTypeId { get; set; }
    }

    public class SignUpWithEmailResponse : BizResponseClass
    {

    }
}
