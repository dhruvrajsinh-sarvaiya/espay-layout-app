using CleanArchitecture.Core.ApiModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchitecture.Core.ViewModels.Configuration.FeedConfiguration
{
    public class SocketMethodViewModel
    {
        public long ID { get; set; }
        public string MethodName { get; set; }
        public string ReturnMethodName { get; set; }
        public short PublicOrPrivate { get; set; }
        public short EnumCode { get; set; }
        public short Status { get; set; }
    }
    public class SocketMethodResponse: BizResponseClass
    {
        public List<SocketMethodViewModel> Response { get; set; }
    }

    public class ExchangeLimitTypeResponse : BizResponseClass
    {
        public List<ExchangeLimitType> Response { get; set; }
    }
    public class ExchangeLimitType
    {
        public long ID { get; set; }
        public string LimitType { get; set; }

    }
}
