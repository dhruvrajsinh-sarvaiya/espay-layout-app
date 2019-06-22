using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Referral;
using CleanArchitecture.Core.Enums;
using CleanArchitecture.Core.Interfaces.Referral;
using CleanArchitecture.Core.Interfaces.Repository;
using CleanArchitecture.Core.ViewModels.Referral;

namespace CleanArchitecture.Core.Interfaces.Referral
{
   public interface IReferralService
    {
        long AddReferralService(ReferralServiceViewModel model, long UserID);
        long UpdateReferralService(ReferralServiceUpdateViewModel model, long UserID);
        ReferralServiceUpdateViewModel GetReferralServiceById(long Id);
        ReferralServiceUpdateViewModel GetReferralService();
        ReferralServiceListResponse ListReferralService(int PageIndex = 0, int Page_Size = 0);
        bool DisableReferralService(ReferralServiceStatusViewModel model, long UserId);
        bool EnableReferralService(ReferralServiceStatusViewModel model, long UserId);
        List<ReferralServiceDropDownViewModel> DropDownReferralService(int PayTypeId);
        bool ReferralServiceExist(int ServiceId);
        long ReferralServiceId();
        Task<BizResponseClass> AddUpdateReferralSchemeTypeMapping(AddReferralSchemeTypeMappingReq request, long id);
        Task<BizResponseClass> ChangeReferralSchemeTypeMappingStatus(long id, ServiceStatus status, long UserId);
        Task<GetReferralSchemeTypeMappingRes> GetReferralSchemeTypeMappingById(long id);
        Task<ListReferralSchemeTypeMappingRes> ListReferralSchemeTypeMapping(long? payTypeId, long? serviceTypeMstId, short? status);
        Task<BizResponseClass> AddUpdateReferralServiceDetail(AddServiceDetail request, long id);
        Task<BizResponseClass> ChangeReferralServiceDetailStatus(long id, ServiceStatus status, int userid);
        Task<GetReferralServiceDetailRes> GetReferralServiceDetailByid(long id);
        Task<ListReferralServiceDetailRes> ReferralServiceDetail(long? schemeTypeMappingId, long? creditWalletTypeId, short? status);
    }
}
