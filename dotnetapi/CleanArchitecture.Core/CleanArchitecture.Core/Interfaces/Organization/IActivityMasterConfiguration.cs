using CleanArchitecture.Core.Entities.Complaint;
using CleanArchitecture.Core.Entities.Organization;
using CleanArchitecture.Core.Entities.Profile_Management;
using CleanArchitecture.Core.Entities.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Organization
{
    public interface IActivityMasterConfiguration
    {
        List<Typemaster> GetTypeMasterData();
        List<HostURLMaster> GetHostURLData();
        List<ActivityType_Master> GetActivityTypeData();
        List<ApplicationUser> GetAlluserData();
        List<ComplainStatusTypeMaster> GetComplainStatus();
        List<ApplicationMaster> GetMasterApplicationData();
        List<ProfileMaster> GetMasterProfileData();
        List<ProfileLevelMaster> GetMasterProfileLevelData();
        List<SubscriptionMaster> GetUserSubscription();
    }
}
