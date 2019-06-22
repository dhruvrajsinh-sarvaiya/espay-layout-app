using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.User;
using CleanArchitecture.Core.ViewModels.APIConfiguration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.FeedConfiguration
{
    public interface IAPIConfigurationService
    {
        ViewAPIPlanDetailResponse ViewAPIPlanDetail(long UserID);
        ViewActivePlanDetailResponse ViewUserActivePlan(long UserID);
        GetAutoRenewDetailResponse GetAutoRenewDetail(long UserID);
        BizResponseClass StopAutoRenew(StopAutoRenewRequest Request, long UserID);
        Task<GenerateAPIKeyResponse> GenerateAPIKey(GenerateAPIKeyRequest Request, ApplicationUser user);
        BizResponseClass UpdateAPIKey(long KeyID, long UserID);
        BizResponseClass DeleteAPIKey(long KeyID, long UserID);
        BizResponseClass WhitelistIP(IPWhiteListRequest Request, long UserID);
        APIKeyListPResponse GetAPIKeyList(long APIId, long UserID);
        WhitelistIPListResponse GetWhitelistIP(long PlanId, long UserID, long? KeyID);
        UserAPIPlanHistoryResponse GetUserPlanHistory(UserAPIPlanHistoryRequest request, long UserID);
        BizResponseClass DeleteWhitelistIP(long IPId, long UserID);
        APIKeyListPResponseV2 GetAPIKeyByID(long KeyID, long UserID);


        BizResponseClass SetUserAPICustomeLimit(UserAPICustomeLimitRequest Request, long UserID);
        BizResponseClass UpdateUserAPICustomeLimit(UserAPICustomeLimitRequest Request, long UserID);
        BizResponseClass SetDefaultAPILimits(long LimitId);
        UserAPICustomeLimitResponse GetCustomeLimit(long SubscribeID, long UserID);

        
    }
}
