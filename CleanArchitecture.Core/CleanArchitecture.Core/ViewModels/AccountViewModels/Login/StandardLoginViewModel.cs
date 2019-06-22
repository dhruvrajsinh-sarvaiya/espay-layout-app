using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.ViewModels.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels.Login
{
    public class StandardLoginViewModel : TrackerViewModel
    {
        [Required(ErrorMessage = "1,Please enter a User Name,4001")]
        [Display(Name = "Username")]
        [StringLength(50, ErrorMessage = "1,Please enter a valid User Name,4002")]
        public string Username { get; set; }

        [Required(ErrorMessage = "1,Please Enter Password,4010")]
        [DataType(DataType.Password)]
        [StringLength(50, ErrorMessage = "1,The {0} must be at least {2} and at max {1} characters long,4011", MinimumLength = 6)]
        [Display(Name = "Password")]
        //[RegularExpression("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$", ErrorMessage = "1,Passwords must be at least 6 characters and contain at 3 of 4 of the following: upper case (A-Z) lower case (a-z) number (0-9) and special character (e.g. !@#$%^&*),4028")]
        [RegularExpression("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$", ErrorMessage = "1,Please Enter valid username or Password,4028")] // khushali 05-04-2019 chnage message at sigin time 
        public string Password { get; set; }

        // public bool RememberMe { get; set; }
    }

    public class StandardLoginResponse : BizResponseClass
    {
        public string PreferedLanguage { get; set; }
    }

    public class StandardLogin2FAResponse : BizResponseClass
    {
        public string TwoFAToken { get; set; }
        public string AllowToken { get; set; }
    }
    public class StandardLoginAuthorizeFailResponse : BizResponseClass
    {
        public string AllowAuthorizeToken { get; set; }
    }

    public class StandardSuccessLoginResponse : BizResponseClass
    {
        public bool Thememode { get; set; }
        public string PreferedLanguage { get; set; }
    }

    public class GetUserData
    {
        public int Id { get; set; }
        public string UserName { get; set; }
    }

    public class GetUserDataResponse : BizResponseClass
    {
        public List<GetUserData> GetUserData { get; set; }
    }


}
