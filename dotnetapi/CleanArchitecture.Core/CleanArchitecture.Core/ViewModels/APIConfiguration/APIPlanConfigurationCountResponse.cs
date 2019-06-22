using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.APIConfiguration
{
    public class APIPlanConfigurationCountResponse : BizResponseClass
    {
        public APIPlanConfigurationCountQryRes Response { get; set; }
    }
    public class APIPlanConfigurationCountQryRes
    {
        public long APIPlanCount { get; set; }
        public long SubscriptionCount { get; set; }
        public long PlanConfigHistoryCount { get; set; }
        public long KeyCount { get; set; }
        public long APIKeyPolicyCount { get; set; }
        public long APIMethodCount { get; set; }
    }
}
