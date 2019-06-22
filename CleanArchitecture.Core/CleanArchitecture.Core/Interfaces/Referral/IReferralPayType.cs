using CleanArchitecture.Core.Entities.Referral;
using CleanArchitecture.Core.ViewModels.Referral;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralPayType
    {
        long AddReferralPayType(ReferralPayTypeViewModel model, long UserID);
        long UpdateReferralPayType(ReferralPayTypeUpdateViewModel model, long UserID);
        ReferralPayTypeUpdateViewModel GetReferralPayType(long Id);
        bool IsReferralPayTypeExist(string PayTypeName);
        List<ReferralPayTypeListViewModel> ListReferralPayType();
        List<ReferralPayTypeDropDownViewModel> DropDownReferralPayType();
        bool DisableReferralPayType(ReferralPayTypeStatusViewModel model, long UserId);
        bool EnableReferralPayType(ReferralPayTypeStatusViewModel model, long UserId);
    }
}
