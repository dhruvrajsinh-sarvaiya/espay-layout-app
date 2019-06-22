using CleanArchitecture.Core.ViewModels.AccountViewModels.Affiliate;
using CleanArchitecture.Core.ViewModels.BackOfficeAffiliate;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.Repository
{
    public interface IAffiliateBackOfficeRepository
    {
        AffiliateDashboardCount GetAffiliateDashboardCount();
        List<GetAffiateUserRegisteredData> GetAffiateUserRegistered(string FromDate, string ToDate, int Status, int SchemeType, long ParentId, string SCondition, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<GetReferralLinkClickData> GetReferralLinkClick(string FromDate, string ToDate, long UserId, string SCondition, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<GetFacebookLinkClickData> GetFacebookLinkClick(string FromDate, string ToDate, long UserId, string SCondition, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<GetTwitterLinkClickData> GetTwitterLinkClick(string FromDate, string ToDate, long UserId, string SCondition, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<GetEmailSentData> GetEmailSent(string FromDate, string ToDate, long UserId, string SCondition, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<GetSMSSentData> GetSMSSent(string FromDate, string ToDate, long UserId, string SCondition, int PageSize, int PageNo, ref long TotalCount, ref int PageSize1, ref long TotalPages);
        List<GetAllAffiliateUserData> GetAllAffiliateUser();
        List<GetAllAffiliateSchemeMasterRes> GetAffiliateSchemeMasterdata();
        List<GetAllAffiliateSchemeTypeMasterRes> GetAffiliateSchemeTypeMasterdata();
        List<GetAllAffiliatePromotionMasterRes> ListAffiliatePromotion();
        AffiliateSchemeTypeMappingListViewModel GetSchemeTypeMappingData(long id);
        List<AffiliateSchemeTypeMappingListViewModel> ListSchemeTypeMappingData();
        List<GetAffiliateShemeDetailRes> ListAffiliateSchemeDetail();   
        GetAffiliateShemeDetailRes GetAffiliateSchemeDetail(long Id);
        int GetRange(decimal MaxRange, decimal MinRange, long SchemeMappingId);
        List<AffiliateCommissionHistoryReport> AffiliateCommissionHistoryReport(int PageNo, int PageSize, DateTime? FromDate, DateTime? ToDate, long? TrnUserId, long? AffiliateUserId, long? SchemeMappingId, long? TrnRefNo,ref int TotalCount);
        InviteFrdClaas GetAffiliateInviteFrieds();
        GetMonthWiseCommissionDataV1 GetMonthWiseCommissionChartDetail(int? Year);
    }
}
