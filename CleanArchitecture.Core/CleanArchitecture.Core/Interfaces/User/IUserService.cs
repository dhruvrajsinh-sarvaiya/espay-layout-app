

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Configuration;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.ViewModels.AccountViewModels.IpWiseDataViewModel;
using CleanArchitecture.Core.ViewModels.AccountViewModels.Login;
using CleanArchitecture.Core.ViewModels.AccountViewModels.SignUp;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace CleanArchitecture.Core.Interfaces.User
{
    public interface IUserService
    {
        bool GetMobileNumber(string MobileNumber);
        long GenerateRandomOTP();
        Task<GetLoginWithMobileViewModel> FindByMobileNumber(string MobileNumber);
       // Task<TempUserRegister> FindByEmail(string Email);
        Task<bool> IsValidPhoneNumber(string Mobilenumber, string CountryCode);
        Task<string> GetCountryByIP(string ipAddress);
        Task<string> GetLocationByIP(string ipAddress);
        Task<IPWiseDataViewModel> GetIPWiseData(string ipAddress);  
        //IPWiseDataViewModel GetIPWiseData(string ipAddress);
        string GenerateRandomOTPWithPassword(PasswordOptions opts = null);
        SocialCustomPasswordViewMoel GenerateRandomSocialPassword(string ProvideKey);
        Task<ApplicationUser> FindUserDataByUserNameEmailMobile(string UserName);
        List<GetUserData> GetAllUserData();
        string GenerateRandomPassword(PasswordOptions opts = null);
        DateTime GetUserJoiningDate(long UserId);
        bool GetUserById(long UserId);
        bool CheckMobileNumberExists(string MobileNumber);
        ApplicationUser GetUserDataById(long UserId);

        //khushali 04-04-2019 Move from CleanArchitecture/Web/API/ManageController TO  UserService
        ApplicationUserPhotos GetUserPhoto(long UserId);
        Task<BizResponseClass> PostUserPhotoAsync(IFormFile file, int UserId);
        LanguagePreferenceMaster GetLanguagePreferenceMaster(string PreferedLanguage);
    }
}
