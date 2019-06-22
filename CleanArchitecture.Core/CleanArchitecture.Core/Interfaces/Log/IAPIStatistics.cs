using CleanArchitecture.Core.Entities.Configuration.FeedConfiguration;

namespace CleanArchitecture.Core.Interfaces.Log
{
    public interface IAPIStatistics
    {
        long APIReqResStatistics(APIReqResStatistics model);
        long PublicAPIReqResLog(PublicAPIReqResLog model);
    }
}
