using CleanArchitecture.Core.Entities.Referral;
using CleanArchitecture.Core.ViewModels.Referral;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.Referral
{
    public interface IReferralServiceType
    {
        long AddReferralServiceType(ReferralServiceTypeViewModel model, long UserID);
        long UpdateReferralServiceType(ReferralServiceTypeUpdateViewModel model, long UserID);
        ReferralServiceTypeUpdateViewModel GetReferralServiceType(long Id);
        bool IsReferralServiceTypeExist(string ServiceTypeName);
        List<ReferralServiceTypeListViewModel> ListReferralServiceType();
        List<ReferralServiceTypeDropDownViewModel> DropDownReferralServiceType();
        bool DisableReferralServiceType(ReferralServiceTypeStatusViewModel model, long UserId);
        bool EnableReferralServiceType(ReferralServiceTypeStatusViewModel model, long UserId);
    }
}
