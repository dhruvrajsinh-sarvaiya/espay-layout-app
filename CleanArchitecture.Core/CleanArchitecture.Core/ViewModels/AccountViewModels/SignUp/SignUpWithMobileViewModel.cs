using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.SignUp
{
    public class SignUpWithMobileViewModel : TrackerViewModel
    {      
        [Required(ErrorMessage = "1,Please Enter Mobile Number, 4012")]
        [Phone(ErrorMessage = "1,Please Enter Valid Mobile Number, 4013")]
        //[StringLength(10, MinimumLength = 10, ErrorMessage = "1,Please Enter Valid Mobile Number, 4014")]
        //[Range(10, Int64.MaxValue)]
        public string Mobile { get; set; }
        [Required(ErrorMessage = "1,Please Provide country code,4132")]
        [Display(Name = "CountryCode")]
        [StringLength(5, ErrorMessage = "1,Please enter a valid Contry Code,4131")]
        public string CountryCode { get; set; }

        // [Required(ErrorMessage = "1,Please Provide PreferedLanguage,4185")]
        [StringLength(5, ErrorMessage = "1,Please enter a valid PreferedLanguage,4186")]
        public string PreferedLanguage { get; set; } = "en";
        public string ReferralCode { get; set; }
        public int ReferralServiceId { get; set; }
        public int ReferralChannelTypeId { get; set; }
    }

    public class SignUpWithMobileResponse : BizResponseClass
    {

    }
}
