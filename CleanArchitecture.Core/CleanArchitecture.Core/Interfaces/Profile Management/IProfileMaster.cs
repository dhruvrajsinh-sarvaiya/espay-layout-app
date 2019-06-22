using CleanArchitecture.Core.ViewModels.Profile_Management;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Profile_Management
{
    public interface IProfileMaster
    {
        //List<ProfileMasterViewModel> GetIpHistoryListByUserId(long UserId, int pageIndex, int pageSize);
        List<ProfileMasterData> GetProfileData(int userid);
        List<SocialProfileModel> GetSocialProfileData(int userid = 0);
        bool GetSocialProfile(int ProfileId = 0);
        GetProfileDataResponse GetAllUserProfileData(int UserId =0,int PageIndex = 0, int Page_Size = 0);
    }
}
