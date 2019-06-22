using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CleanArchitecture.Core.ViewModels.Referral;
using Microsoft.AspNetCore.Identity;


namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralUserClick
    {
        ReferralUserClickListResponse ListAdminReferralUserClick(int PageIndex = 0, int Page_Size = 0, long ReferralChannelTypeId = 0,long ReferralServiceId = 0, string UserName = null, DateTime? FromDate = null, DateTime? ToDate = null);
        ReferralUserClickListResponse ListUserReferralUserClick(int UserId, int PageIndex = 0, int Page_Size = 0, long ReferralChannelTypeId = 0, long ReferralServiceId = 0, DateTime? FromDate = null, DateTime? ToDate = null);
    }
}
