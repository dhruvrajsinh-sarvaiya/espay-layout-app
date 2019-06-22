using CleanArchitecture.Core.ApiModels;
using CleanArchitecture.Core.Entities.SignalR;
using CleanArchitecture.Core.ViewModels.Configuration.FeedConfiguration;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Interfaces.FeedConfiguration
{
    public interface IExchangeFeedConfiguration
    {
        List<SocketFeedConfiguration> GetFeedConfigurations();
        List<SocketFeedLimits> GetFeedLimits();
        List<FeedLimitCounts> GetLimitCounts();
        void ReloadFeedLimitCount();
        void UpdateAndReloadFeedLimitCount(FeedLimitCounts Data);
        BizResponseClass CheckFeedLimit(short MethodID);
        BizResponseClass CheckFeedDataLimit(long DataSize, short MethodID);
        SocketMethodResponse GetSocketMethods();
        ExchangeLimitTypeResponse GetExchangeFeedLimitType();
        BizResponseClass AddFeedConfigurationLimit(SocketFeedLimitsRequest Request, long UserID);
        BizResponseClass UpdateFeedConfigurationLimit(SocketFeedLimitsRequest Request, long UserID);
        SocketFeedLimitsResponse GetAllFeedConfigurationLimit();
        SocketFeedLimitsListResponse GetSocketFeedLimitsLists();
        BizResponseClass AddSocketFeedConfig(SocketFeedConfigurationRequest Request, long UserID);
        BizResponseClass UpdateSocketFeedConfig(SocketFeedConfigurationRequest Request, long UserID);
        SocketFeedConfigResponse GetAllFeedConfiguration();
    }
}
