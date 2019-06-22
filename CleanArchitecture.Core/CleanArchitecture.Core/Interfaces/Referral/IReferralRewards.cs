using System;
using System.Collections.Generic;
using System.Text;
using CleanArchitecture.Core.ViewModels.Referral;

namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralRewards
    {
        long AddReferralRewards(ReferralRewardsViewModel model, long UserID);
        ReferralRewardsListResponse ListAdminReferralRewards(int PageIndex = 0, int Page_Size = 0,  long ReferralServiceId = 0, int UserId = 0,int TrnUserId=0, DateTime? FromDate = null, DateTime? ToDate = null);
        ReferralRewardsListResponse ListUserReferralRewards(int UserId, int PageIndex = 0, int Page_Size = 0,  long ReferralServiceId = 0, int TrnUserId = 0,DateTime? FromDate = null, DateTime? ToDate = null);
    }
}
