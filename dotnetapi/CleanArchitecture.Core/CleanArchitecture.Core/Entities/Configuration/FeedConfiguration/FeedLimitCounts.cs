using CleanArchitecture.Core.SharedKernel;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.Entities.SignalR
{
    public class FeedLimitCounts : BizBase
    {
        public long MethodID { get; set; }
        public long LimitCount { get; set; }
        public long UserID { get; set; }
    }
}
