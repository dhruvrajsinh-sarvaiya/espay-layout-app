using CleanArchitecture.Core.ApiModels;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Core.ViewModels.AccountViewModels
{
    public class LoginViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public bool RememberMe { get; set; }

        //public  TrackerViewModel trackerViewModel { get; set; }
    }
    public class LoginResponse  : BizResponseClass
    {
        public string PreferedLanguage { get; set; }
    }
}
