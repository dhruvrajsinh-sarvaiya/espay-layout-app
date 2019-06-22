using CleanArchitecture.Core.Entities.SignalR;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace CleanArchitecture.Core.Interfaces.FeedConfiguration
{
    public interface IFeedlimitcountQueue
    {
        void Enqueue(FeedLimitCounts Data);

        Task<FeedLimitCounts> DequeueAsync(CancellationToken cancellationToken);
    }
}
