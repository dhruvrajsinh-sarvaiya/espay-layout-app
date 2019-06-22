using System;
using System.Collections.Generic;
using System.Text;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.ViewModels.Referral;

namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralChannel
    {
        long AddReferralChannel(ReferralChannelViewModel model, long UserID);        
        ReferralChannelListResponse ListAdminReferralChannelInvite(int PageIndex = 0, int Page_Size = 0, long ReferralChannelTypeId = 0, long ReferralPayTypeId = 0, long ReferralServiceId = 0, string UserName = null, DateTime? FromDate = null, DateTime? ToDate = null);       
        ReferralChannelListResponse ListAdminReferralChannelWithChannelType(long ReferralChannelTypeId, int PageIndex = 0, int Page_Size = 0, long ReferralPayTypeId = 0, long ReferralServiceId = 0, string UserName = null, DateTime? FromDate = null, DateTime? ToDate = null);
        ReferralChannelListResponse ListUserReferralChannelInvite(long UserId, int PageIndex = 0, int Page_Size = 0, long ReferralChannelTypeId = 0, long ReferralPayTypeId = 0, long ReferralServiceId = 0, DateTime? FromDate = null, DateTime? ToDate = null);
        ReferralChannelListResponse ListUserReferralChannelWithChannelType(long ReferralChannelTypeId, long UserId, int PageIndex = 0, int Page_Size = 0, long ReferralPayTypeId = 0, long ReferralServiceId = 0, DateTime? FromDate = null, DateTime? ToDate = null);
        ReferralChannelAllCountViewModel AllCountForAdminReferralChannel();
        ReferralChannelAllCountViewModel AllCountForUserReferralChannel(long UserID);
        int SendReferralEmail(SendReferralEmailRequest Request, ApplicationUser User);
        int SendReferralSMS(SendReferralSMSRequest Request, ApplicationUser User);
        ReferralUserClickViewModel AddReferralUserClick(AddReferralClickRequest Request);
        ReferralChannelShareURLViewModel GetReferralURL(ReferralChannelShareViewModel model, long UserId);
    }
}
