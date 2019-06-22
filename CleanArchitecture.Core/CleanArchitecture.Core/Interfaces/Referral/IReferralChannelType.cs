using CleanArchitecture.Core.Entities.Referral;
using CleanArchitecture.Core.ViewModels.Referral;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralChannelType
    {
        long AddReferralChannelType(ReferralChannelTypeViewModel model, long UserID);
        long UpdateReferralChannelType(ReferralChannelTypeUpdateViewModel model, long UserID);
        ReferralChannelTypeUpdateViewModel GetReferralChannelType(long Id);
        bool IsReferralChannelTypeExist(string ChannelTypeName);
        List<ReferralChannelTypeListViewModel> ListReferralChannelType();
        List<ReferralChannelTypeDropDownViewModel> DropDownReferralChannelType();
        bool DisableReferralChannelType(ReferralChannelTypeStatusViewModel model, long UserId);
        bool EnableReferralChannelType(ReferralChannelTypeStatusViewModel model, long UserId);
        bool IsReferralChannelTypeExistById(int ChannelTypeId);
    }
}
