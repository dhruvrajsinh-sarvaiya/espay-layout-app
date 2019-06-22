using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.BackOfficeUser
{
    public class BackOfficeUserViewModel : TrackerViewModel
    {

        //[Required(ErrorMessage = "1,Please Enter Email Id,4007")]
        [StringLength(50, ErrorMessage = "1,Please Enter Valid Email Id,4008")]
        //[RegularExpression(@"^[-a-zA-Z0-9~!$%^&*_=+}{\'?]+(\.[-a-zA-Z0-9~!$%^&*_=+}{\'?]+)*@([a-zA-Z0-9_][-a-zA-Z0-9_]*(\.[-a-zA-Z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-zA-Z]{2,3})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$", ErrorMessage = "1,Please enter a valid Email Address,4009")]
        //[EmailAddress(ErrorMessage ="1,Please Enter Valid Email Id, 4009")]
        [Display(Name = "Email")]
        public string Email { get; set; }

        //[Required(ErrorMessage = "1,Please Enter Mobile Number,4012")]
        [Display(Name = "Mobile")]
        public string Mobile { get; set; }
        
        //[Required(ErrorMessage = "1,Please enter a User Name,4001")]
        //[Display(Name = "Username")]
        [StringLength(50, ErrorMessage = "1,Please enter a valid User Name,4002")]
        public string Username { get; set; }

        //[Required(ErrorMessage = "1,Please Enter First Name,4003")]
        [StringLength(50, ErrorMessage = "1,Please Enter Valid First Name,4004")]
        [Display(Name = "Firstname")]
        public string Firstname { get; set; }

        //[Required(ErrorMessage = "1,Please Enter Last Name,4005")]
        [StringLength(50, ErrorMessage = "1,Please Enter Valid Last Name,4006")]
        [Display(Name = "Lastname")]
        public string Lastname { get; set; }

        [Display(Name = "CountryCode")]
        [StringLength(5, ErrorMessage = "1,Please enter a valid Contry Code,4131")]
        public string CountryCode { get; set; }

       // [Required(ErrorMessage = "1,Please Provide PreferedLanguage,4185")]
        [StringLength(5, ErrorMessage = "1,Please enter a valid PreferedLanguage,4186")]
        public string PreferedLanguage { get; set; } = "en";
    }

    public class BackOfficeUserResponse : BizResponseClass
    {

    }

}
