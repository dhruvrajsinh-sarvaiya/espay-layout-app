using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.SignalR
{
    public class SocketFeedConfiguration : BizBase
    {
        public long MethodID { get; set; }
        public long FeedLimitID { get; set; }
    }
}
