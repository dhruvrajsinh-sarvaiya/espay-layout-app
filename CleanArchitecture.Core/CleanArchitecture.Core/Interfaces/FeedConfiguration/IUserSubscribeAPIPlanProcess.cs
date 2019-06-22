using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.Configuration.FeedConfiguration;
using CleanArchitecture.Core.ViewModels.APIConfiguration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.FeedConfiguration
{

    public interface IUserSubscribeAPIPlanProcess
    {
        Task<BizResponseClass> UserAPIPlanSubscribe(UserAPIPlanSubscribeRequest Request, long UserID);
        Task<BizResponseClass> APIPlanAutoRenewProcess(AutoRenewPlanRequest request, long UserID);
        Task<BizResponseClass> ManualRenewAPIPlan(ManualRenewAPIPlanRequest request, long UserID);
        Task<BizResponseClass> StopAutoRenewProcess(StopAutoRenewRequest request, long UserID);
        Task<BizResponseClass> PlanAutoRenewEntry(UserSubscribeAPIPlan Obj);
    }
}
